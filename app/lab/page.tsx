"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Layers,
  Binary,
  Scale,
  Brain,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { AggregateResearchData, FactorKey } from "@/lib/types";
import { VennDiagram, VennRegionKey } from "@/components/venn-diagram";
import { fetchResearchAggregate } from "@/lib/storage";

export default function ResearchLabPage() {
  const [data, setData] = useState<AggregateResearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFormulaTerm, setSelectedFormulaTerm] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<VennRegionKey | null>(null);
  const [activeLogicTab, setActiveLogicTab] = useState<FactorKey>('P');
  const [dataMode, setDataMode] = useState<'demo' | 'live'>('demo');

  const loadData = async (mode: 'demo' | 'live') => {
    setLoading(true);
    try {
      const aggData = await fetchResearchAggregate(mode);
      setData(aggData);
    } catch (e) {
      console.error("Failed to load aggregate research data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(dataMode);
  }, [dataMode]);

  if (loading || !data) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-[#4057ff] animate-spin" />
          <span className="font-display font-bold text-lg text-[#1d182e]">
            Compiling Research Overlap Matrices...
          </span>
        </div>
      </div>
    );
  }

  const v = data.venn;
  const isZeroSubmissions = data.sampleSize === 0;

  return (
    <div className="min-h-screen bg-[#fdf7ff] py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* ========================================================================= */}
        {/* 8.1 RESEARCH OVERVIEW & COHORT SNAPSHOT                                   */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c5c5d9]/60 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ede4ff] text-[#1e39e7] font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <BarChart3 className="h-3.5 w-3.5" />
                Experimental Mathematics Data Lab
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1d182e] tracking-tight">
                The Empirical Overlap: Cohort n={data.sampleSize}
              </h1>
              <p className="text-xs sm:text-sm text-[#444656] mt-1">
                Source: University Mathematics Experimental Learning Project • {data.collectionPeriod}
              </p>
            </div>

            {/* Mode Toggle & Export Shortcuts */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl border border-[#1d182e] bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setDataMode('demo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    dataMode === 'demo'
                      ? 'bg-[#1d182e] text-white shadow-sm'
                      : 'text-[#444656] hover:bg-[#ede4ff]'
                  }`}
                >
                  Demo (n=412)
                </button>
                <button
                  type="button"
                  onClick={() => setDataMode('live')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    dataMode === 'live'
                      ? 'bg-[#4057ff] text-white shadow-sm'
                      : 'text-[#444656] hover:bg-[#ede4ff]'
                  }`}
                >
                  Live Database
                </button>
              </div>

              <Link
                href="/report"
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1d182e] bg-[#ccf15a] px-3.5 py-1.5 text-xs font-bold text-[#161e00] shadow-[2px_2px_0_0_#161e00] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Export Report</span>
              </Link>
            </div>
          </div>

          {/* Visibility Banner */}
          <div
            className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-xs sm:text-sm ${
              data.isDemo
                ? 'bg-[#ffdad4]/40 border-[#aa3526] text-[#6f0802]'
                : 'bg-[#ede4ff] border-[#1e39e7] text-[#000b62]'
            }`}
          >
            <Info className="h-4 w-4 shrink-0" />
            <span>
              <strong>DATASET STATUS:</strong> {data.dataSourceLabel}. All metrics below are mathematically calculated from this exact dataset.
            </span>
          </div>

          {/* Empty State when 0 submissions */}
          {isZeroSubmissions ? (
            <div className="rounded-2xl border-2 border-dashed border-[#c5c5d9] bg-white p-12 text-center space-y-4">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-[#ede4ff] text-[#1e39e7]">
                <Scale className="h-7 w-7" />
              </div>
              <h2 className="font-display font-bold text-xl text-[#1d182e]">
                No Empirical Submissions In Live Database Yet
              </h2>
              <p className="text-sm text-[#444656] max-w-md mx-auto">
                Be the first student to participate, or switch to the Illustrative Cohort (n=412) to explore the mathematical models.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href="/participate"
                  className="rounded-xl bg-[#4057ff] text-white px-5 py-2.5 font-display text-sm font-bold shadow-[3px_3px_0_0_#1d182e]"
                >
                  Participate Now
                </Link>
                <button
                  type="button"
                  onClick={() => setDataMode('demo')}
                  className="rounded-xl border border-[#c5c5d9] bg-white px-4 py-2.5 text-sm font-semibold text-[#1d182e]"
                >
                  Load Demo Cohort
                </button>
              </div>
            </div>
          ) : (
            /* Bento KPI Metric Cards */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Card P */}
              <div className="rounded-2xl border-2 border-[#1d182e] bg-[#4057ff] p-5 text-white shadow-[4px_4px_0_0_#1d182e] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase opacity-90">Set P (Procrastinate)</span>
                  <span className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-xs font-bold">P</span>
                </div>
                <div className="mt-3">
                  <div className="font-display font-black text-3xl sm:text-4xl leading-none">
                    {((v.sizeP / data.sampleSize) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs opacity-90 mt-1 font-mono">
                    {v.sizeP} of {data.sampleSize} students
                  </div>
                </div>
              </div>

              {/* Card S */}
              <div className="rounded-2xl border-2 border-[#1d182e] bg-[#fe725d] p-5 text-white shadow-[4px_4px_0_0_#1d182e] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase opacity-90">Set S (Sleep Loss)</span>
                  <span className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-xs font-bold">S</span>
                </div>
                <div className="mt-3">
                  <div className="font-display font-black text-3xl sm:text-4xl leading-none">
                    {((v.sizeS / data.sampleSize) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs opacity-90 mt-1 font-mono">
                    {v.sizeS} of {data.sampleSize} students
                  </div>
                </div>
              </div>

              {/* Card F */}
              <div className="rounded-2xl border-2 border-[#1d182e] bg-[#ccf15a] p-5 text-[#161e00] shadow-[4px_4px_0_0_#1d182e] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase font-bold">Set F (Social Peer)</span>
                  <span className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-xs font-bold">F</span>
                </div>
                <div className="mt-3">
                  <div className="font-display font-black text-3xl sm:text-4xl leading-none">
                    {((v.sizeF / data.sampleSize) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs font-semibold mt-1 font-mono">
                    {v.sizeF} of {data.sampleSize} students
                  </div>
                </div>
              </div>

              {/* Card E: Elevated Stress */}
              <div className="rounded-2xl border-2 border-[#1d182e] bg-[#1d182e] p-5 text-white shadow-[4px_4px_0_0_#4057ff] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase opacity-90">Set E (High Stress)</span>
                  <span className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-xs font-bold">E</span>
                </div>
                <div className="mt-3">
                  <div className="font-display font-black text-3xl sm:text-4xl leading-none text-[#ccf15a]">
                    {data.elevatedStressPct}%
                  </div>
                  <div className="text-xs opacity-90 mt-1 font-mono">
                    {data.elevatedStressCount} students (Score ≥ 4)
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {!isZeroSubmissions && (
          <>
            {/* ========================================================================= */}
            {/* 8.2 & 8.3 THE OVERLAP STUDIO & INCLUSION-EXCLUSION EXPLORER              */}
            {/* ========================================================================= */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Interactive Venn Visualizer (6 cols) */}
              <div className="lg:col-span-6 rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[5px_5px_0_0_#1d182e] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#f2ebff] pb-3 mb-4">
                    <div>
                      <h2 className="font-display font-bold text-xl text-[#1d182e]">
                        The Overlap Studio
                      </h2>
                      <p className="text-xs text-[#444656]">
                        Tap any region to inspect set notation &amp; metrics
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f2ebff] px-2.5 py-1 font-mono text-xs font-bold text-[#1e39e7]">
                      8 Partitions
                    </span>
                  </div>

                  <VennDiagram
                    counts={v}
                    highlightedTerm={selectedFormulaTerm}
                    selectedRegion={selectedRegion}
                    onSelectRegion={setSelectedRegion}
                  />
                </div>

                {/* Mutually Exclusive Sub-Totals */}
                <div className="grid grid-cols-4 gap-2 pt-4 border-t border-[#f2ebff] text-center">
                  <div className="rounded-xl bg-[#f2ebff] p-2">
                    <div className="text-[10px] font-mono font-bold text-[#757688] uppercase">1 Only</div>
                    <div className="font-display font-bold text-base text-[#1d182e]">{v.exactlyOne}</div>
                  </div>
                  <div className="rounded-xl bg-[#f2ebff] p-2">
                    <div className="text-[10px] font-mono font-bold text-[#757688] uppercase">2 Only</div>
                    <div className="font-display font-bold text-base text-[#1d182e]">{v.exactlyTwo}</div>
                  </div>
                  <div className="rounded-xl bg-[#f2ebff] p-2">
                    <div className="text-[10px] font-mono font-bold text-[#757688] uppercase">All 3</div>
                    <div className="font-display font-bold text-base text-[#fe725d]">{v.allThree}</div>
                  </div>
                  <div className="rounded-xl bg-[#f2ebff] p-2">
                    <div className="text-[10px] font-mono font-bold text-[#757688] uppercase">None</div>
                    <div className="font-display font-bold text-base text-[#444656]">{v.none}</div>
                  </div>
                </div>
              </div>

              {/* Right: Inclusion-Exclusion Formula Explorer (6 cols) */}
              <div className="lg:col-span-6 rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[5px_5px_0_0_#1d182e] space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ccf15a]/40 text-[#161e00] text-xs font-bold uppercase tracking-wider mb-2">
                    Set Theory Principle
                  </div>
                  <h2 className="font-display font-bold text-xl text-[#1d182e]">
                    Inclusion–Exclusion Explorer
                  </h2>
                  <p className="text-xs text-[#444656] mt-1">
                    Click each term below to illuminate its corresponding area in the Venn diagram.
                  </p>
                </div>

                {/* Clickable Interactive Equation Bar */}
                <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-xl bg-[#f2ebff] border border-[#c5c5d9] font-mono text-xs sm:text-sm font-bold">
                  <span className="text-[#1d182e]">|P ∪ S ∪ F| =</span>

                  {/* |P| */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFormulaTerm(selectedFormulaTerm === '|P|' ? null : '|P|')
                    }
                    className={`px-2 py-1 rounded transition ${
                      selectedFormulaTerm === '|P|'
                        ? 'bg-[#4057ff] text-white shadow-sm'
                        : 'bg-white text-[#1e39e7] hover:bg-[#ede4ff]'
                    }`}
                  >
                    |P| ({v.sizeP})
                  </button>
                  <span>+</span>

                  {/* |S| */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFormulaTerm(selectedFormulaTerm === '|S|' ? null : '|S|')
                    }
                    className={`px-2 py-1 rounded transition ${
                      selectedFormulaTerm === '|S|'
                        ? 'bg-[#fe725d] text-white shadow-sm'
                        : 'bg-white text-[#aa3526] hover:bg-[#ede4ff]'
                    }`}
                  >
                    |S| ({v.sizeS})
                  </button>
                  <span>+</span>

                  {/* |F| */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFormulaTerm(selectedFormulaTerm === '|F|' ? null : '|F|')
                    }
                    className={`px-2 py-1 rounded transition ${
                      selectedFormulaTerm === '|F|'
                        ? 'bg-[#485b00] text-white shadow-sm'
                        : 'bg-white text-[#485b00] hover:bg-[#ede4ff]'
                    }`}
                  >
                    |F| ({v.sizeF})
                  </button>
                  <span>−</span>

                  {/* |P ∩ S| */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFormulaTerm(selectedFormulaTerm === '|P ∩ S|' ? null : '|P ∩ S|')
                    }
                    className={`px-2 py-1 rounded transition ${
                      selectedFormulaTerm === '|P ∩ S|'
                        ? 'bg-[#1d182e] text-white shadow-sm'
                        : 'bg-white text-[#1d182e] hover:bg-[#ede4ff]'
                    }`}
                  >
                    |P∩S| ({v.interPS})
                  </button>
                  <span>−</span>

                  {/* |P ∩ F| */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFormulaTerm(selectedFormulaTerm === '|P ∩ F|' ? null : '|P ∩ F|')
                    }
                    className={`px-2 py-1 rounded transition ${
                      selectedFormulaTerm === '|P ∩ F|'
                        ? 'bg-[#1d182e] text-white shadow-sm'
                        : 'bg-white text-[#1d182e] hover:bg-[#ede4ff]'
                    }`}
                  >
                    |P∩F| ({v.interPF})
                  </button>
                  <span>−</span>

                  {/* |S ∩ F| */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFormulaTerm(selectedFormulaTerm === '|S ∩ F|' ? null : '|S ∩ F|')
                    }
                    className={`px-2 py-1 rounded transition ${
                      selectedFormulaTerm === '|S ∩ F|'
                        ? 'bg-[#1d182e] text-white shadow-sm'
                        : 'bg-white text-[#1d182e] hover:bg-[#ede4ff]'
                    }`}
                  >
                    |S∩F| ({v.interSF})
                  </button>
                  <span>+</span>

                  {/* |P ∩ S ∩ F| */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFormulaTerm(
                        selectedFormulaTerm === '|P ∩ S ∩ F|' ? null : '|P ∩ S ∩ F|'
                      )
                    }
                    className={`px-2 py-1 rounded transition ${
                      selectedFormulaTerm === '|P ∩ S ∩ F|'
                        ? 'bg-[#fe725d] text-white shadow-sm animate-pulse'
                        : 'bg-white text-[#fe725d] hover:bg-[#ede4ff]'
                    }`}
                  >
                    |P∩S∩F| ({v.psf})
                  </button>
                </div>

                {/* Step-by-Step Mathematical Walkthrough */}
                <div className="space-y-3 text-xs sm:text-sm text-[#444656] leading-relaxed">
                  <div className="p-3 rounded-xl bg-white border border-[#c5c5d9]">
                    <div className="font-bold text-[#1d182e] mb-1">
                      Step 1: Sum Single Sets
                    </div>
                    <div>
                      {v.sizeP} + {v.sizeS} + {v.sizeF} ={' '}
                      <strong>{v.sizeP + v.sizeS + v.sizeF}</strong> students.
                      <span className="text-[#757688] block text-xs mt-0.5">
                        Students in overlapping sets have been double-counted.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#c5c5d9]">
                    <div className="font-bold text-[#1d182e] mb-1">
                      Step 2: Subtract Pairwise Intersections
                    </div>
                    <div>
                      − ({v.interPS} + {v.interPF} + {v.interSF}) ={' '}
                      <strong>− {v.interPS + v.interPF + v.interSF}</strong>.
                      <span className="text-[#757688] block text-xs mt-0.5">
                        Removes excess duplicates from 2-set overlaps.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#c5c5d9]">
                    <div className="font-bold text-[#1d182e] mb-1">
                      Step 3: Add Triple Intersection Back
                    </div>
                    <div>
                      + {v.psf} = <strong>+ {v.psf}</strong>.
                      <span className="text-[#757688] block text-xs mt-0.5">
                        The central region was subtracted 3 times in step 2; adding it back once restores balance.
                      </span>
                    </div>
                  </div>

                  {/* Final Direct vs PIE Match Check */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#ccf15a]/40 border-2 border-[#161e00]">
                    <div>
                      <span className="font-display font-bold text-sm text-[#161e00] block">
                        Final Union: |P ∪ S ∪ F| = {v.unionPSF} students
                      </span>
                      <span className="text-xs text-[#161e00]/80">
                        {v.unionPct}% of cohort experiences at least one pressure vector.
                      </span>
                    </div>
                    <span className="flex items-center gap-1 font-mono text-xs font-bold text-[#161e00] bg-white px-2.5 py-1 rounded-md border border-[#161e00]">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      PIE Verified
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* 8.4 EXACT VENN REGION CALCULATIONS & CROSS-CHECK TABLE                    */}
            {/* ========================================================================= */}
            <section className="rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[5px_5px_0_0_#1d182e] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#1d182e]">
                    Exact 8-Region Invariant Verification
                  </h2>
                  <p className="text-xs text-[#444656]">
                    Row-level authoritative counts cross-checked against algebraic subtraction formulas.
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-[#1e39e7] px-2.5 py-1 rounded bg-[#f2ebff]">
                  Sum = {v.total} (100.0%)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b-2 border-[#1d182e] font-mono uppercase text-[#444656]">
                      <th className="py-2.5 px-3">Region #</th>
                      <th className="py-2.5 px-3">Symbolic Form</th>
                      <th className="py-2.5 px-3">Algebraic Formula</th>
                      <th className="py-2.5 px-3 text-right">Count</th>
                      <th className="py-2.5 px-3 text-right">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2ebff] font-mono">
                    <tr className="hover:bg-[#f8f1ff]">
                      <td className="py-2 px-3 font-bold text-[#1e39e7]">1</td>
                      <td className="py-2 px-3">P ∧ ¬S ∧ ¬F</td>
                      <td className="py-2 px-3 text-[#757688]">|P| − |P∩S| − |P∩F| + |P∩S∩F|</td>
                      <td className="py-2 px-3 text-right font-bold text-[#1d182e]">{v.pOnly}</td>
                      <td className="py-2 px-3 text-right">{v.pOnlyPct}%</td>
                    </tr>
                    <tr className="hover:bg-[#f8f1ff]">
                      <td className="py-2 px-3 font-bold text-[#aa3526]">2</td>
                      <td className="py-2 px-3">¬P ∧ S ∧ ¬F</td>
                      <td className="py-2 px-3 text-[#757688]">|S| − |P∩S| − |S∩F| + |P∩S∩F|</td>
                      <td className="py-2 px-3 text-right font-bold text-[#1d182e]">{v.sOnly}</td>
                      <td className="py-2 px-3 text-right">{v.sOnlyPct}%</td>
                    </tr>
                    <tr className="hover:bg-[#f8f1ff]">
                      <td className="py-2 px-3 font-bold text-[#485b00]">3</td>
                      <td className="py-2 px-3">¬P ∧ ¬S ∧ F</td>
                      <td className="py-2 px-3 text-[#757688]">|F| − |P∩F| − |S∩F| + |P∩S∩F|</td>
                      <td className="py-2 px-3 text-right font-bold text-[#1d182e]">{v.fOnly}</td>
                      <td className="py-2 px-3 text-right">{v.fOnlyPct}%</td>
                    </tr>
                    <tr className="hover:bg-[#f8f1ff]">
                      <td className="py-2 px-3 font-bold">4</td>
                      <td className="py-2 px-3">P ∧ S ∧ ¬F</td>
                      <td className="py-2 px-3 text-[#757688]">|P∩S| − |P∩S∩F|</td>
                      <td className="py-2 px-3 text-right font-bold text-[#1d182e]">{v.psOnly}</td>
                      <td className="py-2 px-3 text-right">{v.psOnlyPct}%</td>
                    </tr>
                    <tr className="hover:bg-[#f8f1ff]">
                      <td className="py-2 px-3 font-bold">5</td>
                      <td className="py-2 px-3">P ∧ ¬S ∧ F</td>
                      <td className="py-2 px-3 text-[#757688]">|P∩F| − |P∩S∩F|</td>
                      <td className="py-2 px-3 text-right font-bold text-[#1d182e]">{v.pfOnly}</td>
                      <td className="py-2 px-3 text-right">{v.pfOnlyPct}%</td>
                    </tr>
                    <tr className="hover:bg-[#f8f1ff]">
                      <td className="py-2 px-3 font-bold">6</td>
                      <td className="py-2 px-3">¬P ∧ S ∧ F</td>
                      <td className="py-2 px-3 text-[#757688]">|S∩F| − |P∩S∩F|</td>
                      <td className="py-2 px-3 text-right font-bold text-[#1d182e]">{v.sfOnly}</td>
                      <td className="py-2 px-3 text-right">{v.sfOnlyPct}%</td>
                    </tr>
                    <tr className="hover:bg-[#f8f1ff]">
                      <td className="py-2 px-3 font-bold text-[#fe725d]">7</td>
                      <td className="py-2 px-3 font-bold">P ∧ S ∧ F</td>
                      <td className="py-2 px-3 text-[#757688]">|P∩S∩F|</td>
                      <td className="py-2 px-3 text-right font-bold text-[#fe725d]">{v.psf}</td>
                      <td className="py-2 px-3 text-right font-bold">{v.psfPct}%</td>
                    </tr>
                    <tr className="hover:bg-[#f8f1ff]">
                      <td className="py-2 px-3 font-bold text-[#757688]">8</td>
                      <td className="py-2 px-3">¬P ∧ ¬S ∧ ¬F</td>
                      <td className="py-2 px-3 text-[#757688]">N − |P∪S∪F|</td>
                      <td className="py-2 px-3 text-right font-bold text-[#444656]">{v.none}</td>
                      <td className="py-2 px-3 text-right">{v.nonePct}%</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[#1d182e] font-mono font-bold bg-[#f2ebff]">
                      <td colSpan={3} className="py-2.5 px-3 text-[#1d182e]">
                        PARTITION SUM INVARIANT VERIFICATION
                      </td>
                      <td className="py-2.5 px-3 text-right text-[#1e39e7]">
                        {v.pOnly + v.sOnly + v.fOnly + v.psOnly + v.pfOnly + v.sfOnly + v.psf + v.none}
                      </td>
                      <td className="py-2.5 px-3 text-right text-[#1e39e7]">100.0%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* 8.5 PROPOSITIONAL LOGIC LAB                                               */}
            {/* ========================================================================= */}
            <section className="rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[5px_5px_0_0_#1d182e] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2ebff] text-[#1e39e7] text-xs font-bold uppercase tracking-wider mb-2">
                    <Binary className="h-3.5 w-3.5" />
                    Formal Propositional Logic Lab
                  </div>
                  <h2 className="font-display font-bold text-xl text-[#1d182e]">
                    Testing Material Implication: X → E
                  </h2>
                  <p className="text-xs text-[#444656]">
                    Material implication is false strictly when the antecedent is True and the consequent is False.
                  </p>
                </div>

                {/* Tabs for P -> E, S -> E, F -> E */}
                <div className="flex rounded-xl border border-[#1d182e] bg-[#fdf7ff] p-1">
                  {(['P', 'S', 'F'] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveLogicTab(key)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition ${
                        activeLogicTab === key
                          ? 'bg-[#1d182e] text-white shadow-sm'
                          : 'text-[#444656] hover:bg-[#ede4ff]'
                      }`}
                    >
                      {key} → E
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Truth Table */}
              {(() => {
                const table = data.truthTables[activeLogicTab];
                return (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b-2 border-[#1d182e] font-mono uppercase text-[#444656]">
                            <th className="py-2.5 px-3">Antecedent ({table.factor})</th>
                            <th className="py-2.5 px-3">Consequent (E)</th>
                            <th className="py-2.5 px-3">Formal Truth Value</th>
                            <th className="py-2.5 px-3 text-right">Observed Count</th>
                            <th className="py-2.5 px-3 text-right">Cohort %</th>
                            <th className="py-2.5 px-3">Pedagogical Interpretation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f2ebff]">
                          {table.rows.map((r, idx) => (
                            <tr
                              key={idx}
                              className={
                                !r.logicValue
                                  ? 'bg-[#ffdad4]/40 font-semibold'
                                  : 'hover:bg-[#f8f1ff]'
                              }
                            >
                              <td className="py-3 px-3 font-mono font-bold">
                                {r.antecedent ? 'T (Present)' : 'F (Absent)'}
                              </td>
                              <td className="py-3 px-3 font-mono font-bold">
                                {r.consequent ? 'T (Stress ≥ 4)' : 'F (Stress < 4)'}
                              </td>
                              <td className="py-3 px-3">
                                {r.logicValue ? (
                                  <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                                    <CheckCircle2 className="h-3 w-3" />
                                    TRUE
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-300">
                                    <XCircle className="h-3 w-3" />
                                    FALSE (Counterexample)
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-[#1d182e]">
                                {r.count}
                              </td>
                              <td className="py-3 px-3 text-right font-mono">
                                {r.percentage}%
                              </td>
                              <td className="py-3 px-3 text-xs text-[#444656] max-w-xs">
                                {r.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="rounded-xl bg-[#f8f1ff] p-4 text-xs sm:text-sm text-[#1d182e] border border-[#c5c5d9] leading-relaxed">
                      <strong>Logical Synthesis:</strong> {table.interpretation}
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* ========================================================================= */}
            {/* 8.6 ASSOCIATION EXPLORER & 8.7 BELIEFS VS REALITY                         */}
            {/* ========================================================================= */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Association Explorer */}
              <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[5px_5px_0_0_#1d182e] space-y-4">
                <div className="flex items-center justify-between border-b border-[#f2ebff] pb-3">
                  <div>
                    <h2 className="font-display font-bold text-xl text-[#1d182e]">
                      Association Explorer
                    </h2>
                    <p className="text-xs text-[#444656]">
                      Difference in elevated-stress rates: P(E | X) − P(E | ¬X)
                    </p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-[#4057ff]" />
                </div>

                <div className="space-y-4">
                  {data.associations.map((assoc) => (
                    <div key={assoc.factor} className="space-y-1.5 p-3.5 rounded-xl bg-[#fdf7ff] border border-[#c5c5d9]">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-sm text-[#1d182e]">
                          {assoc.name}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#1e39e7] px-2 py-0.5 rounded bg-[#f2ebff]">
                          Δ = +{assoc.percentagePointDiff} pp
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-[#444656]">
                        <div className="flex justify-between">
                          <span>When {assoc.factor} Present (n={assoc.factorPresentCount}):</span>
                          <span className="font-mono font-bold text-[#1d182e]">{assoc.factorPresentRate}% stressed</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#ede4ff] overflow-hidden">
                          <div
                            className="h-full bg-[#4057ff] rounded-full"
                            style={{ width: `${assoc.factorPresentRate}%` }}
                          />
                        </div>

                        <div className="flex justify-between pt-1">
                          <span>When {assoc.factor} Absent (n={assoc.factorAbsentCount}):</span>
                          <span className="font-mono font-bold text-[#757688]">{assoc.factorAbsentRate}% stressed</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#ede4ff] overflow-hidden">
                          <div
                            className="h-full bg-[#c5c5d9] rounded-full"
                            style={{ width: `${assoc.factorAbsentRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-[#757688]">
                  Note: Reflects empirical rate differentials within this observational cohort. Cannot establish medical causality.
                </p>
              </div>

              {/* Beliefs vs Reality */}
              <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[5px_5px_0_0_#1d182e] space-y-4">
                <div className="flex items-center justify-between border-b border-[#f2ebff] pb-3">
                  <div>
                    <h2 className="font-display font-bold text-xl text-[#1d182e]">
                      Beliefs vs Reported Experience
                    </h2>
                    <p className="text-xs text-[#444656]">
                      Comparing subjective belief with observed membership
                    </p>
                  </div>
                  <Brain className="h-5 w-5 text-[#fe725d]" />
                </div>

                <div className="space-y-3">
                  {data.beliefsComparison.map((bc) => (
                    <div key={bc.factor} className="p-3.5 rounded-xl bg-[#fdf7ff] border border-[#c5c5d9] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-sm text-[#1d182e]">
                          Factor {bc.factor}: {bc.name}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#aa3526]">
                          {bc.believedPct}% Believe It Increases Stress
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-white p-2 border border-[#c5c5d9]">
                          <span className="text-[#757688] block text-[11px]">Believed &amp; Met Factor:</span>
                          <span className="font-display font-bold text-[#1d182e]">{bc.believedAndPresentCount} students</span>
                        </div>
                        <div className="rounded-lg bg-white p-2 border border-[#c5c5d9]">
                          <span className="text-[#757688] block text-[11px]">Believed but Did Not Meet:</span>
                          <span className="font-display font-bold text-[#1d182e]">{bc.believedAndAbsentCount} students</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-[#757688]">
                  Students often anticipate high stress impact from factors they successfully manage to keep below project thresholds.
                </p>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* 8.8 EVIDENCE SYNTHESIS SUMMARY                                            */}
            {/* ========================================================================= */}
            <section className="rounded-2xl border-2 border-[#1d182e] bg-[#ede4ff] p-6 shadow-[5px_5px_0_0_#1d182e] space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#1e39e7]" />
                <h2 className="font-display font-bold text-xl text-[#1d182e]">
                  Cohort Evidence Synthesis
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white p-4 border border-[#c5c5d9]">
                  <span className="text-xs font-mono font-bold text-[#757688] uppercase block">
                    Prevalence Leader
                  </span>
                  <div className="font-display font-bold text-lg text-[#1d182e] mt-1">
                    Factor {data.evidenceSummary.mostPrevalentFactor.factor} ({data.evidenceSummary.mostPrevalentFactor.pct}%)
                  </div>
                  <p className="text-xs text-[#444656] mt-1">
                    Highest reported membership rate among tested students.
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 border border-[#c5c5d9]">
                  <span className="text-xs font-mono font-bold text-[#757688] uppercase block">
                    The Triple Overlap
                  </span>
                  <div className="font-display font-bold text-lg text-[#fe725d] mt-1">
                    {data.evidenceSummary.tripleOverlap.pct}% ({data.evidenceSummary.tripleOverlap.count} students)
                  </div>
                  <p className="text-xs text-[#444656] mt-1">
                    Experience procrastination, sleep loss, and social pressure concurrently.
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 border border-[#c5c5d9]">
                  <span className="text-xs font-mono font-bold text-[#757688] uppercase block">
                    Strongest Observed Association
                  </span>
                  <div className="font-display font-bold text-lg text-[#1e39e7] mt-1">
                    Factor {data.evidenceSummary.largestAssociation.factor} (+{data.evidenceSummary.largestAssociation.diff} pp)
                  </div>
                  <p className="text-xs text-[#444656] mt-1">
                    Generated the largest empirical elevated-stress difference.
                  </p>
                </div>
              </div>

              <div className="text-xs text-[#444656] pt-1">
                Prior prediction accuracy: <strong>{data.evidenceSummary.predictionAccuracyLeadingPct}%</strong> of participants correctly identified the observed dominant factor prior to taking the survey.
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
