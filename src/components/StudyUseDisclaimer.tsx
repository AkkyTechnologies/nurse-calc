/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface StudyUseDisclaimerProps {
  onAccept: () => void;
}

// Blocking first-launch notice — must be acknowledged once before using any
// calculator. Unlike RuthEasterEgg's tap-anywhere-to-close pattern, this has
// no dismiss path other than the Continue button.
export default function StudyUseDisclaimer({ onAccept }: StudyUseDisclaimerProps) {
  const continueRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    continueRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="study-use-title"
      aria-describedby="study-use-body"
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-sm px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full max-w-[320px] bg-white border-2 border-slate-200 rounded-[28px] p-6 shadow-2xl text-center"
      >
        <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
        </div>
        <h2 id="study-use-title" className="text-lg font-bold text-slate-900">
          Study use only
        </h2>
        <p id="study-use-body" className="text-sm leading-relaxed text-slate-600 mt-3 text-left">
          Titr8 performs arithmetic using values you enter. It does not recommend a medication or
          dose, assess safety, validate an order, or provide patient-care instructions. Do not use
          it to make clinical decisions. Verify all care decisions with a qualified physician or
          pharmacist, the prescription, product label, and your facility's policies.
        </p>
        <button
          ref={continueRef}
          type="button"
          onClick={onAccept}
          className="mt-5 w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold py-3.5 rounded-2xl shadow-sm transition-all cursor-pointer"
          id="study-use-continue-btn"
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
}
