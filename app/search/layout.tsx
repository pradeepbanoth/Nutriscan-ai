import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Food",
  description:
    "Search packaged foods by name and understand nutrition, ingredients, health scores, processing levels and better alternatives.",
  alternates: {
    canonical: "/search",
  },
  openGraph: {
    title: "PAUSTICA Search Food",
    description:
      "Search foods and get instant AI-powered nutrition and ingredient insights.",
    url: "/search",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}