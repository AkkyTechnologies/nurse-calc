import { MedicationPreset, PediatricPreset } from './types';

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

export const INITIAL_PEDIATRIC_PRESETS: PediatricPreset[] = [
  {
    id: 'ped_1',
    name: 'Amoxicillin (High Dose)',
    recommendedDose: 90,
    dosingType: 'day',
    defaultDividedBy: 2,
    maxAdultDoseMg: 2000
  },
  {
    id: 'ped_2',
    name: 'Acetaminophen (Tylenol)',
    recommendedDose: 15,
    dosingType: 'dose',
    defaultDividedBy: 1,
    maxAdultDoseMg: 1000
  },
  {
    id: 'ped_3',
    name: 'Ibuprofen (Motrin)',
    recommendedDose: 10,
    dosingType: 'dose',
    defaultDividedBy: 1,
    maxAdultDoseMg: 800
  },
  {
    id: 'ped_4',
    name: 'Cephalexin (Keflex)',
    recommendedDose: 40,
    dosingType: 'day',
    defaultDividedBy: 4,
    maxAdultDoseMg: 1000
  }
];
