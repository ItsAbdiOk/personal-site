import type { Question, QuestionPart } from "@/lib/zakiya/types";

export type PartResult = {
  response: string; // text typed (numeric / written) or chosen option index as string (mcq)
  submitted: boolean;
  ticks?: number[]; // written: indices of mark-scheme points she says she hit
  selfMarked?: boolean;
  score: number;
};

export type Answers = Record<string, PartResult>;

export const partKey = (q: Question, i: number) => `${q.id}:${i}`;

/** "1.2e3", "1.2 × 10^3", "1,200", "−4.5" → number (NaN if unreadable). */
export function parseNumber(raw: string): number {
  const t = raw.trim().replace(/[−–]/g, "-").replace(/[\s,]/g, "");
  const m = t.match(/^([-+]?(?:\d+\.?\d*|\.\d+))(?:(?:e|[x×*]10\^?)([-+]?\d+))?$/i);
  if (!m) return NaN;
  return parseFloat(m[1]) * (m[2] ? Math.pow(10, parseInt(m[2], 10)) : 1);
}

export function checkNumeric(part: QuestionPart, raw: string): boolean {
  if (!part.answer) return false;
  const v = parseNumber(raw);
  if (!Number.isFinite(v)) return false;
  const { value, tolerancePct } = part.answer;
  const tol = Math.abs(value) * (tolerancePct / 100) || tolerancePct / 100;
  return Math.abs(v - value) <= tol + 1e-12;
}

export const isDone = (part: QuestionPart, r?: PartResult) =>
  !!r && r.submitted && (part.kind !== "written" || !!r.selfMarked);

export const isWrong = (part: QuestionPart, r?: PartResult) => isDone(part, r) && r!.score < part.marks;
