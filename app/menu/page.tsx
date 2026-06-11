const menuItems = [
    {
  title: "Dashboard",
  description: "View scans, scores, insights, and recent activity.",
  href: "/dashboard",
},
  {
    title: "Home Scanner",
    description: "Scan barcodes and analyze packaged food.",
    href: "/",
  },
  {
    title: "OCR Ingredient Scanner",
    description: "Upload ingredient labels and detect risky additives.",
    href: "/ocr",
  },
  {
    title: "Food Photo AI",
    description: "Analyze food images using AI vision.",
    href: "/food-photo",
  },
  {
    title: "AI Nutrition Coach",
    description: "Get personalized guidance from your scan history.",
    href: "/coach",
  },
  {
    title: "Weekly Report",
    description: "Track your health score, risks, and progress.",
    href: "/report",
  },
  {
    title: "Profile",
    description: "View your account, scans, and favorites.",
    href: "/profile",
  },
  {
    title: "Pricing",
    description: "Compare free and premium PAUSTICA plans.",
    href: "/pricing",
  },
 {
  title: "Got a Question?",
  description: "View FAQs, privacy details, terms, and support information.",
  href: "/trust",
},
];

export default function MenuPage() {
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

            <h1 className="text-3xl font-black text-gray-900">PAUSTICA</h1>
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
            App Menu
          </p>

          <h2 className="heading-font text-5xl font-black text-gray-900 mb-5">
            Explore PAUSTICA
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Access all scanners, AI tools, reports, account pages, and legal
            pages from one clean place.
          </p>
        </section>

        <div className="grid md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="bg-white border border-orange-100 rounded-[28px] shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-3">
                {item.title}
              </h3>

              <p className="text-gray-500 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-6 inline-flex px-4 py-2 rounded-full bg-orange-50 text-orange-600 font-bold text-sm">
                Open
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}