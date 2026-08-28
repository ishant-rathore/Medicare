// =============================================================================
// backend/src/modules/adherence/adherence.service.ts
// Adherence aggregation derived only from persisted dose events.
// =============================================================================

import { prisma } from '../../config/database';

export interface AdherenceSummary {
  adherenceScore: number;
  totalDoses: number;
  breakdown: Record<string, number>;
  period: { startDate: string; endDate: string };
}

export const AdherenceService = {
  async getScore(userId: string, startDate: string, endDate: string): Promise<AdherenceSummary> {
    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T23:59:59.999Z`);
    if (end < start) throw new Error('endDate must be on or after startDate');

    const stats = await prisma.doseEvent.groupBy({
      by: ['status'],
      where: { userId, scheduledDate: { gte: start, lte: end } },
      _count: { _all: true },
    });

    const breakdown: Record<string, number> = {};
    let total = 0;
    let taken = 0;

    for (const stat of stats) {
      const count = stat._count._all;
      breakdown[stat.status] = count;
      total += count;
      if (stat.status === 'TAKEN') taken = count;
    }

    return {
      adherenceScore: total === 0 ? 0 : Math.round((taken / total) * 100),
      totalDoses: total,
      breakdown,
      period: { startDate, endDate },
    };
  },
};
