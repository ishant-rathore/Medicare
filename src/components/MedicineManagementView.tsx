import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Edit2,
  Trash2,
  Search,
  Camera,
  Sparkles,
  Volume2,
  Clock,
  ArrowLeft,
  ChevronRight,
  Info,
  CheckCircle,
} from 'lucide-react';
import { Medicine, DoseEvent, AppView } from '../types';
import { PillIcon } from './PillIcon';
import { speakText, playTapSound } from '../utils/audio';

interface MedicineManagementViewProps {
  medicines: Medicine[];
  doses: DoseEvent[];
  onNavigate: (view: AppView) => void;
  onSelectMedicine: (med: Medicine) => void;
  onEditMedicine: (med: Medicine) => void;
  onDeleteMedicine: (medId: string) => void;
  onAddNew: () => void;
  onOpenScanner: () => void;
}

export const MedicineManagementView: React.FC<MedicineManagementViewProps> = ({
  medicines,
  doses,
  onNavigate,
  onSelectMedicine,
  onEditMedicine,
  onDeleteMedicine,
  onAddNew,
  onOpenScanner,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const takenTodayCount = doses.filter((d) => d.status === 'taken').length;
  const totalDosesCount = doses.length || 1;

  const categories = ['All', 'Diabetes', 'Blood Pressure', 'Supplement', 'Allergy'];

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.color.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      filterCategory === 'All' || med.category.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const handleSpeakList = () => {
    const names = medicines.map((m) => `${m.color} ${m.name}`).join(', ');
    speakText(`You have ${medicines.length} medicines in your list: ${names}.`, {
      rate: 'normal',
      volume: 'loud',
    });
  };

  return (
    <div
      id="medicare-medicine-management-screen"
      className="min-h-screen bg-slate-50 pb-28 p-4 sm:p-6 max-w-lg mx-auto space-y-4"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Medicines
          </h1>
          <p className="text-xs font-medium text-slate-500">Manage your pills & reminders</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeakList}
            className="p-2.5 rounded-2xl bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors shadow-xs"
            title="Read Medicines Aloud"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('photo-gallery')}
            className="p-2.5 rounded-2xl bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors shadow-xs"
            title="Photo Gallery View"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total Medicines</span>
            <span className="text-2xl font-bold text-slate-900">{medicines.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Today Taken</span>
            <span className="text-2xl font-bold text-emerald-600">
              {takenTodayCount}/{totalDosesCount}
            </span>
          </div>
        </div>
      </div>

      {/* Search & AI Scan Action Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, color, category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-slate-900 font-medium bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none shadow-xs"
          />
        </div>
        <button
          onClick={onOpenScanner}
          className="py-2.5 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          title="Scan Prescription"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">AI Scan</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              playTapSound();
              setFilterCategory(cat);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filterCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Medicine List */}
      <div className="space-y-3">
        {filteredMedicines.map((med) => (
          <div
            key={med.id}
            id={`med-card-${med.id}`}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:border-blue-200 transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div
                className="flex items-center gap-3.5 cursor-pointer flex-1"
                onClick={() => onSelectMedicine(med)}
              >
                <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 shrink-0">
                  <PillIcon color={med.color} shape={med.shape} size="md" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      {med.name} {med.dosage}
                    </h3>
                  </div>
                  <p className="text-xs font-medium text-slate-500">{med.category}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      ● {med.color}
                    </span>
                    <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {med.shape}
                    </span>
                    <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {med.mealTiming}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEditMedicine(med)}
                  className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Edit Medicine"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    playTapSound();
                    if (confirm(`Delete ${med.name}?`)) {
                      onDeleteMedicine(med.id);
                    }
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Medicine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Timing & Stock Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-blue-700">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Next: {med.times[0] || '08:00 AM'}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] ${
                    med.stockCount <= med.lowStockThreshold
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {med.stockCount} left
                </span>
                <button
                  onClick={() => onSelectMedicine(med)}
                  className="font-bold text-blue-600 hover:underline flex items-center"
                >
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMedicines.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-200">
            <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No medicines found</h4>
            <p className="text-xs text-slate-500 mt-1">Try another search or add a new medicine.</p>
          </div>
        )}
      </div>

      {/* Large Add Medicine Button */}
      <div className="pt-2">
        <button
          id="btn-add-medicine-fixed"
          onClick={() => {
            playTapSound();
            onAddNew();
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-base font-bold py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add New Medicine</span>
        </button>
      </div>
    </div>
  );
};
