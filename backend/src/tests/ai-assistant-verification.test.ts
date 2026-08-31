// =============================================================================
// backend/src/tests/ai-assistant-verification.test.ts
// COMPREHENSIVE VERIFICATION OF MEDICARE IN-APP AI CONVERSATIONAL MODEL
// =============================================================================

import { generateMedicareConversationalResponse } from '../../../src/services/medicareAiModel';
import { UserProfile, Medicine, DoseEvent } from '../../../src/types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

const mockUser: UserProfile = {
  id: 'user_ramesh_123',
  name: 'Ramesh Kumar',
  nickname: 'Grandpa Ramesh',
  age: 74,
  phone: '+15551234567',
  emergencyContact: '+15559876543',
  bloodGroup: 'B+',
  doctorName: 'Dr. Ramesh Kumar, MD',
  doctorPhone: '+15558889999',
  preferredLanguage: 'en-US',
  fontSize: 'large',
  volume: 'loud',
  isHighContrast: false,
};

const mockMedicines: Medicine[] = [
  {
    id: 'med_metformin',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    dosage: '500 mg',
    type: 'Tablet',
    color: 'Blue',
    shape: 'Round',
    category: 'Diabetes',
    mealTiming: 'After Food',
    instructions: ['Take after meals with water.'],
    times: ['08:00 AM', '02:00 PM'],
    frequency: 'Daily',
    stockCount: 28,
    lowStockThreshold: 5,
    isEssential: true,
  },
  {
    id: 'med_telmisartan',
    name: 'Telmisartan',
    genericName: 'Telmisartan',
    dosage: '40 mg',
    type: 'Tablet',
    color: 'White',
    shape: 'Oval',
    category: 'Blood Pressure',
    mealTiming: 'After Food',
    instructions: ['Take in the morning.'],
    times: ['08:00 AM'],
    frequency: 'Daily',
    stockCount: 4, // Low stock
    lowStockThreshold: 10,
    isEssential: true,
  },
];

const mockDoses: DoseEvent[] = [
  {
    id: 'dose_1',
    medicineId: 'med_metformin',
    medicineName: 'Metformin',
    dosage: '500 mg',
    scheduledTime: '08:00 AM',
    scheduledDate: new Date().toISOString().split('T')[0],
    status: 'taken',
  },
  {
    id: 'dose_2',
    medicineId: 'med_metformin',
    medicineName: 'Metformin',
    dosage: '500 mg',
    scheduledTime: '02:00 PM',
    scheduledDate: new Date().toISOString().split('T')[0],
    status: 'pending',
  },
  {
    id: 'dose_3',
    medicineId: 'med_telmisartan',
    medicineName: 'Telmisartan',
    dosage: '40 mg',
    scheduledTime: '08:00 AM',
    scheduledDate: new Date().toISOString().split('T')[0],
    status: 'taken',
  },
];

