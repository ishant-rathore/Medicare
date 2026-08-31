// =============================================================================
// frontend/lib/app/theme/app_theme.dart
// Senior-friendly Material 3 theme with large fonts and high contrast
// =============================================================================

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

abstract class AppTheme {
  static ThemeData get light => ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.primary,
          brightness: Brightness.light,
          primary: AppColors.primary,
          secondary: AppColors.secondary,
          surface: AppColors.surface,
          error: AppColors.error,
        ),
        textTheme: _buildTextTheme(Brightness.light),
        appBarTheme: AppBarTheme(
          elevation: 0,
          centerTitle: true,
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          titleTextStyle: GoogleFonts.nunito(
            fontSize: 22,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
          iconTheme: const IconThemeData(color: Colors.white, size: 28),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            minimumSize: const Size(double.infinity, 56), // Large touch target
            textStyle: GoogleFonts.nunito(fontSize: 18, fontWeight: FontWeight.w700),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(double.infinity, 56),
            textStyle: GoogleFonts.nunito(fontSize: 18, fontWeight: FontWeight.w600),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: AppColors.inputFill,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: AppColors.border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: AppColors.border),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: AppColors.primary, width: 2),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          labelStyle: GoogleFonts.nunito(fontSize: 16),
          hintStyle: GoogleFonts.nunito(fontSize: 16, color: AppColors.hint),
        ),
        cardTheme: CardThemeData(
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          color: Colors.white,
        ),
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          elevation: 6,
          extendedPadding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        ),
        switchTheme: SwitchThemeData(
          thumbColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) return AppColors.primary;
            return Colors.grey[400];
          }),
        ),
        sliderTheme: SliderThemeData(
          thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 14),
          trackHeight: 6,
        ),
        iconTheme: const IconThemeData(size: 28),
        listTileTheme: const ListTileThemeData(
          minVerticalPadding: 12,
          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        ),
      );

  static ThemeData get dark => ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.primary,
          brightness: Brightness.dark,
        ),
        textTheme: _buildTextTheme(Brightness.dark),
      );

  static TextTheme _buildTextTheme(Brightness brightness) {
    final Color textColor = brightness == Brightness.light ? AppColors.textPrimary : Colors.white;
    final Color subtitleColor = brightness == Brightness.light ? AppColors.textSecondary : Colors.white70;

    return TextTheme(
      // Large display for critical information (medicine name, next dose time)
      displayLarge: GoogleFonts.nunito(fontSize: 32, fontWeight: FontWeight.w800, color: textColor),
      displayMedium: GoogleFonts.nunito(fontSize: 28, fontWeight: FontWeight.w700, color: textColor),
      displaySmall: GoogleFonts.nunito(fontSize: 24, fontWeight: FontWeight.w700, color: textColor),

      // Headlines
      headlineLarge: GoogleFonts.nunito(fontSize: 26, fontWeight: FontWeight.w700, color: textColor),
      headlineMedium: GoogleFonts.nunito(fontSize: 22, fontWeight: FontWeight.w700, color: textColor),
      headlineSmall: GoogleFonts.nunito(fontSize: 20, fontWeight: FontWeight.w600, color: textColor),

      // Titles
      titleLarge: GoogleFonts.nunito(fontSize: 20, fontWeight: FontWeight.w700, color: textColor),
      titleMedium: GoogleFonts.nunito(fontSize: 18, fontWeight: FontWeight.w600, color: textColor),
      titleSmall: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w600, color: textColor),

      // Body (minimum 16sp for senior readability)
      bodyLarge: GoogleFonts.nunito(fontSize: 18, fontWeight: FontWeight.w500, color: textColor),
      bodyMedium: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w400, color: textColor),
      bodySmall: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w400, color: subtitleColor),

      // Labels
      labelLarge: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w700, color: textColor),
      labelMedium: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w600, color: subtitleColor),
      labelSmall: GoogleFonts.nunito(fontSize: 12, fontWeight: FontWeight.w500, color: subtitleColor),
    );
  }
}
