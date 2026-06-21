import type { Metadata } from "next";
import "./globals.css";
import { Chelsea_Market, Livvic } from "next/font/google";
import PostHogProvider from "@/components/analytics/PostHogProvider";



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

  other: {
    "msvalidate.01": "AFA404068465C164B50B656107461928",
  },
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
  <PostHogProvider>
   <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",

        "@type": "Organization",

        name: "PAUSTICA",

        url: "https://nutriscan-ai-orpin.vercel.app",

        logo:
          "https://nutriscan-ai-orpin.vercel.app/logo.png",

        description:
          "PAUSTICA is an AI-powered food intelligence platform that helps users scan packaged foods, understand ingredients, compare products and choose healthier alternatives.",

        sameAs: [],
      }),
    }}
  />

  {children}

  <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "PAUSTICA",
      url: "https://nutriscan-ai-orpin.vercel.app",
      potentialAction: {
        "@type": "SearchAction",
        target:
          "https://nutriscan-ai-orpin.vercel.app/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    }),
  }}
/>

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: "PAUSTICA",
      operatingSystem: "Web, Android, iOS",
      applicationCategory: "HealthApplication",
      description:
        "PAUSTICA helps users scan packaged foods, understand ingredients, compare products and choose healthier alternatives.",
      url: "https://nutriscan-ai-orpin.vercel.app",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
    }),
  }}
/>

  </PostHogProvider>
</body>
  </html>
);
}