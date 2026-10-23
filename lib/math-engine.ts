import {
  AnswerValue,
  AssociationMetric,
  BeliefVsRealityMetric,
  DerivedParticipantScore,
  FactorKey,
  QuestionnaireAnswers,
  ResearchSubmission,
  StressCategory,
  TruthTableData,
  TruthTableRow,
  VennCounts,
  AggregateResearchData,
} from './types';

/**
 * Single Source of Truth for Scoring:
 * - Each factor score is sum of 3 questions (0 to 3 each), max score = 9.
 * - Factor membership rule: score >= 6 out of 9.
 * - Stress total is sum of 4 questions (0 to 3 each), max score = 12.
 * - Stress indicator = (stress total / 12) * 100.
 * - Educational categories:
 *    0-3: Lower indicator
 *    4-7: Moderate indicator
 *    8-12: Higher indicator
 * - Set E (elevated project-defined stress): total stress score >= 4.
 */

export function calculateParticipantScore(answers: QuestionnaireAnswers): DerivedParticipantScore {
  const sum = (arr: number[]) => arr.reduce((acc, curr) => acc + curr, 0);

  const scoreP = sum(answers.procrastination);
  const scoreS = sum(answers.sleep);
  const scoreF = sum(answers.pressure);
  const scoreStress = sum(answers.stress);

  const isP = scoreP >= 6;
  const isS = scoreS >= 6;
  const isF = scoreF >= 6;
  const isE = scoreStress >= 4;

  const stressPercentage = Math.round((scoreStress / 12) * 100);

  let stressCategory: StressCategory = 'lower';
  if (scoreStress >= 8) {
    stressCategory = 'higher';
  } else if (scoreStress >= 4) {
    stressCategory = 'moderate';
  }

  // Find dominant factor(s)
  const factorScores: { factor: FactorKey; score: number }[] = [
    { factor: 'P', score: scoreP },
    { factor: 'S', score: scoreS },
    { factor: 'F', score: scoreF },
  ];

  const maxScore = Math.max(...factorScores.map((f) => f.score));
  const topFactors = factorScores.filter((f) => f.score === maxScore).map((f) => f.factor);

  const dominantFactor: FactorKey | 'tied' = topFactors.length === 1 ? topFactors[0] : 'tied';

  // Educational recommendations
  const recommendations: string[] = [];

  if (isP) {
    recommendations.push(
      'The 10-Minute Momentum Rule: When a revision task feels intimidating, commit to working on it for exactly 10 minutes without expecting perfection. Once the activation energy hurdle is crossed, continue only if momentum allows.'
    );
  }
  if (isS) {
    recommendations.push(
      'Circadian Sleep Anchor: Set a non-negotiable wake-up time regardless of when you slept, and initiate a 45-minute device-free wind-down routine prior to bed to preserve REM cognitive consolidation.'
    );
  }
  if (isF) {
    recommendations.push(
      'Expectation Boundary Protocol: Separate internal study milestones from external perceived family/peer demands. Explicitly define what constitutes "enough for today" using measurable, realistic task chunks.'
    );
  }

  // If multiple or no specific factor rule met
  const activeCount = (isP ? 1 : 0) + (isS ? 1 : 0) + (isF ? 1 : 0);
  if (activeCount >= 2) {
    recommendations.push(
      'Cross-Factor Recovery Triage: When multiple pressure points overlap, avoid trying to optimize everything at once. Prioritize sleep stability first, as cognitive resilience directly reduces procrastination avoidance loops.'
    );
  } else if (activeCount === 0) {
    recommendations.push(
      'Balanced Routine Maintenance: Your responses indicate balanced baseline pressure levels. Continue tracking sleep consistency and scheduling planned rest periods before peak revision crunch periods.'
    );
  }

  return {
    scoreP,
    scoreS,
    scoreF,
    scoreStress,
    stressPercentage,
    stressCategory,
    isP,
    isS,
    isF,
    isE,
    dominantFactor,
    dominantFactorsList: topFactors,
    recommendations: recommendations.slice(0, 3),
  };
}

