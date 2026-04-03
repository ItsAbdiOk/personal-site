import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Now — Abdirahman Mohamed",
  description: "What I'm focused on right now.",
};

export default function NowPage() {
  return (
    <>
      <Nav />
      <main className="page-container">
        <section className={styles.header}>
          <h1>Now</h1>
          <p className={styles.updated}>Updated April 2025</p>
        </section>
        <section className={styles.content}>
          <div className={styles.block}>
            <h2>Studying</h2>
            <p>
              Preparing for MSc AI at QMUL starting September. Working through
              Jurafsky &amp; Martin&apos;s <em>Speech and Language Processing</em>{" "}
              and Stanford CS224N lecture series. Focusing on NLP fundamentals,
              transformer architectures, and speech recognition.
            </p>
          </div>

          <div className={styles.block}>
            <h2>Building</h2>
            <p>
              Expanding Arday&apos;s TTS layer so every English sentence has
              spoken audio. Experimenting with Kokoro TTS for natural-sounding
              Somali-accented English. Also prototyping the AI Job Agent — an
              autonomous system for post-MSc job applications.
            </p>
          </div>

          <div className={styles.block}>
            <h2>Training</h2>
            <p>
              Tracking my 5K training on Apple Watch, chasing a VO2 max
              improvement before summer. Logging all runs to Google Calendar
              automatically via Apple Shortcuts.
            </p>
          </div>

          <div className={styles.block}>
            <h2>Reading</h2>
            <p>
              Working through the reading list on my{" "}
              <a href="/reading">reading page</a>. Heavy on ML textbooks right
              now, with some product thinking mixed in.
            </p>
          </div>
        </section>
        <section className={styles.nownow}>
          <p className={styles.nownowLabel}>
            This is a{" "}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
            >
              now page
            </a>
            . If you have your own site, you should make one too.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
