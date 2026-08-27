// =============================================================================
// frontend/lib/domain/entities/dose_event.dart
// Dose event domain entity
// =============================================================================

import '../enums/dose_status.dart';
import '../enums/meal_timing.dart';

class DoseEvent {
  final String id;
  final String localEventId;  // UUID generated on device, used for sync idempotency
  final String medicineId;
  final String? reminderId;
  final String medicineName;
  final String dosage;
  final MealTiming mealTiming;
  final String scheduledTime;   // "08:00"
  final DateTime scheduledDate;
  final DoseStatus status;
  final DateTime? actionAt;
  final DateTime? snoozeUntil;
  final String? spokenScript;
  final String? photoUrl;
  final String? notes;
  final bool synced;
  final DateTime createdAt;
  final DateTime updatedAt;

  const DoseEvent({
    required this.id,
    required this.localEventId,
    required this.medicineId,
    this.reminderId,
    required this.medicineName,
    required this.dosage,
    required this.mealTiming,
    required this.scheduledTime,
    required this.scheduledDate,
    this.status = DoseStatus.pending,
    this.actionAt,
    this.snoozeUntil,
    this.spokenScript,
    this.photoUrl,
    this.notes,
    this.synced = false,
    required this.createdAt,
    required this.updatedAt,
  });

  bool get isPending => status == DoseStatus.pending;
  bool get isTaken => status == DoseStatus.taken;
  bool get isMissed => status == DoseStatus.missed;
  bool get isSnoozed => status == DoseStatus.snoozed;
  bool get isSkipped => status == DoseStatus.skipped;
  bool get needsSync => !synced;

  /// Check if this dose is overdue (pending and scheduled time has passed)
  bool get isOverdue {
    if (!isPending) return false;
    final now = DateTime.now();
    final parts = scheduledTime.split(':');
    final scheduledDateTime = DateTime(
      scheduledDate.year,
      scheduledDate.month,
      scheduledDate.day,
      int.parse(parts[0]),
      int.parse(parts[1]),
    );
    return now.isAfter(scheduledDateTime.add(const Duration(minutes: 15)));
  }

  DoseEvent copyWith({
    String? id,
    String? localEventId,
    String? medicineId,
    String? reminderId,
    String? medicineName,
    String? dosage,
    MealTiming? mealTiming,
    String? scheduledTime,
    DateTime? scheduledDate,
    DoseStatus? status,
    DateTime? actionAt,
    DateTime? snoozeUntil,
    String? spokenScript,
    String? photoUrl,
    String? notes,
    bool? synced,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return DoseEvent(
      id: id ?? this.id,
      localEventId: localEventId ?? this.localEventId,
      medicineId: medicineId ?? this.medicineId,
      reminderId: reminderId ?? this.reminderId,
      medicineName: medicineName ?? this.medicineName,
      dosage: dosage ?? this.dosage,
      mealTiming: mealTiming ?? this.mealTiming,
      scheduledTime: scheduledTime ?? this.scheduledTime,
      scheduledDate: scheduledDate ?? this.scheduledDate,
      status: status ?? this.status,
      actionAt: actionAt ?? this.actionAt,
      snoozeUntil: snoozeUntil ?? this.snoozeUntil,
      spokenScript: spokenScript ?? this.spokenScript,
      photoUrl: photoUrl ?? this.photoUrl,
      notes: notes ?? this.notes,
      synced: synced ?? this.synced,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) || (other is DoseEvent && other.id == id);

  @override
  int get hashCode => id.hashCode;
}
