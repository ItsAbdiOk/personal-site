import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import styles from "./page.module.css";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };

  return {
    title: `${post.meta.title} — Abdirahman Mohamed`,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description || "",
      type: "article",
      publishedTime: post.meta.date,
    },
  };
}

export default function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main className="page-container">
        <article className={styles.article}>
          <header className={styles.header}>
            <time className={styles.date}>{post.meta.date}</time>
            <h1 className={styles.title}>{post.meta.title}</h1>
            {post.meta.description && (
              <p className={styles.description}>{post.meta.description}</p>
            )}
          </header>
          <div className={styles.prose}>
            <MDXRemote source={post.content} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
