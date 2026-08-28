// =============================================================================
// backend/src/modules/dose-events/dose-events.routes.ts
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
import { DoseEventsRepository } from './dose-events.repository';
import { DoseEventsService } from './dose-events.service';
import { prisma } from '../../config/database';

const router = Router();

const createDoseEventSchema = z.object({
  localEventId: z.string().uuid(),
  medicineId: z.string().uuid(),
  reminderId: z.string().uuid().optional(),
  medicineName: z.string().trim().min(1).max(200),
  dosage: z.string().trim().min(1).max(100),
  mealTiming: z.enum(['BEFORE_FOOD', 'AFTER_FOOD', 'WITH_FOOD', 'AFTER_DINNER', 'EMPTY_STOMACH', 'BEDTIME']),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
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

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid: req.userId! }, select: { id: true } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const query = historyQuerySchema.parse(req.query);
    const { events, total } = await DoseEventsRepository.findHistory(user.id, query);
    ResponseHelper.paginated(res, events, { page: query.page, limit: query.limit, total });
  } catch (error) {
    next(error);
  }
});

router.get('/today', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid: req.userId! }, select: { id: true } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const events = await DoseEventsRepository.findTodayEvents(user.id, new Date());
    ResponseHelper.ok(res, events);
  } catch (error) {
    next(error);
  }
});

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
    ResponseHelper.created(res, event);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = z.string().uuid().parse(req.params.id);
    const data = z.object({
      status: z.enum(['TAKEN', 'SNOOZED', 'SKIPPED', 'MISSED']),
      actionAt: z.string().datetime().optional(),
      snoozeUntil: z.string().datetime().optional(),
      notes: z.string().max(500).optional(),
    }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { firebaseUid: req.userId! }, select: { id: true } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const updated = await DoseEventsService.updateStatus(user.id, id, data);
    ResponseHelper.ok(res, updated, 'Dose status updated');
  } catch (error) {
    next(error);
  }
});

export default router;
