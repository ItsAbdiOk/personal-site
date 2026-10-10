"use client";

import { type MouseEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Block, Definition, Subchapter } from "@/lib/zakiya/types";
import Figure from "./Figure";
import { blockRichFields } from "@/lib/zakiya/rich";
import { ExplainScope, Rich } from "./Rich";
import OriginBadge from "./OriginBadge";
import SourceTag, { SOURCE_LABEL } from "./SourceTag";
import { DEFS, blockKey, blockText, definitionText, saveBlocks, saveHighlight, useSaved } from "./saved";
import { Toast, useToast } from "./Toast";
import BookmarkIcon from "./BookmarkIcon";
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
export function BlockView({ block, at }: { block: Block; at: string }) {
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

export function DefinitionView({ d }: { d: Definition }) {
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

/** One block in the Notes. In select mode a tick circle appears and a full-size hit target sits
 *  over the block, so a tap anywhere toggles it and never reaches the block's own controls. */
function Selectable({
  k,
  label,
  selecting,
  on,
  saved,
  toggle,
  children,
}: {
  k: string;
  label: string;
  selecting: boolean;
  on: boolean;
  saved: boolean;
  toggle: (k: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`${s.sel} ${selecting ? s.selMode : ""} ${on ? s.selOn : ""}`} data-zk-block={k}>
      {selecting && (
        <span className={s.selCircle} aria-hidden>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      {!selecting && saved && (
        <span className={s.savedMark} title="Saved to My Notes" role="img" aria-label="Saved to My Notes">
          <BookmarkIcon />
        </span>
      )}
      <div className={s.selBody}>{children}</div>
      {selecting && (
        <button
          type="button"
          className={s.selHit}
          aria-pressed={on}
          aria-label={`Select: ${label.slice(0, 90)}`}
          onClick={() => toggle(k)}
        />
      )}
    </div>
  );
}

type HL = { key: string; text: string };

/** "Save highlight" pill for a text selection inside a notes block. Above the selection with a
 *  mouse; below it on touch, so it clears the iOS callout (which sits above) and the end handle. */
function HighlightPill({ rootRef, disabled, onSave }: { rootRef: React.RefObject<HTMLElement>; disabled: boolean; onSave: (h: HL) => void }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const info = useRef<HL | null>(null);

  useEffect(() => {
    if (disabled) {
      setPos(null);
      return;
    }
    let hideTimer = 0;
    let showTimer = 0;
    const hide = () => {
      window.clearTimeout(hideTimer);
      // Short grace period: on iPad the selection can clear as the pill is tapped.
      hideTimer = window.setTimeout(() => {
        info.current = null;
        setPos(null);
      }, 350);
    };
    const measure = () => {
      const sel = document.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return hide();
      const range = sel.getRangeAt(0);
      const text = sel.toString().replace(/\s+/g, " ").trim();
      const node = range.startContainer;
      const el = (node.nodeType === 1 ? node : node.parentElement) as Element | null;
      const block = el?.closest("[data-zk-block]");
      if (text.length < 2 || !block || !rootRef.current?.contains(block)) return hide();
      const rects = range.getClientRects();
      const r = range.getBoundingClientRect();
      if (!r.width && !r.height) return hide();
      window.clearTimeout(hideTimer);
      info.current = { key: block.getAttribute("data-zk-block") ?? "", text: text.slice(0, 1200) };
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const headerBottom = document.querySelector(`.${s.header}`)?.getBoundingClientRect().bottom ?? 0;
      const last = rects[rects.length - 1] ?? r;
      const vw = window.innerWidth;
      const x = Math.max(80, Math.min(coarse ? last.left + last.width / 2 : r.left + r.width / 2, vw - 80));
      let y = coarse ? last.bottom + 30 : r.top - 46;
      if (!coarse && y < headerBottom + 8) y = r.bottom + 10;
      y = Math.max(headerBottom + 8, Math.min(y, window.innerHeight - 56));
      setPos({ x, y });
    };
    // Wait for the selection to settle (mouse drag / iPad handle drag) before showing the pill.
    const update = () => {
      window.clearTimeout(showTimer);
      showTimer = window.setTimeout(measure, 160);
    };
    const onScroll = () => {
      if (info.current) measure();
    };
    document.addEventListener("selectionchange", update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(showTimer);
      document.removeEventListener("selectionchange", update);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [disabled, rootRef]);

  if (!pos) return null;
  const commit = () => {
    const h = info.current;
    if (!h) return;
    info.current = null;
    setPos(null);
    try {
      document.getSelection()?.removeAllRanges();
    } catch {
      /* ignore */
    }
    onSave(h);
  };
  return (
    <button
      type="button"
      className={s.hlPill}
      style={{ left: pos.x, top: pos.y }}
      // Act on press: keeps the selection alive on desktop, and beats iPad clearing it on tap.
      onPointerDown={(e) => {
        e.preventDefault();
        commit();
      }}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.detail === 0 && commit()}
    >
      <BookmarkIcon size={10} /> Save highlight
    </button>
  );
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

  const saved = useSaved();
  const savedKeys = useMemo(
    () => new Set(saved.filter((i) => i.kind === "block" && i.slug === sub.slug).map((i) => blockKey(i.sectionId, i.blockIndex))),
    [saved, sub.slug],
  );
  const [selecting, setSelecting] = useState(false);
  const [sel, setSel] = useState<Set<string>>(() => new Set());
  const [hdr, setHdr] = useState(104);
  const rootRef = useRef<HTMLDivElement>(null);
  const { msg, show, hide } = useToast();

  // Sticky "Select" sits just under the sticky header, whatever its height.
  useEffect(() => {
    const h = document.querySelector(`.${s.header}`);
    if (!h) return;
    const ro = new ResizeObserver(() => setHdr(h.getBoundingClientRect().height));
    ro.observe(h);
    return () => ro.disconnect();
  }, []);

  const toggle = useCallback(
    (k: string) =>
      setSel((cur) => {
        const next = new Set(cur);
        if (next.has(k)) next.delete(k);
        else next.add(k);
        return next;
      }),
    [],
  );

  // Entering/leaving select mode reflows every block (room for the tick circles). Keep the block
  // she's looking at in the same place on screen.
  const anchor = useRef<{ el: Element; top: number } | null>(null);
  const pinView = useCallback(() => {
    const blocks = rootRef.current?.querySelectorAll("[data-zk-block]") ?? [];
    const top = (document.querySelector(`.${s.header}`)?.getBoundingClientRect().bottom ?? 0) + 8;
    for (const el of Array.from(blocks)) {
      const r = el.getBoundingClientRect();
      if (r.bottom > top) {
        anchor.current = { el, top: r.top };
        return;
      }
    }
  }, []);
  useLayoutEffect(() => {
    const a = anchor.current;
    anchor.current = null;
    if (a && a.el.isConnected) window.scrollBy({ top: a.el.getBoundingClientRect().top - a.top, behavior: "instant" as ScrollBehavior });
  }, [selecting]);

  const exitSelect = useCallback(() => {
    pinView();
    setSelecting(false);
    setSel(new Set());
  }, [pinView]);

  useEffect(() => {
    if (!selecting) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && exitSelect();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selecting, exitSelect]);

  const startSelect = () => {
    try {
      document.getSelection()?.removeAllRanges();
    } catch {
      /* ignore */
    }
    pinView();
    setSelecting(true);
  };

  // Keep document order, so My Notes lists them the way they read.
  const order = useMemo(
    () => [
      ...sub.sections.flatMap((sec) => sec.blocks.map((_, i) => blockKey(sec.id, i))),
      ...sub.definitions.map((_, i) => blockKey(DEFS, i)),
    ],
    [sub.sections, sub.definitions],
  );

  const doSave = () => {
    const keys = order.filter((k) => sel.has(k));
    const n = saveBlocks(sub, keys);
    exitSelect();
    show({
      text: n > 0 ? `Saved ${n} to My Notes` : "Already in My Notes",
      action: { label: "Open", href: "/zakiya/notes" },
    });
  };

  const onHighlight = useCallback(
    (h: HL) => {
      const i = h.key.lastIndexOf(":");
      saveHighlight(sub, h.key.slice(0, i), Number(h.key.slice(i + 1)), h.text);
      show({ text: "Highlight saved to My Notes", action: { label: "Open", href: "/zakiya/notes" } });
    },
    [sub, show],
  );

  const partKeys = (secId: string, n: number) => Array.from({ length: n }, (_, i) => blockKey(secId, i));
  const toggleAll = (keys: string[]) =>
    setSel((cur) => {
      const next = new Set(cur);
      const all = keys.every((k) => next.has(k));
      keys.forEach((k) => (all ? next.delete(k) : next.add(k)));
      return next;
    });
  const selectAll = (keys: string[]) =>
    selecting && keys.length > 0 ? (
      <button type="button" className={s.selAll} onClick={() => toggleAll(keys)}>
        {keys.every((k) => sel.has(k)) ? "Deselect all" : "Select all in this part"}
      </button>
    ) : null;

  return (
    <ExplainScope entries={entries}>
    <div ref={rootRef} className={selecting ? s.notesSelecting : undefined}>
      <div className={s.selectBarTop} style={{ top: hdr + 10 }}>
        <button
          type="button"
          className={`${s.selectBtn} ${selecting ? s.selectBtnOn : ""}`}
          aria-pressed={selecting}
          onClick={() => (selecting ? exitSelect() : startSelect())}
        >
          {selecting ? "Cancel" : "Select"}
        </button>
      </div>
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
          <p className={s.selectHint}>
            Struggling with a bit? Tap <b>Select</b> to save parts to My Notes, or highlight any text.
          </p>
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
            {selectAll(partKeys(sec.id, sec.blocks.length))}
          </div>
          {sec.blocks.map((b, i) => {
            const k = blockKey(sec.id, i);
            return (
              <Selectable
                key={i}
                k={k}
                label={blockText(sub, b)}
                selecting={selecting}
                on={sel.has(k)}
                saved={savedKeys.has(k)}
                toggle={toggle}
              >
                <BlockView block={b} at={`${sec.id}:${i}:`} />
              </Selectable>
            );
          })}
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
            {selectAll(partKeys(DEFS, sub.definitions.length))}
          </div>
          <h2 className={s.h2}>Words that earn marks</h2>
          {sub.definitions.map((d, i) => {
            const k = blockKey(DEFS, i);
            return (
              <Selectable
                key={d.term}
                k={k}
                label={definitionText(sub, d)}
                selecting={selecting}
                on={sel.has(k)}
                saved={savedKeys.has(k)}
                toggle={toggle}
              >
                <DefinitionView d={d} />
              </Selectable>
            );
          })}
        </section>
      )}
      {sub.sections.length === 0 && sub.definitions.length === 0 && (
        <div className={`${s.card} ${s.empty}`}>
          <div className={s.emptyIcon}>📝</div>
          <p>Notes for this section are on their way.</p>
        </div>
      )}
      {selecting && (
        <div className={s.selBar} role="toolbar" aria-label="Save selected parts">
          <div className={s.selBarInner}>
            <span className={s.selCount} aria-live="polite">
              {sel.size} selected
            </span>
            <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSmall}`} onClick={exitSelect}>
              Cancel
            </button>
            <button type="button" className={`${s.btn} ${s.btnSmall}`} disabled={sel.size === 0} onClick={doSave}>
              Save to My Notes
            </button>
          </div>
        </div>
      )}
      <HighlightPill rootRef={rootRef} disabled={selecting} onSave={onHighlight} />
      <Toast msg={msg} hide={hide} />
    </div>
    </ExplainScope>
  );
}
