# Exam Stress Triangle — Prediction vs Reality Lab

**Academic Topic:**
*“Exam Stress Triangle: Applying the Principle of Inclusion–Exclusion and Propositional Logic to Study Exam Stress Among Students.”*

An interactive, university mathematics experimental learning platform investigating how procrastination ($P$), poor sleep ($S$), and social/family pressure ($F$) overlap among students, and whether common beliefs about these factors match empirical observations.

---

## 🎨 Visual Identity & Architecture

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Framer Motion**, and **Radix UI**. The UI embodies the **Kinetic Logic Studio** design language:
- Patchwork colour-blocked bento grids
- High-contrast chromatic identities:
  - **Electric Blue (`#4057FF`)**: Set $P$ (Procrastination) & logic foundations
  - **Tangerine Coral (`#FE725D`)**: Set $S$ (Sleep Deficit) & high tension
  - **Acid Lime (`#CCF15A`)**: Set $F$ (Social Pressure) & equilibrium triggers
  - **Deep Ink (`#1D182E`)**: Structural borders, typographic frames
  - **Warm Cream (`#FFF8E9`)**: Warm academic paper canvas
- Clean, accessible typography pairing **Space Grotesk** (display & counters) and **Geist** (data displays & propositional expressions).

---

## 📐 Mathematical Single Source of Truth

All scoring, set operations, and logical truth tables are governed by the testable module [`lib/math-engine.ts`](file:///d:/DMGT/Stress_Decode/lib/math-engine.ts):

### 1. Factor Membership
- Each factor is evaluated with 3 Likert items ($0$ to $3$), maximum score $= 9$.
- **Rule:** A factor is present if and only if score $\ge 6$ out of $9$.
  - $P \iff \text{score}(P) \ge 6$
  - $S \iff \text{score}(S) \ge 6$
  - $F \iff \text{score}(F) \ge 6$

### 2. Elevated Stress Indicator ($E$)
- 4 Likert items ($0$ to $3$), maximum score $= 12$.
- $\text{Stress Indicator} = (\text{total} / 12) \times 100$.
- **Rule:** Set $E \iff \text{total stress score} \ge 4$ out of $12$.
  - $0$–$3$: Lower Indicator
  - $4$–$7$: Moderate Indicator
  - $8$–$12$: Higher Indicator

### 3. Principle of Inclusion–Exclusion (PIE)
$$|P \cup S \cup F| = |P| + |S| + |F| - |P \cap S| - |P \cap F| - |S \cap F| + |P \cap S \cap F|$$
All eight mutually exclusive Venn partitions are verified against the partition sum invariant:
$$\sum_{i=1}^{8} \text{Region}_i = N$$

### 4. Propositional Logic
Evaluates classical material implication $X \implies E$ ($P \implies E$, $S \implies E$, $F \implies E$):
- $T \implies T$: True
- $T \implies F$: **FALSE (Empirical Counterexample)**
- $F \implies T$: True (Vacuously True)
- $F \implies F$: True (Vacuously True)

---

## 🧭 Application Routes

1. **Home (`/`)**: Hero section, live overlap model preview, three factor cards, core mathematical axioms, and CTAs.
2. **Participate (`/participate`)**: Pre-experiment prediction (leading factor & triple overlap estimate), voluntary consent confirmation, 4-round scored questionnaire (13 items), and 3 subjective belief questions.
3. **Personalized Results (`/results`)**: Dynamic radial gauge, stress total, factor breakdowns, set placement in Venn universe, and actionable reflection recommendations.
4. **Research Lab (`/lab`)**: Aggregated cohort findings, interactive 8-region Venn diagram, interactive Inclusion-Exclusion formula term highlighter, propositional truth tables, association comparisons, and dynamic textual evidence synthesis.
5. **What-If Simulator (`/simulator`)**: Isolated mathematical simulation sandbox with sliders for $N$, set sizes, and intersections; live parameter validation preventing inconsistent set configurations.
6. **Methodology (`/methodology`)**: Comprehensive academic documentation of variable definitions, PIE derivation, truth table interpretations, and limitations.
7. **Report & Exports (`/report`)**: Print-friendly research report and CSV downloads for Aggregate Statistics, 8 Venn Regions, and Truth Tables.

---

## 💾 Centralized Data Collection & Supabase Setup

The system includes a production-ready PostgreSQL schema with Row Level Security (RLS) policies in [`schema.sql`](file:///d:/DMGT/Stress_Decode/schema.sql).

### Environment Configuration:
Copy `.env.example` to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

- When Supabase credentials are not provided or unconfigured, the application **automatically runs in Demo Preview Mode** using a deterministic cohort ($N=412$ synthetic verified records) clearly tagged throughout the UI.
- Personal submissions during demo mode are safely saved in session memory without corrupting research datasets.

---

## 🧪 Unit Testing & Validation

Run unit tests via Node's built-in test runner with TypeScript execution:
```bash
npm test
```
The suite verifies:
- Minimum (0) and maximum (12) stress score limits
- Factor membership strictly at score $\ge 6$ (testing 5 vs 6)
- Exact computation of all 8 mutually exclusive Venn regions summing to $N$
- PIE union equality against direct union query
- Propositional logic truth values across all 4 assignments
- Association calculations with empty/zero denominators
- Simulator parameter validation and error bounds
- Anonymous submission payload validation

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Build for production
npm run build

# Start local server
npm run dev
# or
npm start
```
Visit `http://localhost:3000`.

---

## 📜 Attribution and License

- Licensed under the **MIT License**.
- Reusable UI primitives and charting theme adapted from [QuizMaster](https://github.com/MiladJoodi/QuizMaster) by Milad Joodi (MIT License). See [`CREDITS.md`](file:///d:/DMGT\Stress_Decode\CREDITS.md) for full licensing details.
