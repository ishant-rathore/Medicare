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
  Loader2,
  Sparkles,
} from 'lucide-react';
import { speakText, playTapSound } from '../utils/audio';
import { UserProfile } from '../types';
import { loginWithEmailOrPhone, registerWithEmailOrPhone, setDemoMode } from '../services/firebaseAuth';
import { apiClient } from '../services/apiClient';

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
  const [isLoading, setIsLoading] = useState(false);

  const getFriendlyErrorMessage = (error: any): string => {
    const code = error?.code || error?.message || '';
    if (code.includes('user-not-found') || code.includes('invalid-credential')) {
      return 'Account not found or password incorrect. If you are new, tap "Create New Account" below.';
    }
    if (code.includes('wrong-password')) {
      return 'Incorrect password. Please re-enter your password.';
    }
    if (code.includes('email-already-in-use')) {
      return 'An account with this phone/email already exists. Please tap "Login" to sign in.';
    }
    if (code.includes('weak-password')) {
      return 'Password should be at least 6 characters long.';
    }
    if (code.includes('network-request-failed')) {
      return 'Network connection issue. Please check your internet and try again.';
    }
    return error?.message || 'Authentication error. Please check your details and try again.';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    setErrorMsg('');

    if (!phone.trim()) {
      setErrorMsg('Please enter your phone number or email.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    try {
      setIsLoading(true);
      const { user: fbUser } = await loginWithEmailOrPhone(phone, password);
      
      // Fetch verified user profile from backend with Firebase ID Token
      let profileData: Partial<UserProfile> = {
        name: fbUser.displayName || 'Ramesh Kumar',
        nickname: fbUser.displayName ? fbUser.displayName.split(' ')[0] : 'Grandpa',
        phone: phone.trim(),
        preferredLanguage: language,
      };

      try {
        const verifyRes = await apiClient.verifySession();
        if (verifyRes?.data?.user) {
          profileData = {
            ...profileData,
            name: verifyRes.data.user.name || profileData.name,
            nickname: verifyRes.data.user.nickname || profileData.nickname,
            phone: verifyRes.data.user.phone || profileData.phone,
            preferredLanguage: verifyRes.data.user.preferredLanguage || profileData.preferredLanguage,
          };
        }
      } catch (e) {
        // Continue with Firebase user profile
      }

      speakText(`Welcome back to Medicare, ${profileData.nickname || profileData.name}!`, { volume: 'loud' });
      onSuccess(profileData);
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err);
      setErrorMsg(msg);
      speakText('Sign in unsuccessful. ' + msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    playTapSound();
    setDemoMode(true);
    const demoProfile: Partial<UserProfile> = {
      id: 'usr_ramesh_01',
      name: 'Ramesh Kumar',
      nickname: 'Ramesh',
      phone: '+91 98765 43210',
      caregiverPhone: '+91 98765 43211',
      caregiverName: 'Anita Sharma',
      caregiverRelation: 'Daughter',
      preferredLanguage: language || 'en-US',
    };
    speakText('Welcome to Demo Mode, Ramesh! Instant access granted.', { volume: 'loud' });
    onSuccess(demoProfile);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    setErrorMsg('');

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Please fill in your full name and phone number.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both password fields.');
      return;
    }

    try {
      setIsLoading(true);
      const { user: fbUser } = await registerWithEmailOrPhone(phone, password, fullName.trim());

      const profileData: Partial<UserProfile> = {
        name: fullName.trim(),
        nickname: fullName.trim().split(' ')[0],
        phone: phone.trim(),
        preferredLanguage: language,
        caregiverPhone: emergencyPhone.trim(),
      };

      // Sync profile with backend
      try {
        await apiClient.put('/api/v1/users/me', {
          name: profileData.name,
          nickname: profileData.nickname,
          phone: profileData.phone,
          preferredLanguage: profileData.preferredLanguage,
        });
      } catch (e) {
        // Backend user provisioned
      }

      speakText(`Account created successfully for ${fullName}. Welcome to Medicare!`, { volume: 'loud' });
      onSuccess(profileData);
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err);
      setErrorMsg(msg);
      speakText('Registration notice. ' + msg);
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white text-xl font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Verifying Account...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  <span>Login</span>
                </>
              )}
            </button>

            {/* Demo Login Button */}
            <button
              id="btn-demo-login"
              type="button"
              disabled={isLoading}
              onClick={handleDemoLogin}
              className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 text-lg font-black py-3.5 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 border-2 border-amber-400 transition-transform active:scale-98"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Demo Login (Instant Access)</span>
            </button>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 font-black text-slate-500">OR</span>
              </div>
            </div>

            {/* Register Switch Button */}
            <button
              id="btn-auth-switch-register"
              type="button"
              disabled={isLoading}
              onClick={() => {
                playTapSound();
                onSwitchMode('register');
              }}
              className="w-full bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-lg font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create New Account</span>
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
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white text-lg font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
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
