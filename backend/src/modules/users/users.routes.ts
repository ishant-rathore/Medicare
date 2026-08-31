// =============================================================================
// backend/src/modules/users/users.routes.ts
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
import { prisma } from '../../config/database';

const router = Router();

const updateUserSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  nickname: z.string().max(100).optional(),
  age: z.number().int().min(1).max(150).optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  bloodGroup: z.string().max(10).optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  preferredLanguage: z.string().max(10).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  healthConditions: z.array(z.string().max(100)).max(50).optional(),
});

router.use(requireAuth);

/** GET /api/v1/users/me — Get current user profile */
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    let user = await prisma.user.findUnique({ where: { firebaseUid: userId } });

    if (!user) {
      // Auto-create user on first access
      user = await prisma.user.create({
        data: {
          firebaseUid: userId,
          email: req.userEmail,
          name: req.userEmail?.split('@')[0] ?? 'User',
        },
      });
    }

    ResponseHelper.ok(res, user);
  } catch (error) {
    next(error);
  }
});

/** PUT /api/v1/users/me — Update current user profile */
router.put('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const data = updateUserSchema.parse(req.body);

    const user = await prisma.user.upsert({
      where: { firebaseUid: userId },
      create: {
        firebaseUid: userId,
        email: req.userEmail,
        name: data.name ?? 'User',
        ...data,
      },
      update: { ...data, updatedAt: new Date() },
    });

    ResponseHelper.ok(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
});

/** DELETE /api/v1/users/me — Soft-delete account */
router.delete('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    await prisma.user.update({
      where: { firebaseUid: userId },
      data: { deletedAt: new Date(), isActive: false },
    });
    ResponseHelper.noContent(res);
  } catch (error) {
    next(error);
  }
});

export default router;
