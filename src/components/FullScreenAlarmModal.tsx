import React, { useEffect, useState } from 'react';
import {
  Bell,
  Volume2,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { DoseEvent, UserProfile } from '../types';
import { PillIcon } from './PillIcon';
import { playMedicationAlarm, speakText, stopSpeech, playTapSound } from '../utils/audio';

interface FullScreenAlarmModalProps {
  dose: DoseEvent;
  user: UserProfile;
  onTaken: (doseId: string) => void;
  onSnooze: (doseId: string, minutes: number) => void;
  onSkip: (doseId: string) => void;
  onClose: () => void;
}

export const FullScreenAlarmModal: React.FC<FullScreenAlarmModalProps> = ({
  dose,
  user,
  onTaken,
  onSnooze,
  onSkip,
  onClose,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Play alarm sound and speak reminder automatically on mount
  useEffect(() => {
    playMedicationAlarm('loud');

    const spokenText =
      dose.spokenScript ||
      `${user.nickname || 'Grandpa'}, it is ${dose.scheduledTime}. Please take your ${dose.pillColor.toLowerCase()} ${dose.medicineName}, ${dose.dosage}, ${dose.mealTiming.toLowerCase()}.`;

    const timer = setTimeout(() => {
      setIsSpeaking(true);
      speakText(spokenText, {
        rate: 'normal',
        volume: 'loud',
        language: user.preferredLanguage || 'en-US',
        onEnd: () => setIsSpeaking(false),
      });
    }, 800);

    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [dose, user]);

  const handleRepeatVoice = () => {
    playTapSound();
    setIsSpeaking(true);
    const spokenText =
      dose.spokenScript ||
      `${user.nickname || 'Grandpa'}, it is ${dose.scheduledTime}. Please take your ${dose.pillColor.toLowerCase()} ${dose.medicineName}.`;

    speakText(spokenText, {
      rate: 'normal',
      volume: 'loud',
      language: user.preferredLanguage || 'en-US',
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handleTaken = () => {
    playTapSound();
    stopSpeech();
    speakText(`Wonderful! Dose marked as taken. Stay healthy!`, { volume: 'loud' });
    onTaken(dose.id);
  };

  const handleSnooze = () => {
    playTapSound();
    stopSpeech();
    speakText(`Reminder snoozed for 10 minutes. I will remind you again soon.`, { volume: 'loud' });
    onSnooze(dose.id, 10);
  };

  const handleSkip = () => {
    playTapSound();
    stopSpeech();
    speakText(`Dose skipped for today.`, { volume: 'loud' });
    onSkip(dose.id);
  };

  return (
    <div
      id="medicare-fullscreen-alarm-modal"
      className="fixed inset-0 z-50 bg-blue-950 flex flex-col justify-between p-4 sm:p-6 text-white select-none overflow-y-auto animate-fade-in"
    >
      {/* 1. Flashing Urgency Header */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-2 bg-amber-400 text-blue-950 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-wider animate-bounce shadow-lg">
          <Bell className="w-4 h-4 fill-blue-950" />
          <span>MEDICINE TIME</span>
          <Bell className="w-4 h-4 fill-blue-950" />
        </div>

        <div className="text-4xl sm:text-6xl font-black text-amber-300 tracking-tight font-mono mt-2">
          {dose.scheduledTime}
        </div>
      </div>

      {/* 2. Main Medicine Visual & Identification Card */}
      <div className="my-auto max-w-sm w-full mx-auto space-y-4">
        <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border-4 border-blue-400 text-center relative overflow-hidden">
          {/* Pill Visual Display */}
          <div className="w-24 h-24 mx-auto mb-3 bg-slate-50 rounded-3xl flex items-center justify-center p-3 border-2 border-slate-100 shadow-inner">
            <PillIcon color={dose.pillColor} shape={dose.pillShape} size="xl" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {dose.medicineName}
          </h2>
          <p className="text-sm font-bold text-blue-700 mt-1">
            ● {dose.pillColor} {dose.medicineType}
          </p>

          <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <span className="bg-blue-100 text-blue-900 font-extrabold px-3 py-1 rounded-xl text-xs">
              {dose.dosage}
            </span>
            <span className="bg-emerald-100 text-emerald-900 font-extrabold px-3 py-1 rounded-xl text-xs">
              {dose.mealTiming}
            </span>
          </div>
        </div>

        {/* 3. Spoken Voice Banner with Animated Sound Waves */}
        <div className="bg-amber-400 text-blue-950 rounded-3xl p-4 shadow-xl border-2 border-amber-300">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-950 text-amber-300 rounded-2xl shrink-0 mt-0.5">
              <Volume2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-black leading-snug">
                “{user.nickname || 'Grandpa'}, it's {dose.scheduledTime}. Please take your {dose.pillColor.toLowerCase()} {dose.medicineName}.”
              </p>

              {/* Sound Wave Bars */}
              <div className="flex items-center gap-1 mt-3">
                {[12, 24, 16, 32, 20, 28, 14, 30, 22, 10, 26].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-blue-950 rounded-full transition-all duration-200"
                    style={{
                      height: isSpeaking ? `${Math.max(6, (h * (Math.sin(Date.now() / 100 + i) + 1.2)) / 1.5)}px` : '6px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleRepeatVoice}
            className="w-full mt-3 bg-blue-950 hover:bg-blue-900 text-amber-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repeat Spoken Voice</span>
          </button>
        </div>
      </div>

      {/* 4. Giant High-Contrast Touch Buttons */}
      <div className="max-w-sm w-full mx-auto space-y-2.5 pb-2">
        {/* Giant TAKEN Button */}
        <button
          id="btn-alarm-taken"
          onClick={handleTaken}
          className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-black text-2xl py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 border-4 border-emerald-300"
        >
          <CheckCircle className="w-8 h-8 stroke-[3]" />
          <span>TAKEN</span>
        </button>

        {/* Giant SNOOZE Button */}
        <button
          id="btn-alarm-snooze"
          onClick={handleSnooze}
          className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black text-lg py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 border-2 border-amber-300"
        >
          <Clock className="w-6 h-6 stroke-[2.5]" />
          <span>SNOOZE (10 Mins)</span>
        </button>

        {/* Giant SKIP Button */}
        <button
          id="btn-alarm-skip"
          onClick={handleSkip}
          className="w-full bg-rose-600/90 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-sm py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors border border-rose-400/50"
        >
          <XCircle className="w-5 h-5" />
          <span>Skip This Dose</span>
        </button>
      </div>
    </div>
  );
};
