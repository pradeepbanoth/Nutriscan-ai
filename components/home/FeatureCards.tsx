const features = [
  ["Ingredient Intelligence", "Understand additives and risky ingredients clearly."],
  ["Score Breakdown", "See sugar, salt, fat, additives, and processing impact."],
  ["Personalized Goals", "Analyze for diabetes, weight loss, gym, kids, and heart health."],
  ["Better Alternatives", "Get smarter choices instead of just warnings."],
];

export default function FeatureCards() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900">
          Not just a scanner. A food decision engine.
        </h2>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {features.map(([title, desc]) => (
          <div key={title} className="rounded-[32px] bg-white border border-orange-100 p-6 shadow-sm">
            <h3 className="text-xl font-black text-gray-900">{title}</h3>
            <p className="mt-3 text-gray-500">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
