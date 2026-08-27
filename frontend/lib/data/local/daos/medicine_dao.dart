// =============================================================================
// frontend/lib/data/local/daos/medicine_dao.dart
// SQLite data access object for medicines
// =============================================================================

import 'package:sqflite/sqflite.dart';
import '../database_service.dart';
import '../../../domain/entities/medicine.dart';
import '../../../domain/enums/medicine_type.dart';
import '../../../domain/enums/meal_timing.dart';

class MedicineDao {
  final DatabaseService _dbService;

  MedicineDao(this._dbService);

  Future<List<Medicine>> getMedicines({bool activeOnly = true}) async {
    final db = await _dbService.database;
    final where = activeOnly ? 'is_active = ? AND deleted_at IS NULL' : 'deleted_at IS NULL';
    final whereArgs = activeOnly ? [1] : null;

    final results = await db.query(
      'medicines',
      where: where,
      whereArgs: whereArgs,
      orderBy: 'name ASC',
    );

    return results.map((m) => _fromMap(m)).toList();
  }

  Future<Medicine?> getMedicineById(String id) async {
    final db = await _dbService.database;
    final results = await db.query(
      'medicines',
      where: 'id = ? AND deleted_at IS NULL',
      whereArgs: [id],
    );

    if (results.isEmpty) return null;
    return _fromMap(results.first);
  }

  Future<void> insertMedicine(Medicine medicine) async {
    final db = await _dbService.database;
    await db.insert(
      'medicines',
      _toMap(medicine),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> updateMedicine(Medicine medicine) async {
    final db = await _dbService.database;
    await db.update(
      'medicines',
      _toMap(medicine),
      where: 'id = ?',
      whereArgs: [medicine.id],
    );
  }

  Future<void> softDeleteMedicine(String id) async {
    final db = await _dbService.database;
    await db.update(
      'medicines',
      {'deleted_at': DateTime.now().toIso8601String(), 'is_active': 0},
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> updateStock(String id, int newCount) async {
    final db = await _dbService.database;
    await db.update(
      'medicines',
      {'stock_count': newCount, 'updated_at': DateTime.now().toIso8601String()},
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Map<String, dynamic> _toMap(Medicine m) {
    return {
      'id': m.id,
      'name': m.name,
      'generic_name': m.genericName,
      'dosage': m.dosage,
      'type': m.type.dbValue,
      'color': m.color,
      'shape': m.shape,
      'category': m.category,
      'meal_timing': m.mealTiming.dbValue,
      'instructions': '[]', // Ignoring for MVP brevity
      'stock_count': m.stockCount,
      'low_stock_threshold': m.lowStockThreshold,
      'expiry_date': m.expiryDate?.toIso8601String(),
      'is_essential': m.isEssential ? 1 : 0,
      'is_active': m.isActive ? 1 : 0,
      'notes': m.notes,
      'photo_url': m.photoUrl,
      'prescribed_by': m.prescribedBy,
      'custom_voice_script': m.customVoiceScript,
      'start_date': m.startDate?.toIso8601String(),
      'end_date': m.endDate?.toIso8601String(),
      'created_at': m.createdAt.toIso8601String(),
      'updated_at': m.updatedAt.toIso8601String(),
    };
  }

  Medicine _fromMap(Map<String, dynamic> map) {
    return Medicine(
      id: map['id'] as String,
      name: map['name'] as String,
      genericName: map['generic_name'] as String?,
      dosage: map['dosage'] as String,
      type: MedicineType.fromString(map['type'] as String),
      color: map['color'] as String?,
      shape: map['shape'] as String?,
      category: map['category'] as String?,
      mealTiming: MealTiming.fromString(map['meal_timing'] as String),
      stockCount: map['stock_count'] as int,
      lowStockThreshold: map['low_stock_threshold'] as int,
      expiryDate: map['expiry_date'] != null ? DateTime.parse(map['expiry_date'] as String) : null,
      isEssential: (map['is_essential'] as int) == 1,
      isActive: (map['is_active'] as int) == 1,
      notes: map['notes'] as String?,
      photoUrl: map['photo_url'] as String?,
      prescribedBy: map['prescribed_by'] as String?,
      customVoiceScript: map['custom_voice_script'] as String?,
      startDate: map['start_date'] != null ? DateTime.parse(map['start_date'] as String) : null,
      endDate: map['end_date'] != null ? DateTime.parse(map['end_date'] as String) : null,
      createdAt: DateTime.parse(map['created_at'] as String),
      updatedAt: DateTime.parse(map['updated_at'] as String),
    );
  }
}
