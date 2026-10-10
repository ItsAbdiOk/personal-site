import type { Metadata } from "next";
import FormulaSheetView from "@/components/zakiya/FormulaSheet";
import s from "@/components/zakiya/zakiya.module.css";
import { SUBCHAPTERS } from "@/content/zakiya";
import { MODULES, SHEETS } from "@/content/zakiya/formulas";

export const metadata: Metadata = {
  title: "Formula sheet",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function FormulaSheetPage() {
  // slug → "3.8", for the "Used in 3.8" chips (only subchapters that exist get a chip).
  const subLabels = Object.fromEntries(SUBCHAPTERS.map((x) => [x.slug, x.number]));
  return (
    <div className={s.root}>
      <FormulaSheetView sheets={SHEETS} modules={[...MODULES]} subLabels={subLabels} />
    </div>
  );
}
