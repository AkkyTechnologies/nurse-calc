export type CalculatorType = 'dosage' | 'drip-rate' | 'flow-rate' | 'pediatric' | 'widget-home' | 'planner';

export interface MedicationPreset {
  id: string;
  name: string;
  desiredDose: number;
  desiredUnit: string;
  haveDose: number;
  haveUnit: string;
  quantity: number;
  quantityUnit: string;
}

export interface MVPFeature {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'planned' | 'in-progress';
  category: 'Core' | 'Interface' | 'Advanced';
}

export interface FeedbackNote {
  id: string;
  timestamp: string;
  text: string;
}
