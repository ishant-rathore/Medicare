// =============================================================================
// frontend/lib/domain/enums/medicine_type.dart
// =============================================================================

enum MedicineType {
  tablet,
  capsule,
  syrup,
  drops,
  injection,
  ointment,
  inhaler;

  String get displayName {
    switch (this) {
      case MedicineType.tablet: return 'Tablet';
      case MedicineType.capsule: return 'Capsule';
      case MedicineType.syrup: return 'Syrup';
      case MedicineType.drops: return 'Drops';
      case MedicineType.injection: return 'Injection';
      case MedicineType.ointment: return 'Ointment';
      case MedicineType.inhaler: return 'Inhaler';
    }
  }

  String get dbValue => name.toUpperCase();

  static MedicineType fromString(String value) {
    switch (value.toUpperCase()) {
      case 'TABLET': return MedicineType.tablet;
      case 'CAPSULE': return MedicineType.capsule;
      case 'SYRUP': return MedicineType.syrup;
      case 'DROPS': return MedicineType.drops;
      case 'INJECTION': return MedicineType.injection;
      case 'OINTMENT': return MedicineType.ointment;
      case 'INHALER': return MedicineType.inhaler;
      default: return MedicineType.tablet;
    }
  }
}

// =============================================================================
// frontend/lib/domain/enums/meal_timing.dart
// =============================================================================

enum MealTiming {
  beforeFood,
  afterFood,
  withFood,
  afterDinner,
  emptyStomach,
  bedtime;

  String get displayName {
    switch (this) {
      case MealTiming.beforeFood: return 'Before Food';
      case MealTiming.afterFood: return 'After Food';
      case MealTiming.withFood: return 'With Food';
      case MealTiming.afterDinner: return 'After Dinner';
      case MealTiming.emptyStomach: return 'Empty Stomach';
      case MealTiming.bedtime: return 'Bedtime';
    }
  }

  String get instruction {
    switch (this) {
      case MealTiming.beforeFood: return 'Take 30 minutes before food';
      case MealTiming.afterFood: return 'Take after eating your meal';
      case MealTiming.withFood: return 'Take with your meal';
      case MealTiming.afterDinner: return 'Take after dinner';
      case MealTiming.emptyStomach: return 'Take on empty stomach';
      case MealTiming.bedtime: return 'Take before sleeping';
    }
  }

  String get dbValue {
    switch (this) {
      case MealTiming.beforeFood: return 'BEFORE_FOOD';
      case MealTiming.afterFood: return 'AFTER_FOOD';
      case MealTiming.withFood: return 'WITH_FOOD';
      case MealTiming.afterDinner: return 'AFTER_DINNER';
      case MealTiming.emptyStomach: return 'EMPTY_STOMACH';
      case MealTiming.bedtime: return 'BEDTIME';
    }
  }

  static MealTiming fromString(String value) {
    switch (value.toUpperCase()) {
      case 'BEFORE_FOOD': return MealTiming.beforeFood;
      case 'AFTER_FOOD': return MealTiming.afterFood;
      case 'WITH_FOOD': return MealTiming.withFood;
      case 'AFTER_DINNER': return MealTiming.afterDinner;
      case 'EMPTY_STOMACH': return MealTiming.emptyStomach;
      case 'BEDTIME': return MealTiming.bedtime;
      default: return MealTiming.afterFood;
    }
  }
}

// =============================================================================
// frontend/lib/domain/enums/recurrence_type.dart
// =============================================================================

enum RecurrenceType {
  oneTime,
  daily,
  weekly,
  alternateDays,
  every8Hours,
  every12Hours,
  asNeeded;

  String get displayName {
    switch (this) {
      case RecurrenceType.oneTime: return 'One Time';
      case RecurrenceType.daily: return 'Daily';
      case RecurrenceType.weekly: return 'Weekly';
      case RecurrenceType.alternateDays: return 'Alternate Days';
      case RecurrenceType.every8Hours: return 'Every 8 Hours';
      case RecurrenceType.every12Hours: return 'Every 12 Hours';
      case RecurrenceType.asNeeded: return 'As Needed (SOS)';
    }
  }

  String get dbValue {
    switch (this) {
      case RecurrenceType.oneTime: return 'ONE_TIME';
      case RecurrenceType.daily: return 'DAILY';
      case RecurrenceType.weekly: return 'WEEKLY';
      case RecurrenceType.alternateDays: return 'ALTERNATE_DAYS';
      case RecurrenceType.every8Hours: return 'EVERY_8_HOURS';
      case RecurrenceType.every12Hours: return 'EVERY_12_HOURS';
      case RecurrenceType.asNeeded: return 'AS_NEEDED';
    }
  }

  static RecurrenceType fromString(String value) {
    switch (value.toUpperCase()) {
      case 'ONE_TIME': return RecurrenceType.oneTime;
      case 'DAILY': return RecurrenceType.daily;
      case 'WEEKLY': return RecurrenceType.weekly;
      case 'ALTERNATE_DAYS': return RecurrenceType.alternateDays;
      case 'EVERY_8_HOURS': return RecurrenceType.every8Hours;
      case 'EVERY_12_HOURS': return RecurrenceType.every12Hours;
      case 'AS_NEEDED': return RecurrenceType.asNeeded;
      default: return RecurrenceType.daily;
    }
  }
}
