// =============================================================================
// frontend/lib/main.dart
// Application entry point
// =============================================================================

import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app/app.dart';
import 'app/bootstrap/bootstrap.dart';
import 'core/platform/android_channel.dart';
import 'services/notifications/notification_service.dart';
import 'services/reminder_engine/alarm_receiver.dart';

/// Entry point for the background alarm callback.
/// This runs in a separate Dart isolate when an alarm fires.
@pragma('vm:entry-point')
void alarmCallback() {
  AlarmReceiver.handleAlarmCallback();
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Lock orientation to portrait (senior-friendly)
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Set system UI overlay style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );

  // Initialize Firebase
  await Firebase.initializeApp();

  // Initialize local notification service
  await NotificationService.initialize();

  // Initialize Android-specific platform channels
  await AndroidChannel.initialize();

  // Bootstrap dependency injection and local database
  final container = await Bootstrap.initialize();

  runApp(
    ProviderScope(
      parent: container,
      child: const MedicareApp(),
    ),
  );
}
