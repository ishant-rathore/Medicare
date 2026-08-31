// =============================================================================
// backend/src/modules/refills/refills.routes.ts
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { requireAuth } from '../../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response.helper';
<<<<<<< HEAD
import { prisma } from '../../config/database';
=======
import { RefillsService } from './refills.service';
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

const router = Router();

const refillRuleSchema = z.object({
  medicineId: z.string().uuid(),
  lowStockThreshold: z.number().int().min(1).max(999).default(5),
  refillQuantity: z.number().int().min(1).max(9999).default(30),
  autoAlertEnabled: z.boolean().default(true),
<<<<<<< HEAD
  pharmacyName: z.string().max(200).optional(),
  pharmacyPhone: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
=======
  pharmacyName: z.string().trim().max(200).optional(),
  pharmacyPhone: z.string().trim().max(20).optional(),
  notes: z.string().trim().max(500).optional(),
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
});

router.use(requireAuth);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
<<<<<<< HEAD
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const refills = await prisma.refillRule.findMany({
      where: { userId: user.id },
      include: { medicine: { select: { name: true, stockCount: true, lowStockThreshold: true } } },
    });

    ResponseHelper.ok(res, refills);
=======
    ResponseHelper.ok(res, await RefillsService.list(req.userId!));
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
<<<<<<< HEAD
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const data = refillRuleSchema.parse(req.body);

    // Verify medicine ownership
    const medicine = await prisma.medicine.findFirst({ where: { id: data.medicineId, userId: user.id } });
    if (!medicine) return ResponseHelper.notFound(res, 'Medicine');

    const rule = await prisma.refillRule.upsert({
      where: { medicineId: data.medicineId },
      create: { ...data, userId: user.id },
      update: { ...data, updatedAt: new Date() },
    });

    ResponseHelper.created(res, rule);
=======
    const data = refillRuleSchema.parse(req.body);
    const rule = await RefillsService.upsert(req.userId!, data);
    ResponseHelper.ok(res, rule, 'Refill rule saved');
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/refilled', async (req: Request, res: Response, next: NextFunction) => {
  try {
<<<<<<< HEAD
    const { id } = req.params as { id: string };
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { firebaseUid: userId } });
    if (!user) return ResponseHelper.notFound(res, 'User');

    const rule = await prisma.refillRule.findFirst({ where: { id, userId: user.id } });
    if (!rule) return ResponseHelper.notFound(res, 'Refill rule');

    const today = new Date();
    const nextRefill = new Date();
    nextRefill.setDate(today.getDate() + 30);

    const updated = await prisma.refillRule.update({
      where: { id },
      data: { lastRefillDate: today, nextRefillDate: nextRefill },
    });

    // Update medicine stock count
    await prisma.medicine.update({
      where: { id: rule.medicineId },
      data: { stockCount: rule.refillQuantity },
    });

=======
    const id = z.string().uuid().parse(req.params.id);
    const updated = await RefillsService.recordRefill(req.userId!, id);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    ResponseHelper.ok(res, updated, 'Refill recorded and stock updated');
  } catch (error) {
    next(error);
  }
});

export default router;
