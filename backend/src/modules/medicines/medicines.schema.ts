// =============================================================================
// backend/src/modules/medicines/medicines.schema.ts
// Zod validation schemas for medicine API requests
// =============================================================================

import { z } from 'zod';

const MedicineTypeEnum = z.enum(['TABLET', 'CAPSULE', 'SYRUP', 'DROPS', 'INJECTION', 'OINTMENT', 'INHALER']);
const MealTimingEnum = z.enum(['BEFORE_FOOD', 'AFTER_FOOD', 'WITH_FOOD', 'AFTER_DINNER', 'EMPTY_STOMACH', 'BEDTIME']);

export const createMedicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required').max(200),
  genericName: z.string().max(200).optional(),
  dosage: z.string().min(1, 'Dosage is required').max(100),
  type: MedicineTypeEnum,
  color: z.string().max(50).optional(),
  shape: z.string().max(50).optional(),
  category: z.string().max(100).optional(),
  mealTiming: MealTimingEnum,
  instructions: z.array(z.string().max(500)).max(10).default([]),
  stockCount: z.number().int().min(0).max(9999).default(30),
  lowStockThreshold: z.number().int().min(0).max(999).default(5),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  isEssential: z.boolean().default(false),
  notes: z.string().max(1000).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  prescribedBy: z.string().max(200).optional(),
  customVoiceScript: z.string().max(500).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const updateMedicineSchema = createMedicineSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const medicineListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  isActive: z.coerce.boolean().optional(),
  search: z.string().max(100).optional(),
});

export type CreateMedicineInput = z.infer<typeof createMedicineSchema>;
export type UpdateMedicineInput = z.infer<typeof updateMedicineSchema>;
export type MedicineListQueryInput = z.infer<typeof medicineListQuerySchema>;
