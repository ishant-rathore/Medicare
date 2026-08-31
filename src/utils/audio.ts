<<<<<<< HEAD
import { Capacitor } from '@capacitor/core';
import { TextToSpeech, QueueStrategy } from '@capacitor-community/text-to-speech';

// ============================================================
// Web Audio Context & Synthesizers
// ============================================================

=======
/**
 * Audio synthesis, speech recognition, and Text-to-Speech engine
 * tailored for senior citizen voice medication reminders.
 */

// Web Audio Context singleton
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
<<<<<<< HEAD
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    audioCtx = new AudioContextClass();
  }

  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }

  return audioCtx;
}

export function playMedicationAlarm(
  volume: 'low' | 'medium' | 'loud' = 'loud'
) {
  try {
    const ctx = getAudioContext();

    const gainValue =
      volume === 'low'
        ? 0.3
        : volume === 'medium'
          ? 0.6
          : 0.9;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gainValue, ctx.currentTime);
    gainNode.connect(ctx.destination);

    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((frequency, index) => {
      const start = ctx.currentTime + index * 0.18;

      const oscillator = ctx.createOscillator();
      const noteGain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);

      noteGain.gain.setValueAtTime(0.01, start);
      noteGain.gain.exponentialRampToValueAtTime(
        1,
        start + 0.04
      );
      noteGain.gain.exponentialRampToValueAtTime(
        0.001,
        start + 0.4
      );

      oscillator.connect(noteGain);
      noteGain.connect(gainNode);

      oscillator.start(start);
      oscillator.stop(start + 0.45);
    });

    try {
      navigator.vibrate?.([400, 200, 400, 200, 600]);
    } catch {}
  } catch (error) {
    console.warn('[Medicare Audio] Medication alarm audio error:', error);
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  }
}

export function playChime() {
  playMedicationAlarm('medium');
}

<<<<<<< HEAD
// ============================================================
// SOS Siren Synthesizer
// ============================================================

export function playSOSSiren(): () => void {
  try {
    const ctx = getAudioContext();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sawtooth';

    const now = ctx.currentTime;

    for (let i = 0; i < 6; i++) {
      oscillator.frequency.setValueAtTime(
        650,
        now + i * 0.4
      );

      oscillator.frequency.linearRampToValueAtTime(
        1250,
        now + i * 0.4 + 0.2
      );

      oscillator.frequency.linearRampToValueAtTime(
        650,
        now + i * 0.4 + 0.4
      );
    }

    gainNode.gain.setValueAtTime(0.8, now);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      now + 2.4
    );

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 2.5);

    try {
      navigator.vibrate?.([
        500,
        100,
        500,
        100,
        500,
        100,
        500,
      ]);
    } catch {}

    return () => {
      try {
        oscillator.stop();
      } catch {}

      try {
        gainNode.disconnect();
      } catch {}
    };
  } catch (error) {
    console.warn('[Medicare Audio] SOS siren audio error:', error);
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    return () => {};
  }
}

export const playSiren = playSOSSiren;

<<<<<<< HEAD
// ============================================================
// Tap Sound Feedback
// ============================================================

export function playTapSound() {
  try {
    const ctx = getAudioContext();

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';

    oscillator.frequency.setValueAtTime(
      800,
      ctx.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      400,
      ctx.currentTime + 0.08
    );

    gain.gain.setValueAtTime(
      0.15,
      ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + 0.08
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.09);
  } catch {}
}

// ============================================================
// Text To Speech (Native Android + Web Fallback)
// ============================================================

export interface SpeakOptions {
  language?: string;
  rate?: 'slow' | 'normal' | 'fast' | number;
  volume?: 'low' | 'medium' | 'loud' | number;
  gender?: 'male' | 'female';
  onStart?: () => void;
  onEnd?: () => void;
}

// Speech session counter to prevent race conditions and overlapping speech
let activeSpeechId = 0;

function getSpeechRate(rate?: SpeakOptions['rate']): number {
  if (typeof rate === 'number') {
    return Math.max(0.2, Math.min(2.0, rate));
  }

  if (rate === 'slow') {
    return 0.8;
  }

  if (rate === 'fast') {
    return 1.15;
  }

  return 1.0;
}

