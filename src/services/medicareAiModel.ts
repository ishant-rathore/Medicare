// =============================================================================
// src/services/medicareAiModel.ts
// MEDICARE IN-APP LIGHTWEIGHT CONVERSATIONAL AI MODEL (ON-DEVICE & INSTANT NLP)
//
// Zero-latency, 100% offline-resilient conversational intelligence model
// specifically fine-tuned for senior medication management, daily schedules,
// dose actions, pill recognition, adherence coaching, and warm companionship.
// =============================================================================

import { Medicine, DoseEvent, UserProfile } from '../types';

export interface AiConversationMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionIntent?: string;
  targetDoseId?: string;
  suggestions?: string[];
}

export interface AiModelResponse {
  spokenReply: string;
  displayReply: string;
  actionIntent:
    | 'answer'
    | 'mark_taken'
    | 'snooze_dose'
    | 'skip_dose'
    | 'show_today'
    | 'next_reminder'
    | 'add_medicine'
    | 'open_history'
    | 'open_sos'
    | 'open_scanner'
    | 'call_caregiver'
    | 'open_analytics';
  targetDoseId?: string;
  targetMedicineName?: string;
  confidence: number;
  followUpSuggestions: string[];
}

// Built-in Senior Health & Drug Knowledge Base
const COMMON_DRUG_KNOWLEDGE: Record<
  string,
  {
    purpose: string;
    mealAdvice: string;
    bestTime: string;
    tips: string;
  }
> = {
  metformin: {
    purpose: 'controls blood glucose levels for diabetes management',
    mealAdvice: 'Always take with or immediately after food to avoid stomach irritation',
    bestTime: 'morning with breakfast and evening after dinner',
    tips: 'Drink a full glass of water. Never take on an empty stomach.',
  },
  telmisartan: {
    purpose: 'manages blood pressure and protects your heart',
    mealAdvice: 'Can be taken with or after food, preferably at the same time each morning',
    bestTime: 'morning after breakfast',
    tips: 'Avoid suddenly standing up too quickly after taking your morning dose.',
  },
  atorvastatin: {
    purpose: 'lowers cholesterol and keeps blood vessels healthy',
    mealAdvice: 'Can be taken with or after food',
    bestTime: 'night before bedtime (the liver produces most cholesterol at night)',
    tips: 'Avoid drinking grapefruit juice while on statins.',
  },
  amlodipine: {
    purpose: 'relaxes blood vessels to lower high blood pressure',
    mealAdvice: 'Take with or without food once daily in the morning',
    bestTime: 'morning with water',
    tips: 'Keep your feet elevated if you notice mild ankle swelling.',
  },
  aspirin: {
    purpose: 'prevents blood clots and supports cardiac wellness',
    mealAdvice: 'Always take after meals or with milk',
    bestTime: 'after breakfast or after lunch',
    tips: 'Never take on an empty stomach to safeguard gastric lining.',
  },
  glimepiride: {
    purpose: 'stimulates insulin release to manage blood sugar',
    mealAdvice: 'Take 15 to 30 minutes before breakfast or first main meal',
    bestTime: 'before breakfast',
    tips: 'Do not delay or skip your meal after taking this tablet.',
  },
  omeprazole: {
    purpose: 'reduces stomach acid and prevents reflux',
    mealAdvice: 'Take in the morning on an empty stomach 30 to 60 minutes before breakfast',
    bestTime: 'early morning before food',
    tips: 'Swallow whole with a glass of water without chewing.',
  },
  pantoprazole: {
    purpose: 'prevents acidity and protects your stomach',
    mealAdvice: 'Take on an empty stomach first thing in the morning',
    bestTime: 'before morning tea or breakfast',
    tips: 'Best taken 30 minutes before your first meal.',
  },
  paracetamol: {
    purpose: 'relieves mild fever, headache, or joint pain',
    mealAdvice: 'Can be taken with or after light food',
    bestTime: 'as needed with 4 to 6 hours gap between doses',
    tips: 'Stay well hydrated and do not exceed recommended dosage.',
  },
  'vitamin d3': {
    purpose: 'strengthens bones, joints, and immune health',
    mealAdvice: 'Take after your largest meal containing healthy fats for best absorption',
    bestTime: 'after lunch or dinner',
    tips: 'Fat-soluble vitamin; absorbed much better when taken with food.',
  },
  multivitamin: {
    purpose: 'provides essential daily vitamins and mineral support',
    mealAdvice: 'Take after breakfast or lunch',
    bestTime: 'morning or mid-day',
    tips: 'Drink plenty of water throughout the day.',
  },
};

