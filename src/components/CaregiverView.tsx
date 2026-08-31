import React, { useState } from 'react';
import {
  Heart,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bell,
  ShieldAlert,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Activity,
  Plus,
} from 'lucide-react';
import { UserProfile, DoseEvent, Medicine, AppView } from '../types';
import { PillIcon } from './PillIcon';
import { playTapSound, speakText } from '../utils/audio';

interface CaregiverViewProps {
  user: UserProfile;
  medicines: Medicine[];
  doses: DoseEvent[];
  onNavigate: (view: AppView) => void;
  onCallSenior: () => void;
}

export const CaregiverView: React.FC<CaregiverViewProps> = ({
  user,
  medicines,
  doses,
  onNavigate,
  onCallSenior,
}) => {
  const [notifyOnMiss, setNotifyOnMiss] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [messageSent, setMessageSent] = useState(false);

  const takenCount = doses.filter((d) => d.status === 'taken').length;
  const totalCount = doses.length || 1;
  const adherenceRate = Math.round((takenCount / totalCount) * 100);

  const handleSendMessage = () => {
    playTapSound();
    setMessageSent(true);
    speakText(`Gentle reminder message sent to ${user.name}.`);
    setTimeout(() => setMessageSent(false), 3000);
  };

  return (
    <div
      id="medicare-caregiver-screen"
      className="min-h-screen bg-slate-50 pb-28 p-4 sm:p-6 max-w-lg mx-auto space-y-5 font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100">
            Caregiver Mode
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1.5">
            Patient Monitoring
          </h1>
        </div>

        <div className="p-2.5 rounded-2xl bg-white text-blue-600 border border-slate-200 shadow-xs">
          <Heart className="w-5 h-5 fill-blue-600 text-blue-600" />
        </div>
      </div>

      {/* Patient Profile & Quick Connect Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={user.photoUrl}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-600 shadow-xs"
          />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
            <p className="text-xs font-medium text-slate-500">
              {user.age} Yrs • {user.gender} • Blood: {user.bloodGroup}
            </p>
            <p className="text-xs text-blue-700 font-semibold mt-0.5">
              Conditions: Hypertension, Type 2 Diabetes
            </p>
          </div>
        </div>

        {/* Quick Communication Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              playTapSound();
              onCallSenior();
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Patient</span>
          </button>

          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Reminder</span>
          </button>
        </div>

        {messageSent && (
          <div className="bg-blue-50 border border-blue-200 text-blue-900 text-xs p-2.5 rounded-xl font-medium text-center">
            Message sent: "Hi Grandpa, please remember to take your afternoon tablet!"
          </div>
        )}
      </div>

      {/* Emergency Alert Banner */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-4 text-rose-950 space-y-2">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">High Priority Alert</h4>
            <p className="text-xs font-medium text-rose-800 mt-0.5">
              Rajesh has missed his blood pressure medicine (Amlodipine 5mg) once yesterday.
            </p>
          </div>
        </div>
      </div>

      {/* Today's Medication Status */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Today's Dose Compliance</h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
            {takenCount} of {totalCount} Taken ({adherenceRate}%)
          </span>
        </div>

        <div className="space-y-2">
          {doses.map((d) => (
            <div
              key={d.id}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <PillIcon color={d.pillColor} shape={d.pillShape} size="sm" />
                <div>
                  <span className="font-bold text-slate-900 block">{d.medicineName}</span>
                  <span className="text-slate-500 font-medium">{d.scheduledTime} • {d.mealTiming}</span>
                </div>
              </div>

              <span
                className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                  d.status === 'taken'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {d.status === 'taken' ? '✓ Taken' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Remote Action: Add Medicine on Behalf */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Remote Medicine Management</h3>
            <p className="text-xs font-medium text-slate-500">Add or edit your parent's schedule</p>
          </div>
          <button
            onClick={() => onNavigate('add-medicine')}
            className="p-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Med</span>
          </button>
        </div>
      </div>

      {/* Caregiver Notification Preferences */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <span>Alert Notifications</span>
        </h3>

        <div className="space-y-2.5 text-xs font-medium text-slate-700">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 cursor-pointer transition-colors">
            <span>Alert me immediately if dose is missed (&gt;30 mins)</span>
            <input
              type="checkbox"
              checked={notifyOnMiss}
              onChange={(e) => setNotifyOnMiss(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 cursor-pointer transition-colors">
            <span>Send SMS alerts to caregiver phone</span>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 cursor-pointer transition-colors">
            <span>Daily 9:00 PM Adherence Summary Digest</span>
            <input
              type="checkbox"
              checked={dailyDigest}
              onChange={(e) => setDailyDigest(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
