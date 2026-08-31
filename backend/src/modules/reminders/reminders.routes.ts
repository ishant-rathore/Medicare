// =============================================================================
// backend/src/modules/reminders/reminders.routes.ts
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
<<<<<<< HEAD
import { NotFoundError, AuthorizationError } from '../../shared/errors/app-error';
import { prisma } from '../../config/database';

const router = Router();

const createReminderSchema = z.object({
  medicineId: z.string().uuid(),
  scheduledTimes: z.array(z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM')).min(1).max(10),
  recurrence: z.enum(['ONE_TIME', 'DAILY', 'WEEKLY', 'ALTERNATE_DAYS', 'EVERY_8_HOURS', 'EVERY_12_HOURS', 'AS_NEEDED']),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).default([]),
=======
import { RemindersService } from './reminders.service';

const router = Router();

const reminderSchema = z.object({
  medicineId: z.string().uuid(),
  scheduledTimes: z.array(z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be HH:MM')).min(1).max(10),
  recurrence: z.enum(['ONE_TIME', 'DAILY', 'WEEKLY', 'ALTERNATE_DAYS', 'EVERY_8_HOURS', 'EVERY_12_HOURS', 'AS_NEEDED']),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).max(7).default([]),
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  snoozeMinutes: z.number().int().min(1).max(60).default(10),
  notes: z.string().max(500).optional(),
});

<<<<<<< HEAD
router.use(requireAuth);

/** GET /api/v1/reminders — List all reminders for user */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    // Get the internal user ID from firebase uid
    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const reminders = await prisma.reminder.findMany({
      where: { userId: user.id, deletedAt: null },
      include: { medicine: { select: { name: true, dosage: true, type: true, color: true } } },
      orderBy: { createdAt: 'desc' },
    });
    ResponseHelper.ok(res, reminders);
=======
const updateReminderSchema = reminderSchema.partial().extend({
  isActive: z.boolean().optional(),
});

router.use(requireAuth);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    ResponseHelper.ok(res, await RemindersService.list(req.userId!));
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  } catch (error) {
    next(error);
  }
});

<<<<<<< HEAD
/** POST /api/v1/reminders — Create a reminder */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const data = createReminderSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    // Verify medicine ownership
    const medicine = await prisma.medicine.findFirst({
      where: { id: data.medicineId, userId: user.id, deletedAt: null },
    });
    if (!medicine) throw new NotFoundError('Medicine');

    const reminder = await prisma.reminder.create({
      data: {
        userId: user.id,
        medicineId: data.medicineId,
        scheduledTimes: data.scheduledTimes,
        recurrence: data.recurrence as never,
        daysOfWeek: data.daysOfWeek,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        snoozeMinutes: data.snoozeMinutes,
        notes: data.notes,
      },
    });

=======
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = reminderSchema.parse(req.body);
    const reminder = await RemindersService.create(req.userId!, data);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    ResponseHelper.created(res, reminder, 'Reminder scheduled successfully');
  } catch (error) {
    next(error);
  }
});

<<<<<<< HEAD
/** PUT /api/v1/reminders/:id — Update a reminder */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.userId!;
    const data = createReminderSchema.partial().parse(req.body);

    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const existing = await prisma.reminder.findFirst({ where: { id, userId: user.id, deletedAt: null } });
    if (!existing) throw new NotFoundError('Reminder');

    const updated = await prisma.reminder.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        recurrence: data.recurrence as never,
        updatedAt: new Date(),
      },
    });

    ResponseHelper.ok(res, updated);
=======
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = z.string().uuid().parse(req.params.id);
    const data = updateReminderSchema.parse(req.body);
    const updated = await RemindersService.update(req.userId!, id, data);
    ResponseHelper.ok(res, updated, 'Reminder updated');
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  } catch (error) {
    next(error);
  }
});

<<<<<<< HEAD
/** DELETE /api/v1/reminders/:id */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.userId!;

    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const existing = await prisma.reminder.findFirst({ where: { id, userId: user.id, deletedAt: null } });
    if (!existing) throw new NotFoundError('Reminder');

    await prisma.reminder.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
=======
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = z.string().uuid().parse(req.params.id);
    await RemindersService.deactivate(req.userId!, id);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    ResponseHelper.noContent(res);
  } catch (error) {
    next(error);
  }
});

export default router;
