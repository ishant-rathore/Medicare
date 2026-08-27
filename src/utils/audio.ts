/**
 * Audio synthesis, speech recognition, and Text-to-Speech engine
 * tailored for senior citizen voice medication reminders.
 */

// Web Audio Context singleton
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a clear, loud, senior-friendly medication alarm chime
 */
export function playMedicationAlarm(volume: 'low' | 'medium' | 'loud' = 'loud') {
  try {
    const ctx = getAudioContext();
    const gainNode = ctx.createGain();
    const gainValue = volume === 'low' ? 0.3 : volume === 'medium' ? 0.6 : 0.9;
    gainNode.gain.setValueAtTime(gainValue, ctx.currentTime);
    gainNode.connect(ctx.destination);

    // Play 3-tone pleasant rising medical chime
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.18);

      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0.01, ctx.currentTime + index * 0.18);
      noteGain.gain.exponentialRampToValueAtTime(1, ctx.currentTime + index * 0.18 + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.18 + 0.4);

      osc.connect(noteGain);
      noteGain.connect(gainNode);

      osc.start(ctx.currentTime + index * 0.18);
      osc.stop(ctx.currentTime + index * 0.18 + 0.45);
    });

    // Trigger device vibration if supported
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([400, 200, 400, 200, 600]);
      } catch (e) {
        // Ignore vibration failure
      }
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

export function playChime() {
  playMedicationAlarm('medium');
}

/**
 * Play an urgent SOS siren sound for emergencies
 */
export function playSOSSiren(): () => void {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    gainNode.gain.setValueAtTime(0.8, ctx.currentTime);

    // Modulate pitch between 600Hz and 1200Hz
    const now = ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      osc.frequency.setValueAtTime(650, now + i * 0.4);
      osc.frequency.linearRampToValueAtTime(1250, now + i * 0.4 + 0.2);
      osc.frequency.linearRampToValueAtTime(650, now + i * 0.4 + 0.4);
    }

    gainNode.gain.setValueAtTime(0.8, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.5);

    if ('vibrate' in navigator) {
      navigator.vibrate([500, 100, 500, 100, 500, 100, 500]);
    }

    return () => {
      try {
        osc.stop();
        gainNode.disconnect();
      } catch (e) {}
    };
  } catch (err) {
    console.warn('SOS Siren error:', err);
    return () => {};
  }
}

export const playSiren = playSOSSiren;

/**
 * Play a gentle single button confirmation pop
 */
export function playTapSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {}
}

/**
 * Spoken Voice Synthesis using Web Speech API
 */
export function speakText(
  text: string,
  options: {
    language?: string;
    rate?: 'slow' | 'normal' | 'fast' | number;
    volume?: 'low' | 'medium' | 'loud' | number;
    gender?: 'male' | 'female';
    onStart?: () => void;
    onEnd?: () => void;
  } = {}
) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    options.onEnd?.();
    return;
  }

  window.speechSynthesis.cancel(); // Stop any pending speech

  const utterance = new SpeechSynthesisUtterance(text);

  // Set Language
  utterance.lang = options.language || 'en-US';

  // Set Rate
  if (typeof options.rate === 'number') {
    utterance.rate = options.rate;
  } else if (options.rate === 'slow') {
    utterance.rate = 0.8;
  } else if (options.rate === 'fast') {
    utterance.rate = 1.15;
  } else {
    utterance.rate = 0.95; // Default slightly slower for clarity for seniors
  }

  // Set Volume
  if (typeof options.volume === 'number') {
    utterance.volume = options.volume;
  } else if (options.volume === 'low') {
    utterance.volume = 0.5;
  } else if (options.volume === 'medium') {
    utterance.volume = 0.8;
  } else {
    utterance.volume = 1.0;
  }

  // Select appropriate voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const langPrefix = (options.language || 'en').split('-')[0];
    const matchingVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
    if (matchingVoices.length > 0) {
      if (options.gender === 'female') {
        const femaleVoice = matchingVoices.find(
          (v) => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha')
        );
        utterance.voice = femaleVoice || matchingVoices[0];
      } else {
        const maleVoice = matchingVoices.find(
          (v) => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('man') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george')
        );
        utterance.voice = maleVoice || matchingVoices[0];
      }
    }
  }

  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) utterance.onend = options.onEnd;
  utterance.onerror = (e) => {
    console.warn('Speech synthesis utterance error:', e);
    options.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any currently active speech synthesis
 */
export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Regional language translation helpers for standard senior voice alerts
 */
export function getTranslatedSpokenScript(
  medicineName: string,
  dosage: string,
  time: string,
  pillColor: string,
  mealTiming: string,
  nickname: string = 'Grandpa',
  lang: string = 'en-US'
): string {
  if (lang.startsWith('hi')) {
    // Hindi
    return `${nickname} ji, abhi ${time} baj rahe hain. Kripya apna ${pillColor} rang ka ${medicineName} ${dosage}, ${mealTiming === 'After Food' ? 'khana khane ke baad' : 'le lijiye'}.`;
  }
  if (lang.startsWith('mr')) {
    // Marathi
    return `${nickname}, ata ${time} vaajle aahet. Krupaya tumchi ${pillColor} rangachi ${medicineName} ${dosage} goli ghyavi.`;
  }
  if (lang.startsWith('ta')) {
    // Tamil
    return `${nickname}, ippo ${time} aagiradhu. Ungaludaiya ${pillColor} ${medicineName} marundhai eduthukollavum.`;
  }
  if (lang.startsWith('te')) {
    // Telugu
    return `${nickname} gaaru, ippudu samayam ${time}. Mee ${pillColor} ${medicineName} mandhu teesukondi.`;
  }
  if (lang.startsWith('gu')) {
    // Gujarati
    return `${nickname}, have ${time} vagya chhe. Tamari ${pillColor} ${medicineName} dava lai lo.`;
  }
  if (lang.startsWith('bn')) {
    // Bengali
    return `${nickname}, ekhon ${time} baje. Doya kore apnar ${pillColor} ${medicineName} oshudh kheye nin.`;
  }
  // Default English
  return `${nickname}, it is ${time}. Please take your ${pillColor.toLowerCase()} ${medicineName}, ${dosage}, ${mealTiming.toLowerCase()}.`;
}
