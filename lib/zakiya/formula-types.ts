// Content shape for the formula sheet in Zakiya's study guide (/zakiya).
// One `FormulaSheet` per module in content/zakiya/formulas/module<N>.ts.
// Rich fields use the same markup as lib/zakiya/types.ts (**bold**, _italic_, x^2^, v~x~, {{key}} → sheet.explain).

import type { Explain, Origin, Rich } from "./types";

/** One row of a formula's legend: symbol → meaning → unit (e.g. "t · time · s"). */
export type LegendEntry = {
  symbol: string;              // as written in `equation`, e.g. "t", "vx", "θ"
  meaning: Rich;               // "time", "acceleration of free fall"
  unit?: string;               // SI unit in Unicode, e.g. "m s⁻²"; omit for pure numbers/ratios
  value?: string;              // fixed value when there is one, e.g. "9.81 m s⁻²" for g
  tex?: string;                // LaTeX for the symbol when symbolTex() can't guess it
};

/** A number handed to us in the question, tied to a legend symbol so the UI can highlight where it goes. */
export type GivenValue = {
  symbol: string;              // must match a `LegendEntry.symbol` of the formula
  value: string;               // with unit, e.g. "44.1 m"
  meaning: Rich;               // what it is in this question, e.g. "height of the cliff"
};

/** One line of working: what we're doing in words, then the equation with the numbers put in. */
export type SolvedStep = {
  say: Rich;                   // "Put the numbers in"
  working: string;             // plain Unicode, numbers substituted: "t = √(2 × 44.1 ÷ 9.81)"
  result?: string;             // "t = 3.00 s"
  /** KaTeX version of `working`. Wrap each number taken from `given` as \given{symbol}{number}
   *  (symbol = GivenValue.symbol) so the sheet can colour it to match that symbol. */
  tex?: string;
};

/** A fully solved question that shows one formula in use. */
export type SolvedExample = {
  title: string;               // "Cannonball off a cliff"
  source: Origin;              // textbook (ref = page) / ocr / ours
  subchapter?: string;         // slug where the full example lives, e.g. "3-8-projectile-motion"
  question: Rich;
  given: GivenValue[];
  find: Rich;                  // what we're after, e.g. "the time t to reach the sea"
  steps: SolvedStep[];
  answer: Rich;
};

/** Where a formula that is NOT printed on the data sheet comes from (for "derived" entries). */
export type DerivedFrom = {
  printed: string;             // the printed data-sheet equation, e.g. "s = ut + ½at²"
  how: Rich;                   // one line: what you set / rearrange to get it
};

export type Formula = {
  id: string;                  // stable, e.g. "suvat-s-ut"
  name: string;                // "Distance with constant acceleration"
  equation: string;            // plain Unicode, e.g. "s = ut + ½at²" (fallback + My Notes snapshot)
  tex?: string;                // KaTeX version of `equation`, e.g. s = ut + \\tfrac{1}{2}at^2
  words: Rich;                 // the same thing as a plain-English sentence
  legend: LegendEntry[];
  /** true = printed on the OCR Data, Formulae and Relationships booklet; false = not printed. */
  onDataSheet: boolean;
  /** Not printed, but one step from a printed equation. When set, onDataSheet is false. */
  derivedFrom?: DerivedFrom;
  specRef: string;             // "3.1.2(a)(ii)"
  topic: string;               // "3.1 Motion"
  subchapters?: string[];      // subchapter slugs that use it, e.g. ["3-8-projectile-motion"]
  notes?: Rich;                // when to use it / common trap
  example?: SolvedExample;
};

/** How a formula is labelled on the sheet. */
export type FormulaStatus = "data-sheet" | "derived" | "memorise";

export function formulaStatus(f: Formula): FormulaStatus {
  if (f.onDataSheet) return "data-sheet";
  return f.derivedFrom ? "derived" : "memorise";
}

export type FormulaGroup = {
  id: string;                  // "3-1-motion"
  title: string;               // "3.1 Motion"
  short?: string;              // label in the jump index, e.g. "3.1.3 Projectiles"
  intro?: Rich;
  formulas: Formula[];
};

export type FormulaSheet = {
  module: number;              // 3
  title: string;               // "Module 3: Forces and motion"
  intro?: Rich;
  groups: FormulaGroup[];
  explain?: Record<string, Explain>; // tap-to-explain dictionary for {{key}} markup on this sheet
};

const GREEK: Record<string, string> = { "Δ": "\\Delta ", "θ": "\\theta ", "ρ": "\\rho ", "σ": "\\sigma ", "ε": "\\varepsilon " };

/** LaTeX for a legend symbol: "vx" → v_x, "Δs" → \Delta s, "reaction time" → \text{reaction time}. */
export function symbolTex(e: Pick<LegendEntry, "symbol" | "tex">): string {
  if (e.tex) return e.tex;
  const sym = e.symbol;
  if (/\s/.test(sym) || /^[a-z]{4,}$/i.test(sym)) return `\\text{${sym}}`;
  if (["vx", "vy", "ux", "uy", "Ek", "Ep"].includes(sym)) return `${sym[0]}_${sym[1]}`;
  return sym.replace(/[Δθρσε]/g, (c) => GREEK[c]).trim();
}