/**
 * Exact Venn Region Calculations & Principle of Inclusion-Exclusion
 * Derived directly from individual row-level flags, cross-checked with set algebraic equations.
 */
export function calculateVennCounts(
  submissions: { isP: boolean; isS: boolean; isF: boolean }[]
): VennCounts {
  const total = submissions.length;

  if (total === 0) {
    return {
      total: 0,
      sizeP: 0,
      sizeS: 0,
      sizeF: 0,
      interPS: 0,
      interPF: 0,
      interSF: 0,
      psf: 0,
      unionPSF: 0,
      pOnly: 0,
      sOnly: 0,
      fOnly: 0,
      psOnly: 0,
      pfOnly: 0,
      sfOnly: 0,
      psfExact: 0,
      none: 0,
      exactlyOne: 0,
      exactlyTwo: 0,
      allThree: 0,
      noneCount: 0,
      pOnlyPct: 0,
      sOnlyPct: 0,
      fOnlyPct: 0,
      psOnlyPct: 0,
      pfOnlyPct: 0,
      sfOnlyPct: 0,
      psfPct: 0,
      nonePct: 0,
      unionPct: 0,
    };
  }

  // Row-level direct count of all 8 mutually exclusive regions
  let pOnly = 0;
  let sOnly = 0;
  let fOnly = 0;
  let psOnly = 0;
  let pfOnly = 0;
  let sfOnly = 0;
  let psf = 0;
  let none = 0;

  let sizeP = 0;
  let sizeS = 0;
  let sizeF = 0;
  let interPS = 0;
  let interPF = 0;
  let interSF = 0;

  for (const s of submissions) {
    const { isP, isS, isF } = s;

    if (isP) sizeP++;
    if (isS) sizeS++;
    if (isF) sizeF++;

    if (isP && isS) interPS++;
    if (isP && isF) interPF++;
    if (isS && isF) interSF++;

    if (isP && isS && isF) {
      psf++;
    } else if (isP && isS && !isF) {
      psOnly++;
    } else if (isP && !isS && isF) {
      pfOnly++;
    } else if (!isP && isS && isF) {
      sfOnly++;
    } else if (isP && !isS && !isF) {
      pOnly++;
    } else if (!isP && isS && !isF) {
      sOnly++;
    } else if (!isP && !isS && isF) {
      fOnly++;
    } else {
      none++;
    }
  }

  // Principle of Inclusion-Exclusion Cross-Check
  // |P ∪ S ∪ F| = |P| + |S| + |F| - |P ∩ S| - |P ∩ F| - |S ∩ F| + |P ∩ S ∩ F|
  const pieUnion = sizeP + sizeS + sizeF - interPS - interPF - interSF + psf;
  const directUnion = pOnly + sOnly + fOnly + psOnly + pfOnly + sfOnly + psf;

  if (pieUnion !== directUnion) {
    console.warn(`PIE check mismatch: pieUnion=${pieUnion}, directUnion=${directUnion}`);
  }

  // Cross-check exact formula regions
  const f_pOnly = sizeP - interPS - interPF + psf;
  const f_sOnly = sizeS - interPS - interSF + psf;
  const f_fOnly = sizeF - interPF - interSF + psf;
  const f_psOnly = interPS - psf;
  const f_pfOnly = interPF - psf;
  const f_sfOnly = interSF - psf;

  if (
    f_pOnly !== pOnly ||
    f_sOnly !== sOnly ||
    f_fOnly !== fOnly ||
    f_psOnly !== psOnly ||
    f_pfOnly !== pfOnly ||
    f_sfOnly !== sfOnly
  ) {
    console.warn('Venn formula cross-check found discrepancy against row-level counts');
  }

  const exactlyOne = pOnly + sOnly + fOnly;
  const exactlyTwo = psOnly + pfOnly + sfOnly;
  const allThree = psf;
  const noneCount = none;

  const pct = (val: number) => Number(((val / total) * 100).toFixed(1));

  return {
    total,
    sizeP,
    sizeS,
    sizeF,
    interPS,
    interPF,
    interSF,
    psf,
    unionPSF: directUnion,
    pOnly,
    sOnly,
    fOnly,
    psOnly,
    pfOnly,
    sfOnly,
    psfExact: psf,
    none,
    exactlyOne,
    exactlyTwo,
    allThree,
    noneCount,
    pOnlyPct: pct(pOnly),
    sOnlyPct: pct(sOnly),
    fOnlyPct: pct(fOnly),
    psOnlyPct: pct(psOnly),
    pfOnlyPct: pct(pfOnly),
    sfOnlyPct: pct(sfOnly),
    psfPct: pct(psf),
    nonePct: pct(none),
    unionPct: pct(directUnion),
  };
}

