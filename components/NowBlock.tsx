import styles from "./NowBlock.module.css";

interface NowBlockProps {
  date: string;
  children: React.ReactNode;
}

export default function NowBlock({ date, children }: NowBlockProps) {
  return (
    <section className={styles.block}>
      <div className="page-container">
        <div className={styles.label}>
          <span className={styles.dot} />
          <span>Now — {date}</span>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  );
}
