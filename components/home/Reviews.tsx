import { PAUSTICA } from "@/lib/designSystem";

const reviews = [
  {
    quote:
      "PAUSTICA makes packaged food decisions feel simple. The score, ingredient warnings, and better choices are easy to understand.",
    name: "Early Tester",
    role: "Health-conscious user",
  },
  {
    quote:
      "The app feels useful before grocery shopping. I can quickly check products instead of guessing from marketing labels.",
    name: "Beta User",
    role: "Everyday shopper",
  },
  {
    quote:
      "The biggest value is clarity. PAUSTICA explains why a product may not be ideal instead of just showing numbers.",
    name: "Product Feedback",
    role: "Nutrition-focused user",
  },
];

export default function Reviews() {
  return (
    <section className={`${PAUSTICA.container} py-20`}>
      <div className="mb-12 text-center">
        <p className={PAUSTICA.pageHeader.badge}>User feedback</p>

        <h2 className="mt-3 text-4xl font-black text-gray-900">
          Built for real food decisions
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.quote} className={PAUSTICA.card.primary}>
            <p className="text-lg font-semibold leading-relaxed text-gray-700">
              “{review.quote}”
            </p>

            <div className="mt-8">
              <p className="font-black text-gray-900">{review.name}</p>
              <p className="mt-1 text-sm font-bold text-orange-600">
                {review.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}