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
<<<<<<< HEAD
  syncDosesWithMedicines,
  recordDoseAction,
=======
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  getEmergencyContacts,
  saveEmergencyContacts,
  getAccessibilitySettings,
  saveAccessibilitySettings,
  resetToInitialSeedData,
} from './utils/storage';
<<<<<<< HEAD
import { reminderService } from './services/reminderService';
import { playTapSound, speakText } from './utils/audio';
import { onFirebaseAuthStateChanged, logoutFirebase, AuthSession, isDemoMode, setDemoMode } from './services/firebaseAuth';
import { apiClient } from './services/apiClient';
=======
import { playTapSound, speakText } from './utils/audio';
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

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
<<<<<<< HEAD
  const [authSession, setAuthSession] = useState<AuthSession | null>(null);
=======
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

  // Application Data State
  const [user, setUser] = useState<UserProfile>(getUserProfile);
  const [medicines, setMedicines] = useState<Medicine[]>(getMedicines);
<<<<<<< HEAD
  const [doses, setDoses] = useState<DoseEvent[]>(() =>
    syncDosesWithMedicines(getMedicines(), getUserProfile())
  );
=======
  const [doses, setDoses] = useState<DoseEvent[]>(getTodayDoses);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
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

<<<<<<< HEAD
  // Real Firebase Authentication session listener & persistent session recovery
  useEffect(() => {
    // If persistent Demo Mode is active, initialize demo session directly without contacting Firebase
    if (isDemoMode()) {
      setAuthSession({
        user: null,
        token: 'demo-token',
        email: 'senior_9876543210@medicare.app',
        displayName: 'Ramesh Kumar',
        uid: 'demo_user_ramesh',
        isDemo: true,
      });

      setUser((prev) => ({
        ...prev,
        name: prev.name || 'Ramesh Kumar',
        nickname: prev.nickname || 'Ramesh',
        phone: prev.phone || '+91 98765 43210',
        caregiverPhone: prev.caregiverPhone || '+91 98765 43211',
      }));

      return;
    }

    const unsubscribe = onFirebaseAuthStateChanged(async (session) => {
      if (isDemoMode()) return;
      setAuthSession(session);

      if (session.user && session.token) {
        try {
          const res = await apiClient.verifySession();
          if (res?.data?.user) {
            setUser((prev) => ({
              ...prev,
              name: res.data.user.name || prev.name,
              nickname: res.data.user.nickname || prev.nickname,
              phone: res.data.user.phone || prev.phone,
              preferredLanguage: res.data.user.preferredLanguage || prev.preferredLanguage,
            }));
          }
        } catch (err) {
          console.warn('Backend session verification notice:', err);
        }

        setCurrentView((prev) => {
          if (prev === 'splash' || prev === 'login' || prev === 'register') {
            return 'dashboard';
          }
          return prev;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      setDemoMode(false);
      await logoutFirebase();
      setAuthSession(null);
      setAuthMode('login');
      setCurrentView('login');
    } catch (err) {
      console.error('Logout error:', err);
      setAuthSession(null);
      setAuthMode('login');
      setCurrentView('login');
    }
  };

  // Initialize reminder service listener
  useEffect(() => {
    reminderService.start((dueDose) => {
      setActiveAlarmDose(dueDose);
    });

    return () => {
      reminderService.stop();
    };
  }, []);

=======
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
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
<<<<<<< HEAD
    const current = doses.find((d) => d.id === doseId);
    if (!current) return;

    if (current.status === 'taken') {
      recordDoseAction(doseId, 'pending');
    } else {
      reminderService.takeDose(doseId);
      speakText(`Great job! ${current.medicineName} marked as taken.`, { volume: 'loud' });
    }
    setDoses(getTodayDoses());
    setMedicines(getMedicines());
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  };

  // Medicine management handlers
  const handleSaveMedicine = (newOrUpdated: Medicine) => {
<<<<<<< HEAD
    const currentMeds = getMedicines();
    const exists = currentMeds.find((m) => m.id === newOrUpdated.id);
    const updatedMeds = exists
      ? currentMeds.map((m) => (m.id === newOrUpdated.id ? newOrUpdated : m))
      : [newOrUpdated, ...currentMeds];

    saveMedicines(updatedMeds);
    setMedicines(updatedMeds);

    const syncedDoses = syncDosesWithMedicines(updatedMeds, user);
    setDoses(syncedDoses);
    setEditingMedicine(null);
    setCurrentView('medicines');
    speakText(`${newOrUpdated.name} saved.`);
  };

  const handleDeleteMedicine = (medId: string) => {
    const currentMeds = getMedicines();
    const updatedMeds = currentMeds.filter((m) => m.id !== medId);
    saveMedicines(updatedMeds);
    setMedicines(updatedMeds);

    const syncedDoses = syncDosesWithMedicines(updatedMeds, user);
    setDoses(syncedDoses);
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    speakText('Medicine removed.');
  };

  const handleRefillStock = (medId: string, addedCount: number = 30) => {
<<<<<<< HEAD
    setMedicines((prev) => {
      const updated = prev.map((m) => (m.id === medId ? { ...m, stockCount: m.stockCount + addedCount } : m));
      saveMedicines(updated);
      return updated;
    });
  };

  const handleAddExtractedFromPrescription = (newMeds: Medicine[]) => {
    const currentMeds = getMedicines();
    const updatedMeds = [...newMeds, ...currentMeds];
    saveMedicines(updatedMeds);
    setMedicines(updatedMeds);

    const syncedDoses = syncDosesWithMedicines(updatedMeds, user);
    setDoses(syncedDoses);
=======
    setMedicines((prev) =>
      prev.map((m) => (m.id === medId ? { ...m, stockCount: m.stockCount + addedCount } : m))
    );
  };

  const handleAddExtractedFromPrescription = (newMeds: Medicine[]) => {
    newMeds.forEach((m) => handleSaveMedicine(m));
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
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
<<<<<<< HEAD
                if (isDemoMode()) {
                  setAuthSession({
                    user: null,
                    token: 'demo-token',
                    email: 'senior_9876543210@medicare.app',
                    displayName: profileUpdate?.name || 'Ramesh Kumar',
                    uid: 'demo_user_ramesh',
                    isDemo: true,
                  });
                }
=======
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
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
<<<<<<< HEAD
                const currentMeds = getMedicines();
                const updatedMeds = currentMeds.map((m) =>
                  m.id === medId ? { ...m, times, frequency: freq } : m
                );
                saveMedicines(updatedMeds);
                setMedicines(updatedMeds);
                const syncedDoses = syncDosesWithMedicines(updatedMeds, user);
                setDoses(syncedDoses);
                setCurrentView('medicines');
                speakText('Medication schedule updated.');
=======
                setMedicines((prev) =>
                  prev.map((m) => (m.id === medId ? { ...m, times, frequency: freq } : m))
                );
                setCurrentView('medicines');
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
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
<<<<<<< HEAD
              onLogout={handleLogout}
=======
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
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
<<<<<<< HEAD
              reminderService.takeDose(doseId);
              setDoses(getTodayDoses());
              setMedicines(getMedicines());
              setActiveAlarmDose(null);
            }}
            onSnooze={(doseId, mins) => {
              reminderService.snoozeDose(doseId, mins);
              setDoses(getTodayDoses());
              setActiveAlarmDose(null);
            }}
            onSkip={(doseId) => {
              reminderService.skipDose(doseId);
              setDoses(getTodayDoses());
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
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

<<<<<<< HEAD
        {/* Global Medicare Voice Assistant Modal */}
=======
        {/* Global Gemini Voice Assistant Modal */}
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
        {showVoiceAssistant && (
          <VoiceAssistantModal
            user={user}
            doses={doses}
            medicines={medicines}
            onClose={() => setShowVoiceAssistant(false)}
            onDoseAction={(action, doseId) => {
<<<<<<< HEAD
              if (action === 'mark_taken') {
                if (doseId) {
                  handleToggleDoseStatus(doseId);
                } else {
                  const pending = doses.find((d) => d.status === 'pending') || doses[0];
                  if (pending) handleToggleDoseStatus(pending.id);
                }
              } else if (action === 'snooze_dose') {
                const target = doseId ? doses.find((d) => d.id === doseId) : (doses.find((d) => d.status === 'pending') || doses[0]);
                if (target) {
                  reminderService.snoozeDose(target.id, 10);
                  setDoses(getTodayDoses());
                }
              } else if (action === 'skip_dose') {
                const target = doseId ? doses.find((d) => d.id === doseId) : (doses.find((d) => d.status === 'pending') || doses[0]);
                if (target) {
                  reminderService.skipDose(target.id);
                  setDoses(getTodayDoses());
                }
              } else if (action === 'trigger_alarm') {
                const pending = doses.find((d) => d.status === 'pending') || doses[0];
                setActiveAlarmDose(pending);
              } else if (action === 'trigger_sos' || action === 'open_sos') {
                setShowSOSModal(true);
              } else if (action === 'add_medicine') {
                setCurrentView('add-medicine');
                setShowVoiceAssistant(false);
              } else if (action === 'open_scanner') {
                setCurrentView('prescription-scanner');
                setShowVoiceAssistant(false);
              } else if (action === 'show_today') {
                setCurrentView('timeline');
                setShowVoiceAssistant(false);
              } else if (action === 'open_history') {
                setCurrentView('history');
                setShowVoiceAssistant(false);
              } else if (action === 'call_caregiver') {
                setCurrentView('caregiver');
                setShowVoiceAssistant(false);
              } else if (action === 'open_analytics') {
                setCurrentView('analytics');
                setShowVoiceAssistant(false);
=======
              if (action === 'mark_taken' && doseId) {
                handleToggleDoseStatus(doseId);
              } else if (action === 'trigger_alarm') {
                const pending = doses.find((d) => d.status === 'pending') || doses[0];
                setActiveAlarmDose(pending);
              } else if (action === 'trigger_sos') {
                setShowSOSModal(true);
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
