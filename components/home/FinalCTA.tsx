type FinalCTAProps = {
  onScan: () => void;
};

export default function FinalCTA({ onScan }: FinalCTAProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="relative overflow-hidden rounded-[52px] bg-gray-950 p-8 md:p-16 text-center shadow-2xl">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-500/30 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-yellow-400/10 blur-[90px]" />

        <div className="relative z-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-400">
            Start smarter eating
          </p>

          <h2 className="mt-5 text-4xl md:text-7xl font-black text-white tracking-tight">
            Make every food choice smarter.
          </h2>

          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Scan a product, understand the risks, and discover better alternatives in seconds.
          </p>

          <button
            onClick={onScan}
            className="mt-9 rounded-[24px] bg-orange-500 px-10 py-5 text-lg font-black text-white shadow-xl hover:bg-orange-600 hover:scale-[1.02] transition"
          >
            Start Scanning Free
          </button>
        </div>
      </div>
    </section>
  );
}