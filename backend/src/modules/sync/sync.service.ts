// =============================================================================
// backend/src/modules/sync/sync.service.ts
<<<<<<< HEAD
// Batch sync — processes offline queue items with idempotency
// =============================================================================

import { logger } from '../../config/logger';
import { prisma } from '../../config/database';
import { DoseEventsRepository } from '../dose-events/dose-events.repository';
=======
// Offline batch synchronization with identity, ownership and idempotency checks.
// =============================================================================

import { z } from 'zod';

import { logger } from '../../config/logger';
import { prisma } from '../../config/database';
import { AuthorizationError, NotFoundError } from '../../shared/errors/app-error';
import { DoseEventsService } from '../dose-events/dose-events.service';
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
import { MedicinesRepository } from '../medicines/medicines.repository';
import { CreateMedicineInput } from '../medicines/medicines.schema';
import { CreateDoseEventDto } from '../dose-events/dose-events.types';

export interface SyncItem {
  localId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  resource: 'medicine' | 'reminder' | 'dose_event';
  payload: unknown;
}

export interface SyncResult {
  localId: string;
  success: boolean;
  serverId?: string;
  error?: string;
  isDuplicate?: boolean;
}

<<<<<<< HEAD
export const SyncService = {
  /**
   * Process a batch of sync items from the device's offline queue.
   * Each item is processed individually — failures don't block others.
   * Idempotency is guaranteed via localEventId on dose events.
   */
=======
const doseEventSchema = z.object({
  localEventId: z.string().uuid(),
  medicineId: z.string().uuid(),
  reminderId: z.string().uuid().optional(),
  medicineName: z.string().trim().min(1).max(200),
  dosage: z.string().trim().min(1).max(100),
  mealTiming: z.enum(['BEFORE_FOOD', 'AFTER_FOOD', 'WITH_FOOD', 'AFTER_DINNER', 'EMPTY_STOMACH', 'BEDTIME']),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['PENDING', 'TAKEN', 'SNOOZED', 'SKIPPED', 'MISSED']),
  actionAt: z.string().datetime().optional(),
  snoozeUntil: z.string().datetime().optional(),
  spokenScript: z.string().max(1000).optional(),
  notes: z.string().max(500).optional(),
});

