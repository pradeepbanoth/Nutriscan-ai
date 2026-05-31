import { plans } from "../../lib/plans";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#fff7ed] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="PAUSTICA"
              className="w-12 h-12 object-contain"
            />

            <h1 className="text-3xl font-black text-gray-900">
              PAUSTICA
            </h1>
          </div>

          <a
            href="/"
            className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-bold"
          >
            Home
          </a>
        </nav>

        <section className="text-center mb-14">
          <p className="text-orange-600 font-bold mb-3">
            Simple Pricing
          </p>

          <h2 className="text-5xl font-black text-gray-900 mb-5">
            Choose your PAUSTICA plan
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Start free. Upgrade when you want deeper AI food analysis,
            unlimited scans, reports, comparisons, and coaching.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-orange-100 rounded-[36px] shadow-xl p-8">
            <h3 className="text-3xl font-black text-gray-900 mb-2">
              {plans.free.name}
            </h3>

            <p className="text-5xl font-black text-orange-600 mb-6">
              {plans.free.price}
            </p>

            <p className="text-gray-500 mb-8">
              Best for trying PAUSTICA and scanning basic food products.
            </p>

            <ul className="space-y-4 mb-8 text-gray-700">
              <li>Barcode scanning</li>
              <li>Basic health score</li>
              <li>Favorites</li>
              <li>Scan history</li>
              <li>20 scans/day</li>
            </ul>

            <a
              href="/auth"
              className="block text-center w-full py-4 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 font-bold"
            >
              Start Free
            </a>
          </div>

          <div className="bg-orange-500 rounded-[36px] shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-6 right-6 bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-black">
              Recommended
            </div>

            <h3 className="text-3xl font-black mb-2">
              {plans.premium.name}
            </h3>

            <p className="text-5xl font-black mb-6">
              {plans.premium.price}
            </p>

            <p className="text-orange-50 mb-8">
              For users who want full AI nutrition intelligence and smart
              shopping decisions.
            </p>

            <ul className="space-y-4 mb-8">
              <li>Unlimited scans</li>
              <li>OCR ingredient scanner</li>
              <li>Food photo AI</li>
              <li>AI nutrition coach</li>
              <li>Weekly health reports</li>
              <li>Product comparison</li>
              <li>Smart alternatives</li>
            </ul>

            <button className="w-full py-4 rounded-2xl bg-white text-orange-600 font-black">
              Upgrade Coming Soon
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}