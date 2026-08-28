// =============================================================================
// backend/src/modules/users/users.routes.ts
// Current authenticated user profile operations.
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
import { prisma } from '../../config/database';

const router = Router();

const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  nickname: z.string().trim().max(100).optional(),
  age: z.number().int().min(1).max(150).optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  bloodGroup: z.string().trim().max(10).optional(),
  phone: z.string().trim().max(20).optional(),
  address: z.string().trim().max(500).optional(),
  preferredLanguage: z.string().trim().max(10).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  healthConditions: z.array(z.string().trim().max(100)).max(50).optional(),
}).strict();

router.use(requireAuth);

router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid: req.userId! } });
    if (!user || !user.isActive || user.deletedAt) return ResponseHelper.notFound(res, 'User');
    ResponseHelper.ok(res, user);
  } catch (error) {
    next(error);
  }
});

router.put('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateUserSchema.parse(req.body);
    const current = await prisma.user.findUnique({
      where: { firebaseUid: req.userId! },
      select: { id: true, isActive: true, deletedAt: true },
    });
    if (!current || !current.isActive || current.deletedAt) return ResponseHelper.notFound(res, 'User');

    const user = await prisma.user.update({
      where: { id: current.id },
      data: { ...data, updatedAt: new Date() },
    });

    ResponseHelper.ok(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
});

router.delete('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.userId! },
      select: { id: true, isActive: true, deletedAt: true },
    });
    if (!user || !user.isActive || user.deletedAt) return ResponseHelper.notFound(res, 'User');

    await prisma.user.update({
      where: { id: user.id },
      data: { deletedAt: new Date(), isActive: false, updatedAt: new Date() },
    });

    ResponseHelper.noContent(res);
  } catch (error) {
    next(error);
  }
});

export default router;
