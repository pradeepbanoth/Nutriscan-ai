import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nutriscan-ai-orpin.vercel.app";

export const metadata: Metadata = {
  title: "Compare Foods | PAUSTICA",

  description:
    "Compare packaged foods side by side using nutrition, ingredients, processing levels, allergy signals, and PAUSTICA health scores.",

  alternates: {
    canonical: `${siteUrl}/compare`,
  },

  openGraph: {
    title: "Compare Foods | PAUSTICA",
    description:
      "Compare packaged foods instantly and choose the healthier option with PAUSTICA.",
    url: `${siteUrl}/compare`,
    siteName: "PAUSTICA",
    type: "website",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 512,
        height: 512,
        alt: "PAUSTICA",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Compare Foods | PAUSTICA",
    description:
      "Compare packaged foods instantly and choose the healthier option with PAUSTICA.",
    images: [`${siteUrl}/logo.png`],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function CompareLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}