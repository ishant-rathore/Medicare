import {
  Medicine,
  DoseEvent,
  UserProfile,
  EmergencyContact,
  HealthReading,
  AccessibilitySettings,
  VoiceSettings,
  NotificationSettings,
} from '../types';
<<<<<<< HEAD
import { syncEngine } from '../services/syncEngine';
=======
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

const STORAGE_KEYS = {
  USER_PROFILE: 'medicare_user_profile',
  MEDICINES: 'medicare_medicines',
  DOSES: 'medicare_doses',
  EMERGENCY_CONTACTS: 'medicare_emergency_contacts',
  HEALTH_READINGS: 'medicare_health_readings',
  ACCESSIBILITY: 'medicare_accessibility_settings',
  VOICE: 'medicare_voice_settings',
  NOTIFICATIONS: 'medicare_notifications_settings',
  IS_LOGGED_IN: 'medicare_is_logged_in',
  HAS_COMPLETED_ONBOARDING: 'medicare_completed_onboarding',
  OFFLINE_PENDING_QUEUE: 'medicare_offline_pending_queue',
};

// Initial Seed Data for Demo & Testing
export const DEFAULT_USER: UserProfile = {
  id: 'usr_ramesh_01',
  name: 'Ramesh Kumar',
  nickname: 'Grandpa',
  age: 72,
  gender: 'Male',
  bloodGroup: 'O+',
  phone: '+91 98765 43210',
  email: 'ramesh.kumar@email.com',
  address: 'Pune, Maharashtra, India',
  preferredLanguage: 'en-US',
  photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
  healthConditions: ['Hypertension', 'Diabetes'],
  caregiverName: 'Anita Sharma',
  caregiverPhone: '+91 98765 43211',
  caregiverRelation: 'Daughter',
};

export const DEFAULT_MEDICINES: Medicine[] = [
  {
    id: 'med_01',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    dosage: '500 mg',
    type: 'Tablet',
    color: 'Blue',
    shape: 'Round',
    category: 'Diabetes Tablet',
    mealTiming: 'After Food',
    instructions: [
      'Take 1 tablet after food.',
      'Drink a full glass of water.',
      'Take regularly at the same time every day.',
      'Do not skip the dose.',
    ],
    times: ['08:00 AM', '02:00 PM', '08:00 PM', '10:00 PM'],
    frequency: 'Daily',
    stockCount: 12,
    lowStockThreshold: 15,
    expiryDate: '2027-01-30',
    isEssential: true,
    notes: 'Prescribed by Dr. Mehta for blood sugar regulation.',
    prescribedBy: 'Dr. R. Mehta (Cardiologist)',
  },
  {
    id: 'med_02',
    name: 'Amlodipine',
    genericName: 'Amlodipine Besylate',
    dosage: '5 mg',
    type: 'Tablet',
    color: 'White',
    shape: 'Oval',
    category: 'Blood Pressure Tablet',
    mealTiming: 'After Food',
    instructions: [
      'Take 1 tablet after morning breakfast.',
      'Do not take with grapefruit juice.',
      'Monitor blood pressure weekly.',
    ],
    times: ['08:00 AM'],
    frequency: 'Daily',
    stockCount: 8,
    lowStockThreshold: 10,
    expiryDate: '2026-11-15',
    isEssential: true,
    notes: 'Controls high blood pressure.',
    prescribedBy: 'Dr. R. Mehta (Cardiologist)',
  },
  {
    id: 'med_03',
    name: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    dosage: '60000 IU',
    type: 'Capsule',
    color: 'Red',
    shape: 'Capsule',
    category: 'Supplement Capsule',
    mealTiming: 'After Dinner',
    instructions: [
      'Take 1 capsule after dinner with warm milk or water.',
      'Helps maintain strong bones and immune system.',
    ],
    times: ['08:00 PM'],
    frequency: 'Daily',
    stockCount: 18,
    lowStockThreshold: 5,
    expiryDate: '2027-05-20',
    isEssential: false,
    notes: 'Bone strength supplement.',
    prescribedBy: 'Dr. R. Mehta',
  },
  {
    id: 'med_04',
    name: 'Calcium + D3',
    genericName: 'Calcium Carbonate',
    dosage: '500 mg',
    type: 'Tablet',
    color: 'Yellow',
    shape: 'Round',
    category: 'Calcium Supplement',
    mealTiming: 'After Food',
    instructions: [
      'Take 1 tablet at night before sleeping.',
      'Drink plenty of fluids throughout the day.',
    ],
    times: ['10:00 PM'],
    frequency: 'Daily',
    stockCount: 22,
    lowStockThreshold: 10,
    expiryDate: '2026-12-01',
    isEssential: false,
    notes: 'Calcium support for joint health.',
  },
  {
    id: 'med_05',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    dosage: '10 mg',
    type: 'Tablet',
    color: 'Peach',
    shape: 'Oval',
    category: 'Cholesterol Tablet',
    mealTiming: 'After Dinner',
    instructions: ['Take 1 tablet every evening.', 'Avoid excessive fatty meals.'],
    times: ['09:00 PM'],
    frequency: 'Daily',
    stockCount: 28,
    lowStockThreshold: 10,
    expiryDate: '2027-08-10',
    isEssential: true,
    notes: 'Lowers bad cholesterol.',
  },
  {
    id: 'med_06',
    name: 'Cetirizine / Cough Syrup',
    genericName: 'Cetirizine Syrup',
    dosage: '10 ml',
    type: 'Syrup',
    color: 'Brown',
    shape: 'Syrup',
    category: 'Allergy / Cough',
    mealTiming: 'After Food',
    instructions: ['Take 10ml measuring cup after food.', 'Shake bottle well before use.'],
    times: ['07:00 AM'],
    frequency: 'As Needed (SOS)',
    stockCount: 2,
    lowStockThreshold: 1,
    expiryDate: '2026-09-30',
    isEssential: false,
    notes: 'Use when coughing occurs.',
  },
];

