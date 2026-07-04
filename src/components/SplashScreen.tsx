/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';

interface SplashScreenProps {
  onDismiss: () => void;
}

// Launch splash: the Nurse Calc product icon morphs from grayscale into full
// teal on every launch (~1.4s), tap anywhere to skip early. Uses the product
// mark, not the Akky corporate logo — the brand system keeps Akky's orange
// out of product surfaces (see README).
export default function SplashScreen({ onDismiss }: SplashScreenProps) {
  const [leaving, setLeaving] = useState(false);

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(onDismiss, 280);
  }, [onDismiss]);

  useEffect(() => {
    const timer = setTimeout(dismiss, 1400);
    return () => clearTimeout(timer);
  }, [dismiss]);

  return (
    <div
      onClick={dismiss}
      title="Tap to skip"
      className={`absolute inset-0 z-50 flex items-center justify-center bg-white cursor-pointer transition-opacity duration-300 ${
        leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <img
        src="/nurse-calc-icon.svg"
        alt="Nurse Calc"
        className="w-24 h-24 rounded-[22px] shadow-xl animate-[splash-morph_1.25s_cubic-bezier(0.22,1,0.36,1)_forwards]"
      />
    </div>
  );
}
