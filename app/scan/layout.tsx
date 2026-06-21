import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan Food",
  description:
    "Scan barcodes and analyze packaged foods using PAUSTICA health scores, ingredient intelligence, processing levels and healthier alternatives.",
  alternates: {
    canonical: "/scan",
  },
  openGraph: {
    title: "PAUSTICA Scan Food",
    description:
      "Scan packaged foods and understand ingredients, nutrition and healthier alternatives instantly.",
    url: "/scan",
  },
};

export default function ScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
