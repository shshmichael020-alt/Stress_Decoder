"use client";

import { useState } from "react";
import {
  Sliders,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
} from "lucide-react";
import { VennDiagram } from "@/components/venn-diagram";
import { SimulatorInputs, computeSimulatorVenn } from "@/lib/math-engine";

const PRESET_SCENARIOS: { name: string; description: string; inputs: SimulatorInputs }[] = [
  {
    name: "Balanced University Cohort",
    description: "Moderate overlapping pressure vectors typical of mid-semester exams.",
    inputs: {
      totalN: 400,
      sizeP: 240,
      sizeS: 210,
      sizeF: 160,
      interPS: 140,
      interPF: 100,
      interSF: 90,
      psf: 60,
    },
  },
  {
    name: "The Procrastination Epidemic",
    description: "Massive revision delays dominating with high sleep debt spillover.",
    inputs: {
      totalN: 500,
      sizeP: 420,
      sizeS: 320,
      sizeF: 180,
      interPS: 280,
      interPF: 160,
      interSF: 130,
      psf: 110,
    },
  },
  {
    name: "Sleep Deficit Crisis",
    description: "Severe circadian disruption impacting nearly the entire study body.",
    inputs: {
      totalN: 350,
      sizeP: 180,
      sizeS: 310,
      sizeF: 160,
      interPS: 160,
      interPF: 80,
      interSF: 145,
      psf: 75,
    },
  },
  {
    name: "Near-Disjoint Independence",
    description: "Minimal intersection where factors act as isolated psychological stressors.",
    inputs: {
      totalN: 450,
      sizeP: 120,
      sizeS: 110,
      sizeF: 100,
      interPS: 20,
      interPF: 15,
      interSF: 15,
      psf: 5,
    },
  },
];

