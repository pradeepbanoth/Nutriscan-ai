import Image from "next/image";
import { PAUSTICA } from "@/lib/designSystem";

type HeroProps = {
  onScan: () => void;
  onSearchFocus: () => void;
};

export default function Hero({ onScan, onSearchFocus }: HeroProps) {
  return (
    <section className={`${PAUSTICA.container} py-20`}>
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        <div className="text-center lg:text-left">
          <p className={PAUSTICA.pageHeader.badge}>
            Food intelligence made simple
          </p>

          <h1 className="mt-5 text-5xl font-black leading-none tracking-tight text-gray-900 md:text-7xl">
            Know if your food is healthy.
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-xl leading-relaxed text-gray-500 lg:mx-0">
            Scan any packaged food and instantly see health scores, risky
            ingredients, and better alternatives.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <button onClick={onScan} className={PAUSTICA.button.primary}>
              Start Scanning
            </button>

            <button onClick={onSearchFocus} className={PAUSTICA.button.secondary}>
              Search Product
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-[360px] w-[360px] rounded-full bg-orange-300/20 blur-[100px]" />

          <Image
            src="/images/mockups/paustica-hero-mockup.png"
            alt="PAUSTICA food scanner preview"
            width={1200}
            height={800}
            priority
            className="relative h-auto w-full max-w-2xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}