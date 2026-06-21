import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trust Center",

  description:
    "Read PAUSTICA FAQs, privacy policy, terms of service, scientific references and data practices.",

  alternates: {
    canonical: "/trust",
  },

  openGraph: {
    title: "PAUSTICA Trust Center",

    description:
      "Learn how PAUSTICA protects your data and explains food intelligence.",

    url: "/trust",
  },
};

export default function TrustLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}