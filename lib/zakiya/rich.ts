// Tiny parser for the `Rich` markup used in Zakiya's study guide content:
// **bold**, _italic_, x^2^ superscript, v~x~ subscript, [[term]] glossary link,
// ==phrase== mark-scheme keyword highlight, {{key}} / {{key|display text}} tap-to-explain.
// Produces a token tree that React (components/zakiya/Rich.tsx) and the Anki export both render.

import type { Block, Explain, Rich } from "./types";

export type RichNode =
  | { t: "text"; v: string }
  | { t: "b" | "i" | "sup" | "sub" | "kw"; c: RichNode[] }
  | { t: "term"; term: string; label: string }
  /** {{key}} or {{key|text}}. `c` = parsed display text when given; otherwise show explain[key].label. */
  | { t: "explain"; key: string; c?: RichNode[] };

const PATTERN =
  /\{\{([^{}|]+?)(?:\|([^{}]*?))?\}\}|\*\*([\s\S]+?)\*\*|==([^=\n][^=]*?)==|\[\[([^\]]+?)\]\]|\^([^^\s][^^]*?)\^|~([^~\s][^~]*?)~|(?<![A-Za-z0-9])_([^_]+?)_(?![A-Za-z0-9])/g;

export function parseRich(src: string): RichNode[] {
  const out: RichNode[] = [];
  let last = 0;
  PATTERN.lastIndex = 0;
  const re = new RegExp(PATTERN.source, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push({ t: "text", v: src.slice(last, m.index) });
    if (m[1] !== undefined) {
      const c = m[2] !== undefined && m[2].trim() ? parseRich(m[2].trim()) : undefined;
      out.push({ t: "explain", key: m[1].trim(), c });
    } else if (m[3] !== undefined) out.push({ t: "b", c: parseRich(m[3]) });
    else if (m[4] !== undefined) out.push({ t: "kw", c: parseRich(m[4]) });
    else if (m[5] !== undefined) {
      // [[term]] or [[term|shown text]]
      const [term, label] = m[5].split("|");
      out.push({ t: "term", term: term.trim(), label: (label ?? term).trim() });
    } else if (m[6] !== undefined) out.push({ t: "sup", c: parseRich(m[6]) });
    else if (m[7] !== undefined) out.push({ t: "sub", c: parseRich(m[7]) });
    else if (m[8] !== undefined) out.push({ t: "i", c: parseRich(m[8]) });
    last = m.index + m[0].length;
  }
  if (last < src.length) out.push({ t: "text", v: src.slice(last) });
  return out;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function nodesToHtml(nodes: RichNode[]): string {
  return nodes
    .map((n) => {
      switch (n.t) {
        case "text":
          return esc(n.v).replace(/\r?\n/g, "<br>");
        case "term":
          return `<b>${esc(n.label)}</b>`;
        case "explain":
          return n.c ? nodesToHtml(n.c) : esc(n.key);
        case "kw":
          // Anki: bold on a soft highlighter so it survives night mode and plain renderers.
          return `<b style="background-color:#FFF1A6;color:#1D1D1F;padding:0 2px;border-radius:3px">${nodesToHtml(n.c)}</b>`;
        default:
          return `<${n.t}>${nodesToHtml(n.c)}</${n.t}>`;
      }
    })
    .join("");
}

/** Replace every {{key}} / {{key|text}} node with its display nodes: the given text, else
 *  explain[key].label, else the bare key. Used where there's no popover (Anki, plain text). */
export function flattenExplain(nodes: RichNode[], explain?: Record<string, Explain>): RichNode[] {
  return nodes.flatMap((n): RichNode[] => {
    if (n.t === "explain") {
      if (n.c) return flattenExplain(n.c, explain);
      const label = explain?.[n.key]?.label;
      return label ? flattenExplain(parseRich(label), explain) : [{ t: "text", v: n.key }];
    }
    if (n.t === "text" || n.t === "term") return [n];
    return [{ ...n, c: flattenExplain(n.c, explain) }];
  });
}

/** Rich → simple HTML (for Anki). Tabs are flattened so the TSV stays valid. */
export function richToHtml(src: string, explain?: Record<string, Explain>): string {
  return nodesToHtml(flattenExplain(parseRich(src), explain)).replace(/\t/g, " ");
}

function nodesToText(nodes: RichNode[]): string {
  return nodes
    .map((n) => (n.t === "text" ? n.v : n.t === "term" ? n.label : n.t === "explain" ? (n.c ? nodesToText(n.c) : n.key) : nodesToText(n.c)))
    .join("");
}

/** Rich → plain text (for aria-labels, titles). */
export function richToText(src: string, explain?: Record<string, Explain>): string {
  return nodesToText(flattenExplain(parseRich(src), explain));
}

// ---------- "first occurrence" ownership for {{key}} ----------

/** The Rich fields of a block in document (render) order, each with a stable path.
 *  Notes passes `${sectionId}:${blockIndex}:${path}` as the `loc` of each <Rich>. */
export function blockRichFields(b: Block): [path: string, text: Rich][] {
  switch (b.type) {
    case "text":
    case "lead":
    case "analogy":
    case "warning":
    case "examiners":
    case "tip":
      return [["body", b.body]];
    case "list":
      return b.items.map((t, i) => [`items.${i}`, t]);
    case "equation":
      return [["words", b.words], ["note", b.note]].filter((f): f is [string, string] => !!f[1]);
    case "figure":
      return []; // captions render as plain text (no loc), so they never own a first mention
    case "worked":
      return [["question", b.question], ...b.steps.map((t, i): [string, string] => [`steps.${i}`, t]), ["answer", b.answer]];
    case "sayIt":
      return [...b.say.map((t, i): [string, string] => [`say.${i}`, t]), ...(b.reject ?? []).map((t, i): [string, string] => [`reject.${i}`, t])];
  }
}

/** key → the one place that owns its first mention: the loc of the Rich string, and which
 *  occurrence of that key inside the string (0-based). Pure: same input, same answer. */
export type ExplainOwners = Map<string, { loc: string; nth: number }>;

export function findExplainOwners(entries: [loc: string, text: string][]): ExplainOwners {
  const owners: ExplainOwners = new Map();
  const walk = (nodes: RichNode[], loc: string, seen: Map<string, number>) => {
    for (const n of nodes) {
      if (n.t === "explain") {
        const nth = seen.get(n.key) ?? 0;
        seen.set(n.key, nth + 1);
        if (!owners.has(n.key)) owners.set(n.key, { loc, nth });
      } else if (n.t !== "text" && n.t !== "term") walk(n.c, loc, seen);
    }
  };
  for (const [loc, text] of entries) walk(parseRich(text), loc, new Map());
  return owners;
}
