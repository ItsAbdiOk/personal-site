import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} page-container`}>
        <span className={styles.meta}>Updated April 2025 · v1.0</span>
        <div className={styles.links}>
          <a href="mailto:hi@abdirahmanmohamed.dev" className={styles.link}>
            Email
          </a>
          <span className={styles.dot}>·</span>
          <a
            href="https://github.com/ItsAbdiOk"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            GitHub
          </a>
          <span className={styles.dot}>·</span>
          <a
            href="https://linkedin.com/in/itsabdiok"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
