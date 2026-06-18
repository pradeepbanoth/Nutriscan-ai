import Link from "next/link";

const lessons = [
  {
    title: "Understand PAUSTICA Score",
    desc: "Learn how sugar, fat, salt, ingredients and processing affect scores.",
  },

  {
    title: "What is NOVA?",
    desc: "Understand ultra-processed foods and why they matter.",
  },

  {
    title: "Decode Ingredients",
    desc: "Learn how to identify harmful additives and hidden sugars.",
  },

  {
    title: "Read Nutrition Labels",
    desc: "Understand calories, sugar, fat, sodium and serving sizes.",
  },

  {
    title: "Shop Smarter",
    desc: "Learn how to compare products before buying.",
  },

  {
    title: "Build Better Habits",
    desc: "Small daily changes that improve long-term health.",
  },
];

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[#fff7ed]">
      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="mb-16 text-center">

          <p className="text-sm font-black uppercase tracking-wider text-orange-600">
            Learn
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-black text-gray-900">
            Learn how to eat smarter
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500">
            PAUSTICA teaches you how to understand packaged foods instead of
            blindly trusting marketing labels.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {lessons.map((lesson) => (
            <div
              key={lesson.title}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
            >
              <h2 className="text-2xl font-black text-gray-900">
                {lesson.title}
              </h2>

              <p className="mt-4 text-gray-500 leading-relaxed">
                {lesson.desc}
              </p>
            </div>
          ))}

        </div>

        <div className="mt-16 rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">

          <p className="text-sm font-black uppercase tracking-wider text-orange-600">
            Practice
          </p>

          <h2 className="mt-3 text-3xl font-black text-gray-900">
            Learn by scanning real foods
          </h2>

          <p className="mt-4 text-gray-500">
            The fastest way to understand nutrition is to analyze products you
            consume every day.
          </p>

          <Link
            href="/scan"
            className="mt-8 inline-flex rounded-full bg-gray-900 px-8 py-4 text-sm font-black text-white transition hover:bg-black"
          >
            Start Scanning
          </Link>

        </div>

      </section>
    </main>
  );
}