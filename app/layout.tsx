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
  icons: {
    icon: "/favicon.svg",
  },
  title: "Abdirahman Mohamed — ML Engineer",
  description:
    "MSc AI student at Queen Mary University of London, specialising in speech and language processing. Building products that make language accessible.",
  metadataBase: new URL("https://abdirahmanmohamed.dev"),
  openGraph: {
    title: "Abdirahman Mohamed — ML Engineer",
    description:
      "MSc AI student at QMUL, specialising in speech and language processing.",
    url: "https://abdirahmanmohamed.dev",
    siteName: "Abdirahman Mohamed",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdirahman Mohamed — ML Engineer",
    description:
      "MSc AI student at QMUL, specialising in speech and language processing.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
      </head>
      <body>{children}</body>
    </html>
  );
}
