// =============================================================================
// frontend/lib/services/notifications/notification_service.dart
// Flutter Local Notifications — handles medication reminder channels and display
// =============================================================================

import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

import '../voice/tts_service.dart';

class NotificationService {
  static final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  static const String _channelId = 'medication_reminders';
  static const String _channelName = 'Medication Reminders';
  static const String _channelDesc =
      'Urgent reminders to take your medicine on time';

  static const String _missedChannelId = 'missed_doses';
  static const String _missedChannelName = 'Missed Doses';

  static const String _lowStockChannelId = 'low_stock_alerts';
  static const String _lowStockChannelName = 'Low Stock Alerts';

  static Future<void> initialize() async {
    const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');

    const initSettings = InitializationSettings(android: androidInit);

    await _plugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTap,
      onDidReceiveBackgroundNotificationResponse: _onBackgroundNotificationTap,
    );

    await _createNotificationChannels();
  }

  static Future<void> _createNotificationChannels() async {
    // Primary medication reminder channel — HIGH importance, full interruption
    const medicationChannel = AndroidNotificationChannel(
      _channelId,
      _channelName,
      description: _channelDesc,
      importance: Importance.max,
      enableVibration: true,
      enableLights: true,
      ledColor: Color.fromARGB(255, 21, 101, 192), // Blue LED
      playSound: true,
      showBadge: true,
    );

    // Missed dose — also high importance
    const missedChannel = AndroidNotificationChannel(
      _missedChannelId,
      _missedChannelName,
      description: 'Alert for missed medication doses',
      importance: Importance.high,
      enableVibration: true,
    );

    // Low stock — default importance
    const lowStockChannel = AndroidNotificationChannel(
      _lowStockChannelId,
      _lowStockChannelName,
      description: 'Alerts when medicine stock is running low',
      importance: Importance.defaultImportance,
    );

    final androidPlugin =
        _plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();

    await androidPlugin?.createNotificationChannel(medicationChannel);
    await androidPlugin?.createNotificationChannel(missedChannel);
    await androidPlugin?.createNotificationChannel(lowStockChannel);
  }

  /// Show a medication reminder notification with action buttons.
  static Future<void> showMedicationReminder({
    required String doseEventId,
    required String medicineName,
    required String dosage,
    required String spokenScript,
  }) async {
    // Speak the reminder via TTS first
    if (spokenScript.isNotEmpty) {
      try {
        await TtsService().speakReminder(spokenScript);
      } catch (e) {
        debugPrint('NotificationService: TTS failed: $e');
      }
    }

    final androidDetails = AndroidNotificationDetails(
      _channelId,
      _channelName,
      channelDescription: _channelDesc,
      importance: Importance.max,
      priority: Priority.max,
      fullScreenIntent: true,         // Show on lock screen
      visibility: NotificationVisibility.public,
      actions: [
        const AndroidNotificationAction(
          'TAKEN',
          '✅ TAKEN',
          showsUserInterface: true,
          cancelNotification: true,
        ),
        const AndroidNotificationAction(
          'SNOOZE',
          '⏰ SNOOZE 10 MIN',
          showsUserInterface: false,
          cancelNotification: true,
        ),
        const AndroidNotificationAction(
          'SKIP',
          '⏭ SKIP',
          showsUserInterface: false,
          cancelNotification: true,
        ),
      ],
      largeIcon: const DrawableResourceAndroidBitmap('@mipmap/ic_launcher'),
      styleInformation: BigTextStyleInformation(
        '${dosage.isNotEmpty ? "$dosage — " : ""}${_getMealTimingText(medicineName)}',
        contentTitle: '💊 Time for $medicineName',
        summaryText: 'Tap TAKEN when done',
      ),
    );

    // Use doseEventId hash as notification ID (fits in int range)
    final notificationId = doseEventId.hashCode.abs() % 2147483647;

    await _plugin.show(
      notificationId,
      '💊 Time for $medicineName',
      dosage.isNotEmpty ? '$dosage — Tap to confirm' : 'Tap TAKEN when done',
      NotificationDetails(android: androidDetails),
      payload: doseEventId,
    );
  }

  /// Show a missed dose notification.
  static Future<void> showMissedDoseAlert({
    required String doseEventId,
    required String medicineName,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      _missedChannelId,
      _missedChannelName,
      importance: Importance.high,
      priority: Priority.high,
    );

    final notificationId = 'missed_$doseEventId'.hashCode.abs() % 2147483647;

    await _plugin.show(
      notificationId,
      '❗ Missed Dose — $medicineName',
      'You missed your scheduled dose. Would you like to take it now?',
      const NotificationDetails(android: androidDetails),
      payload: 'missed:$doseEventId',
    );
  }

  /// Show a low stock notification.
  static Future<void> showLowStockAlert({
    required String medicineName,
    required int stockCount,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      _lowStockChannelId,
      _lowStockChannelName,
      importance: Importance.defaultImportance,
    );

    final notificationId = 'stock_$medicineName'.hashCode.abs() % 2147483647;

    await _plugin.show(
      notificationId,
      '📦 Low Stock — $medicineName',
      'Only $stockCount tablets remaining. Time to refill!',
      const NotificationDetails(android: androidDetails),
    );
  }

  /// Dismiss a specific notification.
  static Future<void> dismissNotification(String doseEventId) async {
    final notificationId = doseEventId.hashCode.abs() % 2147483647;
    await _plugin.cancel(notificationId);
  }

  /// Dismiss all active notifications.
  static Future<void> dismissAll() async {
    await _plugin.cancelAll();
  }

  static void _onNotificationTap(NotificationResponse response) {
    debugPrint('NotificationService: Tapped — payload=${response.payload}, action=${response.actionId}');
    // Handle navigation to dose event screen
    // This is handled by the NavigationService or GoRouter
  }

  @pragma('vm:entry-point')
  static void _onBackgroundNotificationTap(NotificationResponse response) {
    debugPrint('NotificationService: Background tap — action=${response.actionId}');
    // Handle background notification actions (TAKEN, SNOOZE, SKIP)
  }

  static String _getMealTimingText(String medicineName) {
    return 'Check instructions for $medicineName';
  }
}
