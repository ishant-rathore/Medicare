// =============================================================================
// backend/src/modules/dose-events/dose-events.types.ts
// =============================================================================

export type DoseStatus = 'PENDING' | 'TAKEN' | 'SNOOZED' | 'SKIPPED' | 'MISSED';
export type MealTiming = 'BEFORE_FOOD' | 'AFTER_FOOD' | 'WITH_FOOD' | 'AFTER_DINNER' | 'EMPTY_STOMACH' | 'BEDTIME';

export interface CreateDoseEventDto {
  localEventId: string; // Unique ID generated on device — prevents duplicates on sync
  medicineId: string;
  reminderId?: string;
  medicineName: string;
  dosage: string;
  mealTiming: MealTiming;
  scheduledTime: string; // "08:00"
  scheduledDate: string; // "2026-08-28"
  status: DoseStatus;
  actionAt?: string; // ISO datetime
  snoozeUntil?: string; // ISO datetime
  spokenScript?: string;
  notes?: string;
}

export interface UpdateDoseEventDto {
  status: DoseStatus;
  actionAt?: string;
  snoozeUntil?: string;
  notes?: string;
}

export interface DoseEventResponse {
  id: string;
  localEventId: string;
  userId: string;
  medicineId: string;
  reminderId: string | null;
  medicineName: string;
  dosage: string;
  mealTiming: MealTiming;
  scheduledTime: string;
  scheduledDate: string;
  status: DoseStatus;
  actionAt: string | null;
  snoozeUntil: string | null;
  spokenScript: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DoseHistoryQuery {
  startDate?: string;
  endDate?: string;
  medicineId?: string;
  status?: DoseStatus;
  page?: number;
  limit?: number;
}
