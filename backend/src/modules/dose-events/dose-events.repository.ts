// =============================================================================
// backend/src/modules/dose-events/dose-events.repository.ts
<<<<<<< HEAD
// Dose events repository — uses upsert on localEventId for idempotency
=======
// Persistence boundary for dose events.
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
// =============================================================================

import { Prisma } from '@prisma/client';

import { prisma } from '../../config/database';
import { CreateDoseEventDto, DoseHistoryQuery, UpdateDoseEventDto } from './dose-events.types';

export const DoseEventsRepository = {
<<<<<<< HEAD
  /**
   * Idempotent create-or-update using localEventId.
   * If an event with this localEventId already exists, it will NOT be duplicated.
   * This is the core protection against double-sync of offline events.
   */
=======
  async create(userId: string, data: CreateDoseEventDto) {
    return prisma.doseEvent.create({
      data: {
        localEventId: data.localEventId,
        userId,
        medicineId: data.medicineId,
        reminderId: data.reminderId,
        medicineName: data.medicineName,
        dosage: data.dosage,
        mealTiming: data.mealTiming as never,
        scheduledTime: data.scheduledTime,
        scheduledDate: new Date(`${data.scheduledDate}T00:00:00.000Z`),
        status: data.status as never,
        actionAt: data.actionAt ? new Date(data.actionAt) : undefined,
        snoozeUntil: data.snoozeUntil ? new Date(data.snoozeUntil) : undefined,
        spokenScript: data.spokenScript,
        notes: data.notes,
      },
    });
  },

>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  async upsertByLocalEventId(userId: string, data: CreateDoseEventDto) {
    return prisma.doseEvent.upsert({
      where: { localEventId: data.localEventId },
      create: {
        localEventId: data.localEventId,
        userId,
        medicineId: data.medicineId,
        reminderId: data.reminderId,
        medicineName: data.medicineName,
        dosage: data.dosage,
        mealTiming: data.mealTiming as never,
        scheduledTime: data.scheduledTime,
<<<<<<< HEAD
        scheduledDate: new Date(data.scheduledDate),
=======
        scheduledDate: new Date(`${data.scheduledDate}T00:00:00.000Z`),
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
        status: (data.status ?? 'PENDING') as never,
        actionAt: data.actionAt ? new Date(data.actionAt) : undefined,
        snoozeUntil: data.snoozeUntil ? new Date(data.snoozeUntil) : undefined,
        spokenScript: data.spokenScript,
        notes: data.notes,
      },
      update: {
<<<<<<< HEAD
        // Only update status and action fields — do not overwrite existing server data
=======
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
        status: (data.status ?? 'PENDING') as never,
        actionAt: data.actionAt ? new Date(data.actionAt) : undefined,
        snoozeUntil: data.snoozeUntil ? new Date(data.snoozeUntil) : undefined,
        notes: data.notes,
        updatedAt: new Date(),
      },
    });
  },

  async findById(id: string, userId: string) {
    return prisma.doseEvent.findFirst({
      where: { id, userId },
    });
  },

  async updateStatus(id: string, userId: string, data: UpdateDoseEventDto) {
<<<<<<< HEAD
    return prisma.doseEvent.update({
      where: { id },
=======
    return prisma.doseEvent.updateMany({
      where: { id, userId },
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
      data: {
        status: data.status as never,
        actionAt: data.actionAt ? new Date(data.actionAt) : undefined,
        snoozeUntil: data.snoozeUntil ? new Date(data.snoozeUntil) : undefined,
        notes: data.notes,
        updatedAt: new Date(),
      },
    });
  },

  async findHistory(userId: string, query: DoseHistoryQuery) {
    const { startDate, endDate, medicineId, status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.DoseEventWhereInput = {
      userId,
<<<<<<< HEAD
      ...(startDate ? { scheduledDate: { gte: new Date(startDate) } } : {}),
      ...(endDate ? { scheduledDate: { lte: new Date(endDate) } } : {}),
=======
      ...(startDate ? { scheduledDate: { gte: new Date(`${startDate}T00:00:00.000Z`) } } : {}),
      ...(endDate ? { scheduledDate: { lte: new Date(`${endDate}T23:59:59.999Z`) } } : {}),
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
      ...(medicineId ? { medicineId } : {}),
      ...(status ? { status: status as never } : {}),
    };

    const [events, total] = await Promise.all([
      prisma.doseEvent.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ scheduledDate: 'desc' }, { scheduledTime: 'desc' }],
      }),
      prisma.doseEvent.count({ where }),
    ]);

    return { events, total };
  },

  async findTodayEvents(userId: string, date: Date) {
<<<<<<< HEAD
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.doseEvent.findMany({
      where: {
        userId,
        scheduledDate: { gte: startOfDay, lte: endOfDay },
      },
=======
    const dateValue = date.toISOString().slice(0, 10);
    const startOfDay = new Date(`${dateValue}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateValue}T23:59:59.999Z`);

    return prisma.doseEvent.findMany({
      where: { userId, scheduledDate: { gte: startOfDay, lte: endOfDay } },
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
      orderBy: { scheduledTime: 'asc' },
    });
  },

  async getAdherenceStats(userId: string, startDate: Date, endDate: Date) {
    return prisma.doseEvent.groupBy({
      by: ['status'],
      where: {
        userId,
        scheduledDate: { gte: startDate, lte: endDate },
      },
      _count: { status: true },
    });
  },
};