export function generateInitialDoses(): DoseEvent[] {
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'dose_01',
      medicineId: 'med_02',
      medicineName: 'Amlodipine 5mg',
      dosage: '1 Tablet',
      pillColor: 'White',
      pillShape: 'Oval',
      medicineType: 'Tablet',
      mealTiming: 'After Food',
      scheduledTime: '08:00 AM',
      scheduledDate: today,
      period: 'Morning',
      status: 'taken',
      actionTimestamp: `${today}T08:05:00.000Z`,
      spokenScript: 'Grandpa, it is 8 AM. Please take your white blood pressure tablet.',
      synced: true,
    },
    {
      id: 'dose_02',
      medicineId: 'med_01',
      medicineName: 'Metformin 500mg',
      dosage: '1 Tablet',
      pillColor: 'Blue',
      pillShape: 'Round',
      medicineType: 'Tablet',
      mealTiming: 'After Food',
      scheduledTime: '02:00 PM',
      scheduledDate: today,
      period: 'Afternoon',
      status: 'pending',
      spokenScript: "Grandpa, it's 2 PM. Please take your blue diabetes tablet.",
      synced: true,
    },
    {
      id: 'dose_03',
      medicineId: 'med_03',
      medicineName: 'Vitamin D3',
      dosage: '1 Capsule',
      pillColor: 'Red',
      pillShape: 'Capsule',
      medicineType: 'Capsule',
      mealTiming: 'After Dinner',
      scheduledTime: '08:00 PM',
      scheduledDate: today,
      period: 'Evening',
      status: 'pending',
      spokenScript: "Grandpa, it's 8 PM. Please take your red Vitamin D3 capsule.",
      synced: true,
    },
    {
      id: 'dose_04',
      medicineId: 'med_04',
      medicineName: 'Calcium 500mg',
      dosage: '1 Tablet',
      pillColor: 'Yellow',
      pillShape: 'Round',
      medicineType: 'Tablet',
      mealTiming: 'After Food',
      scheduledTime: '10:00 PM',
      scheduledDate: today,
      period: 'Night',
      status: 'pending',
      spokenScript: "Grandpa, it's 10 PM. Please take your yellow calcium tablet.",
      synced: true,
    },
  ];
}

export const DEFAULT_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'emg_01',
    name: 'Amit Sharma',
    relation: 'Son',
    phone: '+91 98765 43210',
    isPrimary: true,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'emg_02',
    name: 'Neha Sharma',
    relation: 'Daughter',
    phone: '+91 91234 56789',
    isPrimary: false,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'emg_03',
    name: 'Dr. R. Mehta',
    relation: 'Family Doctor',
    phone: '+91 99876 54321',
    isPrimary: false,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'emg_04',
    name: 'Pooja Verma',
    relation: 'Neighbor',
    phone: '+91 90123 45678',
    isPrimary: false,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
];

