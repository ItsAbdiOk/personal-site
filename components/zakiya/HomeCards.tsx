"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookmarkIcon from "./BookmarkIcon";
import { useSaved } from "./saved";
import s from "./zakiya.module.css";

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
      <div className={`${s.homeCard} ${s.homeCardSoon}`} aria-disabled>
        <span className={s.homeCardIcon} aria-hidden>
          ƒ
        </span>
        <span className={s.homeCardText}>
          <span className={s.homeCardTitle}>Formula sheet</span>
          <span className={s.homeCardSub}>Coming soon</span>
        </span>
      </div>
    </div>
  );
}
