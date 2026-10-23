import { QuestionnaireAnswers, ResearchSubmission, AnswerValue, FactorKey } from './types';
import { calculateParticipantScore } from './math-engine';

/**
 * Deterministic PRNG to generate reproducible synthetic student records
 * matching cohort N=412 from University Mathematics Experimental Learning Project (Spring 2026).
 */
function createLcg(seed: number) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function generateDemoSubmissions(): ResearchSubmission[] {
  const rand = createLcg(20260412);
  const submissions: ResearchSubmission[] = [];

  const factors: FactorKey[] = ['P', 'S', 'F'];

  for (let i = 1; i <= 412; i++) {
    // Generate realistic profiles:
    // Some students are high on all (triple overlap ~34.6%)
    // Some high on P & S, P & F, S & F, single factors, or none.
    const profileRoll = rand();

    let targetP = false;
    let targetS = false;
    let targetF = false;

    if (profileRoll < 0.35) {
      // Triple overlap
      targetP = true;
      targetS = true;
      targetF = true;
    } else if (profileRoll < 0.52) {
      // P & S only
      targetP = true;
      targetS = true;
      targetF = false;
    } else if (profileRoll < 0.62) {
      // P & F only
      targetP = true;
      targetS = false;
      targetF = true;
    } else if (profileRoll < 0.70) {
      // S & F only
      targetP = false;
      targetS = true;
      targetF = true;
    } else if (profileRoll < 0.82) {
      // P only
      targetP = true;
      targetS = false;
      targetF = false;
    } else if (profileRoll < 0.90) {
      // S only
      targetP = false;
      targetS = true;
      targetF = false;
    } else if (profileRoll < 0.95) {
      // F only
      targetP = false;
      targetS = false;
      targetF = true;
    } else {
      // None
      targetP = false;
      targetS = false;
      targetF = false;
    }

    // Helper to generate 3 answers summing to >= 6 if target is true, or < 6 if false
    const genFactorAnswers = (target: boolean): [AnswerValue, AnswerValue, AnswerValue] => {
      let a1: AnswerValue = 0;
      let a2: AnswerValue = 0;
      let a3: AnswerValue = 0;
      let score = 0;
      let attempts = 0;

      do {
        a1 = Math.floor(rand() * 4) as AnswerValue;
        a2 = Math.floor(rand() * 4) as AnswerValue;
        a3 = Math.floor(rand() * 4) as AnswerValue;
        score = a1 + a2 + a3;
        attempts++;
      } while ((target ? score < 6 : score >= 6) && attempts < 100);

      // fallback
      if (target && score < 6) return [2, 2, 2];
      if (!target && score >= 6) return [1, 1, 1];

      return [a1, a2, a3];
    };

    const pAnswers = genFactorAnswers(targetP);
    const sAnswers = genFactorAnswers(targetS);
    const fAnswers = genFactorAnswers(targetF);

    // Stress answers: elevated stress (total >= 4) correlated with active factors
    const activeCount = (targetP ? 1 : 0) + (targetS ? 1 : 0) + (targetF ? 1 : 0);
    const targetElevated = rand() < (activeCount === 3 ? 0.92 : activeCount === 2 ? 0.82 : activeCount === 1 ? 0.68 : 0.28);

    const genStressAnswers = (targetElevatedStress: boolean): [AnswerValue, AnswerValue, AnswerValue, AnswerValue] => {
      let q1: AnswerValue = 0;
      let q2: AnswerValue = 0;
      let q3: AnswerValue = 0;
      let q4: AnswerValue = 0;
      let total = 0;
      let attempts = 0;

      do {
        q1 = Math.floor(rand() * 4) as AnswerValue;
        q2 = Math.floor(rand() * 4) as AnswerValue;
        q3 = Math.floor(rand() * 4) as AnswerValue;
        q4 = Math.floor(rand() * 4) as AnswerValue;
        total = q1 + q2 + q3 + q4;
        attempts++;
      } while ((targetElevatedStress ? total < 4 : total >= 4) && attempts < 100);

      if (targetElevatedStress && total < 4) return [2, 1, 1, 1];
      if (!targetElevatedStress && total >= 4) return [0, 1, 0, 1];

      return [q1, q2, q3, q4];
    };

    const stressAnswers = genStressAnswers(targetElevated);

    // Beliefs: students generally believe P, S, F increase stress, with some variation
    const beliefs = {
      P: rand() < 0.88,
      S: rand() < 0.84,
      F: rand() < 0.74,
    };

    // Prior Predictions:
    // Leading factor predicted: P (55%), S (30%), F (15%)
    const pRoll = rand();
    const leadingFactor: FactorKey = pRoll < 0.55 ? 'P' : pRoll < 0.85 ? 'S' : 'F';
    // Predicted triple overlap: centered around 30% - 40% with variance
    const tripleOverlapPercentage = Math.round(20 + rand() * 30);

    const answers: QuestionnaireAnswers = {
      procrastination: pAnswers,
      sleep: sAnswers,
      pressure: fAnswers,
      stress: stressAnswers,
      beliefs,
    };

    const derived = calculateParticipantScore(answers);

    const submission: ResearchSubmission = {
      id: `demo-${1000 + i}`,
      timestamp: new Date(Date.now() - (412 - i) * 3600 * 1000 * 4).toISOString(),
      consent: true,
      prediction: {
        leadingFactor,
        tripleOverlapPercentage,
      },
      answers,
      derived,
      isDemo: true,
    };

    submissions.push(submission);
  }

  return submissions;
}

export const INITIAL_DEMO_SUBMISSIONS = generateDemoSubmissions();
