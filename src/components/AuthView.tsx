import React, { useState } from 'react';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  User,
  Globe,
  Heart,
  ShieldCheck,
  ArrowLeft,
  Pill,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { speakText, playTapSound } from '../utils/audio';
import { UserProfile } from '../types';

interface AuthViewProps {
  mode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
  onSuccess: (profile?: Partial<UserProfile>) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ mode, onSwitchMode, onSuccess }) => {
  const [phone, setPhone] = useState('+91 98765 43210');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [fullName, setFullName] = useState('Ramesh Kumar');
  const [language, setLanguage] = useState('en-US');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98765 43211');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    if (!phone) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    speakText('Logging you into Medicare. Welcome back!', { volume: 'loud' });
    onSuccess({
      phone,
      name: 'Ramesh Kumar',
      nickname: 'Grandpa',
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    if (!fullName || !phone) {
      setErrorMsg('Please fill in your name and phone number.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    speakText(`Account created for ${fullName}. Welcome to Medicare!`, { volume: 'loud' });
    onSuccess({
      name: fullName,
      nickname: fullName.split(' ')[0],
      phone,
      preferredLanguage: language,
      caregiverPhone: emergencyPhone,
    });
  };

  return (
    <div
      id="medicare-auth-screen"
      className="min-h-screen bg-slate-50 flex flex-col justify-center p-4 sm:p-6 max-w-md mx-auto"
    >
      {/* Top Header Card */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-lg mb-3">
          <Pill className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-black text-blue-950 tracking-tight">Medicare</h1>
        <p className="text-sm font-semibold text-slate-700 mt-1">Your Trusted Voice Medication Companion</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-slate-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-black text-slate-900">
            {mode === 'login' ? 'Senior Login' : 'Create Account'}
          </h2>
          <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full">
            {mode === 'login' ? 'Easy Sign-in' : 'New User'}
          </span>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-rose-50 border-2 border-rose-300 text-rose-800 p-3 rounded-2xl text-sm font-bold">
            {errorMsg}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-black text-slate-800 mb-1.5">
                Phone Number <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  id="input-login-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-300 text-slate-900 text-lg font-bold focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-black text-slate-800 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="input-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 border-slate-300 text-slate-900 text-lg font-bold focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-700 hover:text-slate-900"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => speakText('To reset your password, contact your caregiver or tap help.')}
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              id="btn-auth-login"
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xl font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <LogIn className="w-6 h-6" />
              <span>Login</span>
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 font-black text-slate-700">OR</span>
              </div>
            </div>

            {/* Register Switch Button */}
            <button
              id="btn-auth-switch-register"
              type="button"
              onClick={() => {
                playTapSound();
                onSwitchMode('register');
              }}
              className="w-full bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-lg font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create New Account</span>
            </button>

            {/* Demo One-Click Google Login */}
            <button
              type="button"
              onClick={() => {
                playTapSound();
                onSuccess();
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <span>Continue with Google / Quick Demo</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Ramesh Kumar"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold focus:border-blue-600 outline-none"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +91 98765 43210"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold focus:border-blue-600 outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold focus:border-blue-600 outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold focus:border-blue-600 outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Preferred Spoken Language</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                  <Globe className="w-5 h-5" />
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold bg-white focus:border-blue-600 outline-none"
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

            {/* Emergency Contact */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">Caregiver / Emergency Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-600">
                  <Heart className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="Caregiver phone number"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-300 text-slate-900 font-bold focus:border-blue-600 outline-none"
                  required
                />
              </div>
            </div>

            {/* Create Account Button */}
            <button
              id="btn-auth-register"
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98 mt-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Account</span>
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={() => onSwitchMode('login')}
              className="w-full text-center text-xs font-extrabold text-slate-700 hover:text-blue-700 py-1"
            >
              Already have an account? Sign In
            </button>
          </form>
        )}

        {/* Security Reassurance Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Your medical data is safe & private on this device.</span>
        </div>
      </div>
    </div>
  );
};
