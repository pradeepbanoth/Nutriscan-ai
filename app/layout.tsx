import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NutriScan AI — Know What You're Eating",
    template: "%s | NutriScan AI",
  },
  description: "Scan any packaged food and get instant AI health analysis — ingredients, additives, nutrition score, and personalized recommendations in seconds.",
  keywords: ["food scanner", "nutrition analysis", "healthy eating", "barcode scanner", "food health score", "ingredient checker", "AI nutrition", "food additives"],
  authors: [{ name: "Pradeep Banoth" }],
  creator: "Pradeep Banoth",
  metadataBase: new URL("https://nutriscan-ai-orpin.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nutriscan-ai-orpin.vercel.app",
    title: "NutriScan AI — Know What You're Eating",
    description: "Scan any packaged food and get instant AI health analysis — ingredients, additives, nutrition score, and personalized recommendations in seconds.",
    siteName: "NutriScan AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriScan AI — Know What You're Eating",
    description: "Scan any packaged food and get instant AI health analysis in seconds.",
    creator: "@nutriscanai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
