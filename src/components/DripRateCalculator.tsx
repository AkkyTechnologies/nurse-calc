import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DripRateCalculatorProps {
  transferData?: { volume: string; hours: string; minutes: string } | null;
  onClearTransfer?: () => void;
}

export default function DripRateCalculator({ transferData, onClearTransfer }: DripRateCalculatorProps) {
  const [volume, setVolume] = useState<string>('1000');
  const [hours, setHours] = useState<string>('8');
  const [minutes, setMinutes] = useState<string>('0');
  const [dropFactor, setDropFactor] = useState<string>('20');
  
  // Animation active status
  const [isAnimating, setIsAnimating] = useState(true);
  const [dropCount, setDropCount] = useState(0);
  const [showFormula, setShowFormula] = useState(false);

  // Transfer prefill hook
  useEffect(() => {
    if (transferData) {
      setVolume(transferData.volume);
      setHours(transferData.hours);
      setMinutes(transferData.minutes);
      if (onClearTransfer) {
        onClearTransfer();
      }
    }
  }, [transferData, onClearTransfer]);

  const V = parseFloat(volume) || 0;
  const H = parseFloat(hours) || 0;
  const M = parseFloat(minutes) || 0;
  const DF = parseFloat(dropFactor) || 0;

  // Convert hours + minutes to total minutes
  const totalMinutes = (H * 60) + M;

  // Drip rate (gtts/min) = (V * DF) / totalMinutes
  let dripRate = 0;
  if (totalMinutes > 0) {
    dripRate = (V * DF) / totalMinutes;
  }

  // Calculate milliseconds interval for visual drip
  // 1 minute = 60000ms. interval = 60000 / dripRate
  const dripIntervalMs = dripRate > 0 ? (60 * 1000) / dripRate : 0;

  // Keep drop count cycling to trigger animation
  useEffect(() => {
    if (!isAnimating || dripIntervalMs <= 0 || dripIntervalMs > 60000) return;

    const timer = setInterval(() => {
      setDropCount((prev) => (prev + 1) % 100);
    }, dripIntervalMs);

    return () => clearInterval(timer);
  }, [dripIntervalMs, isAnimating]);

  return (
    <div className="space-y-5" id="drip-rate-calc-container">
      {/* Main Math Formula Result Container with Metronome Drop Chamber */}
      <div className="bg-white border-2 border-slate-200 rounded-[32px] p-6 shadow-sm relative overflow-hidden text-center flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4 px-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
            GRAVITY DRIP RATE
          </div>
          <div className="flex items-center gap-1.5">
            {dripRate > 0 && (
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 rounded-xl px-2.5 py-1.5 cursor-pointer shadow-xs"
              >
                {isAnimating ? (
                  <Pause className="w-3 h-3 text-amber-500" />
                ) : (
                  <Play className="w-3 h-3 text-teal-600 fill-teal-600" />
                )}
                <span>Metronome</span>
              </button>
            )}
            <button
              onClick={() => setShowFormula(!showFormula)}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                showFormula 
                  ? 'bg-teal-50 border-teal-500 text-teal-600 shadow-xs' 
                  : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 bg-white'
              }`}
              title="Toggle Formula Details"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Huge Rate Display */}
        <div className="text-7xl font-black text-teal-600 tabular-nums tracking-tight">
          {dripRate > 0 ? Math.round(dripRate) : '0'}
        </div>
        <div className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-[0.15em]">
          Drops per Minute (gtts/min)
        </div>
        {dripRate > 0 && (
          <p className="text-[10px] text-slate-400 font-mono mt-1">
            Exact: {dripRate.toFixed(2)} gtts/min
          </p>
        )}

        {/* Drop Chamber Simulator Graphic */}
        <div className="w-full flex items-center justify-center py-4 bg-slate-50 border border-slate-200 rounded-2xl relative my-5">
          <div className="w-14 h-28 bg-white border-2 border-slate-300 rounded-full flex flex-col items-center justify-between py-1 relative shadow-inner overflow-hidden">
            {/* IV Needle Top Inlet */}
            <div className="w-2.5 h-4 bg-slate-400 rounded-sm relative">
              {/* Dripping Droplet */}
              {isAnimating && dripRate > 0 && (
                <motion.div
                  key={dropCount}
                  initial={{ y: 2, opacity: 1, scale: 0.8 }}
                  animate={{ y: 68, opacity: [1, 1, 0.7, 0] }}
                  transition={{ duration: Math.min(1.2, dripIntervalMs / 1000), ease: 'easeIn' }}
                  className="w-2.5 h-2.5 bg-teal-400 rounded-full rounded-tr-none rotate-45 absolute left-1/2 -translate-x-1/2 shadow-sm"
                />
              )}
            </div>

            {/* Drip chamber surface line */}
            <div className="w-full h-6 bg-teal-500/5 border-t border-teal-500/20 flex items-center justify-center relative">
              <div className="text-[8px] text-teal-600/50 font-bold uppercase tracking-wider">Fluid Level</div>
              {/* Rippling effects on drop impact */}
              {isAnimating && dripRate > 0 && (
                <motion.div
                  key={`ripple-${dropCount}`}
                  initial={{ scale: 0.5, opacity: 0.8 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-6 h-1 border border-teal-500/30 rounded-full absolute -top-0.5 left-1/2 -translate-x-1/2"
                />
              )}
            </div>
          </div>

          <div className="absolute right-4 text-right hidden sm:block">
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest block">Metronome Count</span>
            <span className="text-xs text-slate-700 font-bold font-mono block mt-0.5">
              1 drop / {(dripIntervalMs / 1000).toFixed(2)}s
            </span>
          </div>
        </div>

        {dripRate > 0 && showFormula && (
          <div className="w-full text-left bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-500 font-mono">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Formula math</span>
              <span className="font-semibold text-slate-800">(V × DF) / Min</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Calculation:</span>
              <span className="font-bold text-slate-800">({V} mL × {DF} gtts) / {totalMinutes} mins</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span>Exact Result:</span>
              <span className="font-bold text-teal-600">{dripRate.toFixed(4)} gtts/min</span>
            </div>
          </div>
        )}
      </div>

      {/* Inputs Form */}
      <div className="bg-white border-2 border-slate-200 rounded-[24px] p-6 shadow-sm space-y-5">
        {/* IV Fluid Volume */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
            Total Infusion Volume (mL)
          </label>
          <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
            <input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder="0"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full p-4 bg-transparent outline-none text-xl font-bold font-mono"
              id="drip-volume-input"
            />
            <span className="px-4 bg-slate-50 border-l border-slate-200 rounded-r-2xl font-bold text-slate-500 text-sm flex items-center shrink-0">
              mL
            </span>
          </div>
          {/* Quick volume presets */}
          <div className="flex gap-2 pt-1">
            {['100', '250', '500', '1000'].map((vol) => (
              <button
                key={vol}
                type="button"
                onClick={() => setVolume(vol)}
                className={`flex-1 py-2 border-2 text-[11px] font-bold rounded-xl transition-all ${
                  volume === vol
                    ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {vol} mL
              </button>
            ))}
          </div>
        </div>

        {/* Infusion Duration (Hours & Minutes) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
            Infusion Time Duration (Hours & Mins)
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
                className="w-full p-4 bg-transparent outline-none text-xl font-bold font-mono"
                id="drip-hours-input"
              />
              <span className="px-3 bg-slate-50 border-l border-slate-200 rounded-r-2xl font-bold text-slate-500 text-xs flex items-center shrink-0">
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
                className="w-full p-4 bg-transparent outline-none text-xl font-bold font-mono"
                id="drip-minutes-input"
              />
              <span className="px-3 bg-slate-50 border-l border-slate-200 rounded-r-2xl font-bold text-slate-500 text-xs flex items-center shrink-0">
                mins
              </span>
            </div>
          </div>
        </div>

        {/* Drop Factor Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
            Drop Factor (gtts / mL)
          </label>
          <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
            <input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder="20"
              value={dropFactor}
              onChange={(e) => setDropFactor(e.target.value)}
              className="w-full p-4 bg-transparent outline-none text-xl font-bold font-mono"
              id="drip-factor-input"
            />
            <span className="px-4 bg-slate-50 border-l border-slate-200 rounded-r-2xl font-bold text-slate-500 text-sm flex items-center shrink-0">
              gtts/mL
            </span>
          </div>
          {/* Quick factors */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[
              { label: '10 Macro', val: '10' },
              { label: '15 Macro', val: '15' },
              { label: '20 Macro', val: '20' },
              { label: '60 Micro', val: '60' },
            ].map((factor) => (
              <button
                key={factor.val}
                type="button"
                onClick={() => setDropFactor(factor.val)}
                className={`py-2 border-2 text-[10px] leading-tight font-bold rounded-xl transition-all ${
                  dropFactor === factor.val
                    ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {factor.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
