import Image from "next/image";

export default function VisualShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="text-sm font-black uppercase tracking-wider text-orange-600">
          Better alternatives
        </p>

        <h2 className="mt-4 text-4xl font-black text-gray-900">
          See healthier choices instantly
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
          PAUSTICA helps you move from risky packaged drinks to smarter options.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <Image
          src="/images/home/better-alternatives.png"
          alt="PAUSTICA better food alternatives visual"
          width={1600}
          height={900}
          className="h-auto w-full object-cover"
        />
      </div>
    </section>
  );
}