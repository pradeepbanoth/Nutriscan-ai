import Link from "next/link";

const categories = [
  {
    title: "Beverages",
    desc: "Soft drinks, juices, energy drinks and hydration choices.",
    href: "/search?category=beverages",
  },
  {
    title: "Snacks",
    desc: "Chips, biscuits, namkeen and packaged snack foods.",
    href: "/search?category=snacks",
  },
  {
    title: "Breakfast",
    desc: "Cereals, oats, spreads and quick morning foods.",
    href: "/search?category=breakfast",
  },
  {
    title: "Dairy",
    desc: "Milk drinks, yogurt, cheese and flavored dairy products.",
    href: "/search?category=dairy",
  },
  {
    title: "Instant Foods",
    desc: "Noodles, ready-to-eat meals and processed convenience foods.",
    href: "/search?category=instant-foods",
  },
  {
    title: "Kids Food",
    desc: "Popular packaged foods often bought for children.",
    href: "/search?category=kids-food",
  },
];

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-[#fff7ed]">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-16 text-center">
          <p className="text-sm font-black uppercase tracking-wider text-orange-600">
            Discover Foods
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-black text-gray-900">
            Explore food categories
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500">
            Start with a category and quickly find foods worth scanning,
            comparing, or replacing with healthier choices.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-2xl font-black text-gray-900">
                {category.title}
              </h2>

              <p className="mt-4 text-gray-500 leading-relaxed">
                {category.desc}
              </p>

              <p className="mt-6 text-sm font-black text-orange-600">
                Explore category →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-gray-100 bg-gray-900 p-8 shadow-sm">
  <p className="text-sm font-black uppercase tracking-wider text-orange-400">
    Smart picks
  </p>

  <h2 className="mt-3 text-3xl font-black text-white">
    Popular foods to check first
  </h2>

  <div className="mt-8 flex flex-wrap gap-3">
    {["Maggi", "Diet Coke", "Nutella", "Red Bull", "Lay's", "Oreo"].map(
      (item) => (
        <Link
          key={item}
          href={`/search?q=${encodeURIComponent(item)}`}
          className="rounded-full bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
        >
          {item}
        </Link>
      )
    )}
  </div>
</div>

        <div className="mt-16 rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black uppercase tracking-wider text-orange-600">
            Not sure where to start?
          </p>

          <h2 className="mt-3 text-3xl font-black text-gray-900">
            Search any product directly
          </h2>

          <p className="mt-4 text-gray-500">
            PAUSTICA can analyze packaged foods by name or barcode.
          </p>

          <Link
            href="/search"
            className="mt-8 inline-flex rounded-full bg-gray-900 px-8 py-4 text-sm font-black text-white transition hover:bg-black"
          >
            Search Food
          </Link>
        </div>
      </section>
    </main>
  );
}