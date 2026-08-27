import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { PillIcon } from './PillIcon';
import { playTapSound, speakText } from '../utils/audio';

interface MedicationHistoryViewProps {
  onBack: () => void;
}

export const MedicationHistoryView: React.FC<MedicationHistoryViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'Today' | 'Week' | 'Month'>('Today');

  const historyRecords = [
    {
      id: 'hist_01',
      name: 'Metformin 500mg',
      dosage: '1 Tablet • After Food',
      color: 'Blue',
      shape: 'Round',
      scheduledTime: '08:00 AM',
      actualTime: '08:02 AM',
      status: 'TAKEN',
      date: 'Today, 27 Aug 2026',
    },
    {
      id: 'hist_02',
      name: 'Amlodipine 5mg',
      dosage: '1 Tablet • After Food',
      color: 'White',
      shape: 'Oval',
      scheduledTime: '08:00 AM',
      actualTime: '08:05 AM',
      status: 'TAKEN',
      date: 'Today, 27 Aug 2026',
    },
    {
      id: 'hist_03',
      name: 'Vitamin D3',
      dosage: '1 Capsule • After Dinner',
      color: 'Red',
      shape: 'Capsule',
      scheduledTime: '08:00 PM',
      actualTime: '08:01 PM',
      status: 'SKIPPED',
      date: 'Yesterday, 26 Aug 2026',
    },
    {
      id: 'hist_04',
      name: 'Calcium 500mg',
      dosage: '1 Tablet • After Food',
      color: 'Yellow',
      shape: 'Round',
      scheduledTime: '10:00 PM',
      actualTime: '--',
      status: 'MISSED',
      date: '25 Aug 2026',
    },
    {
      id: 'hist_05',
      name: 'Omega 3 / Supplement',
      dosage: '1 Capsule • After Food',
      color: 'Green',
      shape: 'Capsule',
      scheduledTime: '09:30 PM',
      actualTime: '09:32 PM',
      status: 'TAKEN',
      date: '24 Aug 2026',
    },
  ];

  const takenCount = historyRecords.filter((r) => r.status === 'TAKEN').length;
  const skippedCount = historyRecords.filter((r) => r.status === 'SKIPPED').length;
  const missedCount = historyRecords.filter((r) => r.status === 'MISSED').length;
  const totalCount = historyRecords.length;

  return (
    <div
      id="medicare-medication-history-screen"
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
            <h1 className="text-2xl font-black text-slate-900">Medication History</h1>
            <p className="text-xs font-semibold text-slate-700">Track your past medicine intake</p>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
          <Calendar className="w-5 h-5" />
        </div>
      </div>

      {/* Filter Tabs: Today / Week / Month */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl">
        {(['Today', 'Week', 'Month'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              playTapSound();
              setActiveTab(tab);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === tab
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-emerald-50 border-2 border-emerald-200 p-2.5 rounded-2xl">
          <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Taken
          </span>
          <span className="text-xl font-black text-emerald-950">{takenCount}</span>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 p-2.5 rounded-2xl">
          <span className="text-xs font-bold text-amber-800 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Skipped
          </span>
          <span className="text-xl font-black text-amber-950">{skippedCount}</span>
        </div>

        <div className="bg-rose-50 border-2 border-rose-200 p-2.5 rounded-2xl">
          <span className="text-xs font-bold text-rose-800 flex items-center justify-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Missed
          </span>
          <span className="text-xl font-black text-rose-950">{missedCount}</span>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 p-2.5 rounded-2xl">
          <span className="text-xs font-bold text-blue-800 flex items-center justify-center gap-1">
            Total
          </span>
          <span className="text-xl font-black text-blue-950">{totalCount}</span>
        </div>
      </div>

      {/* History Record Cards */}
      <div className="space-y-3">
        {historyRecords.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-4 border-2 border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100">
                  <PillIcon color={item.color} shape={item.shape} size="md" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">{item.name}</h3>
                  <p className="text-xs font-bold text-slate-700">{item.dosage}</p>
                  <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{item.date}</p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1 ${
                  item.status === 'TAKEN'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : item.status === 'SKIPPED'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}
              >
                {item.status === 'TAKEN' && <CheckCircle className="w-3.5 h-3.5" />}
                {item.status === 'SKIPPED' && <Clock className="w-3.5 h-3.5" />}
                {item.status === 'MISSED' && <XCircle className="w-3.5 h-3.5" />}
                <span>{item.status}</span>
              </span>
            </div>

            {/* Scheduled vs Actual Time row */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Scheduled: {item.scheduledTime}</span>
              <span className={item.status === 'TAKEN' ? 'text-emerald-700' : 'text-slate-700'}>
                {item.status === 'TAKEN' ? `Taken At: ${item.actualTime}` : item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
