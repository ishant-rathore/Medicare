// =============================================================================
// backend/src/modules/device-tokens/device-tokens.routes.ts
// FCM device token management
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
import { prisma } from '../../config/database';

const router = Router();

const registerTokenSchema = z.object({
  token: z.string().min(100, 'Invalid FCM token'),
  platform: z.enum(['android', 'ios']).default('android'),
});

router.use(requireAuth);

/** POST /api/v1/device-tokens — Register or update device FCM token */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const { token, platform } = registerTokenSchema.parse(req.body);

    await prisma.deviceToken.upsert({
      where: { token },
      create: { userId: user.id, token, platform, isActive: true },
      update: { isActive: true, updatedAt: new Date() },
    });

    ResponseHelper.ok(res, null, 'Device token registered');
  } catch (error) {
    next(error);
  }
});

/** DELETE /api/v1/device-tokens — Deactivate current device token */
router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body as { token: string };
    if (!token) return ResponseHelper.badRequest(res, 'Token is required');

    await prisma.deviceToken.updateMany({
      where: { token },
      data: { isActive: false },
    });

    ResponseHelper.noContent(res);
  } catch (error) {
    next(error);
  }
});

export default router;
