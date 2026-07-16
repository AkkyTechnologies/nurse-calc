/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Info } from 'lucide-react';

interface AboutOverlayProps {
  active: boolean;
  onClose: () => void;
}

// Optional/dismissible — reachable any time from the Dashboard, unlike the
// mandatory first-launch StudyUseDisclaimer. Folds that same notice in as a
// sub-section so there's no second stateful re-trigger mechanism to build.
//
// Always mounted; visibility toggles via opacity/pointer-events (same
// pattern as RuthEasterEgg) rather than mount/unmount gated on an exit
// animation — that pattern depends on a requestAnimationFrame-driven
// completion callback to ever unmount, which can hang indefinitely.
export default function AboutOverlay({ active, onClose }: AboutOverlayProps) {
  return (
    <div
      aria-hidden={!active}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-sm px-6"
      style={{
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
        transition: 'opacity 0.25s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[340px] max-h-[80%] overflow-y-auto bg-white border-2 border-slate-200 rounded-[28px] p-6 shadow-2xl relative"
        style={{
          transform: active ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
          transition: 'transform 0.25s ease',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 bg-white cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center mb-3">
          <Info className="w-5 h-5 text-teal-600" />
        </div>

        <h2 id="about-title" className="text-base font-bold text-slate-900 uppercase tracking-wide">
          Educational use
        </h2>
        <p className="text-sm leading-relaxed text-slate-600 mt-2.5">
          Titr8 is intended only for education and arithmetic practice. It does not recommend
          medications or doses, determine whether a dose is safe or appropriate, validate a
          prescription, or provide instructions for patient care. Do not use Titr8 to
          diagnose, treat, monitor, prescribe for, or make medication or infusion decisions
          for any patient. Before making a medical decision, consult an appropriately
          qualified physician or pharmacist and follow the applicable prescription, product
          labeling, and healthcare-facility policies.
        </p>

        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">
          Privacy
        </p>
        <p className="text-sm leading-relaxed text-slate-600 mt-1.5">
          Calculations and saved examples stay on this device.
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            First-launch notice
          </p>
          <p className="text-sm leading-relaxed text-slate-600 mt-1.5">
            Titr8 performs arithmetic using values you enter. It does not recommend a
            medication or dose, assess safety, validate an order, or provide patient-care
            instructions. Do not use it to make clinical decisions. Verify all care decisions
            with a qualified physician or pharmacist, the prescription, product label, and
            your facility's policies.
          </p>
        </div>
      </div>
    </div>
  );
}
