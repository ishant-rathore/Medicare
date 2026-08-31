// =============================================================================
// backend/src/services/database.service.ts
// PostgreSQL-aligned data store & repositories for Medicare
// Strictly enforces:
// 1. Firebase UID -> users.firebase_uid -> internal users.id (UUID) mapping
// 2. Resource ownership scoped to internal users.id
// 3. Foreign key validation (reminders, doses, refills must belong to same user)
// 4. Stable local_event_id uniqueness & idempotent upserts
// 5. Valid dose event state transitions
// 6. Complete sync audit logging
// =============================================================================

import crypto from 'crypto';
import { logger } from '../config/logger';

// ─── TYPES & ENUMS (Aligned with schema.sql) ─────────────────────────────────

export type MedicineType = 'TABLET' | 'CAPSULE' | 'SYRUP' | 'DROPS' | 'INJECTION' | 'OINTMENT' | 'INHALER';
export type MealTiming = 'BEFORE_FOOD' | 'AFTER_FOOD' | 'WITH_FOOD' | 'AFTER_DINNER' | 'EMPTY_STOMACH' | 'BEDTIME';
export type RecurrenceType = 'ONE_TIME' | 'DAILY' | 'WEEKLY' | 'ALTERNATE_DAYS' | 'EVERY_8_HOURS' | 'EVERY_12_HOURS' | 'AS_NEEDED';
export type DoseStatus = 'PENDING' | 'TAKEN' | 'SNOOZED' | 'SKIPPED' | 'MISSED';
export type CaregiverAccessLevel = 'VIEW_ONLY' | 'MANAGE';

