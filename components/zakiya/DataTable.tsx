"use client";

// Table block / question data table. Headers read "quantity / unit" (OCR style), numbers are
// right-aligned with tabular figures, null cells (or `blank` columns) are empty boxes to fill in.

import type { Table } from "@/lib/zakiya/types";
import { richToText } from "@/lib/zakiya/rich";
import { Rich } from "./Rich";
import t from "./DataTable.module.css";

const isNum = (v: string | number | null) => typeof v === "number" || (typeof v === "string" && /^[−+-]?\d[\d.,\s×⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*$/.test(v.trim()));
const show = (v: string | number) => (typeof v === "number" ? String(v).replace(/^-/, "−") : v);

/** `at` = the Notes loc prefix ("<sectionId>:<blockIndex>:"), so {{key}} first mentions line up. */
export default function DataTable({ table, at }: { table: Table; at?: string }) {
  const loc = (p: string) => (at === undefined ? undefined : `${at}${p}`);
  const label = table.caption ? richToText(table.caption) : `Table: ${table.columns.map((c) => richToText(c.header)).join(", ")}`;
  return (
    <div className={t.wrap}>
      {table.caption && (
        <p className={t.caption}>
          <Rich text={table.caption} loc={loc("caption")} />
        </p>
      )}
      {/* Scrolls sideways inside the card on a phone, never the page. */}
      <div className={t.scroll} role="region" aria-label={label} tabIndex={0}>
        <table className={t.table}>
          <thead>
            <tr>
              {table.columns.map((c, i) => (
                <th key={i} scope="col" className={`${c.highlight ? t.hl : ""} ${t.th}`}>
                  <Rich text={c.header} loc={loc(`columns.${i}`)} />
                  {c.unit && <span className={t.unit}> / {c.unit}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {table.columns.map((c, i) => {
                  const v = row[i] ?? null;
                  const blank = c.blank || v === null;
                  return (
                    <td key={i} className={`${c.highlight ? t.hl : ""} ${blank ? t.blankCell : isNum(v) ? t.num : t.text}`}>
                      {blank ? <span className={t.blank} aria-label="blank, to fill in" role="img" /> : show(v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && (
        <p className={t.note}>
          <Rich text={table.note} loc={loc("note")} />
        </p>
      )}
    </div>
  );
}
