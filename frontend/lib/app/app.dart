// =============================================================================
// frontend/lib/app/app.dart
// Root MaterialApp with theme and routing
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'router.dart';
import 'theme/app_theme.dart';

class MedicareApp extends ConsumerWidget {
  const MedicareApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'Medicare',
      debugShowCheckedModeBanner: false,

      // Senior-friendly theme
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.light, // Start with light; user can toggle in settings

      // GoRouter
      routerConfig: router,

      // Localization
      supportedLocales: const [
        Locale('en', 'US'),
        Locale('hi', 'IN'),
        Locale('mr', 'IN'),
        Locale('ta', 'IN'),
        Locale('te', 'IN'),
        Locale('gu', 'IN'),
        Locale('bn', 'IN'),
        Locale('kn', 'IN'),
      ],
    );
  }
}
