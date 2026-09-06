export type VisualType =
  | 'difference_of_squares_3d'
  | 'perfect_square_3d'
  | 'common_factor_3d'
  | 'grouped_blocks_3d'
  | 'quadratic_tiles_3d'
  | 'generic_algebra_3d';

export type ResolutionSource = 'cache' | 'heuristic' | 'ai';

export interface DimensionParams {
  x: number;
  a: number;
  b?: number;
  c?: number;
  depth?: number;
}

export interface DimensionLabel {
  text: string;
  position: [number, number, number];
  color?: string;
}

export interface VisualState {
  type: VisualType;
  dimensions: DimensionParams;
  action: 'initial_state' | 'slice_cut' | 'separate' | 'rearrange' | 'highlight' | 'final_factored';
  highlightColor?: string;
  cameraPosition?: [number, number, number];
  labels?: DimensionLabel[];
  cutoutProgress?: number; // 0 to 1
  slideProgress?: number;  // 0 to 1
  rotationAngle?: number;  // radians
}

export interface AlgebraArrow {
  fromIndex: number;
  toIndex: number;
  label: string;
  color: string;
}

export interface AlgebraToken {
  text: string;
  type: 'variable' | 'constant' | 'operator' | 'bracket' | 'product';
  color?: string;
  highlight?: boolean;
  isCommonFactor?: boolean;
  isRemaining?: boolean;
  isDistributor?: boolean;
  isReplaced?: boolean;
  isResultOfReplacement?: boolean;
  replacedFrom?: string;
}

export interface FactorTermGroup {
  originalText: string;
  commonFactor: string;
  remaining: string;
  sign?: string;
}

export interface AlgebraAnimationData {
  type: 'initial' | 'distribution' | 'products' | 'combine' | 'final' | 'factorization' | 'factor_extraction' | 'development_distribute' | 'development_replace';
  tokens?: AlgebraToken[];
  arrows?: AlgebraArrow[];
  highlightPairs?: [number, number][];
  activeExplanation?: string;
  commonFactorText?: string;
  distributingFactorText?: string;
  replacedTermsText?: string;
  termGroups?: FactorTermGroup[];
  factorizationPhase?: 'initial' | 'reveal_red' | 'extract_front' | 'group_remaining' | 'simplified';
  developmentPhase?: 'initial' | 'distributor_red' | 'gliding_motion' | 'replaced_in_red' | 'reduced';
}

export interface MathStep {
  stepNumber: number;
  title: string;
  explanation: string;
  appliedRule: string;
  latex: string;
  visualState: VisualState;
  algebraAnimation?: AlgebraAnimationData;
}

export interface ExpressionSolution {
  id: string; // SHA-256
  rawExpression: string;
  normalizedExpression: string;
  operationType: 'factorization' | 'simplification' | 'expansion' | 'solve';
  finalFormLatex: string;
  summary: string;
  source: ResolutionSource;
  cachedAt: string;
  latencyMs: number;
  steps: MathStep[];
}

export interface StudioMetrics {
  totalRequests: number;
  cacheHits: number;
  heuristicResolutions: number;
  aiCalls: number;
  stepsCompleted: number;
  totalStepsViewed: number;
  cacheHitRate: number;
  heuristicRate: number;
  aiCallRate: number;
  completionRate: number;
}
