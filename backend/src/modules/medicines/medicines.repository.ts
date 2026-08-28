// =============================================================================
// backend/src/modules/medicines/medicines.repository.ts
// Prisma queries for the medicines module — all queries are scoped to userId
// =============================================================================

import { Prisma } from '@prisma/client';

import { prisma } from '../../config/database';
import { CreateMedicineInput, MedicineListQueryInput, UpdateMedicineInput } from './medicines.schema';

export const MedicinesRepository = {
  async findById(id: string, userId: string) {
    return prisma.medicine.findFirst({ where: { id, userId, deletedAt: null } });
  },

  async findAll(userId: string, query: MedicineListQueryInput) {
    const { page, limit, isActive, search } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.MedicineWhereInput = {
      userId,
      deletedAt: null,
      ...(isActive !== undefined ? { isActive } : {}),
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { genericName: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
    };

    const [medicines, total] = await Promise.all([
      prisma.medicine.findMany({ where, skip, take: limit, orderBy: [{ isActive: 'desc' }, { name: 'asc' }] }),
      prisma.medicine.count({ where }),
    ]);
    return { medicines, total };
  },

  async create(userId: string, data: CreateMedicineInput) {
    return prisma.medicine.create({
      data: {
        userId,
        name: data.name,
        genericName: data.genericName,
        dosage: data.dosage,
        type: data.type,
        color: data.color,
        shape: data.shape,
        category: data.category,
        mealTiming: data.mealTiming,
        instructions: data.instructions ?? [],
        stockCount: data.stockCount ?? 30,
        lowStockThreshold: data.lowStockThreshold ?? 5,
        expiryDate: data.expiryDate ? new Date(`${data.expiryDate}T00:00:00.000Z`) : undefined,
        isEssential: data.isEssential ?? false,
        notes: data.notes,
        photoUrl: data.photoUrl || undefined,
        prescribedBy: data.prescribedBy,
        customVoiceScript: data.customVoiceScript,
        startDate: data.startDate ? new Date(`${data.startDate}T00:00:00.000Z`) : undefined,
        endDate: data.endDate ? new Date(`${data.endDate}T00:00:00.000Z`) : undefined,
      },
    });
  },

  async update(id: string, userId: string, data: UpdateMedicineInput) {
    const existing = await this.findById(id, userId);
    if (!existing) throw new Error('Medicine not found');
    return prisma.medicine.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.genericName !== undefined ? { genericName: data.genericName } : {}),
        ...(data.dosage !== undefined ? { dosage: data.dosage } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.color !== undefined ? { color: data.color } : {}),
        ...(data.shape !== undefined ? { shape: data.shape } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.mealTiming !== undefined ? { mealTiming: data.mealTiming } : {}),
        ...(data.instructions !== undefined ? { instructions: data.instructions } : {}),
        ...(data.stockCount !== undefined ? { stockCount: data.stockCount } : {}),
        ...(data.lowStockThreshold !== undefined ? { lowStockThreshold: data.lowStockThreshold } : {}),
        ...(data.expiryDate !== undefined ? { expiryDate: new Date(`${data.expiryDate}T00:00:00.000Z`) } : {}),
        ...(data.isEssential !== undefined ? { isEssential: data.isEssential } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(data.photoUrl !== undefined ? { photoUrl: data.photoUrl || null } : {}),
        ...(data.prescribedBy !== undefined ? { prescribedBy: data.prescribedBy } : {}),
        ...(data.customVoiceScript !== undefined ? { customVoiceScript: data.customVoiceScript } : {}),
        ...(data.startDate !== undefined ? { startDate: new Date(`${data.startDate}T00:00:00.000Z`) } : {}),
        ...(data.endDate !== undefined ? { endDate: new Date(`${data.endDate}T00:00:00.000Z`) } : {}),
        updatedAt: new Date(),
      },
    });
  },

  async softDelete(id: string, userId: string) {
    const existing = await this.findById(id, userId);
    if (!existing) throw new Error('Medicine not found');
    return prisma.medicine.update({ where: { id }, data: { deletedAt: new Date(), isActive: false, updatedAt: new Date() } });
  },

  async updateStock(id: string, userId: string, stockCount: number) {
    const existing = await this.findById(id, userId);
    if (!existing) throw new Error('Medicine not found');
    return prisma.medicine.update({ where: { id }, data: { stockCount, updatedAt: new Date() } });
  },

  async findLowStock(userId: string) {
    return prisma.medicine.findMany({
      where: { userId, isActive: true, deletedAt: null },
      orderBy: { stockCount: 'asc' },
    });
  },
};
