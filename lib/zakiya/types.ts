// Content shape for Zakiya's study guide (/zakiya).
// Each subchapter is one `Subchapter` object in content/zakiya/<module>/<slug>.ts.

/** Where a piece of content comes from. "both" = in the OCR spec and the textbook. */
export type Source = "both" | "spec-only" | "textbook-only";

/** Tap-to-explain entry for a symbol, letter or bit of working (e.g. vₓ, θ, "g cos 90°").
 *  Referenced inline as {{key}} or {{key|display text}}. Only the FIRST occurrence on the page is
 *  underlined/tappable; later ones render as plain display text. */
export type Explain = { label: string; body: Rich };

/** Inline text supports {{key}} / {{key|text}} tap-to-explain (see Explain), a tiny markup: **bold**, _italic_, x^2^ superscript, v~x~ subscript,
 *  [[term]] which links to a glossary entry with the same `term`, and ==phrase== which marks
 *  wording that mark schemes credit (rendered as a soft highlighter). */
export type Rich = string;

/** One axis of a graph figure. Shown OCR style: "time t / s" (label, italic symbol, / unit). */
export type GraphAxis = {
  label: Rich;                 // "time"
  symbol?: string;             // TeX, e.g. "t" or "v_x"; also the expression variable on the x axis
  unit: string;                // "s", "m s⁻¹"
  min: number;
  max: number;
  step?: number;               // grid + tick spacing (default: a nice step for the range)
};

export type GraphColour = "accent" | "vx" | "vy" | "muted";

/** A line on a graph: a formula in the x-axis variable (e.g. "12*t - t^2"), or straight
 *  segments joining points (exact, for piecewise motion and data). Give one of them. */
export type GraphSeries = {
  id: string;
  label?: Rich;
  expr?: string;               // + - * / ^ ( ) sqrt sin cos tan (degrees) exp ln pi; see lib/zakiya/graph-expr.ts
  points?: [number, number][];
  colour?: GraphColour;
};

export type GraphReadout = { quantity: Rich; unit: string; decimals: number };

/** Tangent mode: a tangent touching `series` at x = `at`; draggable along the curve if asked. */
export type GraphTangent = { series: string; at: number; draggable: boolean; showTriangle: boolean; readout: GraphReadout };

/** Area mode: shade between `series` and the x-axis from `from` to `to`. */
export type GraphArea = { series: string; from: number; to: number; readout: GraphReadout; squares?: boolean };

export type GraphPoint = { x: number; y: number; label?: Rich };

export type Figure =
  | { kind: "projectile-sim"; caption?: Rich }
  | { kind: "shadow-sim"; caption?: Rich }                           // textbook kick (15 m/s, 30°) with ground + wall shadows                       // hand-built interactive simulator
  | { kind: "hairline"; figure: "elevator" | "turntable" | "plot" | "terrain"; caption?: Rich }
  | { kind: "svg"; svg: string; caption?: Rich; alt: string }        // static inline diagram, uses currentColor + CSS vars
  /** Declarative graph (components/zakiya/Graph.tsx). Numbers are recomputable by the Python checks. */
  | {
      kind: "graph";
      alt: string;
      caption?: Rich;
      x: GraphAxis;
      y: GraphAxis;
      series: GraphSeries[];
      tangent?: GraphTangent;
      area?: GraphArea;
      points?: GraphPoint[];
    };

/** A data table. Headers read "quantity / unit" (OCR style). Cells: write measured values as
 *  strings to keep trailing zeros ("0.030"); null = an empty box to fill in. */
export type TableColumn = { header: Rich; unit?: string; highlight?: boolean; blank?: boolean };
export type Table = { caption?: Rich; columns: TableColumn[]; rows: (string | number | null)[][]; note?: Rich };

/** Where the numbers in a worked example / question came from.
 *  textbook = numbers from the textbook (ref = page, e.g. "p. 42"); ocr = a real OCR past-paper question;
 *  ours = made for this guide and independently double-checked. */
export type Origin = { kind: "textbook" | "ocr" | "ours"; ref?: string };

