import Image from "next/image";

type HeroProps = {
  onScan: () => void;
  onSearchFocus: () => void;
};

export default function Hero({ onScan, onSearchFocus }: HeroProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-24 pb-24">
     <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
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

        <div className="relative flex items-center justify-center">

  <div className="absolute h-[420px] w-[420px] rounded-full bg-orange-300/20 blur-[100px]" />

  <div className="relative w-full max-w-2xl">

    <Image
      src="/images/mockups/paustica-hero-mockup.png"
      alt="PAUSTICA Hero"
      width={1200}
      height={800}
      priority
      className="w-full h-auto object-contain"
    />

  </div>

</div>
        
      </div>
    </section>
  );
}