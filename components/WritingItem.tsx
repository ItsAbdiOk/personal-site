import Link from "next/link";
import styles from "./WritingItem.module.css";

interface WritingItemProps {
  title: string;
  date: string;
  slug: string;
}

export default function WritingItem({ title, date, slug }: WritingItemProps) {
  return (
    <Link href={`/writing/${slug}`} className={styles.item}>
      <span className={styles.titleWrap}>
        <span className={styles.arrow}>→</span>
        <span className={styles.title}>{title}</span>
      </span>
      <span className={styles.date}>{date}</span>
    </Link>
  );
}
