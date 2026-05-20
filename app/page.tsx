"use client";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00ff87] opacity-[0.04] blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#00c853] opacity-[0.06] blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-[#69ff47] opacity-[0.03] blur-[80px] animate-pulse" style={{ animationDelay: "3s" }} />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#00ff87 1px, transparent 1px), linear-gradient(90deg, #00ff87 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00ff87] to-[#00c853] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,135,0.4)]">
            <span className="text-black font-black text-sm">N</span>
          </div>
          <span className="font-bold text-lg tracking-tight">
            Nutri<span className="text-[#00ff87]">Scan</span> AI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
          <a href="#" className="hover:text-white transition-colors">How it Works</a>
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
        <a href="/login" className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">
  Sign in
</a>
          <button className="text-sm bg-[#00ff87] text-black font-semibold px-5 py-2 rounded-full hover:bg-[#69ff47] transition-colors shadow-[0_0_20px_rgba(0,255,135,0.3)]">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 border border-[#00ff87]/20 bg-[#00ff87]/5 rounded-full px-4 py-1.5 text-xs text-[#00ff87]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse inline-block" />
            AI-Powered Nutrition Intelligence
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
            <span className="block text-white/90">Know what</span>
            <span className="block text-[#00ff87] drop-shadow-[0_0_40px_rgba(0,255,135,0.5)]">
              you&apos;re eating.
            </span>
            <span className="block text-white/90">Instantly.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
            Scan any packaged food. Get an instant AI health analysis — ingredients, additives, 
            nutrition score, and personalized recommendations in seconds.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <a href="/scan" className="group flex items-center gap-3 bg-[#00ff87] text-black font-bold px-8 py-4 rounded-full text-base hover:bg-[#69ff47] transition-all shadow-[0_0_40px_rgba(0,255,135,0.4)] hover:shadow-[0_0_60px_rgba(0,255,135,0.6)]">
  <span>📷</span>
  Scan a Food Now
  <span className="group-hover:translate-x-1 transition-transform">→</span>
</a>
          <button className="flex items-center gap-2 border border-white/10 text-white/70 px-8 py-4 rounded-full text-base hover:border-white/30 hover:text-white transition-all backdrop-blur-sm">
            <span>▶</span>
            See how it works
          </button>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-8 mt-20">
          {[
            { value: "2M+", label: "Products in Database" },
            { value: "50+", label: "Harmful Additives Detected" },
            { value: "0.8s", label: "Average Scan Time" },
            { value: "98%", label: "Scan Accuracy" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-[#00ff87]">{stat.value}</div>
              <div className="text-xs text-white/30 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Scanner UI Preview */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 pb-32">
        <div className="relative rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden p-1">
          {/* Glow border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#00ff87]/10 to-transparent pointer-events-none" />
          
          {/* Mock App UI */}
          <div className="bg-[#0d140d] rounded-2xl p-8">
            {/* Scanner area */}
            <div className="relative aspect-video max-w-2xl mx-auto rounded-2xl bg-black/50 border border-[#00ff87]/20 flex items-center justify-center overflow-hidden">
              {/* Scan corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00ff87] rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00ff87] rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00ff87] rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00ff87] rounded-br-lg" />
              {/* Scanning line */}
              <div
                className="absolute left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#00ff87] to-transparent opacity-80"
                style={{ animation: "scan 2s ease-in-out infinite", top: "30%" }}
              />
              <div className="text-center">
                <div className="text-5xl mb-3">📦</div>
                <div className="text-white/40 text-sm">Point camera at barcode or label</div>
              </div>
            </div>

            {/* Result card preview */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Health Score */}
              <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                <div className="text-xs text-white/30 uppercase tracking-widest mb-3">Health Score</div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-red-400">34</span>
                  <span className="text-white/20 text-sm mb-2">/100</span>
                </div>
                <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[34%] bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                </div>
                <div className="text-xs text-red-400 mt-2">⚠ Unhealthy</div>
              </div>

              {/* Ingredients Risk */}
              <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                <div className="text-xs text-white/30 uppercase tracking-widest mb-3">Ingredients</div>
                <div className="space-y-2">
                  {[
                    { name: "High Fructose Corn Syrup", risk: "high" },
                    { name: "Artificial Colors (Red 40)", risk: "medium" },
                    { name: "Sodium Benzoate", risk: "medium" },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.risk === "high" ? "bg-red-500" : "bg-yellow-500"}`} />
                      <span className="text-xs text-white/50 truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Verdict */}
              <div className="bg-black/30 rounded-2xl p-5 border border-[#00ff87]/10">
                <div className="text-xs text-white/30 uppercase tracking-widest mb-3">AI Verdict</div>
                <p className="text-xs text-white/50 leading-relaxed">
                  This product contains <span className="text-red-400">3 harmful additives</span> linked 
                  to inflammation. High sugar content spikes blood glucose.{" "}
                  <span className="text-[#00ff87]">See healthier alternatives →</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Everything you need to<br />
            <span className="text-[#00ff87]">eat smarter.</span>
          </h2>
          <p className="text-white/30 max-w-xl mx-auto">
            Built on science. Powered by AI. Designed to be instant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: "🔍", title: "Barcode Scanner", desc: "Instant product lookup from 2M+ products in our global database." },
            { icon: "📸", title: "OCR Label Reading", desc: "Can't find the barcode? Just photograph the nutrition label." },
            { icon: "🧬", title: "Ingredient Analysis", desc: "Every additive checked against WHO, FDA, and EFSA databases." },
            { icon: "⚡", title: "NOVA Classification", desc: "Detect ultra-processed foods using internationally validated methods." },
            { icon: "🎯", title: "Personalized Scores", desc: "Results adapt to your diet type — keto, diabetic, vegan, and more." },
            { icon: "💡", title: "Healthier Alternatives", desc: "AI suggests better products for every unhealthy item you scan." },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-[#00ff87]/20 hover:bg-[#00ff87]/[0.03] transition-all cursor-pointer"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/35 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/20">
          <div>© 2025 NutriScan AI. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 20%; }
          50% { top: 70%; }
        }
      `}</style>
    </main>
  );
}
