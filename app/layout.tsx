import type { Metadata } from "next";
import "./globals.css";
import { Chelsea_Market, Livvic } from "next/font/google";

const chelsea = Chelsea_Market({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const livvic = Livvic({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "PAUSTICA — Know What You're Eating",
    template: "%s | PAUSTICA",
  },
  description:
    "PAUSTICA helps you scan, search, compare and understand packaged foods using nutrition data, ingredient signals, processing levels and AI-powered food intelligence.",
  keywords: [
    "PAUSTICA",
    "food scanner",
    "barcode food scanner",
    "nutrition analysis",
    "ingredient checker",
    "food health score",
    "AI nutrition app",
    "processed food checker",
    "food additives",
    "healthy food choices",
  ],
  authors: [{ name: "PAUSTICA" }],
  creator: "PAUSTICA",
  publisher: "PAUSTICA",
  applicationName: "PAUSTICA",
  metadataBase: new URL("https://nutriscan-ai-orpin.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "PAUSTICA — Know What You're Eating",
    description:
      "Scan, search and compare packaged foods with AI-powered nutrition and ingredient intelligence.",
    siteName: "PAUSTICA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PAUSTICA food scanner and nutrition intelligence app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PAUSTICA — Know What You're Eating",
    description:
      "Scan, search and compare packaged foods with AI-powered food intelligence.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "oX05GxtLTymWRqGhzESU9-Nryc0XlfGSjmQQj2-4UPg",
  },
  manifest: "/manifest.json",
};
export const viewport = {
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 return (
  <html
    lang="en"
    className={`${chelsea.variable} ${livvic.variable} h-full antialiased`}
  >
    <body className="min-h-screen font-body">
      {children}
    </body>
  </html>
);
}