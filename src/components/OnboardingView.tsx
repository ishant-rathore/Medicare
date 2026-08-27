import React, { useState } from 'react';
import {
  Bell,
  Volume2,
  HeartHandshake,
  WifiOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Play,
  Pill,
} from 'lucide-react';
import { speakText, playTapSound } from '../utils/audio';

interface OnboardingViewProps {
  onComplete?: () => void;
  onFinish?: () => void;
  onSkip: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete, onFinish, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const steps = [
    {
      title: 'Never Miss Your Medicine',
      subtitle: 'Timely reminders help you take the right medicine, every time.',
      icon: Bell,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Step 1 of 5',
      illustration: (
        <div className="w-48 h-48 rounded-full bg-blue-100 flex items-center justify-center relative shadow-inner mx-auto my-4 border-4 border-blue-200">
          <div className="w-32 h-32 rounded-3xl bg-white shadow-xl flex flex-col items-center justify-center p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-black text-blue-900">08:00 AM</span>
            </div>
            <div className="w-12 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
              Rx Pill
            </div>
            <span className="text-[11px] font-bold text-slate-700 mt-2">1 Tablet After Food</span>
          </div>
          <div className="absolute top-2 right-2 bg-emerald-500 text-white p-2 rounded-full shadow-md">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      ),
      audioSample: 'Grandpa, it is 8 AM. Time to take your white blood pressure medicine with a glass of water.',
    },
    {
      title: 'Voice Reminders You Can Trust',
      subtitle: 'Loud, clear voice alerts announce your medicine in your preferred language.',
      icon: Volume2,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Step 2 of 5',
      illustration: (
        <div className="w-48 h-48 rounded-full bg-emerald-100 flex items-center justify-center relative shadow-inner mx-auto my-4 border-4 border-emerald-200">
          <div className="w-36 h-36 rounded-2xl bg-blue-950 text-white shadow-2xl flex flex-col items-center justify-center p-2.5 text-center border-2 border-blue-400">
            <span className="text-sm font-black text-amber-300">2:00 PM</span>
            <div className="my-1.5 p-2 rounded-full bg-blue-800 animate-pulse">
              <Volume2 className="w-7 h-7 text-white" />
            </div>
            <p className="text-[10px] font-medium leading-tight text-blue-100">
              “Please take your blue diabetes tablet”
            </p>
          </div>
        </div>
      ),
      audioSample: 'Grandpa, it is 2 PM. Please take your blue diabetes tablet after food.',
    },
    {
      title: 'Care That Stays Connected',
      subtitle: 'Caregivers receive timely alerts if a dose is missed, keeping family informed.',
      icon: HeartHandshake,
      color: 'from-purple-600 to-pink-600',
      badge: 'Step 3 of 5',
      illustration: (
        <div className="w-48 h-48 rounded-full bg-purple-100 flex items-center justify-center relative shadow-inner mx-auto my-4 border-4 border-purple-200">
          <div className="w-40 bg-white rounded-2xl p-3 shadow-xl border border-purple-100 flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-1.5 rounded-lg text-xs font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Medicine Taken (8 AM)</span>
            </div>
            <div className="flex items-center gap-2 bg-rose-50 text-rose-800 p-1.5 rounded-lg text-xs font-bold">
              <Bell className="w-4 h-4 text-rose-600" />
              <span>Daughter Notified</span>
            </div>
          </div>
        </div>
      ),
      audioSample: 'Caregiver support is connected. Your family will be updated automatically.',
    },
    {
      title: 'Works Offline Always',
      subtitle: 'All alarms ring on time even when there is no internet or WiFi available.',
      icon: WifiOff,
      color: 'from-amber-600 to-orange-600',
      badge: 'Step 4 of 5',
      illustration: (
        <div className="w-48 h-48 rounded-full bg-amber-100 flex items-center justify-center relative shadow-inner mx-auto my-4 border-4 border-amber-200">
          <div className="w-36 h-36 bg-white rounded-3xl p-3 shadow-xl flex flex-col items-center justify-center text-center border border-amber-200">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-slate-800">100% Offline Safe</span>
            <p className="text-[10px] text-slate-700 mt-1">Alarms stored directly on this phone</p>
          </div>
        </div>
      ),
      audioSample: 'Medicare stores all your reminder alarms safely on this device. You are always protected.',
    },
    {
      title: 'Easy For Seniors',
      subtitle: 'Extra large buttons, crisp high-contrast text, and simple one-tap actions.',
      icon: Sparkles,
      color: 'from-blue-700 to-emerald-600',
      badge: 'Step 5 of 5',
      illustration: (
        <div className="w-48 h-48 rounded-full bg-slate-100 flex items-center justify-center relative shadow-inner mx-auto my-4 border-4 border-blue-300">
          <div className="w-40 flex flex-col gap-2">
            <div className="w-full bg-emerald-600 text-white font-black py-2.5 rounded-xl text-center text-sm shadow-md flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> TAKEN
            </div>
            <div className="w-full bg-amber-500 text-white font-black py-2 rounded-xl text-center text-xs shadow-md">
              SNOOZE (10 min)
            </div>
          </div>
        </div>
      ),
      audioSample: 'You can tap Taken, Snooze, or Skip with one easy tap on large colorful buttons.',
    },
  ];

  const current = steps[currentStep];

  const handlePlayVoiceSample = () => {
    setIsPlayingAudio(true);
    speakText(current.audioSample, {
      rate: 'normal',
      volume: 'loud',
      onEnd: () => setIsPlayingAudio(false),
    });
  };

  const handleNext = () => {
    playTapSound();
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      if (onFinish) {
        onFinish();
      } else if (onComplete) {
        onComplete();
      }
    }
  };

  const handleBack = () => {
    playTapSound();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div
      id="medicare-onboarding-screen"
      className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto font-sans"
    >
      {/* Top Header Controls */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
          {current.badge}
        </span>
        <button
          id="btn-onboarding-skip"
          onClick={() => {
            playTapSound();
            onSkip();
          }}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slide Illustration & Info */}
      <div className="my-auto flex flex-col items-center text-center">
        {current.illustration}

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-4 mb-2">
          {current.title}
        </h2>

        <p className="text-sm sm:text-base font-normal text-slate-600 max-w-xs leading-relaxed">
          {current.subtitle}
        </p>

        {/* Interactive Voice Sample Trigger */}
        <button
          id="btn-onboarding-listen-sample"
          onClick={handlePlayVoiceSample}
          className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs border ${
            isPlayingAudio
              ? 'bg-blue-600 text-white border-blue-600 scale-105'
              : 'bg-white text-blue-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-blue-600" />}
          <span>{isPlayingAudio ? 'Playing Voice Sample...' : 'Hear Spoken Voice Sample'}</span>
        </button>

        {/* Step Indicator Dots */}
        <div className="flex items-center gap-1.5 mt-6">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center gap-3 pt-4">
        {currentStep > 0 ? (
          <button
            id="btn-onboarding-back"
            onClick={handleBack}
            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : null}

        <button
          id="btn-onboarding-next"
          onClick={handleNext}
          className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-sm transition-transform active:scale-98 ${
            currentStep === 0 ? 'w-full' : ''
          }`}
        >
          <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
