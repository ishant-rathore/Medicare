// =============================================================================
// frontend/lib/services/reminder_engine/recurrence_calculator.dart
// Calculates next alarm occurrence based on recurrence rules
// Pure logic — fully testable with no external dependencies
// =============================================================================

class RecurrenceCalculator {
  /// Calculate the next occurrence of an alarm starting from now.
  DateTime? nextOccurrence({
    required String recurrence,
    required String scheduledTime,
    required DateTime startDate,
    DateTime? endDate,
    List<int> daysOfWeek = const [],
  }) {
    return nextOccurrenceAfter(
      recurrence: recurrence,
      scheduledTime: scheduledTime,
      after: DateTime.now(),
      daysOfWeek: daysOfWeek,
      endDate: endDate,
    );
  }

  /// Calculate next occurrence after a given reference time.
  DateTime? nextOccurrenceAfter({
    required String recurrence,
    required String scheduledTime,
    required DateTime after,
    List<int> daysOfWeek = const [],
    DateTime? endDate,
  }) {
    final timeParts = scheduledTime.split(':');
    if (timeParts.length != 2) return null;

    final hour = int.tryParse(timeParts[0]);
    final minute = int.tryParse(timeParts[1]);
    if (hour == null || minute == null) return null;

    DateTime candidate;

    switch (recurrence.toUpperCase()) {
      case 'ONE_TIME':
        candidate = DateTime(after.year, after.month, after.day, hour, minute);
        if (candidate.isBefore(after)) return null;
        break;

      case 'DAILY':
        candidate = DateTime(after.year, after.month, after.day, hour, minute);
        if (candidate.isBefore(after) || candidate.isAtSameMomentAs(after)) {
          candidate = candidate.add(const Duration(days: 1));
        }
        break;

      case 'ALTERNATE_DAYS':
        candidate = DateTime(after.year, after.month, after.day, hour, minute);
        if (candidate.isBefore(after) || candidate.isAtSameMomentAs(after)) {
          candidate = candidate.add(const Duration(days: 2));
        } else {
          candidate = candidate.add(const Duration(days: 2));
        }
        break;

      case 'WEEKLY':
        if (daysOfWeek.isEmpty) return null;
        candidate = _nextWeekdayOccurrence(
          hour: hour,
          minute: minute,
          after: after,
          daysOfWeek: daysOfWeek,
        );
        break;

      case 'EVERY_8_HOURS':
        candidate = after.add(const Duration(hours: 8));
        candidate = DateTime(
          candidate.year,
          candidate.month,
          candidate.day,
          candidate.hour,
          candidate.minute,
        );
        break;

      case 'EVERY_12_HOURS':
        candidate = after.add(const Duration(hours: 12));
        candidate = DateTime(
          candidate.year,
          candidate.month,
          candidate.day,
          candidate.hour,
          candidate.minute,
        );
        break;

      case 'AS_NEEDED':
        // No automatic scheduling — triggered manually
        return null;

      default:
        return null;
    }

    // Check end date
    if (endDate != null && candidate.isAfter(endDate)) return null;

    return candidate;
  }

  DateTime _nextWeekdayOccurrence({
    required int hour,
    required int minute,
    required DateTime after,
    required List<int> daysOfWeek,
  }) {
    DateTime candidate = DateTime(after.year, after.month, after.day, hour, minute);

    // Try up to 7 days to find the next matching weekday
    for (int i = 0; i <= 7; i++) {
      final date = candidate.add(Duration(days: i));
      if (daysOfWeek.contains(date.weekday % 7)) {
        // weekday % 7 converts Mon=1..Sun=7 to 0=Sun..6=Sat convention
        if (date.isAfter(after)) return date;
      }
    }

    // Fallback: return candidate + 7 days
    return candidate.add(const Duration(days: 7));
  }

  /// Calculate the number of doses remaining until end date.
  int estimateRemainingDoses({
    required String recurrence,
    required int timesPerDay,
    required DateTime startDate,
    required DateTime endDate,
  }) {
    final days = endDate.difference(startDate).inDays;
    switch (recurrence.toUpperCase()) {
      case 'DAILY': return days * timesPerDay;
      case 'ALTERNATE_DAYS': return (days ~/ 2) * timesPerDay;
      case 'WEEKLY': return (days ~/ 7) * timesPerDay;
      case 'ONE_TIME': return timesPerDay;
      default: return 0;
    }
  }
}
