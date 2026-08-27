// =============================================================================
// backend/src/modules/reminders/reminders.routes.ts
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
import { NotFoundError, AuthorizationError } from '../../shared/errors/app-error';
import { prisma } from '../../config/database';

const router = Router();

const createReminderSchema = z.object({
  medicineId: z.string().uuid(),
  scheduledTimes: z.array(z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM')).min(1).max(10),
  recurrence: z.enum(['ONE_TIME', 'DAILY', 'WEEKLY', 'ALTERNATE_DAYS', 'EVERY_8_HOURS', 'EVERY_12_HOURS', 'AS_NEEDED']),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).default([]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  snoozeMinutes: z.number().int().min(1).max(60).default(10),
  notes: z.string().max(500).optional(),
});

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
  } catch (error) {
    next(error);
  }
});

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

    ResponseHelper.created(res, reminder, 'Reminder scheduled successfully');
  } catch (error) {
    next(error);
  }
});

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
  } catch (error) {
    next(error);
  }
});

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
    ResponseHelper.noContent(res);
  } catch (error) {
    next(error);
  }
});

export default router;
