// =============================================================================
// frontend/lib/data/local/entities/reminder_entity.dart
// Data class for SQLite reminder records
// =============================================================================

import 'dart:convert';

class ReminderEntity {
  final String id;
  final String medicineId;
  final List<String> scheduledTimes; // e.g. ["08:00", "20:00"]
  final String recurrence; // DAILY, WEEKLY, ONE_TIME, etc.
  final List<int> daysOfWeek; // 0=Sunday, 6=Saturday
  final DateTime startDate;
  final DateTime? endDate;
  final bool isActive;
  final int snoozeMinutes;
  final String? notes;
  final int? alarmId;
  final String? medicineName;
  final String? dosage;
  final String? mealTiming;
  final DateTime createdAt;
  final DateTime updatedAt;

  ReminderEntity({
    required this.id,
    required this.medicineId,
    required this.scheduledTimes,
    required this.recurrence,
    this.daysOfWeek = const [],
    required this.startDate,
    this.endDate,
    this.isActive = true,
    this.snoozeMinutes = 10,
    this.notes,
    this.alarmId,
    this.medicineName,
    this.dosage,
    this.mealTiming,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ReminderEntity.fromMap(Map<String, dynamic> map) {
    return ReminderEntity(
      id: map['id'] as String,
      medicineId: map['medicine_id'] as String,
      scheduledTimes: List<String>.from(jsonDecode(map['scheduled_times'] as String)),
      recurrence: map['recurrence'] as String,
      daysOfWeek: List<int>.from(jsonDecode(map['days_of_week'] as String)),
      startDate: DateTime.parse(map['start_date'] as String),
      endDate: map['end_date'] != null ? DateTime.parse(map['end_date'] as String) : null,
      isActive: (map['is_active'] as int) == 1,
      snoozeMinutes: map['snooze_minutes'] as int,
      notes: map['notes'] as String?,
      alarmId: map['alarm_id'] as int?,
      medicineName: map['medicine_name'] as String?,
      dosage: map['dosage'] as String?,
      mealTiming: map['meal_timing'] as String?,
      createdAt: DateTime.parse(map['created_at'] as String),
      updatedAt: DateTime.parse(map['updated_at'] as String),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'medicine_id': medicineId,
      'scheduled_times': jsonEncode(scheduledTimes),
      'recurrence': recurrence,
      'days_of_week': jsonEncode(daysOfWeek),
      'start_date': startDate.toIso8601String(),
      'end_date': endDate?.toIso8601String(),
      'is_active': isActive ? 1 : 0,
      'snooze_minutes': snoozeMinutes,
      'notes': notes,
      'alarm_id': alarmId,
      'medicine_name': medicineName,
      'dosage': dosage,
      'meal_timing': mealTiming,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
