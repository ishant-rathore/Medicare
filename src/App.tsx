/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Medicine,
  DoseEvent,
  EmergencyContact,
  AccessibilitySettings,
  AppView,
} from './types';
import {
  getUserProfile,
  saveUserProfile,
  getMedicines,
  saveMedicines,
  getTodayDoses,
  saveTodayDoses,
  getEmergencyContacts,
  saveEmergencyContacts,
  getAccessibilitySettings,
  saveAccessibilitySettings,
  resetToInitialSeedData,
} from './utils/storage';
import { playTapSound, speakText } from './utils/audio';

// Components
import { TopHeader, BottomNavbar, FloatingVoiceButton } from './components/Navigation';
import { SplashView } from './components/SplashView';
import { OnboardingView } from './components/OnboardingView';
import { AuthView } from './components/AuthView';
import { ProfileSetupView } from './components/ProfileSetupView';
import { DashboardView } from './components/DashboardView';
import { MedicineManagementView } from './components/MedicineManagementView';
import { AddMedicineView } from './components/AddMedicineView';
import { MedicineDetailsView } from './components/MedicineDetailsView';
import { ReminderScheduleView } from './components/ReminderScheduleView';
import { DailyTimelineView } from './components/DailyTimelineView';
import { MedicationHistoryView } from './components/MedicationHistoryView';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import { CaregiverView } from './components/CaregiverView';
import { EmergencyContactsView } from './components/EmergencyContactsView';
import { PrescriptionScannerView } from './components/PrescriptionScannerView';
import { PhotoGalleryView } from './components/PhotoGalleryView';
import { DoctorReportView } from './components/DoctorReportView';
import { ProfileSettingsView } from './components/ProfileSettingsView';

