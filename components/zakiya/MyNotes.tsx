"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { OUTLINE, getSubchapter } from "@/content/zakiya";
import { getFormula } from "@/content/zakiya/formulas";
import type { Subchapter } from "@/lib/zakiya/types";
import BookmarkIcon from "./BookmarkIcon";
import { FormulaMini } from "./FormulaSheet";
import { BlockView, DefinitionView } from "./Notes";
import { GlossaryProvider } from "./Rich";
import { type Resolved, type SavedItem, exportItems, importItems, removeItem, resolve, updateNote, useSaved } from "./saved";
import { Toast, useToast } from "./Toast";
import s from "./zakiya.module.css";

type Entry = { it: SavedItem; r: Resolved };
type Part = { sectionId: string; heading: string; order: number; entries: Entry[] };
type SubGroup = { sub: Subchapter; parts: Part[] };
type ChapterGroup = { number: number; title: string; colour: string; subs: SubGroup[] };
type ModuleGroup = { number: number; title: string; chapters: ChapterGroup[] };

const fmtDate = (t: number) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function group(items: SavedItem[]): ModuleGroup[] {
  const subs = new Map<string, SubGroup>();
  for (const it of items) {
    const r = resolve(it, getSubchapter);
    if (!r) continue;
    let g = subs.get(r.sub.slug);
    if (!g) subs.set(r.sub.slug, (g = { sub: r.sub, parts: [] }));
    let p = g.parts.find((x) => x.sectionId === r.sectionId);
    if (!p) {
      const order = r.sectionIndex < 0 ? 1e6 : r.sectionIndex;
      g.parts.push((p = { sectionId: r.sectionId, heading: r.heading, order, entries: [] }));
    }
    p.entries.push({ it, r });
  }
  const modules = new Map<number, ModuleGroup>();
  const sorted = Array.from(subs.values()).sort((a, b) => a.sub.number.localeCompare(b.sub.number, undefined, { numeric: true }));
  for (const g of sorted) {
    g.parts.sort((a, b) => a.order - b.order);
    g.parts.forEach((p) => p.entries.sort((a, b) => b.it.savedAt - a.it.savedAt));
    const om = OUTLINE.find((m) => m.number === g.sub.module);
    let m = modules.get(g.sub.module);
    if (!m) modules.set(g.sub.module, (m = { number: g.sub.module, title: om?.title ?? "", chapters: [] }));
    let c = m.chapters.find((x) => x.number === g.sub.chapter.number);
    if (!c) {
      const oc = om?.chapters.find((x) => x.number === g.sub.chapter.number);
      m.chapters.push((c = { number: g.sub.chapter.number, title: g.sub.chapter.title, colour: oc?.colour ?? g.sub.colour, subs: [] }));
    }
    c.subs.push(g);
  }
  return Array.from(modules.values())
    .sort((a, b) => a.number - b.number)
    .map((m) => ({ ...m, chapters: m.chapters.sort((a, b) => a.number - b.number) }));
}

/** "Why I saved this…": grows with its text, autosaves while she types. */
function NoteField({ it }: { it: SavedItem }) {
  const [v, setV] = useState(it.note ?? "");
  const ref = useRef<HTMLTextAreaElement>(null);
  const timer = useRef(0);
  const fit = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  };
  useEffect(fit, [v]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const flush = (next: string) => {
    window.clearTimeout(timer.current);
    if (next !== (it.note ?? "")) updateNote(it.id, next);
  };
  return (
    <textarea
      ref={ref}
      className={`${s.textarea} ${s.mnNote}`}
      rows={1}
      value={v}
      placeholder="Why I saved this…"
      aria-label="Personal note"
      onChange={(e) => {
        const next = e.target.value;
        setV(next);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => flush(next), 400);
      }}
      onBlur={() => flush(v)}
    />
  );
}

function ItemView({ e, onRemove }: { e: Entry; onRemove: (id: string) => void }) {
  const { it, r } = e;
  return (
    <article className={s.mnItem}>
      <div className={s.mnKind}>
        {it.kind === "highlight" ? (
          <>
            <span aria-hidden>🖍️</span> Highlight · {fmtDate(it.savedAt)}
          </>
        ) : (
          <>
            <BookmarkIcon size={9} /> Saved {fmtDate(it.savedAt)}
          </>
        )}
      </div>
      {it.kind === "highlight" ? (
        <blockquote className={s.mnQuote}>
          <mark>{it.text}</mark>
        </blockquote>
      ) : r.block ? (
        <BlockView block={r.block} at={`saved-${it.id}:`} />
      ) : r.definition ? (
        <DefinitionView d={r.definition} />
      ) : (
        <div className={s.mnSnapshot}>{it.text || "(nothing saved)"}</div>
      )}
      {r.changed && (
        <p className={s.mnChanged}>
          <span aria-hidden>↺</span> This part has changed since you saved it{it.kind === "block" ? ", so this is your saved copy" : ""}.
        </p>
      )}
      <NoteField it={it} />
      <div className={s.mnActions}>
        <Link href={`/zakiya/${r.sub.slug}#${encodeURIComponent(r.sectionId)}`} className={s.mnLink}>
          Go to source ›
        </Link>
        <button type="button" className={`${s.mnLink} ${s.mnRemove}`} onClick={() => onRemove(it.id)}>
          Remove
        </button>
      </div>
    </article>
  );
}

