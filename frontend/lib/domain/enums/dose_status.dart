// =============================================================================
// frontend/lib/domain/enums/dose_status.dart
// =============================================================================

enum DoseStatus {
  pending,
  taken,
  snoozed,
  skipped,
  missed;

  String get displayName {
    switch (this) {
      case DoseStatus.pending: return 'Pending';
      case DoseStatus.taken: return 'Taken';
      case DoseStatus.snoozed: return 'Snoozed';
      case DoseStatus.skipped: return 'Skipped';
      case DoseStatus.missed: return 'Missed';
    }
  }

  String get dbValue {
    return name.toUpperCase();
  }

  static DoseStatus fromString(String value) {
    switch (value.toUpperCase()) {
      case 'PENDING': return DoseStatus.pending;
      case 'TAKEN': return DoseStatus.taken;
      case 'SNOOZED': return DoseStatus.snoozed;
      case 'SKIPPED': return DoseStatus.skipped;
      case 'MISSED': return DoseStatus.missed;
      default: return DoseStatus.pending;
    }
  }
}
