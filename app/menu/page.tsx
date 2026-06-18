import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "Home",
    description: "Understand what PAUSTICA does.",
    href: "/",
  },
  {
    title: "Scan",
    description: "Scan barcodes and analyze packaged food.",
    href: "/scan",
  },
  {
    title: "Search",
    description: "Find any packaged food by name.",
    href: "/search",
  },
  {
    title: "Compare",
    description: "Compare two foods side by side.",
    href: "/compare",
  },
  {
    title: "Discover",
    description: "Explore food categories and smarter choices.",
    href: "/discover",
  },
  {
    title: "Learn",
    description: "Understand food labels and PAUSTICA scores.",
    href: "/learn",
  },
  {
    title: "History",
    description: "Track your scans and food habits.",
    href: "/history",
  },
  {
    title: "Profile",
    description: "Manage goals, preferences and account settings.",
    href: "/profile",
  },
  {
    title: "Pricing",
    description: "Compare free and premium PAUSTICA plans.",
    href: "/pricing",
  },
];

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#fff7ed]">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="PAUSTICA"
              width={48}
              height={48}
              className="object-contain"
              priority
            />

            <span className="text-2xl font-black text-gray-900">
              PAUSTICA
            </span>
          </Link>

          <Link
            href="/scan"
            className="rounded-full bg-gray-900 px-6 py-3 text-sm font-black text-white"
          >
            Scan Food
          </Link>
        </div>

        <div className="mb-16 text-center">
          <p className="text-sm font-black uppercase tracking-wider text-orange-600">
            Menu
          </p>

          <h1 className="mt-4 text-4xl font-black text-gray-900 md:text-6xl">
            Explore PAUSTICA
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            One clean place to access scanning, search, comparison, learning,
            profile, history and pricing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-2xl font-black text-gray-900">
                {item.title}
              </h2>

              <p className="mt-4 leading-relaxed text-gray-500">
                {item.description}
              </p>

              <p className="mt-6 text-sm font-black text-orange-600">
                Open →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}