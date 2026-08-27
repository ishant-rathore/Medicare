// =============================================================================
// frontend/lib/services/reminder_engine/missed_dose_manager.dart
// =============================================================================

import 'dart:async';

import 'package:flutter/foundation.dart';
import '../../data/local/daos/dose_event_dao.dart';
import '../notifications/notification_service.dart';

class MissedDoseManager {
  final DoseEventDao _doseEventDao;
  final Map<String, Timer> _activeTimers = {};

  MissedDoseManager(this._doseEventDao);

  Future<void> startMissedTimer(String doseEventId, {int timeoutMinutes = 15}) async {
    cancelTimer(doseEventId);

    _activeTimers[doseEventId] = Timer(Duration(minutes: timeoutMinutes), () async {
      debugPrint('MissedDoseManager: Timer expired for $doseEventId, marking missed.');

      // Update to missed status
      await _doseEventDao.updateStatus(
        id: doseEventId,
        status: 'MISSED',
        actionAt: DateTime.now(),
      );

      // Trigger missed notification
      await NotificationService.showMissedDoseAlert(
        doseEventId: doseEventId,
        medicineName: 'Your Medication',
      );

      _activeTimers.remove(doseEventId);
    });
  }

  Future<void> cancelTimer(String doseEventId) async {
    _activeTimers[doseEventId]?.cancel();
    _activeTimers.remove(doseEventId);
  }
}
