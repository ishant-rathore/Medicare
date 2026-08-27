// =============================================================================
// frontend/lib/domain/entities/medicine.dart
// Core domain entity — no Flutter or data layer dependencies
// =============================================================================

import '../enums/medicine_type.dart';
import '../enums/meal_timing.dart';
import '../enums/recurrence_type.dart';

class Medicine {
  final String id;
  final String name;
  final String? genericName;
  final String dosage;
  final MedicineType type;
  final String? color;
  final String? shape;
  final String? category;
  final MealTiming mealTiming;
  final List<String> instructions;
  final int stockCount;
  final int lowStockThreshold;
  final DateTime? expiryDate;
  final bool isEssential;
  final bool isActive;
  final String? notes;
  final String? photoUrl;
  final String? prescribedBy;
  final String? customVoiceScript;
  final DateTime? startDate;
  final DateTime? endDate;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Medicine({
    required this.id,
    required this.name,
    this.genericName,
    required this.dosage,
    required this.type,
    this.color,
    this.shape,
    this.category,
    required this.mealTiming,
    this.instructions = const [],
    this.stockCount = 30,
    this.lowStockThreshold = 5,
    this.expiryDate,
    this.isEssential = false,
    this.isActive = true,
    this.notes,
    this.photoUrl,
    this.prescribedBy,
    this.customVoiceScript,
    this.startDate,
    this.endDate,
    required this.createdAt,
    required this.updatedAt,
  });

  bool get isLowStock => stockCount <= lowStockThreshold;
  bool get isOutOfStock => stockCount <= 0;

  bool get isExpired {
    if (expiryDate == null) return false;
    return DateTime.now().isAfter(expiryDate!);
  }

  /// Generate the TTS spoken script for this medicine.
  String buildVoiceScript() {
    if (customVoiceScript != null && customVoiceScript!.isNotEmpty) {
      return customVoiceScript!;
    }
    final buffer = StringBuffer();
    buffer.write('Time to take your $name. ');
    buffer.write('$dosage ${type.displayName}. ');
    buffer.write('${mealTiming.instruction}. ');
    if (instructions.isNotEmpty) {
      buffer.write(instructions.first);
    }
    return buffer.toString();
  }

  Medicine copyWith({
    String? id,
    String? name,
    String? genericName,
    String? dosage,
    MedicineType? type,
    String? color,
    String? shape,
    String? category,
    MealTiming? mealTiming,
    List<String>? instructions,
    int? stockCount,
    int? lowStockThreshold,
    DateTime? expiryDate,
    bool? isEssential,
    bool? isActive,
    String? notes,
    String? photoUrl,
    String? prescribedBy,
    String? customVoiceScript,
    DateTime? startDate,
    DateTime? endDate,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Medicine(
      id: id ?? this.id,
      name: name ?? this.name,
      genericName: genericName ?? this.genericName,
      dosage: dosage ?? this.dosage,
      type: type ?? this.type,
      color: color ?? this.color,
      shape: shape ?? this.shape,
      category: category ?? this.category,
      mealTiming: mealTiming ?? this.mealTiming,
      instructions: instructions ?? this.instructions,
      stockCount: stockCount ?? this.stockCount,
      lowStockThreshold: lowStockThreshold ?? this.lowStockThreshold,
      expiryDate: expiryDate ?? this.expiryDate,
      isEssential: isEssential ?? this.isEssential,
      isActive: isActive ?? this.isActive,
      notes: notes ?? this.notes,
      photoUrl: photoUrl ?? this.photoUrl,
      prescribedBy: prescribedBy ?? this.prescribedBy,
      customVoiceScript: customVoiceScript ?? this.customVoiceScript,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) || (other is Medicine && other.id == id);

  @override
  int get hashCode => id.hashCode;
}
