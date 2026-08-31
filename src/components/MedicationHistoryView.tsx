<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
import {
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Filter,
<<<<<<< HEAD
  Volume2,
  RotateCcw,
} from 'lucide-react';
import { PillIcon } from './PillIcon';
import { DoseEvent } from '../types';
import { getDoseHistory } from '../utils/storage';
=======
} from 'lucide-react';
import { PillIcon } from './PillIcon';
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
import { playTapSound, speakText } from '../utils/audio';

interface MedicationHistoryViewProps {
  onBack: () => void;
}

export const MedicationHistoryView: React.FC<MedicationHistoryViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'Today' | 'Week' | 'Month'>('Today');
<<<<<<< HEAD
  const [records, setRecords] = useState<DoseEvent[]>(() => getDoseHistory('Today'));

  useEffect(() => {
    setRecords(getDoseHistory(activeTab));
  }, [activeTab]);

  const takenCount = records.filter((r) => r.status === 'taken').length;
  const snoozedCount = records.filter((r) => r.status === 'snoozed').length;
  const skippedCount = records.filter((r) => r.status === 'skipped').length;
  const missedCount = records.filter((r) => r.status === 'missed').length;
  const totalCount = records.length;

  const handleSpeakHistory = () => {
    playTapSound();
    const summary = `In your ${activeTab.toLowerCase()} history, you took ${takenCount} doses, skipped ${skippedCount}, snoozed ${snoozedCount}, and missed ${missedCount}, out of ${totalCount} scheduled doses.`;
    speakText(summary, { volume: 'loud' });
  };

  const formatScheduledDate = (dateStr: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateStr === todayStr) return 'Today';
    const dateObj = new Date(dateStr + 'T00:00:00');
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
=======

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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

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

<<<<<<< HEAD
        <button
          onClick={handleSpeakHistory}
          className="p-2.5 rounded-2xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors shadow-xs"
          title="Read History Summary"
        >
          <Volume2 className="w-5 h-5" />
        </button>
=======
        <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
          <Calendar className="w-5 h-5" />
        </div>
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
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
<<<<<<< HEAD
            <Clock className="w-3.5 h-3.5" /> Snoozed
          </span>
          <span className="text-xl font-black text-amber-950">{snoozedCount}</span>
        </div>

        <div className="bg-orange-50 border-2 border-orange-200 p-2.5 rounded-2xl">
          <span className="text-xs font-bold text-orange-800 flex items-center justify-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Skipped
          </span>
          <span className="text-xl font-black text-orange-950">{skippedCount}</span>
=======
            <Clock className="w-3.5 h-3.5" /> Skipped
          </span>
          <span className="text-xl font-black text-amber-950">{skippedCount}</span>
        </div>

        <div className="bg-rose-50 border-2 border-rose-200 p-2.5 rounded-2xl">
          <span className="text-xs font-bold text-rose-800 flex items-center justify-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Missed
          </span>
          <span className="text-xl font-black text-rose-950">{missedCount}</span>
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
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
<<<<<<< HEAD
        {records.map((item) => {
          const isTaken = item.status === 'taken';
          const isSnoozed = item.status === 'snoozed';
          const isSkipped = item.status === 'skipped';
          const isMissed = item.status === 'missed';

          const statusDisplay = isTaken
            ? 'TAKEN'
            : isSnoozed
            ? 'SNOOZED'
            : isSkipped
            ? 'SKIPPED'
            : isMissed
            ? 'MISSED'
            : 'PENDING';

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 border-2 border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <PillIcon color={item.pillColor} shape={item.pillShape} size="md" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">
                      {item.medicineName}
                    </h3>
                    <p className="text-xs font-bold text-slate-700">
                      {item.dosage} • {item.mealTiming}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      {formatScheduledDate(item.scheduledDate)}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1 uppercase ${
                    isTaken
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : isSnoozed
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : isSkipped
                      ? 'bg-orange-100 text-orange-900 border border-orange-300'
                      : isMissed
                      ? 'bg-rose-100 text-rose-900 border border-rose-300'
                      : 'bg-slate-100 text-slate-800 border border-slate-300'
                  }`}
                >
                  {isTaken && <CheckCircle className="w-3.5 h-3.5" />}
                  {isSnoozed && <Clock className="w-3.5 h-3.5" />}
                  {isSkipped && <XCircle className="w-3.5 h-3.5" />}
                  {isMissed && <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{statusDisplay}</span>
                </span>
              </div>

              {/* Scheduled vs Actual Time row */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Scheduled: {item.scheduledTime}</span>
                <span className={isTaken ? 'text-emerald-700' : 'text-slate-600'}>
                  {isTaken && item.actualTakenTime
                    ? `Taken At: ${item.actualTakenTime}`
                    : isSnoozed && item.snoozeUntil
                    ? `Snoozed until ${new Date(item.snoozeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : statusDisplay}
                </span>
              </div>
            </div>
          );
        })}

        {records.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No records found</h4>
            <p className="text-xs text-slate-500 mt-1">No medication history recorded for {activeTab.toLowerCase()}.</p>
          </div>
        )}
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
      </div>
    </div>
  );
};
<<<<<<< HEAD

=======
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
