// =============================================================================
// src/services/syncEngine.ts
// Local-first offline synchronization engine for Medicare
// Manages offline mutation queue and idempotent batch sync with /api/v1/sync/batch
// =============================================================================

import { apiClient } from './apiClient';

export interface QueuedMutation {
  localId: string;
  resource: 'medicine' | 'reminder' | 'dose_event';
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: Record<string, any>;
  queuedAt: string;
  retryCount: number;
}

const QUEUE_KEY = 'medicare_offline_pending_queue';

class SyncEngine {
  private isSyncing = false;
  private syncListeners: Array<(pendingCount: number, isSyncing: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[SyncEngine] Network restored, attempting queue flush...');
        this.flushQueue();
      });

      // Periodic queue check every 30 seconds
      setInterval(() => {
        if (navigator.onLine && this.getQueue().length > 0) {
          this.flushQueue();
        }
      }, 30000);
    }
  }

  public getQueue(): QueuedMutation[] {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: QueuedMutation[]) {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      this.notifyListeners();
    } catch (e) {
      console.warn('[SyncEngine] Failed to save sync queue:', e);
    }
  }

  public subscribe(listener: (pendingCount: number, isSyncing: boolean) => void) {
    this.syncListeners.push(listener);
    listener(this.getQueue().length, this.isSyncing);
    return () => {
      this.syncListeners = this.syncListeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    const count = this.getQueue().length;
    this.syncListeners.forEach((l) => l(count, this.isSyncing));
  }

  /**
   * Queue a local mutation for synchronization
   */
  public enqueue(
    resource: 'medicine' | 'reminder' | 'dose_event',
    operation: 'CREATE' | 'UPDATE' | 'DELETE',
    payload: Record<string, any>,
    customLocalId?: string,
  ): string {
    const localId =
      customLocalId ||
      payload.localEventId ||
      payload.id ||
      `mut_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const mutation: QueuedMutation = {
      localId,
      resource,
      operation,
      payload: { ...payload, localId },
      queuedAt: new Date().toISOString(),
      retryCount: 0,
    };

    const queue = this.getQueue();
    // Avoid exact duplicate queued items
    const filtered = queue.filter((q) => !(q.localId === localId && q.operation === operation));
    filtered.push(mutation);
    this.saveQueue(filtered);

    // If online, immediately trigger non-blocking background sync
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.flushQueue().catch((err) => {
        console.warn('[SyncEngine] Background flush notice:', err);
      });
    }

    return localId;
  }

  /**
   * Flush pending mutations to the server via /api/v1/sync/batch
   */
  public async flushQueue(): Promise<{ successful: number; duplicates: number; failed: number }> {
    if (this.isSyncing) return { successful: 0, duplicates: 0, failed: 0 };
    const queue = this.getQueue();
    if (queue.length === 0) return { successful: 0, duplicates: 0, failed: 0 };

    this.isSyncing = true;
    this.notifyListeners();

    try {
      const itemsPayload = queue.map((item) => ({
        localId: item.localId,
        resource: item.resource,
        operation: item.operation,
        payload: item.payload,
      }));

      const res = await apiClient.post('/api/v1/sync/batch', { items: itemsPayload });

      if (res && res.success && res.data) {
        const { results } = res.data;
        const succeededIds = new Set<string>();

        for (const r of results || []) {
          if (r.success) {
            succeededIds.add(r.localId);
          }
        }

        // Keep only failed mutations in the queue with incremented retry count
        const remainingQueue = queue
          .filter((item) => !succeededIds.has(item.localId))
          .map((item) => ({ ...item, retryCount: item.retryCount + 1 }));

        this.saveQueue(remainingQueue);

        return {
          successful: res.data.successful || 0,
          duplicates: res.data.duplicates || 0,
          failed: res.data.failed || 0,
        };
      }
    } catch (err) {
      console.warn('[SyncEngine] Sync batch failed (will retry when online):', err);
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }

    return { successful: 0, duplicates: 0, failed: queue.length };
  }
}

export const syncEngine = new SyncEngine();
