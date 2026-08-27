// =============================================================================
// frontend/lib/features/dashboard/presentation/pages/dashboard_page.dart
// Main dashboard — today's doses, upcoming reminders, quick actions
// Senior-friendly: large cards, clear status, voice prompt
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/router.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../domain/entities/dose_event.dart';
import '../../../../domain/enums/dose_status.dart';
import '../widgets/dose_card.dart';
import '../widgets/adherence_summary_card.dart';
import '../widgets/quick_actions_bar.dart';
import '../providers/dashboard_provider.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dashboardState = ref.watch(dashboardProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () => ref.read(dashboardProvider.notifier).refresh(),
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              _buildAppBar(context),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Greeting and date
                      _buildGreeting(context, dashboardState.userName),
                      const SizedBox(height: 20),

                      // Next dose alert (if any pending/upcoming)
                      if (dashboardState.nextDue != null) ...[
                        _buildNextDoseAlert(context, dashboardState.nextDue!),
                        const SizedBox(height: 20),
                      ],

                      // Adherence summary
                      const AdherenceSummaryCard(),
                      const SizedBox(height: 20),

                      // Quick actions
                      const QuickActionsBar(),
                      const SizedBox(height: 24),

                      // Today's dose schedule
                      Text(
                        "Today's Medicines",
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                      const SizedBox(height: 12),
                    ],
                  ),
                ),
              ),

              // Today's dose events list
              dashboardState.isLoading
                  ? const SliverToBoxAdapter(
                      child: Center(
                        child: Padding(
                          padding: EdgeInsets.all(40),
                          child: CircularProgressIndicator(),
                        ),
                      ),
                    )
                  : dashboardState.todayDoses.isEmpty
                      ? SliverToBoxAdapter(child: _buildEmptyState(context))
                      : SliverList(
                          delegate: SliverChildBuilderDelegate(
                            (context, index) {
                              return Padding(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 6),
                                child: DoseCard(
                                  doseEvent: dashboardState.todayDoses[index],
                                  onTaken: () => ref
                                      .read(dashboardProvider.notifier)
                                      .markTaken(dashboardState.todayDoses[index].id),
                                  onSnoozed: () => ref
                                      .read(dashboardProvider.notifier)
                                      .snoozeDose(dashboardState.todayDoses[index].id),
                                  onSkipped: () => ref
                                      .read(dashboardProvider.notifier)
                                      .skipDose(dashboardState.todayDoses[index].id),
                                ),
                              );
                            },
                            childCount: dashboardState.todayDoses.length,
                          ),
                        ),

              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push(AppRoutes.addMedicine),
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add, size: 28, color: Colors.white),
        label: const Text(
          'Add Medicine',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNav(context),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 80,
      floating: true,
      snap: true,
      backgroundColor: AppColors.primary,
      flexibleSpace: FlexibleSpaceBar(
        titlePadding: const EdgeInsets.only(left: 16, bottom: 16),
        title: Row(
          children: [
            const Icon(Icons.local_hospital, color: Colors.white, size: 28),
            const SizedBox(width: 8),
            Text(
              'Medicare',
              style: Theme.of(context)
                  .textTheme
                  .headlineSmall
                  ?.copyWith(color: Colors.white, fontWeight: FontWeight.w800),
            ),
          ],
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined, color: Colors.white, size: 28),
          onPressed: () {},
          tooltip: 'Notifications',
        ),
        IconButton(
          icon: const Icon(Icons.person_outline, color: Colors.white, size: 28),
          onPressed: () => context.push(AppRoutes.profile),
          tooltip: 'Profile',
        ),
      ],
    );
  }

  Widget _buildGreeting(BuildContext context, String? userName) {
    final hour = DateTime.now().hour;
    String greeting;
    if (hour < 12) {
      greeting = 'Good Morning';
    } else if (hour < 17) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '$greeting,',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: AppColors.textSecondary,
              ),
        ),
        Text(
          userName ?? 'Welcome!',
          style: Theme.of(context)
              .textTheme
              .displaySmall
              ?.copyWith(color: AppColors.textPrimary),
        ),
        Text(
          _formattedDate(),
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppColors.textSecondary,
              ),
        ),
      ],
    );
  }

  Widget _buildNextDoseAlert(BuildContext context, DoseEvent nextDue) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.primaryLight,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.alarm, color: Colors.white, size: 40),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'NEXT DOSE',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1,
                  ),
                ),
                Text(
                  nextDue.medicineName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                Text(
                  '${nextDue.dosage} • ${nextDue.scheduledTime}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(40),
      child: Center(
        child: Column(
          children: [
            const Icon(Icons.check_circle_outline, size: 80, color: AppColors.success),
            const SizedBox(height: 16),
            Text(
              'All Done for Today! 🎉',
              style: Theme.of(context).textTheme.headlineSmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'No more medicines scheduled for today.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.textSecondary,
                  ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNav(BuildContext context) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      selectedFontSize: 14,
      unselectedFontSize: 12,
      iconSize: 28,
      selectedItemColor: AppColors.primary,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home_outlined),
          activeIcon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.medication_outlined),
          activeIcon: Icon(Icons.medication),
          label: 'Medicines',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.alarm_outlined),
          activeIcon: Icon(Icons.alarm),
          label: 'Reminders',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.bar_chart_outlined),
          activeIcon: Icon(Icons.bar_chart),
          label: 'History',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.settings_outlined),
          activeIcon: Icon(Icons.settings),
          label: 'Settings',
        ),
      ],
      currentIndex: 0,
      onTap: (index) {
        switch (index) {
          case 1:
            context.go(AppRoutes.medicines);
            break;
          case 2:
            context.go(AppRoutes.reminders);
            break;
          case 3:
            context.go(AppRoutes.history);
            break;
          case 4:
            context.go(AppRoutes.settings);
            break;
        }
      },
    );
  }

  String _formattedDate() {
    final now = DateTime.now();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const weekdays = [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];
    return '${weekdays[now.weekday - 1]}, ${months[now.month - 1]} ${now.day}';
  }
}
