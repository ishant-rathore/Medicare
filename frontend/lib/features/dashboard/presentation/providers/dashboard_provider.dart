// =============================================================================
// frontend/lib/features/dashboard/presentation/providers/dashboard_provider.dart
// State management for the dashboard using Riverpod
// =============================================================================

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../../../../domain/entities/dose_event.dart';
import '../../../../data/local/daos/dose_event_dao.dart';
import '../../../../data/local/database_service.dart';
import '../../../../services/reminder_engine/reminder_engine.dart';
import '../../../../services/reminder_engine/alarm_scheduler.dart';
import '../../../../services/reminder_engine/recurrence_calculator.dart';
import '../../../../services/reminder_engine/reminder_validator.dart';
import '../../../../services/reminder_engine/snooze_manager.dart';
import '../../../../services/reminder_engine/missed_dose_manager.dart';
import '../../../../data/local/daos/reminder_dao.dart';

// Provides the DAOs and Engine (usually done via dependency injection)
final dbServiceProvider = Provider<DatabaseService>((ref) => DatabaseService());
final doseEventDaoProvider = Provider<DoseEventDao>((ref) => DoseEventDao(ref.watch(dbServiceProvider)));
final reminderDaoProvider = Provider<ReminderDao>((ref) => ReminderDao(ref.watch(dbServiceProvider)));

final reminderEngineProvider = Provider<ReminderEngine>((ref) {
  final doseDao = ref.watch(doseEventDaoProvider);
  return ReminderEngine(
    reminderDao: ref.watch(reminderDaoProvider),
    doseEventDao: doseDao,
    alarmScheduler: AlarmScheduler(),
    recurrenceCalculator: RecurrenceCalculator(),
    validator: ReminderValidator(),
    snoozeManager: SnoozeManager(),
    missedDoseManager: MissedDoseManager(doseDao),
  );
});

// State class for the dashboard
class DashboardState {
  final bool isLoading;
  final String? userName;
  final List<DoseEvent> todayDoses;
  final DoseEvent? nextDue;

  DashboardState({
    this.isLoading = true,
    this.userName,
    this.todayDoses = const [],
    this.nextDue,
  });

  DashboardState copyWith({
    bool? isLoading,
    String? userName,
    List<DoseEvent>? todayDoses,
    DoseEvent? nextDue,
  }) {
    return DashboardState(
      isLoading: isLoading ?? this.isLoading,
      userName: userName ?? this.userName,
      todayDoses: todayDoses ?? this.todayDoses,
      nextDue: nextDue ?? this.nextDue,
    );
  }
}

// StateNotifier for dashboard interactions
class DashboardNotifier extends StateNotifier<DashboardState> {
  final DoseEventDao _doseEventDao;
  final ReminderEngine _reminderEngine;

  DashboardNotifier(this._doseEventDao, this._reminderEngine) : super(DashboardState()) {
    _init();
  }

  Future<void> _init() async {
    final user = FirebaseAuth.instance.currentUser;
    state = state.copyWith(userName: user?.displayName ?? 'Guest');
    await refresh();
  }

  Future<void> refresh() async {
    state = state.copyWith(isLoading: true);
    try {
      final doses = await _doseEventDao.getTodayDoses();
      
      // Calculate next due
      DoseEvent? nextDue;
      try {
        nextDue = doses.firstWhere((d) => d.isPending || d.isSnoozed);
      } catch (_) {
        nextDue = null;
      }

      state = state.copyWith(
        isLoading: false,
        todayDoses: doses,
        nextDue: nextDue,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<void> markTaken(String doseEventId) async {
    await _reminderEngine.markTaken(doseEventId);
    await refresh();
  }

  Future<void> snoozeDose(String doseEventId) async {
    await _reminderEngine.snoozeDose(doseEventId);
    await refresh();
  }

  Future<void> skipDose(String doseEventId) async {
    await _reminderEngine.skipDose(doseEventId);
    await refresh();
  }
}

final dashboardProvider = StateNotifierProvider<DashboardNotifier, DashboardState>((ref) {
  return DashboardNotifier(
    ref.watch(doseEventDaoProvider),
    ref.watch(reminderEngineProvider),
  );
});
