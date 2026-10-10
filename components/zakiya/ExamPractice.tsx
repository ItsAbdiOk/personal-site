"use client";

import { useEffect, useState } from "react";
import type { Question, QuestionPart } from "@/lib/zakiya/types";
import { type Answers, type PartResult, checkNumeric, isDone, partKey } from "./exam";
import Figure from "./Figure";
import DataTable from "./DataTable";
import OriginBadge from "./OriginBadge";
import { Rich } from "./Rich";
import s from "./zakiya.module.css";

const LETTERS = "ABCDEFGH";
const STARS = ["", "●○○", "●●○", "●●●"];

export function Feedback({ part, result }: { part: QuestionPart; result: PartResult }) {
  return (
    <div className={s.explain}>
      <h4>Model answer</h4>
      <p>
        <Rich text={part.modelAnswer} />
      </p>
      {part.kind !== "written" && part.markScheme.length > 0 && (
        <>
          <h4>Mark scheme</h4>
          <ul className={s.list}>
            {part.markScheme.map((m, i) => (
              <li key={i}>
                <Rich text={m} />
              </li>
            ))}
          </ul>
        </>
      )}
      {part.commonMistakes.length > 0 && (
        <>
          <h4>{result.score < part.marks ? "Why people slip up" : "Common mistakes (you avoided these)"}</h4>
          <ul className={s.list}>
            {part.commonMistakes.map((m, i) => (
              <li key={i}>
                <Rich text={m} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Verdict({ part, result }: { part: QuestionPart; result: PartResult }) {
  const full = result.score >= part.marks;
  const zero = result.score === 0;
  return (
    <span className={`${s.verdict} ${full ? s.verdictRight : zero ? s.verdictWrong : s.verdictPart}`}>
      {full ? "✓ Correct" : zero ? "✗ Not quite" : "Partly there"} · {result.score}/{part.marks}
    </span>
  );
}

function Part({
  part,
  result,
  onChange,
}: {
  part: QuestionPart;
  result: PartResult | undefined;
  onChange: (r: PartResult) => void;
}) {
  const [draft, setDraft] = useState(result?.response ?? "");
  const [ticks, setTicks] = useState<number[]>(result?.ticks ?? []);
  useEffect(() => {
    setDraft(result?.response ?? "");
    setTicks(result?.ticks ?? []);
  }, [result]);

  const submitted = !!result?.submitted;
  const done = isDone(part, result);

  const submit = (response: string) => {
    if (part.kind === "mcq") {
      const ok = Number(response) === part.correctIndex;
      onChange({ response, submitted: true, score: ok ? part.marks : 0 });
    } else if (part.kind === "numeric") {
      onChange({ response, submitted: true, score: checkNumeric(part, response) ? part.marks : 0 });
    } else {
      onChange({ response, submitted: true, selfMarked: false, ticks: [], score: 0 });
    }
  };

  return (
    <div className={s.part}>
      <div className={s.partHead}>
        {part.label && <span className={s.partLabel}>({part.label})</span>}
        <p className={s.partPrompt}>
          <Rich text={part.prompt} />
        </p>
        <span className={s.marks}>
          [{part.marks} mark{part.marks === 1 ? "" : "s"}]
        </span>
      </div>
      {part.table && <DataTable table={part.table} />}

      {part.kind === "mcq" && (
        <div className={s.opts} role="group" aria-label="Options">
          {(part.options ?? []).map((o, i) => {
            const chosen = (submitted ? result?.response : draft) === String(i);
            const cls = submitted
              ? i === part.correctIndex
                ? s.optRight
                : chosen
                  ? s.optWrong
                  : ""
              : chosen
                ? s.optChosen
                : "";
            return (
              <button
                key={i}
                type="button"
                className={`${s.opt} ${cls}`}
                disabled={submitted}
                aria-pressed={chosen}
                onClick={() => setDraft(String(i))}
              >
                <span className={s.optKey}>{LETTERS[i]}</span>
                <span>
                  <Rich text={o} />
                </span>
              </button>
            );
          })}
          {!submitted && (
            <div className={s.row} style={{ marginTop: 4 }}>
              <button type="button" className={s.btn} disabled={draft === ""} onClick={() => submit(draft)}>
                Check answer
              </button>
            </div>
          )}
        </div>
      )}

      {part.kind === "numeric" && (
        <form
          className={s.inputRow}
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) submit(draft);
          }}
        >
          <input
            className={s.input}
            inputMode="decimal"
            autoComplete="off"
            placeholder="Your answer"
            aria-label={`Answer in ${part.answer?.unit ?? ""}`}
            value={draft}
            disabled={submitted}
            onChange={(e) => setDraft(e.target.value)}
          />
          {part.answer?.unit && <span className={s.unit}>{part.answer.unit}</span>}
          {!submitted && (
            <button type="submit" className={s.btn} disabled={!draft.trim()}>
              Check
            </button>
          )}
        </form>
      )}

      {part.kind === "written" && (
        <>
          <textarea
            className={s.textarea}
            placeholder="Write your answer as you would in the exam…"
            value={draft}
            disabled={submitted}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Your answer"
          />
          {!submitted && (
            <div className={s.row}>
              <button type="button" className={s.btn} disabled={!draft.trim()} onClick={() => submit(draft)}>
                Compare with mark scheme
              </button>
            </div>
          )}
          {submitted && !result?.selfMarked && (
            <div className={s.explain}>
              <h4>Tick each point you made</h4>
              <p className={s.note} style={{ margin: 0 }}>
                Be honest: an examiner only gives the mark if the idea is clearly there.
              </p>
              <div className={s.checks}>
                {part.markScheme.map((m, i) => {
                  const on = ticks.includes(i);
                  return (
                    <label key={i} className={`${s.check} ${on ? s.checkOn : ""}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => setTicks((t) => (on ? t.filter((x) => x !== i) : [...t, i]))}
                      />
                      <span>
                        <Rich text={m} />
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className={s.row}>
                <button
                  type="button"
                  className={s.btn}
                  onClick={() =>
                    onChange({ ...result!, ticks, selfMarked: true, score: Math.min(ticks.length, part.marks) })
                  }
                >
                  Save my mark ({Math.min(ticks.length, part.marks)}/{part.marks})
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {done && result && (
        <>
          <div className={s.row}>
            <Verdict part={part} result={result} />
          </div>
          <Feedback part={part} result={result} />
        </>
      )}
    </div>
  );
}

export default function ExamPractice({
  questions,
  answers,
  setAnswer,
  index,
  setIndex,
  retrying,
  onExitRetry,
  onFinish,
}: {
  questions: Question[];
  answers: Answers;
  setAnswer: (key: string, r: PartResult) => void;
  index: number;
  setIndex: (i: number) => void;
  retrying: boolean;
  onExitRetry: () => void;
  onFinish: () => void;
}) {
  if (questions.length === 0) {
    return (
      <div className={`${s.card} ${s.empty}`}>
        <div className={s.emptyIcon}>✏️</div>
        <p>Exam questions for this section are on their way.</p>
      </div>
    );
  }
  const i = Math.min(index, questions.length - 1);
  const q = questions[i];
  const qDone = (qq: Question) => qq.parts.every((p, k) => isDone(p, answers[partKey(qq, k)]));
  const allDone = questions.every(qDone);
  const marks = q.parts.reduce((a, p) => a + p.marks, 0);

  const go = (n: number) => {
    setIndex(n);
    const anchor = document.getElementById("extra-practice");
    if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {retrying && (
        <div className={s.keyIdea} style={{ marginTop: 0, alignItems: "center" }}>
          <p style={{ flex: 1 }}>Retrying the ones you dropped marks on.</p>
          <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSmall}`} onClick={onExitRetry}>
            Show all
          </button>
        </div>
      )}
      <div className={s.qNav} style={{ marginTop: 16 }}>
        <div className={s.qDots} role="tablist" aria-label="Questions">
          {questions.map((qq, k) => (
            <button
              key={qq.id}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`Question ${k + 1}${qDone(qq) ? ", done" : ""}`}
              className={`${s.qDot} ${k === i ? s.qDotCurrent : ""} ${qDone(qq) && k !== i ? s.qDotDone : ""}`}
              onClick={() => go(k)}
            >
              {k + 1}
            </button>
          ))}
        </div>
      </div>

      <section className={s.card} key={q.id}>
        <div className={s.cardTop}>
          <span className={`${s.pill} ${s.pillTopic}`}>
            Q{i + 1} of {questions.length}
          </span>
          <span className={s.pill}>{q.style}</span>
          <span className={s.marks} title={`Difficulty ${q.difficulty} of 3`} style={{ color: "var(--topic)" }}>
            {STARS[q.difficulty]}
          </span>
          <span className={s.spacer} />
          <span className={s.marks}>
            [{marks} mark{marks === 1 ? "" : "s"}]
          </span>
        </div>
        <h2 className={s.h2}>{q.title}</h2>
        {q.origin && (
          <div className={s.originRow}>
            <OriginBadge origin={q.origin} />
          </div>
        )}
        {q.basedOn && (
          <p className={s.basedOn}>
            {q.basedOn}. Same skills, new numbers: sit the real one afterwards.
          </p>
        )}
        {q.stem && (
          <p style={{ color: "var(--ink)" }}>
            <Rich text={q.stem} />
          </p>
        )}
        {q.figure && <Figure figure={q.figure} />}
        {q.table && <DataTable table={q.table} />}
        {q.parts.map((p, k) => (
          <Part key={partKey(q, k)} part={p} result={answers[partKey(q, k)]} onChange={(r) => setAnswer(partKey(q, k), r)} />
        ))}
      </section>

      <div className={s.row}>
        <button type="button" className={`${s.btn} ${s.btnGhost}`} disabled={i === 0} onClick={() => go(i - 1)}>
          ‹ Previous
        </button>
        <span className={s.spacer} />
        {i < questions.length - 1 ? (
          <button type="button" className={s.btn} onClick={() => go(i + 1)}>
            {qDone(q) ? "Next question ›" : "Skip ›"}
          </button>
        ) : (
          <button type="button" className={s.btn} onClick={onFinish}>
            {allDone ? "See review ›" : "Finish & review ›"}
          </button>
        )}
      </div>
    </div>
  );
}
