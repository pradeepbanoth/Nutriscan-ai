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
    "Scan any packaged food and get instant AI health analysis — ingredients, additives, nutrition score, and personalized recommendations in seconds.",
  keywords: [
    "food scanner",
    "nutrition analysis",
    "healthy eating",
    "barcode scanner",
    "food health score",
    "ingredient checker",
    "AI nutrition",
    "food additives",
  ],
  authors: [{ name: "PAUSTICA" }],
  creator: "PAUSTICA",
  metadataBase: new URL("https://nutriscan-ai-orpin.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nutriscan-ai-orpin.vercel.app",
    title: "PAUSTICA — Scan food Smarter",
    description:
      "Scan any packaged food and get instant AI health analysis — ingredients, additives, nutrition score, and personalized recommendations in seconds.",
    siteName: "PAUSTICA",
    images: [
  {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "PAUSTICA food scanner app",
  },
],
  },
  twitter: {
    card: "summary_large_image",
    title: "PAUSTICA — Scan food Smarter",
    description:
      "Scan any packaged food and get instant AI health analysis in seconds.",
    creator: "@PAUSTICA",
     images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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