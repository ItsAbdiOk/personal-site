import type { Metadata } from "next";

// Private study guide: keep it out of search engines.
export const metadata: Metadata = {
  title: { default: "Zakiya · Physics", template: "%s · Zakiya" },
  description: "Study guide for OCR A Physics.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function ZakiyaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
