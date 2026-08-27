// =============================================================================
// frontend/lib/services/reminder_engine/alarm_scheduler.dart
// Android Alarm Manager integration for reliable reminder delivery
// =============================================================================

import 'package:android_alarm_manager_plus/android_alarm_manager_plus.dart';
import 'package:flutter/foundation.dart';

import 'alarm_receiver.dart';

class AlarmScheduler {
  /// Schedule a one-shot alarm at the specified datetime.
  /// [alarmId] must be unique per alarm — generated deterministically from reminderId + time.
  Future<bool> scheduleAlarm({
    required int alarmId,
    required DateTime scheduledAt,
    required String reminderId,
    required String medicineId,
  }) async {
    // Don't schedule alarms in the past
    if (scheduledAt.isBefore(DateTime.now())) {
      debugPrint('AlarmScheduler: Skipping past alarm for $reminderId at $scheduledAt');
      return false;
    }

    try {
      final result = await AndroidAlarmManager.oneShotAt(
        scheduledAt,
        alarmId,
        AlarmReceiver.handleAlarm,
        exact: true,
        wakeup: true,
        rescheduleOnReboot: true,
        alarmClock: true, // Uses AlarmManager.setAlarmClock for maximum reliability
        params: {
          'reminderId': reminderId,
          'medicineId': medicineId,
          'alarmId': alarmId,
          'scheduledAt': scheduledAt.toIso8601String(),
        },
      );

      if (result) {
        debugPrint('AlarmScheduler: Alarm $alarmId scheduled for $scheduledAt ($reminderId)');
      } else {
        debugPrint('AlarmScheduler: Failed to schedule alarm $alarmId');
      }

      return result;
    } catch (e) {
      debugPrint('AlarmScheduler: Error scheduling alarm: $e');
      return false;
    }
  }

  /// Cancel a specific alarm by ID.
  Future<bool> cancelAlarm(int alarmId) async {
    try {
      final result = await AndroidAlarmManager.cancel(alarmId);
      debugPrint('AlarmScheduler: Cancelled alarm $alarmId');
      return result;
    } catch (e) {
      debugPrint('AlarmScheduler: Error cancelling alarm $alarmId: $e');
      return false;
    }
  }

  /// Cancel multiple alarms.
  Future<void> cancelAlarms(List<int> alarmIds) async {
    for (final id in alarmIds) {
      await cancelAlarm(id);
    }
  }

  /// Schedule a periodic alarm (for daily reminders — more battery efficient than oneShot + reschedule).
  Future<bool> scheduleDailyAlarm({
    required int alarmId,
    required DateTime firstOccurrence,
    required String reminderId,
    required String medicineId,
  }) async {
    try {
      return await AndroidAlarmManager.periodic(
        const Duration(hours: 24),
        alarmId,
        AlarmReceiver.handleAlarm,
        startAt: firstOccurrence,
        exact: true,
        wakeup: true,
        rescheduleOnReboot: true,
        params: {
          'reminderId': reminderId,
          'medicineId': medicineId,
          'alarmId': alarmId,
        },
      );
    } catch (e) {
      debugPrint('AlarmScheduler: Error scheduling periodic alarm: $e');
      return false;
    }
  }
}
