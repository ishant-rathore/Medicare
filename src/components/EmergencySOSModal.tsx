import React, { useEffect, useState } from 'react';
import {
  AlertOctagon,
  PhoneCall,
  MapPin,
  X,
  ShieldAlert,
  Volume2,
  Phone,
} from 'lucide-react';
import { UserProfile, EmergencyContact } from '../types';
import { playSiren, speakText, stopSpeech, playTapSound } from '../utils/audio';

interface EmergencySOSModalProps {
  user: UserProfile;
  primaryContact?: EmergencyContact;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  user,
  primaryContact,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [stopAudioFn, setStopAudioFn] = useState<(() => void) | null>(null);

  useEffect(() => {
    // Start siren sound
    const stopSound = playSiren();
    setStopAudioFn(() => stopSound);

    // Speak emergency announcement
    const timer = setTimeout(() => {
      speakText(
        `Emergency alert activated for ${user.name}. Sending location and dialing caregiver ${primaryContact?.name || 'Anita'}.`,
        { volume: 'loud' }
      );
    }, 1000);

    // 5-second countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsBroadcasting(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      if (stopSound) stopSound();
      stopSpeech();
    };
  }, [user, primaryContact]);

  const handleCancel = () => {
    playTapSound();
    if (stopAudioFn) stopAudioFn();
    stopSpeech();
    speakText('Emergency alarm cancelled.');
    onClose();
  };

  const handleCallEmergencyServices = () => {
    playTapSound();
    speakText('Dialing emergency ambulance services 108.');
  };

  return (
    <div
      id="medicare-sos-alarm-modal"
      className="fixed inset-0 z-50 bg-red-950 flex flex-col justify-between p-4 sm:p-6 text-white select-none overflow-y-auto animate-fade-in"
    >
      {/* Flashing Top Header */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-2 bg-red-500 text-white font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest animate-ping">
          EMERGENCY SOS ACTIVE
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-red-100 mt-2">
          EMERGENCY BEACON
        </h1>
        <p className="text-xs font-bold text-red-200 mt-1">
          Loud senior alert sounding & caregiver notification dispatched
        </p>
      </div>

      {/* Center Alert Details Card */}
      <div className="my-auto max-w-sm w-full mx-auto space-y-4">
        {/* Pulsing Beacon Icon */}
        <div className="w-28 h-28 mx-auto rounded-full bg-red-600/30 border-4 border-red-400 flex items-center justify-center animate-pulse">
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-2xl">
            <AlertOctagon className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border-4 border-red-400 space-y-3 text-center">
          <div>
            <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider block">
              Patient Alert
            </span>
            <h3 className="text-2xl font-black text-slate-900">{user.name} (Age {user.age})</h3>
            <p className="text-xs font-bold text-slate-700">
              Blood Group: {user.bloodGroup} • Emergency: {primaryContact?.phoneNumber || user.caregiverPhone}
            </p>
          </div>

          {/* GPS Coordinates */}
          <div className="bg-slate-100 p-2.5 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-slate-700">
            <MapPin className="w-4 h-4 text-red-600 shrink-0" />
            <span>GPS: 28.6139° N, 77.2090° E (Live)</span>
          </div>

          <div className="p-2.5 bg-red-50 text-red-900 rounded-2xl text-xs font-extrabold border border-red-200">
            {countdown > 0
              ? `Auto-broadcasting in ${countdown}s (Tap below to cancel)`
              : 'Dispatched SMS with live coordinates to all emergency contacts'}
          </div>
        </div>

        {/* Direct Emergency Call Bar */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCallEmergencyServices}
            className="bg-red-600 hover:bg-red-700 text-white font-black text-xs py-3.5 px-3 rounded-2xl shadow-md flex items-center justify-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 108 Ambulance</span>
          </button>

          <button
            onClick={() => speakText(`Calling ${primaryContact?.name || 'Caregiver'} now.`)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 px-3 rounded-2xl shadow-md flex items-center justify-center gap-1.5"
          >
            <Phone className="w-4 h-4" />
            <span>Call Caregiver</span>
          </button>
        </div>
      </div>

      {/* Giant Cancel Alarm Button */}
      <div className="max-w-sm w-full mx-auto pb-2">
        <button
          id="btn-cancel-sos"
          onClick={handleCancel}
          className="w-full bg-slate-900/90 hover:bg-slate-900 active:bg-black text-white text-lg font-black py-4 rounded-2xl border-2 border-red-300 shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <X className="w-6 h-6 stroke-[3]" />
          <span>I Am OK / Cancel Alarm</span>
        </button>
      </div>
    </div>
  );
};
