// =============================================================================
// frontend/lib/features/profile/presentation/pages/profile_setup_page.dart
// Initial profile setup after registration
// =============================================================================

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/router.dart';
import '../../../../app/theme/app_colors.dart';

class ProfileSetupPage extends StatefulWidget {
  const ProfileSetupPage({super.key});

  @override
  State<ProfileSetupPage> createState() => _ProfileSetupPageState();
}

class _ProfileSetupPageState extends State<ProfileSetupPage> {
  final _ageController = TextEditingController();
  final _caregiverNameController = TextEditingController();
  final _caregiverPhoneController = TextEditingController();

  @override
  void dispose() {
    _ageController.dispose();
    _caregiverNameController.dispose();
    _caregiverPhoneController.dispose();
    super.dispose();
  }

  void _completeSetup() {
    // In a real app, we would save this to the SQLite UserProfile table
    // and enqueue it for backend sync.
    // For now, simply navigate to the dashboard.
    context.go(AppRoutes.dashboard);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Complete Your Profile'),
        automaticallyImplyLeading: false, // Prevent going back to register
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Tell us a bit more so we can personalize your experience.',
                style: TextStyle(fontSize: 18, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 32),
              TextField(
                controller: _ageController,
                keyboardType: TextInputType.number,
                style: const TextStyle(fontSize: 20),
                decoration: InputDecoration(
                  labelText: 'Your Age (Optional)',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  prefixIcon: const Icon(Icons.cake),
                ),
              ),
              const SizedBox(height: 32),
              const Text(
                'Caregiver Details (Optional)',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primary),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _caregiverNameController,
                style: const TextStyle(fontSize: 20),
                decoration: InputDecoration(
                  labelText: 'Caregiver Name',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  prefixIcon: const Icon(Icons.person_outline),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _caregiverPhoneController,
                keyboardType: TextInputType.phone,
                style: const TextStyle(fontSize: 20),
                decoration: InputDecoration(
                  labelText: 'Caregiver Phone Number',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  prefixIcon: const Icon(Icons.phone),
                ),
              ),
              const SizedBox(height: 48),
              SizedBox(
                height: 60,
                child: ElevatedButton(
                  onPressed: _completeSetup,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Complete Setup', style: TextStyle(fontSize: 20, color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: _completeSetup,
                child: const Text('Skip for now', style: TextStyle(fontSize: 18, color: AppColors.textSecondary)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
