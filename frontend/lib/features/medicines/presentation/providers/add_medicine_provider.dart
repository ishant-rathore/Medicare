// =============================================================================
// frontend/lib/features/medicines/presentation/providers/add_medicine_provider.dart
// State management for the Add Medicine form
// =============================================================================

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../domain/entities/medicine.dart';
import '../../../../domain/enums/medicine_type.dart';
import '../../../../domain/enums/meal_timing.dart';
import '../../../../domain/enums/recurrence_type.dart';
import '../../../../data/local/entities/reminder_entity.dart';
import '../../../../data/repositories/medicine_repository_impl.dart';
import '../../../../data/local/daos/medicine_dao.dart';
import '../../../../data/local/database_service.dart';
import '../../../../services/sync/sync_service.dart';
import '../../../../data/remote/api_client.dart';
import 'package:uuid/uuid.dart';

// Provide dependencies
final dbProvider = Provider<DatabaseService>((ref) => DatabaseService());
final apiProvider = Provider<ApiClient>((ref) => ApiClient(baseUrl: 'http://localhost:3000/api/v1'));
final syncServiceProvider = Provider<SyncService>((ref) => SyncService(db: ref.watch(dbProvider), api: ref.watch(apiProvider)));
final medicineDaoProvider = Provider<MedicineDao>((ref) => MedicineDao(ref.watch(dbProvider)));
final medicineRepositoryProvider = Provider<MedicineRepositoryImpl>((ref) => MedicineRepositoryImpl(ref.watch(medicineDaoProvider), ref.watch(syncServiceProvider)));

class AddMedicineState {
  final int currentStep;
  final bool isSaving;
  final String name;
  final String dosage;
  final MedicineType type;
  final MealTiming mealTiming;
  final RecurrenceType recurrence;
  final List<String> times;
  final String? photoPath;

  AddMedicineState({
    this.currentStep = 0,
    this.isSaving = false,
    this.name = '',
    this.dosage = '',
    this.type = MedicineType.tablet,
    this.mealTiming = MealTiming.afterFood,
    this.recurrence = RecurrenceType.daily,
    this.times = const ['08:00'],
    this.photoPath,
  });

  AddMedicineState copyWith({
    int? currentStep,
    bool? isSaving,
    String? name,
    String? dosage,
    MedicineType? type,
    MealTiming? mealTiming,
    RecurrenceType? recurrence,
    List<String>? times,
    String? photoPath,
  }) {
    return AddMedicineState(
      currentStep: currentStep ?? this.currentStep,
      isSaving: isSaving ?? this.isSaving,
      name: name ?? this.name,
      dosage: dosage ?? this.dosage,
      type: type ?? this.type,
      mealTiming: mealTiming ?? this.mealTiming,
      recurrence: recurrence ?? this.recurrence,
      times: times ?? this.times,
      photoPath: photoPath ?? this.photoPath,
    );
  }
}

class AddMedicineNotifier extends StateNotifier<AddMedicineState> {
  final MedicineRepositoryImpl _repository;

  AddMedicineNotifier(this._repository) : super(AddMedicineState());

  void setStep(int step) {
    state = state.copyWith(currentStep: step);
  }

  void updateName(String name) {
    state = state.copyWith(name: name);
  }

  void updateDosage(String dosage) {
    state = state.copyWith(dosage: dosage);
  }

  void updateType(MedicineType type) {
    state = state.copyWith(type: type);
  }

  void updateMealTiming(MealTiming timing) {
    state = state.copyWith(mealTiming: timing);
  }

  void updateRecurrence(RecurrenceType recurrence) {
    state = state.copyWith(recurrence: recurrence);
  }

  void updateTimes(List<String> times) {
    state = state.copyWith(times: times);
  }

  void updatePhoto(String path) {
    state = state.copyWith(photoPath: path);
  }

  Future<bool> saveMedicine() async {
    if (state.name.isEmpty || state.dosage.isEmpty) return false;

    state = state.copyWith(isSaving: true);

    try {
      final now = DateTime.now();
      
      final medicine = Medicine(
        id: const Uuid().v4(),
        name: state.name,
        dosage: state.dosage,
        type: state.type,
        mealTiming: state.mealTiming,
        photoUrl: state.photoPath,
        startDate: now,
        createdAt: now,
        updatedAt: now,
      );

      await _repository.addMedicine(medicine);
      
      // In a full implementation, we'd also save the ReminderEntity to ReminderDao here
      // and invoke the ReminderEngine.scheduleRemindersForMedicine

      state = state.copyWith(isSaving: false);
      return true;
    } catch (e) {
      state = state.copyWith(isSaving: false);
      return false;
    }
  }
}

final addMedicineProvider = StateNotifierProvider<AddMedicineNotifier, AddMedicineState>((ref) {
  return AddMedicineNotifier(ref.watch(medicineRepositoryProvider));
});
