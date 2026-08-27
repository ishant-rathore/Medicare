import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Calendar,
  Sun,
  Sunset,
  Moon,
  ChevronRight,
  Pill,
} from 'lucide-react';
import { DoseEvent, UserProfile, AppView } from '../types';
import { PillIcon } from './PillIcon';
import { speakText, playTapSound } from '../utils/audio';

interface DailyTimelineViewProps {
  doses: DoseEvent[];
  user: UserProfile;
  onNavigate: (view: AppView) => void;
  onSelectDose: (dose: DoseEvent) => void;
  onToggleStatus: (doseId: string) => void;
  onTriggerAlarm: (dose: DoseEvent) => void;
}

export const DailyTimelineView: React.FC<DailyTimelineViewProps> = ({
  doses,
  user,
  onNavigate,
  onSelectDose,
  onToggleStatus,
  onTriggerAlarm,
}) => {
  const takenCount = doses.filter((d) => d.status === 'taken').length;
  const totalCount = doses.length || 1;
  const percent = Math.round((takenCount / totalCount) * 100);

  const periods: { name: 'Morning' | 'Afternoon' | 'Evening' | 'Night'; timeSpan: string; icon: any }[] = [
    { name: 'Morning', timeSpan: '7:00 AM - 10:00 AM', icon: Sun },
    { name: 'Afternoon', timeSpan: '12:00 PM - 4:00 PM', icon: Sun },
    { name: 'Evening', timeSpan: '4:00 PM - 8:00 PM', icon: Sunset },
    { name: 'Night', timeSpan: '8:00 PM - 11:00 PM', icon: Moon },
  ];

  const handlePlayAllDailyMedicines = () => {
    const listDescription = doses
      .map((d) => `${d.period}: ${d.pillColor} ${d.medicineName} at ${d.scheduledTime} (${d.status})`)
      .join('. ');
    speakText(`${user.nickname || 'Grandpa'}, here is your medicine schedule for today: ${listDescription}`, {
      rate: 'normal',
      volume: 'loud',
    });
  };

  return (
    <div
      id="medicare-daily-timeline-screen"
      className="min-h-screen bg-slate-50 pb-28 p-4 sm:p-6 max-w-lg mx-auto space-y-4 font-sans"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Today's Medicines
          </h1>
          <p className="text-xs font-medium text-slate-500">Daily medication schedule & timeline</p>
        </div>

        <button
          onClick={() => onNavigate('history')}
          className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>History</span>
        </button>
      </div>

      {/* Top Adherence Progress Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Progress Today</span>
            <span className="text-3xl font-bold text-slate-900">{percent}%</span>
            <span className="text-xs font-medium text-slate-500 block mt-0.5">
              {takenCount} of {totalCount} taken
            </span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center text-emerald-700">
            <span className="text-lg font-bold">{takenCount}/{totalCount}</span>
            <span className="text-[10px] font-semibold">Taken</span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-100">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Audio Play All Action */}
      <button
        id="btn-play-all-schedule"
        onClick={handlePlayAllDailyMedicines}
        className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-colors text-xs"
      >
        <Volume2 className="w-4 h-4 text-blue-600" />
        <span>Read Today's Schedule Aloud</span>
      </button>

      {/* Period Timeline Sections */}
      <div className="space-y-4">
        {periods.map((period) => {
          const periodDoses = doses.filter((d) => d.period === period.name);
          const Icon = period.icon;
          if (periodDoses.length === 0) return null;

          return (
            <div key={period.name} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{period.name}</h3>
                    <p className="text-[10px] font-medium text-slate-500">{period.timeSpan}</p>
                  </div>
                </div>

                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {periodDoses.length} dose{periodDoses.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-2.5">
                {periodDoses.map((dose) => {
                  const isTaken = dose.status === 'taken';
                  return (
                    <div
                      key={dose.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        isTaken
                          ? 'bg-emerald-50/50 border-emerald-200/80'
                          : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => onSelectDose(dose)}
                      >
                        <PillIcon color={dose.pillColor} shape={dose.pillShape} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                              {dose.scheduledTime}
                            </span>
                            {isTaken && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md">
                                Taken
                              </span>
                            )}
                          </div>
                          <h4
                            className={`text-sm font-bold mt-0.5 ${
                              isTaken ? 'text-slate-500 line-through' : 'text-slate-900'
                            }`}
                          >
                            {dose.medicineName}
                          </h4>
                          <p className="text-xs font-medium text-slate-500">
                            {dose.dosage} • {dose.mealTiming}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onTriggerAlarm(dose)}
                          className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors shadow-xs"
                          title="Ring Alarm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onToggleStatus(dose.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-transform active:scale-95 ${
                            isTaken
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isTaken ? 'Taken' : 'Take'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