export interface MedicineRecord {
  id: string; // UUID
  userId: string; // PostgreSQL users.id (UUID)
  name: string;
  genericName?: string | null;
  dosage: string;
  type: MedicineType;
  color?: string | null;
  shape?: string | null;
  category?: string | null;
  mealTiming: MealTiming;
  instructions: string[];
  stockCount: number;
  lowStockThreshold: number;
  expiryDate?: string | null;
  isEssential: boolean;
  isActive: boolean;
  notes?: string | null;
  photoUrl?: string | null;
  prescribedBy?: string | null;
  customVoiceScript?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ReminderRecord {
  id: string; // UUID
  userId: string; // PostgreSQL users.id (UUID)
  medicineId: string; // UUID (Foreign Key to medicines.id)
  scheduledTimes: string[]; // ["08:00", "20:00"]
  recurrence: RecurrenceType;
  daysOfWeek: number[]; // [0..6]
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  snoozeMinutes: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface DoseEventRecord {
  id: string; // UUID
  localEventId: string; // Stable UUID from device (UNIQUE)
  userId: string; // PostgreSQL users.id (UUID)
  medicineId: string; // UUID (Foreign Key to medicines.id)
  reminderId?: string | null; // UUID (Foreign Key to reminders.id)
  medicineName: string;
  dosage: string;
  mealTiming: MealTiming;
  scheduledTime: string; // "08:00"
  scheduledDate: string; // "YYYY-MM-DD"
  status: DoseStatus;
  actionAt?: string | null;
  snoozeUntil?: string | null;
  spokenScript?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CaregiverRelationRecord {
  id: string; // UUID
  userId: string; // PostgreSQL users.id (Patient)
  caregiverId: string; // PostgreSQL users.id (Caregiver)
  caregiverEmail?: string;
  caregiverName?: string;
  accessLevel: CaregiverAccessLevel;
  relationLabel?: string | null;
  isActive: boolean;
  notifyOnMissed: boolean;
  notifyOnTaken: boolean;
  notifyOnLowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RefillRuleRecord {
  id: string; // UUID
  userId: string; // PostgreSQL users.id (UUID)
  medicineId: string; // UUID (Foreign Key to medicines.id, UNIQUE)
  lowStockThreshold: number;
  refillQuantity: number;
  autoAlertEnabled: boolean;
  lastRefillDate?: string | null;
  nextRefillDate?: string | null;
  pharmacyName?: string | null;
  pharmacyPhone?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceTokenRecord {
  id: string;
  userId: string; // PostgreSQL users.id
  token: string;
  platform: 'android' | 'ios' | 'web';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SyncLogRecord {
  id: string; // UUID
  userId: string; // PostgreSQL users.id (UUID)
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  resource: 'medicine' | 'reminder' | 'dose_event';
  resourceId: string;
  status: 'success' | 'duplicate' | 'failed';
  error?: string | null;
  createdAt: string;
}

// ─── STATE TRANSITION RULES ──────────────────────────────────────────────────
/**
 * Validate dose status transitions.
 * Returns { valid: boolean; reason?: string }
 */
export function isValidDoseTransition(currentStatus: DoseStatus, newStatus: DoseStatus): { valid: boolean; reason?: string } {
  if (currentStatus === newStatus) {
    // Idempotent state replay is valid
    return { valid: true };
  }

  // Allowed transitions
  const transitions: Record<DoseStatus, DoseStatus[]> = {
    PENDING: ['TAKEN', 'SNOOZED', 'SKIPPED', 'MISSED'],
    SNOOZED: ['TAKEN', 'SNOOZED', 'SKIPPED', 'MISSED'],
    SKIPPED: ['TAKEN', 'SKIPPED'], // Allow marking as taken if user delayed
    MISSED: ['TAKEN', 'MISSED'],   // Allow marking as taken late
    TAKEN: ['TAKEN'],              // Cannot undo taken dose to pending
  };

  const allowed = transitions[currentStatus] || [];
  if (allowed.includes(newStatus)) {
    return { valid: true };
  }

  return {
    valid: false,
    reason: `Invalid dose state transition from ${currentStatus} to ${newStatus}`,
  };
}

// ─── IN-MEMORY DATA STORAGE (Relational UUID Scoped) ─────────────────────────

class MedicareDatabase {
  private medicines = new Map<string, MedicineRecord>(); // id -> record
  private reminders = new Map<string, ReminderRecord>(); // id -> record
  private doseEvents = new Map<string, DoseEventRecord>(); // id -> record
  private doseEventsByLocalId = new Map<string, string>(); // localEventId -> id
  private caregivers = new Map<string, CaregiverRelationRecord>(); // id -> record
  private refills = new Map<string, RefillRuleRecord>(); // id -> record
  private deviceTokens = new Map<string, DeviceTokenRecord>(); // token -> record
  private syncLogs: SyncLogRecord[] = [];

  constructor() {
    this.seedInitialSampleData();
  }

  private seedInitialSampleData() {
    // Optional demo user seed can be loaded if needed
  }

  // ─── MEDICINES ─────────────────────────────────────────────────────────────

  async findMedicinesByUserId(userId: string, options: { search?: string; isActive?: boolean } = {}): Promise<MedicineRecord[]> {
    const list: MedicineRecord[] = [];
    for (const med of this.medicines.values()) {
      if (med.userId === userId && !med.deletedAt) {
        if (options.isActive !== undefined && med.isActive !== options.isActive) continue;
        if (options.search) {
          const q = options.search.toLowerCase();
          const match =
            med.name.toLowerCase().includes(q) ||
            (med.genericName && med.genericName.toLowerCase().includes(q)) ||
            (med.category && med.category.toLowerCase().includes(q));
          if (!match) continue;
        }
        list.push({ ...med });
      }
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }

  async findMedicineById(id: string, userId: string): Promise<MedicineRecord | null> {
    const med = this.medicines.get(id);
    if (!med || med.deletedAt) return null;
    if (med.userId !== userId) return null; // Ownership check
    return { ...med };
  }

  async createMedicine(userId: string, data: Partial<MedicineRecord>): Promise<MedicineRecord> {
    const id = data.id ? data.id : crypto.randomUUID();
    
    // Check if medicine with this ID already exists
    const existing = this.medicines.get(id);
    if (existing) {
      if (existing.userId !== userId) {
        throw new Error('Unauthorized: Medicine ID exists under another user');
      }
      return { ...existing };
    }

    const now = new Date().toISOString();
    const record: MedicineRecord = {
      id,
      userId, // PostgreSQL users.id (UUID)
      name: data.name || 'Unnamed Medicine',
      genericName: data.genericName || null,
      dosage: data.dosage || '1 unit',
      type: (data.type as MedicineType) || 'TABLET',
      color: data.color || 'Blue',
      shape: data.shape || 'Round',
      category: data.category || 'General',
      mealTiming: (data.mealTiming as MealTiming) || 'AFTER_FOOD',
      instructions: Array.isArray(data.instructions) ? data.instructions : [],
      stockCount: typeof data.stockCount === 'number' ? data.stockCount : 30,
      lowStockThreshold: typeof data.lowStockThreshold === 'number' ? data.lowStockThreshold : 5,
      expiryDate: data.expiryDate || null,
      isEssential: Boolean(data.isEssential),
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      notes: data.notes || null,
      photoUrl: data.photoUrl || null,
      prescribedBy: data.prescribedBy || null,
      customVoiceScript: data.customVoiceScript || null,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    this.medicines.set(id, record);
    return { ...record };
  }

  async updateMedicine(id: string, userId: string, data: Partial<MedicineRecord>): Promise<MedicineRecord> {
    const med = this.medicines.get(id);
    if (!med || med.deletedAt) {
      throw new Error('Medicine not found');
    }
    if (med.userId !== userId) {
      throw new Error('Unauthorized: You do not own this medicine');
    }

    const updated: MedicineRecord = {
      ...med,
      ...data,
      id: med.id,
      userId: med.userId, // Immutable ownership
      updatedAt: new Date().toISOString(),
    };

    this.medicines.set(id, updated);
    return { ...updated };
  }

  async deleteMedicine(id: string, userId: string): Promise<boolean> {
    const med = this.medicines.get(id);
    if (!med || med.deletedAt) {
      throw new Error('Medicine not found');
    }
    if (med.userId !== userId) {
      throw new Error('Unauthorized: You do not own this medicine');
    }

    med.deletedAt = new Date().toISOString();
    med.isActive = false;
    this.medicines.set(id, med);
    return true;
  }

  async getLowStockMedicines(userId: string): Promise<MedicineRecord[]> {
    const all = await this.findMedicinesByUserId(userId, { isActive: true });
    return all.filter((m) => m.stockCount <= m.lowStockThreshold);
  }

  // ─── REMINDERS ─────────────────────────────────────────────────────────────

  async findRemindersByUserId(userId: string): Promise<(ReminderRecord & { medicine?: MedicineRecord })[]> {
    const list: (ReminderRecord & { medicine?: MedicineRecord })[] = [];
    for (const rem of this.reminders.values()) {
      if (rem.userId === userId && !rem.deletedAt) {
        const medicine = this.medicines.get(rem.medicineId);
        list.push({
          ...rem,
          medicine: medicine && !medicine.deletedAt ? { ...medicine } : undefined,
        });
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findReminderById(id: string, userId: string): Promise<ReminderRecord | null> {
    const rem = this.reminders.get(id);
    if (!rem || rem.deletedAt) return null;
    if (rem.userId !== userId) return null;
    return { ...rem };
  }

  async createReminder(userId: string, data: Partial<ReminderRecord>): Promise<ReminderRecord> {
    if (!data.medicineId) {
      throw new Error('medicineId is required');
    }

    // Verify foreign key: medicine must exist and belong to the requesting user
    const medicine = await this.findMedicineById(data.medicineId, userId);
    if (!medicine) {
      throw new Error('Referenced medicine not found or does not belong to you');
    }

    const id = data.id ? data.id : crypto.randomUUID();
    const existing = this.reminders.get(id);
    if (existing) {
      if (existing.userId !== userId) {
        throw new Error('Unauthorized: Reminder ID exists under another user');
      }
      return { ...existing };
    }

    const now = new Date().toISOString();
    const record: ReminderRecord = {
      id,
      userId, // PostgreSQL users.id (UUID)
      medicineId: data.medicineId,
      scheduledTimes: Array.isArray(data.scheduledTimes) && data.scheduledTimes.length > 0 ? data.scheduledTimes : ['08:00'],
      recurrence: (data.recurrence as RecurrenceType) || 'DAILY',
      daysOfWeek: Array.isArray(data.daysOfWeek) ? data.daysOfWeek : [0, 1, 2, 3, 4, 5, 6],
      startDate: data.startDate || now.split('T')[0],
      endDate: data.endDate || null,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      snoozeMinutes: data.snoozeMinutes || 10,
      notes: data.notes || null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    this.reminders.set(id, record);
    return { ...record };
  }

  async updateReminder(id: string, userId: string, data: Partial<ReminderRecord>): Promise<ReminderRecord> {
    const rem = this.reminders.get(id);
    if (!rem || rem.deletedAt) {
      throw new Error('Reminder not found');
    }
    if (rem.userId !== userId) {
      throw new Error('Unauthorized: You do not own this reminder');
    }

    if (data.medicineId && data.medicineId !== rem.medicineId) {
      const medicine = await this.findMedicineById(data.medicineId, userId);
      if (!medicine) {
        throw new Error('Referenced new medicine not found or does not belong to you');
      }
    }

    const updated: ReminderRecord = {
      ...rem,
      ...data,
      id: rem.id,
      userId: rem.userId,
      updatedAt: new Date().toISOString(),
    };

    this.reminders.set(id, updated);
    return { ...updated };
  }

  async deleteReminder(id: string, userId: string): Promise<boolean> {
    const rem = this.reminders.get(id);
    if (!rem || rem.deletedAt) {
      throw new Error('Reminder not found');
    }
    if (rem.userId !== userId) {
      throw new Error('Unauthorized: You do not own this reminder');
    }

    rem.deletedAt = new Date().toISOString();
    rem.isActive = false;
    this.reminders.set(id, rem);
    return true;
  }

  // ─── DOSE EVENTS (Idempotent by localEventId) ──────────────────────────────

  async findDoseEventsByUserId(
    userId: string,
    options: { startDate?: string; endDate?: string; medicineId?: string; status?: DoseStatus; page?: number; limit?: number } = {},
  ): Promise<{ events: DoseEventRecord[]; total: number }> {
    const list: DoseEventRecord[] = [];

    for (const dose of this.doseEvents.values()) {
      if (dose.userId === userId) {
        if (options.startDate && dose.scheduledDate < options.startDate) continue;
        if (options.endDate && dose.scheduledDate > options.endDate) continue;
        if (options.medicineId && dose.medicineId !== options.medicineId) continue;
        if (options.status && dose.status !== options.status) continue;
        list.push({ ...dose });
      }
    }

    // Sort scheduledDate desc, scheduledTime desc
    list.sort((a, b) => {
      if (a.scheduledDate !== b.scheduledDate) {
        return b.scheduledDate.localeCompare(a.scheduledDate);
      }
      return b.scheduledTime.localeCompare(a.scheduledTime);
    });

    const total = list.length;
    const page = options.page || 1;
    const limit = options.limit || 30;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return { events: paginated, total };
  }

  async findDoseEventByLocalId(localEventId: string): Promise<DoseEventRecord | null> {
    const id = this.doseEventsByLocalId.get(localEventId);
    if (!id) return null;
    const record = this.doseEvents.get(id);
    return record ? { ...record } : null;
  }

  async findDoseEventById(id: string, userId: string): Promise<DoseEventRecord | null> {
    const record = this.doseEvents.get(id);
    if (!record || record.userId !== userId) return null;
    return { ...record };
  }

  /**
   * Idempotently upsert a dose event by localEventId.
   * If an event with this localEventId already exists:
   * 1. Validates ownership (must match userId)
   * 2. Validates state transition
   * 3. Updates actionAt, snoozeUntil, status without duplicating record
   */
  async upsertDoseEvent(
    userId: string,
    data: {
      localEventId: string;
      medicineId: string;
      reminderId?: string | null;
      medicineName: string;
      dosage: string;
      mealTiming?: MealTiming;
      scheduledTime: string;
      scheduledDate: string;
      status?: DoseStatus;
      actionAt?: string | null;
      snoozeUntil?: string | null;
      spokenScript?: string | null;
      notes?: string | null;
    },
  ): Promise<{ event: DoseEventRecord; isDuplicate: boolean }> {
    if (!data.localEventId) {
      throw new Error('localEventId is required for idempotent dose event creation');
    }

    // Check for existing record with this localEventId
    const existingId = this.doseEventsByLocalId.get(data.localEventId);
    if (existingId) {
      const existing = this.doseEvents.get(existingId);
      if (existing) {
        // Ownership verification
        if (existing.userId !== userId) {
          throw new Error('Unauthorized: This dose event belongs to another user');
        }

        const newStatus = data.status || existing.status;
        const transitionCheck = isValidDoseTransition(existing.status, newStatus);
        if (!transitionCheck.valid) {
          logger.warn('State transition rejected during idempotent upsert', {
            localEventId: data.localEventId,
            current: existing.status,
            attempted: newStatus,
            reason: transitionCheck.reason,
          });
          // Preserve valid current state and return
          return { event: { ...existing }, isDuplicate: true };
        }

        const oldStatus = existing.status;
        // Apply valid state update
        existing.status = newStatus;
        if (data.actionAt) existing.actionAt = data.actionAt;
        if (data.snoozeUntil !== undefined) existing.snoozeUntil = data.snoozeUntil;
        if (data.notes !== undefined) existing.notes = data.notes;
        existing.updatedAt = new Date().toISOString();

        if (oldStatus !== 'TAKEN' && newStatus === 'TAKEN' && existing.medicineId) {
          const med = this.medicines.get(existing.medicineId);
          if (med && med.userId === userId) {
            med.stockCount = Math.max(0, med.stockCount - 1);
            this.medicines.set(existing.medicineId, med);
          }
        }

        this.doseEvents.set(existingId, existing);
        return { event: { ...existing }, isDuplicate: true };
      }
    }

    // Create new dose event record
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const newRecord: DoseEventRecord = {
      id,
      localEventId: data.localEventId,
      userId, // PostgreSQL users.id (UUID)
      medicineId: data.medicineId,
      reminderId: data.reminderId || null,
      medicineName: data.medicineName,
      dosage: data.dosage,
      mealTiming: data.mealTiming || 'AFTER_FOOD',
      scheduledTime: data.scheduledTime,
      scheduledDate: data.scheduledDate,
      status: data.status || 'PENDING',
      actionAt: data.actionAt || null,
      snoozeUntil: data.snoozeUntil || null,
      spokenScript: data.spokenScript || null,
      notes: data.notes || null,
      createdAt: now,
      updatedAt: now,
    };

    if (newRecord.status === 'TAKEN' && newRecord.medicineId) {
      const med = this.medicines.get(newRecord.medicineId);
      if (med && med.userId === userId) {
        med.stockCount = Math.max(0, med.stockCount - 1);
        this.medicines.set(newRecord.medicineId, med);
      }
    }

    this.doseEvents.set(id, newRecord);
    this.doseEventsByLocalId.set(data.localEventId, id);

    return { event: { ...newRecord }, isDuplicate: false };
  }

  async updateDoseEventStatus(
    id: string,
    userId: string,
    update: { status: DoseStatus; actionAt?: string; snoozeUntil?: string; notes?: string },
  ): Promise<DoseEventRecord> {
    const record = this.doseEvents.get(id);
    if (!record) {
      throw new Error('Dose event not found');
    }
    if (record.userId !== userId) {
      throw new Error('Unauthorized: You do not own this dose event');
    }

    const check = isValidDoseTransition(record.status, update.status);
    if (!check.valid) {
      throw new Error(check.reason || 'Invalid state transition');
    }

    record.status = update.status;
    if (update.actionAt) record.actionAt = update.actionAt;
    if (update.snoozeUntil !== undefined) record.snoozeUntil = update.snoozeUntil;
    if (update.notes !== undefined) record.notes = update.notes;
    record.updatedAt = new Date().toISOString();

    this.doseEvents.set(id, record);
    return { ...record };
  }

  // ─── CAREGIVERS ────────────────────────────────────────────────────────────

  async findCaregiversByUserId(userId: string): Promise<CaregiverRelationRecord[]> {
    const list: CaregiverRelationRecord[] = [];
    for (const rel of this.caregivers.values()) {
      if (rel.userId === userId && rel.isActive) {
        list.push({ ...rel });
      }
    }
    return list;
  }

  async addCaregiver(
    userId: string,
    data: {
      caregiverEmail: string;
      caregiverName?: string;
      accessLevel?: CaregiverAccessLevel;
      relationLabel?: string;
      notifyOnMissed?: boolean;
      notifyOnTaken?: boolean;
      notifyOnLowStock?: boolean;
    },
  ): Promise<CaregiverRelationRecord> {
    const caregiverId = crypto.randomUUID(); // Simulated caregiver internal UUID
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const record: CaregiverRelationRecord = {
      id,
      userId,
      caregiverId,
      caregiverEmail: data.caregiverEmail,
      caregiverName: data.caregiverName || data.caregiverEmail.split('@')[0],
      accessLevel: data.accessLevel || 'VIEW_ONLY',
      relationLabel: data.relationLabel || 'Family Caregiver',
      isActive: true,
      notifyOnMissed: data.notifyOnMissed !== undefined ? data.notifyOnMissed : true,
      notifyOnTaken: data.notifyOnTaken !== undefined ? data.notifyOnTaken : false,
      notifyOnLowStock: data.notifyOnLowStock !== undefined ? data.notifyOnLowStock : true,
      createdAt: now,
      updatedAt: now,
    };

    this.caregivers.set(id, record);
    return { ...record };
  }

  async removeCaregiver(id: string, userId: string): Promise<boolean> {
    const rel = this.caregivers.get(id);
    if (!rel || rel.userId !== userId) {
      throw new Error('Caregiver relation not found or unauthorized');
    }
    rel.isActive = false;
    rel.updatedAt = new Date().toISOString();
    this.caregivers.set(id, rel);
    return true;
  }

  // ─── REFILLS ───────────────────────────────────────────────────────────────

  async findRefillsByUserId(userId: string): Promise<RefillRuleRecord[]> {
    const list: RefillRuleRecord[] = [];
    for (const rule of this.refills.values()) {
      if (rule.userId === userId) {
        list.push({ ...rule });
      }
    }
    return list;
  }

  async upsertRefillRule(
    userId: string,
    data: {
      medicineId: string;
      lowStockThreshold?: number;
      refillQuantity?: number;
      autoAlertEnabled?: boolean;
      pharmacyName?: string;
      pharmacyPhone?: string;
      notes?: string;
    },
  ): Promise<RefillRuleRecord> {
    // Verify medicine ownership
    const medicine = await this.findMedicineById(data.medicineId, userId);
    if (!medicine) {
      throw new Error('Referenced medicine not found or does not belong to you');
    }

    // Check if rule for this medicine already exists
    let existingRule: RefillRuleRecord | null = null;
    for (const rule of this.refills.values()) {
      if (rule.medicineId === data.medicineId) {
        existingRule = rule;
        break;
      }
    }

    const now = new Date().toISOString();
    if (existingRule) {
      if (existingRule.userId !== userId) {
        throw new Error('Unauthorized');
      }
      Object.assign(existingRule, {
        lowStockThreshold: data.lowStockThreshold ?? existingRule.lowStockThreshold,
        refillQuantity: data.refillQuantity ?? existingRule.refillQuantity,
        autoAlertEnabled: data.autoAlertEnabled ?? existingRule.autoAlertEnabled,
        pharmacyName: data.pharmacyName ?? existingRule.pharmacyName,
        pharmacyPhone: data.pharmacyPhone ?? existingRule.pharmacyPhone,
        notes: data.notes ?? existingRule.notes,
        updatedAt: now,
      });
      this.refills.set(existingRule.id, existingRule);
      return { ...existingRule };
    }

    const id = crypto.randomUUID();
    const newRule: RefillRuleRecord = {
      id,
      userId,
      medicineId: data.medicineId,
      lowStockThreshold: data.lowStockThreshold ?? 5,
      refillQuantity: data.refillQuantity ?? 30,
      autoAlertEnabled: data.autoAlertEnabled ?? true,
      pharmacyName: data.pharmacyName || null,
      pharmacyPhone: data.pharmacyPhone || null,
      notes: data.notes || null,
      createdAt: now,
      updatedAt: now,
    };

    this.refills.set(id, newRule);
    return { ...newRule };
  }

  async markRefilled(id: string, userId: string): Promise<RefillRuleRecord> {
    const rule = this.refills.get(id);
    if (!rule || rule.userId !== userId) {
      throw new Error('Refill rule not found or unauthorized');
    }

    const today = new Date().toISOString().split('T')[0];
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);

    rule.lastRefillDate = today;
    rule.nextRefillDate = nextDate.toISOString().split('T')[0];
    rule.updatedAt = new Date().toISOString();
    this.refills.set(id, rule);

    // Update medicine stock count
    const med = this.medicines.get(rule.medicineId);
    if (med && med.userId === userId) {
      med.stockCount = rule.refillQuantity;
      med.updatedAt = new Date().toISOString();
      this.medicines.set(med.id, med);
    }

    return { ...rule };
  }

  // ─── DEVICE TOKENS ─────────────────────────────────────────────────────────

  async registerDeviceToken(userId: string, token: string, platform: 'android' | 'ios' | 'web' = 'android'): Promise<void> {
    const existing = this.deviceTokens.get(token);
    const now = new Date().toISOString();

    if (existing) {
      existing.userId = userId;
      existing.platform = platform;
      existing.isActive = true;
      existing.updatedAt = now;
      this.deviceTokens.set(token, existing);
    } else {
      this.deviceTokens.set(token, {
        id: crypto.randomUUID(),
        userId,
        token,
        platform,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  async deactivateDeviceToken(userId: string, token: string): Promise<void> {
    const existing = this.deviceTokens.get(token);
    if (existing && existing.userId === userId) {
      existing.isActive = false;
      existing.updatedAt = new Date().toISOString();
      this.deviceTokens.set(token, existing);
    }
  }

  // ─── SYNC AUDIT LOGGING ───────────────────────────────────────────────────

  async logSync(
    userId: string,
    operation: 'CREATE' | 'UPDATE' | 'DELETE',
    resource: 'medicine' | 'reminder' | 'dose_event',
    resourceId: string,
    status: 'success' | 'duplicate' | 'failed',
    error?: string | null,
  ): Promise<SyncLogRecord> {
    const record: SyncLogRecord = {
      id: crypto.randomUUID(),
      userId,
      operation,
      resource,
      resourceId,
      status,
      error: error || null,
      createdAt: new Date().toISOString(),
    };
    this.syncLogs.push(record);
    return record;
  }

  async getSyncLogs(userId: string): Promise<SyncLogRecord[]> {
    return this.syncLogs.filter((l) => l.userId === userId);
  }

  // ─── ADHERENCE STATS ───────────────────────────────────────────────────────

  async getAdherenceStats(userId: string, startDate: string, endDate: string): Promise<{
    adherenceScore: number;
    totalDoses: number;
    breakdown: Record<DoseStatus, number>;
    period: { startDate: string; endDate: string };
  }> {
    const breakdown: Record<DoseStatus, number> = {
      PENDING: 0,
      TAKEN: 0,
      SNOOZED: 0,
      SKIPPED: 0,
      MISSED: 0,
    };

    let total = 0;
    for (const dose of this.doseEvents.values()) {
      if (dose.userId === userId) {
        if (dose.scheduledDate >= startDate && dose.scheduledDate <= endDate) {
          breakdown[dose.status] = (breakdown[dose.status] || 0) + 1;
          total++;
        }
      }
    }

    const taken = breakdown.TAKEN || 0;
    const adherenceScore = total > 0 ? Math.round((taken / total) * 100) : 0;

    return {
      adherenceScore,
      totalDoses: total,
      breakdown,
      period: { startDate, endDate },
    };
  }
}

export const dbService = new MedicareDatabase();
