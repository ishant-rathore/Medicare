// =============================================================================
// backend/src/modules/medicines/medicines.controller.ts
// HTTP request/response handling for medicines (thin controller)
// All business logic is in medicines.service.ts
// =============================================================================

import { NextFunction, Request, Response } from 'express';

import { ResponseHelper } from '../../shared/response.helper';
import { createMedicineSchema, medicineListQuerySchema, updateMedicineSchema } from './medicines.schema';
import { MedicinesService } from './medicines.service';

export const MedicinesController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const query = medicineListQuerySchema.parse(req.query);
      const result = await MedicinesService.listMedicines(userId, query);
      ResponseHelper.paginated(res, result.medicines, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const userId = req.userId!;
      const medicine = await MedicinesService.getMedicine(id, userId);
      ResponseHelper.ok(res, medicine);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const data = createMedicineSchema.parse(req.body);
      const medicine = await MedicinesService.createMedicine(userId, data);
      ResponseHelper.created(res, medicine, 'Medicine added successfully');
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const userId = req.userId!;
      const data = updateMedicineSchema.parse(req.body);
      const medicine = await MedicinesService.updateMedicine(id, userId, data);
      ResponseHelper.ok(res, medicine, 'Medicine updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const userId = req.userId!;
      await MedicinesService.deleteMedicine(id, userId);
      ResponseHelper.noContent(res);
    } catch (error) {
      next(error);
    }
  },

  async getLowStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const medicines = await MedicinesService.getLowStockMedicines(userId);
      ResponseHelper.ok(res, medicines);
    } catch (error) {
      next(error);
    }
  },

  async updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const userId = req.userId!;
      const { stockCount } = req.body as { stockCount: number };
      const medicine = await MedicinesService.updateStock(id, userId, stockCount);
      ResponseHelper.ok(res, medicine, 'Stock updated successfully');
    } catch (error) {
      next(error);
    }
  },
};
