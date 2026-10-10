import Link from "next/link";
import s from "./zakiya.module.css";

export type Crumb = { label: string; href?: string };

/** Minimal translucent sticky header for /zakiya. Optional children render as a second row (tabs). */
export default function Header({ crumbs, children }: { crumbs: Crumb[]; children?: React.ReactNode }) {
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <nav aria-label="Breadcrumb" className={s.crumbs}>
          {crumbs.map((c, i) => (
            <span key={i} style={{ minWidth: 0 }}>
              {i > 0 && (
                <span className={s.crumbSep} aria-hidden>
                  ›
                </span>
              )}
              {c.href ? (
                <Link href={c.href}>{c.label}</Link>
              ) : (
                <span className={s.crumbCurrent} aria-current="page">
                  {c.label}
                </span>
              )}
            </span>
          ))}
        </nav>
        {children}
      </div>
    </header>
  );
}