export type Block =
  | { type: "text"; body: Rich }
  | { type: "list"; items: Rich[] }
  /** Equation in three layers: the symbol version, the same thing as a plain-English sentence,
   *  and (optionally) the general data-sheet form it comes from. */
  | { type: "equation"; latexless: string; tex?: string; words?: Rich; general?: string; generalTex?: string; note?: Rich; dataSheet: boolean }
  /** "Where this is going": one-line ramp-up at the top of a section. */
  | { type: "lead"; body: Rich }
  | { type: "analogy"; icon: string; body: Rich }
  | { type: "figure"; figure: Figure }
  | { type: "warning"; body: Rich }                                  // common exam mistake
  | { type: "worked"; title: string; question: Rich; steps: Rich[]; answer: Rich; origin?: Origin }
  /** "Say it like this": wording a mark scheme credits, what it rejects, and where that comes from. */
  | { type: "sayIt"; say: Rich[]; reject?: Rich[]; source: string }
  /** Real examiners' report finding. `cite` = series + paper (+ question), e.g. "June 2023 H556/01 Q17(b)". */
  | { type: "examiners"; body: Rich; cite: string }
  /** General exam technique (our advice, not examiner evidence). */
  | { type: "tip"; body: Rich }
  /** Data table: use for any data with 3+ values. */
  | ({ type: "table" } & Table);

export type Section = {
  id: string;
  heading: string;
  source: Source;
  specRef?: string;            // e.g. "3.1.3(a)"
  blocks: Block[];
};

/** A term she must know. When spec and textbook word it differently, both are shown. */
export type Definition = {
  term: string;
  plain: Rich;                 // one-line simple explanation
  spec?: string;               // OCR spec / mark-scheme wording
  textbook?: string;           // textbook wording
  differenceNote?: Rich;       // what actually differs and which earns the mark
  source: Source;
};

export type Flashcard = {
  id: string;
  front: Rich;
  back: Rich;
  tag: "definition" | "equation" | "concept" | "practical";
  source: Source;
  page?: string;               // textbook page(s) the fact is on, e.g. "40–43"; omit for spec-only cards
};

export type QuestionPart = {
  label?: string;              // "a", "b(i)" …
  prompt: Rich;
  marks: number;
  kind: "mcq" | "numeric" | "written";
  options?: Rich[];            // mcq only
  correctIndex?: number;       // mcq only
  answer?: { value: number; unit: string; tolerancePct: number }; // numeric only
  modelAnswer: Rich;           // full worked answer
  markScheme: Rich[];          // one entry per marking point
  commonMistakes: Rich[];      // what students typically get wrong and why
  table?: Table;               // data for this part only, shown under the prompt
};

export type Question = {
  id: string;
  title: string;
  stem?: Rich;
  figure?: Figure;
  table?: Table;               // data in the stem (results, readings), shown under it
  parts: QuestionPart[];
  difficulty: 1 | 2 | 3;
  style: "Paper 1 MCQ" | "Structured" | "Extended response";
  origin?: Origin;
  basedOn?: string;            // real paper this is modelled on, e.g. "Modelled on H556/01 June 2022 Q16(b)"
};

/** Final answer to one part of a real past-paper question, so the page can check her value.
 *  `value` is a number (checked within tolerancePct) or an MCQ letter. */
export type PastPaperAnswer = {
  label?: string;              // "b(iii)"
  value: number | string;
  unit?: string;
  tolerancePct?: number;       // numeric only; default 2
};

/** A real OCR question to sit after our remixes. Never reproduce the question text. */
export type PastPaper = {
  id: string;
  paper: string;               // "H556/01"
  series: string;              // "June 2022"
  question: string;            // "Q16(b)"
  marks: number;
  difficulty: 1 | 2 | 3;
  url: string;                 // question paper
  msUrl?: string;              // mark scheme
  tests: Rich;                 // one line: what it tests
  answers: PastPaperAnswer[];
  explanation: Rich;           // our own short explanation of the method
};

export type Subchapter = {
  slug: string;                // "3-8-projectile-motion"
  number: string;              // "3.8"
  title: string;
  module: number;              // 3
  chapter: { number: number; title: string };
  specRefs: string[];          // ["3.1.3(a)", "3.1.3(b)"]
  textbookPages: string;       // "40–43"
  colour: string;              // topic accent, e.g. "#0071E3"
  summary: Rich;               // 1–2 sentence "what this is about"
  keyIdea: Rich;               // the one thing to remember
  sections: Section[];
  definitions: Definition[];
  flashcards: Flashcard[];
  questions: Question[];
  pastPapers?: PastPaper[];    // real questions to sit, easiest first
  explain?: Record<string, Explain>; // tap-to-explain dictionary for {{key}} markup
};
