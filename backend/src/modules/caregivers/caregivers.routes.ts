// =============================================================================
// backend/src/modules/caregivers/caregivers.routes.ts
// Caregiver relationship management with authorization checks
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
<<<<<<< HEAD
import { NotFoundError, AuthorizationError } from '../../shared/errors/app-error';
import { prisma } from '../../config/database';
=======
import { CaregiversService } from './caregivers.service';
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

const router = Router();

const addCaregiverSchema = z.object({
  caregiverEmail: z.string().email(),
  accessLevel: z.enum(['VIEW_ONLY', 'MANAGE']).default('VIEW_ONLY'),
<<<<<<< HEAD
  relationLabel: z.string().max(100).optional(),
=======
  relationLabel: z.string().trim().max(100).optional(),
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  notifyOnMissed: z.boolean().default(true),
  notifyOnTaken: z.boolean().default(false),
  notifyOnLowStock: z.boolean().default(true),
});

router.use(requireAuth);

<<<<<<< HEAD
/** GET /api/v1/caregivers — List caregivers for this user */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const caregivers = await prisma.caregiverRelation.findMany({
      where: { userId: user.id, isActive: true },
      include: { caregiver: { select: { name: true, email: true, photoUrl: true } } },
    });

=======
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await CaregiversService.getOwnerByFirebaseUid(req.userId!);
    const caregivers = await CaregiversService.list(user.id);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    ResponseHelper.ok(res, caregivers);
  } catch (error) {
    next(error);
  }
});

<<<<<<< HEAD
/** POST /api/v1/caregivers — Add a caregiver by email */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const data = addCaregiverSchema.parse(req.body);

    // Find caregiver by email
    const caregiver = await prisma.user.findUnique({ where: { email: data.caregiverEmail } });
    if (!caregiver) {
      return ResponseHelper.notFound(res, `User with email ${data.caregiverEmail}`);
    }

    if (caregiver.id === user.id) {
      return ResponseHelper.badRequest(res, 'You cannot add yourself as a caregiver');
    }

    // Upsert relation (idempotent)
    const relation = await prisma.caregiverRelation.upsert({
      where: { userId_caregiverId: { userId: user.id, caregiverId: caregiver.id } },
      create: {
        userId: user.id,
        caregiverId: caregiver.id,
        accessLevel: data.accessLevel as never,
        relationLabel: data.relationLabel,
        notifyOnMissed: data.notifyOnMissed,
        notifyOnTaken: data.notifyOnTaken,
        notifyOnLowStock: data.notifyOnLowStock,
      },
      update: {
        isActive: true,
        accessLevel: data.accessLevel as never,
        relationLabel: data.relationLabel,
        notifyOnMissed: data.notifyOnMissed,
        notifyOnTaken: data.notifyOnTaken,
        notifyOnLowStock: data.notifyOnLowStock,
        updatedAt: new Date(),
      },
    });

=======
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const owner = await CaregiversService.getOwnerByFirebaseUid(req.userId!);
    const data = addCaregiverSchema.parse(req.body);
    const relation = await CaregiversService.add(owner.id, data);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    ResponseHelper.created(res, relation, 'Caregiver added successfully');
  } catch (error) {
    next(error);
  }
});

<<<<<<< HEAD
/** DELETE /api/v1/caregivers/:id — Remove a caregiver */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const relation = await prisma.caregiverRelation.findFirst({
      where: { id, userId: user.id },
    });
    if (!relation) throw new NotFoundError('Caregiver relation');

    await prisma.caregiverRelation.update({
      where: { id },
      data: { isActive: false, updatedAt: new Date() },
    });

=======
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const relationId = z.string().uuid().parse(req.params.id);
    const owner = await CaregiversService.getOwnerByFirebaseUid(req.userId!);
    await CaregiversService.revoke(owner.id, relationId);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    ResponseHelper.noContent(res);
  } catch (error) {
    next(error);
  }
});

<<<<<<< HEAD
/** GET /api/v1/caregivers/monitoring — Get data for caregiver monitoring */
router.get('/monitoring/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const caregiverFirebaseUid = req.userId!;
    const { userId: targetUserId } = req.params as { userId: string };

    const caregiver = await prisma.user.findUnique({ where: { firebaseUid: caregiverFirebaseUid } });
    if (!caregiver) return ResponseHelper.notFound(res, 'Caregiver');

    // Verify caregiver has access to this user's data
    const relation = await prisma.caregiverRelation.findFirst({
      where: { userId: targetUserId, caregiverId: caregiver.id, isActive: true },
    });

    if (!relation) {
      throw new AuthorizationError('You do not have caregiver access to this user');
    }

    // Return today's doses and adherence for the monitored user
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayDoses = await prisma.doseEvent.findMany({
      where: { userId: targetUserId, scheduledDate: { gte: today, lte: endOfDay } },
      orderBy: { scheduledTime: 'asc' },
    });

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { name: true, nickname: true, photoUrl: true },
    });

    ResponseHelper.ok(res, { user, todayDoses, accessLevel: relation.accessLevel });
=======
router.get('/monitoring/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUserId = z.string().uuid().parse(req.params.userId);
    const caregiver = await CaregiversService.getOwnerByFirebaseUid(req.userId!);
    const result = await CaregiversService.monitoring(caregiver.id, targetUserId);
    ResponseHelper.ok(res, result);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  } catch (error) {
    next(error);
  }
});

export default router;
