/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pill, Droplet, Clock, Users, type LucideIcon } from 'lucide-react';
import { CalculatorType } from '../types';

interface Tab {
  id: CalculatorType;
  label: string;
  icon: LucideIcon;
}

const TABS: Tab[] = [
  { id: 'dosage', label: 'Dosage', icon: Pill },
  { id: 'drip-rate', label: 'Drip Rate', icon: Droplet },
  { id: 'flow-rate', label: 'Flow Rate', icon: Clock },
  { id: 'pediatric', label: 'Pediatric', icon: Users },
];

interface BottomTabBarProps {
  activeTab: CalculatorType;
  onChange: (tab: CalculatorType) => void;
}

// iOS-style bottom tab bar: all 4 calculators always visible (no scrolling),
// icon + label, unambiguous active state (teal fill + bolder label).
export default function BottomTabBar({ activeTab, onChange }: BottomTabBarProps) {
  return (
    <nav className="grid grid-cols-4 gap-0.5 bg-white border-t-2 border-slate-100 px-1.5 pt-2 pb-0.5 shrink-0">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            className="flex flex-col items-center gap-0.5 min-h-[48px] py-0.5 cursor-pointer"
            id={`nav-${tab.id}`}
          >
            <span
              className={`inline-flex items-center justify-center px-3.5 py-0.5 rounded-full transition-colors ${
                isActive ? 'bg-teal-50' : ''
              }`}
            >
              <Icon
                className={isActive ? 'text-teal-600' : 'text-slate-400'}
                size={19}
                strokeWidth={isActive ? 2.75 : 2}
              />
            </span>
            <span
              className={`text-[9px] uppercase tracking-wide whitespace-nowrap ${
                isActive ? 'text-teal-600 font-extrabold' : 'text-slate-400 font-semibold'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
