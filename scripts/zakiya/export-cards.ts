// Dump every available subchapter's flashcards (+ module/chapter/subchapter metadata) to JSON
// for scripts/zakiya/build_apkg.py. Run via `npm run zakiya:anki`.
//   bun scripts/zakiya/export-cards.ts [out.json]   (default: .zakiya-anki/cards.json, gitignored)
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { SUBCHAPTERS } from "@/content/zakiya";
import { ankiDeckName, ankiFileName, ankiTopic } from "@/lib/zakiya/anki";
import { flattenExplain, mathToText, parseRich } from "@/lib/zakiya/rich";

const out = resolve(process.argv[2] ?? ".zakiya-anki/cards.json");

const modules = new Map<number, { number: number; topic: string; deck: string; file: string; subchapters: unknown[] }>();
for (const sub of SUBCHAPTERS) {
  if (!modules.has(sub.module)) {
    modules.set(sub.module, {
      number: sub.module,
      topic: ankiTopic(sub.module),
      deck: ankiDeckName(sub.module),
      file: ankiFileName(sub.module),
      subchapters: [],
    });
  }
  modules.get(sub.module)!.subchapters.push({
    slug: sub.slug,
    number: sub.number,
    title: sub.title,
    chapter: sub.chapter,
    specRefs: sub.specRefs,
    textbookPages: sub.textbookPages,
    // Rich is pre-parsed here (lib/zakiya/rich.ts) so Python never re-implements the markup.
    // {{key|text}} → text, {{key}} → explain[key].label (or the key): cards have no popovers.
    // $...$ LaTeX → plain Unicode text (vₓ, √(…), ⁻¹): never MathJax, amgi doesn't render it.
    flashcards: sub.flashcards.map((c) => ({
      ...c,
      frontNodes: mathToText(flattenExplain(parseRich(c.front), sub.explain)),
      backNodes: mathToText(flattenExplain(parseRich(c.back), sub.explain)),
    })),
  });
}

mkdirSync(dirname(out), { recursive: true });
const data = { modules: [...modules.values()].sort((a, b) => a.number - b.number) };
writeFileSync(out, JSON.stringify(data, null, 2));
const n = data.modules.reduce((t, m) => t + m.subchapters.reduce((u: number, s: any) => u + s.flashcards.length, 0), 0);
console.log(`export-cards: ${n} cards in ${data.modules.length} module(s) → ${out}`);
