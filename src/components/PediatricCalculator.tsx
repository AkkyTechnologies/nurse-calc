import React, { useState } from 'react';
import { ShieldCheck, Info, AlertTriangle, Save, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { PediatricPreset } from '../types';
import { INITIAL_PEDIATRIC_PRESETS } from '../presetsData';
import { useFavorites } from '../hooks/useFavorites';
import PresetCarousel from './PresetCarousel';
import FavoriteNameForm from './FavoriteNameForm';

export default function PediatricCalculator() {
  const {
    favorites: drugPresets,
    add: addDrugPreset,
    update: updateDrugPreset,
    rename: renameDrugPreset,
    remove: removeDrugPreset,
  } = useFavorites<PediatricPreset>('nurse_calc_pediatric_presets', INITIAL_PEDIATRIC_PRESETS);

  const [weight, setWeight] = useState<string>('15');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');

  const [targetDoseMultiplier, setTargetDoseMultiplier] = useState<string>('15');
  const [dosingType, setDosingType] = useState<'day' | 'dose'>('dose');
  const [dividedBy, setDividedBy] = useState<string>('1');
  const [maxAdultCap, setMaxAdultCap] = useState<string>('1000');

  const [activeDrugId, setActiveDrugId] = useState<string | null>(null);
  const [editingPresets, setEditingPresets] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'rename' | null>(null);
  const [renamingPreset, setRenamingPreset] = useState<PediatricPreset | null>(null);
  const [showFormula, setShowFormula] = useState<boolean>(false);

  const handleLoadDrug = (drug: PediatricPreset) => {
    setTargetDoseMultiplier(drug.recommendedDose.toString());
    setDosingType(drug.dosingType);
    setDividedBy(drug.defaultDividedBy.toString());
    setMaxAdultCap(drug.maxAdultDoseMg.toString());
    setActiveDrugId(drug.id);
  };

  const activeDrug = drugPresets.find((d) => d.id === activeDrugId) || null;
  const isDirty =
    !!activeDrug &&
    (activeDrug.recommendedDose !== (parseFloat(targetDoseMultiplier) || 0) ||
      activeDrug.dosingType !== dosingType ||
      activeDrug.defaultDividedBy !== (parseInt(dividedBy) || 1) ||
      activeDrug.maxAdultDoseMg !== (parseFloat(maxAdultCap) || 0));

  const handleAddFavorite = (name: string) => {
    const id = addDrugPreset({
      name,
      recommendedDose: parseFloat(targetDoseMultiplier) || 0,
      dosingType,
      defaultDividedBy: parseInt(dividedBy) || 1,
      maxAdultDoseMg: parseFloat(maxAdultCap) || 0,
    });
    setActiveDrugId(id);
    setFormMode(null);
  };

  const handleUpdateFavorite = () => {
    if (!activeDrug) return;
    updateDrugPreset(activeDrug.id, {
      recommendedDose: parseFloat(targetDoseMultiplier) || 0,
      dosingType,
      defaultDividedBy: parseInt(dividedBy) || 1,
      maxAdultDoseMg: parseFloat(maxAdultCap) || 0,
    });
  };

  const handleRenameFavorite = (name: string) => {
    if (!renamingPreset) return;
    renameDrugPreset(renamingPreset.id, name);
    setRenamingPreset(null);
    setFormMode(null);
  };

  const handleDeleteFavorite = (id: string) => {
    removeDrugPreset(id);
    if (activeDrugId === id) setActiveDrugId(null);
  };

  // Convert weight to kg for standard formulas
  const W_input = parseFloat(weight) || 0;
  const weightInKg = weightUnit === 'lb' ? W_input / 2.20462 : W_input;

  const DM = parseFloat(targetDoseMultiplier) || 0;
  const DIV = parseInt(dividedBy) || 1;
  const MAX_CAP = parseFloat(maxAdultCap) || 99999;

  // Perform Pediatric math
  // Base daily/dose calculation
  let totalCalculatedDose = weightInKg * DM;
  let singleDose = totalCalculatedDose;

  if (dosingType === 'day') {
    singleDose = totalCalculatedDose / (DIV || 1);
  } else {
    // dosingType === 'dose'
    totalCalculatedDose = singleDose * DIV;
  }

  // Check if exceeds safety cap
  const isCapped = singleDose > MAX_CAP;
  const finalSingleDose = isCapped ? MAX_CAP : singleDose;

  return (
    <div className="space-y-4" id="pediatric-calc-container">
      {/* Favorites: pediatric dosing guidelines */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Favorites</span>
          <button
            type="button"
            onClick={() => {
              setEditingPresets((prev) => !prev);
              setFormMode(null);
            }}
            disabled={drugPresets.length === 0}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-teal-600 transition-colors disabled:opacity-40 disabled:hover:text-slate-400"
          >
            {editingPresets ? 'Done' : 'Edit'}
          </button>
        </div>
        <PresetCarousel
          presets={drugPresets}
          activeId={activeDrugId}
          onLoad={handleLoadDrug}
          editing={editingPresets}
          onDelete={handleDeleteFavorite}
          onRename={(preset) => {
            setRenamingPreset(preset);
            setFormMode('rename');
          }}
          renderMeta={(preset) => `${preset.recommendedDose} mg/kg${preset.dosingType === 'day' ? '/day' : ''}`}
          emptyLabel="No favorites saved. Save your current guideline setup below."
        />
      </div>

      {/* Main Inputs Form */}
      <div className="bg-white border-2 border-slate-200 rounded-[24px] p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          {/* Row 1: Patient Weight & Dosage Multiplier */}
          <div className="space-y-1 col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
              Patient Weight
            </label>
            <div className="flex border-2 border-slate-200 rounded-xl bg-white focus-within:border-teal-500 transition-colors h-11">
              <input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="0.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-2.5 bg-transparent outline-none text-base font-bold font-mono"
                id="pediatric-weight-input"
              />
              <div className="flex bg-slate-50 border-l border-slate-200 p-0.5 rounded-r-xl shrink-0 items-center">
                <button
                  type="button"
                  onClick={() => setWeightUnit('kg')}
                  className={`px-1.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    weightUnit === 'kg' ? 'bg-white text-teal-600 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  kg
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit('lb')}
                  className={`px-1.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    weightUnit === 'lb' ? 'bg-white text-teal-600 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  lb
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1 col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
              Dosage Multiplier
            </label>
            <div className="flex border-2 border-slate-200 rounded-xl bg-white focus-within:border-teal-500 transition-colors h-11 items-center">
              <input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="10"
                value={targetDoseMultiplier}
                onChange={(e) => setTargetDoseMultiplier(e.target.value)}
                className="w-full px-2.5 bg-transparent outline-none text-base font-bold font-mono"
                id="pediatric-multiplier-input"
              />
              <span className="pr-2.5 text-xs font-bold text-slate-400 shrink-0">
                mg/kg
              </span>
            </div>
          </div>

          {/* Row 2: Dosing Type & Max Safe Single Dose */}
          <div className="space-y-1 col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
              Dosing Type
            </label>
            <div className="flex border-2 border-slate-200 rounded-xl bg-white focus-within:border-teal-500 transition-colors h-11">
              <select
                value={dosingType}
                onChange={(e) => setDosingType(e.target.value as any)}
                className="w-full px-2 py-1 bg-transparent outline-none text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="dose">Per Dose</option>
                <option value="day">Per Day (divided)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
              Max Safe Dose
            </label>
            <div className="flex border-2 border-slate-200 rounded-xl bg-white focus-within:border-teal-500 transition-colors h-11 items-center">
              <input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="1000"
                value={maxAdultCap}
                onChange={(e) => setMaxAdultCap(e.target.value)}
                className="w-full px-2.5 bg-transparent outline-none text-base font-bold font-mono"
                id="pediatric-max-cap-input"
              />
              <span className="pr-2.5 text-xs font-bold text-slate-400 shrink-0">
                mg
              </span>
            </div>
          </div>

          {/* Row 3: Doses per Day (Only shown when Per Day (divided) is active) */}
          {dosingType === 'day' && (
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
                Doses per Day
              </label>
              <div className="flex border-2 border-slate-200 rounded-xl bg-white focus-within:border-teal-500 transition-colors h-11 items-center">
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="1"
                  value={dividedBy}
                  onChange={(e) => setDividedBy(e.target.value)}
                  className="w-full px-2.5 bg-transparent outline-none text-base font-bold font-mono"
                  id="pediatric-divided-input"
                />
                <span className="pr-2.5 text-xs font-bold text-slate-400 shrink-0">
                  times
                </span>
              </div>
            </div>
          )}
        </div>
        {weightUnit === 'lb' && W_input > 0 && (
          <span className="text-[10px] text-slate-400 mt-2 block font-mono px-1">
            Weight converted: {weightInKg.toFixed(2)} kg
          </span>
        )}
      </div>

      {/* Safety Alerts */}
      {isCapped && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2 leading-relaxed">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 animate-pulse" />
          <div>
            <strong>Safety Cap Applied:</strong> Recommended dose capped at adult single limit of <strong>{MAX_CAP} mg</strong>.
          </div>
        </div>
      )}

      {/* Primary Result Display */}
      <div className="bg-white border-2 border-slate-200 rounded-[28px] p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
        
        {/* Info formula toggle in corner */}
        <button
          onClick={() => setShowFormula(!showFormula)}
          className={`absolute top-4 right-4 p-1.5 rounded-lg border transition-all cursor-pointer ${
            showFormula 
              ? 'bg-teal-50 border-teal-500 text-teal-600 shadow-xs' 
              : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 bg-white'
          }`}
          title="Toggle Formula Details"
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-3 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          RECOMMENDED PEDIATRIC DOSE
        </div>

        {/* Dose Output */}
        <div className="text-6xl font-black text-teal-600 tabular-nums tracking-tight">
          {W_input > 0 ? finalSingleDose.toFixed(1) : '0.0'}
        </div>
        <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
          Milligrams per Dose (mg / dose)
        </div>

        {dosingType === 'day' && W_input > 0 && (
          <p className="text-[10px] text-slate-500 font-mono mt-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
            Total Daily Requirement: {totalCalculatedDose.toFixed(1)} mg/day (divided into {DIV} doses).
          </p>
        )}

        {/* Toggleable Formula breakdown */}
        {showFormula && (
          <div className="w-full mt-4 pt-4 border-t border-slate-100 space-y-2 text-left">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="uppercase tracking-wider">FORMULA</span>
              <span className="text-slate-800 font-mono">
                {dosingType === 'day' ? '(Weight × Multiplier) / Doses' : 'Weight × Multiplier'}
              </span>
            </div>
            {W_input > 0 && (
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span className="uppercase tracking-wider">EQUATION</span>
                <span className="text-slate-800 font-mono">
                  {dosingType === 'day' ? (
                    <>({weightInKg.toFixed(2)} kg × {DM} mg/kg/day) / {DIV}</>
                  ) : (
                    <>{weightInKg.toFixed(2)} kg × {DM} mg/kg</>
                  )}
                </span>
              </div>
            )}
            {isCapped && (
              <div className="flex items-center justify-between text-[11px] font-bold text-rose-500 pt-1 border-t border-slate-100/50">
                <span className="uppercase tracking-wider">LIMIT</span>
                <span>Max safe limit cap of {MAX_CAP} mg reached</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save / Update / Rename Favorite */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {formMode === null ? (
          <>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {activeDrug && isDirty ? 'Update this favorite?' : 'Save this dosing guideline?'}
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {activeDrug && isDirty
                  ? `Overwrite "${activeDrug.name}" or keep it and save a new one.`
                  : 'Add to Favorites for one-tap reuse.'}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {activeDrug && isDirty && (
                <button
                  onClick={handleUpdateFavorite}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Update
                </button>
              )}
              <button
                onClick={() => setFormMode('add')}
                className={`text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                  activeDrug && isDirty
                    ? 'bg-white border-2 border-slate-200 text-slate-700 hover:border-teal-500'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {activeDrug && isDirty ? <Plus className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {activeDrug && isDirty ? 'Add New' : 'Save Favorite'}
              </button>
            </div>
          </>
        ) : formMode === 'add' ? (
          <FavoriteNameForm
            title="Save Current Guideline"
            placeholder="Drug name (e.g. Cefdinir)"
            submitLabel="Save"
            onSubmit={handleAddFavorite}
            onCancel={() => setFormMode(null)}
          />
        ) : (
          <FavoriteNameForm
            title="Rename Favorite"
            initialName={renamingPreset?.name}
            placeholder="Favorite name"
            submitLabel="Rename"
            onSubmit={handleRenameFavorite}
            onCancel={() => {
              setFormMode(null);
              setRenamingPreset(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
