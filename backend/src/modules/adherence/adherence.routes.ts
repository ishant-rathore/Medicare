// =============================================================================
// backend/src/modules/adherence/adherence.routes.ts
// Adherence score and statistics
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
import { AdherenceService } from './adherence.service';
import { prisma } from '../../config/database';

const router = Router();

const adherenceQuerySchema = z.object({
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
});

router.use(requireAuth);

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
  } catch (error) {
    next(error);
  }
});

export default router;
