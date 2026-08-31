// =============================================================================
// frontend/lib/services/reminder_engine/reminder_engine.dart
// Orchestrates the complete reminder scheduling lifecycle
// =============================================================================

import 'package:flutter/foundation.dart';

import '../../domain/entities/medicine.dart';
import '../../data/local/daos/reminder_dao.dart';
import '../../data/local/daos/dose_event_dao.dart';
import '../../data/local/entities/reminder_entity.dart';
import 'alarm_scheduler.dart';
import 'recurrence_calculator.dart';
import 'reminder_validator.dart';
import 'missed_dose_manager.dart';
import 'snooze_manager.dart';
import '../notifications/notification_service.dart';

/// The ReminderEngine is the central coordinator for all reminder operations.
/// It orchestrates scheduling, validation, state management, and alarm lifecycle.
///
/// IMPORTANT: This engine works entirely offline — no network calls here.
/// All data is stored in SQLite and alarms are scheduled via Android Alarm Manager.
class ReminderEngine {
  final ReminderDao _reminderDao;
  final DoseEventDao _doseEventDao;
  final AlarmScheduler _alarmScheduler;
  final RecurrenceCalculator _recurrenceCalculator;
  final ReminderValidator _validator;
  final SnoozeManager _snoozeManager;
  final MissedDoseManager _missedDoseManager;

  ReminderEngine({
    required ReminderDao reminderDao,
    required DoseEventDao doseEventDao,
    required AlarmScheduler alarmScheduler,
    required RecurrenceCalculator recurrenceCalculator,
    required ReminderValidator validator,
    required SnoozeManager snoozeManager,
    required MissedDoseManager missedDoseManager,
  })  : _reminderDao = reminderDao,
        _doseEventDao = doseEventDao,
        _alarmScheduler = alarmScheduler,
        _recurrenceCalculator = recurrenceCalculator,
        _validator = validator,
        _snoozeManager = snoozeManager,
        _missedDoseManager = missedDoseManager;

  /// Schedule all reminders for a medicine.
  /// Called when a new medicine is added or reminders are updated.
  Future<void> scheduleRemindersForMedicine({
    required Medicine medicine,
    required ReminderEntity reminder,
  }) async {
    // Validate before scheduling
    final validationResult = _validator.validateReminder(reminder);
    if (!validationResult.isValid) {
      debugPrint('ReminderEngine: Invalid reminder — ${validationResult.errors.join(', ')}');
      return;
    }

    // Cancel any existing alarms for this reminder
    await cancelReminder(reminder.id);

    // Schedule new alarms for each scheduled time
    for (final time in reminder.scheduledTimes) {
      final nextOccurrence = _recurrenceCalculator.nextOccurrence(
        recurrence: reminder.recurrence,
        scheduledTime: time,
        startDate: reminder.startDate,
        endDate: reminder.endDate,
        daysOfWeek: reminder.daysOfWeek,
      );

      if (nextOccurrence != null) {
        final alarmId = _generateAlarmId(reminder.id, time);
        await _alarmScheduler.scheduleAlarm(
          alarmId: alarmId,
          scheduledAt: nextOccurrence,
          reminderId: reminder.id,
          medicineId: medicine.id,
        );

        // Update alarm ID in the reminder entity
        await _reminderDao.updateAlarmId(reminder.id, alarmId);

        debugPrint(
          'ReminderEngine: Scheduled alarm $alarmId for ${medicine.name} at $nextOccurrence',
        );
      }
    }
  }

  /// Cancel all alarms for a reminder.
  Future<void> cancelReminder(String reminderId) async {
    final reminder = await _reminderDao.getById(reminderId);
    if (reminder == null) return;

    for (final time in reminder.scheduledTimes) {
      final alarmId = _generateAlarmId(reminderId, time);
      await _alarmScheduler.cancelAlarm(alarmId);
    }

    await _reminderDao.setInactive(reminderId);
  }