export const DEFAULT_HEALTH_READINGS: HealthReading[] = [
  {
    id: 'hr_01',
    date: '2026-08-27',
    time: '08:15 AM',
    systolic: 120,
    diastolic: 80,
    bloodSugar: 98,
    sugarType: 'Fasting',
    weightKg: 72.5,
    notes: 'Morning vitals recorded after breakfast.',
  },
  {
    id: 'hr_02',
    date: '2026-08-26',
    time: '08:30 AM',
    systolic: 122,
    diastolic: 80,
    bloodSugar: 104,
    sugarType: 'Fasting',
    weightKg: 72.4,
  },
  {
    id: 'hr_03',
    date: '2026-08-25',
    time: '08:20 AM',
    systolic: 119,
    diastolic: 79,
    bloodSugar: 96,
    sugarType: 'Fasting',
    weightKg: 72.5,
  },
  {
    id: 'hr_04',
    date: '2026-08-24',
    time: '08:45 AM',
    systolic: 124,
    diastolic: 82,
    bloodSugar: 112,
    sugarType: 'Fasting',
    weightKg: 72.6,
  },
];

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  fontSize: 'large',
  highContrast: true,
  darkMode: false,
  vibration: true,
  flashlightAlerts: true,
  buttonSize: 'large',
  screenReader: true,
  voiceGuidance: true,
};

export const DEFAULT_VOICE: VoiceSettings = {
  language: 'en-US',
  voiceGender: 'female',
  speechSpeed: 'normal',
  reminderVolume: 'loud',
  repeatCount: 2,
  familyVoiceEnabled: true,
  familySpeakerName: 'Anita (Daughter)',
};

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  medicationReminders: true,
  refillReminders: true,
  missedDoseAlerts: true,
  caregiverNotifications: true,
  vibration: true,
  alarmSound: true,
  soundType: 'voice',
  dndExceptions: true,
  notifyCaregiversList: ['Anita Sharma (+91 98765 43211)'],
};

<<<<<<< HEAD
export function getPeriodForTime(timeStr: string): 'Morning' | 'Afternoon' | 'Evening' | 'Night' {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 'Morning';
  let hour = parseInt(match[1], 10);
  const isPM = match[3]?.toUpperCase() === 'PM';
  const isAM = match[3]?.toUpperCase() === 'AM';
  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
}

export function generateSpokenScriptForDose(
  user: UserProfile,
  med: Medicine,
  timeStr: string
): string {
  const nick = user.nickname || user.name.split(' ')[0] || 'Grandpa';
  const colorStr = med.color ? med.color.toLowerCase() : '';
  const mealStr = med.mealTiming ? med.mealTiming.toLowerCase() : 'with water';
  return `${nick}, it is ${timeStr}. Please take your ${colorStr} ${med.name}, ${med.dosage}, ${mealStr}.`;
}

=======
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
// Storage helper functions
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export function getUserProfile(): UserProfile {
  return loadFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER);
}

export function saveUserProfile(user: UserProfile): void {
  saveToStorage(STORAGE_KEYS.USER_PROFILE, user);
}

export function getMedicines(): Medicine[] {
  return loadFromStorage<Medicine[]>(STORAGE_KEYS.MEDICINES, DEFAULT_MEDICINES);
}

export function saveMedicines(meds: Medicine[]): void {
  saveToStorage(STORAGE_KEYS.MEDICINES, meds);
<<<<<<< HEAD
  try {
    for (const med of meds) {
      syncEngine.enqueue('medicine', 'CREATE', {
        id: med.id,
        name: med.name,
        genericName: med.genericName,
        dosage: med.dosage,
        type: med.type?.toUpperCase() || 'TABLET',
        color: med.color,
        shape: med.shape,
        category: med.category,
        mealTiming: med.mealTiming?.toUpperCase().replace(/\s+/g, '_') || 'AFTER_FOOD',
        instructions: med.instructions || [],
        stockCount: med.stockCount || 30,
        lowStockThreshold: med.lowStockThreshold || 5,
        expiryDate: med.expiryDate,
        isEssential: Boolean(med.isEssential),
        notes: med.notes,
        prescribedBy: med.prescribedBy,
      });
    }
  } catch {
    // Local operation continues uninterrupted
  }
}

export function getAllDoses(): DoseEvent[] {
  return loadFromStorage<DoseEvent[]>(STORAGE_KEYS.DOSES, generateInitialDoses());
}

