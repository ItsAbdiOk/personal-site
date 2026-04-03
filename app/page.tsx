import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import WritingItem from "@/components/WritingItem";
import NowBlock from "@/components/NowBlock";
import { getAllPosts } from "@/lib/posts";
import styles from "./page.module.css";

const projects = [
  {
    tag: "App · Live beta",
    title: "Arday",
    description:
      "English learning app for Somali speakers. Lesson-based curriculum with TTS audio, spaced repetition, and gamification.",
    stack: ["Next.js", "Supabase", "Kokoro TTS"],
    href: "https://arday-nine.vercel.app",
  },
  {
    tag: "iOS · SwiftUI",
    title: "TimeBudget",
    description:
      "Personal dashboard aggregating HealthKit, AniList, LeetCode, Pocket Casts, and EventKit into one view.",
    stack: ["SwiftUI", "HealthKit", "EventKit"],
    href: "/writing/timebudget",
  },
  {
    tag: "Automation · Live",
    title: "WARARKA",
    description:
      "Automated Somali news pipeline. Fetches RSS feeds, deduplicates stories with AI, renders graphics, and posts to Instagram and Facebook every 2 hours.",
    stack: ["Remotion", "Gemini", "Meta API"],
    href: "/writing/wararka",
  },
  {
    tag: "Automation · Live",
    title: "Arday Social",
    description:
      "Daily Word of the Day content pipeline for Arday. Renders bilingual vocabulary cards and auto-posts 6 times daily across Instagram and Facebook.",
    stack: ["Remotion", "GitHub Actions", "Meta API"],
    href: "/writing/arday-social",
  },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

const writing = getAllPosts().map((post) => ({
  title: post.title,
  date: formatDate(post.date),
  slug: post.slug,
}));

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className={`${styles.hero} page-container`}>
          <p className="eyebrow">ML Engineer · London</p>
          <h1 className={styles.headline}>
            Building things
            <br />
            at the edge of <em className={styles.italic}>language</em>
            <br />
            and machine.
          </h1>
          <p className={styles.bio}>
            MSc AI student at Queen Mary University of London, specialising in
            speech and language processing. I build products that make language
            accessible — currently Arday, an English learning app for Somali
            speakers.
          </p>
          <div className={styles.links}>
            <a
              href="https://arday-nine.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroLink}
            >
              arday-nine.vercel.app ↗
            </a>
            <span className={styles.linkDot}>·</span>
            <a
              href="https://github.com/ItsAbdiOk"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroLink}
            >
              GitHub
            </a>
            <span className={styles.linkDot}>·</span>
            <a
              href="https://linkedin.com/in/itsabdiok"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroLink}
            >
              LinkedIn
            </a>
            <span className={styles.linkDot}>·</span>
            <a href="/cv" className={styles.heroLink}>
              CV
            </a>
          </div>
        </section>

        {/* Projects */}
        <section id="work" className={`${styles.projects} page-container`}>
          <p className="section-label">Work</p>
          <div className={styles.grid}>
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        {/* Writing */}
        <section className={`${styles.writing} page-container`}>
          <p className="section-label">Writing</p>
          <div className={styles.writingList}>
            {writing.map((post) => (
              <WritingItem key={post.slug} {...post} />
            ))}
          </div>
        </section>

        {/* Now */}
        <NowBlock date="April 2025">
          <p>
            Preparing for MSc AI at QMUL starting September, working through
            Jurafsky &amp; Martin and Stanford CS224N. Building out Arday's TTS
            layer so every English sentence has audio. Tracking my 5K training
            on Apple Watch, chasing a VO2 max improvement before summer.
          </p>
        </NowBlock>
      </main>
      <Footer />
    </>
  );
}
