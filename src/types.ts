export type PillColor =
  | 'Blue'
  | 'White'
  | 'Red'
  | 'Yellow'
  | 'Orange'
  | 'Green'
  | 'Pink'
  | 'Purple'
  | 'Peach'
  | 'Brown';

export type PillShape =
  | 'Round'
  | 'Oval'
  | 'Capsule'
  | 'Rectangle'
  | 'Square'
  | 'Triangle'
  | 'Syrup'
  | 'Drops'
  | 'Injection'
  | 'Other';

export type MedicineType =
  | 'Tablet'
  | 'Capsule'
  | 'Syrup'
  | 'Drops'
  | 'Injection'
  | 'Ointment'
  | 'Inhaler';

export type MealTiming =
  | 'Before Food'
  | 'After Food'
  | 'With Food'
  | 'After Dinner'
  | 'Empty Stomach'
  | 'Bedtime';

export type RecurrenceType =
  | 'Daily'
  | 'Weekly'
  | 'Alternate Days'
  | 'Every 8 Hours'
  | 'Every 12 Hours'
  | 'As Needed (SOS)';

export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  dosage: string; // e.g. "500 mg", "1 Tablet", "10 ml"
  type: MedicineType;
  color: PillColor;
  shape: PillShape;
  category: string; // e.g. "Diabetes", "Blood Pressure", "Supplement"
  mealTiming: MealTiming;
  instructions: string[];
  times: string[]; // e.g. ["08:00 AM", "02:00 PM"]
  frequency: RecurrenceType;
  daysOfWeek?: number[]; // 0=Sun, 1=Mon, etc.
  stockCount: number;
  lowStockThreshold: number;
  expiryDate: string; // YYYY-MM-DD
  isEssential: boolean;
  notes: string;
  photoUrl?: string;
  prescribedBy?: string;
  customVoiceScript?: string;
}

<<<<<<< HEAD
export type DoseStatus = 'pending' | 'due' | 'taken' | 'snoozed' | 'missed' | 'skipped';
=======
export type DoseStatus = 'pending' | 'taken' | 'snoozed' | 'missed' | 'skipped';
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

export interface DoseEvent {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  pillColor: PillColor;
  pillShape: PillShape;
  medicineType: MedicineType;
  mealTiming: MealTiming;
  scheduledTime: string; // "02:00 PM"
  scheduledDate: string; // "2026-08-27"
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  status: DoseStatus;
  actionTimestamp?: string; // ISO string when taken/snoozed/skipped
<<<<<<< HEAD
  actualTakenTime?: string; // e.g. "08:05 AM"
  snoozeUntil?: string; // ISO timestamp for snoozed alarm
=======
  snoozeUntil?: string;
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  spokenScript: string;
  photoUrl?: string;
  notes?: string;
  synced: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  preferredLanguage: string;
  photoUrl: string;
  healthConditions: string[];
  caregiverName: string;
  caregiverPhone: string;
  caregiverRelation: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  phoneNumber?: string;
  isPrimary?: boolean;
  avatarUrl?: string;
}

export interface HealthReading {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // "08:30 AM"
  systolic?: number;
  diastolic?: number;
  bloodSugar?: number;
  sugarType?: 'Fasting' | 'Post-Meal' | 'Random';
  weightKg?: number;
  notes?: string;
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large' | 'extralarge';
  highContrast: boolean;
  darkMode: boolean;
  vibration: boolean;
  flashlightAlerts: boolean;
  buttonSize: 'normal' | 'large' | 'extralarge';
  screenReader: boolean;
  voiceGuidance: boolean;
  language?: string;
  voiceSpeed?: 'slow' | 'normal' | 'fast';
  alarmVolume?: 'soft' | 'normal' | 'loud';
  shakeToSOS?: boolean;
  voiceAlertsEnabled?: boolean;
}

export interface VoiceSettings {
  language: string; // 'en-US' | 'hi-IN' | 'mr-IN' | 'ta-IN' | 'te-IN' | 'gu-IN' | 'bn-IN' | 'kn-IN'
  voiceGender: 'male' | 'female';
  speechSpeed: 'slow' | 'normal' | 'fast';
  reminderVolume: 'low' | 'medium' | 'loud';
  repeatCount: number;
  familyVoiceEnabled: boolean;
  familyAudioDataUrl?: string;
  familySpeakerName?: string;
}

export interface NotificationSettings {
  medicationReminders: boolean;
  refillReminders: boolean;
  missedDoseAlerts: boolean;
  caregiverNotifications: boolean;
  vibration: boolean;
  alarmSound: boolean;
  soundType: 'voice' | 'chime' | 'alarm';
  dndExceptions: boolean;
  notifyCaregiversList: string[];
}

export type AppView =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'profile-setup'
  | 'dashboard'
  | 'medicines'
  | 'add-medicine'
  | 'medicine-details'
  | 'reminder-schedule'
  | 'schedule-reminder'
  | 'timeline'
  | 'history'
  | 'analytics'
  | 'caregiver'
  | 'caregiver-mode'
  | 'emergency'
  | 'emergency-contacts'
  | 'voice-settings'
  | 'accessibility-settings'
  | 'notification-settings'
  | 'prescription-scan'
  | 'prescription-scanner'
  | 'profile-settings'
  | 'medicine-search'
  | 'photo-gallery'
  | 'pill-id'
  | 'offline-mode'
  | 'family-voice'
  | 'health-log'
  | 'doctor-report'
  | 'walkthrough'
  | 'feedback'
  | 'about';
