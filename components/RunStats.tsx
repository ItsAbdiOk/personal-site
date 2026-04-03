import styles from "./RunStats.module.css";

interface Run {
  name: string;
  distance: number;
  movingTime: number;
  elapsedTime: number;
  startDate: string;
  averageSpeed: number;
  calories: number;
}

interface RunStatsProps {
  runs: Run[];
  stats: {
    lastRunKm: string;
    avgPace: string;
    weeklyKm: string;
    vo2max: number | null;
  };
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getPacePerKm(run: Run): number {
  if (run.averageSpeed <= 0) return 0;
  return 1000 / run.averageSpeed / 60; // minutes per km
}

export default function RunStats({ runs, stats }: RunStatsProps) {
  const lastRun = runs[0] ?? null;

  // Pace values for bar chart
  const paces = runs.map((r) => getPacePerKm(r)).filter((p) => p > 0);
  const maxPace = Math.max(...paces, 1);

  return (
    <div className={styles.container}>
      {/* 4-stat row */}
      <div className={styles.statsRow}>
        <div className={`${styles.stat} ${styles.statFirst}`}>
          <span className={styles.statLabel}>Last run</span>
          <span className={styles.statValue}>{stats.lastRunKm} km</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Avg pace</span>
          <span className={styles.statValue}>{stats.avgPace} /km</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>VO2 max</span>
          <span className={styles.statValue}>
            {stats.vo2max ?? "44"}
          </span>
        </div>
        <div className={`${styles.stat} ${styles.statLast}`}>
          <span className={styles.statLabel}>This week</span>
          <span className={styles.statValue}>{stats.weeklyKm} km</span>
        </div>
      </div>

      {/* Last run card */}
      {lastRun && (
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.runInfo}>
              <span className={styles.runTag}>Latest run</span>
              <h3 className={styles.runName}>{lastRun.name}</h3>
            </div>
            <div className={styles.runStats}>
              <span className={styles.runStat}>
                {(lastRun.distance / 1000).toFixed(1)} km
              </span>
              <span className={styles.runStatDot}>&middot;</span>
              <span className={styles.runStat}>
                {formatTime(lastRun.movingTime)}
              </span>
              {lastRun.calories > 0 && (
                <>
                  <span className={styles.runStatDot}>&middot;</span>
                  <span className={styles.runStat}>
                    {Math.round(lastRun.calories)} cal
                  </span>
                </>
              )}
            </div>
          </div>

          <div className={styles.divider} />

          {/* Pace bar chart */}
          <div className={styles.chart}>
            <div className={styles.bars}>
              {runs.map((run, i) => {
                const pace = getPacePerKm(run);
                const height =
                  pace > 0 ? Math.max((pace / maxPace) * 100, 10) : 0;
                return (
                  <div
                    key={i}
                    className={styles.barWrapper}
                  >
                    <div
                      className={`${styles.bar} ${
                        i === 0 ? styles.barCurrent : ""
                      }`}
                      style={{ height: `${height}%`, animationDelay: `${i * 60}ms` }}
                    />
                  </div>
                );
              })}
            </div>
            <p className={styles.chartLabel}>
              Pace per km &middot; last {runs.length} runs
            </p>
          </div>
        </div>
      )}

      {/* Goal block */}
      <div className={styles.goal}>
        <p>
          Goal: sub-25 min 5K before September. Current PB: 26:12.
        </p>
      </div>
    </div>
  );
}