export default function SimulatorPage() {
  const [inputs, setInputs] = useState<SimulatorInputs>(PRESET_SCENARIOS[0].inputs);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const validation = computeSimulatorVenn(inputs);
  const venn = validation.venn;

  const handleInputChange = (field: keyof SimulatorInputs, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [field]: Math.max(0, value),
    }));
  };

  const loadPreset = (scenario: (typeof PRESET_SCENARIOS)[0]) => {
    setInputs(scenario.inputs);
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ccf15a] text-[#161e00] font-mono text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sliders className="h-3.5 w-3.5" />
            Interactive Set Theory Sandbox
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1d182e] tracking-tight">
            The What-If Simulator
          </h1>
          <p className="text-sm sm:text-base text-[#444656] max-w-3xl leading-relaxed">
            Manipulate cardinalities and intersections in real time to observe the mathematical ripple
            effects on Venn partitions, Inclusion–Exclusion totals, and universal set coverage.
          </p>
        </div>

        {/* Mandatory Prominent Simulation Warning Banner */}
        <div className="rounded-2xl border-2 border-[#aa3526] bg-[#ffdad4]/60 p-4 text-[#6f0802] shadow-[4px_4px_0_0_#aa3526]">
          <div className="flex items-center gap-2 font-display font-black text-xs sm:text-sm tracking-wide uppercase">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#aa3526]" />
            <span>SIMULATION — ILLUSTRATIVE MATHEMATICAL DATA, NOT REAL STUDENT RESPONSES.</span>
          </div>
          <p className="text-xs text-[#6f0802] mt-1">
            Simulated adjustments exist purely in sandbox memory and will NEVER modify or overwrite actual university research findings.
          </p>
        </div>

        {/* Preset Scenarios Selector */}
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-[#757688] uppercase tracking-wider">
            Explore Example Scenarios
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_SCENARIOS.map((sc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => loadPreset(sc)}
                className="rounded-xl border-2 border-[#1d182e] bg-white p-3.5 text-left shadow-[2px_2px_0_0_#1d182e] hover:bg-[#f2ebff] transition"
              >
                <div className="font-display font-bold text-sm text-[#1d182e]">{sc.name}</div>
                <div className="text-[11px] text-[#444656] mt-1 line-clamp-2">{sc.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Validation Errors If Inconsistent Set Parameters */}
        {!validation.isValid && (
          <div className="rounded-xl border-2 border-red-600 bg-red-50 p-4 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm text-red-900">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>Inconsistent Mathematical Configuration:</span>
            </div>
            <ul className="list-disc list-inside text-xs text-red-800 space-y-0.5">
              {validation.errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Simulator Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (6 cols) */}
          <div className="lg:col-span-6 rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[5px_5px_0_0_#1d182e] space-y-6">
            <div className="flex items-center justify-between border-b border-[#f2ebff] pb-3">
              <h2 className="font-display font-bold text-lg text-[#1d182e]">
                Parameter Adjustments
              </h2>
              <button
                type="button"
                onClick={() => setInputs(PRESET_SCENARIOS[0].inputs)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1e39e7] hover:underline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset to Default</span>
              </button>
            </div>

            {/* Total Cohort Size */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[#fdf7ff] border border-[#c5c5d9]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-display font-bold text-[#1d182e]">
                  Total Population (N)
                </span>
                <span className="font-mono font-bold text-sm text-[#1e39e7]">
                  {inputs.totalN} students
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="10"
                value={inputs.totalN}
                onChange={(e) => handleInputChange("totalN", Number(e.target.value))}
                className="w-full h-2 bg-[#ede4ff] rounded appearance-none cursor-pointer accent-[#1e39e7]"
              />
            </div>

            {/* Single Set Sizes */}
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold text-[#757688] uppercase block">
                Single Factor Cardinalities
              </span>

              {/* |P| */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#1e39e7]">|P| Procrastination</span>
                  <span className="font-mono font-bold text-[#1d182e]">{inputs.sizeP}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={inputs.totalN}
                  value={inputs.sizeP}
                  onChange={(e) => handleInputChange("sizeP", Number(e.target.value))}
                  className="w-full h-2 bg-[#ede4ff] rounded appearance-none cursor-pointer accent-[#4057ff]"
                />
              </div>

              {/* |S| */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#aa3526]">|S| Sleep Deficit</span>
                  <span className="font-mono font-bold text-[#1d182e]">{inputs.sizeS}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={inputs.totalN}
                  value={inputs.sizeS}
                  onChange={(e) => handleInputChange("sizeS", Number(e.target.value))}
                  className="w-full h-2 bg-[#ede4ff] rounded appearance-none cursor-pointer accent-[#fe725d]"
                />
              </div>

              {/* |F| */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#485b00]">|F| Social Pressure</span>
                  <span className="font-mono font-bold text-[#1d182e]">{inputs.sizeF}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={inputs.totalN}
                  value={inputs.sizeF}
                  onChange={(e) => handleInputChange("sizeF", Number(e.target.value))}
                  className="w-full h-2 bg-[#ede4ff] rounded appearance-none cursor-pointer accent-[#ccf15a]"
                />
              </div>
            </div>

            {/* Pairwise Intersections */}
            <div className="space-y-3 pt-2 border-t border-[#f2ebff]">
              <span className="font-mono text-xs font-bold text-[#757688] uppercase block">
                Pairwise Overlaps
              </span>

              {/* |P ∩ S| */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#1d182e]">|P ∩ S| Procrastination &amp; Sleep</span>
                  <span className="font-mono font-bold text-[#1d182e]">{inputs.interPS}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.min(inputs.sizeP, inputs.sizeS)}
                  value={inputs.interPS}
                  onChange={(e) => handleInputChange("interPS", Number(e.target.value))}
                  className="w-full h-2 bg-[#ede4ff] rounded appearance-none cursor-pointer accent-[#1d182e]"
                />
              </div>

              {/* |P ∩ F| */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#1d182e]">|P ∩ F| Procrastination &amp; Pressure</span>
                  <span className="font-mono font-bold text-[#1d182e]">{inputs.interPF}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.min(inputs.sizeP, inputs.sizeF)}
                  value={inputs.interPF}
                  onChange={(e) => handleInputChange("interPF", Number(e.target.value))}
                  className="w-full h-2 bg-[#ede4ff] rounded appearance-none cursor-pointer accent-[#1d182e]"
                />
              </div>

              {/* |S ∩ F| */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#1d182e]">|S ∩ F| Sleep &amp; Pressure</span>
                  <span className="font-mono font-bold text-[#1d182e]">{inputs.interSF}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.min(inputs.sizeS, inputs.sizeF)}
                  value={inputs.interSF}
                  onChange={(e) => handleInputChange("interSF", Number(e.target.value))}
                  className="w-full h-2 bg-[#ede4ff] rounded appearance-none cursor-pointer accent-[#1d182e]"
                />
              </div>
            </div>

            {/* Triple Intersection */}
            <div className="space-y-1 pt-2 border-t border-[#f2ebff]">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#fe725d]">|P ∩ S ∩ F| Central Triple Overlap</span>
                <span className="font-mono font-bold text-base text-[#fe725d]">{inputs.psf}</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.min(inputs.interPS, inputs.interPF, inputs.interSF)}
                value={inputs.psf}
                onChange={(e) => handleInputChange("psf", Number(e.target.value))}
                className="w-full h-2 bg-[#ede4ff] rounded appearance-none cursor-pointer accent-[#fe725d]"
              />
            </div>
          </div>

          {/* Live Visualization Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Live Venn Graphic */}
            <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-6 shadow-[5px_5px_0_0_#1d182e] space-y-4">
              <div className="flex items-center justify-between border-b border-[#f2ebff] pb-3">
                <h2 className="font-display font-bold text-lg text-[#1d182e]">
                  Dynamic Venn Partition
                </h2>
                {venn && (
                  <span className="font-mono text-xs font-bold text-[#1e39e7] px-2 py-0.5 rounded bg-[#f2ebff]">
                    Union: {venn.unionPSF} ({venn.unionPct}%)
                  </span>
                )}
              </div>

              {venn ? (
                <VennDiagram counts={venn} highlightedTerm={selectedTerm} />
              ) : (
                <div className="py-20 text-center text-xs text-red-600 font-bold">
                  Resolve parameter conflicts to render valid Venn diagram.
                </div>
              )}
            </div>

            {/* Dynamic Inclusion-Exclusion Equation */}
            {venn && (
              <div className="rounded-2xl border-2 border-[#1d182e] bg-white p-5 shadow-[4px_4px_0_0_#1d182e] space-y-3">
                <span className="font-mono text-xs font-bold text-[#757688] uppercase block">
                  Live Inclusion–Exclusion Equation
                </span>
                <div className="p-3 rounded-xl bg-[#f2ebff] font-mono text-xs sm:text-sm font-bold text-[#1d182e] overflow-x-auto">
                  |P ∪ S ∪ F| = {inputs.sizeP} + {inputs.sizeS} + {inputs.sizeF} − {inputs.interPS} − {inputs.interPF} − {inputs.interSF} + {inputs.psf} ={" "}
                  <span className="text-[#1e39e7]">{venn.unionPSF}</span> students
                </div>
                <div className="flex items-center justify-between text-xs text-[#444656]">
                  <span>Students with zero factors (None): <strong>{venn.none}</strong> ({venn.nonePct}%)</span>
                  <span className="font-mono text-[#1e39e7]">Total N = {inputs.totalN}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
