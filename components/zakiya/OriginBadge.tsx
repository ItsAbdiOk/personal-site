import type { Origin } from "@/lib/zakiya/types";
import s from "./zakiya.module.css";

/** Small pill saying where the numbers came from: textbook page, real OCR paper, or made for this guide. */
export default function OriginBadge({ origin }: { origin?: Origin }) {
  if (!origin) return null;
  const { kind, ref } = origin;
  const label =
    kind === "textbook"
      ? `Textbook${ref ? ` ${ref}` : ""}`
      : kind === "ocr"
        ? `Real OCR paper${ref ? ` · ${ref}` : ""}`
        : "Made for this guide · double-checked";
  const title =
    kind === "textbook"
      ? "The numbers in this example come from the textbook"
      : kind === "ocr"
        ? "A real OCR exam question"
        : "Our own numbers, written for this guide and independently checked";
  const cls = kind === "textbook" ? s.originBook : kind === "ocr" ? s.originOcr : s.originOurs;
  return (
    <span className={`${s.origin} ${cls}`} title={title}>
      {label}
    </span>
  );
}
