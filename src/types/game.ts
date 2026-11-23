export type ModuleType = 
  | 'cut-wire'
  | 'terminal-fix'
  | 'confusion-matrix'
  | 'pipeline-sequence'
  | 'tuning-dial'
  | 'tactical-choice';

export type AICategory = 
  | 'EDA' 
  | 'Data Preprocessing' 
  | 'Feature Engineering' 
  | 'Model Training' 
  | 'Model Evaluation';

export interface WireOption {
  id: string;
  color: 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'cyan';
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface TerminalFixOption {
  id: string;
  codeSnippet: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ConfusionMatrixData {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  targetMetric: 'precision' | 'recall' | 'accuracy' | 'f1';
  targetMetricLabel: string;
  correctAnswer: number; // e.g. 80 (for 80% or 0.80)
  tolerance?: number; // +/- 1
  hint: string;
}

export interface PipelineStep {
  id: string;
  name: string;
  order: number;
}

export interface TuningDialData {
  parameterName: string;
  description: string;
  scenario: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  targetRange: [number, number];
  currentValue: number;
  correctFeedback: string;
  wrongFeedback: string;
}

export interface TacticalChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface DefusalModule {
  id: string;
  title: string;
  category: AICategory;
  type: ModuleType;
  description: string;
  isDefused: boolean;
  penaltySeconds: number; // e.g., 45 or 60
  
  // Specific payload depending on module type
  wires?: WireOption[];
  terminalData?: {
    context: string;
    brokenCode: string;
    options: TerminalFixOption[];
  };
  matrixData?: ConfusionMatrixData;
  pipelineSteps?: PipelineStep[];
  dialData?: TuningDialData;
  tacticalOptions?: TacticalChoiceOption[];
}

export interface GameSettings {
  totalTimeSeconds: number; // e.g. 360 (6 minutes)
  maxStrikes: number; // e.g. 3
  penaltyPerStrikeSeconds: number; // e.g. 45 seconds penalty
}

export interface GameHistoryEntry {
  moduleId: string;
  moduleTitle: string;
  success: boolean;
  penaltyIncurred: number;
  timestamp: number;
}

export type PlayerStance = 'sitting' | 'standing';

export interface ExplorationState {
  hasKey: boolean;
  isChestOpen: boolean;
  showClueBook: boolean;
  playerStance: PlayerStance;
  isInteractingWithBomb: boolean;
}
