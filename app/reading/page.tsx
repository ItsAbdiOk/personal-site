import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Reading — Abdirahman Mohamed",
  description: "Books I'm reading, have read, or want to read.",
};

interface Book {
  title: string;
  author: string;
  status: "reading" | "read" | "want to read";
}

const books: Book[] = [
  {
    title: "Speech and Language Processing",
    author: "Jurafsky & Martin",
    status: "reading",
  },
  {
    title: "Deep Learning",
    author: "Goodfellow, Bengio & Courville",
    status: "reading",
  },
  {
    title: "Designing Machine Learning Systems",
    author: "Chip Huyen",
    status: "want to read",
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    status: "read",
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    status: "read",
  },
  {
    title: "Inspired",
    author: "Marty Cagan",
    status: "want to read",
  },
];

const statusOrder = { reading: 0, read: 1, "want to read": 2 };

function groupByStatus(books: Book[]) {
  const groups: Record<string, Book[]> = {};
  const sorted = [...books].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );
  for (const book of sorted) {
    if (!groups[book.status]) groups[book.status] = [];
    groups[book.status].push(book);
  }
  return groups;
}

const statusLabels: Record<string, string> = {
  reading: "Currently reading",
  read: "Read",
  "want to read": "Want to read",
};

export default function ReadingPage() {
  const groups = groupByStatus(books);

  return (
    <>
      <Nav />
      <main className="page-container">
        <section className={styles.header}>
          <h1>Reading</h1>
          <p className={styles.subtitle}>
            Books I&apos;m working through, or planning to.
          </p>
        </section>
        <section className={styles.content}>
          {Object.entries(groups).map(([status, items]) => (
            <div key={status} className={styles.group}>
              <h2 className={styles.groupLabel}>{statusLabels[status]}</h2>
              <div className={styles.list}>
                {items.map((book) => (
                  <div key={book.title} className={styles.book}>
                    <span className={styles.bookTitle}>{book.title}</span>
                    <span className={styles.bookAuthor}>{book.author}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
