// =============================================================================
// backend/src/modules/sync/sync.routes.ts
// =============================================================================

import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { syncRateLimiter } from '../../middleware/rate-limit.middleware';
import { ResponseHelper } from '../../shared/response.helper';
import { SyncService } from './sync.service';

const router = Router();

const syncItemSchema = z.object({
  localId: z.string().min(1),
  operation: z.enum(['CREATE', 'UPDATE', 'DELETE']),
  resource: z.enum(['medicine', 'reminder', 'dose_event']),
  payload: z.record(z.unknown()),
});

const syncBatchSchema = z.object({
  items: z.array(syncItemSchema).min(1).max(500),
});

router.use(requireAuth);

/**
 * POST /api/v1/sync/batch
 * Process a batch of offline sync items
 */
router.post('/batch', syncRateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { items } = syncBatchSchema.parse(req.body);
    const results = await SyncService.processBatch(userId, items);
    ResponseHelper.ok(res, { results, total: items.length, successful: results.filter((r) => r.success).length });
  } catch (error) {
    next(error);
  }
});

export default router;
