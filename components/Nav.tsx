"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/now", label: "Now" },
  { href: "/reading", label: "Reading" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={`${styles.inner} page-container`}>
        <Link href="/" className={styles.name}>
          Abdi
        </Link>
        <div className={styles.links}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${
                pathname === link.href ? styles.active : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
