"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Subchapter } from "@/lib/zakiya/types";
import { type Answers, type PartResult, isDone, isWrong, partKey } from "./exam";
import ExamPractice from "./ExamPractice";
import Flashcards from "./Flashcards";
import Header from "./Header";
import Notes from "./Notes";
import PastPapers from "./PastPapers";
import Review from "./Review";
import { GlossaryProvider, Rich } from "./Rich";
import { load, save } from "./storage";
import s from "./zakiya.module.css";

const TABS = [
  { id: "notes", label: "Notes" },
  { id: "flashcards", label: "Flashcards" },
  { id: "exam", label: "Exam practice", short: "Exam" },
  { id: "review", label: "Review" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function SubchapterView({ sub }: { sub: Subchapter }) {
  const [tab, setTabState] = useState<TabId>("notes");
  const [answers, setAnswers] = useState<Answers>({});
  const [qIndex, setQIndex] = useState(0);
  const [retryIds, setRetryIds] = useState<string[] | null>(null);
  const examKey = `zakiya:exam:${sub.slug}`;

  // Restore tab from the URL hash and answers from localStorage (client only).
  useEffect(() => {
    const h = decodeURIComponent(window.location.hash.slice(1));
    if (TABS.some((t) => t.id === h)) setTabState(h as TabId);
    setAnswers(load<Answers>(examKey, {}));
  }, [examKey]);

  // Deep link to a Notes section (#section-id, e.g. "Go to source" from My Notes): open the Notes
  // tab and land on that section under the sticky header (scroll-margin-top), with a brief glow.
  useEffect(() => {
    const go = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (!h || TABS.some((t) => t.id === h)) return;
      if (h !== "definitions" && !sub.sections.some((x) => x.id === h)) return;
      setTabState("notes");
      const timers: number[] = [];
      const land = (glow: boolean) => {
        const el = document.getElementById(h);
        if (!el) return;
        el.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
        if (glow) {
          el.classList.remove(s.arrived);
          void el.offsetWidth;
          el.classList.add(s.arrived);
        }
      };
      // Twice: once when the tab renders, again after figures/sims settle their height.
      timers.push(window.setTimeout(() => land(true), 30), window.setTimeout(() => land(false), 400));
      return () => timers.forEach((t) => window.clearTimeout(t));
    };
    const cleanup = go();
    window.addEventListener("hashchange", go);
    return () => {
      cleanup?.();
      window.removeEventListener("hashchange", go);
    };
  }, [sub.sections]);

  const setTab = useCallback((t: TabId) => {
    setTabState(t);
    try {
      window.history.replaceState(null, "", `#${t}`);
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0 });
  }, []);

  const setAnswer = useCallback(
    (key: string, r: PartResult) =>
      setAnswers((a) => {
        const next = { ...a, [key]: r };
        save(examKey, next);
        return next;
      }),
    [examKey],
  );

  const examQuestions = useMemo(
    () => (retryIds ? sub.questions.filter((q) => retryIds.includes(q.id)) : sub.questions),
    [retryIds, sub.questions],
  );

  const retryWrong = () => {
    const ids: string[] = [];
    const next = { ...answers };
    sub.questions.forEach((q) =>
      q.parts.forEach((p, k) => {
        if (isWrong(p, answers[partKey(q, k)])) {
          delete next[partKey(q, k)];
          if (!ids.includes(q.id)) ids.push(q.id);
        }
      }),
    );
    setAnswers(next);
    save(examKey, next);
    setRetryIds(ids);
    setQIndex(0);
    setTab("exam");
  };

  const startOver = () => {
    setAnswers({});
    save(examKey, {});
    setRetryIds(null);
    setQIndex(0);
    setTab("exam");
  };

  const partsAll = sub.questions.reduce((a, q) => a + q.parts.length, 0);
  const partsDone = sub.questions.reduce(
    (a, q) => a + q.parts.filter((p, k) => isDone(p, answers[partKey(q, k)])).length,
    0,
  );

  return (
    <div className={s.root} style={{ ["--topic" as string]: sub.colour }}>
      <GlossaryProvider definitions={sub.definitions} explain={sub.explain}>
        <Header
          crumbs={[
            { label: "Zakiya", href: "/zakiya" },
            { label: `Module ${sub.module}`, href: "/zakiya" },
            { label: sub.number },
          ]}
        >
          <div className={s.tabs} role="tablist" aria-label="Study steps">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls="zakiya-panel"
                className={s.tab}
                onPointerDown={(e) => e.button === 0 && setTab(t.id)}
                onClick={() => tab !== t.id && setTab(t.id)}
              >
                {"short" in t ? (
                  <>
                    <span className={s.tabLong}>{t.label}</span>
                    <span className={s.tabShort}>{t.short}</span>
                  </>
                ) : (
                  t.label
                )}
                {t.id === "exam" && partsAll > 0 && partsDone > 0 && (
                  <span className={s.tabCount}>
                    {partsDone}/{partsAll}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Header>

        <main className={s.page} style={{ animation: "none" }}>
          {tab === "notes" && (
            <div>
              <div className={s.eyebrow}>
                Module {sub.module} · Chapter {sub.chapter.number} {sub.chapter.title}
              </div>
              <h1 className={s.h1}>
                <span style={{ color: "var(--topic)" }}>{sub.number}</span> {sub.title}
              </h1>
              {sub.summary && (
                <p className={s.lede}>
                  <Rich text={sub.summary} />
                </p>
              )}
              {sub.keyIdea && (
                <div className={s.keyIdea}>
                  <span className={s.keyIdeaLabel}>Key idea</span>
                  <p>
                    <Rich text={sub.keyIdea} />
                  </p>
                </div>
              )}
              <div className={s.meta}>
                {sub.specRefs.map((r) => (
                  <span key={r} className={s.chip}>
                    Spec {r}
                  </span>
                ))}
                {sub.textbookPages && <span className={s.chip}>Textbook pp. {sub.textbookPages}</span>}
              </div>
            </div>
          )}

          <div id="zakiya-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className={s.tabPanel} key={tab}>
            {tab === "notes" && (
              <>
                <Notes sub={sub} />
                <div className={s.row} style={{ justifyContent: "flex-end" }}>
                  <button type="button" className={s.btn} onClick={() => setTab("flashcards")}>
                    Next: Flashcards ›
                  </button>
                </div>
              </>
            )}
            {tab === "flashcards" && (
              <>
                <Flashcards sub={sub} />
                <div className={s.row} style={{ justifyContent: "flex-end" }}>
                  <button type="button" className={s.btn} onClick={() => setTab("exam")}>
                    Next: Exam practice ›
                  </button>
                </div>
              </>
            )}
            {tab === "exam" && !retryIds && sub.pastPapers && sub.pastPapers.length > 0 && (
              <PastPapers slug={sub.slug} items={sub.pastPapers} />
            )}
            {tab === "exam" && (
              <div id="extra-practice" className={s.extraPractice}>
                {sub.questions.length > 0 && (
                  <div className={s.extraHead}>
                    <div className={s.eyebrow}>After the real ones</div>
                    <h2 className={s.h2}>Extra practice (made for this guide)</h2>
                    <p className={s.note} style={{ margin: 0 }}>
                      Our own questions, modelled on real OCR ones and double-checked. These are scored and feed the Review tab.
                    </p>
                  </div>
                )}
                <ExamPractice
                  questions={examQuestions}
                  answers={answers}
                  setAnswer={setAnswer}
                  index={qIndex}
                  setIndex={setQIndex}
                  retrying={!!retryIds}
                  onExitRetry={() => {
                    setRetryIds(null);
                    setQIndex(0);
                  }}
                  onFinish={() => setTab("review")}
                />
              </div>
            )}
            {tab === "review" && (
              <Review
                questions={sub.questions}
                answers={answers}
                onRetryWrong={retryWrong}
                onStartOver={startOver}
                onGoExam={() => {
                  setRetryIds(null);
                  setTab("exam");
                }}
              />
            )}
          </div>
        </main>
      </GlossaryProvider>
    </div>
  );
}
