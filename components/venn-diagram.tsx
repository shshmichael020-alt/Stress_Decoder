"use client";

import { useState, useMemo } from "react";
import { VennCounts } from "@/lib/types";
import { Sliders, RotateCcw, Check, Sparkles } from "lucide-react";

export type VennRegionKey =
  | 'pOnly'
  | 'sOnly'
  | 'fOnly'
  | 'psOnly'
  | 'pfOnly'
  | 'sfOnly'
  | 'psf'
  | 'none';

interface VennDiagramProps {
  counts: VennCounts;
  highlightedTerm?: string | null;
  onSelectRegion?: (region: VennRegionKey | null) => void;
  selectedRegion?: VennRegionKey | null;
  compact?: boolean;
  enableLiveInputControls?: boolean;
}

export function VennDiagram({
  counts: initialCounts,
  highlightedTerm,
  onSelectRegion,
  selectedRegion: controlledSelectedRegion,
  compact = false,
  enableLiveInputControls = true,
}: VennDiagramProps) {
  const [internalSelected, setInternalSelected] = useState<VennRegionKey | null>(null);
  const activeRegion = controlledSelectedRegion !== undefined ? controlledSelectedRegion : internalSelected;

  // Custom user input overrides to dynamically shrink and expand circles
  const [customActive, setCustomActive] = useState<boolean>(false);
  const [inputP, setInputP] = useState<number>(initialCounts.sizeP);
  const [inputS, setInputS] = useState<number>(initialCounts.sizeS);
  const [inputF, setInputF] = useState<number>(initialCounts.sizeF);
  const [inputPSF, setInputPSF] = useState<number>(initialCounts.psf);

  // Compute live counts when customActive is true
  const counts = useMemo(() => {
    if (!customActive) return initialCounts;

    const total = Math.max(1, initialCounts.total);
    const p = Math.min(total, Math.max(0, inputP));
    const s = Math.min(total, Math.max(0, inputS));
    const f = Math.min(total, Math.max(0, inputF));
    const psf = Math.min(p, s, f, Math.max(0, inputPSF));

    // Proportional pairwise approximations
    const interPS = Math.min(p, s, Math.round(psf + (Math.min(p, s) - psf) * 0.35));
    const interPF = Math.min(p, f, Math.round(psf + (Math.min(p, f) - psf) * 0.55));
    const interSF = Math.min(s, f, Math.round(psf + (Math.min(s, f) - psf) * 0.30));

    const pOnly = Math.max(0, p - interPS - interPF + psf);
    const sOnly = Math.max(0, s - interPS - interSF + psf);
    const fOnly = Math.max(0, f - interPF - interSF + psf);
    const psOnly = Math.max(0, interPS - psf);
    const pfOnly = Math.max(0, interPF - psf);
    const sfOnly = Math.max(0, interSF - psf);

    const unionPSF = pOnly + sOnly + fOnly + psOnly + pfOnly + sfOnly + psf;
    const none = Math.max(0, total - unionPSF);

    const pct = (val: number) => Number(((val / total) * 100).toFixed(1));

    return {
      total,
      sizeP: p,
      sizeS: s,
      sizeF: f,
      interPS,
      interPF,
      interSF,
      psf,
      unionPSF,
      pOnly,
      sOnly,
      fOnly,
      psOnly,
      pfOnly,
      sfOnly,
      psfExact: psf,
      none,
      exactlyOne: pOnly + sOnly + fOnly,
      exactlyTwo: psOnly + pfOnly + sfOnly,
      allThree: psf,
      noneCount: none,
      pOnlyPct: pct(pOnly),
      sOnlyPct: pct(sOnly),
      fOnlyPct: pct(fOnly),
      psOnlyPct: pct(psOnly),
      pfOnlyPct: pct(pfOnly),
      sfOnlyPct: pct(sfOnly),
      psfPct: pct(psf),
      nonePct: pct(none),
      unionPct: pct(unionPSF),
    };
  }, [customActive, initialCounts, inputP, inputS, inputF, inputPSF]);

  // Dynamic Circle Radii: Circles shrink and expand proportionally!
  const totalRef = Math.max(1, counts.total);
  const calcRadius = (size: number) => {
    const ratio = Math.max(0.12, Math.min(1.0, size / totalRef));
    return Math.round(50 + 44 * Math.sqrt(ratio));
  };

  const rP = calcRadius(counts.sizeP);
  const rS = calcRadius(counts.sizeS);
  const rF = calcRadius(counts.sizeF);

  const handleRegionClick = (region: VennRegionKey) => {
    const next = activeRegion === region ? null : region;
    if (controlledSelectedRegion === undefined) {
      setInternalSelected(next);
    }
    onSelectRegion?.(next);
  };

  // Determine if a region matches highlighted Inclusion-Exclusion formula term
  const isTermHighlighted = (region: VennRegionKey): boolean => {
    if (!highlightedTerm) return false;
    switch (highlightedTerm) {
      case '|P|':
        return ['pOnly', 'psOnly', 'pfOnly', 'psf'].includes(region);
      case '|S|':
        return ['sOnly', 'psOnly', 'sfOnly', 'psf'].includes(region);
      case '|F|':
        return ['fOnly', 'pfOnly', 'sfOnly', 'psf'].includes(region);
      case '|P ∩ S|':
        return ['psOnly', 'psf'].includes(region);
      case '|P ∩ F|':
        return ['pfOnly', 'psf'].includes(region);
      case '|S ∩ F|':
        return ['sfOnly', 'psf'].includes(region);
      case '|P ∩ S ∩ F|':
        return region === 'psf';
      case '|P ∪ S ∪ F|':
        return region !== 'none';
      default:
        return false;
    }
  };

  const getRegionDetail = (region: VennRegionKey | null) => {
    if (!region) {
      return {
        formula: 'Universal Set (U)',
        title: 'Universal Cohort',
        count: counts.total,
        pct: '100%',
        meaning: 'All verified students in this dataset.',
      };
    }
    switch (region) {
      case 'pOnly':
        return {
          formula: 'P ∧ ¬S ∧ ¬F',
          title: 'Procrastination Only',
          count: counts.pOnly,
          pct: `${counts.pOnlyPct}%`,
          meaning: 'Students with study delay who maintain sleep and report low external pressure.',
        };
      case 'sOnly':
        return {
          formula: '¬P ∧ S ∧ ¬F',
          title: 'Sleep Deficit Only',
          count: counts.sOnly,
          pct: `${counts.sOnlyPct}%`,
          meaning: 'Students with sleep debt (<7h) who start revision early and report low pressure.',
        };
      case 'fOnly':
        return {
          formula: '¬P ∧ ¬S ∧ F',
          title: 'Social/Family Pressure Only',
          count: counts.fOnly,
          pct: `${counts.fOnlyPct}%`,
          meaning: 'Students experiencing external expectations with normal sleep and study pacing.',
        };
      case 'psOnly':
        return {
          formula: 'P ∧ S ∧ ¬F',
          title: 'Procrastination & Sleep Only',
          count: counts.psOnly,
          pct: `${counts.psOnlyPct}%`,
          meaning: 'Pairwise overlap: delayed studying combined with sleep loss, without external pressure.',
        };
      case 'pfOnly':
        return {
          formula: 'P ∧ ¬S ∧ F',
          title: 'Procrastination & Pressure Only',
          count: counts.pfOnly,
          pct: `${counts.pfOnlyPct}%`,
          meaning: 'Pairwise overlap: procrastination accompanied by high external expectations.',
        };
      case 'sfOnly':
        return {
          formula: '¬P ∧ S ∧ F',
          title: 'Sleep & Pressure Only',
          count: counts.sfOnly,
          pct: `${counts.sfOnlyPct}%`,
          meaning: 'Pairwise overlap: insomnia or sleep loss linked to external expectations.',
        };
      case 'psf':
        return {
          formula: 'P ∧ S ∧ F',
          title: 'The Triple Intersection',
          count: counts.psf,
          pct: `${counts.psfPct}%`,
          meaning: 'All three vectors active: severe procrastination, sleep deficit, and external pressure.',
        };
      case 'none':
        return {
          formula: '¬P ∧ ¬S ∧ ¬F',
          title: 'None of the Three Factors',
          count: counts.none,
          pct: `${counts.nonePct}%`,
          meaning: 'Students reporting balanced revision timing, sufficient sleep, and low external pressure.',
        };
    }
  };

  const activeDetail = getRegionDetail(activeRegion);

  return (
    <div className="w-full flex flex-col items-center select-none space-y-3">
      {/* Dynamic Scale Number Inputs (Option to enter numbers for Set P, Set S, Set F) */}
      {!compact && enableLiveInputControls && (
        <div className="w-full rounded-xl border border-[#c5c5d9] bg-[#fdf7ff] p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-xs text-[#1d182e] flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-[#1e39e7]" />
              Interactive Set Size Adjuster: Enter numbers to shrink or expand circles
            </span>
            {customActive ? (
              <button
                type="button"
                onClick={() => {
                  setCustomActive(false);
                  setInputP(initialCounts.sizeP);
                  setInputS(initialCounts.sizeS);
                  setInputF(initialCounts.sizeF);
                  setInputPSF(initialCounts.psf);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#aa3526] hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset to Cohort (N={initialCounts.total})</span>
              </button>
            ) : (
              <span className="font-mono text-[11px] font-semibold text-[#1e39e7]">
                Live Survey (N={initialCounts.total})
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Input Set P */}
            <div className="rounded-lg bg-white p-2 border border-[#4057ff]/40 shadow-xs">
              <label className="text-[10px] font-mono font-bold text-[#1e39e7] block uppercase">
                |P| Procrastination
              </label>
              <input
                type="number"
                min="0"
                max={initialCounts.total}
                value={customActive ? inputP : initialCounts.sizeP}
                onChange={(e) => {
                  setCustomActive(true);
                  setInputP(Number(e.target.value));
                }}
                className="w-full font-mono text-sm font-bold text-[#1d182e] border-b border-[#4057ff] focus:outline-none"
              />
            </div>

            {/* Input Set S */}
            <div className="rounded-lg bg-white p-2 border border-[#fe725d]/40 shadow-xs">
              <label className="text-[10px] font-mono font-bold text-[#aa3526] block uppercase">
                |S| Sleep Deficit
              </label>
              <input
                type="number"
                min="0"
                max={initialCounts.total}
                value={customActive ? inputS : initialCounts.sizeS}
                onChange={(e) => {
                  setCustomActive(true);
                  setInputS(Number(e.target.value));
                }}
                className="w-full font-mono text-sm font-bold text-[#1d182e] border-b border-[#fe725d] focus:outline-none"
              />
            </div>

            {/* Input Set F */}
            <div className="rounded-lg bg-white p-2 border border-[#485b00]/40 shadow-xs">
              <label className="text-[10px] font-mono font-bold text-[#485b00] block uppercase">
                |F| Social Pressure
              </label>
              <input
                type="number"
                min="0"
                max={initialCounts.total}
                value={customActive ? inputF : initialCounts.sizeF}
                onChange={(e) => {
                  setCustomActive(true);
                  setInputF(Number(e.target.value));
                }}
                className="w-full font-mono text-sm font-bold text-[#1d182e] border-b border-[#485b00] focus:outline-none"
              />
            </div>

            {/* Input Triple Overlap */}
            <div className="rounded-lg bg-white p-2 border border-[#1d182e]/40 shadow-xs">
              <label className="text-[10px] font-mono font-bold text-[#1d182e] block uppercase">
                |P ∩ S ∩ F| Center
              </label>
              <input
                type="number"
                min="0"
                max={initialCounts.total}
                value={customActive ? inputPSF : initialCounts.psf}
                onChange={(e) => {
                  setCustomActive(true);
                  setInputPSF(Number(e.target.value));
                }}
                className="w-full font-mono text-sm font-bold text-[#1d182e] border-b border-[#1d182e] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SVG Canvas with dynamic radii */}
      <div className="relative w-full max-w-[440px] aspect-[4/3.3] flex items-center justify-center">
        <svg
          viewBox="0 0 380 320"
          className="w-full h-full overflow-visible drop-shadow-sm transition-all duration-500 ease-out"
          role="img"
          aria-label="Three-set Venn diagram representing Procrastination, Sleep Deficit, and Social Pressure"
        >
          {/* Background Universe Frame */}
          <rect
            x="8"
            y="8"
            width="364"
            height="304"
            rx="16"
            fill="#ffffff"
            stroke={activeRegion === 'none' || isTermHighlighted('none') ? '#1e39e7' : '#c5c5d9'}
            strokeWidth={activeRegion === 'none' ? '3' : '1.5'}
            className="transition-colors cursor-pointer"
            onClick={() => handleRegionClick('none')}
          />

          {/* Universe label top right */}
          <text
            x="356"
            y="30"
            textAnchor="end"
            className="font-mono text-[12px] font-bold fill-[#444656]"
          >
            U (n={counts.total})
          </text>

          {/* Dynamic Circles with animated radii and colors */}
          {/* Circle P (Top-Left) */}
          <circle
            cx="140"
            cy="125"
            r={rP}
            fill="#4057ff"
            fillOpacity={isTermHighlighted('pOnly') ? 0.45 : 0.28}
            stroke="#1e39e7"
            strokeWidth="2.5"
            className="transition-all duration-500 ease-out"
          />

          {/* Circle S (Top-Right) */}
          <circle
            cx="240"
            cy="125"
            r={rS}
            fill="#fe725d"
            fillOpacity={isTermHighlighted('sOnly') ? 0.45 : 0.28}
            stroke="#aa3526"
            strokeWidth="2.5"
            className="transition-all duration-500 ease-out"
          />

          {/* Circle F (Bottom-Center) */}
          <circle
            cx="190"
            cy="195"
            r={rF}
            fill="#ccf15a"
            fillOpacity={isTermHighlighted('fOnly') ? 0.55 : 0.35}
            stroke="#485b00"
            strokeWidth="2.5"
            className="transition-all duration-500 ease-out"
          />

          {/* Dynamic Set Labels */}
          <text x={140 - rP * 0.75} y={125 - rP * 0.75} className="font-display text-[14px] font-bold fill-[#1e39e7]">
            P (|P|={counts.sizeP})
          </text>
          <text x={240 + rS * 0.75} y={125 - rS * 0.75} textAnchor="end" className="font-display text-[14px] font-bold fill-[#aa3526]">
            S (|S|={counts.sizeS})
          </text>
          <text x="190" y={Math.min(302, 195 + rF * 1.15)} textAnchor="middle" className="font-display text-[14px] font-bold fill-[#485b00]">
            F (|F|={counts.sizeF})
          </text>

          {/* Clickable Region Badges with animated positions */}

          {/* 1. P only */}
          <g className="cursor-pointer group" onClick={() => handleRegionClick('pOnly')}>
            <circle
              cx={140 - rP * 0.45}
              cy="120"
              r="16"
              fill={activeRegion === 'pOnly' || isTermHighlighted('pOnly') ? '#1e39e7' : '#ede4ff'}
              stroke="#1e39e7"
              strokeWidth="1.5"
              className="transition-all group-hover:scale-110"
            />
            <text
              x={140 - rP * 0.45}
              y="124"
              textAnchor="middle"
              className={`font-display text-[12px] font-bold ${
                activeRegion === 'pOnly' || isTermHighlighted('pOnly') ? 'fill-white' : 'fill-[#1e39e7]'
              }`}
            >
              {counts.pOnly}
            </text>
          </g>

          {/* 2. S only */}
          <g className="cursor-pointer group" onClick={() => handleRegionClick('sOnly')}>
            <circle
              cx={240 + rS * 0.45}
              cy="120"
              r="16"
              fill={activeRegion === 'sOnly' || isTermHighlighted('sOnly') ? '#aa3526' : '#ffdad4'}
              stroke="#aa3526"
              strokeWidth="1.5"
              className="transition-all group-hover:scale-110"
            />
            <text
              x={240 + rS * 0.45}
              y="124"
              textAnchor="middle"
              className={`font-display text-[12px] font-bold ${
                activeRegion === 'sOnly' || isTermHighlighted('sOnly') ? 'fill-white' : 'fill-[#aa3526]'
              }`}
            >
              {counts.sOnly}
            </text>
          </g>

          {/* 3. F only */}
          <g className="cursor-pointer group" onClick={() => handleRegionClick('fOnly')}>
            <circle
              cx="190"
              cy={195 + rF * 0.48}
              r="16"
              fill={activeRegion === 'fOnly' || isTermHighlighted('fOnly') ? '#485b00' : '#ccf15a'}
              stroke="#485b00"
              strokeWidth="1.5"
              className="transition-all group-hover:scale-110"
            />
            <text
              x="190"
              y={195 + rF * 0.48 + 4}
              textAnchor="middle"
              className={`font-display text-[12px] font-bold ${
                activeRegion === 'fOnly' || isTermHighlighted('fOnly') ? 'fill-white' : 'fill-[#161e00]'
              }`}
            >
              {counts.fOnly}
            </text>
          </g>

          {/* 4. P & S only */}
          <g className="cursor-pointer group" onClick={() => handleRegionClick('psOnly')}>
            <circle
              cx="190"
              cy="98"
              r="15"
              fill={activeRegion === 'psOnly' || isTermHighlighted('psOnly') ? '#1d182e' : '#ffffff'}
              stroke="#1d182e"
              strokeWidth="1.5"
              className="transition-all group-hover:scale-110"
            />
            <text
              x="190"
              y="102"
              textAnchor="middle"
              className={`font-display text-[11px] font-bold ${
                activeRegion === 'psOnly' || isTermHighlighted('psOnly') ? 'fill-white' : 'fill-[#1d182e]'
              }`}
            >
              {counts.psOnly}
            </text>
          </g>

          {/* 5. P & F only */}
          <g className="cursor-pointer group" onClick={() => handleRegionClick('pfOnly')}>
            <circle
              cx="145"
              cy="185"
              r="15"
              fill={activeRegion === 'pfOnly' || isTermHighlighted('pfOnly') ? '#1d182e' : '#ffffff'}
              stroke="#1d182e"
              strokeWidth="1.5"
              className="transition-all group-hover:scale-110"
            />
            <text
              x="145"
              y="189"
              textAnchor="middle"
              className={`font-display text-[11px] font-bold ${
                activeRegion === 'pfOnly' || isTermHighlighted('pfOnly') ? 'fill-white' : 'fill-[#1d182e]'
              }`}
            >
              {counts.pfOnly}
            </text>
          </g>

          {/* 6. S & F only */}
          <g className="cursor-pointer group" onClick={() => handleRegionClick('sfOnly')}>
            <circle
              cx="235"
              cy="185"
              r="15"
              fill={activeRegion === 'sfOnly' || isTermHighlighted('sfOnly') ? '#1d182e' : '#ffffff'}
              stroke="#1d182e"
              strokeWidth="1.5"
              className="transition-all group-hover:scale-110"
            />
            <text
              x="235"
              y="189"
              textAnchor="middle"
              className={`font-display text-[11px] font-bold ${
                activeRegion === 'sfOnly' || isTermHighlighted('sfOnly') ? 'fill-white' : 'fill-[#1d182e]'
              }`}
            >
              {counts.sfOnly}
            </text>
          </g>

          {/* 7. Triple Intersection: P & S & F */}
          <g className="cursor-pointer group" onClick={() => handleRegionClick('psf')}>
            <circle
              cx="190"
              cy="150"
              r="18"
              fill={activeRegion === 'psf' || isTermHighlighted('psf') ? '#fe725d' : '#1d182e'}
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all group-hover:scale-110 shadow-lg"
            />
            <text
              x="190"
              y="154"
              textAnchor="middle"
              className="font-display text-[12px] font-bold fill-white"
            >
              {counts.psf}
            </text>
          </g>

          {/* 8. None Badge (Bottom Left) */}
          <g className="cursor-pointer group" onClick={() => handleRegionClick('none')}>
            <rect
              x="18"
              y="262"
              width="86"
              height="28"
              rx="6"
              fill={activeRegion === 'none' || isTermHighlighted('none') ? '#1d182e' : '#f2ebff'}
              stroke="#c5c5d9"
              strokeWidth="1"
            />
            <text
              x="61"
              y="280"
              textAnchor="middle"
              className={`font-mono text-[11px] font-bold ${
                activeRegion === 'none' || isTermHighlighted('none') ? 'fill-white' : 'fill-[#444656]'
              }`}
            >
              None: {counts.none}
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Inspector Pill Card */}
      {!compact && (
        <div className="w-full rounded-xl border border-[#c5c5d9] bg-white p-3.5 shadow-xs transition-all">
          <div className="flex items-center justify-between border-b border-[#f2ebff] pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#f2ebff] text-[#1e39e7]">
                {activeDetail.formula}
              </span>
              <span className="font-display text-sm font-bold text-[#1d182e]">
                {activeDetail.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold text-[#1d182e]">
                {activeDetail.count}
              </span>
              <span className="text-xs font-medium text-[#444656]">
                ({activeDetail.pct})
              </span>
            </div>
          </div>
          <p className="text-xs text-[#444656] pt-2">
            {activeDetail.meaning}
          </p>
        </div>
      )}
    </div>
  );
}
