// =============================================================================
// backend/src/modules/refills/refills.routes.ts
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
import { RefillsService } from './refills.service';

const router = Router();

const refillRuleSchema = z.object({
  medicineId: z.string().uuid(),
  lowStockThreshold: z.number().int().min(1).max(999).default(5),
  refillQuantity: z.number().int().min(1).max(9999).default(30),
  autoAlertEnabled: z.boolean().default(true),
  pharmacyName: z.string().trim().max(200).optional(),
  pharmacyPhone: z.string().trim().max(20).optional(),
  notes: z.string().trim().max(500).optional(),
});

router.use(requireAuth);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    ResponseHelper.ok(res, await RefillsService.list(req.userId!));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = refillRuleSchema.parse(req.body);
    const rule = await RefillsService.upsert(req.userId!, data);
    ResponseHelper.ok(res, rule, 'Refill rule saved');
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/refilled', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = z.string().uuid().parse(req.params.id);
    const updated = await RefillsService.recordRefill(req.userId!, id);
    ResponseHelper.ok(res, updated, 'Refill recorded and stock updated');
  } catch (error) {
    next(error);
  }
});

export default router;