// Modals
import { FullScreenAlarmModal } from './components/FullScreenAlarmModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Application Data State
  const [user, setUser] = useState<UserProfile>(getUserProfile);
  const [medicines, setMedicines] = useState<Medicine[]>(getMedicines);
  const [doses, setDoses] = useState<DoseEvent[]>(getTodayDoses);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(getEmergencyContacts);
  const [settings, setSettings] = useState<AccessibilitySettings>(getAccessibilitySettings);

  // Selected entities for details/editing
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [schedulingMedicine, setSchedulingMedicine] = useState<Medicine | null>(null);

  // Active Modals
  const [activeAlarmDose, setActiveAlarmDose] = useState<DoseEvent | null>(null);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    saveUserProfile(user);
  }, [user]);

  useEffect(() => {
    saveMedicines(medicines);
  }, [medicines]);

  useEffect(() => {
    saveTodayDoses(doses);
  }, [doses]);

  useEffect(() => {
    saveEmergencyContacts(emergencyContacts);
  }, [emergencyContacts]);

  useEffect(() => {
    saveAccessibilitySettings(settings);
  }, [settings]);

  // Shake gesture detection for senior emergency SOS
  useEffect(() => {
    if (!settings.shakeToSOS) return;

    let lastX = 0, lastY = 0, lastZ = 0;
    let lastTime = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const current = event.accelerationIncludingGravity;
      if (!current) return;

      const currentTime = new Date().getTime();
      if (currentTime - lastTime > 100) {
        const diffTime = currentTime - lastTime;
        lastTime = currentTime;

        const x = current.x || 0;
        const y = current.y || 0;
        const z = current.z || 0;

        const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

        if (speed > 1800) {
          setShowSOSModal(true);
        }

        lastX = x;
        lastY = y;
        lastZ = z;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [settings.shakeToSOS]);

  // Dose toggle handler
  const handleToggleDoseStatus = (doseId: string) => {
    setDoses((prev) =>
      prev.map((d) => {
        if (d.id === doseId) {
          const newStatus = d.status === 'taken' ? 'pending' : 'taken';
          if (newStatus === 'taken') {
            speakText(`Great job! ${d.medicineName} marked as taken.`, { volume: 'loud' });
          }
          return {
            ...d,
            status: newStatus,
            actualTakenTime: newStatus === 'taken' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          };
        }
        return d;
      })
    );
  };

  // Medicine management handlers
  const handleSaveMedicine = (newOrUpdated: Medicine) => {
    setMedicines((prev) => {
      const exists = prev.find((m) => m.id === newOrUpdated.id);
      if (exists) {
        return prev.map((m) => (m.id === newOrUpdated.id ? newOrUpdated : m));
      }
      return [newOrUpdated, ...prev];
    });

    // Also update today's doses if needed
    const times = newOrUpdated.times || ['08:00 AM'];
    const today = new Date().toISOString().split('T')[0];
    const newDoses: DoseEvent[] = times.map((t, i) => {
      const period = t.includes('AM') ? 'Morning' : t.includes('02:00') ? 'Afternoon' : t.includes('08:00') ? 'Evening' : 'Night';
      return {
        id: `dose_${newOrUpdated.id}_${i}`,
        medicineId: newOrUpdated.id,
        medicineName: newOrUpdated.name,
        medicineType: newOrUpdated.type,
        dosage: newOrUpdated.dosage,
        pillColor: newOrUpdated.color,
        pillShape: newOrUpdated.shape,
        mealTiming: newOrUpdated.mealTiming,
        scheduledTime: t,
        scheduledDate: today,
        period: period as any,
        status: 'pending',
        spokenScript: `${user.nickname || 'Grandpa'}, it is ${t}. Please take your ${newOrUpdated.color.toLowerCase()} ${newOrUpdated.name} ${newOrUpdated.dosage}, ${newOrUpdated.mealTiming.toLowerCase()}.`,
        synced: true,
      };
    });

    setDoses((prev) => [...newDoses, ...prev.filter((d) => d.medicineId !== newOrUpdated.id)]);
    setEditingMedicine(null);
    setCurrentView('medicines');
  };

  const handleDeleteMedicine = (medId: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== medId));
    setDoses((prev) => prev.filter((d) => d.medicineId !== medId));
    speakText('Medicine removed.');
  };

  const handleRefillStock = (medId: string, addedCount: number = 30) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === medId ? { ...m, stockCount: m.stockCount + addedCount } : m))
    );
  };

  const handleAddExtractedFromPrescription = (newMeds: Medicine[]) => {
    newMeds.forEach((m) => handleSaveMedicine(m));
    setCurrentView('medicines');
  };

  const handleResetData = () => {
    resetToInitialSeedData();
    setUser(getUserProfile());
    setMedicines(getMedicines());
    setDoses(getTodayDoses());
    setEmergencyContacts(getEmergencyContacts());
    setSettings(getAccessibilitySettings());
    setCurrentView('dashboard');
    speakText('Sample demo data has been refreshed.');
  };

  const isFullScreenView = ['splash', 'onboarding', 'login', 'register'].includes(currentView);

  // Dynamic Senior Font Scale Classes based on accessibility settings
  const fontScaleClass =
    settings.fontSize === 'extra-large'
      ? 'text-lg [&_h1]:text-3xl [&_h2]:text-2xl [&_p]:text-base'
      : settings.fontSize === 'large'
      ? 'text-base [&_h1]:text-2xl [&_h2]:text-xl [&_p]:text-sm'
      : 'text-sm';

  return (
    <div
      id="medicare-app-root"
      className={`min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-blue-200 ${fontScaleClass}`}
    >
      <div className="max-w-lg mx-auto bg-slate-50 min-h-screen shadow-2xl relative flex flex-col justify-between border-x border-slate-200">
        {/* Top Header (Shown on main views) */}
        {!isFullScreenView && (
          <TopHeader
            currentView={currentView}
            user={user}
            onNavigate={setCurrentView}
            onOpenSOS={() => setShowSOSModal(true)}
            onOpenScanner={() => setCurrentView('prescription-scanner')}
          />
        )}

        {/* View Router */}
        <main className="flex-1">
          {/* 1. Splash Screen */}
          {currentView === 'splash' && (
            <SplashView
              onGetStarted={() => {
                playTapSound();
                setCurrentView('onboarding');
              }}
              onDirectLogin={() => {
                playTapSound();
                setCurrentView('login');
              }}
            />
          )}

          {/* 2. Onboarding Screen */}
          {currentView === 'onboarding' && (
            <OnboardingView
              onFinish={() => {
                playTapSound();
                setCurrentView('login');
              }}
              onSkip={() => {
                playTapSound();
                setCurrentView('dashboard');
              }}
            />
          )}

          {/* 3 & 4. Auth View (Login / Register) */}
          {(currentView === 'login' || currentView === 'register') && (
            <AuthView
              mode={authMode}
              onSwitchMode={(mode) => {
                setAuthMode(mode);
                setCurrentView(mode);
              }}
              onSuccess={(profileUpdate) => {
                if (profileUpdate) {
                  setUser((prev) => ({ ...prev, ...profileUpdate }));
                }
                setCurrentView('dashboard');
              }}
            />
          )}

          {/* 5. Profile Setup Screen */}
          {currentView === 'profile-setup' && (
            <ProfileSetupView
              user={user}
              onSave={(updated) => {
                setUser(updated);
                setCurrentView('dashboard');
              }}
              onBack={() => setCurrentView('dashboard')}
            />
          )}

          {/* 6. Dashboard Screen */}
          {currentView === 'dashboard' && (
            <DashboardView
              user={user}
              doses={doses}
              medicines={medicines}
              onNavigate={setCurrentView}
              onSelectDose={(dose) => {
                const med = medicines.find((m) => m.id === dose.medicineId) || medicines[0];
                setSelectedMedicine(med);
                setCurrentView('medicine-details');
              }}
              onToggleDoseStatus={handleToggleDoseStatus}
              onOpenSOS={() => setShowSOSModal(true)}
              onTriggerAlarm={(dose) => {
                if (dose) setActiveAlarmDose(dose);
                else setActiveAlarmDose(doses[0]);
              }}
              onOpenScanner={() => setCurrentView('prescription-scanner')}
            />
          )}

          {/* 7. Medicine Management Screen */}
          {currentView === 'medicines' && (
            <MedicineManagementView
              medicines={medicines}
              doses={doses}
              onNavigate={setCurrentView}
              onSelectMedicine={(med) => {
                setSelectedMedicine(med);
                setCurrentView('medicine-details');
              }}
              onEditMedicine={(med) => {
                setEditingMedicine(med);
                setCurrentView('add-medicine');
              }}
              onDeleteMedicine={handleDeleteMedicine}
              onAddNew={() => {
                setEditingMedicine(null);
                setCurrentView('add-medicine');
              }}
              onOpenScanner={() => setCurrentView('prescription-scanner')}
            />
          )}

          {/* 8. Add & Edit Medicine Screen */}
          {currentView === 'add-medicine' && (
            <AddMedicineView
              initialMedicine={editingMedicine}
              onSave={handleSaveMedicine}
              onCancel={() => {
                setEditingMedicine(null);
                setCurrentView('medicines');
              }}
            />
          )}

          {/* 9. Medicine Details Screen */}
          {currentView === 'medicine-details' && (
            <MedicineDetailsView
              medicine={selectedMedicine || medicines[0]}
              onEdit={(med) => {
                setEditingMedicine(med);
                setCurrentView('add-medicine');
              }}
              onBack={() => setCurrentView('medicines')}
              onRefill={handleRefillStock}
            />
          )}

          {/* 10. Reminder Scheduling Screen */}
          {currentView === 'reminder-schedule' && (
            <ReminderScheduleView
              medicine={schedulingMedicine || selectedMedicine || medicines[0]}
              onSaveSchedule={(medId, times, freq) => {
                setMedicines((prev) =>
                  prev.map((m) => (m.id === medId ? { ...m, times, frequency: freq } : m))
                );
                setCurrentView('medicines');
              }}
              onCancel={() => setCurrentView('medicines')}
            />
          )}

          {/* 12. Daily Timeline Screen */}
          {currentView === 'timeline' && (
            <DailyTimelineView
              doses={doses}
              user={user}
              onNavigate={setCurrentView}
              onSelectDose={(dose) => {
                const med = medicines.find((m) => m.id === dose.medicineId) || medicines[0];
                setSelectedMedicine(med);
                setCurrentView('medicine-details');
              }}
              onToggleStatus={handleToggleDoseStatus}
              onTriggerAlarm={(dose) => setActiveAlarmDose(dose)}
            />
          )}

          {/* 13. Medication History Screen */}
          {currentView === 'history' && (
            <MedicationHistoryView onBack={() => setCurrentView('dashboard')} />
          )}

          {/* 14 & 21. Health Analytics Dashboard */}
          {currentView === 'analytics' && (
            <AnalyticsDashboardView
              user={user}
              medicines={medicines}
              doses={doses}
              onNavigate={setCurrentView}
              onRefill={(medId) => handleRefillStock(medId, 30)}
            />
          )}

          {/* 15. Caregiver Monitoring View */}
          {currentView === 'caregiver-mode' && (
            <CaregiverView
              user={user}
              medicines={medicines}
              doses={doses}
              onNavigate={setCurrentView}
              onCallSenior={() => {
                speakText(`Connecting phone call to ${user.name}...`);
                alert(`Calling ${user.name} (+91 98765 43210)...`);
              }}
            />
          )}

          {/* 16. Emergency Contacts & SOS View */}
          {currentView === 'emergency-contacts' && (
            <EmergencyContactsView
              contacts={emergencyContacts}
              user={user}
              onBack={() => setCurrentView('dashboard')}
              onTriggerSOS={() => setShowSOSModal(true)}
              onAddContact={(c) => setEmergencyContacts((prev) => [c, ...prev])}
              onDeleteContact={(id) => setEmergencyContacts((prev) => prev.filter((c) => c.id !== id))}
            />
          )}

          {/* 17. AI Prescription Scanner Screen */}
          {currentView === 'prescription-scanner' && (
            <PrescriptionScannerView
              onBack={() => setCurrentView('dashboard')}
              onAddExtractedMedicines={handleAddExtractedFromPrescription}
            />
          )}

          {/* 19. Photo Gallery View */}
          {currentView === 'photo-gallery' && (
            <PhotoGalleryView
              medicines={medicines}
              onBack={() => setCurrentView('medicines')}
              onSelectMedicine={(med) => {
                setSelectedMedicine(med);
                setCurrentView('medicine-details');
              }}
            />
          )}

          {/* 20. Doctor PDF Report View */}
          {currentView === 'doctor-report' && (
            <DoctorReportView
              user={user}
              medicines={medicines}
              doses={doses}
              onBack={() => setCurrentView('dashboard')}
            />
          )}

          {/* 22. Profile Settings & Accessibility View */}
          {currentView === 'profile-settings' && (
            <ProfileSettingsView
              user={user}
              settings={settings}
              onUpdateSettings={setSettings}
              onUpdateUser={setUser}
              onNavigate={setCurrentView}
              onResetData={handleResetData}
            />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        {!isFullScreenView && (
          <BottomNavbar currentView={currentView} onNavigate={setCurrentView} />
        )}

        {/* Floating Voice Assistant Trigger (on main screens) */}
        {!isFullScreenView && (
          <FloatingVoiceButton onClick={() => setShowVoiceAssistant(true)} />
        )}

        {/* Global Active Full-Screen Medication Alarm Modal */}
        {activeAlarmDose && (
          <FullScreenAlarmModal
            dose={activeAlarmDose}
            user={user}
            onTaken={(doseId) => {
              handleToggleDoseStatus(doseId);
              setActiveAlarmDose(null);
            }}
            onSnooze={(_doseId, mins) => {
              setActiveAlarmDose(null);
              setTimeout(() => {
                const refreshed = doses.find((d) => d.id === _doseId) || activeAlarmDose;
                setActiveAlarmDose(refreshed);
              }, mins * 60 * 1000);
            }}
            onSkip={(doseId) => {
              setDoses((prev) =>
                prev.map((d) => (d.id === doseId ? { ...d, status: 'missed' } : d))
              );
              setActiveAlarmDose(null);
            }}
            onClose={() => setActiveAlarmDose(null)}
          />
        )}

        {/* Global Full-Screen Emergency SOS Siren Modal */}
        {showSOSModal && (
          <EmergencySOSModal
            user={user}
            primaryContact={emergencyContacts.find((c) => c.isPrimary) || emergencyContacts[0]}
            onClose={() => setShowSOSModal(false)}
          />
        )}

        {/* Global Gemini Voice Assistant Modal */}
        {showVoiceAssistant && (
          <VoiceAssistantModal
            user={user}
            doses={doses}
            medicines={medicines}
            onClose={() => setShowVoiceAssistant(false)}
            onDoseAction={(action, doseId) => {
              if (action === 'mark_taken' && doseId) {
                handleToggleDoseStatus(doseId);
              } else if (action === 'trigger_alarm') {
                const pending = doses.find((d) => d.status === 'pending') || doses[0];
                setActiveAlarmDose(pending);
              } else if (action === 'trigger_sos') {
                setShowSOSModal(true);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
