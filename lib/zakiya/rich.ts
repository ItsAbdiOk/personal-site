// Tiny parser for the `Rich` markup used in Zakiya's study guide content:
// **bold**, _italic_, x^2^ superscript, v~x~ subscript, [[term]] glossary link,
// ==phrase== mark-scheme keyword highlight, {{key}} / {{key|display text}} tap-to-explain,
// $...$ inline LaTeX (KaTeX on the page, a plain fallback in Anki; `\$` = a literal dollar).
// Produces a token tree that React (components/zakiya/Rich.tsx) and the Anki export both render.

import type { Block, Explain, Rich } from "./types";

export type RichNode =
  | { t: "text"; v: string }
  | { t: "b" | "i" | "sup" | "sub" | "kw"; c: RichNode[] }
  | { t: "term"; term: string; label: string }
  /** $...$ inline LaTeX. */
  | { t: "math"; tex: string }
  /** {{key}} or {{key|text}}. `c` = parsed display text when given; otherwise show explain[key].label. */
  | { t: "explain"; key: string; c?: RichNode[] };

const PATTERN =
  /(?<!\\)\$((?:\\.|[^$\\])+?)\$|\{\{([^{}|]+?)(?:\|([^{}]*?))?\}\}|\*\*([\s\S]+?)\*\*|==([^=\n][^=]*?)==|\[\[([^\]]+?)\]\]|\^([^^\s][^^]*?)\^|~([^~\s][^~]*?)~|(?<![A-Za-z0-9])_([^_]+?)_(?![A-Za-z0-9])/g;

const textNode = (v: string): RichNode => ({ t: "text", v: v.replace(/\\\$/g, "$") });

// ---------- LaTeX → plain fallback (Anki, aria-labels) ----------

const TEX_SYMBOLS: Record<string, string> = {
  theta: "θ", alpha: "α", beta: "β", gamma: "γ", delta: "δ", Delta: "Δ", lambda: "λ", mu: "μ",
  pi: "π", rho: "ρ", sigma: "σ", Sigma: "Σ", omega: "ω", Omega: "Ω", phi: "φ", epsilon: "ε", varepsilon: "ε",
  times: "×", cdot: "·", div: "÷", pm: "±", mp: "∓", approx: "≈", neq: "≠", ne: "≠", leq: "≤", le: "≤",
  geq: "≥", ge: "≥", to: "→", rightarrow: "→", Rightarrow: "⇒", circ: "°", degree: "°", propto: "∝", infty: "∞",
  sin: "sin", cos: "cos", tan: "tan", log: "log", ln: "ln", quad: " ", qquad: " ", ",": " ", ";": " ", ":": " ", "!": "",
  " ": " ", "%": "%", "$": "$", "{": "{", "}": "}", "&": "&", "#": "#", "_": "_",
};

type Plain = "html" | "text";

const SUBSCRIPT: Record<string, string> = Object.fromEntries(
  [..."0123456789+-−=()xaeohklmnpst"].map((c, i) => [c, [..."₀₁₂₃₄₅₆₇₈₉₊₋₋₌₍₎ₓₐₑₒₕₖₗₘₙₚₛₜ"][i]]),
);

const SUPERSCRIPT: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻", "−": "⁻", "+": "⁺",
};

/** Read one TeX argument starting at i: a {group} or a single token. Returns [content, next index]. */
function texArg(src: string, i: number): [string, number] {
  while (src[i] === " ") i++;
  if (src[i] === "{") {
    let depth = 0;
    for (let j = i; j < src.length; j++) {
      if (src[j] === "{") depth++;
      else if (src[j] === "}" && --depth === 0) return [src.slice(i + 1, j), j + 1];
    }
    return [src.slice(i + 1), src.length];
  }
  if (src[i] === "\\") {
    const m = /^\\([A-Za-z]+|.)/.exec(src.slice(i));
    if (m) return [m[0], i + m[0].length];
  }
  return [src[i] ?? "", i + 1];
}

const needsParens = (s: string) => [...s].length > 1 && !/^\(.*\)$/.test(s) && /[^\p{L}\p{N}.]/u.test(s);

/** Turns the LaTeX we write in notes into readable HTML (sub/sup tags) or plain Unicode text.
 *  Never emits MathJax: Anki (and amgi) show it as ordinary text. */
