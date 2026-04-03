import styles from "./PodcastCard.module.css";

interface PodcastCardProps {
  podcastTitle: string;
  episodeTitle: string;
  duration: number;
  playedUpTo: number;
  playingStatus: number;
  publishedAt: string;
  artwork?: string | null;
  index: number;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const days = Math.floor(seconds / 86400);
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(seconds / 3600);
  if (hours > 0) return `${hours}h ago`;
  const mins = Math.floor(seconds / 60);
  return mins > 0 ? `${mins}m ago` : "just now";
}

const BAR_HEIGHTS = [8, 14, 6, 18, 10, 14, 8];

export default function PodcastCard({
  podcastTitle,
  episodeTitle,
  duration,
  playedUpTo,
  playingStatus,
  publishedAt,
  artwork,
  index,
}: PodcastCardProps) {
  const isCompleted = playingStatus === 3 || (duration > 0 && playedUpTo >= duration * 0.95);
  const pct = duration > 0 ? Math.min((playedUpTo / duration) * 100, 100) : 0;
  const tag = index === 0 ? "Last listened" : "Also listening";
  const bgColor = index === 0 ? "#1A1A18" : "#2C2C2A";

  return (
    <div className={styles.card}>
      {artwork ? (
        <img
          src={artwork}
          alt={podcastTitle}
          className={styles.artwork}
          loading="lazy"
        />
      ) : (
        <div className={styles.waveform} style={{ background: bgColor }}>
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className={styles.bar}
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      )}
      <div className={styles.body}>
        <span className={styles.tag}>{tag}</span>
        <h3 className={styles.title}>{podcastTitle}</h3>
        <p className={styles.episode}>{episodeTitle}</p>
        <div className={styles.bottom}>
          <div className={styles.meta}>
            <span className={styles.dot} />
            <span>
              {publishedAt ? timeAgo(publishedAt) : ""}
              {duration > 0 ? ` \u00B7 ${formatDuration(duration)}` : ""}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        {isCompleted ? (
          <span className={styles.badge}>Completed</span>
        ) : (
          <>
            <span className={styles.badge}>
              {Math.round(pct)}%
            </span>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
