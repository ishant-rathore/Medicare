import React, { useState } from 'react';
import {
  User,
  Camera,
  Calendar,
  Heart,
  Globe,
  Phone,
  Save,
  HelpCircle,
  ShieldAlert,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { UserProfile } from '../types';
import { speakText, playTapSound } from '../utils/audio';

interface ProfileSetupViewProps {
  user: UserProfile;
  onSave: (updated: UserProfile) => void;
  onBack?: () => void;
  isInitialSetup?: boolean;
}

export const ProfileSetupView: React.FC<ProfileSetupViewProps> = ({
  user,
  onSave,
  onBack,
  isInitialSetup = false,
}) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=200&auto=format&fit=crop&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    speakText('Profile saved successfully.', { volume: 'loud' });
    onSave(formData);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  return (
    <div
      id="medicare-profile-setup-screen"
      className="min-h-screen bg-slate-50 pb-24 p-4 sm:p-6 max-w-lg mx-auto"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {isInitialSetup ? 'Profile Setup' : 'Edit Profile'}
            </h1>
            <p className="text-xs font-semibold text-slate-700">Let’s personalize your Medicare companion</p>
          </div>
        </div>
        <button
          onClick={() => speakText('On this screen, you can update your name, age, blood group, and caregiver details.')}
          className="p-2 rounded-xl bg-blue-50 text-blue-700 flex items-center gap-1 text-xs font-bold"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help</span>
        </button>
      </div>

      {showSavedToast && (
        <div className="mb-4 bg-emerald-600 text-white p-3 rounded-2xl flex items-center gap-2 shadow-lg animate-fade-in font-bold text-sm">
          <CheckCircle className="w-5 h-5" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Avatar Card */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm text-center">
          <div className="relative inline-block mb-3">
            <img
              src={formData.photoUrl || avatarPresets[0]}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-600 shadow-md mx-auto"
            />
            <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-700 mb-2">Tap to choose a photo</p>
          <div className="flex justify-center gap-2">
            {avatarPresets.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFormData({ ...formData, photoUrl: url })}
                className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-transform ${
                  formData.photoUrl === url ? 'border-blue-600 scale-110 shadow-md' : 'border-transparent opacity-70'
                }`}
              >
                <img src={url} alt="Preset" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Basic Personal Info */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>Personal Information</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold focus:border-blue-600 outline-none text-base"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold focus:border-blue-600 outline-none text-base"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold bg-white focus:border-blue-600 outline-none text-base"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold bg-white focus:border-blue-600 outline-none text-base"
              >
                <option value="O+">O Positive (O+)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Language</label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                className="w-full px-3 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold bg-white focus:border-blue-600 outline-none text-sm"
              >
                <option value="en-US">English</option>
                <option value="hi-IN">Hindi (हिन्दी)</option>
                <option value="mr-IN">Marathi (मराठी)</option>
                <option value="ta-IN">Tamil (தமிழ்)</option>
                <option value="te-IN">Telugu (తెలుగు)</option>
                <option value="gu-IN">Gujarati (ગુજરાતી)</option>
                <option value="bn-IN">Bengali (বাংলা)</option>
                <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Caregiver Information Card */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Caregiver Information</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Caregiver Name</label>
            <input
              type="text"
              value={formData.caregiverName}
              onChange={(e) => setFormData({ ...formData, caregiverName: e.target.value })}
              placeholder="e.g. Anita Sharma"
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold focus:border-blue-600 outline-none text-base"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Caregiver Phone</label>
              <input
                type="tel"
                value={formData.caregiverPhone}
                onChange={(e) => setFormData({ ...formData, caregiverPhone: e.target.value })}
                placeholder="+91 98765 43211"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold focus:border-blue-600 outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
              <input
                type="text"
                value={formData.caregiverRelation}
                onChange={(e) => setFormData({ ...formData, caregiverRelation: e.target.value })}
                placeholder="e.g. Daughter"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold focus:border-blue-600 outline-none text-sm"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-xs text-blue-900 font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Caregivers will be notified if you repeatedly miss your scheduled medicines.</span>
          </div>
        </div>

        {/* Save Button */}
        <button
          id="btn-save-profile"
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xl font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <Save className="w-6 h-6" />
          <span>Save Profile</span>
        </button>
      </form>
    </div>
  );
};
