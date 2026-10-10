"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import s from "./zakiya.module.css";

export type ToastMsg = { text: string; action?: { label: string; href?: string; onClick?: () => void } };

/** One transient toast at a time. `show` replaces whatever is showing. */
export function useToast() {
  const [msg, setMsg] = useState<(ToastMsg & { n: number }) | null>(null);
  const n = useRef(0);
  const show = useCallback((m: ToastMsg) => setMsg({ ...m, n: ++n.current }), []);
  const hide = useCallback(() => setMsg(null), []);
  return { msg, show, hide };
}

export function Toast({ msg, hide, raised }: { msg: (ToastMsg & { n: number }) | null; hide: () => void; raised?: boolean }) {
  useEffect(() => {
    if (!msg) return;
    const id = window.setTimeout(hide, msg.action?.onClick ? 6000 : 4000);
    return () => window.clearTimeout(id);
  }, [msg, hide]);
  return (
    <div className={`${s.toastWrap} ${raised ? s.toastRaised : ""}`} aria-live="polite">
      {msg && (
        <div key={msg.n} className={s.toast} role="status">
          <span className={s.toastText}>{msg.text}</span>
          {msg.action &&
            (msg.action.href ? (
              <Link href={msg.action.href} className={s.toastAction}>
                {msg.action.label}
              </Link>
            ) : (
              <button
                type="button"
                className={s.toastAction}
                onClick={() => {
                  msg.action?.onClick?.();
                  hide();
                }}
              >
                {msg.action.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