export const SyncService = {
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  async processBatch(userId: string, items: SyncItem[]): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const item of items) {
      try {
        const result = await SyncService.processItem(userId, item);
        results.push(result);

<<<<<<< HEAD
        // Log to sync_log table for audit
=======
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
        await prisma.syncLog.create({
          data: {
            userId,
            operation: item.operation,
            resource: item.resource,
            resourceId: result.serverId ?? item.localId,
            status: result.success ? (result.isDuplicate ? 'duplicate' : 'success') : 'failed',
            error: result.error,
          },
        });
      } catch (error) {
<<<<<<< HEAD
        logger.error('Sync item processing failed', error, {
          localId: item.localId,
          resource: item.resource,
          operation: item.operation,
        });
        results.push({
          localId: item.localId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
=======
        const message = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Sync item processing failed', {
          localId: item.localId,
          resource: item.resource,
          operation: item.operation,
          error: message,
        });
        results.push({ localId: item.localId, success: false, error: message });
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
      }
    }

    return results;
  },

  async processItem(userId: string, item: SyncItem): Promise<SyncResult> {
    switch (item.resource) {
      case 'dose_event':
<<<<<<< HEAD
        return SyncService.syncDoseEvent(userId, item);
      case 'medicine':
        return SyncService.syncMedicine(userId, item);
=======
        if (item.operation !== 'CREATE' && item.operation !== 'UPDATE') {
          return { localId: item.localId, success: false, error: 'Invalid dose_event sync operation' };
        }
        return SyncService.syncDoseEvent(userId, item);
      case 'medicine':
        return SyncService.syncMedicine(userId, item);
      case 'reminder':
        return SyncService.syncReminder(userId, item);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
      default:
        return { localId: item.localId, success: false, error: `Unknown resource: ${item.resource}` };
    }
  },

  async syncDoseEvent(userId: string, item: SyncItem): Promise<SyncResult> {
<<<<<<< HEAD
    const payload = item.payload as CreateDoseEventDto;

    if (!payload.localEventId) {
      return { localId: item.localId, success: false, error: 'localEventId is required for dose events' };
    }

    // Check if already exists (duplicate detection)
    const existing = await prisma.doseEvent.findUnique({
      where: { localEventId: payload.localEventId },
    });

    if (existing && existing.userId !== userId) {
      return { localId: item.localId, success: false, error: 'Unauthorized' };
    }

    const result = await DoseEventsRepository.upsertByLocalEventId(userId, payload);
=======
    const payload = doseEventSchema.parse(item.payload) as CreateDoseEventDto;
    const { event, duplicate } = await DoseEventsService.createIdempotent(userId, payload);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

    return {
      localId: item.localId,
      success: true,
<<<<<<< HEAD
      serverId: result.id,
      isDuplicate: existing !== null,
=======
      serverId: event.id,
      isDuplicate: duplicate,
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    };
  },

  async syncMedicine(userId: string, item: SyncItem): Promise<SyncResult> {
    const payload = item.payload as CreateMedicineInput & { id?: string };

    if (item.operation === 'CREATE') {
      const medicine = await MedicinesRepository.create(userId, payload);
      return { localId: item.localId, success: true, serverId: medicine.id };
    }

<<<<<<< HEAD
    if (item.operation === 'UPDATE' && payload.id) {
      const existing = await MedicinesRepository.findById(payload.id, userId);
      if (!existing || existing.userId !== userId) {
        return { localId: item.localId, success: false, error: 'Medicine not found or unauthorized' };
      }
=======
    if (!payload.id) {
      return { localId: item.localId, success: false, error: 'Medicine id is required for update/delete' };
    }

    const existing = await MedicinesRepository.findById(payload.id, userId);
    if (!existing) throw new NotFoundError('Medicine');

    if (item.operation === 'UPDATE') {
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
      const updated = await MedicinesRepository.update(payload.id, userId, payload);
      return { localId: item.localId, success: true, serverId: updated.id };
    }

<<<<<<< HEAD
    if (item.operation === 'DELETE' && payload.id) {
      const existing = await MedicinesRepository.findById(payload.id, userId);
      if (!existing || existing.userId !== userId) {
        return { localId: item.localId, success: false, error: 'Medicine not found or unauthorized' };
      }
      await MedicinesRepository.softDelete(payload.id, userId);
      return { localId: item.localId, success: true };
    }

    return { localId: item.localId, success: false, error: 'Invalid sync operation' };
=======
    if (item.operation === 'DELETE') {
      await MedicinesRepository.softDelete(payload.id, userId);
      return { localId: item.localId, success: true, serverId: payload.id };
    }

    return { localId: item.localId, success: false, error: 'Invalid medicine sync operation' };
  },

  async syncReminder(userId: string, item: SyncItem): Promise<SyncResult> {
    const payload = item.payload as { id?: string; medicineId?: string };
    if (item.operation !== 'UPDATE' && item.operation !== 'DELETE') {
      return { localId: item.localId, success: false, error: 'Reminder sync supports update/delete only' };
    }
    if (!payload.id) return { localId: item.localId, success: false, error: 'Reminder id is required' };

    const reminder = await prisma.reminder.findFirst({ where: { id: payload.id, userId, deletedAt: null } });
    if (!reminder) throw new NotFoundError('Reminder');

    if (payload.medicineId) {
      const medicine = await prisma.medicine.findFirst({ where: { id: payload.medicineId, userId, deletedAt: null } });
      if (!medicine) throw new AuthorizationError('Reminder medicine access denied');
    }

    if (item.operation === 'DELETE') {
      await prisma.reminder.update({ where: { id: payload.id }, data: { deletedAt: new Date(), isActive: false } });
      return { localId: item.localId, success: true, serverId: payload.id };
    }

    // Reminder updates are intentionally conservative here. The normal reminder API
    // remains the source for full validation of recurring schedule fields.
    return { localId: item.localId, success: false, error: 'Reminder update requires the reminder API validation contract' };
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  },
};
