// =============================================================================
// backend/src/modules/medicines/medicines.schema.ts
// Zod validation schemas for medicine API requests
// =============================================================================

import { z } from 'zod';

const MedicineTypeEnum = z.enum(['TABLET', 'CAPSULE', 'SYRUP', 'DROPS', 'INJECTION', 'OINTMENT', 'INHALER']);
const MealTimingEnum = z.enum(['BEFORE_FOOD', 'AFTER_FOOD', 'WITH_FOOD', 'AFTER_DINNER', 'EMPTY_STOMACH', 'BEDTIME']);
const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD');

export const createMedicineSchema = z.object({
  name: z.string().trim().min(1, 'Medicine name is required').max(200),
  genericName: z.string().trim().max(200).optional(),
  dosage: z.string().trim().min(1, 'Dosage is required').max(100),
  type: MedicineTypeEnum,
  color: z.string().trim().max(50).optional(),
  shape: z.string().trim().max(50).optional(),
  category: z.string().trim().max(100).optional(),
  mealTiming: MealTimingEnum,
  instructions: z.array(z.string().trim().max(500)).max(10).default([]),
  stockCount: z.number().int().min(0).max(9999).default(30),
  lowStockThreshold: z.number().int().min(0).max(999).default(5),
  expiryDate: dateOnly.optional(),
  isEssential: z.boolean().default(false),
  notes: z.string().trim().max(1000).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  prescribedBy: z.string().trim().max(200).optional(),
  customVoiceScript: z.string().trim().max(500).optional(),
  startDate: dateOnly.optional(),
  endDate: dateOnly.optional(),
}).strict().superRefine((value, ctx) => {
  if (value.startDate && value.endDate && value.endDate < value.startDate) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: 'endDate must be on or after startDate' });
  }
});

export const updateMedicineSchema = createMedicineSchema.partial().extend({
  isActive: z.boolean().optional(),
}).strict();

export const medicineListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  isActive: z.coerce.boolean().optional(),
  search: z.string().trim().max(100).optional(),
}).strict();

export type CreateMedicineInput = z.infer<typeof createMedicineSchema>;
export type UpdateMedicineInput = z.infer<typeof updateMedicineSchema>;
export type MedicineListQueryInput = z.infer<typeof medicineListQuerySchema>;
