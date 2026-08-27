// =============================================================================
// backend/src/modules/medicines/medicines.service.ts
// Business logic for the medicines module
// =============================================================================

import { NotFoundError, AuthorizationError } from '../../shared/errors/app-error';
import { toMedicineResponse, toMedicineResponseList } from './medicines.mapper';
import { MedicinesRepository } from './medicines.repository';
import { CreateMedicineInput, MedicineListQueryInput, UpdateMedicineInput } from './medicines.schema';
import { MedicineResponse } from './medicines.types';

export const MedicinesService = {
  async getMedicine(id: string, requestingUserId: string): Promise<MedicineResponse> {
    const medicine = await MedicinesRepository.findById(id, requestingUserId);
    if (!medicine) {
      throw new NotFoundError('Medicine');
    }
    // Resource ownership check
    if (medicine.userId !== requestingUserId) {
      throw new AuthorizationError('You do not have access to this medicine');
    }
    return toMedicineResponse(medicine);
  },

  async listMedicines(
    userId: string,
    query: MedicineListQueryInput,
  ): Promise<{ medicines: MedicineResponse[]; total: number; page: number; limit: number }> {
    const { medicines, total } = await MedicinesRepository.findAll(userId, query);
    return {
      medicines: toMedicineResponseList(medicines),
      total,
      page: query.page,
      limit: query.limit,
    };
  },

  async createMedicine(userId: string, data: CreateMedicineInput): Promise<MedicineResponse> {
    const medicine = await MedicinesRepository.create(userId, data);
    return toMedicineResponse(medicine);
  },

  async updateMedicine(
    id: string,
    userId: string,
    data: UpdateMedicineInput,
  ): Promise<MedicineResponse> {
    const existing = await MedicinesRepository.findById(id, userId);
    if (!existing) {
      throw new NotFoundError('Medicine');
    }
    if (existing.userId !== userId) {
      throw new AuthorizationError('You do not have access to this medicine');
    }
    const updated = await MedicinesRepository.update(id, userId, data);
    return toMedicineResponse(updated);
  },

  async deleteMedicine(id: string, userId: string): Promise<void> {
    const existing = await MedicinesRepository.findById(id, userId);
    if (!existing) {
      throw new NotFoundError('Medicine');
    }
    if (existing.userId !== userId) {
      throw new AuthorizationError('You do not have access to this medicine');
    }
    await MedicinesRepository.softDelete(id, userId);
  },

  async getLowStockMedicines(userId: string): Promise<MedicineResponse[]> {
    const medicines = await MedicinesRepository.findLowStock(userId);
    // Filter those actually below threshold
    const lowStock = medicines.filter((m) => m.stockCount <= m.lowStockThreshold);
    return toMedicineResponseList(lowStock);
  },

  async updateStock(id: string, userId: string, stockCount: number): Promise<MedicineResponse> {
    const existing = await MedicinesRepository.findById(id, userId);
    if (!existing) throw new NotFoundError('Medicine');
    if (existing.userId !== userId) throw new AuthorizationError('Access denied');
    const updated = await MedicinesRepository.updateStock(id, userId, stockCount);
    return toMedicineResponse(updated);
  },
};
