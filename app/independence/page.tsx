"use client";

export default function IndependencePage() {
  return (
    <main className="min-h-screen" style={{ background: "#fff7ed" }}>
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-40" style={{ borderColor: "#fed7aa" }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              <span className="text-white font-black text-sm">P</span>
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">PAUSTICA<span style={{ color: "#f97316" }}>AI</span></span>
          </a>
          <a href="/scan" className="text-sm font-bold px-4 py-2 rounded-full text-white" style={{ background: "#f97316" }}>
            Start Scanning
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold mb-6 border" style={{ background: "#fff7ed", borderColor: "#fed7aa", color: "#ea580c" }}>
            ️ Our Commitment to You
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-6">
            100% Independent.<br />
            <span style={{ color: "#f97316" }}>No compromise.</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            PAUSTICA is built to serve you — not food companies. Our health scores are based purely on science, never on commercial interests.
          </p>
        </div>

        {/* Main pledges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              icon: "",
              title: "No Brand Partnerships",
              description: "We have zero partnerships with food brands. No company can pay us to improve their product score. Every score is calculated purely by our AI based on nutritional data.",
              color: "#fef2f2",
              border: "#fecaca",
            },
            {
              icon: "",
              title: "Science-Based Scoring",
              description: "Our health scores are based on WHO guidelines, FDA recommendations, USDA standards, and FSSAI India guidelines. No exceptions. No bias.",
              color: "#f0fdf4",
              border: "#bbf7d0",
            },
            {
              icon: "",
              title: "No Ads. Ever.",
              description: "PAUSTICA contains zero advertisements. We will never show you sponsored content or paid promotions disguised as recommendations.",
              color: "#fff7ed",
              border: "#fed7aa",
            },
            {
              icon: "",
              title: "Your Data is Yours",
              description: "We never sell your personal data to food companies, advertisers, or anyone else. Your scan history is private and belongs only to you.",
              color: "#eff6ff",
              border: "#bfdbfe",
            },
          ].map((pledge) => (
            <div key={pledge.title} className="bg-white rounded-3xl border p-6 shadow-sm" style={{ borderColor: pledge.border }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: pledge.color }}>
                {pledge.icon}
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-3">{pledge.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{pledge.description}</p>
            </div>
          ))}
        </div>

        {/* How scoring works */}
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden mb-16" style={{ borderColor: "#fed7aa" }}>
          <div className="h-2" style={{ background: "linear-gradient(90deg, #f97316, #ea580c)" }} />
          <div className="p-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">How our scoring works</h2>
            <div className="space-y-4">
              {[
                { step: "01", title: "We fetch raw product data", desc: "Barcode is looked up in OpenFoodFacts — an open, community-driven database with no commercial influence." },
                { step: "02", title: "AI analyzes ingredients", desc: "Our AI checks every ingredient against WHO, FDA, FSSAI databases for harmful additives, preservatives and artificial substances." },
                { step: "03", title: "Nutrition is evaluated", desc: "Sugar, fat, sodium, fiber, protein levels are compared against internationally accepted healthy benchmarks." },
                { step: "04", title: "NOVA classification applied", desc: "We classify every product using the NOVA system — a scientifically validated ultra-processing detection method." },
                { step: "05", title: "Score is calculated", desc: "A final health score from 0-100 is generated. No human intervention. No brand influence. Pure data." },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: "#fff7ed" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 text-white" style={{ background: "#f97316" }}>
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Standards we follow */}
        <div className="bg-white rounded-3xl border shadow-sm p-8 mb-16" style={{ borderColor: "#fed7aa" }}>
          <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Standards we follow</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "WHO", desc: "World Health Organization guidelines" },
              { name: "FDA", desc: "US Food & Drug Administration" },
              { name: "FSSAI", desc: "Food Safety Standards Authority of India" },
              { name: "EFSA", desc: "European Food Safety Authority" },
              { name: "NOVA", desc: "Food processing classification system" },
              { name: "USDA", desc: "US Department of Agriculture" },
              { name: "NIN", desc: "National Institute of Nutrition India" },
              { name: "ICMR", desc: "Indian Council of Medical Research" },
            ].map((standard) => (
              <div key={standard.name} className="rounded-2xl p-4 text-center border" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
                <div className="font-black text-lg mb-1" style={{ color: "#f97316" }}>{standard.name}</div>
                <div className="text-xs text-gray-400 leading-snug">{standard.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-3xl p-8 border mb-8" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
          <h3 className="font-black text-gray-900 mb-3">Important disclaimer</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            PAUSTICA health scores are for informational purposes only and are not medical advice. While we strive for accuracy, product formulations change and our database may not always reflect the latest information. Always read the actual product label and consult a healthcare professional for medical dietary decisions.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href="/scan" className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full text-white shadow-lg text-base" style={{ background: "#f97316" }}>
             Start Scanning — It's Free
          </a>
          <p className="text-gray-400 text-sm mt-4">No account required to scan your first product</p>
        </div>
      </div>
    </main>
  );
}
