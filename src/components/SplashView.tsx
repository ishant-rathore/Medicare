import React, { useEffect } from 'react';
import { Pill, Volume2, ArrowRight } from 'lucide-react';
import { speakText, playTapSound } from '../utils/audio';

interface SplashViewProps {
  onGetStarted?: () => void;
  onContinue?: () => void;
  onDirectLogin?: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({
  onGetStarted,
  onContinue,
  onDirectLogin,
}) => {
  const handleProceed = () => {
    playTapSound();
    if (onGetStarted) {
      onGetStarted();
    } else if (onContinue) {
      onContinue();
    }
  };

  useEffect(() => {
    // Announce voice welcome for senior accessibility
    const timer = setTimeout(() => {
      speakText('Welcome to Medicare. Your trusted voice medication companion.', {
        rate: 'normal',
        volume: 'loud',
      });
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="medicare-splash-screen"
      className="min-h-screen bg-slate-50 flex flex-col items-center justify-between p-6 text-center select-none font-sans"
    >
      {/* Top Status Space */}
      <div className="w-full flex justify-end text-xs text-slate-500 font-medium pt-2">
        <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-[11px] shadow-xs">
          Medicare v1.0
        </span>
      </div>

      {/* Main Logo & Identity */}
      <div className="my-auto flex flex-col items-center max-w-sm">
        {/* Animated Capsule + Voice Wave Emblem */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-3xl bg-blue-600 p-1 shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[20px] flex items-center justify-center relative overflow-hidden">
              {/* Capsule Graphic */}
              <div className="w-14 h-14 rounded-full border-2 border-blue-700 overflow-hidden rotate-45 flex shadow-xs">
                <div className="w-1/2 h-full bg-blue-600 flex items-center justify-center text-white">
                  <div className="w-2 h-2 rounded-full bg-white/70" />
                </div>
                <div className="w-1/2 h-full bg-emerald-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/70" />
                </div>
              </div>

              {/* Sound Wave Accent */}
              <div className="absolute right-2 flex items-center gap-0.5 text-blue-600">
                <div className="w-1 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-3.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-full shadow-sm">
            <Volume2 className="w-4 h-4" />
          </div>
        </div>

        {/* Brand Typography */}
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
          Medicare
        </h1>
        <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-3">
          <Volume2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Voice Medication Companion</span>
        </div>

        <p className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed max-w-xs">
          “Your Trusted Voice Medication Companion”
        </p>

        <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
          Designed specifically for seniors with loud spoken reminders, high contrast, and caregiver connectivity.
        </p>
      </div>

      {/* Bottom Action Buttons */}
      <div className="w-full max-w-sm pb-6 space-y-3">
        <button
          id="btn-splash-start"
          onClick={handleProceed}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-base font-bold py-3.5 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2.5 transition-transform active:scale-98"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {onDirectLogin && (
          <button
            id="btn-splash-direct-login"
            onClick={() => {
              playTapSound();
              onDirectLogin();
            }}
            className="w-full py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold hover:underline transition-colors"
          >
            Already registered? Sign In
          </button>
        )}
      </div>
    </div>
  );
};