/**
 * Propositional Logic Lab:
 * Material implication: Antecedent -> Consequent
 * Truth value: False only when Antecedent is True and Consequent is False.
 */
export function calculateTruthTable(
  submissions: { factor: boolean; isE: boolean }[],
  factorKey: FactorKey
): TruthTableData {
  const total = submissions.length;

  let countTT = 0; // T -> T (True)
  let countTF = 0; // T -> F (False - Counterexample)
  let countFT = 0; // F -> T (True - Vacuous)
  let countFF = 0; // F -> F (True - Vacuous)

  for (const s of submissions) {
    if (s.factor && s.isE) countTT++;
    else if (s.factor && !s.isE) countTF++;
    else if (!s.factor && s.isE) countFT++;
    else if (!s.factor && !s.isE) countFF++;
  }

  const pct = (c: number) => (total > 0 ? Number(((c / total) * 100).toFixed(1)) : 0);

  const factorNames: Record<FactorKey, string> = {
    P: 'Procrastination',
    S: 'Sleep Deprivation',
    F: 'Social/Family Pressure',
  };

  const rows: TruthTableRow[] = [
    {
      antecedent: true,
      consequent: true,
      logicValue: true,
      count: countTT,
      percentage: pct(countTT),
      description: `${factorKey} is present, and elevated stress E is observed. Consistent with the implication hypothesis.`,
    },
    {
      antecedent: true,
      consequent: false,
      logicValue: false, // The Counterexample!
      count: countTF,
      percentage: pct(countTF),
      description: `COUNTEREXAMPLE: ${factorKey} is present, yet elevated stress E is NOT observed. This proves ${factorKey} alone is not a sufficient condition for elevated stress.`,
    },
    {
      antecedent: false,
      consequent: true,
      logicValue: true,
      count: countFT,
      percentage: pct(countFT),
      description: `${factorKey} is absent, yet elevated stress E occurs. Vacuously true under material implication (stress triggered by other factors).`,
    },
    {
      antecedent: false,
      consequent: false,
      logicValue: true,
      count: countFF,
      percentage: pct(countFF),
      description: `Neither ${factorKey} nor elevated stress E is present. Logically consistent under classical material implication.`,
    },
  ];

  const falseCount = countTF;
  const falsePct = pct(falseCount);

  const interpretation =
    total === 0
      ? 'Awaiting cohort responses to evaluate empirical logical validity.'
      : falseCount === 0
      ? `In this cohort, zero counterexamples were found (${factorKey} was never observed without elevated stress). However, material implication establishes logical consistency, not empirical causation.`
      : `${falseCount} student(s) (${falsePct}% of the sample) experienced ${factorNames[factorKey]} without reaching elevated stress. In formal propositional logic, these cases demonstrate that ${factorKey} → E is empirically falsified as a universal strict law.`;

  return {
    factor: factorKey,
    label: factorNames[factorKey],
    implicationFormula: `${factorKey} → E`,
    rows,
    falseCount,
    totalTested: total,
    falsePercentage: falsePct,
    interpretation,
  };
}

/**
 * Association Explorer:
 * Computes:
 * - Elevated stress rate among students with factor present: P(E | X)
 * - Elevated stress rate among students with factor absent: P(E | ~X)
 * - Difference in percentage points: P(E | X) - P(E | ~X)
 */
