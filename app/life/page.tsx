"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MangaCard from "@/components/MangaCard";
import PodcastCard from "@/components/PodcastCard";
import RunStats from "@/components/RunStats";
import SkeletonCard from "@/components/SkeletonCard";
import styles from "./page.module.css";

interface MangaEntry {
  title: string;
  coverImage: string;
  totalChapters: number | null;
  progress: number;
  updatedAt: number;
  status: "current" | "completed";
}

interface PodcastEpisode {
  podcastTitle: string;
  episodeTitle: string;
  duration: number;
  playedUpTo: number;
  playingStatus: number;
  publishedAt: string;
}

interface RunData {
  runs: any[];
  stats: {
    lastRunKm: string;
    avgPace: string;
    weeklyKm: string;
    vo2max: number | null;
  };
}

function ErrorLine() {
  return (
    <p className={styles.error}>Couldn&apos;t load data right now.</p>
  );
}

export default function LifePage() {
  const [manga, setManga] = useState<MangaEntry[] | null>(null);
  const [mangaError, setMangaError] = useState(false);

  const [podcasts, setPodcasts] = useState<PodcastEpisode[] | null>(null);
  const [podcastsError, setPodcastsError] = useState(false);

  const [runData, setRunData] = useState<RunData | null>(null);
  const [runError, setRunError] = useState(false);

  useEffect(() => {
    fetch("/api/anilist")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setMangaError(true);
        } else {
          setManga([...(data.current ?? []), ...(data.completed ?? [])]);
        }
      })
      .catch(() => setMangaError(true));

    fetch("/api/podcasts")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setPodcastsError(true);
        } else {
          setPodcasts(data.episodes ?? []);
        }
      })
      .catch(() => setPodcastsError(true));

    fetch("/api/strava")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setRunError(true);
        } else {
          setRunData(data);
        }
      })
      .catch(() => setRunError(true));
  }, []);

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className="page-container">
          {/* Hero */}
          <section className={styles.hero}>
            <p className="eyebrow">Beyond the work</p>
            <h1 className={styles.headline}>
              What I&apos;m reading, listening to,{" "}
              <em className={styles.italic}>running.</em>
            </h1>
            <p className={styles.subheading}>
              Live data pulled from AniList, Pocket Casts, and Strava. Updates
              automatically.
            </p>
          </section>

          {/* Section 1 — Manga */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Manga</span>
              <span className={styles.pill}>AniList API</span>
            </div>
            <div className={styles.cards}>
              {mangaError ? (
                <ErrorLine />
              ) : manga === null ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : manga.length === 0 ? (
                <p className={styles.empty}>Nothing being read right now.</p>
              ) : (
                manga.map((m) => (
                  <MangaCard key={m.title} {...m} />
                ))
              )}
            </div>
          </section>

          {/* Section 2 — Podcasts */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Podcasts</span>
              <span className={styles.pill}>Pocket Casts API</span>
            </div>
            <div className={styles.cards}>
              {podcastsError ? (
                <ErrorLine />
              ) : podcasts === null ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : podcasts.length === 0 ? (
                <p className={styles.empty}>No recent episodes.</p>
              ) : (
                podcasts.map((ep, i) => (
                  <PodcastCard key={i} index={i} {...ep} />
                ))
              )}
            </div>
          </section>

          {/* Section 3 — Running */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Running</span>
              <span className={styles.pill}>Strava API</span>
            </div>
            {runError ? (
              <ErrorLine />
            ) : runData === null ? (
              <div className={styles.cards}>
                <SkeletonCard />
              </div>
            ) : runData.runs.length === 0 ? (
              <p className={styles.empty}>No recent runs.</p>
            ) : (
              <RunStats runs={runData.runs} stats={runData.stats} />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
