import type { Metadata } from "next";
import Header from "@/components/zakiya/Header";
import MyNotes from "@/components/zakiya/MyNotes";
import s from "@/components/zakiya/zakiya.module.css";

export const metadata: Metadata = {
  title: "My notes",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function MyNotesPage() {
  return (
    <div className={s.root}>
      <Header crumbs={[{ label: "Zakiya", href: "/zakiya" }, { label: "My notes" }]} />
      <main className={s.page} style={{ animation: "none" }}>
        <MyNotes />
      </main>
    </div>
  );
}
