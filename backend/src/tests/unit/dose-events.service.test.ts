import { AuthorizationError, NotFoundError } from '../../shared/errors/app-error';
import { prisma } from '../../config/database';
import { DoseEventsRepository } from '../../modules/dose-events/dose-events.repository';
import { DoseEventsService } from '../../modules/dose-events/dose-events.service';

jest.mock('../../config/database', () => ({
  prisma: {
    medicine: { findFirst: jest.fn() },
    reminder: { findFirst: jest.fn() },
    doseEvent: { findUnique: jest.fn() },
  },
}));

jest.mock('../../modules/dose-events/dose-events.repository', () => ({
  DoseEventsRepository: {
    create: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(),
  },
}));

describe('DoseEventsService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('rejects a dose event for a medicine the user does not own', async () => {
    (prisma.medicine.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(
      DoseEventsService.createIdempotent('user-1', {
        localEventId: '00000000-0000-4000-8000-000000000001',
        medicineId: '00000000-0000-4000-8000-000000000002',
        medicineName: 'Medicine',
        dosage: '1 tablet',
        mealTiming: 'AFTER_FOOD',
        scheduledTime: '08:00',
        scheduledDate: '2026-08-28',
        status: 'TAKEN',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('returns an existing event without creating a duplicate', async () => {
    (prisma.medicine.findFirst as jest.Mock).mockResolvedValue({ id: 'medicine-1' });
    (prisma.doseEvent.findUnique as jest.Mock).mockResolvedValue({
      id: 'event-1',
      localEventId: '00000000-0000-4000-8000-000000000001',
      userId: 'user-1',
      medicineId: 'medicine-1',
      reminderId: null,
      status: 'TAKEN',
    });

    const result = await DoseEventsService.createIdempotent('user-1', {
      localEventId: '00000000-0000-4000-8000-000000000001',
      medicineId: 'medicine-1',
      medicineName: 'Medicine',
      dosage: '1 tablet',
      mealTiming: 'AFTER_FOOD',
      scheduledTime: '08:00',
      scheduledDate: '2026-08-28',
      status: 'TAKEN',
    });

    expect(result).toEqual({ event: expect.objectContaining({ id: 'event-1' }), duplicate: true });
    expect(DoseEventsRepository.create).not.toHaveBeenCalled();
  });

  it('rejects an existing local event owned by another user', async () => {
    (prisma.medicine.findFirst as jest.Mock).mockResolvedValue({ id: 'medicine-1' });
    (prisma.doseEvent.findUnique as jest.Mock).mockResolvedValue({
      id: 'event-1',
      localEventId: '00000000-0000-4000-8000-000000000001',
      userId: 'other-user',
      medicineId: 'medicine-1',
      reminderId: null,
    });

    await expect(
      DoseEventsService.createIdempotent('user-1', {
        localEventId: '00000000-0000-4000-8000-000000000001',
        medicineId: 'medicine-1',
        medicineName: 'Medicine',
        dosage: '1 tablet',
        mealTiming: 'AFTER_FOOD',
        scheduledTime: '08:00',
        scheduledDate: '2026-08-28',
        status: 'TAKEN',
      }),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it('rejects invalid status transitions from TAKEN', async () => {
    (DoseEventsRepository.findById as jest.Mock).mockResolvedValue({
      id: 'event-1',
      userId: 'user-1',
      status: 'TAKEN',
      snoozeUntil: null,
    });

    await expect(
      DoseEventsService.updateStatus('user-1', 'event-1', { status: 'SKIPPED' }),
    ).rejects.toThrow('Invalid dose status transition');
  });
});
