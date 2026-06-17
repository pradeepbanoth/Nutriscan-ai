import Image from "next/image";

const features = [
  {
    title: "Ingredient Intelligence",
    desc: "Understand additives and risky ingredients clearly.",
    image: "/images/features/ingredient-intelligence.png",
  },

  {
    title: "Score Breakdown",
    desc: "See sugar, salt, fat, additives, and processing impact.",
    image: "/images/features/score-breakdown.png",
  },

  {
    title: "Personalized Goals",
    desc: "Analyze for diabetes, weight loss, gym, kids, and heart health.",
    image: "/images/features/personalized-goals.png",
  },

  {
    title: "Better Alternatives",
    desc: "Get smarter choices instead of just warnings.",
    image: "/images/features/better-alternatives.png",
  },
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
        {features.map((item) => (
        <div
  key={item.title}
  className="group rounded-[32px] bg-white border border-orange-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
>

  <div className="relative h-52">

    <Image
      src={item.image}
      alt={item.title}
      fill
      className="object-cover"
    />

  </div>

  <div className="p-6">

    <h3 className="text-xl font-black text-gray-900">
      {item.title}
    </h3>

    <p className="mt-3 text-gray-500 leading-relaxed">
      {item.desc}
    </p>

  </div>

</div>
        ))}
      </div>
    </section>
  );
}
