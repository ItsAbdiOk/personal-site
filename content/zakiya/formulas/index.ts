// Formula sheets by module. Add module4.ts / module5.ts here when they're written;
// the sheet page lists every module in MODULES and greys out the ones without a sheet yet.
import type { Formula, FormulaSheet } from "@/lib/zakiya/formula-types";
import module3 from "./module3";

export const MODULES = [3, 4, 5] as const;

export const SHEETS: FormulaSheet[] = [module3];

export function getSheet(module: number): FormulaSheet | undefined {
  return SHEETS.find((s) => s.module === module);
}

export function allFormulas(): Formula[] {
  return SHEETS.flatMap((s) => s.groups.flatMap((g) => g.formulas));
}

export function getFormula(id: string): { formula: Formula; sheet: FormulaSheet } | undefined {
  for (const sheet of SHEETS)
    for (const g of sheet.groups) {
      const formula = g.formulas.find((f) => f.id === id);
      if (formula) return { formula, sheet };
    }
  return undefined;
}
