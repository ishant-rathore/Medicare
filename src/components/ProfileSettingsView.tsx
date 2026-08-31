import React, { useState } from 'react';
import {
  User,
  Settings,
  Volume2,
  Globe,
  Sliders,
  Type,
  Moon,
  Sun,
  Shield,
  Heart,
  Phone,
  LogOut,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { UserProfile, AccessibilitySettings, AppView } from '../types';
import { speakText, playTapSound, playChime } from '../utils/audio';

interface ProfileSettingsViewProps {
  user: UserProfile;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: AccessibilitySettings) => void;
  onUpdateUser: (newUser: UserProfile) => void;
  onNavigate: (view: AppView) => void;
  onResetData: () => void;
  onLogout?: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  user,
  settings,
  onUpdateSettings,
  onUpdateUser,
  onNavigate,
  onResetData,
  onLogout,
}) => {
  const [localSettings, setLocalSettings] = useState<AccessibilitySettings>(settings);
  const [showToast, setShowToast] = useState(false);

  const languages = [
    { code: 'en-US', label: 'English (US/UK)' },
    { code: 'hi-IN', label: 'Hindi (हिन्दी)' },
    { code: 'mr-IN', label: 'Marathi (मराठी)' },
    { code: 'ta-IN', label: 'Tamil (தமிழ்)' },
    { code: 'te-IN', label: 'Telugu (తెలుగు)' },
    { code: 'gu-IN', label: 'Gujarati (ગુજરાતી)' },
    { code: 'bn-IN', label: 'Bengali (বাংলা)' },
    { code: 'kn-IN', label: 'Kannada (ಕನ್ನಡ)' },
  ];

  const handleUpdate = (updated: Partial<AccessibilitySettings>) => {
    playTapSound();
    const merged = { ...localSettings, ...updated };
    setLocalSettings(merged);
    onUpdateSettings(merged);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleTestVoice = (
    lang: string = 'en-US',
    rate: 'slow' | 'normal' | 'fast' = 'normal',
    vol: 'soft' | 'normal' | 'loud' = 'normal'
  ) => {
    playChime();
    const mappedVol = vol === 'soft' ? ('low' as const) : vol === 'normal' ? ('medium' as const) : ('loud' as const);
    speakText(
      `Hello ${user.nickname || 'Grandpa'}! This is a test of Medicare voice reminders at ${rate} speed and ${vol} volume.`,
      { language: lang, rate, volume: mappedVol }
    );
  };

  return (
    <div
      id="medicare-settings-screen"
      className="min-h-screen bg-slate-50 pb-28 p-4 sm:p-6 max-w-lg mx-auto space-y-4 font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Settings & Access
          </h1>
          <p className="text-xs font-medium text-slate-500">Customize voice, text size & alerts</p>
        </div>

        <button
          onClick={() => speakText('Settings allow you to adjust text size, voice speed, and spoken language.')}
          className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Help</span>
        </button>
      </div>

      {showToast && (
        <div className="bg-emerald-600 text-white p-3 rounded-2xl flex items-center gap-2 font-medium text-xs shadow-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Preferences updated!</span>
        </div>
      )}

      {/* User Profile Summary Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img
            src={user.photoUrl}
            alt={user.name}
            className="w-13 h-13 rounded-full object-cover border-2 border-blue-600 shadow-xs"
          />
          <div>
            <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
            <p className="text-xs font-medium text-slate-500">{user.phone}</p>
            <p className="text-[11px] font-semibold text-blue-600 mt-0.5">
              Caregiver: {user.caregiverName} ({user.caregiverRelation})
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('profile-setup')}
          className="text-xs font-semibold bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs transition-colors"
        >
          Edit
        </button>
      </div>

      {/* 1. Font Size (Senior Accessibility) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <Type className="w-4 h-4 text-blue-600" />
            <span>Text Size for Readability</span>
          </label>
          <span className="text-xs font-semibold text-blue-600 capitalize">
            {localSettings.fontSize}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['normal', 'large', 'extra-large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => handleUpdate({ fontSize: size })}
              className={`py-2.5 px-2 rounded-2xl border font-bold transition-all text-center ${
                localSettings.fontSize === size
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100'
              }`}
            >
              <span className={size === 'extra-large' ? 'text-base' : size === 'large' ? 'text-sm' : 'text-xs'}>
                {size === 'extra-large' ? 'XL Huge' : size === 'large' ? 'Large' : 'Normal'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Voice Reminder Settings */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span>Spoken Voice Announcements</span>
          </h3>

          <button
            onClick={() =>
              handleTestVoice(
                localSettings.language,
                localSettings.voiceSpeed,
                localSettings.alarmVolume
              )
            }
            className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl hover:bg-blue-100 border border-blue-100 transition-colors"
          >
            Test Voice 🔊
          </button>
        </div>

        {/* Spoken Language */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Spoken Language</label>
          <select
            value={localSettings.language}
            onChange={(e) => {
              handleUpdate({ language: e.target.value });
              onUpdateUser({ ...user, preferredLanguage: e.target.value });
            }}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-slate-900 font-medium bg-white focus:border-blue-600 outline-none text-sm shadow-xs"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Voice Speed */}
        <div>
          <span className="block text-xs font-semibold text-slate-700 mb-1.5">Voice Speech Speed</span>
          <div className="grid grid-cols-3 gap-2">
            {(['slow', 'normal', 'fast'] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => handleUpdate({ voiceSpeed: spd })}
                className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                  localSettings.voiceSpeed === spd
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100'
                }`}
              >
                {spd === 'slow' ? 'Slow (0.8x)' : spd === 'normal' ? 'Normal (1x)' : 'Fast (1.2x)'}
              </button>
            ))}
          </div>
        </div>

        {/* Alarm Volume */}
        <div>
          <span className="block text-xs font-semibold text-slate-700 mb-1.5">Alarm Bell & Siren Volume</span>
          <div className="grid grid-cols-3 gap-2">
            {(['soft', 'normal', 'loud'] as const).map((vol) => (
              <button
                key={vol}
                onClick={() => handleUpdate({ alarmVolume: vol })}
                className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                  localSettings.alarmVolume === vol
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100'
                }`}
              >
                {vol === 'soft' ? 'Soft' : vol === 'normal' ? 'Medium' : 'Loud (100%)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Safety & Hardware Toggles */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Safety & Senior Automation</span>
        </h3>

        <div className="space-y-2 text-xs font-medium text-slate-700">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 cursor-pointer transition-colors">
            <span>Shake phone to trigger Emergency SOS</span>
            <input
              type="checkbox"
              checked={localSettings.shakeToSOS}
              onChange={(e) => handleUpdate({ shakeToSOS: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 cursor-pointer transition-colors">
            <span>Always speak instructions when reminder rings</span>
            <input
              type="checkbox"
              checked={localSettings.voiceAlertsEnabled}
              onChange={(e) => handleUpdate({ voiceAlertsEnabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* 4. Quick Nav Links & Reset */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
        <button
          onClick={() => onNavigate('emergency-contacts')}
          className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl font-semibold text-xs flex items-center justify-between border border-slate-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-600" /> Manage Emergency Contacts
          </span>
          <span>→</span>
        </button>

        <button
          onClick={() => onNavigate('caregiver-mode')}
          className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl font-semibold text-xs flex items-center justify-between border border-slate-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-blue-600" /> Caregiver Remote Monitoring Mode
          </span>
          <span>→</span>
        </button>

        {onLogout && (
          <button
            id="btn-settings-logout"
            onClick={() => {
              playTapSound();
              if (confirm('Are you sure you want to log out of Medicare?')) {
                speakText('Logging you out of Medicare. Have a healthy day!');
                onLogout();
              }
            }}
            className="w-full p-3.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        )}

        <button
          onClick={() => {
            playTapSound();
            if (confirm('Reset all local data back to default medicines and reminders?')) {
              onResetData();
            }
          }}
          className="w-full p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-colors mt-1"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Local Demo Data</span>
        </button>
      </div>
    </div>
  );
};
