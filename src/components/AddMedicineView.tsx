import React, { useState } from 'react';
import {
  Pill,
  Camera,
  Mic,
  Plus,
  Minus,
  Clock,
  Save,
  ArrowLeft,
  Sparkles,
  Check,
  Volume2,
} from 'lucide-react';
import { Medicine, PillColor, PillShape, MedicineType, MealTiming, RecurrenceType } from '../types';
import { PillIcon } from './PillIcon';
import { speakText, playTapSound } from '../utils/audio';

interface AddMedicineViewProps {
  initialMedicine?: Medicine | null;
  onSave: (medicine: Medicine) => void;
  onCancel: () => void;
}

export const AddMedicineView: React.FC<AddMedicineViewProps> = ({
  initialMedicine,
  onSave,
  onCancel,
}) => {
  const isEditing = !!initialMedicine;

  const [name, setName] = useState(initialMedicine?.name || '');
  const [dosage, setDosage] = useState(initialMedicine?.dosage || '1 Tablet');
  const [type, setType] = useState<MedicineType>(initialMedicine?.type || 'Tablet');
  const [color, setColor] = useState<PillColor>(initialMedicine?.color || 'Blue');
  const [shape, setShape] = useState<PillShape>(initialMedicine?.shape || 'Round');
  const [category, setCategory] = useState(initialMedicine?.category || 'Diabetes Tablet');
  const [mealTiming, setMealTiming] = useState<MealTiming>(initialMedicine?.mealTiming || 'After Food');
  const [times, setTimes] = useState<string[]>(initialMedicine?.times || ['08:00 AM', '02:00 PM']);
  const [frequency, setFrequency] = useState<RecurrenceType>(initialMedicine?.frequency || 'Daily');
  const [stockCount, setStockCount] = useState(initialMedicine?.stockCount || 30);
  const [lowStockThreshold, setLowStockThreshold] = useState(initialMedicine?.lowStockThreshold || 10);
  const [notes, setNotes] = useState(initialMedicine?.notes || 'Take with water after breakfast/lunch.');
  const [isListening, setIsListening] = useState(false);

  const colors: { name: PillColor; hex: string }[] = [
    { name: 'White', hex: 'bg-slate-100 border-slate-300' },
    { name: 'Blue', hex: 'bg-blue-600 border-blue-700' },
    { name: 'Pink', hex: 'bg-pink-500 border-pink-600' },
    { name: 'Yellow', hex: 'bg-amber-400 border-amber-500' },
    { name: 'Orange', hex: 'bg-orange-500 border-orange-600' },
    { name: 'Green', hex: 'bg-emerald-600 border-emerald-700' },
    { name: 'Red', hex: 'bg-rose-600 border-rose-700' },
    { name: 'Peach', hex: 'bg-orange-200 border-orange-300' },
    { name: 'Brown', hex: 'bg-amber-800 border-amber-900' },
    { name: 'Purple', hex: 'bg-purple-600 border-purple-700' },
  ];

  const shapes: PillShape[] = ['Round', 'Oval', 'Capsule', 'Square', 'Syrup', 'Triangle'];

  const mealOptions: MealTiming[] = [
    'After Food',
    'Before Food',
    'With Food',
    'After Dinner',
    'Empty Stomach',
    'Bedtime',
  ];

  const standardTimes = ['08:00 AM', '02:00 PM', '08:00 PM', '10:00 PM'];

  const toggleTime = (t: string) => {
    playTapSound();
    if (times.includes(t)) {
      if (times.length > 1) {
        setTimes(times.filter((item) => item !== t));
      }
    } else {
      setTimes([...times, t]);
    }
  };

  const handleVoiceInputName = () => {
    playTapSound();
    setIsListening(true);

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechClass();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setName(spoken);
        setIsListening(false);
        speakText(`Added medicine name: ${spoken}`);
      };

      recognition.onerror = () => {
        setIsListening(false);
        const fallback = prompt('Enter medicine name by voice/text:', 'Metformin 500mg');
        if (fallback) setName(fallback);
      };

      recognition.start();
    } else {
      setIsListening(false);
      const fallback = prompt('Speech recognition not available. Please enter name:', 'Metformin 500mg');
      if (fallback) setName(fallback);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();

    const newMed: Medicine = {
      id: initialMedicine?.id || `med_${Date.now()}`,
      name: name || 'New Medicine',
      dosage,
      type,
      color,
      shape,
      category,
      mealTiming,
      instructions: [
        `Take ${dosage} ${mealTiming.toLowerCase()}.`,
        'Drink a full glass of water.',
        'Do not skip this scheduled dose.',
      ],
      times,
      frequency,
      stockCount,
      lowStockThreshold,
      expiryDate: initialMedicine?.expiryDate || '2027-06-30',
      isEssential: true,
      notes,
    };

    speakText(`${name} saved successfully! Reminders are set.`, { volume: 'loud' });
    onSave(newMed);
  };

  return (
    <div
      id="medicare-add-medicine-screen"
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
            <h1 className="text-2xl font-black text-slate-900">
              {isEditing ? 'Edit Medicine' : 'Add Medicine'}
            </h1>
            <p className="text-xs font-semibold text-slate-700">Set visual cues and reminder times</p>
          </div>
        </div>

        <div className="p-2 bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
          <PillIcon color={color} shape={shape} size="md" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Medicine Name with Voice Input */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-2">
          <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
            Medicine Name <span className="text-rose-600">*</span>
          </label>
          <div className="relative flex items-center gap-2">
            <input
              id="input-medicine-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Metformin, Amlodipine, Vitamin D3"
              className="flex-1 px-4 py-3.5 rounded-2xl border-2 border-slate-300 text-slate-900 font-black text-lg focus:border-blue-600 outline-none"
              required
            />
            <button
              type="button"
              id="btn-voice-name-input"
              onClick={handleVoiceInputName}
              title="Speak Medicine Name"
              className={`p-3.5 rounded-2xl border-2 transition-all ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                  : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[11px] font-semibold text-slate-700">
            Tip: Tap the microphone to say the medicine name aloud.
          </p>
        </div>

        {/* 2. Color Selection (Helps seniors identify pills) */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
              1. Medicine Color
            </label>
            <span className="text-xs font-bold text-blue-700">Selected: {color}</span>
          </div>

          <div className="grid grid-cols-5 gap-2.5">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  playTapSound();
                  setColor(c.name);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all ${
                  color === c.name
                    ? 'border-blue-600 bg-blue-50/50 shadow-md scale-105'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border-2 ${c.hex} shadow-xs relative flex items-center justify-center`}>
                  {color === c.name && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                </div>
                <span className="text-[10px] font-extrabold text-slate-700 mt-1">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Shape Selection */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
              2. Medicine Shape / Form
            </label>
            <span className="text-xs font-bold text-blue-700">Selected: {shape}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {shapes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  playTapSound();
                  setShape(s);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 transition-all ${
                  shape === s
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-black shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50'
                }`}
              >
                <PillIcon color={color} shape={s} size="sm" />
                <span className="text-xs">{s}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Dosage & Meal Timing */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <label className="text-xs font-black uppercase text-slate-700 tracking-wider block">
            3. Dosage & Instructions
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">Dosage</span>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="1 Tablet, 500mg, 10ml"
                className="w-full px-3.5 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold focus:border-blue-600 outline-none text-sm"
                required
              />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">How to take</span>
              <select
                value={mealTiming}
                onChange={(e) => setMealTiming(e.target.value as MealTiming)}
                className="w-full px-3 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold bg-white focus:border-blue-600 outline-none text-sm"
              >
                {mealOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 5. Reminder Timings */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>4. Reminder Times</span>
            </label>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {times.length} selected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {standardTimes.map((t) => {
              const isSelected = times.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTime(t)}
                  className={`p-3 rounded-2xl border-2 font-black text-sm flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{t}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Stock Count & Refill Alert */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <label className="text-xs font-black uppercase text-slate-700 tracking-wider block">
            5. Stock Count & Low Stock Alert
          </label>

          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Remaining Tablets</span>
              <span className="text-2xl font-black text-slate-900">{stockCount}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStockCount(Math.max(0, stockCount - 1))}
                className="w-10 h-10 rounded-xl bg-white border-2 border-slate-300 flex items-center justify-center font-bold text-slate-700 text-lg hover:bg-slate-100 active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setStockCount(stockCount + 5)}
                className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg hover:bg-blue-700 active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-white border-2 border-slate-300 text-slate-800 font-bold py-4 rounded-2xl hover:bg-slate-100 transition-colors text-center"
          >
            Cancel
          </button>

          <button
            id="btn-save-medicine"
            type="submit"
            className="flex-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-lg font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <Save className="w-5 h-5" />
            <span>{isEditing ? 'Update Medicine' : 'Save Medicine'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
