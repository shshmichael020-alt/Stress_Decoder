import { createClient } from '@supabase/supabase-js';
import {
  AggregateResearchData,
  QuestionnaireAnswers,
  ParticipantPrediction,
  ResearchSubmission,
} from './types';
import { calculateParticipantScore, aggregateResearchSubmissions } from './math-engine';
import { INITIAL_DEMO_SUBMISSIONS } from './demo-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project'));
}

export function getPublicSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(supabaseUrl!, supabaseAnonKey!);
}

export function getServerSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  // Use service key if available for server aggregations, else fallback to anon key
  const key = supabaseServiceKey || supabaseAnonKey!;
  return createClient(supabaseUrl!, key);
}

// In-memory submissions repository for local/demo runs or fallback
let localSubmissions: ResearchSubmission[] = [];

export function getLocalSubmissions(): ResearchSubmission[] {
  return localSubmissions;
}

export function addLocalSubmission(submission: ResearchSubmission): void {
  localSubmissions = [submission, ...localSubmissions];
}

export function clearLocalSubmissions(): void {
  localSubmissions = [];
}

/**
 * Validates questionnaire answer values (0-3) and predictions
 */
export function validateSubmissionPayload(payload: {
  prediction: ParticipantPrediction;
  answers: QuestionnaireAnswers;
  consent: boolean;
}): { valid: boolean; error?: string } {
  if (!payload.consent) {
    return { valid: false, error: 'Informed consent must be confirmed before submission.' };
  }

  const { prediction, answers } = payload;
  if (!['P', 'S', 'F'].includes(prediction.leadingFactor)) {
    return { valid: false, error: 'Valid predicted leading factor (P, S, or F) is required.' };
  }

  if (
    typeof prediction.tripleOverlapPercentage !== 'number' ||
    prediction.tripleOverlapPercentage < 0 ||
    prediction.tripleOverlapPercentage > 100
  ) {
    return { valid: false, error: 'Predicted triple overlap must be a percentage between 0 and 100.' };
  }

  const validate3 = (arr: number[]) =>
    Array.isArray(arr) && arr.length === 3 && arr.every((v) => [0, 1, 2, 3].includes(v));
  const validate4 = (arr: number[]) =>
    Array.isArray(arr) && arr.length === 4 && arr.every((v) => [0, 1, 2, 3].includes(v));

  if (!validate3(answers.procrastination)) {
    return { valid: false, error: 'Round 1 (Procrastination) answers must have 3 values between 0 and 3.' };
  }
  if (!validate3(answers.sleep)) {
    return { valid: false, error: 'Round 2 (Sleep) answers must have 3 values between 0 and 3.' };
  }
  if (!validate3(answers.pressure)) {
    return { valid: false, error: 'Round 3 (Pressure) answers must have 3 values between 0 and 3.' };
  }
  if (!validate4(answers.stress)) {
    return { valid: false, error: 'Round 4 (Stress) answers must have 4 values between 0 and 3.' };
  }

  if (
    typeof answers.beliefs?.P !== 'boolean' ||
    typeof answers.beliefs?.S !== 'boolean' ||
    typeof answers.beliefs?.F !== 'boolean'
  ) {
    return { valid: false, error: 'All three belief questions must be answered with boolean values.' };
  }

  return { valid: true };
}

/**
 * Submits an anonymous participant record
 */
export async function submitResearchData(payload: {
  prediction: ParticipantPrediction;
  answers: QuestionnaireAnswers;
  consent: boolean;
  clientToken?: string;
}): Promise<{ success: boolean; submission?: ResearchSubmission; error?: string; isLiveDb?: boolean }> {
  const validation = validateSubmissionPayload(payload);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const derived = calculateParticipantScore(payload.answers);
  const submissionId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const timestamp = new Date().toISOString();

  const submission: ResearchSubmission = {
    id: submissionId,
    timestamp,
    consent: payload.consent,
    prediction: payload.prediction,
    answers: payload.answers,
    derived,
    isDemo: !isSupabaseConfigured(),
  };

  if (!isSupabaseConfigured()) {
    addLocalSubmission(submission);
    return {
      success: true,
      submission,
      isLiveDb: false,
    };
  }

  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      addLocalSubmission(submission);
      return { success: true, submission, isLiveDb: false };
    }

    const dbRow = {
      consent_given: payload.consent,
      predicted_leading_factor: payload.prediction.leadingFactor,
      predicted_triple_overlap_pct: payload.prediction.tripleOverlapPercentage,
      ans_p1: payload.answers.procrastination[0],
      ans_p2: payload.answers.procrastination[1],
      ans_p3: payload.answers.procrastination[2],
      ans_s1: payload.answers.sleep[0],
      ans_s2: payload.answers.sleep[1],
      ans_s3: payload.answers.sleep[2],
      ans_f1: payload.answers.pressure[0],
      ans_f2: payload.answers.pressure[1],
      ans_f3: payload.answers.pressure[2],
      ans_e1: payload.answers.stress[0],
      ans_e2: payload.answers.stress[1],
      ans_e3: payload.answers.stress[2],
      ans_e4: payload.answers.stress[3],
      belief_p: payload.answers.beliefs.P,
      belief_s: payload.answers.beliefs.S,
      belief_f: payload.answers.beliefs.F,
      client_token: payload.clientToken || null,
    };

    const { data, error } = await supabase.from('anonymous_submissions').insert([dbRow]).select('id, created_at').single();

    if (error) {
      console.error('Supabase insert error, falling back to local memory:', error);
      addLocalSubmission(submission);
      return {
        success: true,
        submission,
        isLiveDb: false,
        error: `Database insert failed (${error.message}). Saved to local session.`,
      };
    }

    if (data) {
      submission.id = data.id;
      submission.timestamp = data.created_at;
      submission.isDemo = false;
    }

    return { success: true, submission, isLiveDb: true };
  } catch (err: any) {
    console.error('Submission failure exception:', err);
    addLocalSubmission(submission);
    return {
      success: true,
      submission,
      isLiveDb: false,
      error: 'Network error contacting database. Stored in session memory.',
    };
  }
}

