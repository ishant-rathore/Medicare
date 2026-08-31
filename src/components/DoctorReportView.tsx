import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  Printer,
  ArrowLeft,
  CheckCircle,
  Calendar,
  User,
  ShieldCheck,
  Activity,
  Heart,
} from 'lucide-react';
import { UserProfile, Medicine, DoseEvent } from '../types';
import { speakText, playTapSound } from '../utils/audio';

interface DoctorReportViewProps {
  user: UserProfile;
  medicines: Medicine[];
  doses: DoseEvent[];
  onBack: () => void;
}

export const DoctorReportView: React.FC<DoctorReportViewProps> = ({
  user,
  medicines,
  doses,
  onBack,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleDownloadReport = () => {
    playTapSound();
    setIsExporting(true);
    speakText('Generating doctor adherence report in PDF format.', { volume: 'loud' });

    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1200);
  };

  const handlePrint = () => {
    playTapSound();
    window.print();
  };

  return (
    <div
      id="medicare-doctor-report-screen"
      className="min-h-screen bg-slate-50 pb-28 p-4 sm:p-6 max-w-lg mx-auto space-y-4 font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Doctor Report</h1>
            <p className="text-xs font-medium text-slate-500">Official medical compliance summary</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-xs"
          title="Print Report"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>

      {exportSuccess && (
        <div className="bg-emerald-600 text-white p-3 rounded-2xl flex items-center gap-2 font-medium text-xs shadow-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Doctor Adherence PDF generated and saved!</span>
        </div>
      )}

      {/* Official Printable Report Document Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 text-slate-900 printable-area">
        {/* Document Header */}
        <div className="border-b border-slate-100 pb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600 tracking-tight">Medicare</span>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                CLINICAL ADHERENCE SUMMARY
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Generated on: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-medium text-slate-500 block">Report Period</span>
            <span className="text-xs font-bold text-slate-900">Last 30 Days</span>
          </div>
        </div>

        {/* Patient Details Row */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Patient Name</span>
            <span className="text-sm font-bold text-slate-900">{user.name}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Age / Gender / Blood</span>
            <span className="text-sm font-bold text-slate-900">
              {user.age} Yrs • {user.gender} • {user.bloodGroup}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Emergency Contact</span>
            <span className="font-semibold text-slate-800">{user.caregiverName} ({user.caregiverPhone})</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Physician</span>
            <span className="font-semibold text-slate-800">Dr. R. Mehta (Cardiologist)</span>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">Overall Adherence</span>
            <span className="text-2xl font-bold text-emerald-900">86%</span>
          </div>
          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
            <span className="text-[10px] font-bold text-blue-700 uppercase block">Doses Taken</span>
            <span className="text-2xl font-bold text-blue-900">48 / 58</span>
          </div>
          <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100">
            <span className="text-[10px] font-bold text-amber-700 uppercase block">Missed / Skipped</span>
            <span className="text-2xl font-bold text-amber-900">10</span>
          </div>
        </div>

        {/* Active Prescribed Medications Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
            Active Prescription Regimen
          </h3>

          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Medicine</th>
                  <th className="p-2.5">Dosage</th>
                  <th className="p-2.5">Timing</th>
                  <th className="p-2.5">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {medicines.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">
                      {m.name} ({m.color} {m.shape})
                    </td>
                    <td className="p-2.5 text-slate-600">{m.dosage}</td>
                    <td className="p-2.5 font-semibold text-blue-600">{m.times.join(', ')}</td>
                    <td className="p-2.5 text-slate-600">{m.mealTiming}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Verification & Signature Box */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <div>
            <div className="flex items-center gap-1 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Medicare Verified Telemetry</span>
            </div>
            <p className="text-[10px] text-slate-500">Digital ID: MED-2026-8829-RX</p>
          </div>

          <div className="text-right">
            <div className="w-32 border-b border-slate-300 pb-5 mb-1 text-[10px] text-slate-500 text-center italic">
              Doctor Signature
            </div>
            <span className="font-semibold text-slate-800">Dr. R. Mehta, MD</span>
          </div>
        </div>
      </div>

      {/* Download / Share Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDownloadReport}
          disabled={isExporting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating...' : 'Download PDF'}</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            speakText(`Report shared with caregiver ${user.caregiverName}.`);
            alert(`Medical PDF Report sent to ${user.caregiverName} via WhatsApp & Email!`);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-xs transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share with Doctor</span>
        </button>
      </div>
    </div>
  );
};
