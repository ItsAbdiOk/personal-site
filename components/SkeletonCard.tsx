import styles from "./SkeletonCard.module.css";

export default function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.shimmer} />
      <div className={styles.cover} />
      <div className={styles.lines}>
        <div className={`${styles.line} ${styles.lineShort}`} />
        <div className={styles.line} />
        <div className={`${styles.line} ${styles.lineMedium}`} />
      </div>
    </div>
  );
}
