// =============================================================================
// backend/src/modules/adherence/adherence.routes.ts
// Adherence score and statistics
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
<<<<<<< HEAD
import { DoseEventsRepository } from '../dose-events/dose-events.repository';
=======
import { AdherenceService } from './adherence.service';
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
import { prisma } from '../../config/database';

const router = Router();

const adherenceQuerySchema = z.object({
<<<<<<< HEAD
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0]!;
  }),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(() => new Date().toISOString().split('T')[0]!),
=======
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).transform(({ startDate, endDate }) => {
  const end = endDate ?? new Date().toISOString().slice(0, 10);
  const start = startDate ?? (() => {
    const d = new Date(`${end}T00:00:00.000Z`);
    d.setUTCDate(d.getUTCDate() - 30);
    return d.toISOString().slice(0, 10);
  })();
  return { startDate: start, endDate: end };
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
});

router.use(requireAuth);

<<<<<<< HEAD
/**
 * GET /api/v1/adherence/score
 * Returns adherence percentage and breakdown by status
 */
router.get('/score', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const { startDate, endDate } = adherenceQuerySchema.parse(req.query);
    const stats = await DoseEventsRepository.getAdherenceStats(
      user.id,
      new Date(startDate),
      new Date(endDate),
    );

    const breakdown: Record<string, number> = {};
    let total = 0;
    let taken = 0;

    for (const stat of stats) {
      breakdown[stat.status] = stat._count.status;
      total += stat._count.status;
      if (stat.status === 'TAKEN') taken = stat._count.status;
    }

    const adherenceScore = total > 0 ? Math.round((taken / total) * 100) : 0;

    ResponseHelper.ok(res, {
      adherenceScore,
      totalDoses: total,
      breakdown,
      period: { startDate, endDate },
    });
=======
router.get('/score', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.userId! },
      select: { id: true, isActive: true },
    });
    if (!user || !user.isActive) return ResponseHelper.notFound(res, 'User');

    const { startDate, endDate } = adherenceQuerySchema.parse(req.query);
    const result = await AdherenceService.getScore(user.id, startDate, endDate);
    ResponseHelper.ok(res, result);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  } catch (error) {
    next(error);
  }
});

export default router;
