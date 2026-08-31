// =============================================================================
// frontend/lib/features/dashboard/presentation/widgets/dose_card.dart
// Large, accessible card for displaying a single dose event
// Senior-friendly: HUGE buttons, clear color coding, clear text
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../domain/entities/dose_event.dart';
import '../../../../domain/enums/dose_status.dart';

class DoseCard extends StatelessWidget {
  final DoseEvent doseEvent;
  final VoidCallback? onTaken;
  final VoidCallback? onSnoozed;
  final VoidCallback? onSkipped;

  const DoseCard({
    super.key,
    required this.doseEvent,
    this.onTaken,
    this.onSnoozed,
    this.onSkipped,
  });

  @override
  Widget build(BuildContext context) {
    final isActionable = doseEvent.isPending || doseEvent.isSnoozed;
    final statusColor = _statusColor(doseEvent.status);

    return Semantics(
      label: '${doseEvent.medicineName}, ${doseEvent.dosage}, ${doseEvent.scheduledTime}, status: ${doseEvent.status.displayName}',
      child: Card(
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: isActionable && doseEvent.isOverdue
                ? AppColors.error
                : doseEvent.isPending
                    ? AppColors.primary.withOpacity(0.3)
                    : Colors.transparent,
            width: 2,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header row: time, medicine name, status badge
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTimeIndicator(context),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          doseEvent.medicineName,
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.w800,
                              ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          doseEvent.dosage,
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                color: AppColors.textSecondary,
                              ),
                        ),
                      ],
                    ),
                  ),
                  _buildStatusBadge(context, doseEvent.status, statusColor),
                ],
              ),

              const SizedBox(height: 8),

              // Meal timing instruction
              Row(
                children: [
                  Icon(Icons.restaurant, size: 18, color: AppColors.textSecondary),
                  const SizedBox(width: 6),
                  Text(
                    doseEvent.mealTiming.instruction,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.textSecondary,
                        ),
                  ),
                ],
              ),

              if (doseEvent.isOverdue && isActionable) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(Icons.warning_amber_rounded, size: 18, color: AppColors.error),
                    const SizedBox(width: 6),
                    Text(
                      'OVERDUE',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.error,
                            fontWeight: FontWeight.w800,
                          ),
                    ),
                  ],
                ),
              ],

              // Action buttons — only for pending/snoozed doses
              if (isActionable) ...[
                const SizedBox(height: 16),
                const Divider(height: 1),
                const SizedBox(height: 16),
                _buildActionButtons(context),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTimeIndicator(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          const Icon(Icons.schedule, size: 20, color: AppColors.primary),
          const SizedBox(height: 4),
          Text(
            doseEvent.scheduledTime,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w800,
              color: AppColors.primary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(BuildContext context, DoseStatus status, Color color) {
    if (status == DoseStatus.pending) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Text(
        status.displayName.toUpperCase(),
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w800,
          color: color,
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Row(
      children: [
        // TAKEN — primary action (large and prominent)
        Expanded(
          flex: 5,
          child: ElevatedButton.icon(
            onPressed: () {
              HapticFeedback.mediumImpact();
              onTaken?.call();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.success,
              minimumSize: const Size(0, 52),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
            ),
            icon: const Icon(Icons.check_circle, color: Colors.white, size: 22),
            label: const Text(
              'TAKEN',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: Colors.white,
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
        // SNOOZE — secondary action
        Expanded(
          flex: 3,
          child: OutlinedButton.icon(
            onPressed: () {
              HapticFeedback.lightImpact();
              onSnoozed?.call();
            },
            style: OutlinedButton.styleFrom(
              minimumSize: const Size(0, 52),
              side: const BorderSide(color: AppColors.warning, width: 2),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
            ),
            icon: const Icon(Icons.snooze, color: AppColors.warning, size: 20),
            label: const Text(
              'SNOOZE',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: AppColors.warning,
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
        // SKIP — tertiary action (less prominent)
        IconButton(
          onPressed: () {
            HapticFeedback.lightImpact();
            _confirmSkip(context);
          },
          style: IconButton.styleFrom(
            minimumSize: const Size(52, 52),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
              side: BorderSide(color: Colors.grey[300]!, width: 1),
            ),
          ),
          icon: const Icon(Icons.skip_next, size: 24, color: AppColors.textSecondary),
          tooltip: 'Skip dose',
        ),
      ],
    );
  }

  Future<void> _confirmSkip(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Skip this dose?', style: TextStyle(fontSize: 20)),
        content: Text(
          'Are you sure you want to skip ${doseEvent.medicineName}?',
          style: const TextStyle(fontSize: 17),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel', style: TextStyle(fontSize: 16)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.grey),
            child: const Text('Skip', style: TextStyle(fontSize: 16, color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      onSkipped?.call();
    }
  }

  Color _statusColor(DoseStatus status) {
    switch (status) {
      case DoseStatus.taken:
        return AppColors.taken;
      case DoseStatus.missed:
        return AppColors.missed;
      case DoseStatus.snoozed:
        return AppColors.snoozed;
      case DoseStatus.skipped:
        return AppColors.skipped;
      case DoseStatus.pending:
        return AppColors.pending;
    }
  }
}
