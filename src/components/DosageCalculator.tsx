import React, { useState, useEffect } from 'react';
import { MedicationPreset } from '../types';
import { INITIAL_PRESETS } from '../presetsData';
import { Save, Trash2, ShieldCheck, RefreshCw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DosageCalculator() {
  const [presets, setPresets] = useState<MedicationPreset[]>(() => {
    const saved = localStorage.getItem('nurse_calc_presets');
    return saved ? JSON.parse(saved) : INITIAL_PRESETS;
  });

  const [desiredDose, setDesiredDose] = useState<string>('4');
  const [desiredUnit, setDesiredUnit] = useState<string>('mg');
  const [haveDose, setHaveDose] = useState<string>('10');
  const [haveUnit, setHaveUnit] = useState<string>('mg');
  const [quantity, setQuantity] = useState<string>('1');
  const [quantityUnit, setQuantityUnit] = useState<string>('mL');
  
  const [newPresetName, setNewPresetName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);
  const [showFormula, setShowFormula] = useState<boolean>(false);

  // Auto conversion alert/helper
  useEffect(() => {
    if (desiredUnit !== haveUnit) {
      // Auto conversion logic for common mass units
      const dVal = parseFloat(desiredDose);
      const hVal = parseFloat(haveDose);
      if (!isNaN(dVal) && !isNaN(hVal)) {
        let conversionFactor = 1;
        let possibleResult = '';

        if (desiredUnit === 'mcg' && haveUnit === 'mg') {
          // mcg to mg
          conversionFactor = 0.001;
          const convertedDose = dVal * conversionFactor;
          const finalVol = (convertedDose / hVal) * (parseFloat(quantity) || 1);
          possibleResult = `Auto-converted Desired Dose: ${convertedDose} mg. Volume: ${finalVol.toFixed(3)} ${quantityUnit}`;
        } else if (desiredUnit === 'mg' && haveUnit === 'mcg') {
          // mg to mcg
          conversionFactor = 1000;
          const convertedDose = dVal * conversionFactor;
          const finalVol = (convertedDose / hVal) * (parseFloat(quantity) || 1);
          possibleResult = `Auto-converted Desired Dose: ${convertedDose} mcg. Volume: ${finalVol.toFixed(3)} ${quantityUnit}`;
        } else if (desiredUnit === 'mg' && haveUnit === 'g') {
          // mg to g
          conversionFactor = 0.001;
          const convertedDose = dVal * conversionFactor;
          const finalVol = (convertedDose / hVal) * (parseFloat(quantity) || 1);
          possibleResult = `Auto-converted Desired Dose: ${convertedDose} g. Volume: ${finalVol.toFixed(3)} ${quantityUnit}`;
        } else if (desiredUnit === 'g' && haveUnit === 'mg') {
          // g to mg
          conversionFactor = 1000;
          const convertedDose = dVal * conversionFactor;
          const finalVol = (convertedDose / hVal) * (parseFloat(quantity) || 1);
          possibleResult = `Auto-converted Desired Dose: ${convertedDose} mg. Volume: ${finalVol.toFixed(3)} ${quantityUnit}`;
        }

        if (possibleResult) {
          setMessage({
            text: `Unit mismatch! ${possibleResult}`,
            type: 'info',
          });
          return;
        }
      }
      setMessage({
        text: `Caution: Units differ (${desiredUnit} vs ${haveUnit}). Ensure dosage measurements match before administering.`,
        type: 'warning',
      });
    } else {
      setMessage(null);
    }
  }, [desiredUnit, haveUnit, desiredDose, haveDose, quantity, quantityUnit]);

  const loadPreset = (preset: MedicationPreset) => {
    setDesiredDose(preset.desiredDose.toString());
    setDesiredUnit(preset.desiredUnit);
    setHaveDose(preset.haveDose.toString());
    setHaveUnit(preset.haveUnit);
    setQuantity(preset.quantity.toString());
    setQuantityUnit(preset.quantityUnit);
    setMessage({ text: `Loaded preset: ${preset.name}`, type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const newPreset: MedicationPreset = {
      id: `preset_${Date.now()}`,
      name: newPresetName.trim(),
      desiredDose: parseFloat(desiredDose) || 0,
      desiredUnit,
      haveDose: parseFloat(haveDose) || 0,
      haveUnit,
      quantity: parseFloat(quantity) || 0,
      quantityUnit
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem('nurse_calc_presets', JSON.stringify(updated));
    setNewPresetName('');
    setShowSaveDialog(false);
    setMessage({ text: `Saved drug preset "${newPreset.name}"`, type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    localStorage.setItem('nurse_calc_presets', JSON.stringify(updated));
    setMessage({ text: 'Preset deleted', type: 'info' });
    setTimeout(() => setMessage(null), 3000);
  };

  // Compute Formula
  const D = parseFloat(desiredDose) || 0;
  const H = parseFloat(haveDose) || 0;
  const Q = parseFloat(quantity) || 0;

  let calculatedVolume = 0;
  let rawFormulaStr = '';

  if (H > 0) {
    let effectiveD = D;
    // Auto-conversion in final volume calculation for matching units
    if (desiredUnit === 'mcg' && haveUnit === 'mg') {
      effectiveD = D * 0.001;
    } else if (desiredUnit === 'mg' && haveUnit === 'mcg') {
      effectiveD = D * 1000;
    } else if (desiredUnit === 'mg' && haveUnit === 'g') {
      effectiveD = D * 0.001;
    } else if (desiredUnit === 'g' && haveUnit === 'mg') {
      effectiveD = D * 1000;
    }

    calculatedVolume = (effectiveD / H) * Q;
    
    const doseWithConv = effectiveD !== D ? `${effectiveD} ${haveUnit} (converted)` : `${D} ${desiredUnit}`;
    rawFormulaStr = `(${doseWithConv} / ${H} ${haveUnit}) × ${Q} ${quantityUnit}`;
  }

  return (
    <div className="space-y-5" id="dosage-calc-container">
      {/* Preset Pills */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Fast Presets & Saved Drugs</span>
          <span className="text-[10px] font-semibold text-slate-400">Tap to load</span>
        </div>
        <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
          {presets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs rounded-xl font-bold cursor-pointer hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/20 shadow-xs transition-all"
            >
              <div className="w-1.5 h-3.5 bg-teal-600 rounded-full" />
              <span className="font-semibold">{preset.name}</span>
              <span className="text-[10px] text-slate-400 font-mono font-medium">
                ({preset.desiredDose} {preset.desiredUnit})
              </span>
              <button
                onClick={(e) => handleDeletePreset(preset.id, e)}
                className="text-slate-300 hover:text-rose-600 transition-colors ml-1 p-0.5 rounded-md"
                title="Delete preset"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          {presets.length === 0 && (
            <span className="text-xs text-slate-400 italic px-2 py-1">No presets saved. Save your current dosing setup below.</span>
          )}
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="bg-white border-2 border-slate-200 rounded-[24px] p-6 shadow-sm space-y-5">
        {/* Desired Dose */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
            1. Desired Dose (Prescribed Dose)
          </label>
          <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
            <input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder="0.0"
              value={desiredDose}
              onChange={(e) => setDesiredDose(e.target.value)}
              className="w-full p-4 bg-transparent outline-none text-xl font-bold font-mono"
              id="dosage-desired-input"
            />
            <select
              value={desiredUnit}
              onChange={(e) => setDesiredUnit(e.target.value)}
              className="px-4 bg-slate-50 border-l border-slate-200 rounded-r-2xl font-bold text-slate-500 text-sm outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              {['mg', 'mcg', 'g', 'units', 'mL', 'mEq'].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Have Dose (Strength) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
            2. Have Dose (Stock Strength)
          </label>
          <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
            <input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder="0.0"
              value={haveDose}
              onChange={(e) => setHaveDose(e.target.value)}
              className="w-full p-4 bg-transparent outline-none text-xl font-bold font-mono"
              id="dosage-have-input"
            />
            <select
              value={haveUnit}
              onChange={(e) => setHaveUnit(e.target.value)}
              className="px-4 bg-slate-50 border-l border-slate-200 rounded-r-2xl font-bold text-slate-500 text-sm outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              {['mg', 'mcg', 'g', 'units', 'mL', 'mEq'].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity (Volume / Tab) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
            3. Vehicle (Volume / Form Unit)
          </label>
          <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
            <input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder="0.0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-4 bg-transparent outline-none text-xl font-bold font-mono"
              id="dosage-quantity-input"
            />
            <select
              value={quantityUnit}
              onChange={(e) => setQuantityUnit(e.target.value)}
              className="px-4 bg-slate-50 border-l border-slate-200 rounded-r-2xl font-bold text-slate-500 text-sm outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              {['mL', 'tablet', 'capsule', 'drop', 'ampoule'].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Alerts */}
      <AnimatePresence mode="popLayout">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : message.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-teal-50 border-teal-200 text-teal-800'
            }`}
          >
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-semibold">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Math Formula Result Container */}
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
          CALCULATED RESULT (OFFLINE SECURE)
        </div>

        {/* Large Volume Output */}
        <div className="text-6xl font-black text-teal-600 tabular-nums tracking-tight">
          {H > 0 ? (calculatedVolume % 1 === 0 ? calculatedVolume : calculatedVolume.toFixed(3)) : '0.00'}
        </div>
        <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
          {quantityUnit === 'mL' ? 'Milliliters (mL)' : quantityUnit}
        </div>

        {showFormula && (
          <div className="w-full mt-4 pt-4 border-t border-slate-100 space-y-2 text-left">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="uppercase tracking-wider">FORMULA</span>
              <span className="text-slate-800 font-mono">Desired / Have × Volume</span>
            </div>
            {H > 0 && (
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span className="uppercase tracking-wider">EQUATION</span>
                <span className="text-slate-800 font-mono">({D} / {H}) × {Q}</span>
              </div>
            )}
          </div>
        )}
        {H > 0 && (
          <p className="text-[10px] text-slate-400 italic mt-3 text-center leading-normal">
            *Always verify against physician's prescription and product packaging.
          </p>
        )}
      </div>

      {/* Save Custom Drug Form Toggle */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {!showSaveDialog ? (
          <>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Frequently use this dose?</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Save it as a quick-access pill to skip typing next time.</p>
            </div>
            <button
              onClick={() => setShowSaveDialog(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Drug Preset
            </button>
          </>
        ) : (
          <form onSubmit={handleSavePreset} className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Save Current Concentration</h4>
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Medication Name (e.g. Fentanyl IV)"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 text-xs font-semibold border-2 border-slate-200 rounded-xl bg-white focus:outline-teal-600"
              />
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
