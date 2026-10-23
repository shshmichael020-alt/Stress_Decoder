import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Clock,
  Moon,
  Users2,
  Sparkles,
  ShieldCheck,
  Binary,
  Layers,
  Compass,
} from "lucide-react";
import { VennDiagram } from "@/components/venn-diagram";
import { calculateVennCounts } from "@/lib/math-engine";
import { EMPIRICAL_STUDENT_SUBMISSIONS } from "@/lib/survey-data";

export default function HomePage() {
  const initialVenn = calculateVennCounts(
    EMPIRICAL_STUDENT_SUBMISSIONS.map((s) => ({
      isP: s.derived.isP,
      isS: s.derived.isS,
      isF: s.derived.isF,
    }))
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#fdf7ff]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#c5c5d9]/60">
        {/* Playful background decorative shapes */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-r from-[#4057ff]/10 via-[#fe725d]/10 to-[#ccf15a]/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2ebff] border border-[#1e39e7]/20 shadow-sm mb-6">
              <span className="h-2 w-2 rounded-full bg-[#4057ff] animate-ping" />
              <span className="font-mono text-xs font-bold text-[#1e39e7] uppercase tracking-wider">
                University Mathematics Experimental Project
              </span>
            </div>

            {/* Headline with tilt tape effect */}
            <div className="relative inline-block mb-4">
              <div className="absolute -inset-1.5 bg-[#ccf15a]/80 -rotate-1 rounded-xl -z-10 shadow-sm" />
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1d182e] tracking-tight uppercase leading-[1.08]">
                Exam Stress, Decoded.
              </h1>
            </div>

            {/* Subtitle */}
            <p className="font-display font-semibold text-xl sm:text-2xl text-[#1d182e] mt-2 mb-3">
              We all have theories about exam stress.{" "}
              <span className="text-[#1e39e7] underline decoration-[#ccf15a] decoration-4">
                Let&apos;s see what the data says.
              </span>
            </p>

            <p className="text-base sm:text-lg text-[#444656] max-w-2xl leading-relaxed mb-8">
              Three factors. Hundreds of student permutations. One interactive sandbox investigating
              procrastination, poor sleep, social pressure, and the exact mathematics in their overlap.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center mb-12">
              <Link
                href="/participate"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#4057ff] text-white px-7 py-3.5 font-display text-base font-bold shadow-[4px_4px_0_0_#1d182e] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1d182e] transition active:translate-x-1 active:translate-y-1"
              >
                <span>Start the Experiment</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/lab"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-[#1d182e] text-[#1d182e] px-6 py-3.5 font-display text-base font-bold shadow-[4px_4px_0_0_#c5c5d9] hover:bg-[#f2ebff] transition"
              >
                <BarChart3 className="h-5 w-5 text-[#1e39e7]" />
                <span>Explore the Research Lab</span>
              </Link>
            </div>
          </div>

          {/* Interactive Bento Preview Card */}
          <div className="max-w-2xl mx-auto rounded-2xl border-2 border-[#1d182e] bg-white p-5 sm:p-7 shadow-[6px_6px_0_0_#1d182e] transition">
            <div className="flex items-center justify-between border-b border-[#f2ebff] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ede4ff] text-[#1e39e7] font-bold text-xs">
                  Δ
                </span>
                <span className="font-display font-bold text-sm uppercase tracking-wider text-[#1d182e]">
                  The Live Overlap Model
                </span>
              </div>
              <span className="rounded-full bg-[#ccf15a] px-2.5 py-0.5 font-mono text-xs font-bold text-[#161e00]">
                Cohort n=105 Verified
              </span>
            </div>

            <VennDiagram counts={initialVenn} />

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#f2ebff] pt-3 text-xs text-[#444656]">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="h-4 w-4 text-[#1e39e7]" />
                Click or hover any set region to inspect its formal logic and student count.
              </span>
              <Link href="/lab" className="font-bold text-[#1e39e7] hover:underline">
                Open Full Research Studio →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Factors Section */}
      <section className="py-16 bg-[#fff8e9] border-b border-[#c5c5d9]/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#aa3526] border border-[#c5c5d9] mb-3">
              Experimental Vectors
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1d182e] tracking-tight">
              The 3 Factors of the Stress Triangle
            </h2>
            <p className="text-sm sm:text-base text-[#444656] mt-2">
              Each student is tested along three distinct axes. A factor is considered present when
              the self-reported score meets or exceeds the project threshold of 6 out of 9.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Factor 1: Procrastination */}
            <div className="flex flex-col rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[5px_5px_0_0_#4057ff] hover:-translate-y-1 transition duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4057ff] text-white shadow-sm font-display text-xl font-bold">
                  P
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#dfe0ff] text-[#000b62]">
                  Set P
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-[#1d182e] mb-1">
                The Procrastination Trap
              </h3>
              <p className="text-xs font-semibold text-[#1e39e7] uppercase tracking-wider mb-3">
                Intentional Study Delay &amp; Avoidance
              </p>
              <p className="text-sm text-[#444656] leading-relaxed flex-1">
                Putting off revision until tension forces high-stress cramming cycles. Measures task
                displacement, late revision starts, and rushing to finish preparation.
              </p>
              <div className="mt-5 pt-3 border-t border-[#f2ebff] flex items-center justify-between text-xs text-[#757688]">
                <span>Score: ≥ 6/9</span>
                <span className="font-mono font-bold text-[#1e39e7]">63.8% Prevalence (67/105)</span>
              </div>
            </div>

            {/* Factor 2: Sleep Spiral */}
            <div className="flex flex-col rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[5px_5px_0_0_#fe725d] hover:-translate-y-1 transition duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fe725d] text-white shadow-sm font-display text-xl font-bold">
                  S
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#ffdad4] text-[#410100]">
                  Set S
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-[#1d182e] mb-1">
                The Sleep Spiral
              </h3>
              <p className="text-xs font-semibold text-[#aa3526] uppercase tracking-wider mb-3">
                Circadian Disruption &amp; Sleep Debt
              </p>
              <p className="text-sm text-[#444656] leading-relaxed flex-1">
                Erratic sleep patterns, sleep deprivation (&lt; 6 hours nightly), and pervasive daytime
                fatigue while attempting to retain complex academic concepts.
              </p>
              <div className="mt-5 pt-3 border-t border-[#f2ebff] flex items-center justify-between text-xs text-[#757688]">
                <span>Score: ≥ 6/9</span>
                <span className="font-mono font-bold text-[#aa3526]">41.9% Prevalence (44/105)</span>
              </div>
            </div>

            {/* Factor 3: Pressure Bubble */}
            <div className="flex flex-col rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[5px_5px_0_0_#ccf15a] hover:-translate-y-1 transition duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ccf15a] text-[#161e00] shadow-sm font-display text-xl font-bold border border-[#161e00]">
                  F
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#ccf15a]/40 text-[#161e00]">
                  Set F
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-[#1d182e] mb-1">
                The Pressure Bubble
              </h3>
              <p className="text-xs font-semibold text-[#485b00] uppercase tracking-wider mb-3">
                Social &amp; Family Expectations
              </p>
              <p className="text-sm text-[#444656] leading-relaxed flex-1">
                High familial grade demands, anxious peer comparison, and the acute fear of letting
                people down if exam scores fall below anticipated standards.
              </p>
              <div className="mt-5 pt-3 border-t border-[#f2ebff] flex items-center justify-between text-xs text-[#757688]">
                <span>Score: ≥ 6/9</span>
                <span className="font-mono font-bold text-[#485b00]">61.9% Prevalence (65/105)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Mathematical Concepts */}
      <section className="py-16 bg-[#fdf7ff]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1d182e]">
              Rigorous Math Meets Human Experience
            </h2>
            <p className="text-sm sm:text-base text-[#444656] mt-2">
              We translate psychological self-reports into formal discrete mathematics and logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[#c5c5d9] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ede4ff] text-[#1e39e7] mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#1d182e] mb-2">
                1. Inclusion–Exclusion
              </h3>
              <p className="text-sm text-[#444656] leading-relaxed mb-3">
                Prevents double-counting in multi-set overlaps. We compute the exact formula:
              </p>
              <div className="rounded-lg bg-[#f2ebff] p-2.5 font-mono text-xs font-bold text-[#1e39e7] overflow-x-auto">
                |P ∪ S ∪ F| = |P| + |S| + |F| − |P∩S| − |P∩F| − |S∩F| + |P∩S∩F|
              </div>
            </div>

            <div className="rounded-xl border border-[#c5c5d9] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffdad4] text-[#aa3526] mb-4">
                <Binary className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#1d182e] mb-2">
                2. Propositional Logic
              </h3>
              <p className="text-sm text-[#444656] leading-relaxed mb-3">
                We test material implications <span className="font-mono font-bold">X → E</span> across all 4 truth assignments. Counterexamples (X is true, yet E is false) empirically test whether a factor is sufficient for stress.
              </p>
              <div className="rounded-lg bg-[#ffdad4]/40 p-2.5 font-mono text-xs font-bold text-[#aa3526]">
                T → F is FALSE (Empirical Counterexample)
              </div>
            </div>

            <div className="rounded-xl border border-[#c5c5d9] bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ccf15a]/40 text-[#161e00] mb-4">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#1d182e] mb-2">
                3. Prediction vs Reality
              </h3>
              <p className="text-sm text-[#444656] leading-relaxed mb-3">
                To prevent hindsight bias, you record your intuitive prior hypothesis before answering questions. We then measure the empirical delta between expectation and observed data.
              </p>
              <div className="rounded-lg bg-[#ccf15a]/50 p-2.5 font-mono text-xs font-bold text-[#161e00]">
                Prior Expectation ≠ Empirical Evidence
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ethical Anonymity Banner */}
      <section className="bg-[#1d182e] text-white py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-[#ccf15a] uppercase tracking-wider mb-4">
            <ShieldCheck className="h-4 w-4" />
            Zero Tracking • 100% Anonymous
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-3">
            Pure Educational Mathematics. No Medical Claims.
          </h2>
          <p className="text-sm sm:text-base text-[#c5c5d9] max-w-2xl mx-auto leading-relaxed mb-6">
            Participation is voluntary and unauthenticated. We never collect names, student IDs, emails,
            or IP addresses. Thresholds are operational rules for university coursework, not clinical diagnostics.
          </p>
          <Link
            href="/participate"
            className="inline-flex items-center gap-2 rounded-xl bg-[#ccf15a] text-[#161e00] px-6 py-3 font-display text-sm font-bold shadow-[3px_3px_0_0_#ffffff] hover:bg-white transition"
          >
            <span>Begin Anonymous Journey</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
