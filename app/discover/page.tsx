import Link from "next/link";

const categories = [
  {
    title: "Beverages",
    desc: "Soft drinks, juices, energy drinks and hydration choices.",
    href: "/search?category=beverages",
    tag: "Sugar watch",
  },
  {
    title: "Snacks",
    desc: "Chips, biscuits, namkeen and packaged snack foods.",
    href: "/search?category=snacks",
    tag: "Processing check",
  },
  {
    title: "Breakfast",
    desc: "Cereals, oats, spreads and quick morning foods.",
    href: "/search?category=breakfast",
    tag: "Morning staples",
  },
  {
    title: "Dairy",
    desc: "Milk drinks, yogurt, cheese and flavored dairy products.",
    href: "/search?category=dairy",
    tag: "Protein & sugar",
  },
  {
    title: "Instant Foods",
    desc: "Noodles, ready-to-eat meals and processed convenience foods.",
    href: "/search?category=instant-foods",
    tag: "NOVA risk",
  },
  {
    title: "Kids Food",
    desc: "Popular packaged foods often bought for children.",
    href: "/search?category=kids-food",
    tag: "Family safety",
  },
];

const smartPicks = ["Maggi", "Diet Coke", "Nutella", "Red Bull", "Lay's", "Oreo"];

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-[#fff7ed]">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-[40px] bg-gray-900 px-8 py-16 text-center text-white shadow-sm">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-orange-300/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-300">
              Discover Foods
            </p>

            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black md:text-6xl">
              Explore smarter food choices
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
              Browse categories, compare packaged foods, and find healthier
              alternatives using PAUSTICA’s food intelligence.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-6 inline-flex rounded-full bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-orange-600">
                {category.tag}
              </div>

              <h2 className="text-2xl font-black text-gray-900">
                {category.title}
              </h2>

              <p className="mt-4 leading-relaxed text-gray-500">
                {category.desc}
              </p>

              <p className="mt-8 text-sm font-black text-orange-600 transition group-hover:translate-x-1">
                Explore category →
              </p>
            </Link>
          ))}
        </div>

        <section className="mt-16 rounded-[36px] border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-orange-600">
                Smart picks
              </p>

              <h2 className="mt-3 text-3xl font-black text-gray-900">
                Popular foods to check first
              </h2>

              <p className="mt-3 max-w-xl text-gray-500">
                Start with common packaged foods people often scan before buying.
              </p>
            </div>

            <Link
              href="/scan"
              className="rounded-full bg-gray-900 px-7 py-4 text-sm font-black text-white transition hover:bg-black"
            >
              Open Scanner
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {smartPicks.map((item) => (
              <Link
                key={item}
                href={`/search?q=${encodeURIComponent(item)}`}
                className="rounded-full bg-orange-50 px-5 py-3 text-sm font-black text-orange-600 transition hover:bg-orange-100"
              >
                {item}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[36px] border border-orange-100 bg-orange-50 p-8 text-center">
          <p className="text-sm font-black uppercase tracking-wider text-orange-600">
            Not sure where to start?
          </p>

          <h2 className="mt-3 text-3xl font-black text-gray-900">
            Search any product directly
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            Type a product name, scan a barcode, or compare two foods before
            buying.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/search"
              className="rounded-full bg-gray-900 px-8 py-4 text-sm font-black text-white transition hover:bg-black"
            >
              Search Food
            </Link>

            <Link
              href="/compare"
              className="rounded-full bg-white px-8 py-4 text-sm font-black text-gray-900 transition hover:shadow-sm"
            >
              Compare Foods
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}