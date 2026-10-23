"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldAlert,
  Sparkles,
  Info,
  CheckCircle2,
  Clock,
  Moon,
  Users2,
  Activity,
  HelpCircle,
} from "lucide-react";
import { FactorKey, AnswerValue, QuestionnaireAnswers, ParticipantPrediction } from "@/lib/types";
import { SCORE_OPTIONS, SURVEY_ROUNDS, BELIEF_QUESTIONS } from "@/lib/questions";
import { submitResearchData } from "@/lib/storage";
import { toast } from "sonner";

type FlowStep = 'prediction' | 'consent' | 'survey' | 'beliefs' | 'submitting';

export default function ParticipatePage() {
  const router = useRouter();

  // Current stage in flow
  const [step, setStep] = useState<FlowStep>('prediction');

  // Prediction state (must be recorded BEFORE questionnaire)
  const [predictedLeadingFactor, setPredictedLeadingFactor] = useState<FactorKey>('P');
  const [predictedTripleOverlap, setPredictedTripleOverlap] = useState<number>(35);

  // Consent
  const [consentGiven, setConsentGiven] = useState<boolean>(true);

  // Survey answers:
  // p: [q1, q2, q3], s: [q1, q2, q3], f: [q1, q2, q3], e: [q1, q2, q3, q4]
  const [pAnswers, setPAnswers] = useState<(AnswerValue | null)[]>([null, null, null]);
  const [sAnswers, setSAnswers] = useState<(AnswerValue | null)[]>([null, null, null]);
  const [fAnswers, setFAnswers] = useState<(AnswerValue | null)[]>([null, null, null]);
  const [eAnswers, setEAnswers] = useState<(AnswerValue | null)[]>([null, null, null, null]);

  // Current round index (0 to 3) and current question inside that round
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [currentQuestionInRound, setCurrentQuestionInRound] = useState<number>(0);

  // Beliefs
  const [beliefAnswers, setBeliefAnswers] = useState<{ P: boolean | null; S: boolean | null; F: boolean | null }>({
    P: null,
    S: null,
    F: null,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Handlers for Predictions
  const handlePredictionComplete = () => {
    setStep('consent');
  };

  const handleConsentComplete = () => {
    if (!consentGiven) {
      toast.error("Informed consent is required to participate in research data collection.");
      return;
    }
    setStep('survey');
  };

  // Helper for current question retrieval in survey
  const currentRound = SURVEY_ROUNDS[currentRoundIdx];
  const currentQuestion = currentRound.questions[currentQuestionInRound];

  // Helper to get and set current active answer
  const getCurrentAnswer = (): AnswerValue | null => {
    if (currentRoundIdx === 0) return pAnswers[currentQuestionInRound];
    if (currentRoundIdx === 1) return sAnswers[currentQuestionInRound];
    if (currentRoundIdx === 2) return fAnswers[currentQuestionInRound];
    if (currentRoundIdx === 3) return eAnswers[currentQuestionInRound];
    return null;
  };

  const setCurrentAnswer = (val: AnswerValue) => {
    if (currentRoundIdx === 0) {
      const next = [...pAnswers];
      next[currentQuestionInRound] = val;
      setPAnswers(next);
    } else if (currentRoundIdx === 1) {
      const next = [...sAnswers];
      next[currentQuestionInRound] = val;
      setSAnswers(next);
    } else if (currentRoundIdx === 2) {
      const next = [...fAnswers];
      next[currentQuestionInRound] = val;
      setFAnswers(next);
    } else if (currentRoundIdx === 3) {
      const next = [...eAnswers];
      next[currentQuestionInRound] = val;
      setEAnswers(next);
    }
  };

  // Global question numbering (1 to 13)
  const getGlobalQuestionNumber = (): number => {
    let count = 0;
    for (let r = 0; r < currentRoundIdx; r++) {
      count += SURVEY_ROUNDS[r].questions.length;
    }
    return count + currentQuestionInRound + 1;
  };

  const totalQuestions = 13; // 3 + 3 + 3 + 4
  const currentGlobalNumber = getGlobalQuestionNumber();

  // Navigation inside questionnaire
  const handleNextQuestion = () => {
    const ans = getCurrentAnswer();
    if (ans === null) {
      toast.warning("Please choose one answer option to proceed.");
      return;
    }

    if (currentQuestionInRound < currentRound.questions.length - 1) {
      setCurrentQuestionInRound(currentQuestionInRound + 1);
    } else if (currentRoundIdx < SURVEY_ROUNDS.length - 1) {
      setCurrentRoundIdx(currentRoundIdx + 1);
      setCurrentQuestionInRound(0);
    } else {
      // Reached end of 4 scored rounds, move to Beliefs phase
      setStep('beliefs');
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionInRound > 0) {
      setCurrentQuestionInRound(currentQuestionInRound - 1);
    } else if (currentRoundIdx > 0) {
      const prevRound = currentRoundIdx - 1;
      setCurrentRoundIdx(prevRound);
      setCurrentQuestionInRound(SURVEY_ROUNDS[prevRound].questions.length - 1);
    }
  };

  // Final Submission Handler
  const handleFinalSubmit = async () => {
    // Validate beliefs
    if (beliefAnswers.P === null || beliefAnswers.S === null || beliefAnswers.F === null) {
      toast.warning("Please record your perspective on all three belief statements.");
      return;
    }

    // Double check all scored answers
    if (
      pAnswers.some((a) => a === null) ||
      sAnswers.some((a) => a === null) ||
      fAnswers.some((a) => a === null) ||
      eAnswers.some((a) => a === null)
    ) {
      toast.error("Some questions are missing answers. Returning to questionnaire.");
      setStep('survey');
      return;
    }

    setIsSubmitting(true);
    setStep('submitting');

    const prediction: ParticipantPrediction = {
      leadingFactor: predictedLeadingFactor,
      tripleOverlapPercentage: predictedTripleOverlap,
    };

    const answers: QuestionnaireAnswers = {
      procrastination: pAnswers as [AnswerValue, AnswerValue, AnswerValue],
      sleep: sAnswers as [AnswerValue, AnswerValue, AnswerValue],
      pressure: fAnswers as [AnswerValue, AnswerValue, AnswerValue],
      stress: eAnswers as [AnswerValue, AnswerValue, AnswerValue, AnswerValue],
      beliefs: {
        P: beliefAnswers.P,
        S: beliefAnswers.S,
        F: beliefAnswers.F,
      },
    };

    try {
      const result = await submitResearchData({
        prediction,
        answers,
        consent: consentGiven,
      });

      if (!result.success || !result.submission) {
        toast.error(result.error || "Submission failed.");
        setIsSubmitting(false);
        setStep('beliefs');
        return;
      }

      // Store personal submission in sessionStorage for results page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('last_submission', JSON.stringify(result.submission));
      }

      toast.success("Experiment recorded anonymously! Unpacking your results...");
      router.push('/results');
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Network error submitting response. Please try again.");
      setIsSubmitting(false);
      setStep('beliefs');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* ========================================================================= */}
        {/* STEP 1: PRE-EXPERIMENT HYPOTHESIS & PREDICTIONS                           */}
        {/* ========================================================================= */}
        {step === 'prediction' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2ebff] text-[#1e39e7] border border-[#1e39e7]/20 text-xs font-bold uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-[#4057ff] animate-ping" />
                Phase 01: Pre-Experiment Hypothesis
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1d182e] tracking-tight">
                Trust your instincts. Then meet the data.
              </h1>
              <p className="text-sm sm:text-base text-[#444656] leading-relaxed">
                Before answering any questions, lock in your prior hypotheses. In experimental science,
                predictions are recorded prior to measurement to prevent retrospective distortion and hindsight bias.
              </p>
            </div>

            {/* Prediction 1: Leading Factor */}
            <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-5 sm:p-6 shadow-[5px_5px_0_0_#1d182e]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1e39e7]">
                  Predictive Vector I
                </span>
                <span className="font-mono text-xs text-[#757688]">arg max [r(X, E)]</span>
              </div>
              <h2 className="font-display font-bold text-lg text-[#1d182e] mb-2">
                Which factor do you predict has the strongest observed association with elevated exam stress?
              </h2>
              <p className="text-xs text-[#444656] mb-4">
                Select the factor you believe creates the largest differential in stress rates.
              </p>

              <div className="space-y-3">
                {/* Option P */}
                <button
                  type="button"
                  onClick={() => setPredictedLeadingFactor('P')}
                  className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl border-2 text-left transition ${
                    predictedLeadingFactor === 'P'
                      ? 'border-[#4057ff] bg-[#f2ebff] shadow-sm'
                      : 'border-[#c5c5d9] bg-white hover:border-[#1d182e]'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-base font-bold ${
                      predictedLeadingFactor === 'P'
                        ? 'bg-[#4057ff] text-white'
                        : 'bg-[#ede4ff] text-[#1e39e7]'
                    }`}
                  >
                    P
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-[#1d182e]">
                        Procrastination (P)
                      </span>
                      {predictedLeadingFactor === 'P' && (
                        <Check className="h-4 w-4 text-[#4057ff]" />
                      )}
                    </div>
                    <p className="text-xs text-[#444656] mt-0.5">
                      Late-night cramming, intentional avoidance, and task displacement cycles.
                    </p>
                  </div>
                </button>

                {/* Option S */}
                <button
                  type="button"
                  onClick={() => setPredictedLeadingFactor('S')}
                  className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl border-2 text-left transition ${
                    predictedLeadingFactor === 'S'
                      ? 'border-[#fe725d] bg-[#ffdad4]/40 shadow-sm'
                      : 'border-[#c5c5d9] bg-white hover:border-[#1d182e]'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-base font-bold ${
                      predictedLeadingFactor === 'S'
                        ? 'bg-[#fe725d] text-white'
                        : 'bg-[#ffdad4] text-[#aa3526]'
                    }`}
                  >
                    S
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-[#1d182e]">
                        Sleep Deprivation (S)
                      </span>
                      {predictedLeadingFactor === 'S' && (
                        <Check className="h-4 w-4 text-[#fe725d]" />
                      )}
                    </div>
                    <p className="text-xs text-[#444656] mt-0.5">
                      Chronic sleep deficit (&lt; 6 hours), circadian disruption, and mental fatigue.
                    </p>
                  </div>
                </button>

                {/* Option F */}
                <button
                  type="button"
                  onClick={() => setPredictedLeadingFactor('F')}
                  className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl border-2 text-left transition ${
                    predictedLeadingFactor === 'F'
                      ? 'border-[#485b00] bg-[#ccf15a]/30 shadow-sm'
                      : 'border-[#c5c5d9] bg-white hover:border-[#1d182e]'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-base font-bold ${
                      predictedLeadingFactor === 'F'
                        ? 'bg-[#ccf15a] text-[#161e00] border border-[#161e00]'
                        : 'bg-[#f2ebff] text-[#485b00]'
                    }`}
                  >
                    F
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-[#1d182e]">
                        Social &amp; Family Pressure (F)
                      </span>
                      {predictedLeadingFactor === 'F' && (
                        <Check className="h-4 w-4 text-[#485b00]" />
                      )}
                    </div>
                    <p className="text-xs text-[#444656] mt-0.5">
                      Parental expectations, cohort comparison, and fear of letting people down.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Prediction 2: Triple Overlap */}
            <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-5 sm:p-6 shadow-[5px_5px_0_0_#1d182e]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#aa3526]">
                  Predictive Vector II
                </span>
                <span className="font-mono text-xs text-[#757688]">P(P ∩ S ∩ F)</span>
              </div>
              <h2 className="font-display font-bold text-lg text-[#1d182e] mb-2">
                What proportion of students do you expect to experience ALL THREE factors together?
              </h2>
              <p className="text-xs text-[#444656] mb-6">
                Drag the slider to estimate the percentage in the center triple intersection.
              </p>

              {/* Slider & Readout */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-[#444656]">
                    Estimated Overlap Proportion:
                  </span>
                  <span className="rounded-xl bg-[#ccf15a] px-3.5 py-1 font-display text-2xl font-black text-[#161e00] shadow-[2px_2px_0_0_#161e00]">
                    {predictedTripleOverlap}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={predictedTripleOverlap}
                  onChange={(e) => setPredictedTripleOverlap(Number(e.target.value))}
                  className="w-full h-3 bg-[#ede4ff] rounded-lg appearance-none cursor-pointer accent-[#4057ff]"
                />

                <div className="flex justify-between text-xs font-mono text-[#757688]">
                  <span>0% (Disjoint)</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100% (Complete Overlap)</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handlePredictionComplete}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#4057ff] text-white py-4 font-display font-bold text-base shadow-[4px_4px_0_0_#1d182e] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1d182e] transition"
            >
              <span>Lock In Hypotheses &amp; Continue</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: INFORMED CONSENT & PRIVACY NOTICE                                 */}
        {/* ========================================================================= */}
        {step === 'consent' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2ebff] text-[#1e39e7] border border-[#1e39e7]/20 text-xs font-bold uppercase tracking-wider">
                Phase 02: Voluntary Consent
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1d182e] tracking-tight">
                Informed Consent &amp; Anonymity
              </h1>
              <p className="text-sm sm:text-base text-[#444656] leading-relaxed">
                Before collecting survey answers, university research ethics require explicit confirmation
                of voluntary participation.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[5px_5px_0_0_#1d182e] space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f2ebff] border border-[#c5c5d9]">
                <ShieldAlert className="h-5 w-5 text-[#1e39e7] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-[#1d182e] leading-relaxed">
                  <strong>Zero Personal Data:</strong> No student names, roll numbers, email addresses,
                  or IP logs are collected or stored. All entries are strictly decoupled from identity.
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-[#444656] leading-relaxed">
                <p>
                  • <strong>Educational Purpose:</strong> The data collected is utilized solely for university
                  mathematics experimental coursework demonstrating Inclusion–Exclusion and Propositional Logic.
                </p>
                <p>
                  • <strong>Voluntary Exit:</strong> You may exit at any time without submitting. No responses
                  are recorded until you explicitly finish and submit the final round.
                </p>
                <p>
                  • <strong>Non-Clinical Scope:</strong> The stress indicators and thresholds are project-defined
                  heuristic rules for self-reflection and mathematics, not a medical or psychiatric diagnosis.
                </p>
              </div>

              <div className="pt-3 border-t border-[#f2ebff]">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="h-5 w-5 rounded border-[#c5c5d9] text-[#4057ff] focus:ring-[#4057ff] mt-0.5"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-[#1d182e]">
                    I confirm that I am participating voluntarily and understand that my anonymous responses
                    will contribute to the aggregate research dataset.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('prediction')}
                className="px-5 py-3 rounded-xl border border-[#c5c5d9] bg-white font-display font-semibold text-sm text-[#444656] hover:bg-[#ede4ff]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConsentComplete}
                disabled={!consentGiven}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#ccf15a] border-2 border-[#161e00] text-[#161e00] py-3.5 font-display font-bold text-base shadow-[3px_3px_0_0_#161e00] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_#161e00] disabled:opacity-50 transition"
              >
                <span>Proceed to Questionnaire</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: INTERACTIVE QUESTIONNAIRE (4 ROUNDS)                              */}
        {/* ========================================================================= */}
        {step === 'survey' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Progress Header Module */}
            <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-5 shadow-[4px_4px_0_0_#1d182e] space-y-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2ebff] text-xs font-bold uppercase tracking-wider text-[#1e39e7]">
                  Round 0{currentRound.roundNumber}: {currentRound.title}
                </div>
                <span className="font-mono text-xs font-bold text-[#444656]">
                  Question {currentGlobalNumber} of {totalQuestions}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-[#444656]">
                  <span>Calibration Progress</span>
                  <span className="font-bold text-[#1e39e7]">
                    {Math.round(((currentGlobalNumber - 1) / totalQuestions) * 100)}% Complete
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-[#ede4ff] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-[#4057ff] transition-all duration-300 ease-out"
                    style={{
                      width: `${Math.max(8, ((currentGlobalNumber - 1) / totalQuestions) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="rounded-2xl border-2 border-[#1d182e] bg-white overflow-hidden shadow-[5px_5px_0_0_#1d182e]">
              {/* Colored top bar for round identity */}
              <div
                className={`h-2.5 w-full ${
                  currentRoundIdx === 0
                    ? 'bg-[#4057ff]'
                    : currentRoundIdx === 1
                    ? 'bg-[#fe725d]'
                    : currentRoundIdx === 2
                    ? 'bg-[#ccf15a]'
                    : 'bg-[#1d182e]'
                }`}
              />

              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f2ebff] text-[#1e39e7]">
                    {currentRound.description}
                  </span>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1d182e] leading-snug">
                    {currentQuestion.text}
                  </h2>
                  <p className="text-xs text-[#757688]">
                    {currentQuestion.helpText}
                  </p>
                </div>

                {/* Scored Options (0 to 3) */}
                <div className="space-y-3 pt-2">
                  {SCORE_OPTIONS.map((opt) => {
                    const isSelected = getCurrentAnswer() === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setCurrentAnswer(opt.value)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-[#4057ff] bg-[#f2ebff] shadow-sm -translate-y-0.5'
                            : 'border-[#c5c5d9] bg-white hover:border-[#1d182e] active:scale-[0.99]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold ${
                              isSelected
                                ? 'bg-[#4057ff] text-white shadow-sm'
                                : 'bg-[#ede4ff] text-[#1d182e]'
                            }`}
                          >
                            {opt.keyLetter}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-display font-bold text-sm sm:text-base text-[#1d182e]">
                              {opt.label}
                            </span>
                            <span className="text-xs text-[#444656]">
                              {opt.sublabel}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? 'border-[#4057ff] bg-[#4057ff] text-white'
                              : 'border-[#c5c5d9] bg-white'
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between border-t border-[#f2ebff] bg-[#fdf7ff] p-4">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={currentRoundIdx === 0 && currentQuestionInRound === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#c5c5d9] text-xs font-bold text-[#444656] disabled:opacity-30 hover:bg-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4057ff] text-white font-display text-sm font-bold shadow-[2px_2px_0_0_#1d182e] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition"
                >
                  <span>
                    {currentRoundIdx === 3 && currentQuestionInRound === 3
                      ? 'Continue to Belief Checks'
                      : 'Next Question'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: YES/NO BELIEF QUESTIONS                                           */}
        {/* ========================================================================= */}
        {step === 'beliefs' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2ebff] text-[#1e39e7] border border-[#1e39e7]/20 text-xs font-bold uppercase tracking-wider">
                Phase 03: Subjective Belief Verification
              </div>
              <h1 className="font-display font-extrabold text-3xl text-[#1d182e] tracking-tight">
                Beliefs vs Reported Experience
              </h1>
              <p className="text-sm text-[#444656] leading-relaxed">
                Do you intuitively believe these factors drive exam stress? We will cross-reference your
                beliefs with your empirical questionnaire responses.
              </p>
            </div>

            <div className="space-y-4">
              {BELIEF_QUESTIONS.map((bq) => {
                const currentVal = beliefAnswers[bq.factor];
                return (
                  <div
                    key={bq.factor}
                    className="rounded-2xl border-2 border-[#1d182e] bg-white p-5 shadow-[4px_4px_0_0_#1d182e] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f2ebff] text-[#1e39e7]">
                        Factor {bq.factor} • {bq.factorName}
                      </span>
                      <span className="font-mono text-xs text-[#757688]">Belief Assertion</span>
                    </div>

                    <h2 className="font-display font-bold text-base sm:text-lg text-[#1d182e]">
                      &quot;{bq.statement}&quot;
                    </h2>
                    <p className="text-xs text-[#444656]">{bq.helper}</p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setBeliefAnswers((prev) => ({ ...prev, [bq.factor]: true }))
                        }
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-display text-sm font-bold transition ${
                          currentVal === true
                            ? 'border-[#4057ff] bg-[#4057ff] text-white shadow-sm'
                            : 'border-[#c5c5d9] bg-white text-[#1d182e] hover:border-[#1d182e]'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        <span>Yes, I believe so</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setBeliefAnswers((prev) => ({ ...prev, [bq.factor]: false }))
                        }
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-display text-sm font-bold transition ${
                          currentVal === false
                            ? 'border-[#1d182e] bg-[#1d182e] text-white shadow-sm'
                            : 'border-[#c5c5d9] bg-white text-[#1d182e] hover:border-[#1d182e]'
                        }`}
                      >
                        <span>No, I do not</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('survey')}
                className="px-5 py-3 rounded-xl border border-[#c5c5d9] bg-white font-display font-semibold text-sm text-[#444656] hover:bg-[#ede4ff]"
              >
                Back to Questions
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={
                  beliefAnswers.P === null ||
                  beliefAnswers.S === null ||
                  beliefAnswers.F === null ||
                  isSubmitting
                }
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#ccf15a] border-2 border-[#161e00] text-[#161e00] py-4 font-display font-extrabold text-base shadow-[4px_4px_0_0_#161e00] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#161e00] disabled:opacity-50 transition"
              >
                <span>{isSubmitting ? 'Computing Research Matrices...' : 'Complete & Unpack My Results'}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: SUBMITTING / PROCESSING STATE                                     */}
        {/* ========================================================================= */}
        {step === 'submitting' && (
          <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-12 text-center shadow-[6px_6px_0_0_#1d182e] space-y-4 animate-in fade-in">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#ede4ff] text-[#1e39e7] animate-bounce">
              <Activity className="h-8 w-8" />
            </div>
            <h2 className="font-display font-bold text-2xl text-[#1d182e]">
              Computing Mathematical Intersections...
            </h2>
            <p className="text-sm text-[#444656] max-w-sm mx-auto">
              Scoring your factors against the threshold rules, calculating propositional truth values,
              and checking Venn region placement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