/**
 * Loads aggregated research data
 * If Supabase is connected and has submissions, loads live data.
 * Otherwise returns the illustrative demo dataset (N=412) clearly tagged.
 */
export async function fetchResearchAggregate(forceMode?: 'demo' | 'live'): Promise<AggregateResearchData> {
  if (forceMode === 'demo' || !isSupabaseConfigured()) {
    // If local submissions exist from current session, we can include them or return pure demo
    return aggregateResearchSubmissions(INITIAL_DEMO_SUBMISSIONS, true, 'Cohort Spring 2026 (N=412)');
  }

  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return aggregateResearchSubmissions(INITIAL_DEMO_SUBMISSIONS, true);
    }

    // Read submissions using service role or public view
    const { data, error } = await supabase
      .from('anonymous_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Return empty or demo with clear tag
      if (forceMode === 'live') {
        return aggregateResearchSubmissions([], false, 'Live Database (0 submissions)');
      }
      return aggregateResearchSubmissions(INITIAL_DEMO_SUBMISSIONS, true);
    }

    // Map database rows to ResearchSubmission objects
    const submissions: ResearchSubmission[] = data.map((row: any) => {
      const answers: QuestionnaireAnswers = {
        procrastination: [row.ans_p1, row.ans_p2, row.ans_p3],
        sleep: [row.ans_s1, row.ans_s2, row.ans_s3],
        pressure: [row.ans_f1, row.ans_f2, row.ans_f3],
        stress: [row.ans_e1, row.ans_e2, row.ans_e3, row.ans_e4],
        beliefs: {
          P: row.belief_p,
          S: row.belief_s,
          F: row.belief_f,
        },
      };

      const derived = calculateParticipantScore(answers);

      return {
        id: row.id,
        timestamp: row.created_at,
        consent: row.consent_given,
        prediction: {
          leadingFactor: row.predicted_leading_factor,
          tripleOverlapPercentage: Number(row.predicted_triple_overlap_pct),
        },
        answers,
        derived,
        isDemo: false,
      };
    });

    return aggregateResearchSubmissions(submissions, false, 'Live Empirical Submissions');
  } catch (err) {
    console.error('Error fetching from Supabase, returning demo cohort:', err);
    return aggregateResearchSubmissions(INITIAL_DEMO_SUBMISSIONS, true);
  }
}

/**
 * CSV Generation for Section 12
 */
export function generateAggregateCSV(data: AggregateResearchData): string {
  const lines: string[] = [
    `"EXAM STRESS TRIANGLE LAB — AGGREGATE RESEARCH DATA EXPORT"`,
    `"Dataset","${data.dataSourceLabel}"`,
    `"Sample Size (N)","${data.sampleSize}"`,
    `"Collection Period","${data.collectionPeriod}"`,
    `"Export Timestamp","${new Date().toISOString()}"`,
    ``,
    `"FACTOR PREVALENCE & SET SIZES"`,
    `"Set","Description","Count","Percentage"`,
    `"P","Procrastination (Score >= 6)","${data.venn.sizeP}","${((data.venn.sizeP / Math.max(1, data.sampleSize)) * 100).toFixed(1)}%"`,
    `"S","Sleep Deprivation (Score >= 6)","${data.venn.sizeS}","${((data.venn.sizeS / Math.max(1, data.sampleSize)) * 100).toFixed(1)}%"`,
    `"F","Social/Family Pressure (Score >= 6)","${data.venn.sizeF}","${((data.venn.sizeF / Math.max(1, data.sampleSize)) * 100).toFixed(1)}%"`,
    `"E","Elevated Stress Indicator (Score >= 4)","${data.elevatedStressCount}","${data.elevatedStressPct}%"`,
    `"P ∪ S ∪ F","At Least One Factor Present","${data.venn.unionPSF}","${data.venn.unionPct}%"`,
    ``,
    `"PREDICTIONS VS REALITY"`,
    `"Metric","Predicted","Observed Actual","Difference"`,
    `"Predicted Leading Factor P","${data.predictedLeadingPercentages.P}%","${data.actualDominantPercentages.P}%","${(data.predictedLeadingPercentages.P - data.actualDominantPercentages.P).toFixed(1)} pp"`,
    `"Predicted Leading Factor S","${data.predictedLeadingPercentages.S}%","${data.actualDominantPercentages.S}%","${(data.predictedLeadingPercentages.S - data.actualDominantPercentages.S).toFixed(1)} pp"`,
    `"Predicted Leading Factor F","${data.predictedLeadingPercentages.F}%","${data.actualDominantPercentages.F}%","${(data.predictedLeadingPercentages.F - data.actualDominantPercentages.F).toFixed(1)} pp"`,
    `"Triple Overlap |P ∩ S ∩ F|","${data.averagePredictedTripleOverlap}%","${data.actualTripleOverlapPct}%","${data.tripleOverlapDelta} pp"`,
  ];
  return lines.join('\n');
}

