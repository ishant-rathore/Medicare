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

const router = Router();

const sendNotificationSchema = z.object({
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
    for (const { token } of tokens) {
      const success = await sendPushNotification({
        deviceToken: token,
        title: data.title,
        body: data.body,
        data: data.data,
      });
      if (success) sent++;
      else failed++;
    }

    ResponseHelper.ok(res, { sent, failed, total: tokens.length });
  } catch (error) {
    next(error);
  }
});

export default router;
