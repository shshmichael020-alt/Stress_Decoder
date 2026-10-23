"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  X,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { ResearchSubmission, DerivedParticipantScore } from "@/lib/types";
import { calculateParticipantScore } from "@/lib/math-engine";
import confetti from "canvas-confetti";

export default function ResultsPage() {
  const router = useRouter();
  const [submission, setSubmission] = useState<ResearchSubmission | null>(null);

  useEffect(() => {
    // Attempt to load from sessionStorage
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("last_submission");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSubmission(parsed);
          // Trigger playful celebratory confetti
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#4057ff", "#fe725d", "#ccf15a"],
          });
          return;
        } catch (e) {
          console.error("Error parsing stored submission", e);
        }
      }
    }

    // Default fallback sample profile if visited directly without submitting
    const fallbackScore = calculateParticipantScore({
      procrastination: [2, 2, 2], // 6 -> isP = true
      sleep: [3, 2, 2], // 7 -> isS = true
      pressure: [1, 2, 1], // 4 -> isF = false
      stress: [2, 3, 2, 2], // 9 -> isE = true
      beliefs: { P: true, S: true, F: true },
    });

    setSubmission({
      id: "preview-self",
      timestamp: new Date().toISOString(),
      consent: true,
      prediction: { leadingFactor: "P", tripleOverlapPercentage: 35 },
      answers: {
        procrastination: [2, 2, 2],
        sleep: [3, 2, 2],
        pressure: [1, 2, 1],
        stress: [2, 3, 2, 2],
        beliefs: { P: true, S: true, F: true },
      },
      derived: fallbackScore,
      isDemo: false,
    });
  }, []);

  if (!submission) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="font-display font-bold text-lg text-[#1e39e7] animate-pulse">
          Unpacking Your Results...
        </div>
      </div>
    );
  }

  const { derived, prediction } = submission;

  // Arc length calculations for radial semi-circle gauge (r=80, circum=251.32)
  const arcLength = 251.32;
  const strokeDashoffset = arcLength * (1 - Math.min(100, Math.max(0, derived.stressPercentage)) / 100);

  const getSetPlacementLabel = () => {
    const { isP, isS, isF } = derived;
    if (isP && isS && isF) return "P ∩ S ∩ F (The Triple Overlap)";
    if (isP && isS && !isF) return "P ∩ S only (Procrastination & Sleep)";
    if (isP && !isS && isF) return "P ∩ F only (Procrastination & Pressure)";
    if (!isP && isS && isF) return "S ∩ F only (Sleep & Pressure)";
    if (isP && !isS && !isF) return "P only (Procrastination Alone)";
    if (!isP && isS && !isF) return "S only (Sleep Deficit Alone)";
    if (!isP && !isS && isF) return "F only (Social Pressure Alone)";
    return "None (Outside the Three Active Factor Sets)";
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ccf15a] text-[#161e00] font-mono text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Individual Experiment Profile
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#1d182e] tracking-tight">
            Your Results, Unpacked.
          </h1>
          <p className="text-sm sm:text-base text-[#444656] max-w-2xl">
            Here is where your self-reported habits land in the mathematical universe of exam stress.
          </p>
        </div>

        {/* Bento Hero Grid: Gauge & Dominant Vector */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Gauge Card (7 cols) */}
          <div className="md:col-span-7 rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[6px_6px_0_0_#1d182e] flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between border-b border-[#f2ebff] pb-3 mb-2">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-[#444656]">
                Stress Classifier (Set E)
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold shadow-sm ${
                  derived.isE
                    ? "bg-[#fe725d] text-white"
                    : "bg-[#ccf15a] text-[#161e00]"
                }`}
              >
                Set E Member: {derived.isE ? "TRUE (Elevated)" : "FALSE (Baseline)"}
              </span>
            </div>

            {/* Radial SVG Gauge */}
            <div className="relative w-64 h-36 flex items-end justify-center my-3">
              <svg viewBox="0 0 200 115" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4057ff" />
                    <stop offset="65%" stopColor="#fe725d" />
                    <stop offset="100%" stopColor="#aa3526" />
                  </linearGradient>
                </defs>
                {/* Background Track */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#ede4ff"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                {/* Value Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#gaugeGrad)"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeDasharray="251.32"
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Readout */}
              <div className="absolute bottom-0 flex flex-col items-center">
                <span className="font-display font-black text-4xl text-[#1d182e] leading-none">
                  {derived.stressPercentage}
                  <span className="text-2xl text-[#fe725d]">%</span>
                </span>
                <span className="font-mono text-[11px] font-bold text-[#757688] uppercase tracking-wider mt-1">
                  Elevated Stress Index
                </span>
              </div>
            </div>

            <div className="w-full rounded-xl bg-[#f8f1ff] p-3 text-xs text-[#444656] text-left flex items-start gap-2 mt-2">
              <Info className="h-4 w-4 text-[#4057ff] shrink-0 mt-0.5" />
              <p>
                Total Score: <strong>{derived.scoreStress} / 12</strong> points. Classified under project
                rules as <strong>{derived.stressCategory.toUpperCase()}</strong> indicator (Threshold for E is ≥ 4).
              </p>
            </div>
          </div>

          {/* Dominant Vector & Region Summary (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {/* Dominant Vector Card */}
            <div className="flex-1 rounded-2xl border-2 border-[#1d182e] bg-[#ede4ff] p-5 shadow-[4px_4px_0_0_#1d182e] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#1e39e7] uppercase tracking-wider block mb-1">
                  Primary Pressure Axis
                </span>
                <h3 className="font-display font-bold text-xl text-[#1d182e] leading-snug">
                  {derived.dominantFactor === "P" && "The Procrastination Trap (P)"}
                  {derived.dominantFactor === "S" && "The Sleep Spiral (S)"}
                  {derived.dominantFactor === "F" && "The Pressure Bubble (F)"}
                  {derived.dominantFactor === "tied" && "Equally Balanced Pressure Points"}
                </h3>
                <p className="text-xs text-[#444656] mt-2">
                  Highest individual factor score among tested components in your survey responses.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1d182e]/10 flex items-center justify-between text-xs font-bold text-[#1d182e]">
                <span>Your Pre-Test Prior:</span>
                <span className="rounded bg-white px-2 py-0.5 font-mono shadow-sm">
                  Predicted: Factor {prediction.leadingFactor}
                </span>
              </div>
            </div>

            {/* Set Placement Card */}
            <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-5 shadow-[4px_4px_0_0_#1d182e]">
              <span className="font-mono text-xs font-bold text-[#485b00] uppercase tracking-wider block mb-1">
                Your Venn Set Placement
              </span>
              <div className="font-display font-bold text-base text-[#1d182e] truncate">
                {getSetPlacementLabel()}
              </div>
              <p className="text-xs text-[#444656] mt-1">
                Active factor sets meeting project rule (Score ≥ 6):{" "}
                <strong>
                  {[
                    derived.isP ? "P" : null,
                    derived.isS ? "S" : null,
                    derived.isF ? "F" : null,
                  ]
                    .filter(Boolean)
                    .join(", ") || "None"}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* Three Factor Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-[#1d182e]">
              Factor-by-Factor Membership Breakdown
            </h2>
            <span className="font-mono text-xs text-[#757688]">Rule: Score ≥ 6 out of 9</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Factor P */}
            <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-5 shadow-[4px_4px_0_0_#4057ff] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4057ff] text-white font-bold text-xs">
                      P
                    </span>
                    <span className="font-display font-bold text-sm text-[#1d182e]">
                      Procrastination
                    </span>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      derived.isP
                        ? "bg-[#dfe0ff] text-[#000b62]"
                        : "bg-[#f2ebff] text-[#757688]"
                    }`}
                  >
                    {derived.isP ? "MEMBER (1)" : "NOT MET (0)"}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs text-[#444656]">Total Score</span>
                  <span className="font-display font-bold text-lg text-[#1e39e7]">
                    {derived.scoreP} / 9
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[#ede4ff] overflow-hidden">
                  <div
                    className="h-full bg-[#4057ff] rounded-full transition-all duration-500"
                    style={{ width: `${(derived.scoreP / 9) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Factor S */}
            <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-5 shadow-[4px_4px_0_0_#fe725d] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fe725d] text-white font-bold text-xs">
                      S
                    </span>
                    <span className="font-display font-bold text-sm text-[#1d182e]">
                      Sleep Deficit
                    </span>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      derived.isS
                        ? "bg-[#ffdad4] text-[#410100]"
                        : "bg-[#f2ebff] text-[#757688]"
                    }`}
                  >
                    {derived.isS ? "MEMBER (1)" : "NOT MET (0)"}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs text-[#444656]">Total Score</span>
                  <span className="font-display font-bold text-lg text-[#aa3526]">
                    {derived.scoreS} / 9
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[#ede4ff] overflow-hidden">
                  <div
                    className="h-full bg-[#fe725d] rounded-full transition-all duration-500"
                    style={{ width: `${(derived.scoreS / 9) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Factor F */}
            <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-5 shadow-[4px_4px_0_0_#ccf15a] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ccf15a] text-[#161e00] font-bold text-xs border border-[#161e00]">
                      F
                    </span>
                    <span className="font-display font-bold text-sm text-[#1d182e]">
                      Social Pressure
                    </span>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      derived.isF
                        ? "bg-[#ccf15a]/40 text-[#161e00]"
                        : "bg-[#f2ebff] text-[#757688]"
                    }`}
                  >
                    {derived.isF ? "MEMBER (1)" : "NOT MET (0)"}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs text-[#444656]">Total Score</span>
                  <span className="font-display font-bold text-lg text-[#485b00]">
                    {derived.scoreF} / 9
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[#ede4ff] overflow-hidden">
                  <div
                    className="h-full bg-[#ccf15a] rounded-full transition-all duration-500 border border-[#161e00]/20"
                    style={{ width: `${(derived.scoreF / 9) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Educational Recommendations */}
        <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[5px_5px_0_0_#1d182e] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#f2ebff] pb-3">
            <Lightbulb className="h-5 w-5 text-[#4057ff]" />
            <h2 className="font-display font-bold text-xl text-[#1d182e]">
              Practical Self-Reflection Strategies
            </h2>
          </div>

          <div className="space-y-3">
            {derived.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fdf7ff] border border-[#c5c5d9]"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ede4ff] font-bold text-xs text-[#1e39e7]">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-[#1d182e] leading-relaxed">
                  {rec}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs text-[#757688] flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#1e39e7]" />
            <span>
              Disclaimer: Provided strictly for academic study and self-reflection. Correlation does not imply causation.
            </span>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between pt-4">
          <Link
            href="/participate"
            className="flex items-center gap-2 rounded-xl border border-[#c5c5d9] bg-white px-5 py-3 font-display text-sm font-semibold text-[#444656] hover:bg-[#ede4ff] transition"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retake Questionnaire</span>
          </Link>

          <Link
            href="/lab"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#4057ff] text-white px-7 py-3.5 font-display text-base font-bold shadow-[4px_4px_0_0_#1d182e] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1d182e] transition"
          >
            <span>See How Your Data Compares in Research Lab</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
