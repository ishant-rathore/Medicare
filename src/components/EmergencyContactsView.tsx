import React, { useState } from 'react';
import {
  PhoneCall,
  Phone,
  MessageSquare,
  Plus,
  Heart,
  ShieldAlert,
  ArrowLeft,
  User,
  Trash2,
  AlertOctagon,
  Volume2,
  CheckCircle,
} from 'lucide-react';
import { EmergencyContact, UserProfile } from '../types';
import { speakText, playTapSound } from '../utils/audio';

interface EmergencyContactsViewProps {
  contacts: EmergencyContact[];
  user: UserProfile;
  onBack: () => void;
  onTriggerSOS: () => void;
  onAddContact: (contact: EmergencyContact) => void;
  onDeleteContact: (id: string) => void;
}

export const EmergencyContactsView: React.FC<EmergencyContactsViewProps> = ({
  contacts,
  user,
  onBack,
  onTriggerSOS,
  onAddContact,
  onDeleteContact,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('Son');
  const [isPrimary, setIsPrimary] = useState(false);
  const [simulatedCallName, setSimulatedCallName] = useState<string | null>(null);

  const handleCall = (contact: EmergencyContact) => {
    playTapSound();
    setSimulatedCallName(contact.name);
    speakText(`Calling ${contact.name} at ${contact.phoneNumber}. Please stay calm.`, {
      volume: 'loud',
    });
    setTimeout(() => {
      setSimulatedCallName(null);
    }, 4000);
  };

  const handleSendSMS = (contact: EmergencyContact) => {
    playTapSound();
    speakText(`Emergency alert SMS sent to ${contact.name}.`);
    alert(`Emergency SMS dispatched to ${contact.name} (${contact.phoneNumber}): "URGENT: ${user.name} requires medical assistance. GPS Location: 28.6139° N, 77.2090° E."`);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    const newContact: EmergencyContact = {
      id: `contact_${Date.now()}`,
      name,
      phone,
      phoneNumber: phone,
      relation,
      isPrimary,
    };
    onAddContact(newContact);
    speakText(`Emergency contact ${name} added.`);
    setShowAddModal(false);
    setName('');
    setPhone('');
  };

  return (
    <div
      id="medicare-emergency-screen"
      className="min-h-screen bg-slate-50 pb-28 p-4 sm:p-6 max-w-lg mx-auto space-y-4 font-sans"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Emergency & SOS</h1>
            <p className="text-xs font-medium text-slate-500">Quick assistance for seniors</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="p-2.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Simulated Calling Banner */}
      {simulatedCallName && (
        <div className="bg-emerald-600 text-white p-4 rounded-3xl shadow-md flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <PhoneCall className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-100">Connecting Call...</p>
              <h4 className="text-base font-bold">{simulatedCallName}</h4>
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-emerald-900 px-3 py-1 rounded-xl">
            Ringing...
          </span>
        </div>
      )}

      {/* SOS Emergency Trigger Card */}
      <div className="bg-rose-600 text-white rounded-3xl p-6 shadow-md text-center border border-rose-500 relative overflow-hidden space-y-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-100 bg-rose-700/60 px-3 py-0.5 rounded-full">
            One-Touch Emergency Assistance
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Need Immediate Help?</h2>
          <p className="text-xs text-rose-100 font-normal max-w-xs mx-auto">
            Tap below to sound loud siren and notify your caregiver with your location.
          </p>
        </div>

        <button
          id="btn-main-sos-trigger"
          onClick={onTriggerSOS}
          className="w-full bg-white hover:bg-rose-50 active:bg-rose-100 text-rose-700 text-lg font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-2.5 transition-transform active:scale-98 border border-rose-100"
        >
          <AlertOctagon className="w-6 h-6 fill-rose-600 text-white stroke-2" />
          <span>TRIGGER SOS ALARM</span>
        </button>

        <p className="text-[11px] text-rose-200 font-medium">
          ⚠️ Automatically dials primary contact & sounds senior beacon alarm
        </p>
      </div>

      {/* Emergency Contacts List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span>Emergency Contacts</span>
          </h3>
          <span className="text-xs font-medium text-slate-500">{contacts.length} saved</span>
        </div>

        {contacts.map((contact) => (
          <div
            key={contact.id}
            id={`contact-${contact.id}`}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-base border border-rose-100">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">{contact.name}</h4>
                    {contact.isPrimary && (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    {contact.relation} • {contact.phoneNumber}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onDeleteContact(contact.id)}
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                title="Remove Contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Dial & SMS Action Bar */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleCall(contact)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-98"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </button>

              <button
                onClick={() => handleSendSMS(contact)}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Send Alert</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-slate-200 space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold text-slate-900">Add Emergency Contact</h3>

            <form onSubmit={handleSaveContact} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Son, Daughter, Doctor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm shadow-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm shadow-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm shadow-xs"
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Doctor">Doctor / Physician</option>
                  <option value="Neighbor">Neighbor</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Set as primary emergency contact</span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