export function saveAllDoses(doses: DoseEvent[]): void {
  saveToStorage(STORAGE_KEYS.DOSES, doses);
}

export function getTodayDoses(): DoseEvent[] {
  const today = new Date().toISOString().split('T')[0];
  const allDoses = getAllDoses();
  return allDoses.filter((d) => d.scheduledDate === today);
}

export function saveTodayDoses(todayDoses: DoseEvent[]): void {
  const today = new Date().toISOString().split('T')[0];
  const allDoses = getAllDoses();
  const otherDoses = allDoses.filter((d) => d.scheduledDate !== today);
  saveAllDoses([...todayDoses, ...otherDoses]);
}

/**
 * Synchronize daily dose events for today with existing active medicines.
 * Preserves already taken / snoozed / skipped doses without duplicating.
 */
export function syncDosesWithMedicines(
  medicines: Medicine[],
  user: UserProfile,
  targetDate?: string
): DoseEvent[] {
  const dateStr = targetDate || new Date().toISOString().split('T')[0];
  const allDoses = getAllDoses();
  const existingForDate = allDoses.filter((d) => d.scheduledDate === dateStr);
  const otherDatesDoses = allDoses.filter((d) => d.scheduledDate !== dateStr);

  const synchronizedDoses: DoseEvent[] = [];

  for (const med of medicines) {
    const times = med.times && med.times.length > 0 ? med.times : ['08:00 AM'];
    times.forEach((t, i) => {
      // Look for existing dose record by id or medicineId + scheduledTime + date
      const existing = existingForDate.find(
        (d) =>
          d.id === `dose_${med.id}_${dateStr}_${i}` ||
          (d.medicineId === med.id && d.scheduledTime === t)
      );

      if (existing) {
        // Keep existing status (taken / snoozed / skipped / missed), update medicine info if changed
        synchronizedDoses.push({
          ...existing,
          medicineName: med.name,
          dosage: med.dosage,
          pillColor: med.color,
          pillShape: med.shape,
          medicineType: med.type,
          mealTiming: med.mealTiming,
          scheduledTime: t,
          period: getPeriodForTime(t),
          spokenScript: generateSpokenScriptForDose(user, med, t),
        });
      } else {
        // Create new pending dose
        synchronizedDoses.push({
          id: `dose_${med.id}_${dateStr}_${i}_${Date.now()}`,
          medicineId: med.id,
          medicineName: med.name,
          dosage: med.dosage,
          pillColor: med.color,
          pillShape: med.shape,
          medicineType: med.type,
          mealTiming: med.mealTiming,
          scheduledTime: t,
          scheduledDate: dateStr,
          period: getPeriodForTime(t),
          status: 'pending',
          spokenScript: generateSpokenScriptForDose(user, med, t),
          synced: true,
        });
      }
    });
  }

  // Also preserve non-pending historical records for deleted medicines for today
  existingForDate.forEach((d) => {
    if (
      d.status !== 'pending' &&
      !synchronizedDoses.some((sd) => sd.id === d.id)
    ) {
      synchronizedDoses.push(d);
    }
  });

  const updatedAll = [...synchronizedDoses, ...otherDatesDoses];
  saveAllDoses(updatedAll);
  return synchronizedDoses;
}

/**
 * Record a deterministic dose action (Taken, Snoozed, Skipped, Missed).
 * Automatically updates timestamps and stock counts.
 */
