export type CalculatorType = 'dosage' | 'drip-rate' | 'flow-rate' | 'pediatric' | 'planner';

// Minimum shape a favorite/preset needs for the shared favorites hook + carousel.
export interface FavoriteItem {
  id: string;
  name: string;
}

export interface MedicationPreset extends FavoriteItem {
  desiredDose: number;
  desiredUnit: string;
  haveDose: number;
  haveUnit: string;
  quantity: number;
  quantityUnit: string;
}

export interface PediatricPreset extends FavoriteItem {
  recommendedDose: number;
  dosingType: 'day' | 'dose'; // mg/kg/day vs mg/kg/dose
  defaultDividedBy: number;
  maxAdultDoseMg: number;
}
