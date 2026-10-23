import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Binary,
  Compass,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[#fdf7ff] py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b border-[#c5c5d9]/60 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2ebff] text-[#1e39e7] font-mono text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" />
            University Mathematics Experimental Learning
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#1d182e] tracking-tight">
            Experimental Methodology &amp; Mathematical Transparency
          </h1>
          <p className="text-base sm:text-lg text-[#444656] leading-relaxed">
            Academic topic: <em>“Exam Stress Triangle: Applying the Principle of Inclusion–Exclusion
            and Propositional Logic to Study Exam Stress Among Students.”</em>
          </p>
        </div>

        {/* 1. Experimental Objective */}
        <section className="rounded-2xl border-2 border-[#1d182e] bg-white p-6 sm:p-8 shadow-[5px_5px_0_0_#1d182e] space-y-4">
          <h2 className="font-display font-bold text-2xl text-[#1d182e]">
            1. Experimental Objective
          </h2>
          <p className="text-sm sm:text-base text-[#444656] leading-relaxed">
            Exam anxiety is frequently attributed to isolated behavioral or environmental factors.
            This project provides an interactive experimental sandbox to investigate whether common
            beliefs match observed student data when modeled through formal discrete mathematics.
          </p>
          <div className="rounded-xl bg-[#f2ebff] p-4 border border-[#c5c5d9] space-y-2 text-xs sm:text-sm text-[#1d182e]">
            <strong>Core Scientific Inquiries:</strong>
            <ul className="list-disc list-inside space-y-1 text-[#444656]">
              <li>How do procrastination, sleep debt, and external social pressures overlap?</li>
              <li>Does experiencing an individual factor guarantee elevated exam stress in classical logic ($X \implies E$)?</li>
              <li>Does locking in predictive hypotheses before questionnaire measurement reveal widespread hindsight bias?</li>
            </ul>
          </div>
        </section>

        {/* 2. Factor Sets & Scoring Single Source of Truth */}
        <section className="rounded-2xl border-2 border-[#1d182e] bg-white p-6 sm:p-8 shadow-[5px_5px_0_0_#1d182e] space-y-6">
          <h2 className="font-display font-bold text-2xl text-[#1d182e]">
            2. The Four Variables &amp; Scoring Thresholds
          </h2>

          <div className="space-y-4 text-sm text-[#444656] leading-relaxed">
            <p>
              Each factor is evaluated using 3 questions with Likert scoring (Never = 0, Rarely = 1, Often = 2, Almost always = 3).
              The maximum score for any factor is <strong>9</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-[#c5c5d9] p-4 bg-[#fdf7ff]">
                <div className="font-display font-bold text-base text-[#1e39e7] mb-1">
                  Set P: Procrastination
                </div>
                <div className="font-mono text-xs font-bold text-[#1d182e] mb-2">
                  Membership: Score ≥ 6 / 9
                </div>
                <p className="text-xs text-[#757688]">
                  Measures intentional delay, study avoidance, and high-tension cramming.
                </p>
              </div>

              <div className="rounded-xl border border-[#c5c5d9] p-4 bg-[#fdf7ff]">
                <div className="font-display font-bold text-base text-[#aa3526] mb-1">
                  Set S: Sleep Deficit
                </div>
                <div className="font-mono text-xs font-bold text-[#1d182e] mb-2">
                  Membership: Score ≥ 6 / 9
                </div>
                <p className="text-xs text-[#757688]">
                  Measures chronic sleep debt (&lt; 6h), irregular schedule, and cognitive fatigue.
                </p>
              </div>

              <div className="rounded-xl border border-[#c5c5d9] p-4 bg-[#fdf7ff]">
                <div className="font-display font-bold text-base text-[#485b00] mb-1">
                  Set F: Social Pressure
                </div>
                <div className="font-mono text-xs font-bold text-[#1d182e] mb-2">
                  Membership: Score ≥ 6 / 9
                </div>
                <p className="text-xs text-[#757688]">
                  Measures familial grade expectations, peer comparisons, and fear of disappointment.
                </p>
              </div>
            </div>

            <div className="rounded-xl border-2 border-[#1d182e] p-5 bg-[#fff8e9] space-y-2">
              <div className="font-display font-bold text-base text-[#1d182e]">
                Set E: Elevated Project-Defined Stress (Consequent Variable)
              </div>
              <p className="text-xs sm:text-sm text-[#444656]">
                Evaluated through 4 questions (overwhelmed feeling, inability to relax, focus interference, routine disruption).
                Max score = <strong>12</strong>. Stress Indicator = (Total / 12) × 100.
              </p>
              <div className="font-mono text-xs font-bold text-[#1d182e]">
                Rule: Member of Set E ⟺ Total Stress Score ≥ 4 out of 12.
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-xs">
                <span className="p-1 rounded bg-white">0–3: Lower Indicator</span>
                <span className="p-1 rounded bg-[#ede4ff]">4–7: Moderate Indicator</span>
                <span className="p-1 rounded bg-[#ffdad4]">8–12: Higher Indicator</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Principle of Inclusion-Exclusion */}
        <section className="rounded-2xl border-2 border-[#1d182e] bg-white p-6 sm:p-8 shadow-[5px_5px_0_0_#1d182e] space-y-4">
          <h2 className="font-display font-bold text-2xl text-[#1d182e]">
            3. The Principle of Inclusion–Exclusion (PIE)
          </h2>
          <p className="text-sm text-[#444656] leading-relaxed">
            In discrete mathematics, the size of the union of three finite sets is formulated to prevent
            multiple counting of overlapping elements:
          </p>

          <div className="rounded-xl bg-[#f2ebff] p-4 text-center font-mono text-sm sm:text-base font-bold text-[#1e39e7] border border-[#c5c5d9]">
            |P ∪ S ∪ F| = |P| + |S| + |F| − |P ∩ S| − |P ∩ F| − |S ∩ F| + |P ∩ S ∩ F|
          </div>

          <p className="text-sm text-[#444656] leading-relaxed">
            In our research application, every participant record is indexed with boolean flags for
            $(P, S, F)$. The total union count calculated via PIE is continuously verified against
            the direct database count of students satisfying $P \lor S \lor F$.
          </p>
        </section>

        {/* 4. Propositional Logic & Material Implication */}
        <section className="rounded-2xl border-2 border-[#1d182e] bg-white p-6 sm:p-8 shadow-[5px_5px_0_0_#1d182e] space-y-4">
          <h2 className="font-display font-bold text-2xl text-[#1d182e]">
            4. Material Implication &amp; Empirical Counterexamples
          </h2>
          <p className="text-sm text-[#444656] leading-relaxed">
            We test conditional claims such as &quot;If a student procrastinates, then they experience elevated stress&quot; ($P \implies E$).
            In formal classical propositional logic, material implication evaluates as:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-[#c5c5d9] rounded-lg">
              <thead className="bg-[#f2ebff] text-[#1d182e]">
                <tr>
                  <th className="p-2.5">X (Antecedent)</th>
                  <th className="p-2.5">E (Consequent)</th>
                  <th className="p-2.5">X → E</th>
                  <th className="p-2.5">Significance in this Study</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2ebff]">
                <tr>
                  <td className="p-2.5 font-bold">T</td>
                  <td className="p-2.5 font-bold">T</td>
                  <td className="p-2.5 text-emerald-700 font-bold">TRUE</td>
                  <td className="p-2.5 text-[#444656]">Factor present and stress elevated.</td>
                </tr>
                <tr className="bg-red-50">
                  <td className="p-2.5 font-bold text-red-900">T</td>
                  <td className="p-2.5 font-bold text-red-900">F</td>
                  <td className="p-2.5 text-red-700 font-black">FALSE</td>
                  <td className="p-2.5 text-red-900 font-bold">COUNTEREXAMPLE: Student met factor rule yet remained low stress.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">F</td>
                  <td className="p-2.5 font-bold">T</td>
                  <td className="p-2.5 text-emerald-700 font-bold">TRUE</td>
                  <td className="p-2.5 text-[#444656]">Vacuously true: Stress triggered by non-X vectors.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">F</td>
                  <td className="p-2.5 font-bold">F</td>
                  <td className="p-2.5 text-emerald-700 font-bold">TRUE</td>
                  <td className="p-2.5 text-[#444656]">Neither factor nor stress observed.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[#757688] leading-relaxed">
            The presence of counterexamples in the dataset empirically proves that no individual factor is
            logically sufficient to guarantee exam stress.
          </p>
        </section>

        {/* 5. Scientific Limitations */}
        <section className="rounded-2xl border-2 border-[#1d182e] bg-[#fff8e9] p-6 sm:p-8 shadow-[5px_5px_0_0_#1d182e] space-y-3">
          <div className="flex items-center gap-2 text-[#aa3526]">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="font-display font-bold text-xl text-[#1d182e]">
              5. Study Limitations &amp; Ethical Safeguards
            </h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-[#444656] leading-relaxed">
            <li>
              <strong>Self-Report Subjectivity:</strong> Likert answers reflect personal perception rather
              than physiological biometrics (e.g., cortisol levels or polysomnography).
            </li>
            <li>
              <strong>Operational Definitions:</strong> The cutoff scores (6/9 and 4/12) are coursework
              heuristics designed for discrete math exploration, not diagnostic clinical standards.
            </li>
            <li>
              <strong>Correlation ≠ Causation:</strong> High association differentials indicate observable co-occurrence,
              not direct mechanical etiology.
            </li>
            <li>
              <strong>Anonymity &amp; Privacy:</strong> Zero PII is stored. No IP addresses, device identifiers,
              or tracking cookies are used.
            </li>
          </ul>
        </section>

        {/* Action Link */}
        <div className="flex justify-between items-center pt-4">
          <Link
            href="/lab"
            className="inline-flex items-center gap-2 rounded-xl bg-[#4057ff] text-white px-6 py-3 font-display text-sm font-bold shadow-[3px_3px_0_0_#1d182e]"
          >
            <span>Back to Research Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/report"
            className="text-xs font-bold text-[#1e39e7] hover:underline"
          >
            Open Printable Academic Report →
          </Link>
        </div>
      </div>
    </div>
  );
}
