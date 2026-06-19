import Link from "next/link";
import { PAUSTICA } from "@/lib/designSystem";

const actions = [
  {
    title: "Scan",
    desc: "Analyze a packaged food by barcode.",
    href: "/scan",
  },
  {
    title: "Search",
    desc: "Find a product by name.",
    href: "/search",
  },
  {
    title: "Compare",
    desc: "Choose the better option.",
    href: "/compare",
  },
];

export default function ActionCards() {
  return (
    <section className={`${PAUSTICA.container} ${PAUSTICA.section}`}>
      <div className="mb-12 text-center">
        <p className={PAUSTICA.pageHeader.badge}>Start here</p>

        <h2 className="mt-3 text-4xl font-black text-gray-900">
          What do you want to check?
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={PAUSTICA.card.primary}
          >
            <h3 className="text-2xl font-black text-gray-900">
              {action.title}
            </h3>

            <p className="mt-4 text-gray-500">{action.desc}</p>

            <p className="mt-8 text-sm font-black text-orange-600">
              Open →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}