import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import WritingItem from "@/components/WritingItem";
import NowBlock from "@/components/NowBlock";
import styles from "./page.module.css";

const projects = [
  {
    tag: "App · Live beta",
    title: "Arday",
    description:
      "English learning app for Somali speakers. Lesson-based curriculum with TTS audio, spaced repetition, and gamification.",
    stack: ["GPT-4o", "Next.js", "Whisper"],
    href: "https://arday-nine.vercel.app",
  },
  {
    tag: "iOS · SwiftUI",
    title: "TimeBudget",
    description:
      "Personal dashboard aggregating HealthKit, AniList, LeetCode, Pocket Casts, and EventKit into one view.",
    stack: ["SwiftUI", "HealthKit", "EventKit"],
    href: "https://github.com/ItsAbdiOk/TimeBudget",
  },
  {
    tag: "Automation",
    title: "Quantified Self",
    description:
      "Apple Health and sleep data logged to Google Calendar automatically via Apple Shortcuts and GPX parsing.",
    stack: ["Python", "Shortcuts", "GCal API"],
  },
  {
    tag: "Automation · Live",
    title: "WARARKA",
    description:
      "Automated Somali news pipeline. Fetches RSS feeds, deduplicates stories with AI, renders graphics, and posts to Instagram and Facebook every 2 hours.",
    stack: ["Remotion", "Gemini", "Meta API"],
    href: "https://github.com/ItsAbdiOk/News",
  },
  {
    tag: "Automation · Live",
    title: "Arday Social",
    description:
      "Daily Word of the Day content pipeline for Arday. Renders bilingual vocabulary cards and auto-posts 6 times daily across Instagram and Facebook.",
    stack: ["Remotion", "GitHub Actions", "Meta API"],
    href: "https://github.com/ItsAbdiOk/arday-remotion",
  },
  {
    tag: "Research · Ongoing",
    title: "AI Job Agent",
    description:
      "Autonomous system for job discovery, tailoring, and application. Post-MSc project exploring LLM-powered agents.",
    stack: ["LLMs", "Agents"],
  },
];

const writing = [
  {
    title: "Why I chose GPT-4o for Somali-English translation",
    date: "Apr 2025",
    slug: "gpt4o-somali-translation",
  },
  {
    title: "What Duolingo\u2019s path to profit taught me about Arday",
    date: "Mar 2025",
    slug: "duolingo-arday-lessons",
  },
  {
    title: "My QMUL MSc prep: 200 hours before September",
    date: "Mar 2025",
    slug: "qmul-msc-prep",
  },
  {
    title: "Logging Apple Health walks to Google Calendar automatically",
    date: "Feb 2025",
    slug: "apple-health-gcal",
  },
];

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
