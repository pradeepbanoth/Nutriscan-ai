import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",

  description:
    "Choose a PAUSTICA plan and unlock AI-powered food intelligence, unlimited scans, smart comparisons and weekly health insights.",

  alternates: {
    canonical: "/pricing",
  },

  openGraph: {
    title: "PAUSTICA Pricing",

    description:
      "Unlock premium food intelligence with PAUSTICA.",

    url: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}