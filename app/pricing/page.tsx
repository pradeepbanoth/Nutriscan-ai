"use client";

import { useState } from "react";

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for trying out DANTEY AI",
      color: "#f97316",
      bg: "#fff7ed",
      border: "#fed7aa",
      buttonText: "Get Started Free",
      buttonStyle: "border",
      href: "/scan",
      features: [
        { text: "10 scans per day", included: true },
        { text: "Basic health score", included: true },
        { text: "Ingredient analysis", included: true },
        { text: "NOVA classification", included: true },
        { text: "Scan history (last 7 days)", included: true },
        { text: "Camera barcode scanner", included: true },
        { text: "Unlimited scans", included: false },
        { text: "Advanced AI analysis", included: false },
        { text: "Personalized recommendations", included: false },
        { text: "Full scan history", included: false },
        { text: "Export scan history PDF", included: false },
        { text: "Priority support", included: false },
      ],
    },
    {
      name: "Pro",
      price: yearly ? "₹999" : "₹99",
      period: yearly ? "per year" : "per month",
      savings: yearly ? "Save ₹189" : null,
      description: "For health-conscious individuals",
      color: "#ffffff",
      bg: "linear-gradient(135deg, #f97316, #ea580c)",
      border: "#f97316",
      buttonText: "Start Pro Plan",
      buttonStyle: "solid",
      href: "/login",
      features: [
        { text: "Unlimited scans", included: true },
        { text: "Advanced AI health analysis", included: true },
        { text: "Detailed ingredient breakdown", included: true },
        { text: "NOVA classification", included: true },
        { text: "Full scan history", included: true },
        { text: "Camera barcode scanner", included: true },
        { text: "Personalized recommendations", included: true },
        { text: "Diet-specific analysis (Keto, Diabetic, Vegan)", included: true },
        { text: "Export scan history as PDF", included: true },
        { text: "Healthier alternatives suggestions", included: true },
        { text: "Priority email support", included: true },
        { text: "Early access to new features", included: true },
      ],
    },
  ];

  return (
    <main className="min-h-screen" style={{ background: "#fff7ed" }}>
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-40" style={{ borderColor: "#fed7aa" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              <span className="text-white font-black text-sm">D</span>
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">DANTEY <span style={{ color: "#f97316" }}>AI</span></span>
          </a>
          <a href="/scan" className="text-sm font-bold px-4 py-2 rounded-full text-white" style={{ background: "#f97316" }}>
            Start Scanning
          </a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold mb-6 border" style={{ background: "#fff7ed", borderColor: "#fed7aa", color: "#ea580c" }}>
            💳 Simple, Transparent Pricing
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">
            Choose your plan
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Start free. Upgrade when you need more. No hidden fees. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-semibold ${!yearly ? "text-gray-900" : "text-gray-400"}`}>Monthly</span>
            <button
              onClick={() => setYearly(!yearly)}
              className="relative w-14 h-7 rounded-full transition-all"
              style={{ background: yearly ? "#f97316" : "#e5e7eb" }}
            >
              <div className="absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all"
                style={{ left: yearly ? "calc(100% - 24px)" : "4px" }} />
            </button>
            <span className={`text-sm font-semibold ${yearly ? "text-gray-900" : "text-gray-400"}`}>
              Yearly
              <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                Save ₹189
              </span>
            </span>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-3xl overflow-hidden shadow-sm"
              style={{
                background: plan.name === "Pro" ? "white" : "white",
                border: plan.name === "Pro" ? "2px solid #f97316" : `1px solid ${plan.border}`,
              }}
            >
              {/* Card header */}
              <div className="p-8" style={{ background: plan.name === "Pro" ? "linear-gradient(135deg, #f97316, #ea580c)" : "white" }}>
                {plan.name === "Pro" && (
                  <div className="inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-bold text-white mb-4">
                    ⭐ Most Popular
                  </div>
                )}
                <h2 className="text-2xl font-black mb-1" style={{ color: plan.name === "Pro" ? "white" : "#111827" }}>
                  {plan.name}
                </h2>
                <p className="text-sm mb-6" style={{ color: plan.name === "Pro" ? "rgba(255,255,255,0.8)" : "#6b7280" }}>
                  {plan.description}
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black" style={{ color: plan.name === "Pro" ? "white" : "#111827" }}>
                    {plan.price}
                  </span>
                  <span className="text-sm mb-2" style={{ color: plan.name === "Pro" ? "rgba(255,255,255,0.7)" : "#9ca3af" }}>
                    /{plan.period}
                  </span>
                </div>
                {plan.savings && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-bold text-white">
                    🎉 {plan.savings}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="p-8">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${feature.included ? "text-white" : "text-gray-300"}`}
                        style={{ background: feature.included ? "#f97316" : "#f1f5f9" }}>
                        {feature.included ? "✓" : "✕"}
                      </span>
                      <span className={`text-sm ${feature.included ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.href}
                  className="flex items-center justify-center w-full py-4 rounded-2xl font-bold text-sm transition-all"
                  style={
                    plan.name === "Pro"
                      ? { background: "#f97316", color: "white" }
                      : { border: "2px solid #f97316", color: "#f97316", background: "white" }
                  }
                >
                  {plan.buttonText} →
                </a>

                {plan.name === "Pro" && (
                  <p className="text-center text-xs text-gray-400 mt-3">
                    7-day money back guarantee · Cancel anytime
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl border shadow-sm p-8 mb-16" style={{ borderColor: "#fed7aa" }}>
          <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight text-center">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-2xl mx-auto">
            {[
              {
                q: "Can I try Pro for free?",
                a: "Yes! Start with our free plan — no credit card required. Upgrade to Pro anytime when you need unlimited scans."
              },
              {
                q: "How do I pay?",
                a: "We accept UPI, debit/credit cards, and net banking. All payments are processed securely."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, absolutely. Cancel anytime from your account settings. No questions asked."
              },
              {
                q: "Is there a refund policy?",
                a: "Yes! We offer a 7-day money-back guarantee. If you're not happy, email us and we'll refund you immediately."
              },
              {
                q: "What happens when I hit the free scan limit?",
                a: "You'll see a prompt to upgrade to Pro. Your history and data are always safe regardless of plan."
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b pb-6 last:border-0 last:pb-0" style={{ borderColor: "#fed7aa" }}>
                <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-3xl p-10 text-center text-white" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
          <h2 className="text-3xl font-black mb-3 tracking-tight">Start eating smarter today</h2>
          <p className="text-orange-100 mb-6">Join thousands of Indians making better food choices with DANTEY AI</p>
          <a href="/scan" className="inline-flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-full text-base" style={{ color: "#f97316" }}>
            📷 Try Free — No signup needed
          </a>
        </div>
      </div>
    </main>
  );
}
