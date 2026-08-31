// =============================================================================
// frontend/lib/app/router.dart
// GoRouter configuration with all application routes
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../features/onboarding/presentation/pages/splash_page.dart';
import '../features/onboarding/presentation/pages/onboarding_page.dart';
import '../features/auth/presentation/pages/login_page.dart';
import '../features/auth/presentation/pages/register_page.dart';
import '../features/profile/presentation/pages/profile_setup_page.dart';
import '../features/profile/presentation/pages/profile_page.dart';
import '../features/dashboard/presentation/pages/dashboard_page.dart';
import '../features/medicines/presentation/pages/medicine_list_page.dart';
import '../features/medicines/presentation/pages/add_medicine_page.dart';
import '../features/medicines/presentation/pages/medicine_detail_page.dart';
import '../features/reminders/presentation/pages/reminder_list_page.dart';
import '../features/reminders/presentation/pages/schedule_reminder_page.dart';
import '../features/history/presentation/pages/dose_history_page.dart';
import '../features/history/presentation/pages/adherence_page.dart';
import '../features/caregiver/presentation/pages/caregiver_list_page.dart';
import '../features/voice/presentation/pages/voice_settings_page.dart';
import '../features/refill/presentation/pages/refill_page.dart';
import '../features/accessibility/presentation/pages/accessibility_settings_page.dart';
import '../features/settings/presentation/pages/settings_page.dart';
import '../features/support/presentation/pages/support_page.dart';
import '../features/support/presentation/pages/emergency_contacts_page.dart';

part 'router.g.dart';

// Route names as constants to prevent typos
abstract class AppRoutes {
  static const splash = '/';
  static const onboarding = '/onboarding';
  static const login = '/login';
  static const register = '/register';
  static const profileSetup = '/profile-setup';
  static const dashboard = '/dashboard';
  static const profile = '/profile';
  static const medicines = '/medicines';
  static const addMedicine = '/medicines/add';
  static const editMedicine = '/medicines/:id/edit';
  static const medicineDetail = '/medicines/:id';
  static const reminders = '/reminders';
  static const scheduleReminder = '/reminders/schedule/:medicineId';
  static const history = '/history';
  static const adherence = '/adherence';
  static const caregivers = '/caregivers';
  static const voiceSettings = '/settings/voice';
  static const refill = '/refill';
  static const accessibility = '/settings/accessibility';
  static const settings = '/settings';
  static const support = '/support';
  static const emergencyContacts = '/emergency-contacts';
}

@riverpod
GoRouter appRouter(AppRouterRef ref) {
  return GoRouter(
    initialLocation: AppRoutes.splash,
    debugLogDiagnostics: false,
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        builder: (context, state) => const SplashPage(),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        builder: (context, state) => const OnboardingPage(),
      ),
      GoRoute(
        path: AppRoutes.login,
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: AppRoutes.register,
        builder: (context, state) => const RegisterPage(),
      ),
      GoRoute(
        path: AppRoutes.profileSetup,
        builder: (context, state) => const ProfileSetupPage(),
      ),
      GoRoute(
        path: AppRoutes.dashboard,
        builder: (context, state) => const DashboardPage(),
      ),
      GoRoute(
        path: AppRoutes.profile,
        builder: (context, state) => const ProfilePage(),
      ),
      GoRoute(
        path: AppRoutes.medicines,
        builder: (context, state) => const MedicineListPage(),
      ),
      GoRoute(
        path: AppRoutes.addMedicine,
        builder: (context, state) => const AddMedicinePage(),
      ),
      GoRoute(
        path: AppRoutes.medicineDetail,
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return MedicineDetailPage(medicineId: id);
        },
      ),
      GoRoute(
        path: '/medicines/:id/edit',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return AddMedicinePage(medicineId: id);
        },
      ),
      GoRoute(
        path: AppRoutes.reminders,
        builder: (context, state) => const ReminderListPage(),
      ),
      GoRoute(
        path: '/reminders/schedule/:medicineId',
        builder: (context, state) {
          final medicineId = state.pathParameters['medicineId']!;
          return ScheduleReminderPage(medicineId: medicineId);
        },
      ),
      GoRoute(
        path: AppRoutes.history,
        builder: (context, state) => const DoseHistoryPage(),
      ),
      GoRoute(
        path: AppRoutes.adherence,
        builder: (context, state) => const AdherencePage(),
      ),
      GoRoute(
        path: AppRoutes.caregivers,
        builder: (context, state) => const CaregiverListPage(),
      ),
      GoRoute(
        path: AppRoutes.voiceSettings,
        builder: (context, state) => const VoiceSettingsPage(),
      ),
      GoRoute(
        path: AppRoutes.refill,
        builder: (context, state) => const RefillPage(),
      ),
      GoRoute(
        path: AppRoutes.accessibility,
        builder: (context, state) => const AccessibilitySettingsPage(),
      ),
      GoRoute(
        path: AppRoutes.settings,
        builder: (context, state) => const SettingsPage(),
      ),
      GoRoute(
        path: AppRoutes.support,
        builder: (context, state) => const SupportPage(),
      ),
      GoRoute(
        path: AppRoutes.emergencyContacts,
        builder: (context, state) => const EmergencyContactsPage(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            Text(
              'Page not found',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.go(AppRoutes.dashboard),
              child: const Text('Go to Dashboard'),
            ),
          ],
        ),
      ),
    ),
  );
}
