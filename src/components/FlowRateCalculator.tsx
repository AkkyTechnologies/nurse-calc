import React, { useState } from 'react';
import { ShieldCheck, Info, AlertTriangle, Droplet } from 'lucide-react';
import { motion } from 'motion/react';

interface FlowRateCalculatorProps {
  onTransferToDrip?: (volume: string, hours: string, minutes: string) => void;
}

export default function FlowRateCalculator({ onTransferToDrip }: FlowRateCalculatorProps) {
  const [calcMode, setCalcMode] = useState<'rate' | 'duration'>('rate');
  const [showFormula, setShowFormula] = useState<boolean>(false);
  
  // States for Calculate Rate
  const [volume, setVolume] = useState<string>('500');
  const [hours, setHours] = useState<string>('4');
  const [minutes, setMinutes] = useState<string>('0');

  // States for Calculate Duration
  const [durationVolume, setDurationVolume] = useState<string>('1000');
  const [targetRate, setTargetRate] = useState<string>('125');

  // Logic 1: Flow Rate (mL/hr)
  const V = parseFloat(volume) || 0;
  const H = parseFloat(hours) || 0;
  const M = parseFloat(minutes) || 0;
  const totalHours = H + (M / 60);

  let calculatedRate = 0;
  if (totalHours > 0) {
    calculatedRate = V / totalHours;
  }

  // Logic 2: Infusion Duration
  const DV = parseFloat(durationVolume) || 0;
  const TR = parseFloat(targetRate) || 0;

  let durationInHours = 0;
  let resultHours = 0;
  let resultMins = 0;

  if (TR > 0) {
    durationInHours = DV / TR;
    resultHours = Math.floor(durationInHours);
    resultMins = Math.round((durationInHours - resultHours) * 60);
  }

  // Alerts
  const showPumpLimitWarning = calcMode === 'rate' && calculatedRate > 999;
  const showUnsafeSlowWarning = calcMode === 'rate' && calculatedRate > 0 && calculatedRate < 10;

  const handleTransfer = () => {
    if (!onTransferToDrip) return;
    if (calcMode === 'rate') {
      onTransferToDrip(volume, hours, minutes);
    } else {
      onTransferToDrip(durationVolume, resultHours.toString(), resultMins.toString());
    }
  };

  const isTransferAvailable = calcMode === 'rate' ? (V > 0 && totalHours > 0) : (DV > 0 && TR > 0);

  return (
    <div className="space-y-5" id="flow-rate-calc-container">
      {/* Mode Toggle Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200">
        <button
          onClick={() => setCalcMode('rate')}
          className={`flex-1 text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
            calcMode === 'rate'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
          id="btn-flow-rate-mode"
        >
          Rate
        </button>
        <button
          onClick={() => setCalcMode('duration')}
          className={`flex-1 text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
            calcMode === 'duration'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
          id="btn-flow-duration-mode"
        >
          Duration Time
        </button>
      </div>

      {/* Main Form Fields */}
      <div className="bg-white border-2 border-slate-200 rounded-[24px] p-6 shadow-sm space-y-5">
        {calcMode === 'rate' ? (
          <>
            {/* Input Volume */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
                Volume to Infuse
              </label>
              <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
                <input
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="0"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full min-w-0 p-4 bg-transparent outline-none text-xl font-bold font-mono"
                  id="flow-volume-input"
                />
                <span className="px-4 bg-slate-50 border-l border-slate-200 rounded-r-2xl font-bold text-slate-500 text-sm flex items-center shrink-0">
                  mL
                </span>
              </div>
            </div>

            {/* Input Hours & Mins */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
                Delivery Duration
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
                  <input
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    placeholder="0"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full min-w-0 py-4 px-3 bg-transparent outline-none text-xl font-bold font-mono"
                    id="flow-hours-input"
                  />
                  <span className="px-4 bg-slate-50 border-l border-slate-200 rounded-r-2xl font-bold text-slate-500 text-sm flex items-center shrink-0">
                    hrs
                  </span>
                </div>
                <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
                  <input
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    placeholder="0"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="w-full min-w-0 py-4 px-3 bg-transparent outline-none text-xl font-bold font-mono"
                    id="flow-minutes-input"
                  />
                  <span className="px-4 bg-slate-50 border-l border-slate-200 rounded-r-2xl font-bold text-slate-500 text-sm flex items-center shrink-0">
                    mins
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Input Volume */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
                Volume to Infuse
              </label>
              <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
                <input
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="0"
                  value={durationVolume}
                  onChange={(e) => setDurationVolume(e.target.value)}
                  className="w-full min-w-0 p-4 bg-transparent outline-none text-xl font-bold font-mono"
                  id="flow-duration-volume-input"
                />
                <span className="px-4 bg-slate-50 border-l border-slate-200 rounded-r-2xl font-bold text-slate-500 text-sm flex items-center shrink-0">
                  mL
                </span>
              </div>
            </div>

            {/* Target Flow Rate */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
                Target Flow Rate
              </label>
              <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
                <input
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="0"
                  value={targetRate}
                  onChange={(e) => setTargetRate(e.target.value)}
                  className="w-full min-w-0 p-4 bg-transparent outline-none text-xl font-bold font-mono"
                  id="flow-target-rate-input"
                />
                <span className="px-4 bg-slate-50 border-l border-slate-200 rounded-r-2xl font-bold text-slate-500 text-sm flex items-center shrink-0">
                  mL/hr
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Safety Alerts */}
      {showPumpLimitWarning && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2 leading-relaxed">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 animate-pulse" />
          <span>
            <strong>Safety Warning:</strong> {calculatedRate.toFixed(1)} mL/hr exceeds standard volumetric infusion pump limits (standard max: 999 mL/hr). Please double-check catheter gauge and medical orders.
          </span>
        </div>
      )}

      {showUnsafeSlowWarning && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-start gap-2 leading-relaxed">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span>
            <strong>Note:</strong> Flow rate of {calculatedRate.toFixed(1)} mL/hr is very slow. Verify if microbore tubing or secondary line syringe infusion is required.
          </span>
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
          {calcMode === 'rate' ? 'INFUSION PUMP FLOW RATE' : 'REQUIRED DELIVERY TIME'}
        </div>

        {calcMode === 'rate' ? (
          <div className="w-full">
            <div className="text-6xl font-black text-teal-600 tabular-nums tracking-tight flex items-baseline justify-center gap-2">
              <span>{calculatedRate > 0 ? calculatedRate.toFixed(1) : '0.0'}</span>
              <span className="text-base font-bold text-slate-400 uppercase">mL/hr</span>
            </div>

            {showFormula && (
              <div className="w-full mt-4 pt-4 border-t border-slate-100 space-y-2 text-left">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span className="uppercase tracking-wider">FORMULA</span>
                  <span className="text-slate-800 font-mono">Volume / Time</span>
                </div>
                {calculatedRate > 0 && (
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span className="uppercase tracking-wider">EQUATION</span>
                    <span className="text-slate-800 font-mono">{V} mL / {totalHours.toFixed(2)} hrs</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full">
            <div className="text-5xl font-black text-teal-600 tabular-nums tracking-tight flex items-baseline justify-center gap-1">
              <span>{TR > 0 ? resultHours : '0'}</span>
              <span className="text-base font-bold text-slate-400 uppercase mr-3">hr</span>
              <span>{TR > 0 ? resultMins : '0'}</span>
              <span className="text-base font-bold text-slate-400 uppercase">min</span>
            </div>
            <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Total Delivery Duration
            </div>

            {showFormula && (
              <div className="w-full mt-4 pt-4 border-t border-slate-100 space-y-2 text-left">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span className="uppercase tracking-wider">FORMULA</span>
                  <span className="text-slate-800 font-mono">Volume / Rate</span>
                </div>
                {TR > 0 && (
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span className="uppercase tracking-wider">EQUATION</span>
                    <span className="text-slate-800 font-mono">{DV} mL / {TR} mL/hr</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Transfer Button - Matches Typical Nursing Workflow for Gravity Infusion Setup */}
        {isTransferAvailable && onTransferToDrip && (
          <button
            onClick={handleTransfer}
            className="mt-5 w-full bg-teal-50 hover:bg-teal-100 text-teal-700 border-2 border-teal-200 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Droplet className="w-4 h-4 text-teal-600 animate-pulse" />
            <span>Transfer to Gravity Drip Calc</span>
          </button>
        )}
      </div>
    </div>
  );
}
