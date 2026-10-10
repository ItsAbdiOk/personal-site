"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type Formula,
  type FormulaSheet as Sheet,
  type FormulaStatus,
  type SolvedExample,
  formulaStatus,
  symbolTex,
} from "@/lib/zakiya/formula-types";
import BookmarkIcon from "./BookmarkIcon";
import Header from "./Header";
import OriginBadge from "./OriginBadge";
import { GlossaryProvider, Rich } from "./Rich";
import { removeItem, saveFormula, useSaved } from "./saved";
import { Tex } from "./Tex";
import { Toast, useToast } from "./Toast";
import f from "./FormulaSheet.module.css";
import s from "./zakiya.module.css";

type Filter = "all" | FormulaStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "data-sheet", label: "On the data sheet" },
  { id: "memorise", label: "Learn by heart" },
  { id: "derived", label: "Derived" },
];

/** One colour per given value, readable on white; the same colour marks its symbol everywhere. */
const PALETTE = ["#0066CC", "#C2410C", "#8E3BB8", "#1E7B34", "#B0306A", "#0E7C86"];

export function givenColours(ex?: SolvedExample): Map<string, string> {
  const m = new Map<string, string>();
  ex?.given.forEach((g) => {
    if (!m.has(g.symbol)) m.set(g.symbol, PALETTE[m.size % PALETTE.length]);
  });
  return m;
}

/** \given{sym}{number} → the number in its symbol's colour. */
function paint(tex: string, colours: Map<string, string>): string {
  return tex.replace(/\\given\{([^}]*)\}\{([^}]*)\}/g, (_, sym: string, num: string) => {
    const c = colours.get(sym);
    return c ? `\\textcolor{${c}}{${num}}` : `{${num}}`;
  });
}

export const formulaText = (x: Formula) => `${x.name}: ${x.equation}`;

/** Big typeset equation (inline KaTeX in display style, so it can wrap and sits inside a button). */
export function FormulaEq({ formula, className }: { formula: Formula; className: string }) {
  return (
    <span className={className}>
      {formula.tex ? <Tex tex={`\\displaystyle ${formula.tex}`} /> : formula.equation}
    </span>
  );
}

function StatusBadge({ x }: { x: Formula }) {
  const st = formulaStatus(x);
  if (st === "data-sheet")
    return (
      <span className={`${f.badge} ${f.badgeSheet}`} title="Printed in the exam's data booklet">
        <span aria-hidden>📄</span> On the data sheet
      </span>
    );
  if (st === "derived")
    return (
      <span className={`${f.badge} ${f.badgeDerived}`} title={`Not printed. Comes from ${x.derivedFrom?.printed}`}>
        Derived from the sheet
      </span>
    );
  return (
    <span className={`${f.badge} ${f.badgeLearn}`} title="Not printed: you need to know it">
      Learn this
    </span>
  );
}

function Example({ ex, colours, onClose }: { ex: SolvedExample; colours: Map<string, string>; onClose: () => void }) {
  return (
    <div className={f.ex}>
      <div className={f.exTop}>
        <span className={s.eyebrow}>Worked example</span>
        <OriginBadge origin={ex.source} />
      </div>
      <h4 className={f.exTitle}>{ex.title}</h4>
      <p className={f.question}>
        <Rich text={ex.question} />
      </p>

      <div className={f.exLabel}>Given</div>
      <ul className={f.given}>
        {ex.given.map((g, i) => (
          <li key={i} className={f.givenItem}>
            <span className={f.givenSym} style={{ color: colours.get(g.symbol) }}>
              <Tex tex={symbolTex({ symbol: g.symbol })} />
            </span>
            <span aria-hidden>=</span>
            <span className={f.givenValue} style={{ color: colours.get(g.symbol) }}>
              {g.value}
            </span>
            <span className={f.givenMeaning}>
              <Rich text={g.meaning} />
            </span>
          </li>
        ))}
      </ul>

      <div className={f.exLabel}>Find</div>
      <p className={f.find}>
        <Rich text={ex.find} />
      </p>

      <div className={f.exLabel}>Working</div>
      <ol className={f.steps}>
        {ex.steps.map((st, i) => (
          <li key={i} className={f.step}>
            <Rich text={st.say} />
            <span className={f.working} aria-label={st.working}>
              {st.tex ? <Tex tex={`\\displaystyle ${paint(st.tex, colours)}`} /> : st.working}
            </span>
            {st.result && <span className={f.result}>{st.result}</span>}
          </li>
        ))}
      </ol>
      <div className={f.answer}>
        <Rich text={ex.answer} />
      </div>
      <div className={f.exActions}>
        {ex.subchapter && (
          <Link href={`/zakiya/${ex.subchapter}`} className={f.linkBtn}>
            See it in the chapter ›
          </Link>
        )}
        <button type="button" className={f.linkBtn} onClick={onClose} style={{ marginLeft: "auto" }}>
          Hide working
        </button>
      </div>
    </div>
  );
}

