"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/now", label: "Now" },
  { href: "/life", label: "Life" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`${styles.inner} page-container`}>
        <Link href="/" className={styles.name} onClick={() => setOpen(false)}>
          Abdi
        </Link>

        {/* Desktop links */}
        <div className={styles.desktopLinks}>
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

        {/* Hamburger button */}
        <button
          className={styles.hamburger}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`${styles.dropdown} ${open ? styles.dropdownOpen : ""}`}
      >
        <div className="page-container">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.dropdownLink} ${
                pathname === link.href ? styles.active : ""
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
