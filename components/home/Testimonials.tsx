"use client";

const testimonials = [
  {
    name: "Ananya",
    role: "Fitness enthusiast",
    text: "PAUSTICA helped me stop buying snacks that only looked healthy.",
  },

  {
    name: "Rahul",
    role: "Working professional",
    text: "The ingredient explanations are much easier to understand than nutrition labels.",
  },

  {
    name: "Priya",
    role: "Parent",
    text: "I use PAUSTICA before buying packaged foods for my family.",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="text-center mb-16">

        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
          Community
        </p>

        <h2 className="mt-4 text-4xl md:text-6xl font-black text-gray-900">
          Built for everyday food decisions
        </h2>

        <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto">
          PAUSTICA turns confusing food labels into simple decisions.
        </p>

      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {testimonials.map((item) => (

          <div
            key={item.name}
            className="rounded-[36px] bg-white border border-orange-100 p-8 shadow-sm hover:shadow-xl transition-all"
          >

            <div className="mb-6 flex items-center gap-4">

              <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center text-xl font-black text-orange-600">

                {item.name.charAt(0)}

              </div>

              <div>

                <h3 className="font-black text-gray-900">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.role}
                </p>

              </div>

            </div>

            <p className="text-gray-600 leading-relaxed">
              "{item.text}"
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}