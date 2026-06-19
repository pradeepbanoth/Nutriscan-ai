import { PAUSTICA } from "@/lib/designSystem";

const steps = [
  ["Scan", "Scan a barcode or search a product."],

  ["Understand", "See health scores, ingredients, and nutrition insights."],

  ["Choose Better", "Find healthier alternatives and make smarter decisions."],
];

export default function HowItWorks() {
  return (
    <section className={`${PAUSTICA.container} py-20`}>
      <div className="rounded-[40px] bg-gray-900 p-10 md:p-14 text-white">

        <div className="text-center mb-12">

          <p className="text-sm font-black uppercase tracking-wider text-orange-300">
            How it works
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-black">
            Scan → Understand → Choose Better
          </h2>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {steps.map(([title, desc], index) => (
            <div
              key={title}
              className="rounded-3xl bg-white/5 p-8"
            >
              <p className="text-sm font-black text-orange-300">
                0{index + 1}
              </p>

              <h3 className="mt-4 text-2xl font-black">
                {title}
              </h3>

              <p className="mt-4 text-white/70 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}