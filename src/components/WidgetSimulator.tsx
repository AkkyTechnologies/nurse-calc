import React from 'react';
import { CalculatorType } from '../types';
import { Pill, Droplet, Users, Smartphone, Compass, Heart, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface WidgetSimulatorProps {
  onLaunchCalculator: (type: CalculatorType) => void;
}

export default function WidgetSimulator({ onLaunchCalculator }: WidgetSimulatorProps) {
  // Current date
  const today = new Date();
  const dayName = today.toLocaleDateString([], { weekday: 'short' });
  const dayNum = today.getDate();

  return (
    <div className="space-y-6" id="widget-simulator-container">
      {/* Introduction Card */}
      <div className="bg-white border-2 border-slate-200 rounded-[24px] p-6 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2 uppercase tracking-wider">
          <Smartphone className="w-4 h-4 text-teal-600" />
          iOS Home Screen Widgets (1-Tap Access)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
          Speed is life in clinical wards. Tap a widget on the simulated iOS home screen below to test instant, 1-click calculator activation:
        </p>
      </div>

      {/* Simulated iPhone Screen Canvas */}
      <div className="w-full max-w-[340px] mx-auto aspect-[9/16] bg-slate-950 rounded-[44px] p-3 border-4 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3 text-[9px] text-white/90">
          <span className="font-semibold text-[8px] tracking-tight">07:57</span>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" title="Secure Local Dosing Engine Running" />
          <div className="flex gap-0.5 items-center">
            <span className="w-2.5 h-1.5 bg-white/40 rounded-sm relative block">
              <span className="w-1.5 h-1 bg-white rounded-sm absolute left-0 top-0" />
            </span>
          </div>
        </div>

        {/* Top Header Row (iOS Widgets Row) */}
        <div className="pt-8 px-2 flex justify-between items-center text-white/90 text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest font-mono">OFFLINE</span>
            <span className="text-[9px] opacity-70">No Signal Required</span>
          </div>
          <div className="text-right font-semibold">
            <span className="text-rose-400">{dayName}</span> {dayNum}
          </div>
        </div>

        {/* Widget Grid */}
        <div className="grid grid-cols-2 gap-3.5 px-1 py-4 flex-1 items-start mt-4">
          
          {/* Widget 1: Dosage Quick-Jump */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onLaunchCalculator('dosage')}
            className="aspect-square bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-lg border border-slate-800 cursor-pointer group hover:border-teal-500/50 transition-all"
            title="Launch Dosage Calculator"
          >
            <div className="flex justify-between items-start">
              <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-xl">
                <Pill className="w-4 h-4" />
              </div>
              <span className="text-[8px] bg-teal-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">TAP</span>
            </div>
            <div>
              <span className="text-[9px] text-teal-400 font-bold uppercase tracking-wider block">Dosage</span>
              <span className="text-xs font-bold text-white leading-tight block mt-0.5">Desired / Have</span>
              <span className="text-[8px] text-slate-400 leading-normal block mt-1">Instant mass & liquid formula</span>
            </div>
          </motion.div>

          {/* Widget 2: Drip Rate Quick-Jump */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onLaunchCalculator('drip-rate')}
            className="aspect-square bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-lg border border-slate-800 cursor-pointer group hover:border-teal-500/50 transition-all"
            title="Launch IV Drip Rate"
          >
            <div className="flex justify-between items-start">
              <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-xl">
                <Droplet className="w-4 h-4" />
              </div>
              <span className="text-[8px] bg-teal-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">TAP</span>
            </div>
            <div>
              <span className="text-[9px] text-teal-400 font-bold uppercase tracking-wider block">Drip Rate</span>
              <span className="text-xs font-bold text-white leading-tight block mt-0.5">IV Drops/Min</span>
              <span className="text-[8px] text-slate-400 leading-normal block mt-1">Calibrated gravity drip metronome</span>
            </div>
          </motion.div>

          {/* Widget 3: Pediatric Quick-Jump */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onLaunchCalculator('pediatric')}
            className="aspect-square bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-lg border border-slate-800 cursor-pointer group hover:border-teal-500/50 transition-all"
            title="Launch Pediatric Weight"
          >
            <div className="flex justify-between items-start">
              <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[8px] bg-teal-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">TAP</span>
            </div>
            <div>
              <span className="text-[9px] text-teal-400 font-bold uppercase tracking-wider block">Pediatric</span>
              <span className="text-xs font-bold text-white leading-tight block mt-0.5">Weight Dosing</span>
              <span className="text-[8px] text-slate-400 leading-normal block mt-1">Safe mg/kg range & adult caps</span>
            </div>
          </motion.div>

          {/* Simulated App Icon */}
          <div className="aspect-square flex flex-col items-center justify-center gap-1">
            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[9px] text-slate-400 font-semibold">Nurse Calc</span>
          </div>

        </div>

        {/* Bottom Apps Dock */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-2.5 flex justify-around gap-2 mb-4">
          <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center text-white cursor-pointer" onClick={() => onLaunchCalculator('dosage')}>
            <Layers className="w-5 h-5" />
          </div>
          <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-rose-400">
            <Heart className="w-5 h-5 fill-rose-400/20" />
          </div>
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white cursor-pointer" onClick={() => onLaunchCalculator('planner')}>
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        {/* Home Indicator bar */}
        <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mb-1.5" />
      </div>

      <p className="text-[10px] text-slate-400 leading-normal text-center italic">
        Widgets are designed in compliance with iOS Apple WidgetKit guidelines, utilizing high-contrast primary information to minimize cognitive load on busy clinical wards.
      </p>
    </div>
  );
}
