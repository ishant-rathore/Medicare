import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/services/reminder_engine/recurrence_calculator.dart';

void main() {
  group('RecurrenceCalculator Tests', () {
    late RecurrenceCalculator calculator;

    setUp(() {
      calculator = RecurrenceCalculator();
    });

    test('nextOccurrenceAfter for DAILY recurrence returns next day if time has passed', () {
      final now = DateTime(2026, 1, 1, 10, 0); // Jan 1, 10:00 AM
      
      final next = calculator.nextOccurrenceAfter(
        recurrence: 'DAILY',
        scheduledTime: '08:00', // 8:00 AM
        after: now,
      );

      // Should be scheduled for Jan 2, 8:00 AM
      expect(next, isNotNull);
      expect(next!.year, 2026);
      expect(next.month, 1);
      expect(next.day, 2);
      expect(next.hour, 8);
      expect(next.minute, 0);
    });

    test('nextOccurrenceAfter for DAILY recurrence returns same day if time is in future', () {
      final now = DateTime(2026, 1, 1, 10, 0); // Jan 1, 10:00 AM
      
      final next = calculator.nextOccurrenceAfter(
        recurrence: 'DAILY',
        scheduledTime: '12:00', // 12:00 PM
        after: now,
      );

      // Should be scheduled for Jan 1, 12:00 PM
      expect(next, isNotNull);
      expect(next!.year, 2026);
      expect(next.month, 1);
      expect(next.day, 1);
      expect(next.hour, 12);
      expect(next.minute, 0);
    });

    test('nextOccurrenceAfter for WEEKLY correctly finds next occurrence', () {
      // Jan 1, 2026 is a Thursday (Weekday 4 in Dart, 4 % 7 = 4)
      final now = DateTime(2026, 1, 1, 10, 0); 
      
      // Schedule for Monday (1) and Friday (5)
      final next = calculator.nextOccurrenceAfter(
        recurrence: 'WEEKLY',
        scheduledTime: '08:00',
        after: now,
        daysOfWeek: [1, 5],
      );

      // Next should be Friday, Jan 2, 2026 at 8:00 AM
      expect(next, isNotNull);
      expect(next!.year, 2026);
      expect(next.month, 1);
      expect(next.day, 2);
      expect(next.hour, 8);
      expect(next.minute, 0);
    });

    test('nextOccurrenceAfter for ONE_TIME returns null if time has passed', () {
      final now = DateTime(2026, 1, 1, 10, 0); 
      
      final next = calculator.nextOccurrenceAfter(
        recurrence: 'ONE_TIME',
        scheduledTime: '08:00',
        after: now,
      );

      expect(next, isNull);
    });
  });
}
