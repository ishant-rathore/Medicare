import { prisma } from '../../config/database';
import { AdherenceService } from '../../modules/adherence/adherence.service';

jest.mock('../../config/database', () => ({
  prisma: { doseEvent: { groupBy: jest.fn() } },
}));

describe('AdherenceService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calculates adherence from persisted dose statuses', async () => {
    (prisma.doseEvent.groupBy as jest.Mock).mockResolvedValue([
      { status: 'TAKEN', _count: { _all: 8 } },
      { status: 'SKIPPED', _count: { _all: 2 } },
    ]);

    await expect(
      AdherenceService.getScore('user-1', '2026-08-01', '2026-08-31'),
    ).resolves.toEqual({
      adherenceScore: 80,
      totalDoses: 10,
      breakdown: { TAKEN: 8, SKIPPED: 2 },
      period: { startDate: '2026-08-01', endDate: '2026-08-31' },
    });
  });

  it('rejects an inverted date range', async () => {
    await expect(
      AdherenceService.getScore('user-1', '2026-09-01', '2026-08-31'),
    ).rejects.toThrow('endDate must be on or after startDate');
  });
});
