// =============================================================================
// frontend/lib/features/medicines/presentation/pages/add_medicine_page.dart
// =============================================================================

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/theme/app_colors.dart';

class AddMedicinePage extends StatelessWidget {
  final String? medicineId;

  const AddMedicinePage({super.key, this.medicineId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(medicineId == null ? 'Add Medicine' : 'Edit Medicine'),
      ),
      body: const Padding(
        padding: EdgeInsets.all(16.0),
        child: Center(
          child: Text(
            'Form implementation coming next...',
            style: TextStyle(fontSize: 18, color: AppColors.textSecondary),
          ),
        ),
      ),
    );
  }
}
