// =============================================================================
// frontend/lib/data/repositories/medicine_repository_impl.dart
// Implementation of MedicineRepository using SQLite and Sync Queue
// =============================================================================

import 'dart:async';
import 'package:uuid/uuid.dart';

import '../../domain/entities/medicine.dart';
import '../../domain/repositories/medicine_repository.dart';
import '../local/daos/medicine_dao.dart';
import '../../services/sync/sync_service.dart';

class MedicineRepositoryImpl implements IMedicineRepository {
  final MedicineDao _medicineDao;
  final SyncService _syncService;

  MedicineRepositoryImpl(this._medicineDao, this._syncService);

  @override
  Future<List<Medicine>> getMedicines({bool activeOnly = true}) {
    return _medicineDao.getMedicines(activeOnly: activeOnly);
  }

  @override
  Future<Medicine?> getMedicineById(String id) {
    return _medicineDao.getMedicineById(id);
  }

  @override
  Future<Medicine> addMedicine(Medicine medicine) async {
    // Generate UUID if not present (although UI should pass one or let backend decide, here we assign client-side ID)
    final medicineToInsert = medicine.id.isEmpty
        ? medicine.copyWith(id: const Uuid().v4(), createdAt: DateTime.now(), updatedAt: DateTime.now())
        : medicine;

    // 1. Save to local SQLite
    await _medicineDao.insertMedicine(medicineToInsert);

    // 2. Enqueue for sync
    await _syncService.enqueue(
      localId: medicineToInsert.id,
      operation: 'CREATE',
      resource: 'medicine',
      payload: _serializeMedicine(medicineToInsert),
    );

    // 3. Trigger sync if online
    _syncService.syncIfOnline();

    return medicineToInsert;
  }

  @override
  Future<Medicine> updateMedicine(Medicine medicine) async {
    final updated = medicine.copyWith(updatedAt: DateTime.now());

    // 1. Update local SQLite
    await _medicineDao.updateMedicine(updated);

    // 2. Enqueue for sync
    await _syncService.enqueue(
      localId: updated.id,
      operation: 'UPDATE',
      resource: 'medicine',
      payload: _serializeMedicine(updated),
    );

    _syncService.syncIfOnline();

    return updated;
  }

  @override
  Future<void> deleteMedicine(String id) async {
    await _medicineDao.softDeleteMedicine(id);

    await _syncService.enqueue(
      localId: id,
      operation: 'DELETE',
      resource: 'medicine',
      payload: {'id': id},
    );

    _syncService.syncIfOnline();
  }

  @override
  Future<void> updateStock(String id, int newCount) async {
    await _medicineDao.updateStock(id, newCount);

    await _syncService.enqueue(
      localId: id,
      operation: 'UPDATE_STOCK',
      resource: 'medicine',
      payload: {'id': id, 'stock_count': newCount},
    );

    _syncService.syncIfOnline();
  }

  @override
  Future<List<Medicine>> getLowStockMedicines() async {
    final all = await _medicineDao.getMedicines();
    return all.where((m) => m.isLowStock).toList();
  }

  @override
  Future<List<Medicine>> searchMedicines(String query) async {
    final all = await _medicineDao.getMedicines();
    final lowerQuery = query.toLowerCase();
    return all.where((m) =>
        m.name.toLowerCase().contains(lowerQuery) ||
        (m.genericName?.toLowerCase().contains(lowerQuery) ?? false) ||
        (m.category?.toLowerCase().contains(lowerQuery) ?? false)).toList();
  }

  @override
  Stream<List<Medicine>> watchMedicines() async* {
    // Since sqflite doesn't have native reactive streams, we'd typically use a broadcast stream
    // combined with DAO triggers. For now, returning a basic stream.
    // In production, we use a StreamController updated on every insert/update.
    yield await _medicineDao.getMedicines();
  }

  Map<String, dynamic> _serializeMedicine(Medicine m) {
    return {
      'id': m.id,
      'name': m.name,
      'dosage': m.dosage,
      'type': m.type.name, // Use name for JSON enum
      'mealTiming': m.mealTiming.name,
      'stockCount': m.stockCount,
      'lowStockThreshold': m.lowStockThreshold,
    };
  }
}
