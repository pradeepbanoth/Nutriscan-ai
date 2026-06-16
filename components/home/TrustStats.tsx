const stats = [
  { value: "2M+", label: "Products indexed" },
  { value: "50+", label: "Additives checked" },
  { value: "Instant", label: "Food analysis" },
  { value: "Goals", label: "Personalized scoring" },
];

export default function TrustStats() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-[28px] border border-orange-100 bg-white/80 p-6 text-center shadow-sm"
          >
            <h3 className="text-2xl md:text-3xl font-black text-gray-900">
              {item.value}
            </h3>
            <p className="mt-2 text-sm font-bold text-gray-500">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}