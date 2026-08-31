<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Volume2,
<<<<<<< HEAD
  VolumeX,
  CheckCircle,
  Clock,
  Pill,
  Send,
  HelpCircle,
  PhoneCall,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Heart,
} from 'lucide-react';
import { UserProfile, DoseEvent, Medicine } from '../types';
import { speakText, stopSpeech, playTapSound } from '../utils/audio';
import {
  generateMedicareConversationalResponse,
  AiConversationMessage,
  AiModelResponse,
} from '../services/medicareAiModel';
=======
  CheckCircle,
  HelpCircle,
  Clock,
  Pill,
} from 'lucide-react';
import { UserProfile, DoseEvent, Medicine } from '../types';
import { speakText, stopSpeech, playTapSound } from '../utils/audio';
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

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
<<<<<<< HEAD
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const seniorName = user.nickname || user.name.split(' ')[0] || 'Grandpa';

  // Conversational message history
  const [messages, setMessages] = useState<AiConversationMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hello ${seniorName}! I am your Medicare Voice Assistant. Ask me anything about your medicines, today's schedule, or tap a question below.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'What medicines do I have today?',
        'When is my next dose?',
        'Mark Metformin as taken',
        'What should I eat with Metformin?',
      ],
    },
  ]);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening]);

  // Initial welcome greeting voice
  useEffect(() => {
    const welcomeSpeech = `Hello ${seniorName}! I am Medicare Voice Assistant. How can I help you today?`;
    setIsSpeaking(true);
    speakText(welcomeSpeech, {
      volume: 'loud',
      rate: 'normal',
      language: user.preferredLanguage || 'en-US',
    });

    const timer = setTimeout(() => {
      setIsSpeaking(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [seniorName, user.preferredLanguage]);

  // Instant response generation via in-app Medicare AI Conversational Model
  const handleProcessQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    playTapSound();
    stopSpeech();

    const userMsgId = `user_${Date.now()}`;
    const userMsg: AiConversationMessage = {
      id: userMsgId,
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Instant on-device conversational model execution (0ms latency, works offline)
    const modelResult: AiModelResponse = generateMedicareConversationalResponse(
      queryText,
      user,
      medicines,
      doses
    );

    const botMsgId = `bot_${Date.now()}`;
    const botMsg: AiConversationMessage = {
      id: botMsgId,
      sender: 'assistant',
      text: modelResult.displayReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionIntent: modelResult.actionIntent,
      targetDoseId: modelResult.targetDoseId,
      suggestions: modelResult.followUpSuggestions,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputText('');

    // Speak response loudly and clearly
    setIsSpeaking(true);
    speakText(modelResult.spokenReply, {
      volume: 'loud',
      rate: 'normal',
      language: user.preferredLanguage || 'en-US',
    });

    // Execute application action if intent is an actionable command
    if (modelResult.actionIntent && modelResult.actionIntent !== 'answer' && onDoseAction) {
      setTimeout(() => {
        onDoseAction(modelResult.actionIntent, modelResult.targetDoseId);
      }, 800);
    }
  };

  // Speech Recognition Handler
  const handleToggleVoiceInput = () => {
    playTapSound();
    stopSpeech();

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
      const recognition = new SpeechClass();
      recognition.lang = user.preferredLanguage || 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
<<<<<<< HEAD
        setInputText(text);
        if (event.results[0].isFinal) {
          setIsListening(false);
          handleProcessQuery(text);
=======
        setTranscript(text);
        if (event.results[0].isFinal) {
          setIsListening(false);
          processVoiceQuery(text);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
<<<<<<< HEAD
      };

      recognition.onend = () => {
        setIsListening(false);
=======
        setTranscript('Could not hear clearly. Please tap a command below.');
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
      };

      recognition.start();
    } else {
<<<<<<< HEAD
      // Fallback if browser does not support SpeechRecognition
      setTimeout(() => {
        setIsListening(false);
        const fallbackQuery = 'What medicines do I have today?';
        setInputText(fallbackQuery);
        handleProcessQuery(fallbackQuery);
      }, 1200);
    }
  };

  const handleStopSpeaking = () => {
    playTapSound();
    stopSpeech();
    setIsSpeaking(false);
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  };

  return (
    <div
      id="medicare-voice-assistant-modal"
<<<<<<< HEAD
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-3 sm:p-4 font-sans"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full mx-auto shadow-2xl border-2 border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white leading-tight">
                  Medicare Voice Assistant
                </h3>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-500/90 text-white px-2 py-0.5 rounded-full">
                  Instant AI
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium">
                Personalized Healthcare Companion for {seniorName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                title="Mute Voice"
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all flex items-center gap-1 text-xs font-bold"
              >
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Mute</span>
              </button>
            )}

            <button
              onClick={() => {
                playTapSound();
                stopSpeech();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Conversation Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div className="flex items-center gap-1.5 px-1">
                  <span className="text-[11px] font-bold text-slate-700">
                    {isUser ? 'You' : 'Medicare AI'}
                  </span>
                  <span className="text-[10px] text-slate-700 font-medium">{msg.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-3xl max-w-[88%] sm:max-w-[82%] text-sm font-medium shadow-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-xs font-semibold'
                      : 'bg-white text-slate-800 border-2 border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* Action Shortcuts inside Assistant Message */}
                  {!isUser && msg.actionIntent && msg.actionIntent !== 'answer' && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.actionIntent === 'mark_taken' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" /> Action Recorded
                        </span>
                      )}
                      {msg.actionIntent === 'show_today' && (
                        <button
                          onClick={() => onDoseAction && onDoseAction('show_today')}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 hover:bg-blue-100"
                        >
                          <Calendar className="w-3.5 h-3.5" /> View Full Timeline
                        </button>
                      )}
                      {msg.actionIntent === 'call_caregiver' && (
                        <button
                          onClick={() => onDoseAction && onDoseAction('call_caregiver')}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-100"
                        >
                          <PhoneCall className="w-3.5 h-3.5" /> Open Caregiver Contact
                        </button>
                      )}
                      {msg.actionIntent === 'open_sos' && (
                        <button
                          onClick={() => onDoseAction && onDoseAction('open_sos')}
                          className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-100"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Open Emergency Siren
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Follow-up Quick Tap Suggestions */}
                {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 max-w-[90%]">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleProcessQuery(sug)}
                        className="text-xs font-bold bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-slate-300 transition-all shadow-2xs text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Listening Indicator Banner */}
        {isListening && (
          <div className="bg-rose-50 border-t border-b border-rose-200 px-4 py-2 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span>Listening to your voice... Speak now!</span>
            </div>
            <button
              onClick={() => setIsListening(false)}
              className="text-xs font-bold text-rose-700 underline"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Footer Voice & Text Input Section */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessQuery(inputText);
            }}
            className="flex items-center gap-2"
          >
            {/* Big Tap to Speak Mic Button */}
            <button
              id="btn-voice-modal-mic"
              type="button"
              onClick={handleToggleVoiceInput}
              title={isListening ? 'Stop Listening' : 'Speak to Assistant'}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-bounce ring-4 ring-rose-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Mic className="w-7 h-7" />
            </button>

            {/* Conversational Text Box */}
            <div className="relative flex-1">
              <input
                id="input-voice-assistant-text"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Speak or type a health question..."
                className="w-full bg-slate-100 border-2 border-slate-300 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-700 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors pr-10"
              />
              {inputText && (
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Quick Category Action Chips */}
          <div className="flex items-center justify-between text-[11px] text-slate-700 font-semibold px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Instant AI Model (Zero Latency & Offline Ready)</span>
            </span>
            <span className="text-slate-700">Elderly Friendly Voice</span>
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
          </div>
        </div>
      </div>
    </div>
  );
};
