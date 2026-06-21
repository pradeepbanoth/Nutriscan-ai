import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Foods",

  description:
    "Compare packaged foods side by side using ingredients, nutrition, processing levels and PAUSTICA health scores.",

  alternates: {
    canonical: "/compare",
  },

  openGraph: {
    title: "PAUSTICA Compare Foods",

    description:
      "Compare foods and make smarter decisions instantly.",

    url: "/compare",
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}