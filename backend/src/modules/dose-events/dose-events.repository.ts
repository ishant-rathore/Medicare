// =============================================================================
// backend/src/modules/dose-events/dose-events.repository.ts
// Dose events repository — uses upsert on localEventId for idempotency
// =============================================================================

import { Prisma } from '@prisma/client';

import { prisma } from '../../config/database';
import { CreateDoseEventDto, DoseHistoryQuery, UpdateDoseEventDto } from './dose-events.types';

export const DoseEventsRepository = {
  /**
   * Idempotent create-or-update using localEventId.
   * If an event with this localEventId already exists, it will NOT be duplicated.
   * This is the core protection against double-sync of offline events.
   */
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
        scheduledDate: new Date(data.scheduledDate),
        status: (data.status ?? 'PENDING') as never,
        actionAt: data.actionAt ? new Date(data.actionAt) : undefined,
        snoozeUntil: data.snoozeUntil ? new Date(data.snoozeUntil) : undefined,
        spokenScript: data.spokenScript,
        notes: data.notes,
      },
      update: {
        // Only update status and action fields — do not overwrite existing server data
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
    return prisma.doseEvent.update({
      where: { id },
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
      ...(startDate ? { scheduledDate: { gte: new Date(startDate) } } : {}),
      ...(endDate ? { scheduledDate: { lte: new Date(endDate) } } : {}),
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
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.doseEvent.findMany({
      where: {
        userId,
        scheduledDate: { gte: startOfDay, lte: endOfDay },
      },
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
