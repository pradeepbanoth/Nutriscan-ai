type HeroProps = {
  onScan: () => void;
  onSearchFocus: () => void;
};

export default function Hero({ onScan, onSearchFocus }: HeroProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 mb-8">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <p className="text-sm font-bold text-gray-700">
              AI-powered food intelligence
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-none">
            Know what&apos;s really inside your food.
          </h1>

          <p className="mt-8 text-xl text-gray-500 max-w-xl mx-auto lg:mx-0">
            Scan packaged foods and instantly understand ingredients, additives,
            nutrition risks, and healthier alternatives.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button
              onClick={onScan}
              className="rounded-[22px] bg-orange-500 px-8 py-5 text-lg font-black text-white shadow-xl hover:bg-orange-600 transition"
            >
              Scan Product
            </button>

            <button
              onClick={onSearchFocus}
              className="rounded-[22px] bg-white px-8 py-5 text-lg font-black text-gray-900 border border-orange-100 shadow-sm hover:bg-orange-50 transition"
            >
              Search Food
            </button>
          </div>

          <p className="mt-5 text-sm font-semibold text-gray-400">
            Works with barcode, product search, and ingredient labels.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[48px] bg-orange-300/20 blur-3xl" />

          <div className="relative rounded-[44px] bg-white border border-orange-100 p-6 shadow-2xl">
            <div className="rounded-[36px] bg-gray-900 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm font-bold">
                    PAUSTICA Analysis
                  </p>
                  <h3 className="mt-1 text-2xl font-black">
                    Tomato Chips
                  </h3>
                </div>

                <div className="h-20 w-20 rounded-full bg-red-500/10 border border-red-400/30 flex items-center justify-center">
                  <span className="text-3xl font-black text-red-300">
                    38
                  </span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {["High salt", "NOVA 4", "Additives", "Better swap"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-white/10 border border-white/10 p-4"
                    >
                      <p className="text-sm font-black">{item}</p>
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 rounded-[28px] bg-white text-gray-900 p-5">
                <p className="text-sm font-black text-green-600">
                  Suggested alternative
                </p>
                <h4 className="mt-2 text-xl font-black">
                  Roasted makhana or baked chips
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  Lower processing, lighter salt profile, and cleaner snack choice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}