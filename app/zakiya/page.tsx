import type { Metadata } from "next";
import Link from "next/link";
import { Elevator, Plot, Plug, Sieve, Turntable } from "@lucasmarkes/hairline/react";
import Header from "@/components/zakiya/Header";
import HomeCards from "@/components/zakiya/HomeCards";
import s from "@/components/zakiya/zakiya.module.css";
import { OUTLINE, SUBCHAPTERS, getSubchapterByNumber } from "@/content/zakiya";

export const metadata: Metadata = {
  title: { absolute: "Zakiya · Physics" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

const ART = { plot: Plot, elevator: Elevator, plug: Plug, sieve: Sieve, turntable: Turntable } as const;

export default function ZakiyaHome() {
  const ready = SUBCHAPTERS.length;
  return (
    <div className={s.root}>
      <Header crumbs={[{ label: "Zakiya" }]} />
      <main className={s.page} style={{ animation: "none" }}>
        <div className={s.eyebrow}>OCR A Physics · Year 13</div>
        <h1 className={s.h1}>
          Hi Zakiya <span aria-hidden>👋</span>
          <br />
          <em>Let&apos;s revise.</em>
        </h1>
        <p className={s.lede}>
          Each section goes the same way: the idea in plain words, something to play with, flashcards to lock it in, then
          real exam-style questions with the mark scheme.
        </p>
        <div className={s.chips}>
          <span className={s.chip}>
            <span className={s.dot} />
            {ready} section{ready === 1 ? "" : "s"} ready
          </span>
          <span className={s.chip}>Progress saves on this device</span>
        </div>

        <HomeCards />

        {OUTLINE.map((mod) => (
          <section key={mod.number}>
            <div className={s.moduleHead}>
              <div className={s.eyebrow}>Module {mod.number}</div>
              <h2 className={s.h2} style={{ fontSize: "1.75rem", marginTop: 4 }}>
                {mod.title}
              </h2>
            </div>
            <div className={s.chapters}>
              {mod.chapters.map((ch) => {
                const Art = ch.art ? ART[ch.art] : null;
                return (
                  <article key={ch.number} className={s.chapter} style={{ ["--topic" as string]: ch.colour }}>
                    {Art && (
                      <div className={s.chapterArt} aria-hidden>
                        <Art theme="light" intensity={0.6} play />
                      </div>
                    )}
                    <div className={s.chapterBody}>
                      <div className={s.chapterNum}>Chapter {ch.number}</div>
                      <h3 className={s.h3} style={{ fontSize: "1.25rem", marginBottom: 2 }}>
                        {ch.title}
                      </h3>
                      <p className={s.note} style={{ margin: 0 }}>
                        {ch.blurb}
                      </p>
                      <ul className={s.subList}>
                        {ch.subchapters.map((sc) => {
                          const sub = getSubchapterByNumber(sc.number);
                          return (
                            <li key={sc.number} className={s.subItem}>
                              {sub ? (
                                <Link href={`/zakiya/${sub.slug}`} className={s.subLink}>
                                  <span className={s.subNo}>{sc.number}</span>
                                  <span className={s.subTitle}>{sub.title}</span>
                                  <span className={s.go}>Start ›</span>
                                </Link>
                              ) : (
                                <div className={s.subSoon} aria-disabled>
                                  <span className={s.subNo}>{sc.number}</span>
                                  <span className={s.subTitle}>{sc.title}</span>
                                  <span className={s.soon}>Coming soon</span>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