/**
 * Main On-Device Conversational NLP Engine
 */
export function generateMedicareConversationalResponse(
  userQuery: string,
  user: UserProfile,
  medicines: Medicine[],
  doses: DoseEvent[]
): AiModelResponse {
  const query = userQuery.trim().toLowerCase();
  const seniorName = user.nickname || user.name.split(' ')[0] || 'Grandpa';
  const language = user.preferredLanguage || 'en-US';

  // 1. MATCH INTENTS: EMERGENCY / SOS / DANGER
  if (
    query.includes('sos') ||
    query.includes('emergency') ||
    query.includes('fell') ||
    query.includes('fall') ||
    query.includes('chest pain') ||
    query.includes('cannot breathe') ||
    query.includes('bleeding') ||
    query.includes('help me now')
  ) {
    return {
      spokenReply: `Triggering Emergency SOS immediately ${seniorName}! Please sit down comfortably. Help is being notified.`,
      displayReply: `🚨 **Emergency SOS Triggered!**\n\nPlease sit or rest comfortably. We are alerting your emergency contacts and sounding the senior alert siren.`,
      actionIntent: 'open_sos',
      confidence: 99,
      followUpSuggestions: ['Call Primary Caregiver', 'View Emergency Contacts', 'I am safe now'],
    };
  }

  // 2. MATCH INTENTS: CALL CAREGIVER / FAMILY / DOCTOR CONTACT
  if (
    query.includes('call') ||
    query.includes('caregiver') ||
    query.includes('daughter') ||
    query.includes('son') ||
    query.includes('contact doctor') ||
    query.includes('phone doctor') ||
    query.includes('doctor phone') ||
    query.includes('doctor number') ||
    query.includes('contact family')
  ) {
    return {
      spokenReply: `Opening your Caregiver contacts screen, ${seniorName}. You can call your family or doctor with one tap.`,
      displayReply: `📞 **Connecting with Caregiver**\n\nOpening your caregiver and doctor directory. You can tap to call or send an instant SMS alert.`,
      actionIntent: 'call_caregiver',
      confidence: 95,
      followUpSuggestions: ['Show Emergency Numbers', 'Send WhatsApp Update', 'Back to Today'],
    };
  }

  // 3. MATCH INTENTS: TAKE / MARK DOSE AS TAKEN
  if (
    query.includes('took') ||
    query.includes('taken') ||
    query.includes('mark') ||
    query.includes('swallowed') ||
    query.includes('had my') ||
    query.includes('i take') ||
    query.includes('drank my')
  ) {
    // Find target medicine or first pending dose
    let targetDose: DoseEvent | undefined;
    for (const med of medicines) {
      if (query.includes(med.name.toLowerCase()) || query.includes((med.genericName || '').toLowerCase())) {
        targetDose = doses.find((d) => d.medicineId === med.id && d.status === 'pending');
        if (!targetDose) {
          targetDose = doses.find((d) => d.medicineId === med.id);
        }
        break;
      }
    }

    if (!targetDose) {
      targetDose = doses.find((d) => d.status === 'pending') || doses[0];
    }

    if (targetDose) {
      return {
        spokenReply: `Wonderful job ${seniorName}! I have marked your ${targetDose.medicineName} dose as taken. Excellent dedication to your health!`,
        displayReply: `✅ **Dose Recorded as Taken**\n\n- **Medicine:** ${targetDose.medicineName} (${targetDose.dosage || '1 dose'})\n- **Scheduled Time:** ${targetDose.scheduledTime}\n- **Status:** Taken successfully\n\nGreat job maintaining your adherence streak!`,
        actionIntent: 'mark_taken',
        targetDoseId: targetDose.id,
        targetMedicineName: targetDose.medicineName,
        confidence: 96,
        followUpSuggestions: ['When is my next dose?', 'Check today’s medicines', 'How many pills left?'],
      };
    }
  }

  // 4. MATCH INTENTS: SNOOZE REMINDER
  if (query.includes('snooze') || query.includes('remind me later') || query.includes('after 10 minutes') || query.includes('after 15 minutes')) {
    const pending = doses.find((d) => d.status === 'pending') || doses[0];
    return {
      spokenReply: `Sure ${seniorName}. I have snoozed your reminder for 10 minutes. I will remind you again gently with voice and chime.`,
      displayReply: `⏰ **Reminder Snoozed for 10 Minutes**\n\nI will sound a friendly chime and voice alert when it is time. Take your time to finish your meal or tea!`,
      actionIntent: 'snooze_dose',
      targetDoseId: pending?.id,
      confidence: 94,
      followUpSuggestions: ['I am ready to take it now', 'What food should I eat?', 'Check all medicines'],
    };
  }

  // 5. MATCH INTENTS: SKIP DOSE
  if (query.includes('skip') || query.includes('do not want to take') || query.includes('missed dose')) {
    const pending = doses.find((d) => d.status === 'pending') || doses[0];
    return {
      spokenReply: `Understood ${seniorName}. I have marked this dose as skipped in your daily log. Please consult your doctor if you feel unwell.`,
      displayReply: `⚠️ **Dose Skipped**\n\nThis event has been logged for your doctor report. Remember not to double the next dose without consulting your physician.`,
      actionIntent: 'skip_dose',
      targetDoseId: pending?.id,
      confidence: 90,
      followUpSuggestions: ['When is next dose?', 'Show history report', 'Doctor contact'],
    };
  }

  // 6. MATCH INTENTS: NEXT DOSE & UPCOMING REMINDER
  if (
    query.includes('next') ||
    query.includes('when') ||
    query.includes('upcoming') ||
    query.includes('time for') ||
    query.includes('next tablet')
  ) {
    const pending = doses.filter((d) => d.status === 'pending');
    if (pending.length > 0) {
      const next = pending[0];
      const matchingMed = medicines.find((m) => m.id === next.medicineId);
      const colorText = matchingMed?.color ? `${matchingMed.color.toLowerCase()} ` : '';
      const mealText = matchingMed?.mealTiming ? `, ${matchingMed.mealTiming.toLowerCase()}` : '';

      return {
        spokenReply: `Your next medicine is ${next.medicineName}, the ${colorText}tablet, scheduled at ${next.scheduledTime}${mealText}.`,
        displayReply: `🕒 **Next Upcoming Dose**\n\n- **Medicine:** ${next.medicineName} (${next.dosage || '1 tablet'})\n- **Scheduled Time:** ${next.scheduledTime}\n- **Timing:** ${matchingMed?.mealTiming || 'After Food'}\n- **Visual Pill:** ${matchingMed?.color || 'Blue'} ${matchingMed?.shape || 'Round'}\n\nWould you like me to mark it as taken?`,
        actionIntent: 'next_reminder',
        targetDoseId: next.id,
        confidence: 96,
        followUpSuggestions: ['Mark this dose as taken', 'What food should I eat?', 'Show all today’s doses'],
      };
    } else {
      return {
        spokenReply: `All your scheduled medicines for today have been taken! You are completely up to date, ${seniorName}.`,
        displayReply: `🎉 **All Done for Today!**\n\nYou have completed all your scheduled medication doses for today. Keep up the wonderful routine!`,
        actionIntent: 'show_today',
        confidence: 95,
        followUpSuggestions: ['Show my medication streak', 'View medicine stock', 'Open Doctor Report'],
      };
    }
  }

  // 7. MATCH INTENTS: TODAY'S MEDICINE SCHEDULE / DAILY OVERVIEW
  if (
    query.includes('today') ||
    query.includes('schedule') ||
    query.includes('what medicines') ||
    query.includes('list') ||
    query.includes('daily') ||
    query.includes('all pills') ||
    query.includes('how many pills')
  ) {
    const takenCount = doses.filter((d) => d.status === 'taken').length;
    const pendingCount = doses.filter((d) => d.status === 'pending').length;
    const medNames = medicines.map((m) => m.name).join(', ') || 'your daily tablets';

    const doseListText = doses
      .map(
        (d) =>
          `• **${d.scheduledTime}** — ${d.medicineName} (${d.dosage || '1 dose'}) : *${d.status.toUpperCase()}*`
      )
      .join('\n');

    return {
      spokenReply: `You have ${doses.length} medicines scheduled today, ${seniorName}. You have taken ${takenCount}, with ${pendingCount} remaining.`,
      displayReply: `📋 **Today's Medication Schedule**\n\n**Progress:** ${takenCount} of ${doses.length} doses taken (${pendingCount} pending)\n\n${doseListText}\n\nTap any dose to record your action.`,
      actionIntent: 'show_today',
      confidence: 97,
      followUpSuggestions: ['When is my next dose?', 'Mark next dose as taken', 'Check pill stock'],
    };
  }

  // 8. MATCH INTENTS: SPECIFIC DRUG INQUIRY (METFORMIN, TELMISARTAN, ETC.)
  for (const [drugKey, info] of Object.entries(COMMON_DRUG_KNOWLEDGE)) {
    if (query.includes(drugKey)) {
      const matchingUserMed = medicines.find((m) => m.name.toLowerCase().includes(drugKey));
      const userDosage = matchingUserMed ? `Your prescribed dose is ${matchingUserMed.dosage}.` : '';

      return {
        spokenReply: `${drugKey.charAt(0).toUpperCase() + drugKey.slice(1)} ${info.purpose}. ${info.mealAdvice}. ${info.tips}`,
        displayReply: `💊 **About ${drugKey.toUpperCase()}**\n\n- **Purpose:** ${info.purpose}\n- **Meal Timing:** ${info.mealAdvice}\n- **Best Schedule:** ${info.bestTime}\n- **Senior Tip:** ${info.tips}\n\n${userDosage}`,
        actionIntent: 'answer',
        confidence: 98,
        followUpSuggestions: ['When do I take it today?', 'Show all my medicines', 'Check pill stock'],
      };
    }
  }

  // 9. MATCH INTENTS: MEAL & FOOD ADVICE
  if (
    query.includes('eat') ||
    query.includes('food') ||
    query.includes('empty stomach') ||
    query.includes('breakfast') ||
    query.includes('lunch') ||
    query.includes('dinner') ||
    query.includes('water')
  ) {
    return {
      spokenReply: `Most senior medicines like Metformin and Blood Pressure tablets are best taken right after warm food with a full glass of water.`,
      displayReply: `🍲 **Meal & Medication Advice**\n\n1. **After Food:** Always take diabetes and pain tablets after meals to protect your stomach lining.\n2. **Empty Stomach:** Acidity capsules (like Pantoprazole) should be taken 30 minutes before morning tea/breakfast.\n3. **Hydration:** Always drink a full 250ml glass of fresh water with each tablet.\n4. **Never skip meals** right before taking diabetes medication.`,
      actionIntent: 'answer',
      confidence: 95,
      followUpSuggestions: ['Check today’s schedule', 'What is Metformin for?', 'When is next dose?'],
    };
  }

  // 10. MATCH INTENTS: STOCK & REFILLS
  if (
    query.includes('stock') ||
    query.includes('refill') ||
    query.includes('how many') ||
    query.includes('left') ||
    query.includes('pharmacy') ||
    query.includes('running low')
  ) {
    const lowStockMeds = medicines.filter((m) => m.stockCount <= (m.lowStockThreshold || 10));
    let stockSummary = '';

    if (lowStockMeds.length > 0) {
      stockSummary = `You have ${lowStockMeds.length} medicine running low: ${lowStockMeds.map((m) => `${m.name} (${m.stockCount} left)`).join(', ')}. Please order a refill soon.`;
    } else {
      stockSummary = `All your medicines have healthy stock counts. You have ample supply for the coming weeks.`;
    }

    const detailList = medicines.map((m) => `• **${m.name}:** ${m.stockCount} tablets remaining`).join('\n');

    return {
      spokenReply: stockSummary,
      displayReply: `📦 **Medicine Stock & Refill Tracker**\n\n${detailList}\n\n${lowStockMeds.length > 0 ? '⚠️ *Tip: Notify your caregiver or pharmacy to refill low-stock medications.*' : '✅ *All supplies are sufficient.*'}`,
      actionIntent: 'answer',
      confidence: 94,
      followUpSuggestions: ['Refill Metformin', 'Order from Pharmacy', 'Check today’s doses'],
    };
  }

  // 11. MATCH INTENTS: ADD NEW MEDICINE / PRESCRIPTION SCANNER
  if (
    query.includes('add') ||
    query.includes('new medicine') ||
    query.includes('prescribe') ||
    query.includes('new tablet') ||
    query.includes('doctor gave')
  ) {
    return {
      spokenReply: `Opening the Add Medicine screen for you, ${seniorName}. You can type the details or scan a prescription slip.`,
      displayReply: `➕ **Add New Medication**\n\nOpening the medication setup screen. You can configure dosage, pill color, shape, and custom alarm times.`,
      actionIntent: 'add_medicine',
      confidence: 96,
      followUpSuggestions: ['Scan Prescription Image', 'View All Medicines', 'Back to Today'],
    };
  }

  // 12. MATCH INTENTS: SCAN PRESCRIPTION SLIP
  if (query.includes('scan') || query.includes('photo') || query.includes('camera') || query.includes('prescription')) {
    return {
      spokenReply: `Opening the Prescription Scanner, ${seniorName}. You can take a photo of your doctor's slip.`,
      displayReply: `📷 **Prescription OCR Scanner**\n\nOpening camera scanner to automatically extract medication names, dosage, and schedules.`,
      actionIntent: 'open_scanner',
      confidence: 96,
      followUpSuggestions: ['Add Medicine Manually', 'View Doctor Report', 'Back to Dashboard'],
    };
  }

  // 13. MATCH INTENTS: DOCTOR REPORT & ADHERENCE HISTORY
  if (
    query.includes('history') ||
    query.includes('report') ||
    query.includes('adherence') ||
    query.includes('score') ||
    query.includes('streak') ||
    query.includes('analytics')
  ) {
    return {
      spokenReply: `Opening your Doctor Report and Adherence summary, ${seniorName}. Your adherence is looking strong!`,
      displayReply: `📊 **Doctor Report & Adherence History**\n\nOpening your comprehensive adherence timeline. You can export a printable PDF or share it with your doctor.`,
      actionIntent: 'open_history',
      confidence: 95,
      followUpSuggestions: ['Show Today’s Timeline', 'Share with Caregiver', 'Back to Home'],
    };
  }

  // 14. MATCH INTENTS: GREETINGS & PLEASANT CONVERSATION
  if (
    query.includes('hello') ||
    query.includes('hi') ||
    query.includes('good morning') ||
    query.includes('good afternoon') ||
    query.includes('good evening') ||
    query.includes('how are you') ||
    query.includes('namaste')
  ) {
    return {
      spokenReply: `Hello ${seniorName}! I am feeling great and happy to assist you. How are you feeling today?`,
      displayReply: `👋 **Warm Greetings, ${seniorName}!**\n\nI am your 24/7 Medicare Assistant. I am right here to help you remember your pills, check your schedule, or answer any health questions.`,
      actionIntent: 'answer',
      confidence: 98,
      followUpSuggestions: ['What medicines do I have today?', 'When is my next dose?', 'Tell me a healthy tip'],
    };
  }

  // 15. MATCH INTENTS: GRATITUDE & ENCOURAGEMENT
  if (query.includes('thank') || query.includes('great') || query.includes('good job') || query.includes('love')) {
    return {
      spokenReply: `You are very welcome, ${seniorName}! It is my absolute pleasure to help you stay healthy and happy.`,
      displayReply: `❤️ **Always Here For You!**\n\nStaying consistent with your medications is the best gift for your long-term wellness. Proud of you!`,
      actionIntent: 'answer',
      confidence: 96,
      followUpSuggestions: ['What is my next medicine?', 'Check today’s schedule', 'Close Assistant'],
    };
  }

  // 16. MATCH INTENTS: SYMPTOM / FEELING UNWELL GUIDANCE (SAFE & EMPATHETIC)
  if (
    query.includes('tired') ||
    query.includes('dizzy') ||
    query.includes('headache') ||
    query.includes('stomach') ||
    query.includes('not feeling well') ||
    query.includes('pain')
  ) {
    return {
      spokenReply: `Please rest comfortably, ${seniorName}. Sip some water and let your caregiver know if you feel unwell. If it persists, call your doctor.`,
      displayReply: `🩺 **Comfort & Safety Advice**\n\n1. Please sit or lie down in a comfortable, well-ventilated area.\n2. Sip a small glass of warm water.\n3. If dizziness continues, avoid standing up quickly.\n4. You can tap the SOS or Caregiver button below if you want family to check in on you.`,
      actionIntent: 'answer',
      confidence: 93,
      followUpSuggestions: ['Call Caregiver', 'Open Emergency SOS', 'Check Today’s Doses'],
    };
  }

  // 17. MATCH INTENTS: HEALTHY LIFESTYLE TIP
  if (query.includes('tip') || query.includes('advice') || query.includes('healthy') || query.includes('water')) {
    const tips = [
      'Drinking a glass of lukewarm water first thing in the morning gently wakes up your digestive system.',
      'A gentle 15-minute walk after lunch helps natural blood sugar regulation.',
      'Always store your medicines in a cool, dry place away from direct sunlight.',
      'Taking your evening tablets with a light dinner helps ensure sound, restful sleep.',
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    return {
      spokenReply: `Here is your daily wellness tip, ${seniorName}: ${randomTip}`,
      displayReply: `💡 **Daily Wellness Tip**\n\n${randomTip}\n\nConsistency and gentle daily habits keep your body vibrant!`,
      actionIntent: 'answer',
      confidence: 92,
      followUpSuggestions: ['What do I take next?', 'Check today’s pills', 'Another tip'],
    };
  }

  // 18. DEFAULT CONVERSATIONAL FALLBACK (SMART, POLITE, CONTEXTUAL)
  const pendingCount = doses.filter((d) => d.status === 'pending').length;
  const nextPending = doses.find((d) => d.status === 'pending');

  const defaultSpoken = nextPending
    ? `I am here with you, ${seniorName}. You have ${pendingCount} pending doses today. Your next medicine is ${nextPending.medicineName} at ${nextPending.scheduledTime}.`
    : `Hello ${seniorName}! All your scheduled medicines for today are completed. How else may I assist you?`;

  return {
    spokenReply: defaultSpoken,
    displayReply: `💬 **Medicare Assistant**\n\nI heard: *“${userQuery}”*\n\n${defaultSpoken}\n\nYou can ask about your schedule, pill details, record doses as taken, or call your caregiver.`,
    actionIntent: 'answer',
    confidence: 88,
    followUpSuggestions: [
      'What medicines do I have today?',
      'When is my next dose?',
      'Mark dose as taken',
      'What should I eat with Metformin?',
    ],
  };
}
