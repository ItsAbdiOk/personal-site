"use client";

import type { Question } from "@/lib/zakiya/types";
import { type Answers, isDone, isWrong, partKey } from "./exam";
import { Rich } from "./Rich";
import s from "./zakiya.module.css";

export default function Review({
  questions,
  answers,
  onRetryWrong,
  onStartOver,
  onGoExam,
}: {
  questions: Question[];
  answers: Answers;
  onRetryWrong: () => void;
  onStartOver: () => void;
  onGoExam: () => void;
}) {
  let total = 0, attempted = 0, scored = 0, partsDone = 0, partsAll = 0;
  const wrong: { q: Question; qi: number; k: number }[] = [];
  questions.forEach((q, qi) =>
    q.parts.forEach((p, k) => {
      const r = answers[partKey(q, k)];
      total += p.marks;
      partsAll++;
      if (isDone(p, r)) {
        partsDone++;
        attempted += p.marks;
        scored += r!.score;
        if (isWrong(p, r)) wrong.push({ q, qi, k });
      }
    }),
  );

  if (partsDone === 0) {
    return (
      <div className={`${s.card} ${s.empty}`}>
        <div className={s.emptyIcon}>📊</div>
        <h3 className={s.h3}>Nothing to review yet</h3>
        <p>Have a go at the exam questions first. Your score and anything to fix will show up here.</p>
        <button type="button" className={s.btn} onClick={onGoExam}>
          Start exam practice
        </button>
      </div>
    );
  }

  const pct = attempted ? Math.round((scored / attempted) * 100) : 0;
  const msg =
    pct >= 85 ? "Brilliant — that's top-grade work." : pct >= 65 ? "Solid. Fix the few below and you're there." : pct >= 40 ? "Good start. The notes below show exactly what to fix." : "Every mistake below is one you won't make in the exam.";

  return (
    <div>
      <section className={s.card}>
        <div className={s.cardTop}>
          <span className={`${s.pill} ${s.pillTopic}`}>Your score</span>
        </div>
        <div className={s.scoreRing}>
          <div className={s.bigNum}>
            {scored}
            <small> / {attempted}</small>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <p style={{ margin: 0, color: "var(--ink)" }}>
              <b>{pct}%</b> of the marks you attempted. {msg}
            </p>
            <p className={s.note} style={{ margin: "4px 0 0" }}>
              {partsDone} of {partsAll} parts answered · {total} marks available in total
            </p>
          </div>
        </div>
        <div className={s.progressBar} style={{ marginTop: 16, marginBottom: 0 }} aria-hidden>
          <div className={s.progressFill} style={{ width: `${pct}%` }} />
        </div>
        <div className={s.row}>
          {wrong.length > 0 && (
            <button type="button" className={s.btn} onClick={onRetryWrong}>
              Retry wrong ones ({wrong.length})
            </button>
          )}
          {partsDone < partsAll && (
            <button type="button" className={`${s.btn} ${s.btnGhost}`} onClick={onGoExam}>
              Carry on practising
            </button>
          )}
          <button type="button" className={`${s.btn} ${s.btnGhost}`} onClick={onStartOver}>
            Start over
          </button>
        </div>
      </section>

      {wrong.length === 0 ? (
        <div className={`${s.card} ${s.empty}`}>
          <div className={s.emptyIcon}>🎯</div>
          <p>No dropped marks on anything you answered. Nice.</p>
        </div>
      ) : (
        wrong.map(({ q, qi, k }) => {
          const p = q.parts[k];
          const r = answers[partKey(q, k)]!;
          const yours =
            p.kind === "mcq"
              ? `${"ABCDEFGH"[Number(r.response)] ?? "?"}`
              : p.kind === "numeric"
                ? `${r.response} ${p.answer?.unit ?? ""}`
                : r.response;
          return (
            <section key={partKey(q, k)} className={s.card}>
              <div className={s.cardTop}>
                <span className={`${s.pill} ${s.pillTopic}`}>
                  Q{qi + 1}
                  {p.label ? ` (${p.label})` : ""}
                </span>
                <span className={`${s.verdict} ${r.score === 0 ? s.verdictWrong : s.verdictPart}`}>
                  {r.score}/{p.marks}
                </span>
              </div>
              <h3 className={s.h3}>{q.title}</h3>
              <p style={{ color: "var(--ink)" }}>
                <Rich text={p.prompt} />
              </p>
              {p.kind === "mcq" && p.options && (
                <ul className={s.list}>
                  {p.options.map((o, i) => (
                    <li key={i}>
                      <b>{"ABCDEFGH"[i]}</b> <Rich text={o} />
                    </li>
                  ))}
                </ul>
              )}
              <div className={s.wordingLabel} style={{ marginTop: 8 }}>
                Your answer
              </div>
              <div className={s.yourAns}>
                {p.kind === "mcq" && p.options ? (
                  <>
                    <b>{yours}</b> <Rich text={p.options[Number(r.response)]} />
                  </>
                ) : (
                  yours
                )}
              </div>
              <div className={s.explain}>
                <h4>Model answer</h4>
                <p>
                  <Rich text={p.modelAnswer} />
                </p>
                <h4>Mark scheme</h4>
                <ul className={s.list}>
                  {p.markScheme.map((m, i) => (
                    <li key={i}>
                      {p.kind === "written" && (r.ticks ?? []).includes(i) ? "✓ " : ""}
                      <Rich text={m} />
                    </li>
                  ))}
                </ul>
                {p.commonMistakes.length > 0 && (
                  <>
                    <h4>Common mistakes</h4>
                    <ul className={s.list}>
                      {p.commonMistakes.map((m, i) => (
                        <li key={i}>
                          <Rich text={m} />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
