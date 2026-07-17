import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, Play, Pause, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDose } from '../utils/formatDose';
import { calculateDripRate } from '../calculations/dripRate';

export default function DripRateCalculator() {
  const [volume, setVolume] = useState<string>('1000');
  const [hours, setHours] = useState<string>('8');
  const [minutes, setMinutes] = useState<string>('0');
  const [dropFactor, setDropFactor] = useState<string>('20');

  // Animation active status
  const [isAnimating, setIsAnimating] = useState(true);
  const [dropCount, setDropCount] = useState(0);
  const [showFormula, setShowFormula] = useState(false);
  // Tap the chamber to magnify it; tap again to shrink.
  const [isMagnified, setIsMagnified] = useState(false);

  const V = parseFloat(volume) || 0;
  const H = parseFloat(hours) || 0;
  const M = parseFloat(minutes) || 0;
  const DF = parseFloat(dropFactor) || 0;

  // See src/calculations/dripRate.ts for the pure calculation.
  const { dripRate, totalMinutes } = calculateDripRate(V, H, M, DF);

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
      {/* Main Math Formula Result Container with Demo Drop Chamber */}
      <div className="bg-white border-2 border-slate-200 rounded-[32px] p-6 shadow-sm relative overflow-hidden text-center flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4 px-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 flex items-center gap-1 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 animate-pulse shrink-0" />
            DRIP MATH RESULT
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
                <span>{isAnimating ? 'Pause' : 'Play'}</span>
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
          Drops per Minute
        </div>
        {dripRate > 0 && (
          <p className="text-[10px] text-slate-400 font-mono mt-1">
            Exact: {formatDose(dripRate, 2)} gtts/min
          </p>
        )}

        {/* Drop Chamber Simulator Graphic — realistic glass IV chamber; tap to magnify */}
        <motion.div
          className="w-full flex items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl relative my-5 overflow-hidden"
          animate={{ paddingTop: isMagnified ? 92 : 20, paddingBottom: isMagnified ? 60 : 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <DripChamber
            isAnimating={isAnimating}
            dripRate={dripRate}
            dropCount={dropCount}
            dripIntervalMs={dripIntervalMs}
            isMagnified={isMagnified}
            onToggle={() => setIsMagnified((m) => !m)}
          />

          {dripRate > 0 && (
            <motion.div
              className="absolute right-4 text-right hidden sm:block z-[3]"
              animate={{ top: isMagnified ? 78 : 12 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <span className="text-xs text-slate-700 font-bold font-mono block">
                1 drop / {formatDose(dripIntervalMs / 1000, 2)}s
              </span>
            </motion.div>
          )}

          <motion.button
            type="button"
            onClick={() => setIsMagnified((m) => !m)}
            title={isMagnified ? 'Tap to shrink' : 'Tap to magnify'}
            animate={{ rotate: isMagnified ? 180 : 0, scale: isMagnified ? 0.9 : 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="absolute right-2.5 bottom-2.5 z-[3] flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 shadow-sm backdrop-blur-sm cursor-pointer transition-colors hover:text-teal-600"
          >
            <Maximize2 size={13} strokeWidth={2.5} />
          </motion.button>
        </motion.div>

        {dripRate > 0 && (
          <p className="text-[10px] text-slate-400 italic -mt-2 mb-1 text-center leading-normal">
            Demo only.
          </p>
        )}

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
              <span className="font-bold text-teal-600">{formatDose(dripRate, 4)} gtts/min</span>
            </div>
          </div>
        )}
      </div>

      {/* Inputs Form */}
      <div className="bg-white border-2 border-slate-200 rounded-[24px] p-6 shadow-sm space-y-5">
        {/* IV Fluid Volume */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
            Total Infusion Volume
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
            Infusion Duration
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
                id="drip-hours-input"
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
                id="drip-minutes-input"
              />
              <span className="px-4 bg-slate-50 border-l border-slate-200 rounded-r-2xl font-bold text-slate-500 text-sm flex items-center shrink-0">
                mins
              </span>
            </div>
          </div>
        </div>

        {/* Drop Factor Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
            Drop Factor
          </label>
          <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
            <input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder="20"
              value={dropFactor}
              onChange={(e) => setDropFactor(e.target.value)}
              className="w-full min-w-0 p-4 bg-transparent outline-none text-xl font-bold font-mono"
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

// Realistic gravity IV drip chamber — glass tube, spike + nozzle, forming/
// falling drop, fluid pool with meniscus, and an impact ripple. Tap to magnify.
function DripChamber({
  isAnimating,
  dripRate,
  dropCount,
  dripIntervalMs,
  isMagnified,
  onToggle,
}: {
  isAnimating: boolean;
  dripRate: number;
  dropCount: number;
  dripIntervalMs: number;
  isMagnified: boolean;
  onToggle: () => void;
}) {
  const active = isAnimating && dripRate > 0;
  // Finish the fall a touch before the next beat.
  const dropDuration = Math.min(1.2, Math.max(0.3, dripIntervalMs / 1000)) * 0.9;

  const glass =
    'linear-gradient(102deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.92) 12%, ' +
    'rgba(241,245,249,.32) 30%, rgba(255,255,255,.02) 50%, rgba(148,163,184,.13) 72%, ' +
    'rgba(255,255,255,.62) 90%, rgba(255,255,255,0) 100%)';

  return (
    <motion.div
      onClick={onToggle}
      title={isMagnified ? 'Tap to shrink' : 'Tap to magnify'}
      animate={{ scale: isMagnified ? 1.78 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="relative w-[66px] cursor-pointer select-none z-[2]"
      style={{ transformOrigin: 'center center' }}
    >
      {/* Spike port / cap on top of the chamber */}
      <div
        className="mx-auto h-[18px] w-[30px] rounded-t-[5px] rounded-b-[2px]"
        style={{
          background:
            'linear-gradient(90deg,#94a3b8,#cbd5e1 32%,#eef2f6 50%,#cbd5e1 68%,#94a3b8)',
          boxShadow: '0 1px 2px rgba(15,23,42,.18)',
        }}
      />
      <div
        className="mx-auto -mt-px h-2 w-[46px] rounded-t-md rounded-b-[2px]"
        style={{
          background:
            'linear-gradient(90deg,rgba(148,163,184,.6),rgba(226,232,240,.9) 50%,rgba(148,163,184,.6))',
        }}
      />

      {/* Glass tube */}
      <div
        className="relative mx-auto h-[150px] w-[60px] overflow-hidden"
        style={{
          background: glass,
          border: '1.5px solid rgba(148,163,184,.55)',
          borderTop: 'none',
          borderRadius: '4px 4px 30px 30px',
          boxShadow:
            'inset 0 2px 6px rgba(255,255,255,.7), inset 0 -6px 14px rgba(15,118,110,.12), 0 4px 12px rgba(15,23,42,.10)',
        }}
      >
        {/* Spike nozzle */}
        <div
          className="absolute top-0 left-1/2 h-3 w-1.5 -translate-x-1/2"
          style={{ background: 'linear-gradient(90deg,#94a3b8,#e2e8f0 50%,#94a3b8)' }}
        />
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '10px solid #94a3b8',
          }}
        />

        {/* Fluid pool */}
        <div
          className="absolute inset-x-0 bottom-0 h-14"
          style={{
            background: 'linear-gradient(180deg,#2dd4bf 0%,#14b8a6 46%,#0d9488 100%)',
            boxShadow: 'inset 0 3px 6px rgba(240,253,250,.35)',
          }}
        />
        {/* Pool surface meniscus */}
        <div
          className="absolute bottom-[52px] left-[3px] right-[3px] h-2 rounded-[50%]"
          style={{
            background: 'linear-gradient(180deg,rgba(240,253,250,.85),rgba(45,212,191,.2))',
            boxShadow: '0 -1px 3px rgba(240,253,250,.5)',
          }}
        />

        {/* Falling drop — swell, pinch-off, fall, splash-flatten */}
        {active && (
          <motion.div
            key={dropCount}
            initial={{ y: 0, scaleX: 0.35, scaleY: 0.25, opacity: 0 }}
            animate={{
              y: [0, 1, 6, 66, 74],
              scaleX: [0.35, 0.9, 0.95, 0.9, 1.35],
              scaleY: [0.25, 1.1, 0.95, 1.05, 0.5],
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{ duration: dropDuration, ease: 'easeIn', times: [0, 0.14, 0.3, 0.72, 1] }}
            className="absolute left-1/2 top-[22px] h-3.5 w-3 -translate-x-1/2 z-[2]"
            style={{
              background:
                'radial-gradient(circle at 34% 28%,#ccfbf1 0%,#2dd4bf 42%,#0d9488 100%)',
              borderRadius: '52% 52% 50% 50% / 62% 62% 42% 42%',
              boxShadow: '0 1px 2px rgba(13,148,136,.4), inset 0 -1px 2px rgba(15,118,110,.5)',
            }}
          />
        )}
        {/* Impact ripple */}
        {active && (
          <motion.div
            key={`ripple-${dropCount}`}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 0.2, 1.7], opacity: [0, 0.7, 0] }}
            transition={{ duration: dropDuration, ease: 'easeOut', times: [0, 0.66, 1] }}
            className="absolute bottom-[54px] left-1/2 h-[7px] w-[22px] -translate-x-1/2 rounded-[50%] z-[2]"
            style={{ border: '1.5px solid rgba(255,255,255,.8)' }}
          />
        )}

        {/* Glass gloss highlights */}
        <div
          className="pointer-events-none absolute left-[9px] top-1.5 h-32 w-2 rounded-full"
          style={{
            background: 'linear-gradient(180deg,rgba(255,255,255,.8),rgba(255,255,255,.12))',
            filter: 'blur(.5px)',
          }}
        />
        <div
          className="pointer-events-none absolute right-2 top-3.5 h-[108px] w-1 rounded-full"
          style={{ background: 'rgba(255,255,255,.4)' }}
        />
      </div>
    </motion.div>
  );
}
