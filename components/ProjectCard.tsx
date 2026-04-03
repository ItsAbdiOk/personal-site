import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  tag: string;
  title: string;
  description: string;
  stack: string[];
  href?: string;
}

export default function ProjectCard({
  tag,
  title,
  description,
  stack,
  href,
}: ProjectCardProps) {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? {
        href,
        target: href.startsWith("http") ? "_blank" : undefined,
        rel: href.startsWith("http") ? "noopener noreferrer" : undefined,
      }
    : {};

  return (
    <Wrapper className={styles.card} {...wrapperProps}>
      <span className={styles.tag}>{tag}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.stack}>
        {stack.map((s) => (
          <span key={s} className={styles.pill}>
            {s}
          </span>
        ))}
      </div>
    </Wrapper>
  );
}
