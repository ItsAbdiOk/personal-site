"use client";

import { type MouseEvent, useMemo, useState } from "react";
import type { Block, Definition, Subchapter } from "@/lib/zakiya/types";
import Figure from "./Figure";
import { blockRichFields } from "@/lib/zakiya/rich";
import { ExplainScope, Rich } from "./Rich";
import OriginBadge from "./OriginBadge";
import SourceTag, { SOURCE_LABEL } from "./SourceTag";
import s from "./zakiya.module.css";

function Worked({ block, at }: { block: Extract<Block, { type: "worked" }>; at: string }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const done = shown >= block.steps.length;
  return (
    <div className={s.worked}>
      <button type="button" className={s.workedHead} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className={s.workedTitle}>
          <span className={s.workedTags}>
            <span className={`${s.pill} ${s.pillTopic}`}>Worked example</span>
            <OriginBadge origin={block.origin} />
          </span>
          <span>{block.title}</span>
        </span>
        <span className={`${s.chev} ${open ? s.chevOpen : ""}`} aria-hidden>
          ›
        </span>
      </button>
      {open && (
        <div className={s.workedBody}>
          <p style={{ color: "var(--ink)" }}>
            <Rich text={block.question} loc={`${at}question`} />
          </p>
          {shown > 0 && (
            <ol className={s.steps}>
              {block.steps.slice(0, shown).map((st, i) => (
                <li key={i} className={s.step}>
                  <Rich text={st} loc={`${at}steps.${i}`} />
                </li>
              ))}
            </ol>
          )}
          {done ? (
            <>
              <div className={s.answerBox}>
                <b>Answer: </b>
                <Rich text={block.answer} loc={`${at}answer`} />
              </div>
              <div className={s.row}>
                <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSmall}`} onClick={() => setShown(0)}>
                  Hide steps
                </button>
              </div>
            </>
          ) : (
            <div className={s.row}>
              <button type="button" className={`${s.btn} ${s.btnSmall}`} onClick={() => setShown((n) => n + 1)}>
                {shown === 0 ? "Show step 1" : `Next step (${shown + 1} of ${block.steps.length})`}
              </button>
              <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSmall}`} onClick={() => setShown(block.steps.length)}>
                Show all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** `at` = "<sectionId>:<blockIndex>:"; each Rich's loc = at + its path in blockRichFields(). */
function BlockView({ block, at }: { block: Block; at: string }) {
  switch (block.type) {
    case "text":
      return (
        <p>
          <Rich text={block.body} loc={`${at}body`} />
        </p>
      );
    case "list":
      return (
        <ul className={s.list}>
          {block.items.map((it, i) => (
            <li key={i}>
              <Rich text={it} loc={`${at}items.${i}`} />
            </li>
          ))}
        </ul>
      );
    case "equation":
      return (
        <div className={s.equation}>
          <div className={s.eqLine}>
            <span className={s.eqText}>{block.latexless}</span>
            <span className={`${s.pill} ${block.dataSheet ? s.badgeSheet : s.badgeLearn}`}>
              {block.dataSheet ? "On data sheet" : "Learn this"}
            </span>
          </div>
          {block.words && (
            <p className={s.eqWords}>
              <span className={s.eqLayerLabel}>In words</span>
              <Rich text={block.words} loc={`${at}words`} />
            </p>
          )}
          {block.general && (
            <div className={s.eqGeneral}>
              <span className={s.eqLayerLabel}>General form (data sheet)</span>
              <span className={s.eqGeneralText}>{block.general}</span>
            </div>
          )}
          {block.note && (
            <p className={s.eqNote}>
              <Rich text={block.note} loc={`${at}note`} />
            </p>
          )}
        </div>
      );
    case "analogy":
      return (
        <div className={s.analogy}>
          <span className={s.analogyIcon} aria-hidden>
            {block.icon}
          </span>
          <p>
            <Rich text={block.body} loc={`${at}body`} />
          </p>
        </div>
      );
    case "figure":
      return <Figure figure={block.figure} />;
    case "lead":
      return (
        <p className={s.lead}>
          <span className={s.leadLabel}>
            Where this is going <span aria-hidden>→</span>
          </span>
          <Rich text={block.body} loc={`${at}body`} />
        </p>
      );
    case "warning":
      return (
        <div className={s.warning} role="note">
          <span className={s.analogyIcon} aria-hidden>
            ⚠️
          </span>
          <p>
            <span className={s.warningLabel}>Exam trap</span>
            <Rich text={block.body} loc={`${at}body`} />
          </p>
        </div>
      );
    case "worked":
      return <Worked block={block} at={at} />;
    case "sayIt":
      return (
        <div className={s.sayIt} role="note">
          <span className={s.sayItLabel}>Say it like this</span>
          <ul className={s.sayList}>
            {block.say.map((t, i) => (
              <li key={i} className={s.sayYes}>
                <span className={s.sayMark} aria-label="Credited">
                  ✓
                </span>
                <span>
                  <Rich text={t} loc={`${at}say.${i}`} />
                </span>
              </li>
            ))}
            {block.reject?.map((t, i) => (
              <li key={`r${i}`} className={s.sayNo}>
                <span className={s.sayMark} aria-label="Rejected">
                  ✗
                </span>
                <span>
                  <Rich text={t} loc={`${at}reject.${i}`} />
                </span>
              </li>
            ))}
          </ul>
          <span className={s.calloutCite}>Mark scheme: {block.source}</span>
        </div>
      );
    case "examiners":
      return (
        <figure className={s.examiners}>
          <span className={s.examinersLabel}>Examiners say</span>
          <blockquote className={s.examinersBody}>
            <Rich text={block.body} loc={`${at}body`} />
          </blockquote>
          <figcaption className={s.calloutCite}>Examiners&apos; report, {block.cite}</figcaption>
        </figure>
      );
    case "tip":
      return (
        <div className={s.tip} role="note">
          <span className={s.analogyIcon} aria-hidden>
            💡
          </span>
          <p>
            <span className={s.tipLabel}>
              Exam tip <span className={s.tipSub}>· our advice</span>
            </span>
            <Rich text={block.body} loc={`${at}body`} />
          </p>
        </div>
      );
    default:
      return null;
  }
}

function DefinitionView({ d }: { d: Definition }) {
  const both = d.spec && d.textbook && d.spec.trim() !== d.textbook.trim();
  return (
    <div className={s.def} id={`def-${d.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
      <div className={s.defHead}>
        <h3 className={s.h3} style={{ margin: 0 }}>
          {d.term}
        </h3>
        <SourceTag source={d.source} />
      </div>
      <p style={{ margin: 0 }}>
        <Rich text={d.plain} />
      </p>
      {both ? (
        <div className={s.wordings}>
          <div className={s.wording}>
            <span className={s.wordingLabel}>Spec / mark scheme</span>
            {d.spec}
          </div>
          <div className={s.wording}>
            <span className={s.wordingLabel}>Textbook</span>
            {d.textbook}
          </div>
        </div>
      ) : (
        (d.spec || d.textbook) && (
          <div className={s.wordings} style={{ gridTemplateColumns: "1fr" }}>
            <div className={s.wording}>
              <span className={s.wordingLabel}>{d.spec ? "Spec / mark scheme wording" : "Textbook wording"}</span>
              {d.spec ?? d.textbook}
            </div>
          </div>
        )
      )}
      {d.differenceNote && (
        <div className={s.diffNote}>
          <b>What&apos;s different: </b>
          <Rich text={d.differenceNote} />
        </div>
      )}
    </div>
  );
}

/** Smooth-scroll to a section without touching the URL hash (the hash holds the current tab).
 *  The sticky header offset comes from scroll-margin-top in CSS. */
function jumpTo(e: MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export default function Notes({ sub }: { sub: Subchapter }) {
  // Every Rich string in the sections, in document order, so each {{key}}'s first mention wins.
  const entries = useMemo(
    () =>
      sub.sections.flatMap((sec) =>
        sec.blocks.flatMap((b, bi) => blockRichFields(b).map(([path, text]): [string, string] => [`${sec.id}:${bi}:${path}`, text])),
      ),
    [sub.sections],
  );
  const total = sub.sections.length;
  return (
    <ExplainScope entries={entries}>
    <div>
      {total > 1 && (
        <nav id="notes-index" className={`${s.card} ${s.toc} ${s.notesSection}`} aria-labelledby="notes-index-h">
          <div className={s.eyebrow}>In this section</div>
          <h2 id="notes-index-h" className={s.h2}>
            Index
          </h2>
          <ol className={s.tocList}>
            {sub.sections.map((sec, i) => (
              <li key={sec.id}>
                <a href={`#${sec.id}`} className={s.tocLink} onClick={(e) => jumpTo(e, sec.id)}>
                  <span className={s.tocNum}>{i + 1}</span>
                  <span className={s.tocText}>
                    <span className={s.tocHeading}>{sec.heading}</span>
                    <span className={s.tocSrc}>{SOURCE_LABEL[sec.source]}</span>
                  </span>
                </a>
              </li>
            ))}
            {sub.definitions.length > 0 && (
              <li>
                <a href="#definitions" className={s.tocLink} onClick={(e) => jumpTo(e, "definitions")}>
                  <span className={s.tocNum}>★</span>
                  <span className={s.tocText}>
                    <span className={s.tocHeading}>Key definitions</span>
                  </span>
                </a>
              </li>
            )}
          </ol>
        </nav>
      )}
      {sub.sections.map((sec, idx) => (
        <section key={sec.id} id={sec.id} className={`${s.card} ${s.notesSection}`}>
          <div className={s.partEyebrow}>
            Part {idx + 1} of {total}
          </div>
          <h2 className={`${s.h2} ${s.sectionHeading}`}>{sec.heading}</h2>
          <div className={s.cardTop}>
            {sec.specRef && <span className={`${s.pill} ${s.pillTopic} ${s.specPill}`}>Spec {sec.specRef}</span>}
            <SourceTag source={sec.source} />
          </div>
          {sec.blocks.map((b, i) => (
            <BlockView key={i} block={b} at={`${sec.id}:${i}:`} />
          ))}
          {total > 1 && (
            <a href="#notes-index" className={s.backToIndex} onClick={(e) => jumpTo(e, "notes-index")}>
              ↑ Back to index
            </a>
          )}
        </section>
      ))}
      {sub.definitions.length > 0 && (
        <section id="definitions" className={`${s.card} ${s.notesSection}`}>
          <div className={s.cardTop}>
            <span className={`${s.pill} ${s.pillTopic}`}>Key definitions</span>
          </div>
          <h2 className={s.h2}>Words that earn marks</h2>
          {sub.definitions.map((d) => (
            <DefinitionView key={d.term} d={d} />
          ))}
        </section>
      )}
      {sub.sections.length === 0 && sub.definitions.length === 0 && (
        <div className={`${s.card} ${s.empty}`}>
          <div className={s.emptyIcon}>📝</div>
          <p>Notes for this section are on their way.</p>
        </div>
      )}
    </div>
    </ExplainScope>
  );
}
