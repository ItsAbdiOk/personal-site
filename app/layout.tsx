import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "@/styles/globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abdirahmanmohamed.dev"),
  title: {
    default: "Abdirahman Mohamed — ML Engineer & MSc AI Student at QMUL",
    template: "%s — Abdirahman Mohamed",
  },
  description:
    "Abdirahman Mohamed is an ML engineer and MSc AI student at Queen Mary University of London, specialising in speech and language processing. Building Arday, an English learning app for Somali speakers.",
  keywords: [
    "Abdirahman Mohamed",
    "Abdirahman Omar Mohamed",
    "ML engineer London",
    "MSc AI QMUL",
    "Queen Mary University of London",
    "speech and language processing",
    "Somali NLP",
    "Arday app",
    "machine learning portfolio",
  ],
  authors: [{ name: "Abdirahman Mohamed", url: "https://abdirahmanmohamed.dev" }],
  creator: "Abdirahman Mohamed",
  publisher: "Abdirahman Mohamed",
  alternates: {
    canonical: "https://abdirahmanmohamed.dev",
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Abdirahman Mohamed — ML Engineer & MSc AI Student at QMUL",
    description:
      "ML engineer and MSc AI student at QMUL, specialising in speech and language processing. Building Arday, an English learning app for Somali speakers.",
    url: "https://abdirahmanmohamed.dev",
    siteName: "Abdirahman Mohamed",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdirahman Mohamed — ML Engineer & MSc AI Student at QMUL",
    description:
      "ML engineer and MSc AI student at QMUL. Building Arday, an English learning app for Somali speakers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abdirahman Mohamed",
  givenName: "Abdirahman",
  familyName: "Mohamed",
  alternateName: "Abdirahman Omar Mohamed",
  jobTitle: "ML Engineer",
  description:
    "ML engineer and MSc AI student at Queen Mary University of London, specialising in speech and language processing.",
  url: "https://abdirahmanmohamed.dev",
  image: "https://abdirahmanmohamed.dev/opengraph-image",
  email: "mailto:hi@abdirahmanmohamed.dev",
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "United Kingdom",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Queen Mary University of London",
    url: "https://www.qmul.ac.uk",
  },
  knowsAbout: [
    "Machine Learning",
    "Natural Language Processing",
    "Speech Processing",
    "Text-to-Speech",
    "Somali language technology",
    "Next.js",
    "Python",
    "Swift",
  ],
  sameAs: [
    "https://github.com/ItsAbdiOk",
    "https://linkedin.com/in/abdirahmanomarmohamed",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Abdirahman Mohamed",
  url: "https://abdirahmanmohamed.dev",
  author: {
    "@type": "Person",
    name: "Abdirahman Mohamed",
  },
  inLanguage: "en-GB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
