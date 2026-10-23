import fs from 'fs';
import path from 'path';

interface StudentRecord {
  timestamp: string;
  name: string;
  branch: string;
  gender: string;
  q1_consent: string;
  q2_year: string;
  q3_delay: string;
  q4_postpone_freq: string;
  q5_less_time: string;
  q6_procrastination_belief: string;
  q7_sleep_under_7h: string;
  q8_sleepy_freq: string;
  q9_sleep_concentrate: string;
  q10_sleep_belief: string;
  q11_pressure_felt: string;
  q12_pressure_source: string;
  q13_pressure_interfere: string;
  q14_pressure_belief: string;
  q15_stress_rating: number;
  q16_difficult_combo: string;
  q17_primary_contributor: string;
  q18_none_guarantee: string;
  q19_reaction: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const csvPath = path.join(process.cwd(), 'data', 'survey_105.csv');
const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);

const rows = lines.slice(1);
console.log(`Total rows in CSV: ${rows.length}`);

// We will compute:
// 1. Procrastination Score (out of 9):
//    Q3: yes=3, Sometimes=2, NO/no=0
//    Q4: Never=0, Rarely=1, Sometimes=2, Often=2, Very often=3, Everytime=3
//    Q5: Yes=3, NO/no=0, Not applicable=1
//    Is P present? Score >= 6. (Or Q3=yes + Q4>=Often + Q5=Yes)
// 2. Sleep Deficit Score (out of 9):
//    Q7: Yes=3, No=0
//    Q8: Never=0, Rarely=1, Sometimes=2, Often=3, very often=3
//    Q9: Rarely=1, Sometimes=2, Often=3, Very often=3
//    Is S present? Score >= 6.
// 3. Social Pressure Score (out of 9):
//    Q11: Yes=3, No=0
//    Q12: If experienced external sources (Family, friends, comparisons) = 2-3, None/no=0
//    Q13: Rarely=1, Sometimes/Normal=2, Often=3, Very often=3
//    Is F present? Score >= 6.
// 4. Overall Stress (0-10 or 0-12):
//    Q15 is numeric (0-10). If Q15 >= 4 => Elevated Stress E = true.

let pCount = 0;
let sCount = 0;
let fCount = 0;
let eCount = 0;

let pOnly = 0;
let sOnly = 0;
let fOnly = 0;
let psOnly = 0;
let pfOnly = 0;
let sfOnly = 0;
let psf = 0;
let none = 0;

interface ProcessedStudent {
  id: string;
  name: string;
  branch: string;
  scoreP: number;
  scoreS: number;
  scoreF: number;
  scoreStress: number;
  isP: boolean;
  isS: boolean;
  isF: boolean;
  isE: boolean;
  ansP: [number, number, number];
  ansS: [number, number, number];
  ansF: [number, number, number];
  ansE: [number, number, number, number];
  beliefP: boolean;
  beliefS: boolean;
  beliefF: boolean;
  predictedLeading: 'P' | 'S' | 'F';
  q15_stress: number;
}

const processed: ProcessedStudent[] = [];