  /// Handle when an alarm fires — create dose event, trigger notification.
  Future<void> onAlarmFired({
    required String reminderId,
    required String medicineId,
  }) async {
    final reminder = await _reminderDao.getById(reminderId);
    if (reminder == null || !reminder.isActive) return;

    // Create the dose event in SQLite
    final doseEvent = await _doseEventDao.createDoseEvent(
      reminderId: reminderId,
      medicineId: medicineId,
      scheduledTime: _getCurrentAlarmTime(reminder),
    );

    // Trigger the notification
    await NotificationService.showMedicationReminder(
      doseEventId: doseEvent.id,
      medicineName: reminder.medicineName ?? 'Medicine',
      dosage: reminder.dosage ?? '',
      spokenScript: doseEvent.spokenScript ?? '',
    );

    // Reschedule for next occurrence (for recurring reminders)
    await _rescheduleIfNeeded(reminder);

    // Start the missed dose timer (fires if no action in 15 minutes)
    await _missedDoseManager.startMissedTimer(doseEvent.id);
  }

  /// Mark a dose as taken.
  Future<void> markTaken(String doseEventId) async {
    await _doseEventDao.updateStatus(
      id: doseEventId,
      status: 'TAKEN',
      actionAt: DateTime.now(),
    );
    await _missedDoseManager.cancelTimer(doseEventId);
    await NotificationService.dismissNotification(doseEventId);
  }

  /// Snooze a dose reminder.
  Future<void> snoozeDose(String doseEventId, {int snoozeMinutes = 10}) async {
    final snoozeUntil = DateTime.now().add(Duration(minutes: snoozeMinutes));
    await _snoozeManager.snooze(
      doseEventId: doseEventId,
      snoozeUntil: snoozeUntil,
      doseEventDao: _doseEventDao,
      alarmScheduler: _alarmScheduler,
    );
    await NotificationService.dismissNotification(doseEventId);
  }

  /// Skip a dose.
  Future<void> skipDose(String doseEventId) async {
    await _doseEventDao.updateStatus(
      id: doseEventId,
      status: 'SKIPPED',
      actionAt: DateTime.now(),
    );
    await _missedDoseManager.cancelTimer(doseEventId);
    await NotificationService.dismissNotification(doseEventId);
  }

  /// Recover all active alarms after device reboot.
  Future<void> recoverAlarmsAfterReboot() async {
    debugPrint('ReminderEngine: Recovering alarms after reboot...');
    final activeReminders = await _reminderDao.getAllActive();

    for (final reminder in activeReminders) {
      for (final time in reminder.scheduledTimes) {
        final nextOccurrence = _recurrenceCalculator.nextOccurrence(
          recurrence: reminder.recurrence,
          scheduledTime: time,
          startDate: reminder.startDate,
          endDate: reminder.endDate,
          daysOfWeek: reminder.daysOfWeek,
        );

        if (nextOccurrence != null) {
          final alarmId = _generateAlarmId(reminder.id, time);
          await _alarmScheduler.scheduleAlarm(
            alarmId: alarmId,
            scheduledAt: nextOccurrence,
            reminderId: reminder.id,
            medicineId: reminder.medicineId,
          );
        }
      }
    }

    debugPrint('ReminderEngine: Recovered ${activeReminders.length} reminders');
  }

  Future<void> _rescheduleIfNeeded(ReminderEntity reminder) async {
    if (reminder.recurrence == 'ONE_TIME') return;
    if (reminder.endDate != null && DateTime.now().isAfter(reminder.endDate!)) return;

    for (final time in reminder.scheduledTimes) {
      final nextOccurrence = _recurrenceCalculator.nextOccurrenceAfter(
        recurrence: reminder.recurrence,
        scheduledTime: time,
        after: DateTime.now(),
        daysOfWeek: reminder.daysOfWeek,
        endDate: reminder.endDate,
      );

      if (nextOccurrence != null) {
        final alarmId = _generateAlarmId(reminder.id, time);
        await _alarmScheduler.scheduleAlarm(
          alarmId: alarmId,
          scheduledAt: nextOccurrence,
          reminderId: reminder.id,
          medicineId: reminder.medicineId,
        );
      }
    }
  }

  String _getCurrentAlarmTime(ReminderEntity reminder) {
    // Return the first scheduled time for simplicity
    // In production, this would be the specific time that fired
    return reminder.scheduledTimes.isNotEmpty ? reminder.scheduledTimes.first : '08:00';
  }

  /// Generate a deterministic alarm ID from reminder ID and time.
  /// Uses hash to fit within Android's int alarm ID range.
  int _generateAlarmId(String reminderId, String time) {
    return '${reminderId}_$time'.hashCode.abs() % 2147483647;
  }
}
