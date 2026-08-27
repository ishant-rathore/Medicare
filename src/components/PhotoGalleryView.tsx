import React, { useState } from 'react';
import {
  Camera,
  ArrowLeft,
  Volume2,
  Filter,
  Pill,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { Medicine } from '../types';
import { PillIcon } from './PillIcon';
import { speakText, playTapSound } from '../utils/audio';

interface PhotoGalleryViewProps {
  medicines: Medicine[];
  onBack: () => void;
  onSelectMedicine: (med: Medicine) => void;
}

export const PhotoGalleryView: React.FC<PhotoGalleryViewProps> = ({
  medicines,
  onBack,
  onSelectMedicine,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('All');

  const colorFilters = ['All', 'Blue', 'White', 'Pink', 'Red', 'Yellow', 'Green'];

  const filtered = medicines.filter(
    (m) => selectedColor === 'All' || m.color.toLowerCase() === selectedColor.toLowerCase()
  );

  const handleSpeakMed = (med: Medicine, e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(`This is your ${med.color} ${med.name}, ${med.dosage}. Take ${med.mealTiming.toLowerCase()}.`, {
      rate: 'normal',
      volume: 'loud',
    });
  };

  return (
    <div
      id="medicare-photo-gallery-screen"
      className="min-h-screen bg-slate-50 pb-28 p-4 sm:p-6 max-w-lg mx-auto space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Photo Pill Gallery</h1>
            <p className="text-xs font-semibold text-slate-700">Identify your pills visually</p>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
          <Camera className="w-5 h-5" />
        </div>
      </div>

      {/* Senior Help Banner */}
      <div className="bg-blue-50 border-2 border-blue-200 p-3.5 rounded-3xl flex items-center gap-2 text-xs font-bold text-blue-900">
        <Info className="w-4 h-4 text-blue-700 shrink-0" />
        <span>Tap any pill card to hear its name, dosage, and meal schedule spoken aloud.</span>
      </div>

      {/* Color Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {colorFilters.map((c) => (
          <button
            key={c}
            onClick={() => {
              playTapSound();
              setSelectedColor(c);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-colors ${
              selectedColor === c
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Visual 2-Column Pill Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((med) => (
          <div
            key={med.id}
            onClick={() => onSelectMedicine(med)}
            className="bg-white rounded-3xl p-4 border-2 border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            {/* Pill Display */}
            <div className="w-full h-24 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 relative shadow-inner">
              <PillIcon color={med.color} shape={med.shape} size="lg" />
              <button
                onClick={(e) => handleSpeakMed(med, e)}
                className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white text-blue-700 shadow-sm hover:bg-blue-50 border border-slate-200"
                title="Speak Pill Details"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pill Details */}
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  {med.color}
                </span>
                <span className="text-[10px] font-bold text-slate-700">{med.shape}</span>
              </div>

              <h3 className="text-base font-black text-slate-900 mt-1 leading-tight">{med.name}</h3>
              <p className="text-xs font-bold text-slate-700">{med.dosage}</p>
              <p className="text-[11px] font-semibold text-emerald-800 mt-0.5">{med.mealTiming}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-extrabold text-blue-800">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-600" /> {med.times[0] || '08:00 AM'}
              </span>
              <span className="text-slate-700">{med.stockCount} left</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
