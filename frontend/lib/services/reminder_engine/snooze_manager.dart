// =============================================================================
// frontend/lib/services/reminder_engine/snooze_manager.dart
// =============================================================================

import '../../data/local/daos/dose_event_dao.dart';
import 'alarm_scheduler.dart';

class SnoozeManager {
  Future<void> snooze({
    required String doseEventId,
    required DateTime snoozeUntil,
    required DoseEventDao doseEventDao,
    required AlarmScheduler alarmScheduler,
  }) async {
    // 1. Update status in database to SNOOZED
    await doseEventDao.updateStatus(
      id: doseEventId,
      status: 'SNOOZED',
      actionAt: DateTime.now(),
    );

    // 2. Schedule a one-time alarm for the snooze time
    final snoozeAlarmId = 'snooze_$doseEventId'.hashCode.abs() % 2147483647;
    await alarmScheduler.scheduleAlarm(
      alarmId: snoozeAlarmId,
      scheduledAt: snoozeUntil,
      reminderId: doseEventId, // Use dose event ID as reminder ID to route properly
      medicineId: 'snooze',
    );
  }
}
