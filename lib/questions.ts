import { AnswerValue, FactorKey } from './types';

export interface QuestionOption {
  label: string;
  sublabel: string;
  value: AnswerValue;
  keyLetter: string;
}

export const SCORE_OPTIONS: QuestionOption[] = [
  { label: 'Never', sublabel: 'Not observed during revision period', value: 0, keyLetter: 'A' },
  { label: 'Rarely', sublabel: 'Occurs only on isolated occasions', value: 1, keyLetter: 'B' },
  { label: 'Often', sublabel: 'Frequently affects my revision pattern', value: 2, keyLetter: 'C' },
  { label: 'Almost always', sublabel: 'Consistent, recurring pattern', value: 3, keyLetter: 'D' },
];

export interface SurveyRound {
  id: string;
  title: string;
  roundNumber: number;
  factorKey?: FactorKey;
  isStressRound?: boolean;
  colorName: string;
  badgeBg: string;
  badgeText: string;
  accentBorder: string;
  iconName: string;
  description: string;
  questions: {
    id: string;
    text: string;
    helpText: string;
  }[];
}

export const SURVEY_ROUNDS: SurveyRound[] = [
  {
    id: 'round-1',
    roundNumber: 1,
    factorKey: 'P',
    title: 'The Procrastination Trap',
    colorName: 'electric-blue',
    badgeBg: 'bg-primary-fixed',
    badgeText: 'text-on-primary-fixed',
    accentBorder: 'border-primary',
    iconName: 'timer_off',
    description: 'Investigating intentional avoidance and study delay loops.',
    questions: [
      {
        id: 'p1',
        text: 'I put off studying until the exam is close.',
        helpText: 'Delaying revision start dates until tension forces cramming.',
      },
      {
        id: 'p2',
        text: 'I delay starting important revision tasks even when I have time.',
        helpText: 'Displacing high-priority tasks with low-cognitive-demand activities.',
      },
      {
        id: 'p3',
        text: 'I often rush to complete preparation because I started late.',
        helpText: 'Experiencing intense compressed study periods due to late start.',
      },
    ],
  },
  {
    id: 'round-2',
    roundNumber: 2,
    factorKey: 'S',
    title: 'The Sleep Spiral',
    colorName: 'tangerine-coral',
    badgeBg: 'bg-secondary-fixed',
    badgeText: 'text-on-secondary-fixed',
    accentBorder: 'border-secondary-container',
    iconName: 'bedtime',
    description: 'Examining circadian disruption and sleep deprivation during exam weeks.',
    questions: [
      {
        id: 's1',
        text: 'I sleep less than I need during exam periods.',
        helpText: 'Sacrificing restorative sleep hours in an attempt to extend study time.',
      },
      {
        id: 's2',
        text: 'My sleep schedule becomes irregular when exams are near.',
        helpText: 'Erratic bedtimes and wake times destabilizing cognitive rhythm.',
      },
      {
        id: 's3',
        text: 'I feel tired or sleepy while trying to study.',
        helpText: 'Daytime cognitive fatigue hindering retention and focus.',
      },
    ],
  },
  {
    id: 'round-3',
    roundNumber: 3,
    factorKey: 'F',
    title: 'The Pressure Zone',
    colorName: 'acid-lime',
    badgeBg: 'bg-tertiary-fixed',
    badgeText: 'text-on-tertiary-fixed',
    accentBorder: 'border-tertiary-container',
    iconName: 'psychiatry',
    description: 'Assessing perceived parental, familial, and peer expectations.',
    questions: [
      {
        id: 'f1',
        text: 'I feel pressure from family expectations about my exam results.',
        helpText: 'Internalizing familial expectations and high performance bars.',
      },
      {
        id: 'f2',
        text: 'Comparing my preparation or results with others makes me feel pressured.',
        helpText: 'Cohort comparison creating feelings of falling behind.',
      },
      {
        id: 'f3',
        text: 'I worry about disappointing people if my marks are lower than expected.',
        helpText: 'Anticipated social shame or emotional burden tied to grade outcomes.',
      },
    ],
  },
  {
    id: 'round-4',
    roundNumber: 4,
    isStressRound: true,
    title: 'The Stress Meter',
    colorName: 'deep-ink',
    badgeBg: 'bg-surface-variant',
    badgeText: 'text-on-surface',
    accentBorder: 'border-outline',
    iconName: 'speed',
    description: 'Evaluating cognitive overwhelm and routine interference (Set E calibration).',
    questions: [
      {
        id: 'e1',
        text: 'When exams approach, I feel overwhelmed by everything I need to prepare.',
        helpText: 'Feeling flooded by revision volume and syllabus scale.',
      },
      {
        id: 'e2',
        text: 'I find it difficult to relax because I am thinking about exams.',
        helpText: 'Inability to switch off anxious rumination during downtime.',
      },
      {
        id: 'e3',
        text: 'Worry about exams makes it harder for me to concentrate.',
        helpText: 'Anxiety actively impeding short-term working memory.',
      },
      {
        id: 'e4',
        text: 'Exam-related stress interferes with my usual routine.',
        helpText: 'Disruption to meals, exercise, social life, or general daily habits.',
      },
    ],
  },
];

export interface BeliefQuestion {
  factor: FactorKey;
  factorName: string;
  statement: string;
  helper: string;
}

export const BELIEF_QUESTIONS: BeliefQuestion[] = [
  {
    factor: 'P',
    factorName: 'Procrastination',
    statement: 'I believe procrastination increases my exam stress.',
    helper: 'Do you intuitively consider putting off revision to be a prime driver of stress?',
  },
  {
    factor: 'S',
    factorName: 'Poor Sleep',
    statement: 'I believe poor sleep increases my exam stress.',
    helper: 'Do you intuitively consider sleep deficits to directly heighten exam anxiety?',
  },
  {
    factor: 'F',
    factorName: 'Social/Family Pressure',
    statement: 'I believe social or family pressure increases my exam stress.',
    helper: 'Do you intuitively consider external expectations to be a main contributor to stress?',
  },
];
