// =============================================================================
// backend/src/modules/dose-events/dose-events.service.ts
// Dose-event business rules, ownership and idempotency semantics.
// =============================================================================

import { AuthorizationError, NotFoundError } from '../../shared/errors/app-error';
import { prisma } from '../../config/database';
import { CreateDoseEventDto, DoseStatus, UpdateDoseEventDto } from './dose-events.types';
import { DoseEventsRepository } from './dose-events.repository';

const allowedTransitions: Record<DoseStatus, DoseStatus[]> = {
  PENDING: ['PENDING', 'TAKEN', 'SNOOZED', 'SKIPPED', 'MISSED'],
  SNOOZED: ['SNOOZED', 'TAKEN', 'SKIPPED', 'MISSED'],
  TAKEN: ['TAKEN'],
  SKIPPED: ['SKIPPED'],
  MISSED: ['MISSED', 'TAKEN', 'SKIPPED'],
};

async function assertOwnedContext(userId: string, medicineId: string, reminderId?: string): Promise<void> {
  const medicine = await prisma.medicine.findFirst({
    where: { id: medicineId, userId, deletedAt: null },
    select: { id: true },
  });
  if (!medicine) throw new NotFoundError('Medicine');

  if (reminderId) {
    const reminder = await prisma.reminder.findFirst({
      where: { id: reminderId, userId, medicineId: medicine.id, deletedAt: null },
      select: { id: true },
    });
    if (!reminder) throw new NotFoundError('Reminder');
  }
}

export const DoseEventsService = {
  async createIdempotent(userId: string, data: CreateDoseEventDto) {
    await assertOwnedContext(userId, data.medicineId, data.reminderId);

    const existing = await prisma.doseEvent.findUnique({
      where: { localEventId: data.localEventId },
    });

    if (existing) {
      if (existing.userId !== userId) {
        throw new AuthorizationError('Dose event does not belong to the authenticated user');
      }

      if (existing.medicineId !== data.medicineId || existing.reminderId !== (data.reminderId ?? null)) {
        throw new AuthorizationError('Dose event identity conflicts with an existing event');
      }

      return { event: existing, duplicate: true };
    }

    const event = await DoseEventsRepository.create(userId, data);
    return { event, duplicate: false };
  },

  async updateStatus(userId: string, id: string, data: UpdateDoseEventDto) {
    const existing = await DoseEventsRepository.findById(id, userId);
    if (!existing) throw new NotFoundError('Dose event');

    const currentStatus = existing.status as DoseStatus;
    const nextStatus = data.status;

    if (!allowedTransitions[currentStatus].includes(nextStatus)) {
      throw new Error(`Invalid dose status transition: ${currentStatus} -> ${nextStatus}`);
    }

    if (nextStatus === 'SNOOZED' && !data.snoozeUntil && !existing.snoozeUntil) {
      throw new Error('snoozeUntil is required when status is SNOOZED');
    }

    if (nextStatus !== 'SNOOZED' && data.snoozeUntil) {
      throw new Error('snoozeUntil is only valid when status is SNOOZED');
    }

    return DoseEventsRepository.updateStatus(id, userId, data);
  },
};