function getSpeechVolume(volume?: SpeakOptions['volume']): number {
  if (typeof volume === 'number') {
    return Math.max(0, Math.min(1, volume));
  }

  if (volume === 'low') {
    return 0.5;
  }

  if (volume === 'medium') {
    return 0.8;
  }

  return 1.0;
}

/**
 * Resolves the best available language tag on Android native TTS engine.
 * Tests exact BCP-47 tag, underscored tag, and language prefix.
 * If unsupported, gracefully falls back to 'en-US'.
 */
async function resolveNativeLanguage(requestedLang: string): Promise<string> {
  const normalized = requestedLang.trim();
  const candidates: string[] = [
    normalized,
    normalized.replace('-', '_'),
    normalized.split('-')[0] || normalized,
  ];

  for (const candidate of candidates) {
    try {
      const result = await TextToSpeech.isLanguageSupported({ lang: candidate });
      if (result && result.supported) {
        return candidate;
      }
    } catch {
      // Continue to next candidate variant
    }
  }

  console.warn(
    `[Medicare TTS] Requested language "${requestedLang}" is not installed or supported on this device's Android TTS engine. Gracefully falling back to English (en-US).`
  );

  return 'en-US';
}

/**
 * Speaks text using native Capacitor TextToSpeech plugin on Android,
 * with graceful browser SpeechSynthesis fallback on Web.
 */
export async function speakText(
  text: string,
  options: SpeakOptions = {}
): Promise<void> {
  if (!text || !text.trim()) {
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    options.onEnd?.();
    return;
  }

<<<<<<< HEAD
  const speechId = ++activeSpeechId;
  const language = options.language || 'en-US';
  const rate = getSpeechRate(options.rate);
  const volume = getSpeechVolume(options.volume);

  // ----------------------------------------------------------
  // Native Android Platform (Capacitor TextToSpeech)
  // ----------------------------------------------------------
  if (Capacitor.isNativePlatform()) {
    try {
      // Ensure previous speech is stopped
      await TextToSpeech.stop();
    } catch {}

    if (speechId !== activeSpeechId) return;

    const resolvedLang = await resolveNativeLanguage(language);
    if (speechId !== activeSpeechId) return;

    try {
      options.onStart?.();

      await TextToSpeech.speak({
        text: text.trim(),
        lang: resolvedLang,
        rate,
        pitch: 1.0,
        volume,
        queueStrategy: QueueStrategy.Flush,
      });

      if (speechId === activeSpeechId) {
        options.onEnd?.();
      }
      return;
    } catch (nativeError) {
      console.warn('[Medicare TTS] Native TTS speak failed:', nativeError);

      // Emergency native fallback to en-US if another language failed
      if (resolvedLang !== 'en-US' && speechId === activeSpeechId) {
        try {
          await TextToSpeech.speak({
            text: text.trim(),
            lang: 'en-US',
            rate,
            pitch: 1.0,
            volume,
            queueStrategy: QueueStrategy.Flush,
          });
          if (speechId === activeSpeechId) {
            options.onEnd?.();
          }
          return;
        } catch (emergencyError) {
          console.warn('[Medicare TTS] Emergency en-US native speak failed:', emergencyError);
        }
      }

      if (speechId === activeSpeechId) {
        options.onEnd?.();
      }
      return;
    }
  }

  // ----------------------------------------------------------
  // Web Browser Fallback (SpeechSynthesis)
  // ----------------------------------------------------------
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = language;
      utterance.rate = rate;
      utterance.volume = volume;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const languagePrefix = language.split('-')[0]?.toLowerCase() || 'en';

      const matchingVoices = voices.filter((voice) =>
        voice.lang.toLowerCase().startsWith(languagePrefix)
      );

      if (matchingVoices.length > 0) {
        let selectedVoice = matchingVoices[0];

        if (options.gender === 'female') {
          selectedVoice =
            matchingVoices.find((voice) => {
              const name = voice.name.toLowerCase();
              return (
                name.includes('female') ||
                name.includes('woman') ||
                name.includes('zira') ||
                name.includes('samantha')
              );
            }) || selectedVoice;
        }

        if (options.gender === 'male') {
          selectedVoice =
            matchingVoices.find((voice) => {
              const name = voice.name.toLowerCase();
              return (
                name.includes('male') ||
                name.includes('man') ||
                name.includes('david') ||
                name.includes('george')
              );
            }) || selectedVoice;
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onstart = () => {
        if (speechId === activeSpeechId) {
          options.onStart?.();
        }
      };

      utterance.onend = () => {
        if (speechId === activeSpeechId) {
          options.onEnd?.();
        }
      };

      utterance.onerror = (e) => {
        console.warn('[Medicare TTS] Web SpeechSynthesis error event:', e);
        if (speechId === activeSpeechId) {
          options.onEnd?.();
        }
      };

      window.speechSynthesis.speak(utterance);
      return;
    } catch (browserError) {
      console.warn('[Medicare TTS] Browser SpeechSynthesis failed:', browserError);
    }
  }

  if (speechId === activeSpeechId) {
    options.onEnd?.();
  }
}

