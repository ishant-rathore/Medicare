// =============================================================================
// backend/src/modules/reminders/reminders.routes.ts
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
import { RemindersService } from './reminders.service';

const router = Router();

const reminderSchema = z.object({
  medicineId: z.string().uuid(),
  scheduledTimes: z.array(z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be HH:MM')).min(1).max(10),
  recurrence: z.enum(['ONE_TIME', 'DAILY', 'WEEKLY', 'ALTERNATE_DAYS', 'EVERY_8_HOURS', 'EVERY_12_HOURS', 'AS_NEEDED']),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).max(7).default([]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  snoozeMinutes: z.number().int().min(1).max(60).default(10),
  notes: z.string().max(500).optional(),
});

const updateReminderSchema = reminderSchema.partial().extend({
  isActive: z.boolean().optional(),
});

router.use(requireAuth);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    ResponseHelper.ok(res, await RemindersService.list(req.userId!));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = reminderSchema.parse(req.body);
    const reminder = await RemindersService.create(req.userId!, data);
    ResponseHelper.created(res, reminder, 'Reminder scheduled successfully');
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = z.string().uuid().parse(req.params.id);
    const data = updateReminderSchema.parse(req.body);
    const updated = await RemindersService.update(req.userId!, id, data);
    ResponseHelper.ok(res, updated, 'Reminder updated');
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = z.string().uuid().parse(req.params.id);
    await RemindersService.deactivate(req.userId!, id);
    ResponseHelper.noContent(res);
  } catch (error) {
    next(error);
  }
});

export default router;
