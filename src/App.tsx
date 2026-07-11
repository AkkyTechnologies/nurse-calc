/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CalculatorType } from './types';

// Component imports
import DosageCalculator from './components/DosageCalculator';
import DripRateCalculator from './components/DripRateCalculator';
import FlowRateCalculator from './components/FlowRateCalculator';
import PediatricCalculator from './components/PediatricCalculator';
import BottomTabBar from './components/BottomTabBar';
import SplashScreen from './components/SplashScreen';
import RuthEasterEgg from './components/RuthEasterEgg';

// Icon imports
import { Compass, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LAST_TAB_KEY = 'nurse_calc_last_tab';

export default function App() {
  // Navigation active tab — resumes whichever calculator was open last launch.
  const [activeTab, setActiveTab] = useState<CalculatorType>(() => {
    const saved = localStorage.getItem(LAST_TAB_KEY);
    return (saved as CalculatorType | null) || 'planner';
  });

  useEffect(() => {
    localStorage.setItem(LAST_TAB_KEY, activeTab);
  }, [activeTab]);

  // Launch splash: shown once per app load, tap anywhere (or ~1.4s) to dismiss.
  const [showSplash, setShowSplash] = useState(true);

  // --- Ruth dedication: long-press the app icon on the Dashboard ---
  type EggPhase = 'off' | 'color' | 'reveal';
  const HOLD_MS = 950;
  const [eggPhase, setEggPhase] = useState<EggPhase>('off');
  const [holdProgress, setHoldProgress] = useState(0); // 0..1 ring fill
  const holdRaf = useRef<number | null>(null);
  const holdStart = useRef(0);
  const longPressFired = useRef(false);
  const revealTimer = useRef<number | null>(null);
  const eggActive = eggPhase !== 'off';
  const eggReveal = eggPhase === 'reveal';

  const cancelHold = () => {
    if (holdRaf.current) cancelAnimationFrame(holdRaf.current);
    holdRaf.current = null;
    setHoldProgress(0);
  };
  const openEgg = () => {
    cancelHold();
    setEggPhase('color');
    if (revealTimer.current) clearTimeout(revealTimer.current);
    revealTimer.current = window.setTimeout(() => setEggPhase('reveal'), 620);
  };
  const closeEgg = () => {
    if (revealTimer.current) clearTimeout(revealTimer.current);
    setEggPhase('color'); // note fades out first…
    revealTimer.current = window.setTimeout(() => setEggPhase('off'), 520); // …then colours revert
  };
  const beginHold = (e: React.PointerEvent) => {
    if (activeTab !== 'planner' || eggActive) return; // dashboard only
    e.preventDefault();
    longPressFired.current = false;
    holdStart.current = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - holdStart.current) / HOLD_MS);
      setHoldProgress(p);
      if (p >= 1) {
        longPressFired.current = true;
        setHoldProgress(0);
        openEgg();
      } else {
        holdRaf.current = requestAnimationFrame(step);
      }
    };
    holdRaf.current = requestAnimationFrame(step);
  };
  const handleIconClick = () => {
    if (longPressFired.current) {
      longPressFired.current = false;
      return; // swallow the click that follows a completed long-press
    }
    setActiveTab('planner');
  };

  // Close the egg if the user navigates away; clean up timers on unmount.
  useEffect(() => {
    if (activeTab !== 'planner' && eggPhase !== 'off') setEggPhase('off');
  }, [activeTab, eggPhase]);
  useEffect(() => {
    return () => {
      if (holdRaf.current) cancelAnimationFrame(holdRaf.current);
      if (revealTimer.current) clearTimeout(revealTimer.current);
    };
  }, []);

  // Shared transfer state for Flow Rate -> Drip Rate
  const [transferData, setTransferData] = useState<{ volume: string; hours: string; minutes: string } | null>(null);

  // Reset scroll to top whenever the active calculator changes.
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {/* Simulated iPhone Device Wrapper — this is the shipped app UI.
          Fixed at 393x852: the iPhone 16's logical point resolution, Apple's
          current standard (non-Pro) model — the realistic device for a nurse's
          budget, not a Pro Max. Size never changes with the browser viewport. */}
      <div className="w-[393px] h-[852px] bg-white relative border-[12px] border-slate-950 rounded-[56px] shadow-2xl overflow-hidden flex flex-col shrink-0">
        {/* iPhone Notch & Status Bar */}
        <div className={`shrink-0 text-white px-6 pt-3 pb-2 flex justify-between items-center text-[10px] font-semibold tracking-tight z-30 relative select-none transition-colors duration-700 ${eggActive ? 'bg-[#4c1d95]' : 'bg-slate-950'}`}>
          <span>07:57 AM</span>

          {/* Dynamic Island Pill */}
          <div className="w-24 h-4.5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-2" />

          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-bold tracking-widest font-mono transition-colors duration-700 ${eggActive ? 'text-white' : 'text-teal-400'}`}>100% LOCAL</span>
            <WifiOff className="w-3 h-3 text-white" />
            <div className="w-5 h-2.5 border border-white/60 rounded-sm p-0.5 flex items-center">
              <div className={`w-full h-full rounded-2xs transition-colors duration-700 ${eggActive ? 'bg-white' : 'bg-teal-400'}`} />
            </div>
          </div>
        </div>

        {/* Title Bar — compact single row; tap the app icon to return to the dashboard */}
        <div className={`shrink-0 px-4 py-2.5 border-b-2 flex items-center gap-2.5 transition-colors duration-700 ${eggActive ? 'bg-[#f6f4ff] border-purple-100' : 'bg-white border-slate-100'}`}>
          <button
            type="button"
            onClick={handleIconClick}
            onPointerDown={beginHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            onContextMenu={(e) => e.preventDefault()}
            title="Return to Dashboard Overview"
            className="shrink-0 relative rounded-[9px] cursor-pointer transition-transform active:scale-90"
            style={{ touchAction: 'none' }}
          >
            <img
              src="/nurse-calc-icon.svg"
              alt="Nurse Calc"
              className="w-7 h-7 rounded-[9px] transition-opacity duration-500"
              style={{ opacity: eggActive ? 0 : 1 }}
            />
            {/* icon → heart while the egg is open */}
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center text-[18px] transition-all duration-500"
              style={{ opacity: eggActive ? 1 : 0, transform: eggActive ? 'scale(1)' : 'scale(0.4)' }}
            >
              💜
            </span>
            {/* long-press progress ring */}
            <span
              aria-hidden
              className="pointer-events-none absolute rounded-[14px]"
              style={{
                inset: -6,
                opacity: holdProgress > 0 ? 1 : 0,
                background: `conic-gradient(#9333ea ${holdProgress * 360}deg, transparent 0deg)`,
                WebkitMask:
                  'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
                transition: 'opacity .15s',
              }}
            />
          </button>
          <h3 className={`text-[13px] font-bold tracking-tight truncate transition-colors duration-700 ${eggActive ? 'text-purple-800' : 'text-slate-900'}`}>
            {activeTab === 'planner' && 'Dashboard'}
            {activeTab === 'dosage' && 'Dosage'}
            {activeTab === 'drip-rate' && 'IV Drip Rate'}
            {activeTab === 'flow-rate' && 'IV Flow Rate'}
            {activeTab === 'pediatric' && 'Pediatric Weight Dose'}
          </h3>
        </div>

        {/* Viewport Inner Body — fills whatever space is left in the fixed frame */}
        <div ref={bodyRef} className="flex-1 min-h-0 overflow-y-auto p-5 bg-white relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {/* Dosage Tab */}
              {activeTab === 'dosage' && <DosageCalculator />}

              {/* Drip Rate Tab */}
              {activeTab === 'drip-rate' && (
                <DripRateCalculator
                  transferData={transferData}
                  onClearTransfer={() => setTransferData(null)}
                />
              )}

              {/* Flow Rate Tab */}
              {activeTab === 'flow-rate' && (
                <FlowRateCalculator
                  onTransferToDrip={(vol, hrs, mins) => {
                    setTransferData({ volume: vol, hours: hrs, minutes: mins });
                    setActiveTab('drip-rate');
                  }}
                />
              )}

              {/* Pediatric Tab */}
              {activeTab === 'pediatric' && <PediatricCalculator />}

              {/* Default Dashboard/Welcome screen */}
              {activeTab === 'planner' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-[24px] p-5 text-center">
                    <Compass className="w-8 h-8 text-teal-600 mx-auto mb-2 animate-bounce" />
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Welcome to Nurse Calc</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
                      Your bedside companion for fast, accurate medication and IV math — dosage, drip rate, flow rate, and weight-based pediatric doses. Pick a calculator from the tab bar below.
                    </p>
                  </div>

                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Offline Secure Engine</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">All math runs locally. No patient data transmitted.</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider rounded-full shrink-0">
                      <WifiOff className="w-3 h-3 text-emerald-600" />
                      100% Local
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <RuthEasterEgg active={eggActive} reveal={eggReveal} onClose={closeEgg} />
        </div>

        {/* Bottom Tab Bar: always visible, all 4 calculators, unambiguous active state */}
        <BottomTabBar activeTab={activeTab} onChange={setActiveTab} />

        {/* iPhone Home Screen Indicator Bar */}
        <div className={`shrink-0 py-3.5 border-t flex justify-center items-center select-none z-30 relative transition-colors duration-700 ${eggActive ? 'bg-[#f6f4ff] border-purple-100' : 'bg-white border-slate-100'}`}>
          <button
            onClick={() => setActiveTab('planner')}
            className={`w-28 h-1 rounded-full transition-colors cursor-pointer ${eggActive ? 'bg-purple-300' : 'bg-slate-300 hover:bg-slate-500'}`}
            title="Return to Dashboard Overview"
          />
        </div>

        {/* Launch splash overlay */}
        {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}
      </div>
    </div>
  );
}
