// =============================================================================
// backend/src/modules/caregivers/caregivers.routes.ts
// Caregiver relationship management with authorization checks
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
import { CaregiversService } from './caregivers.service';

const router = Router();

const addCaregiverSchema = z.object({
  caregiverEmail: z.string().email(),
  accessLevel: z.enum(['VIEW_ONLY', 'MANAGE']).default('VIEW_ONLY'),
  relationLabel: z.string().trim().max(100).optional(),
  notifyOnMissed: z.boolean().default(true),
  notifyOnTaken: z.boolean().default(false),
  notifyOnLowStock: z.boolean().default(true),
});

router.use(requireAuth);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await CaregiversService.getOwnerByFirebaseUid(req.userId!);
    const caregivers = await CaregiversService.list(user.id);
    ResponseHelper.ok(res, caregivers);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const owner = await CaregiversService.getOwnerByFirebaseUid(req.userId!);
    const data = addCaregiverSchema.parse(req.body);
    const relation = await CaregiversService.add(owner.id, data);
    ResponseHelper.created(res, relation, 'Caregiver added successfully');
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const relationId = z.string().uuid().parse(req.params.id);
    const owner = await CaregiversService.getOwnerByFirebaseUid(req.userId!);
    await CaregiversService.revoke(owner.id, relationId);
    ResponseHelper.noContent(res);
  } catch (error) {
    next(error);
  }
});

router.get('/monitoring/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUserId = z.string().uuid().parse(req.params.userId);
    const caregiver = await CaregiversService.getOwnerByFirebaseUid(req.userId!);
    const result = await CaregiversService.monitoring(caregiver.id, targetUserId);
    ResponseHelper.ok(res, result);
  } catch (error) {
    next(error);
  }
});

export default router;