export function calculateAssociation(
  submissions: { factor: boolean; isE: boolean }[],
  factorKey: FactorKey
): AssociationMetric {
  const factorNames: Record<FactorKey, string> = {
    P: 'Procrastination (P)',
    S: 'Sleep Deprivation (S)',
    F: 'Social/Family Pressure (F)',
  };

  let presentCount = 0;
  let presentElevatedCount = 0;
  let absentCount = 0;
  let absentElevatedCount = 0;

  for (const s of submissions) {
    if (s.factor) {
      presentCount++;
      if (s.isE) presentElevatedCount++;
    } else {
      absentCount++;
      if (s.isE) absentElevatedCount++;
    }
  }

  const presentRate =
    presentCount > 0 ? Number(((presentElevatedCount / presentCount) * 100).toFixed(1)) : 0;
  const absentRate =
    absentCount > 0 ? Number(((absentElevatedCount / absentCount) * 100).toFixed(1)) : 0;
  const percentagePointDiff = Number((presentRate - absentRate).toFixed(1));

  return {
    factor: factorKey,
    name: factorNames[factorKey],
    factorPresentCount: presentCount,
    factorPresentElevatedCount: presentElevatedCount,
    factorPresentRate: presentRate,
    factorAbsentCount: absentCount,
    factorAbsentElevatedCount: absentElevatedCount,
    factorAbsentRate: absentRate,
    percentagePointDiff,
  };
}

/**
 * Beliefs vs Experience Comparison
 */
export function calculateBeliefComparison(
  submissions: { belief: boolean; isFactor: boolean; isE: boolean }[],
  factorKey: FactorKey
): BeliefVsRealityMetric {
  const factorNames: Record<FactorKey, string> = {
    P: 'Procrastination',
    S: 'Sleep Deprivation',
    F: 'Social/Family Pressure',
  };

  const total = submissions.length;
  let believedCount = 0;
  let believedAndPresent = 0;
  let believedAndAbsent = 0;
  let notBelievedAndPresent = 0;
  let notBelievedAndAbsent = 0;

  let believedElevatedCount = 0;
  let notBelievedElevatedCount = 0;

  for (const s of submissions) {
    if (s.belief) {
      believedCount++;
      if (s.isE) believedElevatedCount++;
      if (s.isFactor) believedAndPresent++;
      else believedAndAbsent++;
    } else {
      if (s.isE) notBelievedElevatedCount++;
      if (s.isFactor) notBelievedAndPresent++;
      else notBelievedAndAbsent++;
    }
  }

  const notBelievedCount = total - believedCount;
  const pct = (c: number) => (total > 0 ? Number(((c / total) * 100).toFixed(1)) : 0);

  const believedElevatedRate =
    believedCount > 0 ? Number(((believedElevatedCount / believedCount) * 100).toFixed(1)) : 0;
  const notBelievedElevatedRate =
    notBelievedCount > 0 ? Number(((notBelievedElevatedCount / notBelievedCount) * 100).toFixed(1)) : 0;

  return {
    factor: factorKey,
    name: factorNames[factorKey],
    believedCount,
    believedPct: pct(believedCount),
    believedAndPresentCount: believedAndPresent,
    believedAndAbsentCount: believedAndAbsent,
    notBelievedAndPresentCount: notBelievedAndPresent,
    notBelievedAndAbsentCount: notBelievedAndAbsent,
    believedElevatedRate,
    notBelievedElevatedRate,
  };
}

/**
 * Full Aggregation Engine across all Submissions
 */
