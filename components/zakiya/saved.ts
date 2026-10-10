"use client";

// "My Notes": blocks and highlights Zakiya saves from any Notes tab, kept in localStorage.
// Items point at live content by reference (slug + section + block index), so diagrams and sims
// re-render properly; `text` is a plain-text snapshot used to check the reference still matches.
import { useSyncExternalStore } from "react";
import type { Block, Definition, Subchapter } from "@/lib/zakiya/types";
import { richToText } from "@/lib/zakiya/rich";
import { load, save } from "./storage";

export type SavedItem = {
  id: string;
  savedAt: number;
  /** formula: slug = FORMULAS, sectionId = formula id (from the formula sheet). */
  kind: "block" | "highlight" | "formula";
  slug: string;
  /** Section id, or "definitions" for a key definition (blockIndex = index in sub.definitions). */
  sectionId: string;
  blockIndex: number;
  /** Highlight: the selected text. Block: plain-text snapshot of the block when saved. */
  text?: string;
  /** Highlight only: snapshot of the block it came from. */
  blockText?: string;
  note?: string;
};

export const DEFS = "definitions";
const KEY = "zakiya:saved:v1";
const EMPTY: SavedItem[] = [];

let cache: SavedItem[] | null = null;
const listeners = new Set<() => void>();

function valid(x: unknown): x is SavedItem {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.savedAt === "number" &&
    (o.kind === "block" || o.kind === "highlight" || o.kind === "formula") &&
    typeof o.slug === "string" &&
    typeof o.sectionId === "string" &&
    typeof o.blockIndex === "number"
  );
}

export function cleanItems(raw: unknown): SavedItem[] {
  return Array.isArray(raw) ? raw.filter(valid) : [];
}

function read(): SavedItem[] {
  if (cache === null) cache = cleanItems(load<unknown>(KEY, []));
  return cache;
}