export function generateVennRegionsCSV(data: AggregateResearchData): string {
  const v = data.venn;
  const lines: string[] = [
    `"EXAM STRESS TRIANGLE — 8 MUTUALLY EXCLUSIVE VENN REGIONS"`,
    `"Dataset","${data.dataSourceLabel}"`,
    `"Sample Size (N)","${data.sampleSize}"`,
    `"Region Number","Region Symbolic Formula","Meaning","Count","Percentage"`,
    `1,"P ∧ ¬S ∧ ¬F","Procrastination ONLY","${v.pOnly}","${v.pOnlyPct}%"`,
    `2,"¬P ∧ S ∧ ¬F","Sleep Deprivation ONLY","${v.sOnly}","${v.sOnlyPct}%"`,
    `3,"¬P ∧ ¬S ∧ F","Social/Family Pressure ONLY","${v.fOnly}","${v.fOnlyPct}%"`,
    `4,"P ∧ S ∧ ¬F","Procrastination & Sleep ONLY","${v.psOnly}","${v.psOnlyPct}%"`,
    `5,"P ∧ ¬S ∧ F","Procrastination & Pressure ONLY","${v.pfOnly}","${v.pfOnlyPct}%"`,
    `6,"¬P ∧ S ∧ F","Sleep & Pressure ONLY","${v.sfOnly}","${v.sfOnlyPct}%"`,
    `7,"P ∧ S ∧ F","All Three Factors Simultaneously","${v.psf}","${v.psfPct}%"`,
    `8,"¬P ∧ ¬S ∧ ¬F","None of the Three Factors","${v.none}","${v.nonePct}%"`,
    `"SUM","Check Total","Sum of all 8 regions","${v.pOnly + v.sOnly + v.fOnly + v.psOnly + v.pfOnly + v.sfOnly + v.psf + v.none}","100.0%"`,
    ``,
    `"INCLUSION-EXCLUSION PRINCIPLE"`,
    `"Term","Symbol","Count"`,
    `"|P|","Procrastination Total","${v.sizeP}"`,
    `"|S|","Sleep Total","${v.sizeS}"`,
    `"|F|","Pressure Total","${v.sizeF}"`,
    `"- |P ∩ S|","Subtract Pairwise P ∩ S","-${v.interPS}"`,
    `"- |P ∩ F|","Subtract Pairwise P ∩ F","-${v.interPF}"`,
    `"- |S ∩ F|","Subtract Pairwise S ∩ F","-${v.interSF}"`,
    `"+ |P ∩ S ∩ F|","Add Triple Intersection","+${v.psf}"`,
    `"= |P ∪ S ∪ F|","Calculated Union","${v.unionPSF}"`,
  ];
  return lines.join('\n');
}

export function generateTruthTableCSV(data: AggregateResearchData): string {
  const lines: string[] = [
    `"EXAM STRESS TRIANGLE — PROPOSITIONAL LOGIC TRUTH TABLES (X → E)"`,
    `"Dataset","${data.dataSourceLabel}"`,
    `"Implication","Antecedent (X)","Consequent (E)","Formal Logical Truth","Observed Count","Cohort %","Pedagogical Meaning"`,
  ];

  (['P', 'S', 'F'] as const).forEach((f) => {
    const table = data.truthTables[f];
    table.rows.forEach((r) => {
      lines.push(
        `"${table.implicationFormula}","${r.antecedent ? 'T' : 'F'}","${r.consequent ? 'T' : 'F'}","${r.logicValue ? 'TRUE' : 'FALSE (Counterexample)'}","${r.count}","${r.percentage}%","${r.description.replace(/"/g, '""')}"`
      );
    });
  });

  return lines.join('\n');
}
