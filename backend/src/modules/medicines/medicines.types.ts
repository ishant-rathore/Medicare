// =============================================================================
// backend/src/modules/medicines/medicines.types.ts
// TypeScript types for the medicines module
// =============================================================================

export type MedicineType = 'TABLET' | 'CAPSULE' | 'SYRUP' | 'DROPS' | 'INJECTION' | 'OINTMENT' | 'INHALER';
export type MealTiming = 'BEFORE_FOOD' | 'AFTER_FOOD' | 'WITH_FOOD' | 'AFTER_DINNER' | 'EMPTY_STOMACH' | 'BEDTIME';

export interface CreateMedicineDto {
  name: string;
  genericName?: string;
  dosage: string;
  type: MedicineType;
  color?: string;
  shape?: string;
  category?: string;
  mealTiming: MealTiming;
  instructions?: string[];
  stockCount?: number;
  lowStockThreshold?: number;
  expiryDate?: string;
  isEssential?: boolean;
  notes?: string;
  photoUrl?: string;
  prescribedBy?: string;
  customVoiceScript?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateMedicineDto extends Partial<CreateMedicineDto> {
  isActive?: boolean;
}

export interface MedicineResponse {
  id: string;
  userId: string;
  name: string;
  genericName: string | null;
  dosage: string;
  type: MedicineType;
  color: string | null;
  shape: string | null;
  category: string | null;
  mealTiming: MealTiming;
  instructions: string[];
  stockCount: number;
  lowStockThreshold: number;
  expiryDate: string | null;
  isEssential: boolean;
  isActive: boolean;
  notes: string | null;
  photoUrl: string | null;
  prescribedBy: string | null;
  customVoiceScript: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineListQuery {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}
