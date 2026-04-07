import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ReadingProgress";
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

  const url = `https://www.abdirahmanmohamed.dev/writing/${params.slug}`;

  return {
    title: post.meta.title,
    description: post.meta.description,
    authors: [{ name: "Abdirahman Mohamed", url: "https://www.abdirahmanmohamed.dev" }],
    alternates: { canonical: url },
    openGraph: {
      title: post.meta.title,
      description: post.meta.description || "",
      type: "article",
      url,
      publishedTime: post.meta.date,
      authors: ["Abdirahman Mohamed"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description || "",
    },
  };
}

export default function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const url = `https://www.abdirahmanmohamed.dev/writing/${params.slug}`;
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta.title,
    description: post.meta.description || "",
    datePublished: post.meta.date,
    dateModified: post.meta.date,
    author: {
      "@type": "Person",
      name: "Abdirahman Mohamed",
      url: "https://www.abdirahmanmohamed.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Abdirahman Mohamed",
      url: "https://www.abdirahmanmohamed.dev",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    image: "https://www.abdirahmanmohamed.dev/opengraph-image",
    inLanguage: "en-GB",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <ReadingProgress />
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
