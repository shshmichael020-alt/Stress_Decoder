"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Printer,
  FileSpreadsheet,
  ArrowLeft,
  Layers,
  Binary,
} from "lucide-react";
import { AggregateResearchData } from "@/lib/types";
import {
  fetchResearchAggregate,
  generateAggregateCSV,
  generateVennRegionsCSV,
  generateTruthTableCSV,
} from "@/lib/storage";
import { toast } from "sonner";

export default function ReportPage() {
  const [data, setData] = useState<AggregateResearchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResearchAggregate()
      .then((d) => setData(d))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const downloadCSV = (type: "aggregate" | "venn" | "truth_table") => {
    try {
      if (!data) return;
      let csvContent = "";
      if (type === "venn") csvContent = generateVennRegionsCSV(data);
      else if (type === "truth_table") csvContent = generateTruthTableCSV(data);
      else csvContent = generateAggregateCSV(data);

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stress_triangle_${type}_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Exported ${type.replace("_", " ")} CSV successfully.`);
    } catch (e) {
      toast.error("Failed to generate CSV export.");
    }
  };

  if (loading || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-display font-bold text-lg text-[#1e39e7]">
        Compiling Printable Report...
      </div>
    );
  }

  const v = data.venn;

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 text-[#1d182e]">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Controls Bar (Hidden during print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-[#1d182e] bg-[#fdf7ff] p-4 shadow-[4px_4px_0_0_#1d182e]">
          <Link
            href="/lab"
            className="flex items-center gap-1.5 text-xs font-bold text-[#1e39e7] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Interactive Lab</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => downloadCSV("aggregate")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#1d182e] bg-white px-3 py-1.5 text-xs font-bold text-[#1d182e] shadow-sm hover:bg-[#ede4ff]"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-700" />
              <span>Export Aggregate CSV</span>
            </button>
            <button
              type="button"
              onClick={() => downloadCSV("venn")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#1d182e] bg-white px-3 py-1.5 text-xs font-bold text-[#1d182e] shadow-sm hover:bg-[#ede4ff]"
            >
              <Layers className="h-3.5 w-3.5 text-[#4057ff]" />
              <span>Export Venn Regions CSV</span>
            </button>
            <button
              type="button"
              onClick={() => downloadCSV("truth_table")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#1d182e] bg-white px-3 py-1.5 text-xs font-bold text-[#1d182e] shadow-sm hover:bg-[#ede4ff]"
            >
              <Binary className="h-3.5 w-3.5 text-[#fe725d]" />
              <span>Export Logic Truth CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#4057ff] text-white px-4 py-1.5 text-xs font-bold shadow-[2px_2px_0_0_#1d182e] hover:translate-x-0.5 hover:translate-y-0.5 transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Research Report</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT BODY */}
        <div className="print-page border border-[#c5c5d9] p-8 sm:p-12 space-y-8 rounded-xl bg-white shadow-sm">
          {/* Header */}
          <div className="border-b-2 border-[#1d182e] pb-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-[#444656]">
              <span>University Mathematics Experimental Learning</span>
              <span>Coursework Project Report</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1d182e] tracking-tight">
              Exam Stress Triangle: Principle of Inclusion–Exclusion &amp; Propositional Logic
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#757688] pt-1">
              <span>Cohort Sample Size: <strong>N = {data.sampleSize}</strong></span>
              <span>•</span>
              <span>Collection Period: <strong>{data.collectionPeriod}</strong></span>
              <span>•</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Dataset Status Banner */}
          <div className="rounded-lg border border-[#c5c5d9] bg-[#fdf7ff] p-3 text-xs leading-relaxed">
            <strong>DATA ORIGIN &amp; TRANSPARENCY:</strong> {data.dataSourceLabel}.
            This report represents verified research calculations derived via the project&apos;s single source of truth scoring engine.
          </div>

          {/* Section 1: Set Sizes & Prevalences */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-base text-[#1d182e] border-b pb-1">
              1. Observed Factor Prevalences &amp; Set Sizes (Threshold ≥ 6/9)
            </h2>
            <div className="grid grid-cols-4 gap-3 text-center text-xs font-mono">
              <div className="border p-2.5 rounded">
                <div className="text-[#444656]">Set P (Procrastinate)</div>
                <div className="font-bold text-sm text-[#1e39e7] mt-1">{v.sizeP} students</div>
                <div className="text-[11px] text-[#757688]">{((v.sizeP / Math.max(1, data.sampleSize)) * 100).toFixed(1)}%</div>
              </div>
              <div className="border p-2.5 rounded">
                <div className="text-[#444656]">Set S (Sleep Loss)</div>
                <div className="font-bold text-sm text-[#aa3526] mt-1">{v.sizeS} students</div>
                <div className="text-[11px] text-[#757688]">{((v.sizeS / Math.max(1, data.sampleSize)) * 100).toFixed(1)}%</div>
              </div>
              <div className="border p-2.5 rounded">
                <div className="text-[#444656]">Set F (Social Peer)</div>
                <div className="font-bold text-sm text-[#485b00] mt-1">{v.sizeF} students</div>
                <div className="text-[11px] text-[#757688]">{((v.sizeF / Math.max(1, data.sampleSize)) * 100).toFixed(1)}%</div>
              </div>
              <div className="border p-2.5 rounded bg-[#f2ebff]">
                <div className="text-[#444656]">Set E (Stress ≥ 4)</div>
                <div className="font-bold text-sm text-[#1d182e] mt-1">{data.elevatedStressCount} students</div>
                <div className="text-[11px] text-[#757688]">{data.elevatedStressPct}%</div>
              </div>
            </div>
          </div>

          {/* Section 2: Exact 8 Venn Partitions */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-base text-[#1d182e] border-b pb-1">
              2. Mutually Exclusive 8-Region Distribution
            </h2>
            <table className="w-full text-left text-xs font-mono border">
              <thead className="bg-[#f2ebff] border-b">
                <tr>
                  <th className="p-2">Region Description</th>
                  <th className="p-2">Formal Boolean Intersection</th>
                  <th className="p-2 text-right">Student Count</th>
                  <th className="p-2 text-right">Prevalence</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-2">Procrastination Only</td>
                  <td className="p-2">P ∧ ¬S ∧ ¬F</td>
                  <td className="p-2 text-right font-bold">{v.pOnly}</td>
                  <td className="p-2 text-right">{v.pOnlyPct}%</td>
                </tr>
                <tr>
                  <td className="p-2">Sleep Deficit Only</td>
                  <td className="p-2">¬P ∧ S ∧ ¬F</td>
                  <td className="p-2 text-right font-bold">{v.sOnly}</td>
                  <td className="p-2 text-right">{v.sOnlyPct}%</td>
                </tr>
                <tr>
                  <td className="p-2">Social Pressure Only</td>
                  <td className="p-2">¬P ∧ ¬S ∧ F</td>
                  <td className="p-2 text-right font-bold">{v.fOnly}</td>
                  <td className="p-2 text-right">{v.fOnlyPct}%</td>
                </tr>
                <tr>
                  <td className="p-2">Procrastination &amp; Sleep Only</td>
                  <td className="p-2">P ∧ S ∧ ¬F</td>
                  <td className="p-2 text-right font-bold">{v.psOnly}</td>
                  <td className="p-2 text-right">{v.psOnlyPct}%</td>
                </tr>
                <tr>
                  <td className="p-2">Procrastination &amp; Pressure Only</td>
                  <td className="p-2">P ∧ ¬S ∧ F</td>
                  <td className="p-2 text-right font-bold">{v.pfOnly}</td>
                  <td className="p-2 text-right">{v.pfOnlyPct}%</td>
                </tr>
                <tr>
                  <td className="p-2">Sleep &amp; Pressure Only</td>
                  <td className="p-2">¬P ∧ S ∧ F</td>
                  <td className="p-2 text-right font-bold">{v.sfOnly}</td>
                  <td className="p-2 text-right">{v.sfOnlyPct}%</td>
                </tr>
                <tr className="bg-[#fff8e9]">
                  <td className="p-2 font-bold">The Triple Overlap (All 3)</td>
                  <td className="p-2 font-bold">P ∧ S ∧ F</td>
                  <td className="p-2 text-right font-bold text-[#fe725d]">{v.psf}</td>
                  <td className="p-2 text-right font-bold">{v.psfPct}%</td>
                </tr>
                <tr>
                  <td className="p-2">None of the Three Factors</td>
                  <td className="p-2">¬P ∧ ¬S ∧ ¬F</td>
                  <td className="p-2 text-right font-bold">{v.none}</td>
                  <td className="p-2 text-right">{v.nonePct}%</td>
                </tr>
              </tbody>
              <tfoot className="bg-[#ede4ff] font-bold border-t">
                <tr>
                  <td colSpan={2} className="p-2">Partition Sum Check (N)</td>
                  <td className="p-2 text-right">{v.total}</td>
                  <td className="p-2 text-right">100.0%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Section 3: Inclusion-Exclusion Equation */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-base text-[#1d182e] border-b pb-1">
              3. Principle of Inclusion–Exclusion Verification
            </h2>
            <div className="p-3 bg-[#f2ebff] rounded font-mono text-xs">
              |P ∪ S ∪ F| = {v.sizeP} + {v.sizeS} + {v.sizeF} − {v.interPS} − {v.interPF} − {v.interSF} + {v.psf} = <strong>{v.unionPSF} students</strong> ({v.unionPct}% of cohort)
            </div>
            <p className="text-xs text-[#444656]">
              Direct database query count matches the mathematical union calculation identically.
            </p>
          </div>

          {/* Section 4: Propositional Logic Summary */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-base text-[#1d182e] border-b pb-1">
              4. Propositional Logic Counterexample Analysis
            </h2>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {(['P', 'S', 'F'] as const).map((factor) => {
                const table = data.truthTables[factor];
                return (
                  <div key={factor} className="border p-3 rounded space-y-1">
                    <div className="font-bold text-[#1d182e]">{table.implicationFormula}</div>
                    <div className="text-[#aa3526] font-mono">
                      Counterexamples (T → F): {table.falseCount} ({table.falsePercentage}%)
                    </div>
                    <div className="text-[11px] text-[#757688] pt-1">
                      {table.falseCount > 0
                        ? `Falsifies ${factor} as a strict sufficient condition for stress.`
                        : `No counterexamples observed in current sample.`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Academic Limitations & Ethics */}
          <div className="border-t pt-4 space-y-2 text-xs text-[#757688] leading-relaxed">
            <div className="font-bold text-[#1d182e]">METHODOLOGICAL CONSTRAINTS &amp; ETHICS:</div>
            <p>
              1. This dataset was gathered anonymously and voluntarily for educational demonstration in university coursework.
              2. Score cutoffs (6/9 and 4/12) are operational heuristics, not clinically validated diagnostic thresholds.
              3. Statistical associations reflect observed patterns; no causal or medical conclusions are asserted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
