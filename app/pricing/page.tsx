import Image from "next/image";
import Link from "next/link";
import { plans } from "../../lib/plans";

const freeFeatures = [
  "Barcode scanning",
  "Basic health score",
  "Favorites",
  "Scan history",
  "10 scans/day",
];

const premiumFeatures = [
  "Unlimited scans",
  "OCR ingredient scanner",
  "Food photo AI",
  "AI nutrition coach",
  "Weekly health reports",
  "Product comparison",
  "Smart alternatives",
];

export default function PricingPage() {
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
            Pricing
          </p>

          <h1 className="mt-4 text-4xl font-black text-gray-900 md:text-6xl">
            Choose your PAUSTICA plan
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Start free. Upgrade when you need deeper food intelligence,
            unlimited scans, smart comparisons and weekly health insights.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <PlanCard
            name={plans.free.name}
            price={plans.free.price}
            desc="Best for trying PAUSTICA and scanning basic packaged foods."
            features={freeFeatures}
            cta="Start Free"
            href="/auth"
          />

          <PlanCard
            name={plans.premium.name}
            price={plans.premium.price}
            desc="For users who want full AI nutrition intelligence and smarter shopping decisions."
            features={premiumFeatures}
            cta="Upgrade Coming Soon"
            href="/pricing"
            highlighted
          />
        </div>
      </section>
    </main>
  );
}

function PlanCard({
  name,
  price,
  desc,
  features,
  cta,
  href,
  highlighted = false,
}: {
  name: string;
  price: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={
        highlighted
          ? "relative overflow-hidden rounded-3xl bg-gray-900 p-8 text-white shadow-sm"
          : "rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
      }
    >
      {highlighted && (
        <div className="absolute right-6 top-6 rounded-full bg-white px-4 py-2 text-sm font-black text-gray-900">
          Recommended
        </div>
      )}

      <h2 className="text-3xl font-black">{name}</h2>

      <p
        className={
          highlighted
            ? "mt-4 text-5xl font-black text-orange-400"
            : "mt-4 text-5xl font-black text-orange-600"
        }
      >
        {price}
      </p>

      <p
        className={
          highlighted ? "mt-6 text-gray-300" : "mt-6 text-gray-500"
        }
      >
        {desc}
      </p>

      <ul className="mt-8 space-y-4">
        {features.map((feature) => (
          <li
            key={feature}
            className={highlighted ? "font-bold text-gray-100" : "font-bold text-gray-700"}
          >
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={
          highlighted
            ? "mt-8 block w-full rounded-2xl bg-white py-4 text-center font-black text-gray-900"
            : "mt-8 block w-full rounded-2xl border border-gray-100 bg-orange-50 py-4 text-center font-black text-orange-600"
        }
      >
        {cta}
      </Link>
    </div>
  );
}