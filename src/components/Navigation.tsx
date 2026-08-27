import React from 'react';
import {
  Home,
  Pill,
  Clock,
  HeartHandshake,
  Settings,
  PhoneCall,
  Mic,
  Wifi,
  WifiOff,
  Bell,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  user?: UserProfile;
  isOffline?: boolean;
  onToggleOffline?: () => void;
  onOpenSOS?: () => void;
  onOpenVoiceAssistant?: () => void;
  onTriggerAlarmTest?: () => void;
  onOpenScanner?: () => void;
}

export const TopHeader: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  user,
  isOffline = false,
  onToggleOffline,
  onOpenSOS,
  onOpenVoiceAssistant,
  onTriggerAlarmTest,
  onOpenScanner,
}) => {
  return (
    <header
      id="medicare-top-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 shadow-xs"
    >
      <div className="max-w-lg mx-auto flex items-center justify-between">
        {/* Brand & Medicare+ Clean Minimalism Logo */}
        <div className="flex items-center gap-2.5">
          <button
            id="nav-logo-btn"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1 transition-opacity hover:opacity-90"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-xs">
              <div className="relative w-4 h-4 flex items-center justify-center">
                <div className="w-4 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-4 bg-white rounded-full absolute"></div>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-800">
                Medicare<span className="text-blue-600 font-extrabold">+</span>
              </span>
            </div>
          </button>
        </div>

        {/* Quick Functional Actions for Seniors */}
        <div className="flex items-center gap-2">
          {/* AI Prescription Scan Button */}
          {onOpenScanner && (
            <button
              id="btn-quick-scan"
              onClick={onOpenScanner}
              title="Scan Prescription"
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 px-2.5 py-1.5 rounded-xl font-bold text-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden xs:inline">Scan</span>
            </button>
          )}

          {/* Test Alarm Trigger */}
          {onTriggerAlarmTest && (
            <button
              id="btn-test-alarm"
              onClick={onTriggerAlarmTest}
              title="Simulate Reminder Alarm"
              className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>
          )}

          {/* Patient Status Dot & Name Badge */}
          <button
            onClick={() => onNavigate('profile-settings')}
            className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-800 truncate max-w-[80px] sm:max-w-[110px]">
              {user ? (user.nickname || user.name.split(' ')[0]) : 'Patient'}
            </span>
          </button>

          {/* Urgent Emergency SOS Button */}
          {onOpenSOS && (
            <button
              id="btn-header-sos"
              onClick={onOpenSOS}
              className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs transition-all active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export const BottomNavbar: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems: { view: AppView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: Home },
    { view: 'medicines', label: 'Medicines', icon: Pill },
    { view: 'timeline', label: 'Reminders', icon: Clock },
    { view: 'caregiver', label: 'Caregiver', icon: HeartHandshake },
    { view: 'profile-settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      id="medicare-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-sm py-1.5 px-3"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            currentView === item.view ||
            (item.view === 'medicines' &&
              (currentView === 'add-medicine' ||
                currentView === 'medicine-details' ||
                currentView === 'photo-gallery' ||
                currentView === 'pill-id' ||
                currentView === 'medicine-search')) ||
            (item.view === 'timeline' &&
              (currentView === 'reminder-schedule' ||
                currentView === 'schedule-reminder' ||
                currentView === 'history')) ||
            (item.view === 'caregiver' && currentView === 'caregiver-mode') ||
            (item.view === 'profile-settings' &&
              (currentView === 'voice-settings' ||
                currentView === 'accessibility-settings' ||
                currentView === 'notification-settings' ||
                currentView === 'health-log' ||
                currentView === 'doctor-report' ||
                currentView === 'profile-setup' ||
                currentView === 'emergency-contacts'));

          const Icon = item.icon;
          return (
            <button
              key={item.view}
              id={`nav-item-${item.view}`}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[60px] rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 font-bold bg-blue-50/70'
                  : 'text-slate-500 hover:text-slate-800 font-medium hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-blue-600 stroke-[2.5]' : 'stroke-2 text-slate-500'}`} />
              <span className="text-[11px] leading-none tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const FloatingVoiceButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      id="medicare-floating-voice-btn"
      onClick={onClick}
      aria-label="Open Voice Assistant"
      className="fixed bottom-20 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-2xl shadow-lg shadow-blue-200 border-2 border-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
    >
      <Mic className="w-6 h-6" />
    </button>
  );
};
