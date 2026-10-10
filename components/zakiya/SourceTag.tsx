import type { Source } from "@/lib/zakiya/types";
import s from "./zakiya.module.css";

export const SOURCE_LABEL: Record<Source, string> = {
  both: "Spec + textbook",
  "spec-only": "Spec only",
  "textbook-only": "Textbook only",
};

const TITLE: Record<Source, string> = {
  both: "In the OCR specification and the textbook",
  "spec-only": "In the OCR specification but not covered in the textbook",
  "textbook-only": "In the textbook but not on the OCR specification — useful, but won't be examined directly",
};

export default function SourceTag({ source }: { source: Source }) {
  const cls = source === "both" ? s.srcBoth : source === "spec-only" ? s.srcSpec : s.srcBook;
  return (
    <span className={`${s.src} ${cls}`} title={TITLE[source]}>
      {SOURCE_LABEL[source]}
    </span>
  );
}
