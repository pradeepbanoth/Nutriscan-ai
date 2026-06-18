import Link from "next/link";

const actions = [
  {
    title: "Scan Food",
    desc: "Scan any barcode instantly.",
    href: "/scan",
  },
  {
    title: "Search Food",
    desc: "Find foods manually.",
    href: "/search",
  },
  {
    title: "Compare Foods",
    desc: "Compare healthier choices.",
    href: "/compare",
  },
  {
    title: "Profile",
    desc: "Track your health journey.",
    href: "/profile",
  },
];

export default function ActionCards() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-14">

        <p className="text-sm font-bold text-orange-600 uppercase">
          Main actions
        </p>

        <h2 className="text-4xl font-black text-gray-900 mt-3">
          What would you like to do?
        </h2>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {actions.map((action) => (

          <Link
            key={action.title}
            href={action.href}
            className="bg-white rounded-3xl border border-gray-100 p-8 hover:-translate-y-1 transition"
          >

            <h3 className="text-xl font-black text-gray-900">
              {action.title}
            </h3>

            <p className="mt-3 text-gray-500">
              {action.desc}
            </p>

          </Link>

        ))}

      </div>
    </section>
  );
}