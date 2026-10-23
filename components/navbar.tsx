"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Triangle,
  BarChart2,
  Sliders,
  BookOpen,
  FileText,
  Sparkles,
  Menu,
  X,
  Play,
} from "lucide-react";
import { useState } from "react";

export function Navbar({ cohortSize = 105, isLive = true }: { cohortSize?: number; isLive?: boolean }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: Sparkles },
    { href: "/participate", label: "Participate", icon: Play },
    { href: "/lab", label: "Research Lab", icon: BarChart2 },
    { href: "/simulator", label: "What-If Simulator", icon: Sliders },
    { href: "/methodology", label: "Methodology", icon: BookOpen },
    { href: "/report", label: "Report & Exports", icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#c5c5d9]/60 bg-[#fdf7ff]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ede4ff] shadow-[2px_2px_0px_#1d182e] border border-[#1d182e]/20">
            <Triangle className="h-5 w-5 text-[#1e39e7] fill-[#1e39e7]/20" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-base sm:text-lg text-[#1d182e] tracking-tight leading-none">
                Exam Stress Triangle
              </span>
              <span className="rounded bg-[#ccf15a] px-1.5 py-0.5 font-display text-[11px] font-bold text-[#161e00] shadow-sm">
                2026
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#444656] truncate">
              Prediction vs Reality Lab
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                  active
                    ? "bg-[#4057ff] text-white shadow-[2px_2px_0px_#1d182e]"
                    : "text-[#1d182e] hover:bg-[#ede4ff] hover:text-[#1e39e7]"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-white" : "text-[#444656]"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Status Pill & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          {/* Cohort status indicator */}
          <Link
            href="/lab"
            className="flex items-center gap-1.5 rounded-full border border-[#c5c5d9] bg-[#f2ebff] px-2.5 py-1 text-xs font-semibold text-[#1d182e] shadow-sm hover:border-[#4057ff] transition"
            title="Empirical University Cohort (N=105 Students)"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">n={cohortSize}</span>
            <span className="hidden sm:inline text-[10px] uppercase font-bold text-[#1e39e7] bg-white px-1.5 py-0.5 rounded border border-[#c5c5d9]">
              Live Study
            </span>
          </Link>

          {/* Quick CTA to participate */}
          <Link
            href="/participate"
            className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-[#ccf15a] border border-[#161e00] px-3 py-1.5 text-xs font-bold text-[#161e00] shadow-[2px_2px_0px_#161e00] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:translate-x-1 active:translate-y-1"
          >
            <span>Test Yourself</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-[#c5c5d9] bg-[#f2ebff] text-[#1d182e] hover:bg-[#ede4ff]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#c5c5d9] bg-[#fdf7ff] px-4 py-3 space-y-1 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  active
                    ? "bg-[#4057ff] text-white shadow-sm"
                    : "text-[#1d182e] hover:bg-[#ede4ff]"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-white" : "text-[#444656]"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
