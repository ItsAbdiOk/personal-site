"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Flashcard, Subchapter } from "@/lib/zakiya/types";
import { ankiHref } from "@/lib/zakiya/anki";
import { Rich } from "./Rich";
import SourceTag from "./SourceTag";
import { load, save } from "./storage";
import s from "./zakiya.module.css";

type Grade = "again" | "good" | "easy";
type Progress = Record<string, { grade: Grade; at: number }>;

const TAG_LABEL: Record<Flashcard["tag"], string> = {
  definition: "Definition",
  equation: "Equation",
  concept: "Concept",
  practical: "Practical",
};

/** Cards she found hardest last time come first; "easy" ones go to the back. */
function initialQueue(cards: Flashcard[], progress: Progress): string[] {
  const rank = (id: string) => ({ again: 0, good: 2, easy: 3 })[progress[id]?.grade as Grade] ?? 1;
  return cards
    .map((c, i) => ({ id: c.id, r: rank(c.id), i }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.id);
}

export default function Flashcards({ sub }: { sub: Subchapter }) {
  const storeKey = `zakiya:cards:${sub.slug}`;
  const byId = useMemo(() => new Map(sub.flashcards.map((c) => [c.id, c])), [sub.flashcards]);
  const [progress, setProgress] = useState<Progress>({});
  const [queue, setQueue] = useState<string[]>(() => sub.flashcards.map((c) => c.id));
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const p = load<Progress>(storeKey, {});
    setProgress(p);
    setQueue(initialQueue(sub.flashcards, p));
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [storeKey, sub.flashcards]);

  const total = sub.flashcards.length;
  const current = queue.length ? byId.get(queue[0]) : undefined;
  const known = sub.flashcards.filter((c) => progress[c.id] && progress[c.id].grade !== "again").length;
  const doneThisSession = total - new Set(queue).size;

  const grade = useCallback(
    (g: Grade) => {
      if (!current) return;
      const next = { ...progress, [current.id]: { grade: g, at: Date.now() } };
      setProgress(next);
      save(storeKey, next);
      setQueue((q) => (g === "again" ? [...q.slice(1), q[0]] : q.slice(1)));
      setFlipped(false);
      setReviewed((n) => n + 1);
    },
    [current, progress, storeKey],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, a, button:not([role=tab])")) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && (e.key === "1" || e.key === "2" || e.key === "3")) {
        grade(e.key === "1" ? "again" : e.key === "2" ? "good" : "easy");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, grade]);

  const restart = () => {
    setQueue(initialQueue(sub.flashcards, progress));
    setFlipped(false);
    setReviewed(0);
  };

  if (total === 0) {
    return (
      <div className={`${s.card} ${s.empty}`}>
        <div className={s.emptyIcon}>🗂️</div>
        <p>Flashcards for this section are on their way.</p>
      </div>
    );
  }

  return (
    <div>
      <section className={s.card}>
        <div className={s.cardTop}>
          <span className={`${s.pill} ${s.pillTopic}`}>Flashcards</span>
          <span className={s.marks}>
            {doneThisSession} of {total} done · {known} known overall
          </span>
        </div>
        <div className={s.progressBar} aria-hidden>
          <div className={s.progressFill} style={{ width: `${(doneThisSession / total) * 100}%` }} />
        </div>

        {current ? (
          <>
            <div className={s.flashWrap}>
              <div
                className={`${s.flash} ${flipped ? s.flashFlipped : ""} ${reduced ? s.flashReduced : ""}`}
                role="button"
                tabIndex={0}
                aria-pressed={flipped}
                aria-label={flipped ? "Showing answer. Tap to see the question." : "Showing question. Tap to reveal the answer."}
                onClick={() => setFlipped((f) => !f)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    setFlipped((f) => !f);
                  }
                }}
              >
                <div className={`${s.face} ${s.faceFront}`} aria-hidden={flipped}>
                  <div className={s.cardTop} style={{ marginBottom: 12 }}>
                    <span className={s.pill}>{TAG_LABEL[current.tag]}</span>
                    {current.source !== "both" && <SourceTag source={current.source} />}
                  </div>
                  <div className={s.faceQ}>
                    <Rich text={current.front} />
                  </div>
                  <div className={s.faceHint}>Tap or press space to flip</div>
                </div>
                <div className={`${s.face} ${s.faceBack}`} aria-hidden={!flipped}>
                  <div className={s.faceA}>
                    <Rich text={current.back} />
                  </div>
                  <div className={s.faceHint}>How well did you know it?</div>
                </div>
              </div>
            </div>
            <div className={s.grade}>
              <button type="button" className={`${s.btn} ${s.gradeAgain}`} disabled={!flipped} onClick={() => grade("again")}>
                Again
              </button>
              <button type="button" className={`${s.btn} ${s.gradeGood}`} disabled={!flipped} onClick={() => grade("good")}>
                Good
              </button>
              <button type="button" className={`${s.btn} ${s.gradeEasy}`} disabled={!flipped} onClick={() => grade("easy")}>
                Easy
              </button>
            </div>
            <p className={s.note} style={{ marginTop: 10, textAlign: "center" }}>
              “Again” puts the card back at the end of this round. Keys: space flips, 1 / 2 / 3 grade.
            </p>
          </>
        ) : (
          <div className={s.empty}>
            <div className={s.emptyIcon}>🎉</div>
            <h3 className={s.h3}>Round complete</h3>
            <p>
              You went through all {total} cards ({reviewed} flips including repeats).
            </p>
            <button type="button" className={s.btn} onClick={restart}>
              Go again
            </button>
          </div>
        )}
      </section>

      <section className={s.card}>
        <h3 className={s.h3}>Study these in Anki</h3>
        <p>Downloads this module's deck, including these {total} cards.</p>
        <div className={s.row}>
          <a className={`${s.btn} ${s.btnTint}`} href={ankiHref(sub.module)} download>
            Add to Anki (amgi)
          </a>
        </div>
        <p className={s.note} style={{ marginTop: 8 }}>
          Opens on iPhone → choose amgi. Re-download after updates; your progress is kept.
        </p>
      </section>
    </div>
  );
}
