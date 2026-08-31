// =============================================================================
// backend/src/services/sync-engine.service.ts
// Idempotent synchronization engine for medicines, reminders, and dose events
// Validates: Identity, Ownership, Authorization, Event Identity, State Transitions
// =============================================================================

import { logger } from '../config/logger';
import { dbService, MedicineRecord, ReminderRecord, DoseEventRecord, isValidDoseTransition, DoseStatus } from './database.service';

export interface SyncItemPayload {
  localId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  resource: 'medicine' | 'reminder' | 'dose_event';
  payload: Record<string, any>;
}

export interface SyncItemResult {
  localId: string;
  resource: 'medicine' | 'reminder' | 'dose_event';
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  success: boolean;
  serverId?: string;
  isDuplicate?: boolean;
  error?: string;
}

export interface SyncBatchResponse {
  results: SyncItemResult[];
  total: number;
  successful: number;
  duplicates: number;
  failed: number;
  syncedAt: string;
}

export const SyncEngineService = {
  /**
   * Process a batch of sync items from a client queue.
   * Scoped to the authenticated internal PostgreSQL user ID.
   */
  async processBatch(userId: string, items: SyncItemPayload[]): Promise<SyncBatchResponse> {
    const results: SyncItemResult[] = [];
    let successful = 0;
    let duplicates = 0;
    let failed = 0;

    for (const item of items) {
      try {
        const result = await SyncEngineService.processItem(userId, item);
        results.push(result);

        if (result.success) {
          successful++;
          if (result.isDuplicate) duplicates++;
        } else {
          failed++;
        }

        // Log operation in sync_log
        await dbService.logSync(
          userId,
          item.operation,
          item.resource,
          result.serverId || item.localId,
          result.success ? (result.isDuplicate ? 'duplicate' : 'success') : 'failed',
          result.error,
        );
      } catch (err: any) {
        const errorMsg = err?.message || 'Sync failed';
        logger.error('Sync item error', { userId, item, error: errorMsg });

        results.push({
          localId: item.localId,
          resource: item.resource,
          operation: item.operation,
          success: false,
          error: errorMsg,
        });
        failed++;

        await dbService.logSync(
          userId,
          item.operation,
          item.resource,
          item.localId,
          'failed',
          errorMsg,
        );
      }
    }

    return {
      results,
      total: items.length,
      successful,
      duplicates,
      failed,
      syncedAt: new Date().toISOString(),
    };
  },

  /**
   * Process individual sync item with strict validation & idempotency
   */
  async processItem(userId: string, item: SyncItemPayload): Promise<SyncItemResult> {
    if (!item.localId) {
      return {
        localId: 'unknown',
        resource: item.resource,
        operation: item.operation,
        success: false,
        error: 'localId is required for sync items',
      };
    }

    switch (item.resource) {
      case 'medicine':
        return SyncEngineService.syncMedicine(userId, item);
      case 'reminder':
        return SyncEngineService.syncReminder(userId, item);
      case 'dose_event':
        return SyncEngineService.syncDoseEvent(userId, item);
      default:
        return {
          localId: item.localId,
          resource: item.resource,
          operation: item.operation,
          success: false,
          error: `Unsupported resource type: ${item.resource}`,
        };
    }
  },

  // ─── MEDICINE SYNC ─────────────────────────────────────────────────────────

  async syncMedicine(userId: string, item: SyncItemPayload): Promise<SyncItemResult> {
    const { operation, localId, payload } = item;
    const medicineId = payload.id || localId;

    if (operation === 'CREATE') {
      // Check if medicine with this ID already exists
      const existing = await dbService.findMedicineById(medicineId, userId);
      if (existing) {
        return {
          localId,
          resource: 'medicine',
          operation,
          success: true,
          serverId: existing.id,
          isDuplicate: true,
        };
      }

      const created = await dbService.createMedicine(userId, {
        ...payload,
        id: medicineId,
      });

      return {
        localId,
        resource: 'medicine',
        operation,
        success: true,
        serverId: created.id,
        isDuplicate: false,
      };
    }

    if (operation === 'UPDATE') {
      const existing = await dbService.findMedicineById(medicineId, userId);
      if (!existing) {
        return {
          localId,
          resource: 'medicine',
          operation,
          success: false,
          error: 'Medicine not found or unauthorized',
        };
      }

      const updated = await dbService.updateMedicine(medicineId, userId, payload);
      return {
        localId,
        resource: 'medicine',
        operation,
        success: true,
        serverId: updated.id,
        isDuplicate: false,
      };
    }

    if (operation === 'DELETE') {
      const existing = await dbService.findMedicineById(medicineId, userId);
      if (!existing) {
        // Idempotent delete: if already not present or deleted, mark success
        return {
          localId,
          resource: 'medicine',
          operation,
          success: true,
          serverId: medicineId,
          isDuplicate: true,
        };
      }

      await dbService.deleteMedicine(medicineId, userId);
      return {
        localId,
        resource: 'medicine',
        operation,
        success: true,
        serverId: medicineId,
        isDuplicate: false,
      };
    }

    return {
      localId,
      resource: 'medicine',
      operation,
      success: false,
      error: `Unknown operation: ${operation}`,
    };
  },

  // ─── REMINDER SYNC ─────────────────────────────────────────────────────────

  async syncReminder(userId: string, item: SyncItemPayload): Promise<SyncItemResult> {
    const { operation, localId, payload } = item;
    const reminderId = payload.id || localId;

    if (operation === 'CREATE') {
      const existing = await dbService.findReminderById(reminderId, userId);
      if (existing) {
        return {
          localId,
          resource: 'reminder',
          operation,
          success: true,
          serverId: existing.id,
          isDuplicate: true,
        };
      }

      if (!payload.medicineId) {
        return {
          localId,
          resource: 'reminder',
          operation,
          success: false,
          error: 'medicineId is required to create a reminder',
        };
      }

      // Verify medicine ownership
      const medicine = await dbService.findMedicineById(payload.medicineId, userId);
      if (!medicine) {
        return {
          localId,
          resource: 'reminder',
          operation,
          success: false,
          error: 'Referenced medicine not found or does not belong to you',
        };
      }

      const created = await dbService.createReminder(userId, {
        ...payload,
        id: reminderId,
      });

      return {
        localId,
        resource: 'reminder',
        operation,
        success: true,
        serverId: created.id,
        isDuplicate: false,
      };
    }

    if (operation === 'UPDATE') {
      const existing = await dbService.findReminderById(reminderId, userId);
      if (!existing) {
        return {
          localId,
          resource: 'reminder',
          operation,
          success: false,
          error: 'Reminder not found or unauthorized',
        };
      }

      const updated = await dbService.updateReminder(reminderId, userId, payload);
      return {
        localId,
        resource: 'reminder',
        operation,
        success: true,
        serverId: updated.id,
      };
    }

    if (operation === 'DELETE') {
      const existing = await dbService.findReminderById(reminderId, userId);
      if (!existing) {
        return {
          localId,
          resource: 'reminder',
          operation,
          success: true,
          serverId: reminderId,
          isDuplicate: true,
        };
      }

      await dbService.deleteReminder(reminderId, userId);
      return {
        localId,
        resource: 'reminder',
        operation,
        success: true,
        serverId: reminderId,
      };
    }

    return {
      localId,
      resource: 'reminder',
      operation,
      success: false,
      error: `Unknown operation: ${operation}`,
    };
  },

  // ─── DOSE EVENT SYNC (Strict Idempotency by localEventId) ──────────────────

  async syncDoseEvent(userId: string, item: SyncItemPayload): Promise<SyncItemResult> {
    const { operation, localId, payload } = item;
    const localEventId = payload.localEventId || payload.id || localId;

    if (!localEventId) {
      return {
        localId,
        resource: 'dose_event',
        operation,
        success: false,
        error: 'localEventId is required for dose event synchronization',
      };
    }

    if (operation === 'CREATE' || operation === 'UPDATE') {
      // Check existing event by stable localEventId
      const existing = await dbService.findDoseEventByLocalId(localEventId);
      if (existing) {
        // Ownership validation
        if (existing.userId !== userId) {
          return {
            localId,
            resource: 'dose_event',
            operation,
            success: false,
            error: 'Unauthorized: Dose event belongs to another user',
          };
        }

        // Validate state transition
        const targetStatus: DoseStatus = (payload.status as DoseStatus) || existing.status;
        const transitionCheck = isValidDoseTransition(existing.status, targetStatus);
        if (!transitionCheck.valid) {
          logger.warn('State transition rejected during sync', {
            localEventId,
            current: existing.status,
            attempted: targetStatus,
          });
          return {
            localId,
            resource: 'dose_event',
            operation,
            success: false,
            error: transitionCheck.reason || 'Invalid state transition',
          };
        }

        // Idempotent update without creating duplicate
        const result = await dbService.upsertDoseEvent(userId, {
          localEventId,
          medicineId: existing.medicineId,
          reminderId: existing.reminderId,
          medicineName: existing.medicineName,
          dosage: existing.dosage,
          scheduledTime: existing.scheduledTime,
          scheduledDate: existing.scheduledDate,
          status: targetStatus,
          actionAt: payload.actionAt || payload.timestamp || existing.actionAt,
          snoozeUntil: payload.snoozeUntil !== undefined ? payload.snoozeUntil : existing.snoozeUntil,
          notes: payload.notes !== undefined ? payload.notes : existing.notes,
        });

        return {
          localId,
          resource: 'dose_event',
          operation,
          success: true,
          serverId: result.event.id,
          isDuplicate: true, // Successfully resolved idempotently
        };
      }

      // New dose event creation
      if (!payload.medicineId || !payload.medicineName || !payload.dosage || !payload.scheduledTime || !payload.scheduledDate) {
        return {
          localId,
          resource: 'dose_event',
          operation,
          success: false,
          error: 'Missing required dose event fields (medicineId, medicineName, dosage, scheduledTime, scheduledDate)',
        };
      }

      const result = await dbService.upsertDoseEvent(userId, {
        localEventId,
        medicineId: payload.medicineId,
        reminderId: payload.reminderId || null,
        medicineName: payload.medicineName,
        dosage: payload.dosage,
        mealTiming: payload.mealTiming,
        scheduledTime: payload.scheduledTime,
        scheduledDate: payload.scheduledDate,
        status: (payload.status as DoseStatus) || 'PENDING',
        actionAt: payload.actionAt || payload.timestamp || null,
        snoozeUntil: payload.snoozeUntil || null,
        spokenScript: payload.spokenScript || null,
        notes: payload.notes || null,
      });

      return {
        localId,
        resource: 'dose_event',
        operation,
        success: true,
        serverId: result.event.id,
        isDuplicate: false,
      };
    }

    if (operation === 'DELETE') {
      // Soft-delete or ignore dose events if delete requested
      return {
        localId,
        resource: 'dose_event',
        operation,
        success: true,
        isDuplicate: true,
      };
    }

    return {
      localId,
      resource: 'dose_event',
      operation,
      success: false,
      error: `Unknown operation: ${operation}`,
    };
  },
};
