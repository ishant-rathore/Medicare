// =============================================================================
// backend/src/modules/dose-events/dose-events.routes.ts
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
<<<<<<< HEAD
import { NotFoundError } from '../../shared/errors/app-error';
import { DoseEventsRepository } from './dose-events.repository';
=======
import { DoseEventsRepository } from './dose-events.repository';
import { DoseEventsService } from './dose-events.service';
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
import { prisma } from '../../config/database';

const router = Router();

const createDoseEventSchema = z.object({
<<<<<<< HEAD
  localEventId: z.string().uuid('localEventId must be a UUID'),
  medicineId: z.string().uuid(),
  reminderId: z.string().uuid().optional(),
  medicineName: z.string().min(1).max(200),
  dosage: z.string().min(1).max(100),
  mealTiming: z.enum(['BEFORE_FOOD', 'AFTER_FOOD', 'WITH_FOOD', 'AFTER_DINNER', 'EMPTY_STOMACH', 'BEDTIME']),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/),
=======
  localEventId: z.string().uuid(),
  medicineId: z.string().uuid(),
  reminderId: z.string().uuid().optional(),
  medicineName: z.string().trim().min(1).max(200),
  dosage: z.string().trim().min(1).max(100),
  mealTiming: z.enum(['BEFORE_FOOD', 'AFTER_FOOD', 'WITH_FOOD', 'AFTER_DINNER', 'EMPTY_STOMACH', 'BEDTIME']),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['PENDING', 'TAKEN', 'SNOOZED', 'SKIPPED', 'MISSED']),
  actionAt: z.string().datetime().optional(),
  snoozeUntil: z.string().datetime().optional(),
  spokenScript: z.string().max(1000).optional(),
  notes: z.string().max(500).optional(),
});

const historyQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  medicineId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'TAKEN', 'SNOOZED', 'SKIPPED', 'MISSED']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

router.use(requireAuth);

<<<<<<< HEAD
/** GET /api/v1/dose-events — List dose events (history) */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
=======
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid: req.userId! }, select: { id: true } });
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    if (!user) return ResponseHelper.notFound(res, 'User');

    const query = historyQuerySchema.parse(req.query);
    const { events, total } = await DoseEventsRepository.findHistory(user.id, query);
    ResponseHelper.paginated(res, events, { page: query.page, limit: query.limit, total });
  } catch (error) {
    next(error);
  }
});

<<<<<<< HEAD
/** GET /api/v1/dose-events/today — Today's dose events */
router.get('/today', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
=======
router.get('/today', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid: req.userId! }, select: { id: true } });
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    if (!user) return ResponseHelper.notFound(res, 'User');

    const events = await DoseEventsRepository.findTodayEvents(user.id, new Date());
    ResponseHelper.ok(res, events);
  } catch (error) {
    next(error);
  }
});

<<<<<<< HEAD
/** POST /api/v1/dose-events — Create/upsert dose event (idempotent) */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const data = createDoseEventSchema.parse(req.body);
    const event = await DoseEventsRepository.upsertByLocalEventId(user.id, data as never);
=======
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid: req.userId! }, select: { id: true } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const data = createDoseEventSchema.parse(req.body);
    const { event, duplicate } = await DoseEventsService.createIdempotent(user.id, data);
    if (duplicate) {
      ResponseHelper.ok(res, event, 'Dose event already synchronized');
      return;
    }
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    ResponseHelper.created(res, event);
  } catch (error) {
    next(error);
  }
});

<<<<<<< HEAD
/** PATCH /api/v1/dose-events/:id/status — Update dose status */
router.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

=======
router.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = z.string().uuid().parse(req.params.id);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    const data = z.object({
      status: z.enum(['TAKEN', 'SNOOZED', 'SKIPPED', 'MISSED']),
      actionAt: z.string().datetime().optional(),
      snoozeUntil: z.string().datetime().optional(),
<<<<<<< HEAD
    }).parse(req.body);

    const existing = await DoseEventsRepository.findById(id, user.id);
    if (!existing) throw new NotFoundError('Dose event');

    const updated = await DoseEventsRepository.updateStatus(id, user.id, data as never);
=======
      notes: z.string().max(500).optional(),
    }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { firebaseUid: req.userId! }, select: { id: true } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const updated = await DoseEventsService.updateStatus(user.id, id, data);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    ResponseHelper.ok(res, updated, 'Dose status updated');
  } catch (error) {
    next(error);
  }
});

export default router;
