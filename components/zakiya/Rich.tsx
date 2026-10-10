"use client";

import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Definition, Explain } from "@/lib/zakiya/types";
import { findExplainOwners, parseRich, richToText, type ExplainOwners, type RichNode } from "@/lib/zakiya/rich";
import s from "./zakiya.module.css";
import { Tex } from "./Tex";

type Glossary = Map<string, Definition>;
type ExplainDict = Record<string, Explain>;
/** What a tap opens: a [[term]] glossary entry or a {{key}} explain entry. */
type Target = { kind: "term"; term: string } | { kind: "explain"; key: string };
type Open = (target: Target, anchor: HTMLElement) => void;

const GlossaryCtx = createContext<{ glossary: Glossary; explain: ExplainDict; open: Open } | null>(null);

/** Which {{key}} occurrence is the tappable one (first mention in document order). Without a
 *  scope, every {{key}} renders as plain display text. */
const ExplainScopeCtx = createContext<ExplainOwners | null>(null);

/** Pre-scans `entries` (loc + Rich text, in document order) so each key's first mention is the
 *  only tappable one. Each <Rich> inside must get the matching `loc`. Pure: safe under SSR and
 *  strict-mode double renders. */
export function ExplainScope({ entries, children }: { entries: [loc: string, text: string][]; children: React.ReactNode }) {
  const owners = useMemo(() => findExplainOwners(entries), [entries]);
  return <ExplainScopeCtx.Provider value={owners}>{children}</ExplainScopeCtx.Provider>;
}

const EMPTY: ExplainDict = {};

const key = (t: string) => t.trim().toLowerCase();

/** Provides [[term]] lookups and owns the single popover. */
export function GlossaryProvider({
  definitions,
  explain = EMPTY,
  children,
}: {
  definitions: Definition[];
  explain?: ExplainDict;
  children: React.ReactNode;
}) {
  const glossary = useMemo(() => new Map(definitions.map((d) => [key(d.term), d])), [definitions]);
  const [pop, setPop] = useState<{
    def: Definition | null;
    ex: Explain | null;
    term: string;
    x: number;
    y: number;
    above: boolean;
  } | null>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLElement | null>(null);

  const open = useCallback<Open>(
    (target, anchor) => {
      if (anchorRef.current === anchor && pop) {
        setPop(null);
        anchorRef.current = null;
        return;
      }
      anchorRef.current = anchor;
      const r = anchor.getBoundingClientRect();
      const above = r.bottom > window.innerHeight * 0.62;
      const width = Math.min(320, window.innerWidth - 32);
      const x = Math.max(16, Math.min(r.left + r.width / 2 - width / 2, window.innerWidth - width - 16));
      const y = above ? window.innerHeight - r.top + 8 : r.bottom + 8;
      if (target.kind === "term") {
        setPop({ def: glossary.get(key(target.term)) ?? null, ex: null, term: target.term, x, y, above });
      } else {
        const ex = explain[target.key] ?? null;
        setPop({ def: null, ex, term: ex ? richToText(ex.label) : target.key, x, y, above });
      }
    },
    [glossary, explain, pop],
  );

  useEffect(() => {
    if (!pop) return;
    const close = () => {
      setPop(null);
      anchorRef.current = null;
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || anchorRef.current?.contains(t)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [pop]);

  return (
    <GlossaryCtx.Provider value={{ glossary, explain, open }}>
      {children}
      {pop && (
        <div
          ref={popRef}
          role="dialog"
          aria-label={`${pop.ex ? "What this means" : "Definition"}: ${pop.term}`}
          className={s.popover}
          style={{ left: pop.x, ...(pop.above ? { bottom: pop.y } : { top: pop.y }) }}
        >
          {pop.ex ? (
            <>
              <b>
                <Rich text={pop.ex.label} />
              </b>
              <Rich text={pop.ex.body} />
            </>
          ) : (
            <>
              <b>{pop.def?.term ?? pop.term}</b>
              {pop.def ? <Rich text={pop.def.plain} /> : <span>Not in the glossary yet.</span>}
            </>
          )}
          {pop.def?.spec && (
            <div className={s.note} style={{ marginTop: 6 }}>
              Exam wording: “{pop.def.spec}”
            </div>
          )}
        </div>
      )}
    </GlossaryCtx.Provider>
  );
}

function Term({ term, label }: { term: string; label: string }) {
  const ctx = useContext(GlossaryCtx);
  if (!ctx) return <b>{label}</b>;
  return (
    <button
      type="button"
      className={s.term}
      aria-haspopup="dialog"
      onClick={(e) => ctx.open({ kind: "term", term }, e.currentTarget)}
    >
      {label}
    </button>
  );
}

const warned = new Set<string>();

function ExplainTerm({ k, c, tappable }: { k: string; c?: RichNode[]; tappable: boolean }) {
  const ctx = useContext(GlossaryCtx);
  const entry = ctx?.explain[k];
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && ctx && !entry && !warned.has(k)) {
      warned.add(k);
      console.warn(`[zakiya] {{${k}}} has no entry in this subchapter's \`explain\``);
    }
  }, [ctx, entry, k]);
  const shown = c ?? (entry ? parseRich(entry.label) : [{ t: "text" as const, v: k }]);
  // Nested display text never contains its own tappable explain.
  const inner = renderNodes(shown, null);
  if (!ctx || !entry || !tappable) return <>{inner}</>;
  return (
    <button
      type="button"
      className={s.term}
      aria-haspopup="dialog"
      onClick={(e) => ctx.open({ kind: "explain", key: k }, e.currentTarget)}
    >
      {inner}
    </button>
  );
}

/** Per-<Rich> render state: which key occurrences in this string are the page's first mention. */
type Walk = { loc: string; owners: ExplainOwners; seen: Map<string, number> } | null;

function renderNodes(nodes: RichNode[], walk: Walk): React.ReactNode {
  return nodes.map((n, i) => {
    switch (n.t) {
      case "text": {
        const lines = n.v.split("\n");
        return (
          <Fragment key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {l}
              </Fragment>
            ))}
          </Fragment>
        );
      }
      case "term":
        return <Term key={i} term={n.term} label={n.label} />;
      case "math":
        return <Tex key={i} tex={n.tex} />;
      case "explain": {
        // Every mention is tappable (not just the first), so she never has to hunt back for it.
        return <ExplainTerm key={i} k={n.key} c={n.c} tappable />;
      }
      case "b":
        return <b key={i}>{renderNodes(n.c, walk)}</b>;
      case "i":
        return <em key={i}>{renderNodes(n.c, walk)}</em>;
      case "sup":
        return <sup key={i}>{renderNodes(n.c, walk)}</sup>;
      case "sub":
        return <sub key={i}>{renderNodes(n.c, walk)}</sub>;
      case "kw":
        return (
          <mark key={i} className={s.kw}>
            {renderNodes(n.c, walk)}
          </mark>
        );
    }
  });
}

/** Renders Rich markup inline. Wrap in <p>/<div> yourself.
 *  `loc` ties this string to an <ExplainScope> entry so its first-mention {{key}}s are tappable. */
export function Rich({ text, loc }: { text: string | undefined; loc?: string }) {
  const owners = useContext(ExplainScopeCtx);
  const nodes = useMemo(() => parseRich(text ?? ""), [text]);
  // Fresh counter every render: the walk is a pure function of (nodes, loc, owners).
  const walk: Walk = owners && loc ? { loc, owners, seen: new Map() } : null;
  return <>{renderNodes(nodes, walk)}</>;
}
