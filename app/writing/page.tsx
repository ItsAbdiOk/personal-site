import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WritingItem from "@/components/WritingItem";
import { getAllPosts } from "@/lib/posts";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Writing — Abdirahman Mohamed",
  description: "Posts on AI, language technology, and building products.",
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main className="page-container">
        <section className={styles.header}>
          <h1>Writing</h1>
          <p className={styles.subtitle}>
            Notes on building, learning, and the space between language and
            machines.
          </p>
        </section>
        <section className={styles.list}>
          {posts.map((post) => (
            <WritingItem
              key={post.slug}
              title={post.title}
              date={post.date}
              slug={post.slug}
            />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
