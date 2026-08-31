import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Volume2,
  Bell,
  Save,
  ArrowLeft,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Medicine, RecurrenceType } from '../types';
import { PillIcon } from './PillIcon';
import { speakText, playTapSound } from '../utils/audio';

interface ReminderScheduleViewProps {
  medicine: Medicine;
  onSaveSchedule: (medId: string, times: string[], frequency: RecurrenceType, snoozeMins: number) => void;
  onCancel: () => void;
}

export const ReminderScheduleView: React.FC<ReminderScheduleViewProps> = ({
  medicine,
  onSaveSchedule,
  onCancel,
}) => {
  const [selectedTime, setSelectedTime] = useState('02:00 PM');
  const [frequency, setFrequency] = useState<RecurrenceType>('Daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [soundChoice, setSoundChoice] = useState<'voice' | 'chime' | 'alarm'>('voice');
  const [snoozeMins, setSnoozeMins] = useState(10);
  const [isSaved, setIsSaved] = useState(false);

  const frequencies: { type: RecurrenceType; desc: string }[] = [
    { type: 'Daily', desc: 'Every day' },
    { type: 'Weekly', desc: 'Specific days' },
    { type: 'Alternate Days', desc: 'Every 2 days' },
    { type: 'Every 8 Hours', desc: '3 times a day' },
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (day: string) => {
    playTapSound();
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    speakText(`Schedule saved for ${medicine.name}. Reminders will sound at ${selectedTime}.`, {
      volume: 'loud',
    });
    onSaveSchedule(medicine.id, [selectedTime], frequency, snoozeMins);
    setIsSaved(true);
  };

  return (
    <div
      id="medicare-reminder-scheduling-screen"
      className="min-h-screen bg-slate-50 pb-28 p-4 sm:p-6 max-w-lg mx-auto space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Set Reminder</h1>
            <p className="text-xs font-semibold text-slate-700">Choose when and how to remind</p>
          </div>
        </div>

        <div className="p-2 bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
          <PillIcon color={medicine.color} shape={medicine.shape} size="md" />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* 1. Select Reminder Time */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>1. Select Reminder Time</span>
          </label>

          {/* Large Time Display Dial */}
          <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white rounded-3xl p-6 text-center shadow-lg">
            <span className="text-[11px] font-extrabold uppercase text-blue-200 tracking-widest block mb-1">
              Active Alarm Time
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-amber-300">
              {selectedTime}
            </div>
            <p className="text-xs text-blue-100 font-semibold mt-2">
              Loud spoken voice will trigger at this exact time
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2">
            {['08:00 AM', '02:00 PM', '08:00 PM', '10:00 PM'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  playTapSound();
                  setSelectedTime(t);
                }}
                className={`py-2.5 rounded-2xl text-xs font-black border-2 transition-all ${
                  selectedTime === t
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Repeat Frequency */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>2. Repeat Recurrence</span>
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            {frequencies.map((f) => (
              <button
                key={f.type}
                type="button"
                onClick={() => {
                  playTapSound();
                  setFrequency(f.type);
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  frequency === f.type
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black">{f.type}</span>
                  {frequency === f.type && <Check className="w-4 h-4 text-blue-700" />}
                </div>
                <span className="text-[11px] font-semibold text-slate-700 block mt-0.5">{f.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Days of the Week (if Weekly) */}
        {frequency === 'Weekly' && (
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
            <label className="text-xs font-black uppercase text-slate-700 tracking-wider block">
              3. Select Days (Weekly)
            </label>
            <div className="flex justify-between gap-1">
              {weekDays.map((d) => {
                const isSelected = selectedDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`w-11 h-11 rounded-2xl text-xs font-black border-2 transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Reminder Sound Option */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span>4. Reminder Sound</span>
          </label>

          <div className="space-y-2">
            {[
              { id: 'voice', label: 'Voice Reminder (Default)', desc: 'Loud spoken name & dosage' },
              { id: 'chime', label: 'Soft Chime', desc: 'Pleasant medical melody' },
              { id: 'alarm', label: 'Loud Alarm', desc: 'High noticeability buzzer' },
            ].map((snd) => (
              <button
                key={snd.id}
                type="button"
                onClick={() => {
                  playTapSound();
                  setSoundChoice(snd.id as any);
                }}
                className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between transition-all text-left ${
                  soundChoice === snd.id
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <span className="text-sm font-black block">{snd.label}</span>
                  <span className="text-xs font-semibold text-slate-700">{snd.desc}</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    soundChoice === snd.id ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                  }`}
                >
                  {soundChoice === snd.id && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Snooze Interval */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span>5. Snooze Interval</span>
            </label>
            <span className="text-sm font-black text-blue-700">{snoozeMins} Minutes</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[5, 10, 15].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => {
                  playTapSound();
                  setSnoozeMins(mins);
                }}
                className={`py-3 rounded-2xl text-xs font-black border-2 transition-all ${
                  snoozeMins === mins
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {mins} Mins
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          id="btn-save-schedule"
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-lg font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <Save className="w-5 h-5" />
          <span>Save Schedule</span>
        </button>
      </form>
    </div>
  );
};
