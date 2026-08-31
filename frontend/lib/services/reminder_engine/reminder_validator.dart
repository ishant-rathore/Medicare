// =============================================================================
// frontend/lib/services/reminder_engine/reminder_validator.dart
// =============================================================================

import '../../data/local/entities/reminder_entity.dart';

class ReminderValidator {
  ValidationResult validateReminder(ReminderEntity reminder) {
    final errors = <String>[];

    if (reminder.scheduledTimes.isEmpty) {
      errors.add('At least one scheduled time must be provided');
    }

    if (reminder.recurrence.isEmpty) {
      errors.add('Recurrence type is required');
    }

    if (reminder.recurrence.toUpperCase() == 'WEEKLY' && reminder.daysOfWeek.isEmpty) {
      errors.add('At least one day of the week must be selected for weekly recurrence');
    }

    if (reminder.endDate != null && reminder.endDate!.isBefore(reminder.startDate)) {
      errors.add('End date cannot be before start date');
    }

    return ValidationResult(
      isValid: errors.isEmpty,
      errors: errors,
    );
  }
}

class ValidationResult {
  final bool isValid;
  final List<String> errors;

  ValidationResult({required this.isValid, required this.errors});
}
