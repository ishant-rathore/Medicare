import { Capacitor } from '@capacitor/core';
import { TextToSpeech, QueueStrategy } from '@capacitor-community/text-to-speech';

// ============================================================
// Web Audio Context & Synthesizers
// ============================================================

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
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
  }
}

export function playChime() {
  playMedicationAlarm('medium');
}

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
    return () => {};
  }
}

export const playSiren = playSOSSiren;

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
    options.onEnd?.();
    return;
  }

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

export function getTranslatedSpokenScript(
  medicineName: string,
  dosage: string,
  time: string,
  pillColor: string,
  mealTiming: string,
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

  return `${nickname}, it is ${time}. Please take your ${pillColor.toLowerCase()} ${medicineName}, ${dosage}, ${mealTiming.toLowerCase()}.`;
}
