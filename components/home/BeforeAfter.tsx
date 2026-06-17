"use client";

export default function BeforeAfter() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-[40px] bg-white border border-red-100 p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-500">
            Before
          </p>
          <h3 className="mt-4 text-4xl font-black text-gray-900">
            Confusing food labels
          </h3>
          <p className="mt-4 text-gray-500 text-lg">
            Calories, additives, NOVA, sugar, salt, and ingredients are hard to understand quickly.
          </p>
        </div>

        <div className="rounded-[40px] bg-gray-950 p-8 shadow-2xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-400">
            After PAUSTICA
          </p>
          <h3 className="mt-4 text-4xl font-black text-white">
            Clear food decisions
          </h3>
          <p className="mt-4 text-gray-300 text-lg">
            Get a simple score, warnings, ingredient explanation, and healthier alternatives instantly.
          </p>
        </div>
      </div>
    </section>
  );
}