export function texToPlain(tex: string, mode: Plain): string {
  let out = "";
  let i = 0;
  const wrap = (tag: "sub" | "sup", inner: string) => {
    if (mode === "html") return `<${tag}>${inner}</${tag}>`;
    if (tag === "sup") {
      const sup = [...inner].map((ch) => SUPERSCRIPT[ch]);
      return sup.every(Boolean) ? sup.join("") : `^${needsParens(inner) ? `(${inner})` : inner}`;
    }
    // text mode: Unicode subscript when every char has one (v_x → vₓ), else plain (v_y → vy)
    const sub = [...inner].map((ch) => SUBSCRIPT[ch]);
    return sub.every(Boolean) ? sub.join("") : inner;
  };
  while (i < tex.length) {
    const c = tex[i];
    if (c === "\\") {
      const m = /^\\([A-Za-z]+|.)/.exec(tex.slice(i));
      if (!m) { i++; continue; }
      const cmd = m[1];
      i += m[0].length;
      if (cmd === "frac" || cmd === "dfrac" || cmd === "tfrac") {
        const [a, j] = texArg(tex, i);
        const [b, k] = texArg(tex, j);
        i = k;
        const A = texToPlain(a, mode), B = texToPlain(b, mode);
        const pa = needsParens(texToPlain(a, "text")), pb = needsParens(texToPlain(b, "text"));
        out += `${pa ? `(${A})` : A} ÷ ${pb ? `(${B})` : B}`;
      } else if (cmd === "sqrt") {
        const [a, j] = texArg(tex, i);
        i = j;
        out += `√(${texToPlain(a, mode)})`;
      } else if (["text", "mathrm", "textrm", "mathbf", "mathit", "operatorname", "mbox"].includes(cmd)) {
        const [a, j] = texArg(tex, i);
        i = j;
        out += cmd === "text" || cmd === "mbox" || cmd === "textrm" ? (mode === "html" ? escHtml(a) : a) : texToPlain(a, mode);
      } else if (cmd === "left" || cmd === "right" || cmd === "big" || cmd === "Big" || cmd === "bigl" || cmd === "bigr") {
        // drop the sizing; the delimiter that follows is emitted as an ordinary char
        if (tex[i] === "." ) i++;
      } else if (cmd in TEX_SYMBOLS) {
        const sym = TEX_SYMBOLS[cmd];
        if (/^[A-Za-z]{2,}$/.test(sym) && /[A-Za-z0-9>]$/.test(out)) out += " "; // u\cos → u cos
        out += mode === "html" ? escHtml(sym) : sym;
        // a word command followed by a letter needs a space (\sin\theta → sin θ is fine without)
        if (/^[A-Za-z]/.test(cmd) && /^[A-Za-z]{2,}$/.test(sym) && /[A-Za-z0-9\\]/.test(tex[i] ?? "")) out += " ";
      } else out += cmd;
    } else if (c === "_" || c === "^") {
      const [a, j] = texArg(tex, i + 1);
      i = j;
      const inner = texToPlain(a, mode);
      if (c === "^" && (inner === "°" || a === "\\circ")) out += "°";
      else out += wrap(c === "_" ? "sub" : "sup", inner);
    } else if (c === "{" || c === "}") i++;
    else if (c === "~") { out += " "; i++; }
    else { const ch = c === "-" ? "−" : c; out += mode === "html" ? escHtml(ch) : ch; i++; }
  }
  return out.replace(/ {2,}/g, " ");
}

const escHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function parseRich(src: string): RichNode[] {
  const out: RichNode[] = [];
  let last = 0;
  PATTERN.lastIndex = 0;
  const re = new RegExp(PATTERN.source, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(textNode(src.slice(last, m.index)));
    if (m[1] !== undefined) out.push({ t: "math", tex: m[1].trim() });
    else if (m[2] !== undefined) {
      const c = m[3] !== undefined && m[3].trim() ? parseRich(m[3].trim()) : undefined;
      out.push({ t: "explain", key: m[2].trim(), c });
    } else if (m[4] !== undefined) out.push({ t: "b", c: parseRich(m[4]) });
    else if (m[5] !== undefined) out.push({ t: "kw", c: parseRich(m[5]) });
    else if (m[6] !== undefined) {
      // [[term]] or [[term|shown text]]
      const [term, label] = m[6].split("|");
      out.push({ t: "term", term: term.trim(), label: (label ?? term).trim() });
    } else if (m[7] !== undefined) out.push({ t: "sup", c: parseRich(m[7]) });
    else if (m[8] !== undefined) out.push({ t: "sub", c: parseRich(m[8]) });
    else if (m[9] !== undefined) out.push({ t: "i", c: parseRich(m[9]) });
    last = m.index + m[0].length;
  }
  if (last < src.length) out.push(textNode(src.slice(last)));
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
        case "math":
          return texToPlain(n.tex, "html");
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
    if (n.t === "text" || n.t === "term" || n.t === "math") return [n];
    return [{ ...n, c: flattenExplain(n.c, explain) }];
  });
}

/** Rich → simple HTML (for Anki). Tabs are flattened so the TSV stays valid. */
export function richToHtml(src: string, explain?: Record<string, Explain>): string {
  return nodesToHtml(flattenExplain(parseRich(src), explain)).replace(/\t/g, " ");
}

function nodesToText(nodes: RichNode[]): string {
  return nodes
    .map((n) =>
      n.t === "text" ? n.v : n.t === "term" ? n.label : n.t === "math" ? texToPlain(n.tex, "text") : n.t === "explain" ? (n.c ? nodesToText(n.c) : n.key) : nodesToText(n.c),
    )
    .join("");
}

/** Swap every $...$ node for a plain-Unicode text node (Anki builder renders text, not maths). */
export function mathToText(nodes: RichNode[]): RichNode[] {
  return nodes.map((n): RichNode => {
    if (n.t === "math") return { t: "text", v: texToPlain(n.tex, "text") };
    if (n.t === "text" || n.t === "term") return n;
    if (n.t === "explain") return n.c ? { ...n, c: mathToText(n.c) } : n;
    return { ...n, c: mathToText(n.c) };
  });
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
      } else if (n.t !== "text" && n.t !== "term" && n.t !== "math") walk(n.c, loc, seen);
    }
  };
  for (const [loc, text] of entries) walk(parseRich(text), loc, new Map());
  return owners;
}
