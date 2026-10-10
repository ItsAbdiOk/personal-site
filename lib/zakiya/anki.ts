// Anki (.apkg) deck naming for Zakiya's study guide. Shared by the page (download link)
// and scripts/zakiya/export-cards.ts → scripts/zakiya/build_apkg.py.
// amgi (iOS) wants exactly 3 deck levels and a short topic (≤ 25 chars) with a number prefix.

/** Short deck topic per module. Add an entry when a new module gets content. */
export const ANKI_MODULE_TITLES: Record<number, string> = {
  3: "Forces & Motion",
};

export function ankiTopic(module: number): string {
  const title = ANKI_MODULE_TITLES[module];
  if (!title) throw new Error(`No Anki title for module ${module} in lib/zakiya/anki.ts`);
  return `${String(module).padStart(2, "0")} ${title}`;
}

export const ankiDeckName = (module: number) => `ALevel::Physics::${ankiTopic(module)}`;

/** "module-3-forces-and-motion.apkg" */
export function ankiFileName(module: number): string {
  const slug = ANKI_MODULE_TITLES[module]
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `module-${module}-${slug}.apkg`;
}

export const ankiHref = (module: number) => `/zakiya/anki/${ankiFileName(module)}`;
