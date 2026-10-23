import Link from "next/link";
import { Triangle, Shield, BookOpen, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#c5c5d9]/60 bg-[#f2ebff]/60 py-10 text-[#444656]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4057ff] text-white">
                <Triangle className="h-4 w-4 fill-white/20" />
              </div>
              <span className="font-display font-bold text-lg text-[#1d182e]">
                Exam Stress Triangle Lab
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-md text-[#444656]">
              A university mathematics experimental learning platform applying the Principle of
              Inclusion–Exclusion and Propositional Logic to investigate how procrastination, poor
              sleep, and external pressures intersect during exam periods.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-[#757688]">
              <Shield className="h-3.5 w-3.5 text-[#1e39e7]" />
              <span>Strictly anonymous &amp; voluntary. Operational definitions for educational self-reflection only.</span>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm text-[#1d182e] uppercase tracking-wider mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-[#1e39e7] transition">
                  Home Experiment
                </Link>
              </li>
              <li>
                <Link href="/participate" className="hover:text-[#1e39e7] transition">
                  Participate &amp; Predict
                </Link>
              </li>
              <li>
                <Link href="/lab" className="hover:text-[#1e39e7] transition">
                  Research Dashboard
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:text-[#1e39e7] transition">
                  What-If Simulator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm text-[#1d182e] uppercase tracking-wider mb-3">
              Documentation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/methodology" className="hover:text-[#1e39e7] transition">
                  Methodology &amp; Axioms
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-[#1e39e7] transition">
                  Exportable Report &amp; CSV
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/MiladJoodi/QuizMaster"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-[#1e39e7] transition"
                >
                  <span>QuizMaster Source (MIT)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <span className="text-xs text-[#757688]">Version 1.0 (Spring 2026)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#c5c5d9]/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#757688] gap-2">
          <p>© 2026 University Mathematics Experimental Learning Project. Reusable under MIT License.</p>
          <div className="flex items-center gap-4">
            <Link href="/methodology" className="hover:underline">
              Mathematical Transparency
            </Link>
            <span>•</span>
            <Link href="/report" className="hover:underline">
              Printable Findings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
