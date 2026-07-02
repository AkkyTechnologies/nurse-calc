import { MedicationPreset, MVPFeature } from './types';

export const INITIAL_PRESETS: MedicationPreset[] = [
  {
    id: '1',
    name: 'Morphine',
    desiredDose: 4,
    desiredUnit: 'mg',
    haveDose: 10,
    haveUnit: 'mg',
    quantity: 1,
    quantityUnit: 'mL'
  },
  {
    id: '2',
    name: 'Heparin Infusion',
    desiredDose: 1200,
    desiredUnit: 'units',
    haveDose: 25000,
    haveUnit: 'units',
    quantity: 250,
    quantityUnit: 'mL'
  },
  {
    id: '3',
    name: 'Ondansetron (Zofran)',
    desiredDose: 4,
    desiredUnit: 'mg',
    haveDose: 4,
    haveUnit: 'mg',
    quantity: 2,
    quantityUnit: 'mL'
  },
  {
    id: '4',
    name: 'Furosemide (Lasix)',
    desiredDose: 40,
    desiredUnit: 'mg',
    haveDose: 20,
    haveUnit: 'mg',
    quantity: 2,
    quantityUnit: 'mL'
  },
  {
    id: '5',
    name: 'Ceftriaxone (Rocephin)',
    desiredDose: 1000,
    desiredUnit: 'mg',
    haveDose: 1000,
    haveUnit: 'mg',
    quantity: 10,
    quantityUnit: 'mL'
  }
];

export const INITIAL_MVP_FEATURES: MVPFeature[] = [
  {
    id: 'f1',
    title: 'Medication Dosage Calculator',
    description: 'Calculates the exact amount of liquid medication to administer using the standard "Desired over Have" formula.',
    status: 'completed',
    category: 'Core'
  },
  {
    id: 'f2',
    title: 'IV Drip Rate (gtts/min)',
    description: 'Calculates drops per minute for gravity infusions given a volume, time, and specific administration drop factor.',
    status: 'completed',
    category: 'Core'
  },
  {
    id: 'f3',
    title: 'IV Flow Rate & Duration',
    description: 'Calculates mL/hour and infusion duration, with bidirectional input validation.',
    status: 'completed',
    category: 'Core'
  },
  {
    id: 'f4',
    title: 'Pediatric Weight-Based Dosing',
    description: 'Safety-checked calculator that maps patient weight to recommended ranges (e.g. mg/kg/day) and flags potential dosage caps.',
    status: 'completed',
    category: 'Core'
  },
  {
    id: 'f5',
    title: 'iOS Widget & Quick-Access',
    description: 'Simulates the user experience of a high-fidelity home screen widget designed to let nurses bypass navigation and launch calculators instantly.',
    status: 'completed',
    category: 'Interface'
  },
  {
    id: 'f6',
    title: 'Frequently-Used Drug Presets',
    description: 'Permits saving frequently computed drugs and concentration presets locally to streamline high-intensity shifts.',
    status: 'completed',
    category: 'Interface'
  },
  {
    id: 'f7',
    title: '100% Offline Capability & Safety Verification',
    description: 'Ensures zero latency and secure on-the-device storage with formula visualization to guarantee double-checked clinical accuracy.',
    status: 'completed',
    category: 'Advanced'
  },
  {
    id: 'f8',
    title: 'Custom Formula Customizer',
    description: 'Proposed capability allowing medical staff to toggle specialized formulas (e.g., BSA, Parkland, or Pediatric rule-of-thumb limits) on/off.',
    status: 'planned',
    category: 'Advanced'
  }
];
