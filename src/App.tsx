/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CalculatorType, MVPFeature, FeedbackNote } from './types';
import { INITIAL_MVP_FEATURES } from './presetsData';

// Component imports
import MvpPlanner from './components/MvpPlanner';
import DosageCalculator from './components/DosageCalculator';
import DripRateCalculator from './components/DripRateCalculator';
import FlowRateCalculator from './components/FlowRateCalculator';
import PediatricCalculator from './components/PediatricCalculator';
import WidgetSimulator from './components/WidgetSimulator';

// Icon imports
import {
  Pill,
  Droplet,
  Users,
  Smartphone,
  ShieldCheck,
  Clock,
  Activity,
  WifiOff,
  Maximize2,
  Minimize2,
  ListChecks,
  Compass,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<CalculatorType>('planner');

  // Shared transfer state for Flow Rate -> Drip Rate
  const [transferData, setTransferData] = useState<{ volume: string; hours: string; minutes: string } | null>(null);
  
  // Layout Frame mode
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // MVP Specs list state
  const [features, setFeatures] = useState<MVPFeature[]>(() => {
    const saved = localStorage.getItem('nurse_calc_features');
    return saved ? JSON.parse(saved) : INITIAL_MVP_FEATURES;
  });

  // Clinician feedback notes
  const [notes, setNotes] = useState<FeedbackNote[]>(() => {
    const saved = localStorage.getItem('nurse_calc_notes');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('nurse_calc_features', JSON.stringify(features));
  }, [features]);

  useEffect(() => {
    localStorage.setItem('nurse_calc_notes', JSON.stringify(notes));
  }, [notes]);

  const handleLaunchFromWidget = (type: CalculatorType) => {
    setActiveTab(type);
  };

  const completedCount = features.filter((f) => f.status === 'completed').length;
  const progressPercent = Math.round((completedCount / features.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans pb-12">
      
      {/* Upper Navigation & Status Bar */}
      <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-40 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-teal-600 rounded-[14px] flex items-center justify-center text-white border-2 border-teal-700 shadow-sm">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
                Nurse Calc <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded-full border border-teal-200">iOS Blueprint</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Clinical Dosage & Flow Rate Offline Core</p>
            </div>
          </div>

          {/* Quick Stats & Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 100% Offline Protection Label */}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-800 border-2 border-emerald-200 text-xs font-bold uppercase tracking-wider rounded-xl">
              <WifiOff className="w-3.5 h-3.5 text-emerald-600" />
              100% Offline Core
            </span>

            {/* Simulated Frame Toggle */}
            <button
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm border-2 border-slate-950 transition-all cursor-pointer"
              id="toggle-layout-frame"
            >
              {isMobileFrame ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  Tablet View
                </>
              ) : (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  iPhone View
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Main Layout Area */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        
        {/* Banner highlighting interactive planning requested */}
        <div className="mb-6 bg-slate-900 border-2 border-slate-800 text-white rounded-[24px] p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-1.5 z-10">
            <h2 className="text-base font-black uppercase tracking-wider text-teal-400">Interactive Clinician Blueprint Evaluation</h2>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold max-w-2xl">
              A high-precision clinical calculator suite designed for native iOS devices. Use the specs planner to audit scope maturity, toggle the simulated iPhone container, tap live widgets, and record critical Ward feedback offline.
            </p>
          </div>
          <div className="bg-white/10 px-5 py-3.5 rounded-2xl border-2 border-white/10 shrink-0 text-center z-10">
            <span className="text-[9px] text-teal-300 uppercase tracking-widest font-bold block mb-1">Maturity Progress</span>
            <span className="text-lg font-mono font-black text-white">{progressPercent}% Completed</span>
          </div>
        </div>

        {/* Dynamic Split Layout */}
        <div className={`grid gap-6 ${isMobileFrame ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1 lg:grid-cols-3'}`}>
          
          {/* Left Side Column: Interactive MVP Spec Planner / Backlog (Only shows side-by-side in Mobile Frame mode) */}
          {isMobileFrame && (
            <section className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-[32px] p-8 border-2 border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-slate-100">
                  <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-teal-600" />
                    1. Plan MVP Scope & Spec
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">Interactive</span>
                </div>
                <MvpPlanner
                  features={features}
                  setFeatures={setFeatures}
                  notes={notes}
                  setNotes={setNotes}
                />
              </div>
            </section>
          )}

          {/* Right/Middle Column: Active iPhone Simulator Framework */}
          <section className={`${isMobileFrame ? 'lg:col-span-7' : 'lg:col-span-2'} flex flex-col items-center justify-start`}>
            
            {/* Simulated iPhone Device Wrapper */}
            <div className={`w-full bg-white ${isMobileFrame ? 'max-w-[412px] border-[12px] border-slate-950 rounded-[56px] shadow-2xl relative overflow-hidden' : 'rounded-[32px] border-2 border-slate-200 p-8'}`}>
              
              {/* iPhone Notch & Status Bar (Only in Mobile Frame) */}
              {isMobileFrame && (
                <div className="bg-slate-950 text-white px-6 pt-3 pb-2 flex justify-between items-center text-[10px] font-semibold tracking-tight z-30 relative select-none">
                  <span>07:57 AM</span>
                  
                  {/* Dynamic Island Pills */}
                  <div className="w-24 h-4.5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
                  
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-teal-400 font-bold tracking-widest font-mono">100% LOCAL</span>
                    <WifiOff className="w-3 h-3 text-white" />
                    <div className="w-5 h-2.5 border border-white/60 rounded-sm p-0.5 flex items-center">
                      <div className="w-full h-full bg-teal-400 rounded-2xs" />
                    </div>
                  </div>
                </div>
              )}

              {/* iPhone Action Bar Title */}
              <div className="px-5 py-4 border-b-2 border-slate-100 flex items-center justify-between bg-white">
                <div>
                  <span className="text-[9px] text-teal-600 font-bold uppercase tracking-widest">Active iOS App View</span>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {activeTab === 'planner' && 'Dashboard Overview'}
                    {activeTab === 'dosage' && 'Dosage (Desired/Have)'}
                    {activeTab === 'drip-rate' && 'IV Drip Rate (gtts/min)'}
                    {activeTab === 'flow-rate' && 'IV Flow Rate (mL/hr)'}
                    {activeTab === 'pediatric' && 'Pediatric Weight Dose'}
                    {activeTab === 'widget-home' && 'iOS Widget Screen'}
                  </h3>
                </div>
                <div className="flex gap-1">
                  {/* Small link back to Widget screen */}
                  <button
                    onClick={() => setActiveTab('widget-home')}
                    className={`text-xs p-1.5 rounded-lg border-2 transition-all cursor-pointer ${
                      activeTab === 'widget-home'
                        ? 'bg-teal-50 border-teal-500 text-teal-700 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                    title="View Simulated Widget Screen"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Simulator Navigation Tabs (Top carousel style for fast tap access) */}
              <div className="bg-slate-50 p-2.5 border-b-2 border-slate-200 flex gap-2 overflow-x-auto select-none no-scrollbar">
                {[
                  { id: 'dosage', label: 'Dosage', icon: Pill },
                  { id: 'drip-rate', label: 'Drip Rate', icon: Droplet },
                  { id: 'flow-rate', label: 'Flow Rate', icon: Clock },
                  { id: 'pediatric', label: 'Pediatric', icon: Users },
                  { id: 'widget-home', label: 'iOS Widgets', icon: Compass },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as CalculatorType)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl shrink-0 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-white text-slate-500 border-2 border-slate-200 hover:text-slate-900 hover:border-slate-300'
                      }`}
                      id={`nav-${item.id}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* iPhone Viewport Inner Body */}
              <div className="p-5 bg-white min-h-[480px] max-h-[620px] overflow-y-auto">
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

                    {/* Widget Screen Tab */}
                    {activeTab === 'widget-home' && (
                      <WidgetSimulator onLaunchCalculator={handleLaunchFromWidget} />
                    )}

                    {/* Default Dashboard/Planner inside phone (when not side-by-side or chosen explicitly) */}
                    {activeTab === 'planner' && (
                      <div className="space-y-4">
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-[24px] p-5 text-center">
                          <Compass className="w-8 h-8 text-teal-600 mx-auto mb-2 animate-bounce" />
                          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Welcome to Nurse Calc</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
                            A high-performance calculation suite with zero dependency on cellular networks. Tap one of the calculator tabs above or browse the home screen widgets.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block px-1">Core Calculator Shortcuts</span>
                          <button
                            onClick={() => setActiveTab('dosage')}
                            className="w-full flex items-center justify-between p-4 border-2 border-slate-200 rounded-2xl hover:border-teal-500 hover:bg-teal-50/10 text-left transition-all text-xs font-bold"
                          >
                            <span className="flex items-center gap-2 text-slate-700">
                              <Pill className="w-4 h-4 text-teal-600" /> Medication Dosage (Desired/Have)
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>

                          <button
                            onClick={() => setActiveTab('drip-rate')}
                            className="w-full flex items-center justify-between p-4 border-2 border-slate-200 rounded-2xl hover:border-teal-500 hover:bg-teal-50/10 text-left transition-all text-xs font-bold"
                          >
                            <span className="flex items-center gap-2 text-slate-700">
                              <Droplet className="w-4 h-4 text-teal-600" /> Gravity IV Drip Rate (gtts/min)
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>

                          <button
                            onClick={() => setActiveTab('pediatric')}
                            className="w-full flex items-center justify-between p-4 border-2 border-slate-200 rounded-2xl hover:border-teal-500 hover:bg-teal-50/10 text-left transition-all text-xs font-bold"
                          >
                            <span className="flex items-center gap-2 text-slate-700">
                              <Users className="w-4 h-4 text-teal-600" /> Weight-Based Pediatric Dosing
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        </div>

                        {!isMobileFrame && (
                          <div className="pt-4 border-t-2 border-slate-100">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-2 px-1">Specifications</span>
                            <button
                              onClick={() => setActiveTab('planner')}
                              className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                            >
                              Open Spec Planner tab
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* iPhone Home Screen Indicator Bar */}
              {isMobileFrame && (
                <div className="bg-white py-3.5 border-t border-slate-100 flex justify-center items-center select-none z-30 relative">
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="w-28 h-1 bg-slate-300 rounded-full hover:bg-slate-500 transition-colors cursor-pointer"
                    title="Return to Dashboard Overview"
                  />
                </div>
              )}

            </div>
          </section>

          {/* Fallback column: If user toggles Full Tablet Layout, they see planner on the right */}
          {!isMobileFrame && (
            <section className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[32px] p-8 border-2 border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-100">
                  <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-teal-600" />
                    MVP Specification
                  </h2>
                </div>
                <MvpPlanner
                  features={features}
                  setFeatures={setFeatures}
                  notes={notes}
                  setNotes={setNotes}
                />
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
