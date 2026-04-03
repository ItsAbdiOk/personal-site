import styles from "./MangaCard.module.css";

interface MangaCardProps {
  title: string;
  coverImage: string;
  totalChapters: number | null;
  progress: number;
  updatedAt: number;
  status: "current" | "completed";
}

function timeAgo(unix: number): string {
  const seconds = Math.floor(Date.now() / 1000 - unix);
  const days = Math.floor(seconds / 86400);
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(seconds / 3600);
  if (hours > 0) return `${hours}h ago`;
  const mins = Math.floor(seconds / 60);
  return mins > 0 ? `${mins}m ago` : "just now";
}

export default function MangaCard({
  title,
  coverImage,
  totalChapters,
  progress,
  updatedAt,
  status,
}: MangaCardProps) {
  const pct =
    totalChapters && totalChapters > 0
      ? Math.min((progress / totalChapters) * 100, 100)
      : 0;

  const tag = status === "current" ? "Currently reading" : "Recently completed";

  return (
    <div className={styles.card}>
      <img
        src={coverImage}
        alt={title}
        className={styles.cover}
        loading="lazy"
      />
      <div className={styles.body}>
        <span className={styles.tag}>{tag}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>
          Ch. {progress}
          {totalChapters ? ` / ${totalChapters}` : ""}
        </p>
        <div className={styles.bottom}>
          <div className={styles.updated}>
            <span
              className={
                status === "current" ? styles.dotLive : styles.dotStatic
              }
            />
            <span>Updated {timeAgo(updatedAt)}</span>
          </div>
          <span className={styles.source}>
            via anilist.co/user/TheBastard
          </span>
        </div>
      </div>
      <div className={styles.right}>
        <span
          className={`${styles.badge} ${
            status === "completed" ? styles.badgeCompleted : ""
          }`}
        >
          {status === "current" ? "Reading" : "Done"}
        </span>
        {totalChapters && totalChapters > 0 ? (
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
