const steps = [
  ["Scan", "Scan barcode or search a product."],
  ["Understand", "Get score, risks, ingredients, and nutrition insights."],
  ["Choose Better", "Find cleaner alternatives and make smarter choices."],
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="rounded-[40px] bg-gray-900 p-8 md:p-12 text-white">
        <h2 className="text-4xl md:text-5xl font-black text-center">
          Scan → Understand → Choose better
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {steps.map(([title, desc], index) => (
            <div key={title} className="rounded-[28px] bg-white/10 border border-white/10 p-6">
              <p className="text-orange-300 font-black">0{index + 1}</p>
              <h3 className="mt-3 text-2xl font-black">{title}</h3>
              <p className="mt-3 text-white/70">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
