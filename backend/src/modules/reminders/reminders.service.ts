// =============================================================================
// backend/src/modules/reminders/reminders.service.ts
// Reminder business logic and ownership validation.
// =============================================================================

import { NotFoundError } from '../../shared/errors/app-error';
import { prisma } from '../../config/database';

export const RemindersService = {
  async ensureMedicineOwned(userId: string, medicineId: string): Promise<void> {
    const medicine = await prisma.medicine.findFirst({
      where: { id: medicineId, userId, deletedAt: null },
      select: { id: true },
    });

    if (!medicine) throw new NotFoundError('Medicine');
  },

  async list(userId: string) {
    return prisma.reminder.findMany({
      where: { userId, deletedAt: null },
      include: {
        medicine: {
          select: { name: true, dosage: true, type: true, color: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async create(userId: string, data: {
    medicineId: string;
    scheduledTimes: string[];
    recurrence: string;
    daysOfWeek: number[];
    startDate: string;
    endDate?: string;
    snoozeMinutes: number;
    notes?: string;
  }) {
    await RemindersService.ensureMedicineOwned(userId, data.medicineId);

    if (data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
      throw new Error('endDate must be on or after startDate');
    }

    if ((data.recurrence === 'WEEKLY') && data.daysOfWeek.length === 0) {
      throw new Error('daysOfWeek is required for weekly reminders');
    }

    if (data.recurrence !== 'WEEKLY' && data.daysOfWeek.length > 0) {
      throw new Error('daysOfWeek is only valid for weekly reminders');
    }

    return prisma.reminder.create({
      data: {
        userId,
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
  },

  async update(userId: string, id: string, data: Partial<{
    medicineId: string;
    scheduledTimes: string[];
    recurrence: string;
    daysOfWeek: number[];
    startDate: string;
    endDate?: string;
    snoozeMinutes: number;
    notes?: string;
    isActive: boolean;
  }>) {
    const existing = await prisma.reminder.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!existing) throw new NotFoundError('Reminder');

    if (data.medicineId) await RemindersService.ensureMedicineOwned(userId, data.medicineId);

    const startDate = data.startDate ? new Date(data.startDate) : existing.startDate;
    const endDate = data.endDate === undefined
      ? existing.endDate
      : new Date(data.endDate);

    if (endDate && endDate < startDate) {
      throw new Error('endDate must be on or after startDate');
    }

    const recurrence = data.recurrence ?? existing.recurrence;
    const daysOfWeek = data.daysOfWeek ?? existing.daysOfWeek;

    if (recurrence === 'WEEKLY' && daysOfWeek.length === 0) {
      throw new Error('daysOfWeek is required for weekly reminders');
    }
    if (recurrence !== 'WEEKLY' && daysOfWeek.length > 0) {
      throw new Error('daysOfWeek is only valid for weekly reminders');
    }

    return prisma.reminder.update({
      where: { id },
      data: {
        ...(data.medicineId ? { medicineId: data.medicineId } : {}),
        ...(data.scheduledTimes ? { scheduledTimes: data.scheduledTimes } : {}),
        recurrence: recurrence as never,
        daysOfWeek,
        startDate,
        endDate,
        ...(data.snoozeMinutes !== undefined ? { snoozeMinutes: data.snoozeMinutes } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        updatedAt: new Date(),
      },
    });
  },

  async deactivate(userId: string, id: string): Promise<void> {
    const existing = await prisma.reminder.findFirst({
      where: { id, userId, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundError('Reminder');

    await prisma.reminder.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false, updatedAt: new Date() },
    });
  },
};
