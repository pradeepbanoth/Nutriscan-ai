"use client";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#fff7ed" }}>
      {/* Background blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "#f97316" }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: "#ea580c" }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 bg-white border-b" style={{ borderColor: "#fed7aa" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              <span className="text-white font-black text-sm">P</span>
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">
              PAUSTICA<span style={{ color: "#f97316" }}>AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="/independence" className="hover:text-gray-900 transition-colors">How it Works</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-2">Sign in</a>
            <a href="/scan" className="text-sm font-bold px-5 py-2.5 rounded-full text-white shadow-sm transition-all" style={{ background: "#f97316" }}>
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold mb-8 border" style={{ background: "#fff7ed", borderColor: "#fed7aa", color: "#ea580c" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#f97316" }} />
          AI-Powered Nutrition Intelligence
        </div>

        {/* Headline */}
        <h1 className="text-7xl md:text-8xl font-black text-gray-900 leading-none tracking-tight mb-8">
          Know what<br />
          <span style={{ color: "#f97316" }}>you&apos;re eating.</span><br />
          Instantly.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12">
          Scan any packaged food. Get an instant AI health analysis — ingredients,
          additives, nutrition score, and personalized recommendations in seconds.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <a href="/scan" className="flex items-center gap-3 font-bold px-8 py-4 rounded-full text-white shadow-lg text-base transition-all" style={{ background: "#f97316" }}>
            <span></span>
            Scan a Food Now
            <span>→</span>
          </a>
          <a href="#" className="flex items-center gap-2 border font-medium px-8 py-4 rounded-full text-gray-600 hover:border-orange-300 hover:text-gray-900 transition-all text-base bg-white" style={{ borderColor: "#fed7aa" }}>
            <span></span>
            See how it works
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12">
          {[
            { value: "2M+", label: "Products in Database" },
            { value: "50+", label: "Harmful Additives Detected" },
            { value: "0.8s", label: "Average Scan Time" },
            { value: "98%", label: "Scan Accuracy" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-black" style={{ color: "#f97316" }}>{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* App Preview */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-3xl border shadow-xl overflow-hidden" style={{ borderColor: "#fed7aa" }}>
          {/* Orange header strip */}
          <div className="h-2" style={{ background: "linear-gradient(90deg, #f97316, #ea580c)" }} />
          <div className="p-8">
            {/* Mock scanner */}
            <div className="relative rounded-2xl overflow-hidden mb-6 flex items-center justify-center" style={{ background: "#fff7ed", height: "200px" }}>
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: "#f97316" }} />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: "#f97316" }} />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: "#f97316" }} />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: "#f97316" }} />
              <div className="text-center">
                <div className="text-5xl mb-2"></div>
                <p className="text-sm text-gray-400">Point camera at barcode or label</p>
              </div>
            </div>

            {/* Mock results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl p-4 border" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Health Score</div>
                <div className="text-5xl font-black" style={{ color: "#dc2626" }}>34</div>
                <div className="text-xs mt-1" style={{ color: "#dc2626" }}> Poor</div>
              </div>
              <div className="rounded-2xl p-4 border" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Concerns</div>
                <div className="space-y-1">
                  {["High Fructose Corn Syrup", "Artificial Colors", "Trans Fats"].map((item) => (
                    <div key={item} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#f97316" }} />
                      <span className="text-xs text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl p-4 border" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#f97316" }}>AI Verdict</div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Contains <span style={{ color: "#dc2626" }}>3 harmful additives</span> linked to inflammation.
                  High sugar spikes blood glucose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-4">
            Everything you need to<br />
            <span style={{ color: "#f97316" }}>eat smarter.</span>
          </h2>
          <p className="text-gray-400 text-lg">Built on science. Powered by AI. Designed to be instant.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: "", title: "Barcode Scanner", desc: "Instant product lookup from 2M+ products in our global database." },
            { icon: "", title: "OCR Label Reading", desc: "Can't find the barcode? Just photograph the nutrition label." },
            { icon: "", title: "Ingredient Analysis", desc: "Every additive checked against WHO, FDA, and EFSA databases." },
            { icon: "", title: "NOVA Classification", desc: "Detect ultra-processed foods using internationally validated methods." },
            { icon: "", title: "Personalized Scores", desc: "Results adapt to your diet — keto, diabetic, vegan, and more." },
            { icon: "", title: "Healthier Alternatives", desc: "AI suggests better products for every unhealthy item you scan." },
          ].map((feature) => (
            <div key={feature.title} className="bg-white rounded-2xl p-6 border hover:shadow-md transition-all cursor-pointer" style={{ borderColor: "#fed7aa" }}>
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <div className="rounded-3xl p-12 text-center text-white" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
          <h2 className="text-4xl font-black mb-4 tracking-tight">Start scanning for free</h2>
          <p className="text-orange-100 mb-8 text-lg">Join thousands of people making smarter food choices every day.</p>
          <a href="/scan" className="inline-flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-full text-base transition-all hover:bg-orange-50" style={{ color: "#f97316" }}>
             Scan Your First Product →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t py-8 px-6" style={{ borderColor: "#fed7aa" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div> 2026 PAUSTICA. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-gray-700 transition-colors">Privacy</a>
<a href="/terms" className="hover:text-gray-700 transition-colors">Terms</a>
           <a href="mailto:banothpradeep0203@gmail.com" className="hover:text-gray-700 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
