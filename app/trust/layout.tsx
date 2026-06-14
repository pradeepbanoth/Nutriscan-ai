import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trust Center | PAUSTICA",
  description:
    "Read PAUSTICA's FAQ, privacy policy, data usage, account deletion information, health disclaimer, and terms of service.",
};

export default function TrustLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}