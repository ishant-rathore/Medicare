import React from 'react';
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Share2,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { UserProfile, Medicine, DoseEvent, AppView } from '../types';
import { PillIcon } from './PillIcon';
import { speakText, playTapSound } from '../utils/audio';

interface AnalyticsDashboardViewProps {
  user: UserProfile;
  medicines: Medicine[];
  doses: DoseEvent[];
  onNavigate: (view: AppView) => void;
  onRefill: (medId: string) => void;
}

export const AnalyticsDashboardView: React.FC<AnalyticsDashboardViewProps> = ({
  user,
  medicines,
  doses,
  onNavigate,
  onRefill,
}) => {
  const weeklyStats = [
    { day: 'Mon', percent: 100, status: 'good' },
    { day: 'Tue', percent: 80, status: 'good' },
    { day: 'Wed', percent: 90, status: 'good' },
    { day: 'Thu', percent: 60, status: 'average' },
    { day: 'Fri', percent: 80, status: 'good' },
    { day: 'Sat', percent: 40, status: 'low' },
    { day: 'Sun', percent: 85, status: 'good' },
  ];

  const lowStockMeds = medicines.filter((m) => m.stockCount <= m.lowStockThreshold);

  return (
    <div
      id="medicare-health-analytics-screen"
      className="min-h-screen bg-slate-50 pb-28 p-4 sm:p-6 max-w-lg mx-auto space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Health Analytics
          </h1>
          <p className="text-xs font-bold text-slate-700">Your medication adherence & trends</p>
        </div>

        <button
          onClick={() => onNavigate('doctor-report')}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-2xl text-xs font-black shadow-md transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Doctor PDF</span>
        </button>
      </div>

      {/* Hero Adherence & Streak Card */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-100">
              Adherence
            </span>
            <Activity className="w-4 h-4 text-emerald-200" />
          </div>
          <div className="my-2">
            <span className="text-4xl font-black text-white">86%</span>
            <p className="text-xs font-semibold text-emerald-100 mt-0.5">
              Great job, {user.nickname || 'Grandpa'}!
            </p>
          </div>
          <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full w-fit">
            Top 15% Consistency
          </span>
        </div>

        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-100">
              On-Time Streak
            </span>
            <TrendingUp className="w-4 h-4 text-amber-300" />
          </div>
          <div className="my-2">
            <span className="text-4xl font-black text-amber-300">18 Days</span>
            <p className="text-xs font-semibold text-blue-100 mt-0.5">
              Consistent daily doses
            </p>
          </div>
          <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full w-fit">
            Keep up the habit!
          </span>
        </div>
      </div>

      {/* Weekly Completion Bar Chart */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Weekly Completion</h3>
            <p className="text-xs font-semibold text-slate-700">Dose adherence by day</p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl">
            This Week
          </span>
        </div>

        {/* CSS Bar Chart */}
        <div className="grid grid-cols-7 gap-2 items-end h-36 pt-4 border-b border-slate-100 pb-2">
          {weeklyStats.map((item) => (
            <div key={item.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-[10px] font-bold text-slate-700">{item.percent}%</span>
              <div
                className={`w-full rounded-t-xl transition-all duration-500 shadow-xs ${
                  item.percent >= 80
                    ? 'bg-emerald-500'
                    : item.percent >= 60
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
                style={{ height: `${item.percent * 0.9}%` }}
              />
              <span className="text-xs font-bold text-slate-700">{item.day}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-[11px] font-bold text-slate-700">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Good (75-100%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Average (50-74%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Low (&lt;50%)
          </span>
        </div>
      </div>

      {/* Monthly Dose Counters */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
        <h3 className="text-base font-black text-slate-900">Monthly Dose Overview</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800 block">Taken Doses</span>
              <span className="text-2xl font-black text-emerald-950">48</span>
            </div>
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-800 block">Skipped Doses</span>
              <span className="text-2xl font-black text-amber-950">4</span>
            </div>
            <Clock className="w-6 h-6 text-amber-600" />
          </div>

          <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-rose-800 block">Missed Doses</span>
              <span className="text-2xl font-black text-rose-950">6</span>
            </div>
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-800 block">Total Doses</span>
              <span className="text-2xl font-black text-blue-950">58</span>
            </div>
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Refill Reminders Widget */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
            <ShoppingCart className="w-4 h-4 text-amber-600" />
            <span>Refill Alerts</span>
          </h3>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
            {lowStockMeds.length} need refill
          </span>
        </div>

        <div className="space-y-2.5">
          {lowStockMeds.map((med) => (
            <div
              key={med.id}
              className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-3.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <PillIcon color={med.color} shape={med.shape} size="md" />
                <div>
                  <h4 className="text-sm font-black text-slate-900">{med.name} {med.dosage}</h4>
                  <p className="text-xs font-bold text-amber-900">
                    Only {med.stockCount} tablets left (Refill in 3 days)
                  </p>
                </div>
              </div>

              <button
                onClick={() => onRefill(med.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3 py-2 rounded-xl shadow-sm transition-transform active:scale-95"
              >
                Refill
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Senior Message */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-3xl p-4 border-2 border-blue-200 flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-white text-blue-600 shadow-sm shrink-0">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900">You're doing great!</h4>
          <p className="text-xs text-slate-700 font-semibold mt-0.5">
            Consistency is the key to better health. Keep it up and stay healthy!
          </p>
        </div>
      </div>
    </div>
  );
};
