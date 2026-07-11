/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';

interface SplashScreenProps {
  onDismiss: () => void;
}

// Launch splash. The product icon morphs from grayscale into full teal, then
// the wordmark + subtitle rise in, then an Akky corporate signature band.
//
// BRAND NOTE: this is the ONE product surface where the Akky corporate mark
// (orange gradient + swan) is allowed, by explicit product decision. Keep Akky
// orange out of the calculator surfaces — only the launch splash carries it.
//
// Timing: morph 1.25s · wordmark rise @0.35s · signature @0.6s · auto-skip 1.9s.
// Tap anywhere to skip early.
export default function SplashScreen({ onDismiss }: SplashScreenProps) {
  const [leaving, setLeaving] = useState(false);

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(onDismiss, 280);
  }, [onDismiss]);

  useEffect(() => {
    const timer = setTimeout(dismiss, 1900);
    return () => clearTimeout(timer);
  }, [dismiss]);

  return (
    <div
      onClick={dismiss}
      title="Tap to skip"
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-[22px] bg-white cursor-pointer rounded-[56px] transition-opacity duration-300 ${
        leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Product icon — grayscale→teal morph */}
      <img
        src="/nurse-calc-icon.svg"
        alt="Nurse Calc"
        className="w-[100px] h-[100px] rounded-[23px] shadow-xl animate-[splash-morph_1.25s_cubic-bezier(0.22,1,0.36,1)_forwards]"
      />

      {/* Wordmark + subtitle */}
      <div className="text-center animate-[splash-rise_0.5s_ease_0.35s_both]">
        <div
          className="text-[30px] font-medium uppercase text-slate-900 leading-none"
          style={{ fontFamily: 'var(--font-brand)', letterSpacing: '0.02em' }}
        >
          Nurse Calc
        </div>
        <div className="mt-3 text-[10px] font-bold uppercase text-teal-600 tracking-[0.22em]">
          Offline · Local · Fast
        </div>
      </div>

      {/* Akky corporate signature band — bottom-anchored */}
      <div className="absolute left-0 right-0 bottom-0 animate-[splash-rise_0.5s_ease_0.6s_both]">
        <div
          className="h-[3px]"
          style={{ background: 'linear-gradient(135deg, #ffc107 0%, #ff8c1a 45%, #ff4f18 100%)' }}
        />
        <div className="flex items-center justify-center gap-2 pt-5 pb-[30px]">
          <img src="/akky-logo.png" alt="" className="h-[18px] w-auto block" />
          <span className="text-[9px] font-bold uppercase text-slate-800 tracking-[0.2em]">
            An Akky Product
          </span>
        </div>
      </div>
    </div>
  );
}
