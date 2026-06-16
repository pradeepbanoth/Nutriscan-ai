type FinalCTAProps = {
  onScan: () => void;
};

export default function FinalCTA({ onScan }: FinalCTAProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="rounded-[44px] bg-white border border-orange-100 p-10 md:p-16 text-center shadow-2xl">
        <h2 className="text-4xl md:text-6xl font-black text-gray-900">
          Make every food choice smarter.
        </h2>

        <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto">
          Start with one scan and see what is really inside your food.
        </p>

        <button
          onClick={onScan}
          className="mt-8 rounded-[22px] bg-orange-500 px-9 py-5 text-lg font-black text-white shadow-xl hover:bg-orange-600 transition"
        >
          Start Scanning Free
        </button>
      </div>
    </section>
  );
}