export function recordDoseAction(
  doseId: string,
  action: 'taken' | 'snoozed' | 'skipped' | 'missed' | 'pending',
  options: { snoozeMinutes?: number; actualTime?: string } = {}
): { doses: DoseEvent[]; updatedDose?: DoseEvent } {
  const allDoses = getAllDoses();
  const now = new Date();
  let updatedDose: DoseEvent | undefined;

  const newDoses = allDoses.map((d) => {
    if (d.id === doseId) {
      const nowIso = now.toISOString();
      const timeStr =
        options.actualTime ||
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (action === 'taken') {
        updatedDose = {
          ...d,
          status: 'taken',
          actionTimestamp: nowIso,
          actualTakenTime: timeStr,
          snoozeUntil: undefined,
        };
      } else if (action === 'snoozed') {
        const mins = options.snoozeMinutes || 10;
        const snoozeDate = new Date(now.getTime() + mins * 60 * 1000);
        updatedDose = {
          ...d,
          status: 'snoozed',
          actionTimestamp: nowIso,
          snoozeUntil: snoozeDate.toISOString(),
        };
      } else if (action === 'skipped') {
        updatedDose = {
          ...d,
          status: 'skipped',
          actionTimestamp: nowIso,
          snoozeUntil: undefined,
        };
      } else if (action === 'missed') {
        updatedDose = {
          ...d,
          status: 'missed',
          actionTimestamp: nowIso,
          snoozeUntil: undefined,
        };
      } else {
        // Pending
        updatedDose = {
          ...d,
          status: 'pending',
          actionTimestamp: undefined,
          actualTakenTime: undefined,
          snoozeUntil: undefined,
        };
      }
      return updatedDose;
    }
    return d;
  });

  saveAllDoses(newDoses);

  // Queue mutation for offline/online idempotent sync
  if (updatedDose) {
    try {
      syncEngine.enqueue('dose_event', 'UPDATE', {
        localEventId: updatedDose.id,
        medicineId: updatedDose.medicineId,
        medicineName: updatedDose.medicineName,
        dosage: updatedDose.dosage,
        mealTiming: updatedDose.mealTiming,
        scheduledTime: updatedDose.scheduledTime,
        scheduledDate: updatedDose.scheduledDate,
        status: updatedDose.status.toUpperCase(),
        actionAt: updatedDose.actionTimestamp,
        snoozeUntil: updatedDose.snoozeUntil,
        notes: updatedDose.notes,
      });
    } catch {
      // Local execution continues uninterrupted
    }
  }

  // If taken, decrement stock count for the medicine
  if (action === 'taken' && updatedDose) {
    const meds = getMedicines();
    const targetMedId = updatedDose.medicineId;
    const updatedMeds = meds.map((m) => {
      if (m.id === targetMedId) {
        return {
          ...m,
          stockCount: Math.max(0, m.stockCount - 1),
        };
      }
      return m;
    });
    saveMedicines(updatedMeds);
  }

  return { doses: newDoses, updatedDose };
}

/**
 * Retrieve dose history filtered by timeframe (Today, Week, Month, All).
 */
export function getDoseHistory(range: 'Today' | 'Week' | 'Month' | 'All' = 'Today'): DoseEvent[] {
  const allDoses = getAllDoses();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  if (range === 'Today') {
    return allDoses.filter((d) => d.scheduledDate === todayStr);
  }

  const daysToSubtract = range === 'Week' ? 7 : range === 'Month' ? 30 : 365;
  const cutoffDate = new Date(today.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  return allDoses
    .filter((d) => d.scheduledDate >= cutoffStr)
    .sort((a, b) => {
      // Sort by scheduledDate desc, then scheduledTime desc
      if (a.scheduledDate !== b.scheduledDate) {
        return b.scheduledDate.localeCompare(a.scheduledDate);
      }
      return b.scheduledTime.localeCompare(a.scheduledTime);
    });
=======
}

export function getTodayDoses(): DoseEvent[] {
  return loadFromStorage<DoseEvent[]>(STORAGE_KEYS.DOSES, generateInitialDoses());
}

export function saveTodayDoses(doses: DoseEvent[]): void {
  saveToStorage(STORAGE_KEYS.DOSES, doses);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
}

export function getEmergencyContacts(): EmergencyContact[] {
  return loadFromStorage<EmergencyContact[]>(STORAGE_KEYS.EMERGENCY_CONTACTS, DEFAULT_EMERGENCY_CONTACTS);
}

export function saveEmergencyContacts(contacts: EmergencyContact[]): void {
  saveToStorage(STORAGE_KEYS.EMERGENCY_CONTACTS, contacts);
}

export function getAccessibilitySettings(): AccessibilitySettings {
  return loadFromStorage<AccessibilitySettings>(STORAGE_KEYS.ACCESSIBILITY, DEFAULT_ACCESSIBILITY);
}

export function saveAccessibilitySettings(settings: AccessibilitySettings): void {
  saveToStorage(STORAGE_KEYS.ACCESSIBILITY, settings);
}

export function resetToInitialSeedData(): void {
  saveUserProfile(DEFAULT_USER);
  saveMedicines(DEFAULT_MEDICINES);
<<<<<<< HEAD
  saveAllDoses(generateInitialDoses());
=======
  saveTodayDoses(generateInitialDoses());
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  saveEmergencyContacts(DEFAULT_EMERGENCY_CONTACTS);
  saveAccessibilitySettings(DEFAULT_ACCESSIBILITY);
}

