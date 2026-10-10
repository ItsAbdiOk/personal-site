"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookmarkIcon from "./BookmarkIcon";
import { allFormulas } from "@/content/zakiya/formulas";
import { useSaved } from "./saved";
import s from "./zakiya.module.css";

const FORMULA_COUNT = allFormulas().length;

/** Landing-page shortcuts above the modules: My notes (live count) and the formula sheet. */
export default function HomeCards() {
  const n = useSaved().length;
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <div className={s.homeCards}>
      <Link href="/zakiya/notes" className={s.homeCard}>
        <span className={s.homeCardIcon}>
          <BookmarkIcon size={16} />
        </span>
        <span className={s.homeCardText}>
          <span className={s.homeCardTitle}>My notes</span>
          <span className={s.homeCardSub}>
            {!ready ? " " : n > 0 ? `${n} saved` : "Save the bits you find hard"}
          </span>
        </span>
        <span className={s.go}>Open ›</span>
      </Link>
      <Link href="/zakiya/formulas" className={s.homeCard}>
        <span className={s.homeCardIcon} aria-hidden>
          ƒ
        </span>
        <span className={s.homeCardText}>
          <span className={s.homeCardTitle}>Formula sheet</span>
          <span className={s.homeCardSub}>
            {FORMULA_COUNT} equations · tap one to see it worked
          </span>
        </span>
        <span className={s.go}>Open ›</span>
      </Link>
    </div>
  );
}