function write(next: SavedItem[]) {
  cache = next;
  save(KEY, next);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

/** All saved items (empty during SSR / first hydration render). */
export function useSaved(): SavedItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const blockKey = (sectionId: string, blockIndex: number) => `${sectionId}:${blockIndex}`;

/** Adds block items, skipping ones already saved. Returns how many were new. */
export function saveBlocks(sub: Subchapter, keys: string[]): number {
  const items = read();
  const have = new Set(items.filter((i) => i.kind === "block" && i.slug === sub.slug).map((i) => blockKey(i.sectionId, i.blockIndex)));
  const now = Date.now();
  const add: SavedItem[] = [];
  keys.forEach((k, n) => {
    if (have.has(k)) return;
    const [sectionId, bi] = [k.slice(0, k.lastIndexOf(":")), Number(k.slice(k.lastIndexOf(":") + 1))];
    add.push({ id: newId(), savedAt: now - n, kind: "block", slug: sub.slug, sectionId, blockIndex: bi, text: snapshotAt(sub, sectionId, bi) });
  });
  if (add.length) write([...items, ...add]);
  return add.length;
}

export function saveHighlight(sub: Subchapter, sectionId: string, blockIndex: number, text: string) {
  write([
    ...read(),
    { id: newId(), savedAt: Date.now(), kind: "highlight", slug: sub.slug, sectionId, blockIndex, text, blockText: snapshotAt(sub, sectionId, blockIndex) },
  ]);
}

export const FORMULAS = "formulas";

/** Saves a formula-sheet card (once). `text` is a plain snapshot, e.g. "Weight: W = mg". */
export function saveFormula(formulaId: string, text: string) {
  if (read().some((i) => i.kind === "formula" && i.sectionId === formulaId)) return;
  write([...read(), { id: newId(), savedAt: Date.now(), kind: "formula", slug: FORMULAS, sectionId: formulaId, blockIndex: 0, text }]);
}

export function updateNote(id: string, note: string) {
  write(read().map((i) => (i.id === id ? { ...i, note: note || undefined } : i)));
}

/** Removes an item; returns a function that puts it back where it was. */
export function removeItem(id: string): () => void {
  const items = read();
  const idx = items.findIndex((i) => i.id === id);
  if (idx < 0) return () => {};
  const item = items[idx];
  write(items.filter((i) => i.id !== id));
  return () => {
    const cur = read();
    if (cur.some((i) => i.id === id)) return;
    const next = [...cur];
    next.splice(Math.min(idx, next.length), 0, item);
    write(next);
  };
}

/** Merges imported items by id. Returns how many were new. */
export function importItems(raw: unknown): number {
  const list = cleanItems(Array.isArray(raw) ? raw : (raw as { items?: unknown })?.items);
  const items = read();
  const ids = new Set(items.map((i) => i.id));
  const add = list.filter((i) => !ids.has(i.id));
  if (add.length) write([...items, ...add]);
  return add.length;
}

export function exportItems(): SavedItem[] {
  return read();
}

// ---------- snapshots + resolving references ----------

const t = (sub: Subchapter, r: string | undefined) => (r ? richToText(r, sub.explain) : "");

const FIGURE_NAME: Record<string, string> = {
  "projectile-sim": "Interactive projectile simulator",
  "shadow-sim": "Interactive shadows simulator",
  hairline: "Diagram",
  svg: "Diagram",
};

export function blockText(sub: Subchapter, b: Block): string {
  switch (b.type) {
    case "text":
    case "lead":
    case "analogy":
    case "warning":
    case "tip":
      return t(sub, b.body);
    case "examiners":
      return `${t(sub, b.body)} (Examiners' report, ${b.cite})`;
    case "list":
      return b.items.map((i) => `• ${t(sub, i)}`).join("\n");
    case "equation":
      // latexless is the plain-text twin of tex, so snapshots stay readable without KaTeX.
      return [b.latexless, t(sub, b.words), b.general].filter(Boolean).join("\n");
    case "figure": {
      const f = b.figure;
      const cap = t(sub, f.caption);
      const name = f.kind === "svg" ? f.alt : FIGURE_NAME[f.kind];
      return [name, cap].filter(Boolean).join(": ");
    }
    case "worked":
      return `Worked example: ${b.title}\n${t(sub, b.question)}\nAnswer: ${t(sub, b.answer)}`;
    case "sayIt":
      return b.say.map((x) => `✓ ${t(sub, x)}`).join("\n");
  }
}

export function definitionText(sub: Subchapter, d: Definition): string {
  return `${d.term}: ${t(sub, d.plain)}`;
}

function snapshotAt(sub: Subchapter, sectionId: string, bi: number): string {
  if (sectionId === DEFS) {
    const d = sub.definitions[bi];
    return d ? definitionText(sub, d) : "";
  }
  const b = sub.sections.find((x) => x.id === sectionId)?.blocks[bi];
  return b ? blockText(sub, b) : "";
}

export type Resolved = {
  sub: Subchapter;
  sectionId: string;
  sectionIndex: number; // -1 for definitions
  heading: string;
  blockIndex: number;
  block?: Block;
  definition?: Definition;
  /** The saved content can't be found as it was (fall back to the snapshot). */
  changed: boolean;
};

/** Finds the block an item points at. If the index has moved, looks for a block with the same
 *  snapshot (same section first, then anywhere in the subchapter). */
export function resolve(item: SavedItem, getSubchapter: (slug: string) => Subchapter | undefined): Resolved | null {
  if (item.kind === "formula") return null; // shown in My Notes' own "Formula sheet" group
  const sub = getSubchapter(item.slug);
  if (!sub) return null;
  const snap = item.kind === "block" ? item.text : item.blockText;
  const at = (sectionId: string, bi: number, changed: boolean): Resolved => {
    if (sectionId === DEFS) {
      return { sub, sectionId, sectionIndex: -1, heading: "Key definitions", blockIndex: bi, definition: sub.definitions[bi], changed };
    }
    const si = sub.sections.findIndex((x) => x.id === sectionId);
    const sec = sub.sections[si];
    return { sub, sectionId, sectionIndex: si, heading: sec?.heading ?? "", blockIndex: bi, block: sec?.blocks[bi], changed };
  };
  const matches = (sectionId: string, bi: number) => {
    const now = snapshotAt(sub, sectionId, bi);
    if (!now) return false;
    if (!snap) return true;
    if (now === snap) return true;
    return item.kind === "highlight" && !!item.text && now.replace(/\s+/g, " ").includes(item.text.replace(/\s+/g, " "));
  };
  if (matches(item.sectionId, item.blockIndex)) return at(item.sectionId, item.blockIndex, false);
  // Moved within its section, or to another section.
  const order = [item.sectionId, ...sub.sections.map((x) => x.id).filter((id) => id !== item.sectionId), DEFS];
  for (const sid of order) {
    const n = sid === DEFS ? sub.definitions.length : (sub.sections.find((x) => x.id === sid)?.blocks.length ?? 0);
    for (let i = 0; i < n; i++) if (matches(sid, i)) return at(sid, i, false);
  }
  // Gone: keep the section if it still exists, so she can still find where it was.
  const sec = item.sectionId === DEFS || sub.sections.some((x) => x.id === item.sectionId) ? item.sectionId : null;
  if (sec) {
    const r = at(sec, item.blockIndex, true);
    return { ...r, block: undefined, definition: undefined };
  }
  return { sub, sectionId: item.sectionId, sectionIndex: Number.MAX_SAFE_INTEGER, heading: "Removed part", blockIndex: item.blockIndex, changed: true };
}
