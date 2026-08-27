// =============================================================================
// backend/src/modules/sync/sync.service.ts
// Batch sync — processes offline queue items with idempotency
// =============================================================================

import { logger } from '../../config/logger';
import { prisma } from '../../config/database';
import { DoseEventsRepository } from '../dose-events/dose-events.repository';
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

export const SyncService = {
  /**
   * Process a batch of sync items from the device's offline queue.
   * Each item is processed individually — failures don't block others.
   * Idempotency is guaranteed via localEventId on dose events.
   */
  async processBatch(userId: string, items: SyncItem[]): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const item of items) {
      try {
        const result = await SyncService.processItem(userId, item);
        results.push(result);

        // Log to sync_log table for audit
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
      }
    }

    return results;
  },

  async processItem(userId: string, item: SyncItem): Promise<SyncResult> {
    switch (item.resource) {
      case 'dose_event':
        return SyncService.syncDoseEvent(userId, item);
      case 'medicine':
        return SyncService.syncMedicine(userId, item);
      default:
        return { localId: item.localId, success: false, error: `Unknown resource: ${item.resource}` };
    }
  },

  async syncDoseEvent(userId: string, item: SyncItem): Promise<SyncResult> {
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

    return {
      localId: item.localId,
      success: true,
      serverId: result.id,
      isDuplicate: existing !== null,
    };
  },

  async syncMedicine(userId: string, item: SyncItem): Promise<SyncResult> {
    const payload = item.payload as CreateMedicineInput & { id?: string };

    if (item.operation === 'CREATE') {
      const medicine = await MedicinesRepository.create(userId, payload);
      return { localId: item.localId, success: true, serverId: medicine.id };
    }

    if (item.operation === 'UPDATE' && payload.id) {
      const existing = await MedicinesRepository.findById(payload.id, userId);
      if (!existing || existing.userId !== userId) {
        return { localId: item.localId, success: false, error: 'Medicine not found or unauthorized' };
      }
      const updated = await MedicinesRepository.update(payload.id, userId, payload);
      return { localId: item.localId, success: true, serverId: updated.id };
    }

    if (item.operation === 'DELETE' && payload.id) {
      const existing = await MedicinesRepository.findById(payload.id, userId);
      if (!existing || existing.userId !== userId) {
        return { localId: item.localId, success: false, error: 'Medicine not found or unauthorized' };
      }
      await MedicinesRepository.softDelete(payload.id, userId);
      return { localId: item.localId, success: true };
    }

    return { localId: item.localId, success: false, error: 'Invalid sync operation' };
  },
};
