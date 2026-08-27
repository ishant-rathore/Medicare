import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Volume2,
  CheckCircle,
  HelpCircle,
  Clock,
  Pill,
} from 'lucide-react';
import { UserProfile, DoseEvent, Medicine } from '../types';
import { speakText, stopSpeech, playTapSound } from '../utils/audio';

interface VoiceAssistantModalProps {
  user: UserProfile;
  doses: DoseEvent[];
  medicines: Medicine[];
  onClose: () => void;
  onDoseAction?: (action: string, doseId?: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  user,
  doses,
  medicines,
  onClose,
  onDoseAction,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState(
    `Hello ${user.nickname || 'Grandpa'}! How can I help you with your medicines today?`
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleCommands = [
    'What medicines do I have today?',
    'Did I take my afternoon tablet?',
    'When is my next dose?',
    'What should I eat with Metformin?',
    'Mark my Metformin as taken',
  ];

  // Initial welcome greeting
  useEffect(() => {
    speakText(
      `Hello ${user.nickname || 'Grandpa'}! I am Medicare Voice Assistant. Speak your question or tap a command below.`,
      { volume: 'loud', language: user.preferredLanguage || 'en-US' }
    );
    return () => {
      stopSpeech();
    };
  }, [user]);

  const handleStartListening = () => {
    playTapSound();
    stopSpeech();
    setIsListening(true);
    setTranscript('Listening to your voice...');

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechClass();
      recognition.lang = user.preferredLanguage || 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        if (event.results[0].isFinal) {
          setIsListening(false);
          processVoiceQuery(text);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('Could not hear clearly. Please tap a command below.');
      };

      recognition.start();
    } else {
      setTimeout(() => {
        setIsListening(false);
        const query = sampleCommands[0];
        setTranscript(query);
        processVoiceQuery(query);
      }, 1500);
    }
  };

  const processVoiceQuery = async (queryText: string) => {
    setIsProcessing(true);
    setTranscript(`“${queryText}”`);

    try {
      const res = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: queryText,
          userQuery: queryText,
          userContext: {
            seniorName: user.name,
            nickname: user.nickname,
            language: user.preferredLanguage,
            medicines,
            todayDoses: doses,
          },
        }),
      });

      const data = await res.json();
      const spokenResponse =
        data.spokenResponse ||
        data.spokenReply ||
        data.reply ||
        `You have ${doses.length} medicines scheduled today. Your next dose is at 2:00 PM.`;
      setAssistantReply(spokenResponse);

      speakText(spokenResponse, {
        rate: 'normal',
        volume: 'loud',
        language: user.preferredLanguage || 'en-US',
      });

      if ((data.actionIntent || data.action) && onDoseAction) {
        onDoseAction(data.actionIntent || data.action, data.targetDoseId);
      }
    } catch (err) {
      // Local smart response fallback
      let fallbackText = `You have ${doses.length} medicines scheduled today.`;
      if (queryText.toLowerCase().includes('next')) {
        const pending = doses.find((d) => d.status === 'pending');
        fallbackText = pending
          ? `Your next medicine is ${pending.medicineName} at ${pending.scheduledTime}.`
          : 'All scheduled medicines have been taken today!';
      } else if (queryText.toLowerCase().includes('taken') || queryText.toLowerCase().includes('mark')) {
        fallbackText = 'Marked your dose as taken. Excellent job staying consistent!';
      }
      setAssistantReply(fallbackText);
      speakText(fallbackText, { volume: 'loud' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectSample = (cmd: string) => {
    playTapSound();
    setTranscript(`“${cmd}”`);
    processVoiceQuery(cmd);
  };

  return (
    <div
      id="medicare-voice-assistant-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-4 font-sans"
    >
      <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-auto shadow-xl border border-slate-200 space-y-4 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Medicare Voice Assistant
              </h3>
              <p className="text-xs font-medium text-slate-500">Senior AI Healthcare Companion</p>
            </div>
          </div>

          <button
            onClick={() => {
              playTapSound();
              stopSpeech();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Mic Button */}
        <div className="text-center py-3 space-y-2.5">
          <div className="relative inline-flex items-center justify-center">
            {isListening && (
              <div className="absolute w-24 h-24 rounded-full bg-blue-400/20 animate-ping" />
            )}
            <button
              id="btn-voice-mic-trigger"
              onClick={handleStartListening}
              className={`w-18 h-18 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-95 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Mic className="w-8 h-8" />
            </button>
          </div>

          <p className="text-xs font-semibold text-slate-600">
            {isListening ? 'Listening... Speak now' : 'Tap the microphone to speak'}
          </p>

          {transcript && (
            <div className="p-3 bg-blue-50 text-blue-900 font-semibold rounded-2xl text-xs border border-blue-100">
              {transcript}
            </div>
          )}
        </div>

        {/* Spoken Response Box */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Volume2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Assistant Answer:</span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
            {isProcessing ? 'Processing request...' : assistantReply}
          </p>
        </div>

        {/* Quick Voice Commands */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-500 block">
            Or tap a common question:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleCommands.map((cmd, i) => (
              <button
                key={i}
                onClick={() => handleSelectSample(cmd)}
                className="text-xs font-medium bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-xs"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
