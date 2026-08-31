// =============================================================================
// backend/src/modules/notifications/notifications.routes.ts
// Push notification dispatch via Firebase Cloud Messaging
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
import { sendPushNotification } from '../../config/firebase';
import { prisma } from '../../config/database';
<<<<<<< HEAD
import { logger } from '../../config/logger';
=======
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

const router = Router();

const sendNotificationSchema = z.object({
<<<<<<< HEAD
  targetUserId: z.string().optional(),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(500),
  data: z.record(z.string()).optional(),
});

router.use(requireAuth);

/** POST /api/v1/notifications/send — Send push notification to a user's devices */
router.post('/send', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestingUserId = req.userId!;
    const data = sendNotificationSchema.parse(req.body);

    const requestingUser = await prisma.user.findUnique({ where: { firebaseUid: requestingUserId } });
    if (!requestingUser) return ResponseHelper.notFound(res, 'User');

    // If targeting another user, verify caregiver access
    let targetInternalId = requestingUser.id;
    if (data.targetUserId && data.targetUserId !== requestingUser.id) {
      const relation = await prisma.caregiverRelation.findFirst({
        where: { userId: data.targetUserId, caregiverId: requestingUser.id, isActive: true },
      });
      if (!relation) return ResponseHelper.forbidden(res, 'No caregiver access to this user');
      targetInternalId = data.targetUserId;
    }

    // Get all active device tokens for the target user
    const tokens = await prisma.deviceToken.findMany({
      where: { userId: targetInternalId, isActive: true },
      select: { token: true },
    });

    if (tokens.length === 0) {
      return ResponseHelper.ok(res, { sent: 0 }, 'No active devices found');
    }

    let sent = 0;
=======
  targetUserId: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(300),
  data: z.record(z.string().max(100)).optional(),
}).strict();

router.use(requireAuth);

router.post('/send', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = sendNotificationSchema.parse(req.body);
    const requester = await prisma.user.findUnique({
      where: { firebaseUid: req.userId! },
      select: { id: true, isActive: true },
    });
    if (!requester || !requester.isActive) return ResponseHelper.notFound(res, 'User');

    let targetUserId = requester.id;
    if (data.targetUserId && data.targetUserId !== requester.id) {
      const relation = await prisma.caregiverRelation.findFirst({
        where: { userId: data.targetUserId, caregiverId: requester.id, isActive: true },
        select: { accessLevel: true },
      });
      if (!relation || relation.accessLevel !== 'MANAGE') {
        return ResponseHelper.forbidden(res, 'Caregiver manage permission is required');
      }
      targetUserId = data.targetUserId;
    }

    const tokens = await prisma.deviceToken.findMany({
      where: { userId: targetUserId, isActive: true },
      select: { token: true },
    });

    if (tokens.length === 0) return ResponseHelper.ok(res, { sent: 0, total: 0 }, 'No active devices found');

    let sent = 0;
    let failed = 0;
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    for (const { token } of tokens) {
      const success = await sendPushNotification({
        deviceToken: token,
        title: data.title,
        body: data.body,
        data: data.data,
      });
      if (success) sent++;
<<<<<<< HEAD
    }

    logger.info('Notifications sent', { targetUserId: targetInternalId, sent, total: tokens.length });
    ResponseHelper.ok(res, { sent, total: tokens.length });
=======
      else failed++;
    }

    ResponseHelper.ok(res, { sent, failed, total: tokens.length });
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  } catch (error) {
    next(error);
  }
});

export default router;
