// =============================================================================
// frontend/lib/features/dashboard/presentation/widgets/adherence_summary_card.dart
// =============================================================================

import 'package:flutter/material.dart';
import '../../../../app/theme/app_colors.dart';

class AdherenceSummaryCard extends StatelessWidget {
  const AdherenceSummaryCard({super.key});

  @override
  Widget build(BuildContext context) {
    // In a real app, these values would come from the provider
    const int taken = 3;
    const int total = 4;
    const double percentage = taken / total;

    return Semantics(
      label: 'You have taken $taken out of $total medicines today',
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            // Circular progress indicator
            SizedBox(
              width: 70,
              height: 70,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  CircularProgressIndicator(
                    value: percentage,
                    strokeWidth: 8,
                    backgroundColor: AppColors.success.withOpacity(0.2),
                    valueColor: const AlwaysStoppedAnimation<Color>(AppColors.success),
                  ),
                  Center(
                    child: Text(
                      '${(percentage * 100).toInt()}%',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppColors.success,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Great Job Today!',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w800,
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'You have taken $taken out of $total medicines.',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.textSecondary,
                        ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
