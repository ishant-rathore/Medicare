// =============================================================================
// frontend/lib/data/local/daos/reminder_dao.dart
// SQLite data access object for reminders
// =============================================================================

import 'package:sqflite/sqflite.dart';

import '../database_service.dart';
import '../entities/reminder_entity.dart';

class ReminderDao {
  final DatabaseService _dbService;

  ReminderDao(this._dbService);

  Future<ReminderEntity?> getById(String id) async {
    final db = await _dbService.database;
    final results = await db.query(
      'reminders',
      where: 'id = ?',
      whereArgs: [id],
    );

    if (results.isEmpty) return null;
    return ReminderEntity.fromMap(results.first);
  }

  Future<List<ReminderEntity>> getAllActive() async {
    final db = await _dbService.database;
    final results = await db.query(
      'reminders',
      where: 'is_active = ? AND deleted_at IS NULL',
      whereArgs: [1],
    );

    return results.map((m) => ReminderEntity.fromMap(m)).toList();
  }

  Future<void> insert(ReminderEntity reminder) async {
    final db = await _dbService.database;
    await db.insert(
      'reminders',
      reminder.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> updateAlarmId(String id, int alarmId) async {
    final db = await _dbService.database;
    await db.update(
      'reminders',
      {'alarm_id': alarmId, 'updated_at': DateTime.now().toIso8601String()},
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> setInactive(String id) async {
    final db = await _dbService.database;
    await db.update(
      'reminders',
      {'is_active': 0, 'updated_at': DateTime.now().toIso8601String()},
      where: 'id = ?',
      whereArgs: [id],
    );
  }
}
