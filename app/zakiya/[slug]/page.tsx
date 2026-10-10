import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubchapterView from "@/components/zakiya/SubchapterView";
import { SUBCHAPTERS, getSubchapter } from "@/content/zakiya";

export const dynamicParams = false;

export function generateStaticParams() {
  return SUBCHAPTERS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const sub = getSubchapter(params.slug);
  return {
    title: sub ? `${sub.number} ${sub.title}` : "Not found",
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const sub = getSubchapter(params.slug);
  if (!sub) notFound();
  return <SubchapterView sub={sub} />;
}
