import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PAUSTICA — Know What You're Eating",
    template: "%s | PAUSTICA",
  },
  description: "Scan any packaged food and get instant AI health analysis — ingredients, additives, nutrition score, and personalized recommendations in seconds.",
  keywords: ["food scanner", "nutrition analysis", "healthy eating", "barcode scanner", "food health score", "ingredient checker", "AI nutrition", "food additives"],
  authors: [{ name: "PAUSTICA" }],
creator: "PAUSTICA",
  metadataBase: new URL("https://PAUSTICA-ai-orpin.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://PAUSTICA-ai-orpin.vercel.app",
    title: "PAUSTICA — Know What You're Eating",
    description: "Scan any packaged food and get instant AI health analysis — ingredients, additives, nutrition score, and personalized recommendations in seconds.",
    siteName: "PAUSTICA",
  },
  twitter: {
    card: "summary_large_image",
    title: "PAUSTICA — Know What You're Eating",
    description: "Scan any packaged food and get instant AI health analysis in seconds.",
    creator: "@PAUSTICAai",
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
themeColor: "#f97316",
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
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