export function aggregateResearchSubmissions(
  submissions: ResearchSubmission[],
  isDemo = false,
  collectionPeriod = 'Spring Semester 2026'
): AggregateResearchData {
  const n = submissions.length;

  if (n === 0) {
    const emptyVenn = calculateVennCounts([]);
    return {
      sampleSize: 0,
      isDemo,
      dataSourceLabel: `University Empirical Cohort (N=0 Submissions)`,
      collectionPeriod,
      venn: emptyVenn,
      elevatedStressCount: 0,
      elevatedStressPct: 0,
      predictedLeadingDistribution: { P: 0, S: 0, F: 0 },
      predictedLeadingPercentages: { P: 0, S: 0, F: 0 },
      actualDominantDistribution: { P: 0, S: 0, F: 0, tied: 0 },
      actualDominantPercentages: { P: 0, S: 0, F: 0, tied: 0 },
      actualLeadingFactor: 'tied',
      averagePredictedTripleOverlap: 0,
      actualTripleOverlapPct: 0,
      tripleOverlapDelta: 0,
      truthTables: {
        P: calculateTruthTable([], 'P'),
        S: calculateTruthTable([], 'S'),
        F: calculateTruthTable([], 'F'),
      },
      associations: [
        calculateAssociation([], 'P'),
        calculateAssociation([], 'S'),
        calculateAssociation([], 'F'),
      ],
      strongestAssociationFactor: 'tied',
      beliefsComparison: [
        calculateBeliefComparison([], 'P'),
        calculateBeliefComparison([], 'S'),
        calculateBeliefComparison([], 'F'),
      ],
      evidenceSummary: {
        mostPrevalentFactor: { factor: 'P', pct: 0 },
        tripleOverlap: { count: 0, pct: 0 },
        atLeastOneFactor: { count: 0, pct: 0 },
        largestAssociation: { factor: 'P', diff: 0 },
        predictionAccuracyLeadingPct: 0,
      },
    };
  }

  // Row mappings
  const vennRows = submissions.map((s) => ({
    isP: s.derived.isP,
    isS: s.derived.isS,
    isF: s.derived.isF,
  }));

  const venn = calculateVennCounts(vennRows);

  const elevatedCount = submissions.filter((s) => s.derived.isE).length;
  const elevatedPct = Number(((elevatedCount / n) * 100).toFixed(1));

  // Prediction aggregations
  const predCounts: Record<FactorKey, number> = { P: 0, S: 0, F: 0 };
  let predOverlapSum = 0;

  for (const s of submissions) {
    predCounts[s.prediction.leadingFactor]++;
    predOverlapSum += s.prediction.tripleOverlapPercentage;
  }

  const avgPredictedOverlap = Number((predOverlapSum / n).toFixed(1));
  const actualOverlapPct = venn.psfPct;
  const tripleOverlapDelta = Number((avgPredictedOverlap - actualOverlapPct).toFixed(1));

  const predPercentages: Record<FactorKey, number> = {
    P: Number(((predCounts.P / n) * 100).toFixed(1)),
    S: Number(((predCounts.S / n) * 100).toFixed(1)),
    F: Number(((predCounts.F / n) * 100).toFixed(1)),
  };

  // Actual dominant factors
  const domCounts: Record<FactorKey | 'tied', number> = { P: 0, S: 0, F: 0, tied: 0 };
  for (const s of submissions) {
    domCounts[s.derived.dominantFactor]++;
  }

  const domPercentages: Record<FactorKey | 'tied', number> = {
    P: Number(((domCounts.P / n) * 100).toFixed(1)),
    S: Number(((domCounts.S / n) * 100).toFixed(1)),
    F: Number(((domCounts.F / n) * 100).toFixed(1)),
    tied: Number(((domCounts.tied / n) * 100).toFixed(1)),
  };

  // Find actual leading factor
  const singleFactors: { factor: FactorKey; count: number }[] = [
    { factor: 'P', count: domCounts.P },
    { factor: 'S', count: domCounts.S },
    { factor: 'F', count: domCounts.F },
  ];
  singleFactors.sort((a, b) => b.count - a.count);

  const actualLeadingFactor: FactorKey | 'tied' =
    singleFactors[0].count === singleFactors[1].count ? 'tied' : singleFactors[0].factor;

  // Truth Tables
  const truthTables: Record<FactorKey, TruthTableData> = {
    P: calculateTruthTable(
      submissions.map((s) => ({ factor: s.derived.isP, isE: s.derived.isE })),
      'P'
    ),
    S: calculateTruthTable(
      submissions.map((s) => ({ factor: s.derived.isS, isE: s.derived.isE })),
      'S'
    ),
    F: calculateTruthTable(
      submissions.map((s) => ({ factor: s.derived.isF, isE: s.derived.isE })),
      'F'
    ),
  };

  // Associations
  const associations: AssociationMetric[] = [
    calculateAssociation(
      submissions.map((s) => ({ factor: s.derived.isP, isE: s.derived.isE })),
      'P'
    ),
    calculateAssociation(
      submissions.map((s) => ({ factor: s.derived.isS, isE: s.derived.isE })),
      'S'
    ),
    calculateAssociation(
      submissions.map((s) => ({ factor: s.derived.isF, isE: s.derived.isE })),
      'F'
    ),
  ];

  const sortedAssoc = [...associations].sort((a, b) => b.percentagePointDiff - a.percentagePointDiff);
  const strongestAssociationFactor: FactorKey | 'tied' =
    sortedAssoc[0].percentagePointDiff === sortedAssoc[1].percentagePointDiff
      ? 'tied'
      : sortedAssoc[0].factor;

  // Beliefs Comparison
  const beliefsComparison: BeliefVsRealityMetric[] = [
    calculateBeliefComparison(
      submissions.map((s) => ({
        belief: s.answers.beliefs.P,
        isFactor: s.derived.isP,
        isE: s.derived.isE,
      })),
      'P'
    ),
    calculateBeliefComparison(
      submissions.map((s) => ({
        belief: s.answers.beliefs.S,
        isFactor: s.derived.isS,
        isE: s.derived.isE,
      })),
      'S'
    ),
    calculateBeliefComparison(
      submissions.map((s) => ({
        belief: s.answers.beliefs.F,
        isFactor: s.derived.isF,
        isE: s.derived.isE,
      })),
      'F'
    ),
  ];

  // Most prevalent factor by set size
  const prevalences: { factor: FactorKey; size: number }[] = [
    { factor: 'P', size: venn.sizeP },
    { factor: 'S', size: venn.sizeS },
    { factor: 'F', size: venn.sizeF },
  ];
  prevalences.sort((a, b) => b.size - a.size);
  const mostPrevalent = prevalences[0];
  const mostPrevalentPct = Number(((mostPrevalent.size / n) * 100).toFixed(1));

  // Prediction accuracy on leading factor
  const accuracyLeadingPct =
    actualLeadingFactor !== 'tied' ? predPercentages[actualLeadingFactor] : 0;

  return {
    sampleSize: n,
    isDemo,
    dataSourceLabel: `University Empirical Cohort (N=${n} Verified Student Submissions)`,
    collectionPeriod,
    venn,
    elevatedStressCount: elevatedCount,
    elevatedStressPct: elevatedPct,
    predictedLeadingDistribution: predCounts,
    predictedLeadingPercentages: predPercentages,
    actualDominantDistribution: domCounts,
    actualDominantPercentages: domPercentages,
    actualLeadingFactor,
    averagePredictedTripleOverlap: avgPredictedOverlap,
    actualTripleOverlapPct: actualOverlapPct,
    tripleOverlapDelta,
    truthTables,
    associations,
    strongestAssociationFactor,
    beliefsComparison,
    evidenceSummary: {
      mostPrevalentFactor: { factor: mostPrevalent.factor, pct: mostPrevalentPct },
      tripleOverlap: { count: venn.psf, pct: venn.psfPct },
      atLeastOneFactor: { count: venn.unionPSF, pct: venn.unionPct },
      largestAssociation: {
        factor: sortedAssoc[0].factor,
        diff: sortedAssoc[0].percentagePointDiff,
      },
      predictionAccuracyLeadingPct: accuracyLeadingPct,
    },
  };
}

