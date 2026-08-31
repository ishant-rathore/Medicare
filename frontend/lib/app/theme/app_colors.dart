// =============================================================================
// frontend/lib/app/theme/app_colors.dart
// Color palette for Medicare — senior-friendly, high contrast
// =============================================================================

import 'package:flutter/material.dart';

abstract class AppColors {
  // ─── Primary Brand ──────────────────────────────────────────────────────
  static const Color primary = Color(0xFF1565C0);      // Deep Blue
  static const Color primaryLight = Color(0xFF1E88E5); // Medium Blue
  static const Color primaryDark = Color(0xFF0D47A1);  // Dark Blue

  // ─── Secondary ─────────────────────────────────────────────────────────
  static const Color secondary = Color(0xFF00897B);    // Teal
  static const Color secondaryLight = Color(0xFF26A69A);
  static const Color secondaryDark = Color(0xFF00695C);

  // ─── Status Colors ──────────────────────────────────────────────────────
  static const Color success = Color(0xFF2E7D32);      // Dark Green (accessible)
  static const Color warning = Color(0xFFE65100);      // Deep Orange
  static const Color error = Color(0xFFC62828);        // Deep Red
  static const Color info = Color(0xFF1565C0);         // Blue

  // ─── Dose Status ───────────────────────────────────────────────────────
  static const Color taken = Color(0xFF2E7D32);        // Green — positive action
  static const Color missed = Color(0xFFC62828);       // Red — alert
  static const Color snoozed = Color(0xFFE65100);      // Orange — caution
  static const Color skipped = Color(0xFF616161);      // Grey — neutral
  static const Color pending = Color(0xFF1565C0);      // Blue — action needed

  // ─── Surface / Background ──────────────────────────────────────────────
  static const Color background = Color(0xFFF5F7FA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFEEF2FF);
  static const Color inputFill = Color(0xFFF8F9FA);

  // ─── Text ───────────────────────────────────────────────────────────────
  static const Color textPrimary = Color(0xFF1A1A2E);    // Near-black, high contrast
  static const Color textSecondary = Color(0xFF4A5568);  // Dark grey
  static const Color textDisabled = Color(0xFF9E9E9E);
  static const Color hint = Color(0xFF9E9E9E);

  // ─── Border ─────────────────────────────────────────────────────────────
  static const Color border = Color(0xFFDDE1EA);
  static const Color divider = Color(0xFFE8EAF0);

  // ─── Pill Colors (for visual medicine identification) ───────────────────
  static const Map<String, Color> pillColors = {
    'Blue': Color(0xFF1565C0),
    'White': Color(0xFFEEEEEE),
    'Red': Color(0xFFC62828),
    'Yellow': Color(0xFFF9A825),
    'Orange': Color(0xFFE65100),
    'Green': Color(0xFF2E7D32),
    'Pink': Color(0xFFAD1457),
    'Purple': Color(0xFF6A1B9A),
    'Peach': Color(0xFFFF8A65),
    'Brown': Color(0xFF6D4C41),
  };
}
