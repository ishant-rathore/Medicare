import React, { useState, useEffect } from 'react';
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  FileText,
  PhoneCall,
  Volume2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Activity,
  Share2,
} from 'lucide-react';
import { UserProfile, DoseEvent, Medicine, AppView } from '../types';
import { PillIcon } from './PillIcon';
import { speakText, playTapSound } from '../utils/audio';

interface DashboardViewProps {
  user: UserProfile;
  doses: DoseEvent[];
  medicines: Medicine[];
  onNavigate: (view: AppView) => void;
  onSelectDose: (dose: DoseEvent) => void;
  onToggleDoseStatus: (doseId: string) => void;
  onOpenSOS: () => void;
  onTriggerAlarm: (dose?: DoseEvent) => void;
  onOpenScanner: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  doses,
  medicines,
  onNavigate,
  onSelectDose,
  onToggleDoseStatus,
  onOpenSOS,
  onTriggerAlarm,
  onOpenScanner,
}) => {
  const [countdown, setCountdown] = useState('00:48:32');

  // Calculate taken vs total
  const todayDoses = doses;
  const takenCount = todayDoses.filter((d) => d.status === 'taken').length;
  const totalCount = todayDoses.length || 1;
  const remainingCount = totalCount - takenCount;
  const adherencePercentage = Math.round((takenCount / totalCount) * 100);

  // Helper to parse time to minutes
  const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridian = match[3]?.toUpperCase();
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Find next pending or snoozed reminder for today
  const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const pendingDoses = todayDoses.filter((d) => d.status === 'pending' || d.status === 'snoozed');
  
  // Sort pending doses by scheduled time
  const sortedPending = [...pendingDoses].sort((a, b) => {
    return parseTimeToMinutes(a.scheduledTime) - parseTimeToMinutes(b.scheduledTime);
  });

  const nextPendingDose = sortedPending.find((d) => parseTimeToMinutes(d.scheduledTime) >= currentMinutes) || sortedPending[0] || todayDoses[0];

  // Dynamic greeting based on current time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Live countdown timer based on next pending dose
  useEffect(() => {
    const updateCountdown = () => {
      if (!nextPendingDose || nextPendingDose.status === 'taken' || nextPendingDose.status === 'skipped') {
        setCountdown('00:00:00');
        return;
      }

      const now = new Date();
      let targetMs: number;

      if (nextPendingDose.status === 'snoozed' && nextPendingDose.snoozeUntil) {
        targetMs = new Date(nextPendingDose.snoozeUntil).getTime();
      } else {
        const targetMinutes = parseTimeToMinutes(nextPendingDose.scheduledTime);
        const targetDate = new Date();
        targetDate.setHours(Math.floor(targetMinutes / 60), targetMinutes % 60, 0, 0);
        targetMs = targetDate.getTime();
      }

      const diffSecs = Math.max(0, Math.floor((targetMs - now.getTime()) / 1000));
      const h = String(Math.floor(diffSecs / 3600)).padStart(2, '0');
      const m = String(Math.floor((diffSecs % 3600) / 60)).padStart(2, '0');
      const s = String(diffSecs % 60).padStart(2, '0');
      setCountdown(`${h}:${m}:${s}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextPendingDose]);

  const handleSpeakNextReminder = () => {
    if (!nextPendingDose) return;
    speakText(
      `${user.nickname || 'Grandpa'}, your next medicine is ${nextPendingDose.medicineName}, ${nextPendingDose.dosage}, scheduled for ${nextPendingDose.scheduledTime}. Please take it ${nextPendingDose.mealTiming.toLowerCase()}.`,
      { rate: 'normal', volume: 'loud' }
    );
  };

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      id="medicare-dashboard-screen"
      className="min-h-screen bg-slate-50 pb-28 p-4 sm:p-6 max-w-lg mx-auto space-y-6 font-sans"
    >
      {/* 1. Clean Minimalism Greeting Section */}
      <section className="flex flex-col gap-1.5 pt-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          {greeting}, {user.nickname || user.name.split(' ')[0]}.
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          You have {remainingCount} dose{remainingCount === 1 ? '' : 's'} remaining for today. Your vitals are looking stable.
        </p>
      </section>

      {/* 2. Today's Medication Schedule Card (Clean Minimalism Aesthetic) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Schedule Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 uppercase tracking-wider text-xs">
            Today's Medication Schedule
          </h2>
          <span className="text-xs font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            {todayDateFormatted}
          </span>
        </div>

        {/* Schedule Items List */}
        <div className="p-5 flex flex-col gap-3.5">
          {todayDoses.map((dose) => {
            const isTaken = dose.status === 'taken';
            const isDueNow = dose.id === nextPendingDose?.id && !isTaken;

            return (
              <div
                key={dose.id}
                id={`dose-item-${dose.id}`}
                className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all relative ${
                  isTaken
                    ? 'bg-slate-50 border-slate-100 opacity-60'
                    : isDueNow
                    ? 'bg-blue-50/60 border-blue-200 shadow-xs'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Due in indicator badge */}
                {isDueNow && (
                  <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-blue-500 rounded-full"></div>
                )}

                {/* Status / Pill Icon Circle */}
                <div
                  onClick={() => onSelectDose(dose)}
                  className="cursor-pointer shrink-0"
                >
                  <PillIcon color={dose.pillColor} shape={dose.pillShape} size="md" />
                </div>

                {/* Medicine Information */}
                <div
                  className="flex-1 cursor-pointer min-w-0"
                  onClick={() => onSelectDose(dose)}
                >
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-bold text-sm sm:text-base truncate ${
                        isTaken ? 'text-slate-600 line-through' : 'text-slate-900'
                      }`}
                    >
                      {dose.medicineName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {dose.dosage} • {dose.mealTiming}
                  </p>
                </div>

                {/* Scheduled Time & Action / Badge */}
                <div className="text-right shrink-0 flex items-center gap-2.5">
                  <div>
                    <p className="font-bold text-slate-800 text-xs sm:text-sm">
                      {dose.scheduledTime}
                    </p>
                    <p
                      className={`text-[11px] font-semibold uppercase tracking-wider ${
                        isTaken
                          ? 'text-green-600'
                          : isDueNow
                          ? 'text-blue-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {isTaken ? 'Taken' : isDueNow ? 'Due Soon' : 'Upcoming'}
                    </p>
                  </div>

                  {/* Quick Check Button */}
                  <button
                    id={`btn-toggle-dose-${dose.id}`}
                    onClick={() => {
                      playTapSound();
                      onToggleDoseStatus(dose.id);
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isTaken
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 shadow-xs'
                    }`}
                    title={isTaken ? 'Mark pending' : 'Mark taken'}
                  >
                    <CheckCircle2 className={`w-5 h-5 ${isTaken ? 'text-green-600' : 'text-slate-400'}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Caregiver Connection Card (Royal Blue Highlight Card from Clean Minimalism) */}
      <div className="bg-blue-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg shadow-blue-200/50 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-100">
              Caregiver Connection
            </h2>
            <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-medium">
              Live Monitoring
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center text-xl shrink-0">
              👩‍⚕️
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold truncate">Sarah Miller</p>
              <p className="text-xs text-blue-100 truncate">Primary Caregiver • Connected</p>
            </div>
            <button
              onClick={handleSpeakNextReminder}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Voice Status"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => onNavigate('caregiver')}
              className="w-full py-2.5 bg-white text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-50 transition-colors text-center"
            >
              Caregiver Mode
            </button>
            <button
              onClick={() => onTriggerAlarm(nextPendingDose)}
              className="w-full py-2.5 bg-blue-700/80 hover:bg-blue-800 text-white border border-white/20 rounded-xl font-bold text-xs transition-colors text-center"
            >
              Test Voice Alarm
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* 4. AI Prescription Scanner Banner */}
      <div
        onClick={onOpenScanner}
        className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-blue-300 shadow-sm cursor-pointer transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">AI Prescription Scanner</h3>
            <p className="text-xs text-slate-500 font-medium">
              Upload prescription slips to automatically schedule doses
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold shrink-0">
          Scan
        </div>
      </div>

      {/* 5. Quick Actions Bento Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm">
        <h2 className="font-bold text-slate-800 uppercase tracking-wider text-xs">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            id="quick-action-refills"
            onClick={() => onNavigate('medicines')}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">💊</span>
            <span className="text-xs font-bold text-slate-700">Medicines</span>
          </button>

          <button
            id="quick-action-voice"
            onClick={handleSpeakNextReminder}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🎤</span>
            <span className="text-xs font-bold text-slate-700">Voice Reminder</span>
          </button>

          <button
            id="quick-action-health-log"
            onClick={() => onNavigate('doctor-report')}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">📊</span>
            <span className="text-xs font-bold text-slate-700">Doctor Report</span>
          </button>

          <button
            id="quick-action-sos"
            onClick={onOpenSOS}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-rose-200 hover:bg-rose-50/30 transition-all group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🆘</span>
            <span className="text-xs font-bold text-rose-700">Emergency</span>
          </button>
        </div>

        {/* Refill & Adherence Status Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Compliance Rate:</span>
          <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            {adherencePercentage}% Adherence
          </span>
        </div>
      </div>
    </div>
  );
};
