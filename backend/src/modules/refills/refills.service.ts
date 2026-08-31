// =============================================================================
// backend/src/modules/refills/refills.service.ts
// Refill business logic with atomic stock/rule updates.
// =============================================================================

import { prisma } from '../../config/database';
import { NotFoundError } from '../../shared/errors/app-error';

export const RefillsService = {
  async list(userId: string) {
    return prisma.refillRule.findMany({
      where: { userId },
      include: {
        medicine: {
          select: { name: true, stockCount: true, lowStockThreshold: true, isActive: true, deletedAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async upsert(userId: string, data: {
    medicineId: string;
    lowStockThreshold: number;
    refillQuantity: number;
    autoAlertEnabled: boolean;
    pharmacyName?: string;
    pharmacyPhone?: string;
    notes?: string;
  }) {
    const medicine = await prisma.medicine.findFirst({
      where: { id: data.medicineId, userId, deletedAt: null },
      select: { id: true },
    });
    if (!medicine) throw new NotFoundError('Medicine');

    return prisma.refillRule.upsert({
      where: { medicineId: data.medicineId },
      create: { ...data, userId },
      update: {
        lowStockThreshold: data.lowStockThreshold,
        refillQuantity: data.refillQuantity,
        autoAlertEnabled: data.autoAlertEnabled,
        pharmacyName: data.pharmacyName,
        pharmacyPhone: data.pharmacyPhone,
        notes: data.notes,
        updatedAt: new Date(),
      },
    });
  },

  async recordRefill(userId: string, ruleId: string) {
    return prisma.$transaction(async (tx) => {
      const rule = await tx.refillRule.findFirst({
        where: { id: ruleId, userId },
      });
      if (!rule) throw new NotFoundError('Refill rule');

      const medicine = await tx.medicine.findFirst({
        where: { id: rule.medicineId, userId, deletedAt: null },
        select: { id: true },
      });
      if (!medicine) throw new NotFoundError('Medicine');

      const now = new Date();
      const nextRefillDate = new Date(now);
      nextRefillDate.setDate(nextRefillDate.getDate() + 30);

      const updatedRule = await tx.refillRule.update({
        where: { id: rule.id },
        data: {
          lastRefillDate: now,
          nextRefillDate,
          updatedAt: now,
        },
      });

      await tx.medicine.update({
        where: { id: rule.medicineId },
        data: { stockCount: rule.refillQuantity, updatedAt: now },
      });

      return updatedRule;
    });
  },
};
