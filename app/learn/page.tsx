import Link from "next/link";

const lessons = [
  {
    title: "Understand PAUSTICA Score",
    desc: "See how sugar, fat, salt, ingredients, and processing affect the final score.",
    level: "Beginner",
  },
  {
    title: "What is NOVA?",
    desc: "Learn why ultra-processed foods matter and how to identify them quickly.",
    level: "Beginner",
  },
  {
    title: "Decode Ingredients",
    desc: "Spot additives, hidden sugars, palm oil, preservatives, and risky ingredients.",
    level: "Core Skill",
  },
  {
    title: "Read Nutrition Labels",
    desc: "Understand calories, sugar, fat, sodium, serving sizes, and label tricks.",
    level: "Core Skill",
  },
  {
    title: "Shop Smarter",
    desc: "Compare products before buying and choose better alternatives confidently.",
    level: "Practical",
  },
  {
    title: "Build Better Habits",
    desc: "Use small daily food decisions to improve long-term health consistency.",
    level: "Practical",
  },
];

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[#fff7ed]">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-[40px] bg-gray-900 px-8 py-16 text-center text-white md:px-14">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-300">
              PAUSTICA Learn
            </p>

            <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              Learn how to read food like a nutrition expert
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
              Simple lessons that help you understand packaged foods, avoid
              misleading labels, and make smarter choices every day.
            </p>

            <Link
              href="/scan"
              className="mt-8 inline-flex rounded-full bg-orange-500 px-8 py-4 text-sm font-black text-white transition hover:bg-orange-600"
            >
              Practice by Scanning
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson, index) => (
            <article
              key={lesson.title}
              className="rounded-3xl border border-orange-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-orange-600">
                  {lesson.level}
                </span>

                <span className="text-sm font-black text-gray-300">
                  0{index + 1}
                </span>
              </div>

              <h2 className="text-2xl font-black text-gray-900">
                {lesson.title}
              </h2>

              <p className="mt-4 leading-relaxed text-gray-500">
                {lesson.desc}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-orange-100">
            <h3 className="text-4xl font-black text-orange-600">6</h3>
            <p className="mt-2 font-bold text-gray-700">Food basics</p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm border border-orange-100">
            <h3 className="text-4xl font-black text-orange-600">3 min</h3>
            <p className="mt-2 font-bold text-gray-700">Easy lessons</p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm border border-orange-100">
            <h3 className="text-4xl font-black text-orange-600">Daily</h3>
            <p className="mt-2 font-bold text-gray-700">Smarter choices</p>
          </div>
        </div>
      </section>
    </main>
  );
}