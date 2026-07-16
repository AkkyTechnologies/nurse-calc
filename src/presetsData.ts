import { MedicationPreset, PediatricPreset } from './types';

export const INITIAL_PRESETS: MedicationPreset[] = [
  {
    id: '1',
    name: 'Example',
    desiredDose: 4,
    desiredUnit: 'mg',
    haveDose: 10,
    haveUnit: 'mg',
    quantity: 1,
    quantityUnit: 'mL'
  }
];

export const INITIAL_PEDIATRIC_PRESETS: PediatricPreset[] = [
  {
    id: 'ped_1',
    name: 'Example',
    recommendedDose: 15,
    dosingType: 'dose',
    defaultDividedBy: 1
  }
];
