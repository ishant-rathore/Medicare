import React, { useState } from 'react';
import {
  Pill,
  Clock,
  Volume2,
  Calendar,
  AlertTriangle,
  ShoppingCart,
  Edit2,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  Droplet,
  Sparkles,
} from 'lucide-react';
import { Medicine } from '../types';
import { PillIcon } from './PillIcon';
import { speakText, playTapSound } from '../utils/audio';

interface MedicineDetailsViewProps {
  medicine: Medicine;
  onEdit: (med: Medicine) => void;
  onBack: () => void;
  onRefill: (medId: string, count: number) => void;
}

export const MedicineDetailsView: React.FC<MedicineDetailsViewProps> = ({
  medicine,
  onEdit,
  onBack,
  onRefill,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [refillSuccess, setRefillSuccess] = useState(false);

  const handleReadInstructionsAloud = () => {
    setIsPlayingAudio(true);
    const spoken = `${medicine.name} ${medicine.dosage}. Color is ${medicine.color}, shape is ${medicine.shape}. Instructions: ${medicine.instructions.join('. ')}. Scheduled times are: ${medicine.times.join(', ')}.`;
    speakText(spoken, {
      rate: 'normal',
      volume: 'loud',
      onEnd: () => setIsPlayingAudio(false),
    });
  };

  const handleRefillClick = () => {
    playTapSound();
    onRefill(medicine.id, 30);
    setRefillSuccess(true);
    speakText(`Refill added. 30 tablets added to your stock.`);
    setTimeout(() => setRefillSuccess(false), 2500);
  };

  return (
    <div
      id="medicare-medicine-details-screen"
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
            <h1 className="text-2xl font-black text-slate-900">Medicine Details</h1>
            <p className="text-xs font-semibold text-slate-700">View prescription & timings</p>
          </div>
        </div>

        <button
          onClick={() => onEdit(medicine)}
          className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3.5 py-2 rounded-xl text-xs font-black hover:bg-blue-100 border border-blue-200"
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>

      {/* Main Pill Visual & Hero Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
              <PillIcon color={medicine.color} shape={medicine.shape} size="lg" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{medicine.name} {medicine.dosage}</h2>
              <p className="text-xs font-bold text-slate-700">{medicine.category}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs font-extrabold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                  ● {medicine.color}
                </span>
                <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                  {medicine.shape}
                </span>
              </div>
            </div>
          </div>

          {medicine.isEssential && (
            <span className="bg-rose-100 text-rose-800 text-[11px] font-black px-2.5 py-1 rounded-xl border border-rose-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              <span>Essential</span>
            </span>
          )}
        </div>

        {/* 3 Key Badges */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-700 block">Dosage</span>
            <span className="text-xs font-black text-slate-900">{medicine.dosage}</span>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-800 block">How to take</span>
            <span className="text-xs font-black text-emerald-900">{medicine.mealTiming}</span>
          </div>
          <div className="bg-blue-50 p-2.5 rounded-2xl border border-blue-100">
            <span className="text-[10px] font-bold text-blue-800 block">With</span>
            <span className="text-xs font-black text-blue-900">Water</span>
          </div>
        </div>
      </div>

      {/* Timing Schedule */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Timing Schedule</span>
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {medicine.times.map((t, idx) => (
            <div
              key={idx}
              className="bg-blue-50/70 border-2 border-blue-200 rounded-2xl p-3 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-800 block">
                  Dose {idx + 1}
                </span>
                <span className="text-base font-black text-blue-950">{t}</span>
              </div>
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Instructions & Spoken Voice Banner */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900">Instructions</h3>
          <button
            onClick={handleReadInstructionsAloud}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              isPlayingAudio
                ? 'bg-blue-600 text-white animate-pulse shadow-md'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? 'Speaking...' : 'Listen Aloud'}</span>
          </button>
        </div>

        <ul className="space-y-2 text-sm font-semibold text-slate-700">
          {medicine.instructions.map((inst, i) => (
            <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>{inst}</span>
            </li>
          ))}
        </ul>

        {medicine.notes && (
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-950">
            Note: {medicine.notes}
          </div>
        )}
      </div>

      {/* Stock & Refill Alert Section */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-700 block">Stock Remaining</span>
            <span className="text-2xl font-black text-slate-900">{medicine.stockCount} Tablets</span>
          </div>

          <button
            onClick={handleRefillClick}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2.5 rounded-2xl text-xs shadow-md transition-transform active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Refill (+30)</span>
          </button>
        </div>

        {refillSuccess && (
          <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <span>30 tablets added to inventory!</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-700 pt-2 border-t border-slate-100">
          <span>Expires: {medicine.expiryDate}</span>
          <span className="text-emerald-700 font-bold">● Prescribed by: {medicine.prescribedBy || 'Dr. Mehta'}</span>
        </div>
      </div>

      {/* Edit Button */}
      <button
        onClick={() => onEdit(medicine)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98"
      >
        <Edit2 className="w-5 h-5" />
        <span>Edit This Medicine</span>
      </button>
    </div>
  );
};
