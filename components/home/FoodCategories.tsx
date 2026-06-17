"use client";

const categories = [
  "Chips & snacks",
  "Soft drinks",
  "Breakfast cereals",
  "Protein bars",
  "Instant noodles",
  "Biscuits",
  "Packaged juices",
  "Frozen foods",
];

export default function FoodCategories() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="rounded-[44px] bg-white border border-orange-100 p-8 md:p-12 shadow-xl">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
              Food Coverage
            </p>

            <h2 className="mt-4 text-4xl md:text-6xl font-black text-gray-900">
              Built for the foods people actually buy.
            </h2>

            <p className="mt-5 text-lg text-gray-500">
              From snacks to drinks, PAUSTICA helps users understand everyday packaged foods before they eat.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((item) => (
              <div
                key={item}
                className="rounded-full border border-orange-100 bg-orange-50 px-5 py-3 font-black text-gray-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}