async function runAiAssistantTests() {
  console.log('======================================================================');
  console.log('  TESTING MEDICARE IN-APP AI CONVERSATIONAL MODEL');
  console.log('======================================================================\n');

  let passed = 0;
  let total = 0;

  function runTest(name: string, fn: () => void) {
    total++;
    try {
      fn();
      passed++;
      console.log(`✅ [PASS] ${name}`);
    } catch (e: any) {
      console.error(`❌ [FAIL] ${name}:`, e.message || e);
    }
  }

  // 1. Next Dose query
  runTest('Next Dose query returns pending dose info', () => {
    const res = generateMedicareConversationalResponse('When is my next dose?', mockUser, mockMedicines, mockDoses);
    assert(res.actionIntent === 'next_reminder', 'Action intent should be next_reminder');
    assert(res.spokenReply.includes('02:00 PM') || res.spokenReply.includes('Metformin'), 'Spoken reply must mention 2:00 PM or Metformin');
    assert(res.targetDoseId === 'dose_2', 'Target dose ID should point to dose_2');
  });

  // 2. Mark Dose as Taken
  runTest('Mark dose as taken triggers mark_taken action', () => {
    const res = generateMedicareConversationalResponse('I took my Metformin tablet', mockUser, mockMedicines, mockDoses);
    assert(res.actionIntent === 'mark_taken', 'Action intent should be mark_taken');
    assert(res.targetDoseId === 'dose_2', 'Target dose ID must match pending Metformin dose');
    assert(res.spokenReply.includes('Grandpa Ramesh') || res.spokenReply.includes('taken'), 'Reply must confirm action');
  });

  // 3. Snooze Reminder
  runTest('Snooze query triggers snooze_dose intent', () => {
    const res = generateMedicareConversationalResponse('Snooze my reminder for 10 minutes', mockUser, mockMedicines, mockDoses);
    assert(res.actionIntent === 'snooze_dose', 'Action intent should be snooze_dose');
    assert(res.spokenReply.includes('10 minutes'), 'Spoken reply must confirm 10 minutes snooze');
  });

  // 4. Today Schedule
  runTest('Today schedule returns summary of taken vs pending doses', () => {
    const res = generateMedicareConversationalResponse('What medicines do I have today?', mockUser, mockMedicines, mockDoses);
    assert(res.actionIntent === 'show_today', 'Action intent should be show_today');
    assert(res.spokenReply.includes('3 medicines') || res.spokenReply.includes('remaining'), 'Must calculate total and remaining counts');
  });

  // 5. Drug Knowledge (Metformin)
  runTest('Specific drug inquiry provides pharmacology and food advice', () => {
    const res = generateMedicareConversationalResponse('What is Metformin for?', mockUser, mockMedicines, mockDoses);
    assert(res.spokenReply.toLowerCase().includes('blood glucose') || res.spokenReply.toLowerCase().includes('diabetes'), 'Must state purpose');
    assert(res.spokenReply.toLowerCase().includes('food'), 'Must give food advice');
  });

  // 6. Food Advice query
  runTest('General food query gives elderly meal & medication guidelines', () => {
    const res = generateMedicareConversationalResponse('What should I eat before my tablets?', mockUser, mockMedicines, mockDoses);
    assert(res.displayReply.toLowerCase().includes('after food'), 'Must advise taking diabetes pills after food');
  });

  // 7. Stock Check
  runTest('Stock inquiry identifies low stock medications', () => {
    const res = generateMedicareConversationalResponse('Do I have enough medicine stock?', mockUser, mockMedicines, mockDoses);
    assert(res.displayReply.includes('Telmisartan'), 'Must identify Telmisartan with low stock');
    assert(res.spokenReply.includes('running low') || res.spokenReply.includes('refill'), 'Must advise refill');
  });

  // 8. Emergency SOS trigger
  runTest('Emergency words trigger open_sos immediately', () => {
    const res = generateMedicareConversationalResponse('Help, I fell down and need SOS!', mockUser, mockMedicines, mockDoses);
    assert(res.actionIntent === 'open_sos', 'Action intent must be open_sos');
    assert(res.confidence >= 98, 'Must have high confidence');
  });

  // 9. Caregiver Call
  runTest('Call caregiver intent triggers call_caregiver', () => {
    const res = generateMedicareConversationalResponse('Call my daughter', mockUser, mockMedicines, mockDoses);
    assert(res.actionIntent === 'call_caregiver', 'Action intent must be call_caregiver');
  });

  // 10. Add Medicine
  runTest('Add medicine command navigates to add_medicine screen', () => {
    const res = generateMedicareConversationalResponse('Add a new tablet from doctor', mockUser, mockMedicines, mockDoses);
    assert(res.actionIntent === 'add_medicine', 'Action intent must be add_medicine');
  });

  // 11. Prescription Scanner
  runTest('Scan prescription command triggers open_scanner', () => {
    const res = generateMedicareConversationalResponse('Scan my prescription slip with camera', mockUser, mockMedicines, mockDoses);
    assert(res.actionIntent === 'open_scanner', 'Action intent must be open_scanner');
  });

  // 12. Casual Greeting
  runTest('Friendly greeting responds politely with user name', () => {
    const res = generateMedicareConversationalResponse('Good morning Medicare assistant!', mockUser, mockMedicines, mockDoses);
    assert(res.spokenReply.includes('Grandpa Ramesh'), 'Spoken reply must greet user warmly');
  });

  console.log(`\n======================================================================`);
  console.log(`  AI CONVERSATIONAL MODEL TEST SUMMARY`);
  console.log(`  Total: ${total}, Passed: ${passed}, Failed: ${total - passed}`);
  console.log(`======================================================================\n`);

  if (total !== passed) {
    process.exit(1);
  }
}

runAiAssistantTests();
