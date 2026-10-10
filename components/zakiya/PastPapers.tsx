"use client";

import { useEffect, useState } from "react";
import type { PastPaper, PastPaperAnswer } from "@/lib/zakiya/types";
import { parseNumber } from "./exam";
import OriginBadge from "./OriginBadge";
import { Rich } from "./Rich";
import { load, save } from "./storage";
import s from "./zakiya.module.css";

const STARS = ["", "●○○", "●●○", "●●●"];

function matches(a: PastPaperAnswer, raw: string): boolean {
  if (typeof a.value === "string") return raw.trim().toUpperCase() === a.value.trim().toUpperCase();
  const v = parseNumber(raw);
  if (!Number.isFinite(v)) return false;
  const tol = Math.abs(a.value) * ((a.tolerancePct ?? 2) / 100);
  return Math.abs(v - a.value) <= tol + 1e-12;
}

type Saved = Record<string, { typed: string[]; checked: boolean }>;

function Item({ p, state, onChange }: { p: PastPaper; state?: Saved[string]; onChange: (v: Saved[string]) => void }) {
  const [typed, setTyped] = useState<string[]>(state?.typed ?? p.answers.map(() => ""));
  const [showWhy, setShowWhy] = useState(false);
  useEffect(() => {
    if (state) setTyped(state.typed);
  }, [state]);
  const checked = !!state?.checked;

  return (
    <div className={s.ppItem}>
      <div className={s.cardTop} style={{ marginBottom: 6 }}>
        <span className={`${s.pill} ${s.pillTopic}`}>
          {p.paper} · {p.series}
        </span>
        <span className={s.marks} title={`Difficulty ${p.difficulty} of 3`} style={{ color: "var(--topic)" }}>
          {STARS[p.difficulty]}
        </span>
        <span className={s.spacer} />
        <span className={s.marks}>
          [{p.marks} mark{p.marks === 1 ? "" : "s"}]
        </span>
      </div>
      <h3 className={s.h3}>{p.question}</h3>
      <div className={s.originRow}>
        <OriginBadge origin={{ kind: "ocr" }} />
      </div>
      <p style={{ margin: "0 0 10px" }}>
        <Rich text={p.tests} />
      </p>
      <div className={s.row} style={{ marginTop: 0 }}>
        <a className={`${s.btn} ${s.btnSmall}`} href={p.url} target="_blank" rel="noopener noreferrer">
          Question paper ↗
        </a>
        {p.msUrl && (
          <a className={`${s.btn} ${s.btnGhost} ${s.btnSmall}`} href={p.msUrl} target="_blank" rel="noopener noreferrer">
            Mark scheme ↗
          </a>
        )}
      </div>

      <details className={s.ppCheck}>
        <summary>Check my answers</summary>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onChange({ typed, checked: true });
          }}
        >
          {p.answers.map((a, i) => {
            const ok = checked && matches(a, typed[i] ?? "");
            return (
              <div key={i} className={s.inputRow}>
                {a.label && <span className={s.partLabel}>({a.label})</span>}
                <input
                  className={s.input}
                  inputMode={typeof a.value === "string" ? "text" : "decimal"}
                  autoComplete="off"
                  placeholder={typeof a.value === "string" ? "Letter" : "Your answer"}
                  aria-label={`Answer${a.label ? ` to part ${a.label}` : ""}${a.unit ? ` in ${a.unit}` : ""}`}
                  value={typed[i] ?? ""}
                  onChange={(e) => {
                    const next = [...typed];
                    next[i] = e.target.value;
                    setTyped(next);
                    if (checked) onChange({ typed: next, checked: false });
                  }}
                />
                {a.unit && <span className={s.unit}>{a.unit}</span>}
                {checked && (typed[i] ?? "").trim() !== "" && (
                  <span className={`${s.verdict} ${ok ? s.verdictRight : s.verdictWrong}`}>
                    {ok ? "✓" : `✗ expected ≈ ${a.value}${a.unit ? ` ${a.unit}` : ""}`}
                  </span>
                )}
              </div>
            );
          })}
          <div className={s.row}>
            <button type="submit" className={`${s.btn} ${s.btnSmall}`} disabled={typed.every((t) => !t.trim())}>
              Check
            </button>
            <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSmall}`} onClick={() => setShowWhy((v) => !v)}>
              {showWhy ? "Hide explanation" : "How to do it"}
            </button>
          </div>
        </form>
        {(showWhy || checked) && (
          <div className={s.explain}>
            <h4>Our explanation</h4>
            <p>
              <Rich text={p.explanation} />
            </p>
          </div>
        )}
      </details>
    </div>
  );
}

export default function PastPapers({ slug, items }: { slug: string; items: PastPaper[] }) {
  const key = `zakiya:pastpapers:${slug}`;
  const [saved, setSaved] = useState<Saved>({});
  useEffect(() => setSaved(load<Saved>(key, {})), [key]);
  if (items.length === 0) return null;
  const update = (id: string, v: Saved[string]) =>
    setSaved((cur) => {
      const next = { ...cur, [id]: v };
      save(key, next);
      return next;
    });

  return (
    <section className={s.card} id="past-papers">
      <div className={s.cardTop}>
        <span className={`${s.pill} ${s.pillTopic}`}>Real OCR questions</span>
      </div>
      <h2 className={s.h2}>Real past papers</h2>
      <p className={s.note} style={{ marginTop: 0 }}>
        Real OCR questions — open the paper, answer, then check here. Easiest first; links go to Physics &amp; Maths Tutor or OCR.
      </p>
      {items.map((p) => (
        <Item key={p.id} p={p} state={saved[p.id]} onChange={(v) => update(p.id, v)} />
      ))}
    </section>
  );
}
