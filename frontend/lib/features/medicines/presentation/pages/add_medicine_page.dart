// =============================================================================
// frontend/lib/features/medicines/presentation/pages/add_medicine_page.dart
// Multi-step senior-friendly form for adding medicines
// =============================================================================

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../app/theme/app_colors.dart';
import '../../../../domain/enums/medicine_type.dart';
import '../../../../domain/enums/meal_timing.dart';
import '../../../../domain/enums/recurrence_type.dart';
import '../providers/add_medicine_provider.dart';

class AddMedicinePage extends ConsumerStatefulWidget {
  final String? medicineId;

  const AddMedicinePage({super.key, this.medicineId});

  @override
  ConsumerState<AddMedicinePage> createState() => _AddMedicinePageState();
}

class _AddMedicinePageState extends ConsumerState<AddMedicinePage> {
  final _nameController = TextEditingController();
  final _dosageController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _dosageController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final image = await picker.pickImage(source: ImageSource.camera);
    if (image != null) {
      ref.read(addMedicineProvider.notifier).updatePhoto(image.path);
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(addMedicineProvider);
    final notifier = ref.read(addMedicineProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.medicineId == null ? 'Add Medicine' : 'Edit Medicine'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.pop(),
        ),
      ),
      body: Stepper(
        type: StepperType.vertical,
        currentStep: state.currentStep,
        onStepContinue: () async {
          if (state.currentStep < 3) {
            if (state.currentStep == 0 && (_nameController.text.isEmpty || _dosageController.text.isEmpty)) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Please enter name and dosage')),
              );
              return;
            }
            notifier.setStep(state.currentStep + 1);
          } else {
            final success = await notifier.saveMedicine();
            if (success && mounted) {
              context.pop(); // Go back to dashboard/list
            }
          }
        },
        onStepCancel: () {
          if (state.currentStep > 0) {
            notifier.setStep(state.currentStep - 1);
          } else {
            context.pop();
          }
        },
        controlsBuilder: (context, details) {
          final isLastStep = state.currentStep == 3;
          return Padding(
            padding: const EdgeInsets.only(top: 32),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: state.isSaving ? null : details.onStepContinue,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: state.isSaving
                        ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : Text(
                            isLastStep ? 'Save Medicine' : 'Next',
                            style: const TextStyle(fontSize: 18, color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                  ),
                ),
                if (state.currentStep > 0) ...[
                  const SizedBox(width: 16),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: state.isSaving ? null : details.onStepCancel,
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Back', style: TextStyle(fontSize: 18)),
                    ),
                  ),
                ],
              ],
            ),
          );
        },
        steps: [
          Step(
            title: const Text('What is the medicine?', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            content: Column(
              children: [
                const SizedBox(height: 16),
                TextField(
                  controller: _nameController,
                  onChanged: notifier.updateName,
                  style: const TextStyle(fontSize: 22),
                  decoration: InputDecoration(
                    labelText: 'Medicine Name (e.g. Paracetamol)',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    prefixIcon: const Icon(Icons.medication),
                  ),
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: _dosageController,
                  onChanged: notifier.updateDosage,
                  style: const TextStyle(fontSize: 22),
                  decoration: InputDecoration(
                    labelText: 'Dosage (e.g. 500mg, 1 tablet)',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    prefixIcon: const Icon(Icons.scale),
                  ),
                ),
                const SizedBox(height: 24),
                // Pill Photo
                GestureDetector(
                  onTap: _pickImage,
                  child: Container(
                    height: 120,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: AppColors.primaryLight.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.primaryLight, width: 2),
                    ),
                    child: state.photoPath != null
                        ? ClipRRect(
                            borderRadius: BorderRadius.circular(14),
                            child: Image.file(File(state.photoPath!), fit: BoxFit.cover),
                          )
                        : Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              Icon(Icons.camera_alt, size: 40, color: AppColors.primary),
                              SizedBox(height: 8),
                              Text('Tap to take a photo of the pill', style: TextStyle(fontSize: 16, color: AppColors.primary)),
                            ],
                          ),
                  ),
                ),
              ],
            ),
            isActive: state.currentStep >= 0,
            state: state.currentStep > 0 ? StepState.complete : StepState.indexed,
          ),
          Step(
            title: const Text('Type & Instructions', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            content: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Medicine Type:', style: TextStyle(fontSize: 16, color: AppColors.textSecondary)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: MedicineType.values.map((type) {
                    final isSelected = state.type == type;
                    return ChoiceChip(
                      label: Text(type.displayName, style: TextStyle(fontSize: 16, color: isSelected ? Colors.white : AppColors.textPrimary)),
                      selected: isSelected,
                      selectedColor: AppColors.primary,
                      onSelected: (selected) {
                        if (selected) notifier.updateType(type);
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: 24),
                const Text('When to take (Meal Timing):', style: TextStyle(fontSize: 16, color: AppColors.textSecondary)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: MealTiming.values.map((timing) {
                    final isSelected = state.mealTiming == timing;
                    return ChoiceChip(
                      label: Text(timing.displayName, style: TextStyle(fontSize: 16, color: isSelected ? Colors.white : AppColors.textPrimary)),
                      selected: isSelected,
                      selectedColor: AppColors.primary,
                      onSelected: (selected) {
                        if (selected) notifier.updateMealTiming(timing);
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
            isActive: state.currentStep >= 1,
            state: state.currentStep > 1 ? StepState.complete : StepState.indexed,
          ),
          Step(
            title: const Text('Schedule', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            content: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('How often?', style: TextStyle(fontSize: 16, color: AppColors.textSecondary)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: RecurrenceType.values.map((recurrence) {
                    final isSelected = state.recurrence == recurrence;
                    return ChoiceChip(
                      label: Text(recurrence.displayName, style: TextStyle(fontSize: 16, color: isSelected ? Colors.white : AppColors.textPrimary)),
                      selected: isSelected,
                      selectedColor: AppColors.primary,
                      onSelected: (selected) {
                        if (selected) notifier.updateRecurrence(recurrence);
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: 24),
                const Text('Reminder Times:', style: TextStyle(fontSize: 16, color: AppColors.textSecondary)),
                const SizedBox(height: 8),
                // Simplified for MVP: Just hardcoded times, normally we'd use a TimePicker
                Row(
                  children: [
                    _timeChip('08:00', state, notifier),
                    const SizedBox(width: 8),
                    _timeChip('14:00', state, notifier),
                    const SizedBox(width: 8),
                    _timeChip('20:00', state, notifier),
                  ],
                ),
              ],
            ),
            isActive: state.currentStep >= 2,
            state: state.currentStep > 2 ? StepState.complete : StepState.indexed,
          ),
          Step(
            title: const Text('Review', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            content: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _reviewRow('Name', state.name),
                  _reviewRow('Dosage', state.dosage),
                  _reviewRow('Type', state.type.displayName),
                  _reviewRow('Timing', state.mealTiming.instruction),
                  _reviewRow('Recurrence', state.recurrence.displayName),
                  _reviewRow('Reminders', state.times.join(', ')),
                ],
              ),
            ),
            isActive: state.currentStep >= 3,
          ),
        ],
      ),
    );
  }

  Widget _timeChip(String time, AddMedicineState state, AddMedicineNotifier notifier) {
    final isSelected = state.times.contains(time);
    return ChoiceChip(
      label: Text(time, style: TextStyle(fontSize: 16, color: isSelected ? Colors.white : AppColors.textPrimary)),
      selected: isSelected,
      selectedColor: AppColors.primary,
      onSelected: (selected) {
        final newTimes = List<String>.from(state.times);
        if (selected) {
          newTimes.add(time);
        } else {
          newTimes.remove(time);
        }
        notifier.updateTimes(newTimes..sort());
      },
    );
  }

  Widget _reviewRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(label, style: const TextStyle(fontSize: 16, color: AppColors.textSecondary)),
          ),
          Expanded(
            child: Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
