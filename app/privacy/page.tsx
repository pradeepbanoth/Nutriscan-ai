"use client";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen" style={{ background: "#fff7ed" }}>
      <nav className="bg-white border-b sticky top-0 z-40" style={{ borderColor: "#fed7aa" }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              <span className="text-white font-black text-sm">P</span>
            </div>
            <span className="font-black text-gray-900 text-lg">PAUSTICA<span style={{ color: "#f97316" }}>AI</span></span>
          </a>
          <a href="/" className="text-sm text-gray-500 hover:text-gray-900">← Back</a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: May 2025 · PAUSTICA by Pradeep Banoth</p>

        <div className="bg-white rounded-3xl border shadow-sm p-8 space-y-8" style={{ borderColor: "#fed7aa" }}>
          <div className="p-4 rounded-2xl text-sm text-gray-600 leading-relaxed" style={{ background: "#fff7ed" }}>
            PAUSTICA is a free food scanning app. We take your privacy seriously and collect only what is necessary to provide our service.
          </div>

          {[
            {
              title: "What we collect",
              items: [
                "Your email address and encrypted password when you create an account.",
                "Barcodes you scan and the resulting product names and health scores.",
                "Basic usage data (which pages you visit) to improve the app.",
                "Camera access when scanning — we do not store images or video.",
              ]
            },
            {
              title: "How we use it",
              items: [
                "To create and manage your account.",
                "To save and show your scan history.",
                "To generate AI health analysis for scanned products.",
                "To improve the app through anonymous usage patterns.",
              ]
            },
            {
              title: "What we do NOT do",
              items: [
                "We do not sell your data to anyone.",
                "We do not share your data with advertisers.",
                "We do not store your camera images.",
                "We do not send spam emails.",
              ]
            },
            {
              title: "Third-party services we use",
              items: [
                "Supabase — for secure database and authentication.",
                "OpenFoodFacts — to retrieve product nutrition data (barcodes are sent to their servers).",
              ]
            },
            {
              title: "Your rights",
              items: [
                "You can request a copy of your data at any time.",
                "You can delete your account and all data by emailing us.",
                "You can opt out of analytics by contacting us.",
              ]
            },
            {
              title: "Health disclaimer",
              items: [
                "Our AI analysis is for informational purposes only.",
                "It is not medical advice. Always consult a healthcare professional before making dietary changes.",
              ]
            },
            {
              title: "Contact",
              items: [
                "For any privacy questions or data requests, email us at banothpradeep0203@gmail.com",
                "We will respond within 7 days.",
              ]
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-black text-gray-900 mb-3">{section.title}</h2>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#f97316" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a href="/terms" className="text-sm font-semibold hover:underline" style={{ color: "#f97316" }}>View Terms of Service →</a>
        </div>
      </div>
    </main>
  );
}