function FormulaCard({
  x,
  open,
  toggle,
  saved,
  onSave,
  subLabels,
}: {
  x: Formula;
  open: boolean;
  toggle: () => void;
  saved: boolean;
  onSave: () => void;
  subLabels: Record<string, string>;
}) {
  const ex = x.example;
  const colours = useMemo(() => givenColours(ex), [ex]);
  const [mounted, setMounted] = useState(open);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) setMounted(true);
    if (panel.current) (panel.current as HTMLElement & { inert: boolean }).inert = !open;
  }, [open, mounted]);
  const panelId = `fx-${x.id}`;
  const used = (x.subchapters ?? []).filter((slug) => subLabels[slug]);

  const head = (
    <>
      <span className={f.name}>{x.name}</span>
      <FormulaEq formula={x} className={f.eq} />
      <span className={f.words}>
        <Rich text={x.words} />
      </span>
      {ex && (
        <span className={f.hint}>
          {open ? "Hide the worked example" : "See it worked, step by step"}
          <span className={`${f.chev} ${open ? f.chevOpen : ""}`} aria-hidden>
            ›
          </span>
        </span>
      )}
    </>
  );

  return (
    <article id={`f-${x.id}`} className={f.card}>
      <div
        className={`${f.top} ${ex ? f.tappable : ""}`}
        onClick={(e) => {
          // Whole top of the card toggles, except links/buttons inside it or when selecting text.
          if (!ex || (e.target as HTMLElement).closest("a, button, input, textarea")) return;
          if (window.getSelection()?.toString()) return;
          toggle();
        }}
      >
        <div className={f.metaRow}>
          <StatusBadge x={x} />
          <span className={f.spec}>Spec {x.specRef}</span>
          {used.map((slug) => (
            <Link key={slug} href={`/zakiya/${slug}`} className={f.usedIn}>
              Used in {subLabels[slug]} ›
            </Link>
          ))}
          <button
            type="button"
            className={`${f.save} ${saved ? f.saved : ""}`}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${x.name} from My Notes` : `Save ${x.name} to My Notes`}
            onClick={onSave}
          >
            <BookmarkIcon size={11} /> {saved ? "Saved" : "Save"}
          </button>
        </div>

        {ex ? (
          <button type="button" className={f.head} aria-expanded={open} aria-controls={panelId} onClick={toggle}>
            {head}
          </button>
        ) : (
          <div className={f.head}>{head}</div>
        )}

        {x.derivedFrom && (
          <p className={f.derived}>
            <span className={f.derivedLabel}>Not printed. Comes from {x.derivedFrom.printed}: </span>
            <Rich text={x.derivedFrom.how} />
          </p>
        )}

        <ul className={f.legend} aria-label="What each symbol means">
          {x.legend.map((l, i) => {
            const c = open ? colours.get(l.symbol) : undefined;
            return (
              <li key={i} className={f.legendRow}>
                <span className={f.legendSym} style={c ? { color: c, fontWeight: 600 } : undefined}>
                  <Tex tex={symbolTex(l)} />
                </span>
                <span className={f.legendMeaning}>
                  <Rich text={l.meaning} />
                  {l.value && <span className={f.legendValue}>= {l.value}</span>}
                </span>
                <span className={f.legendUnit}>{l.unit ?? "no unit"}</span>
              </li>
            );
          })}
        </ul>

        {x.notes && (
          <p className={f.notes}>
            <span className={f.notesLabel}>Watch out: </span>
            <Rich text={x.notes} />
          </p>
        )}
        {!ex && <p className={f.coming}>Worked example coming with its chapter.</p>}
      </div>

      {ex && (
        <div className={`${f.exWrap} ${open ? f.exOpen : ""}`}>
          <div className={f.exInner} id={panelId} ref={panel} role="region" aria-label={`Worked example: ${ex.title}`}>
            {mounted && <Example ex={ex} colours={colours} onClose={toggle} />}
          </div>
        </div>
      )}
    </article>
  );
}

const groupDomId = (id: string) => `g-${id}`;

export default function FormulaSheetView({
  sheets,
  modules,
  subLabels,
}: {
  sheets: Sheet[];
  modules: number[];
  subLabels: Record<string, string>;
}) {
  const [mod, setMod] = useState(sheets[0]?.module ?? modules[0]);
  const sheet = sheets.find((x) => x.module === mod) ?? sheets[0];
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [active, setActive] = useState<string | null>(null);
  const jumpRef = useRef<HTMLElement>(null);
  const savedItems = useSaved();
  const savedIds = useMemo(
    () => new Map(savedItems.filter((i) => i.kind === "formula").map((i) => [i.sectionId, i.id])),
    [savedItems],
  );
  const { msg, show, hide } = useToast();

  const all = useMemo(() => sheet.groups.flatMap((g) => g.formulas), [sheet]);
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: all.length, "data-sheet": 0, memorise: 0, derived: 0 };
    all.forEach((x) => c[formulaStatus(x)]++);
    return c;
  }, [all]);
  const groups = useMemo(
    () =>
      sheet.groups
        .map((g) => ({ ...g, formulas: g.formulas.filter((x) => filter === "all" || formulaStatus(x) === filter) }))
        .filter((g) => g.formulas.length > 0),
    [sheet, filter],
  );

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // #f-<id> in the URL (e.g. from My Notes): open that formula and bring it into view.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id.startsWith("f-")) return;
    const fid = id.slice(2);
    if (!all.some((x) => x.id === fid)) return;
    setOpen((prev) => new Set(prev).add(fid));
    // After hydration settles (the router can reset scroll on first paint).
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 300);
    return () => window.clearTimeout(t);
    // Only on first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Highlight the group currently on screen in the jump index.
  useEffect(() => {
    const els = groups.map((g) => document.getElementById(groupDomId(g.id))).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-110px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [groups]);

  // Keep the active chip visible in the (horizontally scrolling) jump index.
  useEffect(() => {
    const row = jumpRef.current;
    const chip = active ? row?.querySelector<HTMLElement>(`[href="#${active}"]`) : null;
    if (!row || !chip) return;
    const left = chip.offsetLeft - row.clientWidth / 2 + chip.offsetWidth / 2;
    row.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  const onSave = (x: Formula) => {
    const existing = savedIds.get(x.id);
    if (existing) {
      const undo = removeItem(existing);
      show({ text: "Removed from My Notes", action: { label: "Undo", onClick: undo } });
    } else {
      saveFormula(x.id, formulaText(x));
      show({ text: "Saved to My Notes", action: { label: "Open", href: "/zakiya/notes" } });
    }
  };

  return (
    <div className={f.sheet}>
      <Header crumbs={[{ label: "Zakiya", href: "/zakiya" }, { label: "Formula sheet" }]}>
        <nav ref={jumpRef} className={f.jump} aria-label="Jump to a topic">
          {groups.map((g) => (
            <a
              key={g.id}
              href={`#${groupDomId(g.id)}`}
              className={`${f.jumpLink} ${active === groupDomId(g.id) ? f.jumpActive : ""}`}
              aria-current={active === groupDomId(g.id) ? "location" : undefined}
            >
              {g.short ?? g.title}
            </a>
          ))}
        </nav>
      </Header>
      <main className={s.page} style={{ animation: "none" }}>
        <div className={s.eyebrow}>Every equation, in one place</div>
        <h1 className={s.h1}>Formula sheet</h1>
        <p className={s.lede}>
          Each equation with what it means in words and every symbol explained. Tap one with a worked example to see exactly
          where each number goes.
        </p>

        <div className={`${s.tabs} ${f.modules}`} role="tablist" aria-label="Module">
          {modules.map((m) => {
            const has = sheets.some((x) => x.module === m);
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={m === mod}
                aria-disabled={!has}
                className={`${s.tab} ${has ? "" : f.tabSoon}`}
                onClick={() => has && setMod(m)}
                title={has ? undefined : "Coming soon"}
              >
                Module {m}
                {!has && <span className={s.tabCount}>soon</span>}
              </button>
            );
          })}
        </div>

        <GlossaryProvider definitions={[]} explain={sheet.explain}>
          <h2 className={s.h2} style={{ marginTop: 22 }}>
            {sheet.title}
          </h2>
          {sheet.intro && (
            <p className={f.groupIntro}>
              <Rich text={sheet.intro} />
            </p>
          )}

          <div className={f.filters} role="group" aria-label="Show">
            {FILTERS.map((x) => (
              <button
                key={x.id}
                type="button"
                className={f.filter}
                aria-pressed={filter === x.id}
                onClick={() => setFilter(x.id)}
              >
                {x.label}
                <span className={f.filterCount}>{counts[x.id]}</span>
              </button>
            ))}
          </div>

          {groups.map((g) => (
            <section key={g.id} id={groupDomId(g.id)} className={f.group} aria-labelledby={`${groupDomId(g.id)}-h`}>
              <h2 id={`${groupDomId(g.id)}-h`} className={`${s.h2} ${f.groupTitle}`}>
                {g.title}
              </h2>
              {g.intro && (
                <p className={f.groupIntro}>
                  <Rich text={g.intro} />
                </p>
              )}
              {g.formulas.map((x) => (
                <FormulaCard
                  key={x.id}
                  x={x}
                  open={open.has(x.id)}
                  toggle={() => toggle(x.id)}
                  saved={savedIds.has(x.id)}
                  onSave={() => onSave(x)}
                  subLabels={subLabels}
                />
              ))}
            </section>
          ))}
        </GlossaryProvider>
      </main>
      <Toast msg={msg} hide={hide} />
    </div>
  );
}

/** Compact saved formula for My Notes. */
export function FormulaMini({ x }: { x: Formula }) {
  return (
    <div className={f.mini}>
      <div className={f.metaRow} style={{ marginBottom: 4 }}>
        <StatusBadge x={x} />
        <span className={f.spec}>Spec {x.specRef}</span>
      </div>
      <span className={f.name}>{x.name}</span>
      <FormulaEq formula={x} className={f.miniEq} />
      <span className={f.words}>
        <Rich text={x.words} />
      </span>
    </div>
  );
}