/**
 * What-If Simulator Math Engine:
 * Validates and computes set theory outcomes for arbitrary user parameters.
 */
export interface SimulatorInputs {
  totalN: number;
  sizeP: number;
  sizeS: number;
  sizeF: number;
  interPS: number;
  interPF: number;
  interSF: number;
  psf: number;
}

export interface SimulatorValidationResult {
  isValid: boolean;
  errors: string[];
  venn?: VennCounts;
}

export function computeSimulatorVenn(inputs: SimulatorInputs): SimulatorValidationResult {
  const { totalN, sizeP, sizeS, sizeF, interPS, interPF, interSF, psf } = inputs;
  const errors: string[] = [];

  if (totalN <= 0) errors.push('Total cohort size N must be greater than 0.');
  if (sizeP < 0 || sizeP > totalN) errors.push(`|P| must be between 0 and N (${totalN}).`);
  if (sizeS < 0 || sizeS > totalN) errors.push(`|S| must be between 0 and N (${totalN}).`);
  if (sizeF < 0 || sizeF > totalN) errors.push(`|F| must be between 0 and N (${totalN}).`);

  if (psf < 0) errors.push('Triple intersection |P ∩ S ∩ F| cannot be negative.');
  if (psf > interPS) errors.push('|P ∩ S ∩ F| cannot exceed pairwise intersection |P ∩ S|.');
  if (psf > interPF) errors.push('|P ∩ S ∩ F| cannot exceed pairwise intersection |P ∩ F|.');
  if (psf > interSF) errors.push('|P ∩ S ∩ F| cannot exceed pairwise intersection |S ∩ F|.');

  if (interPS > Math.min(sizeP, sizeS)) {
    errors.push('|P ∩ S| cannot exceed min(|P|, |S|).');
  }
  if (interPF > Math.min(sizeP, sizeF)) {
    errors.push('|P ∩ F| cannot exceed min(|P|, |F|).');
  }
  if (interSF > Math.min(sizeS, sizeF)) {
    errors.push('|S ∩ F| cannot exceed min(|S|, |F|).');
  }

  // Exact 8 regions
  const pOnly = sizeP - interPS - interPF + psf;
  const sOnly = sizeS - interPS - interSF + psf;
  const fOnly = sizeF - interPF - interSF + psf;

  const psOnly = interPS - psf;
  const pfOnly = interPF - psf;
  const sfOnly = interSF - psf;

  if (pOnly < 0) errors.push(`Region P only (${pOnly}) is negative. Adjust intersections.`);
  if (sOnly < 0) errors.push(`Region S only (${sOnly}) is negative. Adjust intersections.`);
  if (fOnly < 0) errors.push(`Region F only (${fOnly}) is negative. Adjust intersections.`);

  if (psOnly < 0) errors.push(`Region P ∩ S only (${psOnly}) is negative.`);
  if (pfOnly < 0) errors.push(`Region P ∩ F only (${pfOnly}) is negative.`);
  if (sfOnly < 0) errors.push(`Region S ∩ F only (${sfOnly}) is negative.`);

  const unionPSF = sizeP + sizeS + sizeF - interPS - interPF - interSF + psf;
  if (unionPSF > totalN) {
    errors.push(`Union |P ∪ S ∪ F| (${unionPSF}) exceeds total population N (${totalN}).`);
  }
  if (unionPSF < 0) {
    errors.push(`Union |P ∪ S ∪ F| (${unionPSF}) is negative.`);
  }

  const none = totalN - unionPSF;
  if (none < 0) {
    errors.push(`Region None (${none}) is negative.`);
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const pct = (val: number) => Number(((val / totalN) * 100).toFixed(1));

  return {
    isValid: true,
    errors: [],
    venn: {
      total: totalN,
      sizeP,
      sizeS,
      sizeF,
      interPS,
      interPF,
      interSF,
      psf,
      unionPSF,
      pOnly,
      sOnly,
      fOnly,
      psOnly,
      pfOnly,
      sfOnly,
      psfExact: psf,
      none,
      exactlyOne: pOnly + sOnly + fOnly,
      exactlyTwo: psOnly + pfOnly + sfOnly,
      allThree: psf,
      noneCount: none,
      pOnlyPct: pct(pOnly),
      sOnlyPct: pct(sOnly),
      fOnlyPct: pct(fOnly),
      psOnlyPct: pct(psOnly),
      pfOnlyPct: pct(pfOnly),
      sfOnlyPct: pct(sfOnly),
      psfPct: pct(psf),
      nonePct: pct(none),
      unionPct: pct(unionPSF),
    },
  };
}