/** A formula saved from the formula sheet. */
function FormulaItemView({ it, onRemove }: { it: SavedItem; onRemove: (id: string) => void }) {
  const found = getFormula(it.sectionId);
  return (
    <article className={s.mnItem}>
      <div className={s.mnKind}>
        <BookmarkIcon size={9} /> Saved {fmtDate(it.savedAt)}
      </div>
      {found ? (
        <GlossaryProvider definitions={[]} explain={found.sheet.explain}>
          <FormulaMini x={found.formula} />
        </GlossaryProvider>
      ) : (
        <>
          <div className={s.mnSnapshot}>{it.text || "(nothing saved)"}</div>
          <p className={s.mnChanged}>
            <span aria-hidden>↺</span> This formula is no longer on the sheet, so this is your saved copy.
          </p>
        </>
      )}
      <NoteField it={it} />
      <div className={s.mnActions}>
        <Link href={`/zakiya/formulas#f-${encodeURIComponent(it.sectionId)}`} className={s.mnLink}>
          Go to formula ›
        </Link>
        <button type="button" className={`${s.mnLink} ${s.mnRemove}`} onClick={() => onRemove(it.id)}>
          Remove
        </button>
      </div>
    </article>
  );
}

export default function MyNotes() {
  const items = useSaved();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const groups = useMemo(() => group(items), [items]);
  const formulas = useMemo(() => items.filter((i) => i.kind === "formula").sort((a, b) => b.savedAt - a.savedAt), [items]);
  const { msg, show, hide } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const onRemove = (id: string) => {
    const undo = removeItem(id);
    show({ text: "Removed from My Notes", action: { label: "Undo", onClick: undo } });
  };

  const doExport = () => {
    const data = { app: "zakiya-my-notes", version: 1, exportedAt: new Date().toISOString(), items: exportItems() };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `zakiya-my-notes-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const doImport = async (f: File | undefined) => {
    if (!f) return;
    try {
      const n = importItems(JSON.parse(await f.text()));
      show({ text: n > 0 ? `Added ${n} from your backup` : "Nothing new in that file" });
    } catch {
      show({ text: "That file isn't a My Notes backup" });
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const n = items.length;
  return (
    <>
      <div className={s.eyebrow}>Saved from your notes</div>
      <h1 className={s.h1}>My notes</h1>
      <p className={s.lede}>
        {!ready ? " " : n > 0 ? `${n} saved. The bits worth another look, grouped by where they came from.` : "The bits worth another look, all in one place."}
      </p>

      {ready && n === 0 && (
        <div className={`${s.card} ${s.empty}`}>
          <div className={s.emptyIcon} aria-hidden>
            🔖
          </div>
          <h2 className={s.h3}>Nothing saved yet</h2>
          <ol className={s.mnEmptySteps}>
            <li>
              Open a section&apos;s <b>Notes</b> and tap <b>Select</b>. Tap the parts you find hard (diagrams too), then{" "}
              <b>Save to My Notes</b>.
            </li>
            <li>
              Or highlight any words in the notes and tap <b>Save highlight</b>.
            </li>
            <li>
              On the <Link href="/zakiya/formulas">Formula sheet</Link>, tap <b>Save</b> on any equation.
            </li>
          </ol>
          <Link href="/zakiya" className={s.btn}>
            Go to sections
          </Link>
        </div>
      )}

      {groups.map((m) => (
        <section key={m.number} className={s.mnModule} aria-label={`Module ${m.number}`}>
          <div className={s.eyebrow}>Module {m.number}</div>
          <h2 className={s.h2} style={{ fontSize: "1.75rem", marginTop: 4 }}>
            {m.title}
          </h2>
          {m.chapters.map((c) => (
            <div key={c.number} className={s.mnChapter} style={{ ["--topic" as string]: c.colour }}>
              <div className={s.mnChapterHead}>
                Chapter {c.number} · {c.title}
              </div>
              {c.subs.map(({ sub, parts }) => (
                <GlossaryProvider key={sub.slug} definitions={sub.definitions} explain={sub.explain}>
                  <section className={s.card} style={{ ["--topic" as string]: sub.colour }}>
                    <h3 className={`${s.h3} ${s.mnSubTitle}`} style={{ fontSize: "1.25rem" }}>
                      <span className={s.subNo}>{sub.number}</span>
                      <span>{sub.title}</span>
                    </h3>
                    {parts.map((p) => (
                      <div key={p.sectionId} className={s.mnPart}>
                        <div className={s.mnPartHead}>
                          {p.order >= 0 && p.order < 1e6 ? `Part ${p.order + 1} · ` : ""}
                          {p.heading}
                        </div>
                        {p.entries.map((e) => (
                          <ItemView key={e.it.id} e={e} onRemove={onRemove} />
                        ))}
                      </div>
                    ))}
                  </section>
                </GlossaryProvider>
              ))}
            </div>
          ))}
        </section>
      ))}

      {formulas.length > 0 && (
        <section className={s.mnModule} aria-label="Formula sheet">
          <div className={s.eyebrow}>From the formula sheet</div>
          <h2 className={s.h2} style={{ fontSize: "1.75rem", marginTop: 4 }}>
            Formula sheet
          </h2>
          <section className={s.card}>
            {formulas.map((it) => (
              <FormulaItemView key={it.id} it={it} onRemove={onRemove} />
            ))}
          </section>
        </section>
      )}

      {ready && (
        <footer className={s.mnFooter}>
          <p>Saved on this device only. Back them up so they survive a cleared browser, or move them to another device.</p>
          <div className={s.mnFooterRow}>
            <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSmall}`} onClick={doExport} disabled={n === 0}>
              Back up (download)
            </button>
            <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSmall}`} onClick={() => fileRef.current?.click()}>
              Restore from file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => doImport(e.target.files?.[0])}
            />
          </div>
        </footer>
      )}
      <Toast msg={msg} hide={hide} />
    </>
  );
}
