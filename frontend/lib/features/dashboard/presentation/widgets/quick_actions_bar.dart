// =============================================================================
// frontend/lib/features/dashboard/presentation/widgets/quick_actions_bar.dart
// =============================================================================

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/router.dart';
import '../../../../app/theme/app_colors.dart';

class QuickActionsBar extends StatelessWidget {
  const QuickActionsBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildAction(
          context,
          icon: Icons.list_alt,
          label: 'Medicines',
          color: AppColors.primary,
          onTap: () => context.push(AppRoutes.medicines),
        ),
        _buildAction(
          context,
          icon: Icons.people_alt_outlined,
          label: 'Caregivers',
          color: Colors.purple,
          onTap: () => context.push(AppRoutes.caregivers),
        ),
        _buildAction(
          context,
          icon: Icons.record_voice_over,
          label: 'Voice',
          color: Colors.teal,
          onTap: () => context.push(AppRoutes.voiceSettings),
        ),
        _buildAction(
          context,
          icon: Icons.local_pharmacy_outlined,
          label: 'Refills',
          color: Colors.orange,
          onTap: () => context.push(AppRoutes.refill),
        ),
      ],
    );
  }

  Widget _buildAction(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
