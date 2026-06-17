"use client";

import Image from "next/image";


type Props = {
  children: React.ReactNode;
};

export default function ScannerPanel({
  children,
}: Props) {
  return (
    <section
      className="max-w-5xl mx-auto px-6 py-20"
      id="scanner-area"
    >
      <div className="rounded-[44px] border border-orange-100 bg-white p-6 sm:p-8 md:p-12 shadow-2xl">

        <div className="text-center mb-8">

          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
            Analyze now
          </p>

          <h2 className="mt-3 text-3xl md:text-5xl font-black text-gray-900">
            Scan or search your food
          </h2>

          <p className="mt-4 text-gray-500">
            Use barcode, product name, or ingredient label to get instant food intelligence.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

  <div>
    {children}
  </div>

 <div className="hidden lg:block">
  <div className="sticky top-28">
    <div className="relative overflow-hidden rounded-[36px] border border-orange-100 bg-orange-50 shadow-sm">
      <Image
        src="/images/home/scanner-preview.png"
        alt="PAUSTICA scanner preview"
        width={900}
        height={1100}
        className="w-full h-auto object-contain"
        priority
      />
    </div>

    <div className="mt-6">
      <p className="text-sm font-black uppercase tracking-wide text-orange-500">
        Smart Analysis
      </p>

      <h3 className="mt-2 text-3xl font-black text-gray-900 leading-tight">
        Every scan becomes an explanation.
      </h3>

      <p className="mt-3 text-gray-500 leading-relaxed">
        PAUSTICA analyzes ingredients, additives, processing levels, and suggests healthier alternatives instantly.
      </p>
    </div>
  </div>
</div>
</div>

      </div>
    </section>
  );
}