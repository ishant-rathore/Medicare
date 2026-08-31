// =============================================================================
// frontend/lib/data/local/daos/dose_event_dao.dart
// SQLite data access object for dose events
// =============================================================================

import 'package:sqflite/sqflite.dart';
import 'package:uuid/uuid.dart';

import '../../../domain/entities/dose_event.dart';
import '../../../domain/enums/dose_status.dart';
import '../../../domain/enums/meal_timing.dart';
import '../database_service.dart';

class DoseEventDao {
  final DatabaseService _dbService;

  DoseEventDao(this._dbService);

  Future<DoseEvent> createDoseEvent({
    required String reminderId,
    required String medicineId,
    required String scheduledTime,
  }) async {
    final db = await _dbService.database;

    // Fetch reminder info to get medicine name and dosage
    final reminderResults = await db.query(
      'reminders',
      where: 'id = ?',
      whereArgs: [reminderId],
    );

    String medicineName = 'Unknown Medicine';
    String dosage = '';
    String mealTimingStr = 'AFTER_FOOD';

    if (reminderResults.isNotEmpty) {
      final r = reminderResults.first;
      medicineName = (r['medicine_name'] as String?) ?? medicineName;
      dosage = (r['dosage'] as String?) ?? dosage;
      mealTimingStr = (r['meal_timing'] as String?) ?? mealTimingStr;
    }

    final now = DateTime.now();
    final localEventId = const Uuid().v4();
    final id = 'de_$localEventId'; // Dose Event prefix

    final doseEvent = DoseEvent(
      id: id,
      localEventId: localEventId,
      medicineId: medicineId,
      reminderId: reminderId,
      medicineName: medicineName,
      dosage: dosage,
      mealTiming: MealTiming.fromString(mealTimingStr),
      scheduledTime: scheduledTime,
      scheduledDate: DateTime(now.year, now.month, now.day),
      status: DoseStatus.pending,
      synced: false,
      createdAt: now,
      updatedAt: now,
    );

    await db.insert(
      'dose_events',
      _toMap(doseEvent),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );

    return doseEvent;
  }

  Future<void> updateStatus({
    required String id,
    required String status,
    required DateTime actionAt,
  }) async {
    final db = await _dbService.database;
    await db.update(
      'dose_events',
      {
        'status': status,
        'action_at': actionAt.toIso8601String(),
        'updated_at': DateTime.now().toIso8601String(),
        'synced': 0, // Need to sync status change
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<List<DoseEvent>> getTodayDoses() async {
    final db = await _dbService.database;
    final now = DateTime.now();
    final todayStr = DateTime(now.year, now.month, now.day).toIso8601String();

    final results = await db.query(
      'dose_events',
      where: 'scheduled_date = ?',
      whereArgs: [todayStr],
      orderBy: 'scheduled_time ASC',
    );

    return results.map((m) => _fromMap(m)).toList();
  }

  Map<String, dynamic> _toMap(DoseEvent event) {
    return {
      'id': event.id,
      'local_event_id': event.localEventId,
      'medicine_id': event.medicineId,
      'reminder_id': event.reminderId,
      'medicine_name': event.medicineName,
      'dosage': event.dosage,
      'meal_timing': event.mealTiming.dbValue,
      'scheduled_time': event.scheduledTime,
      'scheduled_date': event.scheduledDate.toIso8601String(),
      'status': event.status.dbValue,
      'action_at': event.actionAt?.toIso8601String(),
      'snooze_until': event.snoozeUntil?.toIso8601String(),
      'spoken_script': event.spokenScript,
      'photo_url': event.photoUrl,
      'notes': event.notes,
      'synced': event.synced ? 1 : 0,
      'created_at': event.createdAt.toIso8601String(),
      'updated_at': event.updatedAt.toIso8601String(),
    };
  }

  DoseEvent _fromMap(Map<String, dynamic> map) {
    return DoseEvent(
      id: map['id'] as String,
      localEventId: map['local_event_id'] as String,
      medicineId: map['medicine_id'] as String,
      reminderId: map['reminder_id'] as String?,
      medicineName: map['medicine_name'] as String,
      dosage: map['dosage'] as String,
      mealTiming: MealTiming.fromString(map['meal_timing'] as String),
      scheduledTime: map['scheduled_time'] as String,
      scheduledDate: DateTime.parse(map['scheduled_date'] as String),
      status: DoseStatus.fromString(map['status'] as String),
      actionAt: map['action_at'] != null ? DateTime.parse(map['action_at'] as String) : null,
      snoozeUntil: map['snooze_until'] != null ? DateTime.parse(map['snooze_until'] as String) : null,
      spokenScript: map['spoken_script'] as String?,
      photoUrl: map['photo_url'] as String?,
      notes: map['notes'] as String?,
      synced: (map['synced'] as int) == 1,
      createdAt: DateTime.parse(map['created_at'] as String),
      updatedAt: DateTime.parse(map['updated_at'] as String),
    );
  }
}
