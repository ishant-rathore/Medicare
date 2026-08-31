// =============================================================================
// backend/src/modules/medicines/medicines.mapper.ts
// Maps between Prisma models and API response types
// =============================================================================

import { Medicine as PrismaMedicine } from '@prisma/client';

import { MedicineResponse } from './medicines.types';

export function toMedicineResponse(medicine: PrismaMedicine): MedicineResponse {
  return {
    id: medicine.id,
    userId: medicine.userId,
    name: medicine.name,
    genericName: medicine.genericName,
    dosage: medicine.dosage,
    type: medicine.type as MedicineResponse['type'],
    color: medicine.color,
    shape: medicine.shape,
    category: medicine.category,
    mealTiming: medicine.mealTiming as MedicineResponse['mealTiming'],
    instructions: medicine.instructions,
    stockCount: medicine.stockCount,
    lowStockThreshold: medicine.lowStockThreshold,
    expiryDate: medicine.expiryDate?.toISOString().split('T')[0] ?? null,
    isEssential: medicine.isEssential,
    isActive: medicine.isActive,
    notes: medicine.notes,
    photoUrl: medicine.photoUrl,
    prescribedBy: medicine.prescribedBy,
    customVoiceScript: medicine.customVoiceScript,
    startDate: medicine.startDate?.toISOString().split('T')[0] ?? null,
    endDate: medicine.endDate?.toISOString().split('T')[0] ?? null,
    createdAt: medicine.createdAt.toISOString(),
    updatedAt: medicine.updatedAt.toISOString(),
  };
}

export function toMedicineResponseList(medicines: PrismaMedicine[]): MedicineResponse[] {
  return medicines.map(toMedicineResponse);
}
