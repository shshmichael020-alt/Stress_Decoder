"use client";

import { useState } from "react";
import { VennCounts } from "@/lib/types";

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
}

export function VennDiagram({
  counts,
  highlightedTerm,
  onSelectRegion,
  selectedRegion: controlledSelectedRegion,
  compact = false,
}: VennDiagramProps) {
  const [internalSelected, setInternalSelected] = useState<VennRegionKey | null>(null);
  const activeRegion = controlledSelectedRegion !== undefined ? controlledSelectedRegion : internalSelected;

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
          meaning: 'Students with elevated study delay who maintain sleep and report low pressure.',
        };
      case 'sOnly':
        return {
          formula: '¬P ∧ S ∧ ¬F',
          title: 'Sleep Deficit Only',
          count: counts.sOnly,
          pct: `${counts.sOnlyPct}%`,
          meaning: 'Students with chronic sleep loss who start revision early and report low pressure.',
        };
      case 'fOnly':
        return {
          formula: '¬P ∧ ¬S ∧ F',
          title: 'Social/Family Pressure Only',
          count: counts.fOnly,
          pct: `${counts.fOnlyPct}%`,
          meaning: 'Students experiencing external expectation strain with healthy sleep and study timing.',
        };
      case 'psOnly':
        return {
          formula: 'P ∧ S ∧ ¬F',
          title: 'Procrastination & Sleep Only',
          count: counts.psOnly,
          pct: `${counts.psOnlyPct}%`,
          meaning: 'Pairwise overlap: delayed studying paired with sleep loss, without external pressure.',
        };
      case 'pfOnly':
        return {
          formula: 'P ∧ ¬S ∧ F',
          title: 'Procrastination & Pressure Only',
          count: counts.pfOnly,
          pct: `${counts.pfOnlyPct}%`,
          meaning: 'Pairwise overlap: procrastination driven or combined with high external expectations.',
        };
      case 'sfOnly':
        return {
          formula: '¬P ∧ S ∧ F',
          title: 'Sleep & Pressure Only',
          count: counts.sfOnly,
          pct: `${counts.sfOnlyPct}%`,
          meaning: 'Pairwise overlap: insomnia or sleep loss linked to external anxiety and standards.',
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
    <div className="w-full flex flex-col items-center select-none">
      {/* SVG Canvas */}
      <div className="relative w-full max-w-[420px] aspect-[4/3.4] flex items-center justify-center">
        <svg
          viewBox="0 0 380 320"
          className="w-full h-full overflow-visible drop-shadow-sm"
          role="img"
          aria-label="Three-set Venn diagram representing Procrastination, Sleep Deficit, and Social Pressure"
        >
          <defs>
            <filter id="venn-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

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

          {/* Base Circles with semi-transparent blending */}
          {/* Circle P (Top-Left) */}
          <circle
            cx="140"
            cy="125"
            r="82"
            fill="#4057ff"
            fillOpacity={isTermHighlighted('pOnly') ? 0.45 : 0.28}
            stroke="#1e39e7"
            strokeWidth="2"
            className="transition-all"
          />

          {/* Circle S (Top-Right) */}
          <circle
            cx="240"
            cy="125"
            r="82"
            fill="#fe725d"
            fillOpacity={isTermHighlighted('sOnly') ? 0.45 : 0.28}
            stroke="#aa3526"
            strokeWidth="2"
            className="transition-all"
          />

          {/* Circle F (Bottom-Center) */}
          <circle
            cx="190"
            cy="195"
            r="82"
            fill="#ccf15a"
            fillOpacity={isTermHighlighted('fOnly') ? 0.55 : 0.35}
            stroke="#485b00"
            strokeWidth="2"
            className="transition-all"
          />

          {/* Set Labels */}
          <text x="82" y="75" className="font-display text-[15px] font-bold fill-[#1e39e7]">
            P (|P|={counts.sizeP})
          </text>
          <text x="298" y="75" textAnchor="end" className="font-display text-[15px] font-bold fill-[#aa3526]">
            S (|S|={counts.sizeS})
          </text>
          <text x="190" y="298" textAnchor="middle" className="font-display text-[15px] font-bold fill-[#485b00]">
            F (|F|={counts.sizeF})
          </text>

          {/* Clickable Region Text Markers / Badges */}

          {/* 1. P only */}
          <g
            className="cursor-pointer group"
            onClick={() => handleRegionClick('pOnly')}
          >
            <circle
              cx="100"
              cy="120"
              r="17"
              fill={activeRegion === 'pOnly' || isTermHighlighted('pOnly') ? '#1e39e7' : '#ede4ff'}
              stroke="#1e39e7"
              strokeWidth="1.5"
              className="transition-all group-hover:scale-110"
            />
            <text
              x="100"
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
          <g
            className="cursor-pointer group"
            onClick={() => handleRegionClick('sOnly')}
          >
            <circle
              cx="280"
              cy="120"
              r="17"
              fill={activeRegion === 'sOnly' || isTermHighlighted('sOnly') ? '#aa3526' : '#ffdad4'}
              stroke="#aa3526"
              strokeWidth="1.5"
              className="transition-all group-hover:scale-110"
            />
            <text
              x="280"
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
          <g
            className="cursor-pointer group"
            onClick={() => handleRegionClick('fOnly')}
          >
            <circle
              cx="190"
              cy="242"
              r="17"
              fill={activeRegion === 'fOnly' || isTermHighlighted('fOnly') ? '#485b00' : '#ccf15a'}
              stroke="#485b00"
              strokeWidth="1.5"
              className="transition-all group-hover:scale-110"
            />
            <text
              x="190"
              y="246"
              textAnchor="middle"
              className={`font-display text-[12px] font-bold ${
                activeRegion === 'fOnly' || isTermHighlighted('fOnly') ? 'fill-white' : 'fill-[#161e00]'
              }`}
            >
              {counts.fOnly}
            </text>
          </g>

          {/* 4. P & S only */}
          <g
            className="cursor-pointer group"
            onClick={() => handleRegionClick('psOnly')}
          >
            <circle
              cx="190"
              cy="95"
              r="15"
              fill={activeRegion === 'psOnly' || isTermHighlighted('psOnly') ? '#1d182e' : '#ffffff'}
              stroke="#1d182e"
              strokeWidth="1.5"
              className="transition-all group-hover:scale-110"
            />
            <text
              x="190"
              y="99"
              textAnchor="middle"
              className={`font-display text-[11px] font-bold ${
                activeRegion === 'psOnly' || isTermHighlighted('psOnly') ? 'fill-white' : 'fill-[#1d182e]'
              }`}
            >
              {counts.psOnly}
            </text>
          </g>

          {/* 5. P & F only */}
          <g
            className="cursor-pointer group"
            onClick={() => handleRegionClick('pfOnly')}
          >
            <circle
              cx="140"
              cy="185"
              r="15"
              fill={activeRegion === 'pfOnly' || isTermHighlighted('pfOnly') ? '#1d182e' : '#ffffff'}
              stroke="#1d182e"
              strokeWidth="1.5"
              className="transition-all group-hover:scale-110"
            />
            <text
              x="140"
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
          <g
            className="cursor-pointer group"
            onClick={() => handleRegionClick('sfOnly')}
          >
            <circle
              cx="240"
              cy="185"
              r="15"
              fill={activeRegion === 'sfOnly' || isTermHighlighted('sfOnly') ? '#1d182e' : '#ffffff'}
              stroke="#1d182e"
              strokeWidth="1.5"
              className="transition-all group-hover:scale-110"
            />
            <text
              x="240"
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
          <g
            className="cursor-pointer group"
            onClick={() => handleRegionClick('psf')}
          >
            <circle
              cx="190"
              cy="150"
              r="18"
              fill={activeRegion === 'psf' || isTermHighlighted('psf') ? '#fe725d' : '#1d182e'}
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all group-hover:scale-110 shadow-lg animate-pulse"
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
          <g
            className="cursor-pointer group"
            onClick={() => handleRegionClick('none')}
          >
            <rect
              x="20"
              y="262"
              width="82"
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
        <div className="w-full mt-3 rounded-xl border border-[#c5c5d9] bg-white p-3.5 shadow-sm transition-all">
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