rows.forEach((line, index) => {
  const cols = parseCSVLine(line);
  if (cols.length < 19) return;

  const [
    timestamp,
    name,
    branch,
    gender,
    q1_consent,
    q2_year,
    q3_delay,
    q4_postpone,
    q5_less_time,
    q6_p_belief,
    q7_sleep,
    q8_sleepy,
    q9_sleep_conc,
    q10_s_belief,
    q11_pressure,
    q12_source,
    q13_interfere,
    q14_f_belief,
    q15_stress_str,
    q16_combo,
    q17_primary,
    q18_none,
    ...rest
  ] = cols;

  // Score P
  let p1 = 0;
  const dLow = (q3_delay || '').toLowerCase();
  if (dLow.includes('yes') || dLow.includes('everytime')) p1 = 3;
  else if (dLow.includes('sometimes')) p1 = 2;
  else p1 = 0;

  let p2 = 0;
  const postLow = (q4_postpone || '').toLowerCase();
  if (postLow.includes('very') || postLow.includes('everytime')) p2 = 3;
  else if (postLow.includes('often')) p2 = 2;
  else if (postLow.includes('sometimes')) p2 = 1;
  else if (postLow.includes('rarely')) p2 = 1;
  else p2 = 0;

  let p3 = 0;
  const ltLow = (q5_less_time || '').toLowerCase();
  if (ltLow.includes('yes')) p3 = 3;
  else if (ltLow.includes('not')) p3 = 1;
  else p3 = 0;

  const scoreP = p1 + p2 + p3;
  const isP = scoreP >= 6;

  // Score S
  let s1 = (q7_sleep || '').toLowerCase().includes('yes') ? 3 : 0;
  let s2 = 0;
  const sleepyLow = (q8_sleepy || '').toLowerCase();
  if (sleepyLow.includes('very')) s2 = 3;
  else if (sleepyLow.includes('often')) s2 = 2;
  else if (sleepyLow.includes('sometimes')) s2 = 1;
  else s2 = 0;

  let s3 = 0;
  const concLow = (q9_sleep_conc || '').toLowerCase();
  if (concLow.includes('very')) s3 = 3;
  else if (concLow.includes('often')) s3 = 2;
  else if (concLow.includes('sometimes')) s3 = 1;
  else s3 = 0;

  const scoreS = s1 + s2 + s3;
  const isS = scoreS >= 6;

  // Score F
  let f1 = (q11_pressure || '').toLowerCase().includes('yes') ? 3 : 0;
  let f2 = 0;
  const srcLow = (q12_source || '').toLowerCase();
  if (srcLow.includes('family') || srcLow.includes('friends') || srcLow.includes('comparisons') || srcLow.includes('teachers')) {
    f2 = 3;
  } else if (!srcLow.includes('not experience') && srcLow.length > 2) {
    f2 = 2;
  } else {
    f2 = 0;
  }

  let f3 = 0;
  const intLow = (q13_interfere || '').toLowerCase();
  if (intLow.includes('very')) f3 = 3;
  else if (intLow.includes('often')) f3 = 2;
  else if (intLow.includes('sometimes') || intLow.includes('normal')) f3 = 1;
  else f3 = 0;

  const scoreF = f1 + f2 + f3;
  const isF = scoreF >= 6;

  // Stress Rating
  const stressVal = parseFloat(q15_stress_str) || 0;
  const isE = stressVal >= 4;

  // Beliefs
  const beliefP = (q6_p_belief || '').includes('Agree') || (q6_p_belief || '').includes('agree') || (q6_p_belief || '').startsWith('4') || (q6_p_belief || '').startsWith('5');
  const beliefS = (q10_s_belief || '').includes('Agree') || (q10_s_belief || '').includes('agree') || (q10_s_belief || '').startsWith('4') || (q10_s_belief || '').startsWith('5');
  const beliefF = (q14_f_belief || '').includes('Agree') || (q14_f_belief || '').includes('agree') || (q14_f_belief || '').toLowerCase().includes('agree');

  // Predicted Leading from Q17
  let predictedLeading: 'P' | 'S' | 'F' = 'P';
  const q17Low = (q17_primary || '').toLowerCase();
  if (q17Low.includes('sleep')) predictedLeading = 'S';
  else if (q17Low.includes('pressure') || q17Low.includes('family')) predictedLeading = 'F';
  else predictedLeading = 'P';

  if (isP) pCount++;
  if (isS) sCount++;
  if (isF) fCount++;
  if (isE) eCount++;

  if (isP && isS && isF) psf++;
  else if (isP && isS && !isF) psOnly++;
  else if (isP && !isS && isF) pfOnly++;
  else if (!isP && isS && isF) sfOnly++;
  else if (isP && !isS && !isF) pOnly++;
  else if (!isP && isS && !isF) sOnly++;
  else if (!isP && !isS && isF) fOnly++;
  else none++;

  // Convert stressVal (0-10) to 4 questions (0-3 each) that sum to Math.round((stressVal/10)*12)
  const stressTotal = Math.min(12, Math.round((stressVal / 10) * 12));
  const e1 = Math.min(3, Math.floor(stressTotal / 4));
  const e2 = Math.min(3, Math.floor((stressTotal - e1) / 3));
  const e3 = Math.min(3, Math.floor((stressTotal - e1 - e2) / 2));
  const e4 = Math.min(3, stressTotal - e1 - e2 - e3);

  processed.push({
    id: `stu-${index + 1}`,
    name,
    branch,
    scoreP,
    scoreS,
    scoreF,
    scoreStress: stressTotal,
    isP,
    isS,
    isF,
    isE,
    ansP: [p1 as any, p2 as any, p3 as any],
    ansS: [s1 as any, s2 as any, s3 as any],
    ansF: [f1 as any, f2 as any, f3 as any],
    ansE: [e1 as any, e2 as any, e3 as any, e4 as any],
    beliefP,
    beliefS,
    beliefF,
    predictedLeading,
    q15_stress: stressVal,
  });
});

console.log('--- EMPIRICAL COHORT SUMMARY (N = ' + processed.length + ') ---');
console.log(`Set P (Procrastination): ${pCount} (${((pCount / processed.length) * 100).toFixed(1)}%)`);
console.log(`Set S (Sleep Deficit): ${sCount} (${((sCount / processed.length) * 100).toFixed(1)}%)`);
console.log(`Set F (Social Pressure): ${fCount} (${((fCount / processed.length) * 100).toFixed(1)}%)`);
console.log(`Set E (Elevated Stress >= 4): ${eCount} (${((eCount / processed.length) * 100).toFixed(1)}%)`);
console.log('\n--- 8 MUTUALLY EXCLUSIVE REGIONS ---');
console.log(`P only: ${pOnly}`);
console.log(`S only: ${sOnly}`);
console.log(`F only: ${fOnly}`);
console.log(`P & S only: ${psOnly}`);
console.log(`P & F only: ${pfOnly}`);
console.log(`S & F only: ${sfOnly}`);
console.log(`P & S & F (All 3): ${psf}`);
console.log(`None: ${none}`);
console.log(`Sum of all 8 regions: ${pOnly + sOnly + fOnly + psOnly + pfOnly + sfOnly + psf + none}`);
console.log(`Union |P U S U F|: ${processed.length - none}`);
