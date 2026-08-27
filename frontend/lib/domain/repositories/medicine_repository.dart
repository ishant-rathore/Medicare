// =============================================================================
// frontend/lib/domain/repositories/medicine_repository.dart
// Abstract repository interface — implemented in data layer
// =============================================================================

import '../entities/medicine.dart';

abstract class IMedicineRepository {
  /// Get all active medicines for the current user
  Future<List<Medicine>> getMedicines({bool activeOnly = true});

  /// Get a specific medicine by ID
  Future<Medicine?> getMedicineById(String id);

  /// Add a new medicine
  Future<Medicine> addMedicine(Medicine medicine);

  /// Update an existing medicine
  Future<Medicine> updateMedicine(Medicine medicine);

  /// Soft-delete a medicine
  Future<void> deleteMedicine(String id);

  /// Update stock count for a medicine
  Future<void> updateStock(String id, int newCount);

  /// Get medicines with low stock
  Future<List<Medicine>> getLowStockMedicines();

  /// Search medicines by name
  Future<List<Medicine>> searchMedicines(String query);

  /// Watch medicines stream for real-time updates
  Stream<List<Medicine>> watchMedicines();
}
