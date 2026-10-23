export type FactorKey = 'P' | 'S' | 'F';

export type StressCategory = 'lower' | 'moderate' | 'higher';

export type AnswerValue = 0 | 1 | 2 | 3;

export interface FactorItem {
  id: string;
  text: string;
}

export interface FactorInfo {
  key: FactorKey;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  bgClass: string;
  badgeClass: string;
  borderClass: string;
  accentHex: string;
  questions: FactorItem[];
}

export interface QuestionnaireAnswers {
  procrastination: [AnswerValue, AnswerValue, AnswerValue];
  sleep: [AnswerValue, AnswerValue, AnswerValue];
  pressure: [AnswerValue, AnswerValue, AnswerValue];
  stress: [AnswerValue, AnswerValue, AnswerValue, AnswerValue];
  beliefs: {
    P: boolean;
    S: boolean;
    F: boolean;
  };
}

export interface ParticipantPrediction {
  leadingFactor: FactorKey;
  tripleOverlapPercentage: number;
}

export interface DerivedParticipantScore {
  scoreP: number; // max 9
  scoreS: number; // max 9
  scoreF: number; // max 9
  scoreStress: number; // max 12
  stressPercentage: number; // (scoreStress / 12) * 100
  stressCategory: StressCategory;
  isP: boolean; // scoreP >= 6
  isS: boolean; // scoreS >= 6
  isF: boolean; // scoreF >= 6
  isE: boolean; // scoreStress >= 4
  dominantFactor: FactorKey | 'tied';
  dominantFactorsList: FactorKey[];
  recommendations: string[];
}

export interface ResearchSubmission {
  id: string;
  timestamp: string;
  consent: boolean;
  prediction: ParticipantPrediction;
  answers: QuestionnaireAnswers;
  derived: DerivedParticipantScore;
  isDemo?: boolean;
}

export interface VennCounts {
  total: number;
  sizeP: number;
  sizeS: number;
  sizeF: number;
  interPS: number;
  interPF: number;
  interSF: number;
  psf: number; // P ∩ S ∩ F
  unionPSF: number; // |P ∪ S ∪ F|
  
  // 8 mutually exclusive regions
  pOnly: number;
  sOnly: number;
  fOnly: number;
  psOnly: number;
  pfOnly: number;
  sfOnly: number;
  psfExact: number;
  none: number;

  // Breakdown by count
  exactlyOne: number;
  exactlyTwo: number;
  allThree: number;
  noneCount: number;

  // Percentages
  pOnlyPct: number;
  sOnlyPct: number;
  fOnlyPct: number;
  psOnlyPct: number;
  pfOnlyPct: number;
  sfOnlyPct: number;
  psfPct: number;
  nonePct: number;
  unionPct: number;
}

export interface TruthTableRow {
  antecedent: boolean;
  consequent: boolean;
  logicValue: boolean; // antecedent -> consequent (False only when T -> F)
  count: number;
  percentage: number;
  description: string;
}

export interface TruthTableData {
  factor: FactorKey;
  label: string;
  implicationFormula: string;
  rows: TruthTableRow[];
  falseCount: number;
  totalTested: number;
  falsePercentage: number;
  interpretation: string;
}

export interface AssociationMetric {
  factor: FactorKey;
  name: string;
  factorPresentCount: number;
  factorPresentElevatedCount: number;
  factorPresentRate: number; // 0 to 100
  factorAbsentCount: number;
  factorAbsentElevatedCount: number;
  factorAbsentRate: number; // 0 to 100
  percentagePointDiff: number; // presentRate - absentRate
}

export interface BeliefVsRealityMetric {
  factor: FactorKey;
  name: string;
  believedCount: number;
  believedPct: number;
  believedAndPresentCount: number;
  believedAndAbsentCount: number;
  notBelievedAndPresentCount: number;
  notBelievedAndAbsentCount: number;
  believedElevatedRate: number;
  notBelievedElevatedRate: number;
}

export interface AggregateResearchData {
  sampleSize: number;
  isDemo: boolean;
  dataSourceLabel: string;
  collectionPeriod: string;
  
  // Set prevalences
  venn: VennCounts;
  elevatedStressCount: number;
  elevatedStressPct: number;

  // Predictions vs Reality
  predictedLeadingDistribution: Record<FactorKey, number>;
  predictedLeadingPercentages: Record<FactorKey, number>;
  actualDominantDistribution: Record<FactorKey | 'tied', number>;
  actualDominantPercentages: Record<FactorKey | 'tied', number>;
  actualLeadingFactor: FactorKey | 'tied';
  averagePredictedTripleOverlap: number;
  actualTripleOverlapPct: number;
  tripleOverlapDelta: number;

  // Logic & Associations
  truthTables: Record<FactorKey, TruthTableData>;
  associations: AssociationMetric[];
  strongestAssociationFactor: FactorKey | 'tied';
  beliefsComparison: BeliefVsRealityMetric[];

  // Evidence synthesis
  evidenceSummary: {
    mostPrevalentFactor: { factor: FactorKey; pct: number };
    tripleOverlap: { count: number; pct: number };
    atLeastOneFactor: { count: number; pct: number };
    largestAssociation: { factor: FactorKey; diff: number };
    predictionAccuracyLeadingPct: number;
  };
}