// ============================================================
// Stop TTS Function
// ============================================================

export async function stopSpeech(): Promise<void> {
  activeSpeechId++;

  if (Capacitor.isNativePlatform()) {
    try {
      await TextToSpeech.stop();
    } catch (err) {
      console.warn('[Medicare TTS] Native stop failed:', err);
    }
  } else {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (err) {
      console.warn('[Medicare TTS] Web cancel failed:', err);
    }
  }
}

// ============================================================
// Query Supported Languages
// ============================================================

export async function getAvailableTTSLanguages(): Promise<string[]> {
  if (Capacitor.isNativePlatform()) {
    try {
      const result = await TextToSpeech.getSupportedLanguages();
      if (result?.languages && result.languages.length > 0) {
        return result.languages;
      }
    } catch (err) {
      console.warn('[Medicare TTS] Native getSupportedLanguages query failed:', err);
    }
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      const voices = window.speechSynthesis.getVoices();
      const langs = Array.from(new Set(voices.map((v) => v.lang).filter(Boolean)));
      if (langs.length > 0) return langs;
    } catch {}
  }

  return ['en-US', 'hi-IN', 'mr-IN', 'ta-IN', 'te-IN', 'gu-IN', 'bn-IN', 'kn-IN'];
}

// ============================================================
// Spoken Medication Message Generator
// ============================================================

=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
export function getTranslatedSpokenScript(
  medicineName: string,
  dosage: string,
  time: string,
  pillColor: string,
  mealTiming: string,
<<<<<<< HEAD
  nickname = 'Grandpa',
  lang = 'en-US'
): string {
  if (lang.startsWith('hi')) {
    return `${nickname} ji, abhi ${time} baj rahe hain. Kripya apna ${pillColor} rang ka ${medicineName} ${dosage}, ${
      mealTiming === 'After Food'
        ? 'khana khane ke baad'
        : 'le lijiye'
    }.`;
  }

  if (lang.startsWith('mr')) {
    return `${nickname}, ata ${time} vaajle aahet. Krupaya tumchi ${pillColor} rangachi ${medicineName} ${dosage} goli ghyavi.`;
  }

  if (lang.startsWith('ta')) {
    return `${nickname}, ippo ${time} aagiradhu. Ungaludaiya ${pillColor} ${medicineName} marundhai eduthukollavum.`;
  }

  if (lang.startsWith('te')) {
    return `${nickname} gaaru, ippudu samayam ${time}. Mee ${pillColor} ${medicineName} mandhu teesukondi.`;
  }

  if (lang.startsWith('gu')) {
    return `${nickname}, have ${time} vagya chhe. Tamari ${pillColor} ${medicineName} dava lai lo.`;
  }

  if (lang.startsWith('bn')) {
    return `${nickname}, ekhon ${time} baje. Doya kore apnar ${pillColor} ${medicineName} oshudh kheye nin.`;
  }

  if (lang.startsWith('kn')) {
    return `${nickname}, eega ${time} aagide. Dayavittu nimma ${pillColor} bannaada ${medicineName} ${dosage} maathre tegedukolli.`;
  }

=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  return `${nickname}, it is ${time}. Please take your ${pillColor.toLowerCase()} ${medicineName}, ${dosage}, ${mealTiming.toLowerCase()}.`;
}
