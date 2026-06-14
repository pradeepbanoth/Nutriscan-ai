"use client";

import { useEffect, useState } from "react";

export default function TrustPage() {

const [activeSection, setActiveSection] = useState<"faq" | "privacy" | "terms" | null>(null);

useEffect(() => {
  const hash = window.location.hash.replace("#", "");

  if (hash === "faq" || hash === "privacy" || hash === "terms") {
    const timer = setTimeout(() => {
      setActiveSection(hash);
    }, 0);

    return () => clearTimeout(timer);
  }
}, []);

  return (
    <main className="min-h-screen" style={{ background: "#fff7ed" }}>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
  <div
    className="bubble-float absolute top-24 left-16 h-96 w-96 rounded-full bg-orange-300/10 blur-[120px]"
  />

  <div
    className="bubble-float absolute top-[40%] right-0 h-[500px] w-[500px] rounded-full bg-orange-400/15 blur-[140px]"
    style={{ animationDelay: "3s" }}
  />

  <div
    className="bubble-float absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-yellow-300/15 blur-[140px]"
    style={{ animationDelay: "6s" }}
  />
</div>
      <nav className="bg-white border-b sticky top-0 z-40" style={{ borderColor: "#fed7aa" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              <span className="text-white font-black text-sm">P</span>
            </div>
            <span className="font-black text-gray-900 text-lg">
              PAUSTICA<span style={{ color: "#f97316" }}>AI</span>
            </span>
          </a>

          <a href="/" className="text-sm text-gray-500 hover:text-gray-900">
            ← Back
          </a>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
          Got a Question?
        </p>

        <h1 className="heading-font text-4xl sm:text-6xl font-black text-gray-900 tracking-tight mb-5">
          Trust Center
        </h1>

        <p className="max-w-2xl text-lg text-gray-500 leading-relaxed mb-10">
          Everything you need to know about PAUSTICA, including common questions,
          privacy, data usage, health disclaimers, and terms of service.
        </p>

     <div className="grid sm:grid-cols-3 gap-4">
  {[
    { label: "FAQ", value: "faq" },
    { label: "Privacy", value: "privacy" },
    { label: "Terms", value: "terms" },
  ].map((item) => (
    <button
      key={item.value}
      onClick={() =>
        setActiveSection(
          activeSection === item.value
            ? null
            : (item.value as "faq" | "privacy" | "terms")
        )
      }
      className={`text-left rounded-3xl border p-6 shadow-sm transition ${
        activeSection === item.value
          ? "bg-orange-500 border-orange-500 text-white"
          : "bg-white border-orange-100 text-gray-900 hover:shadow-md"
      }`}
    >
      <p className="text-xl font-black">{item.label}</p>

      <p
        className={`text-sm mt-2 ${
          activeSection === item.value ? "text-orange-50" : "text-gray-500"
        }`}
      >
        {activeSection === item.value
          ? "Click to close"
          : `View ${item.label.toLowerCase()} details`}
      </p>
    </button>
  ))}
</div>
</section>

<section className="max-w-5xl mx-auto px-6 pb-10">
  <div className="bg-white rounded-[36px] border border-orange-100 shadow-sm p-8">
    <h2 className="text-3xl font-black text-gray-900 mb-6">
      Our Scientific References
    </h2>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5">
        <h3 className="font-black text-gray-900 mb-2">WHO</h3>
        <p className="text-sm text-gray-600">
          Public health guidance, sugar intake recommendations,
          obesity prevention and nutrition education.
        </p>
      </div>

      <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5">
        <h3 className="font-black text-gray-900 mb-2">FSSAI</h3>
        <p className="text-sm text-gray-600">
          Indian food labeling requirements and nutrition standards.
        </p>
      </div>

      <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5">
        <h3 className="font-black text-gray-900 mb-2">FDA</h3>
        <p className="text-sm text-gray-600">
          Ingredient labeling guidance and food safety references.
        </p>
      </div>

      <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5">
        <h3 className="font-black text-gray-900 mb-2">EFSA</h3>
        <p className="text-sm text-gray-600">
          European food safety opinions and additive assessments.
        </p>
      </div>
    </div>
  </div>
</section>
            
        
      {activeSection === "faq" && (
<section id="faq" className="max-w-5xl mx-auto px-6 pb-10">
  <div className="relative bg-white rounded-[36px] border border-orange-100 shadow-sm p-6 sm:p-10">
    <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
      FAQ
    </p>

<div className="absolute top-6 right-6">
  <button
    onClick={() => setActiveSection(null)}
    className="h-11 w-11 rounded-full bg-white border border-orange-100 shadow-sm hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
  >
    <span className="text-lg font-black text-gray-500">
      ✕
    </span>
  </button>
</div>

    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">
       PAUSTICA explained clearly.
    </h2>

    <div className="space-y-4">
      {[
        {
          q: "How is PAUSTICA different from a normal nutrition label?",
          a: "A nutrition label only shows numbers. PAUSTICA explains what those numbers mean using sugar, salt, fat, processing level, ingredients, additives, and your personal health goal.",
        },
        {
          q: "How is the health score calculated?",
          a: "The score is based on nutrition quality, ingredient risk, processing level, and goal-based personalization. Higher sugar, salt, fat, ultra-processing, or risky additives can reduce the score.",
        },
        {
          q: "Does PAUSTICA provide medical advice?",
          a: "No. PAUSTICA provides educational food insights only. It should not replace advice from a doctor, dietitian, or qualified healthcare professional.",
        },
        {
          q: "Does PAUSTICA store my scans?",
          a: "PAUSTICA may save scan history to improve your experience. You can request data removal or account deletion by contacting support.",
        },
        {
          q: "Is PAUSTICA free?",
          a: "Basic scans and food analysis are available for free. Premium features may include unlimited scans, deeper personalization, weekly reports, and advanced ingredient insights.",
        },
      ].map((item) => (
        <details
          key={item.q}
className="group rounded-3xl bg-white p-5 shadow-sm"
>
          <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
            <span className="text-lg font-black text-gray-900">
              {item.q}
            </span>

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-orange-100 text-orange-600 transition-transform duration-300 group-open:rotate-180">
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M19 9l-7 7-7-7"
    />
  </svg>
</span>
          </summary>

          <p className="mt-4 text-gray-600 leading-relaxed">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  </div>
</section>
    )}
{activeSection === "privacy" && (
<section id="privacy" className="max-w-5xl mx-auto px-6 pb-10">
  <div className="relative bg-white rounded-[36px] border border-orange-100 shadow-sm p-6 sm:p-10">
    <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
      Privacy
    </p>

    <div className="absolute top-6 right-6">
  <button
    onClick={() => setActiveSection(null)}
    className="h-11 w-11 rounded-full bg-white border border-orange-100 shadow-sm hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
  >
    <span className="text-lg font-black text-gray-500">
      ✕
    </span>
  </button>
</div>

    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
      How we protect your data.
    </h2>

    <p className="text-gray-500 leading-relaxed mb-8">
      PAUSTICA collects only the information needed to provide food scanning,
      account features, scan history, and app improvements.
    </p>

    <div className="space-y-8">
      {[
        {
          title: "What we collect",
          items: [
            "Account details such as your email address when you create an account.",
            "Food scans, product names, health scores, and saved scan history.",
            "Basic usage data to improve app performance and user experience.",
            "Camera access only when scanning. PAUSTICA does not store camera images or videos.",
          ],
        },
        {
          title: "How we use information",
          items: [
            "To analyze food products and show health insights.",
            "To save scan history and favorites when you are signed in.",
            "To improve recommendations, performance, and reliability.",
            "To prevent abuse, spam, and unauthorized use.",
          ],
        },
        {
          title: "What we do not do",
          items: [
            "We do not sell your personal data.",
            "We do not share your personal data with advertisers.",
            "We do not store your camera images or videos.",
            "We do not use your data for medical diagnosis.",
          ],
        },
        {
          title: "Third-party services",
          items: [
            "Supabase may be used for authentication, database storage, and account management.",
            "OpenFoodFacts may be used to retrieve food product and nutrition information.",
            "Analytics tools may be used to understand app usage and improve the product.",
          ],
        },
        {
          title: "Your rights",
          items: [
            "You can request access to your data.",
            "You can request correction or deletion of your data.",
            "You can request account deletion by contacting support.",
          ],
        },
        {
  title: "Account deletion",
  items: [
    "You can request account deletion at any time.",
    "When your account is deleted, we will remove your account data and saved scan history where technically possible.",
    "Some limited records may be retained if required for security, fraud prevention, or legal reasons.",
  ],
},
{
  title: "Data security",
  items: [
    "We use secure authentication and encrypted connections to protect your account.",
    "Sensitive account information is not stored in plain text.",
    "We regularly review our systems to improve security and reliability.",
    "No security system is perfect, but we take reasonable measures to protect user data.",
  ],
},
      ].map((section) => (
        <div key={section.title}>
          <h3 className="text-base font-black text-gray-900 mb-3">
            {section.title}
          </h3>

          <ul className="space-y-2">
            {section.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-orange-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
</section>
    )}
{activeSection === "terms" && (
<section id="terms" className="max-w-5xl mx-auto px-6 pb-16">
  <div className="relative bg-white rounded-[36px] border border-orange-100 shadow-sm p-6 sm:p-10">
    <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
      Terms
    </p>


    <div className="absolute top-6 right-6">
  <button
    onClick={() => setActiveSection(null)}
    className="h-11 w-11 rounded-full bg-white border border-orange-100 shadow-sm hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
  >
    <span className="text-lg font-black text-gray-500">
      ✕
    </span>
  </button>
</div>

    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
      Terms for using PAUSTICA.
    </h2>

    <p className="text-gray-500 leading-relaxed mb-8">
      By using PAUSTICA, you agree to use the app responsibly and understand
      that food analysis is provided for educational purposes only.
    </p>

    <div className="space-y-8">
      {[
        {
          title: "Using the app",
          items: [
            "You are responsible for keeping your account secure.",
            "You must not misuse, hack, spam, or damage the service.",
            "You must not use PAUSTICA for illegal or harmful activity.",
          ],
        },
        {
          title: "Health disclaimer",
          items: [
            "PAUSTICA is not a medical app.",
            "Food scores and AI insights are for general information only.",
            "Do not make medical or dietary decisions based only on PAUSTICA.",
            "Always consult a doctor, dietitian, or qualified professional for health decisions.",
          ],
        },
        {
          title: "AI and data accuracy",
          items: [
            "AI analysis may not always be complete or correct.",
            "Product data may come from third-party sources and can be outdated or incomplete.",
            "PAUSTICA does not guarantee that every product result is perfectly accurate.",
          ],
        },
        {
          title: "Service changes",
          items: [
            "We may update, improve, limit, or remove features at any time.",
            "Premium features may be introduced in the future.",
            "We may suspend accounts that violate these terms.",
          ],
        },
        {
          title: "Limitation of liability",
          items: [
            "PAUSTICA is provided as-is without warranties.",
            "PAUSTICA is not responsible for decisions made only from app results.",
            "Use the app as a helpful guide, not as the only source of truth.",
          ],
        },
        {
          title: "Governing law",
          items: [
            "These terms are governed by the laws of India.",
          ],
        },
      ].map((section) => (
        <div key={section.title}>
          <h3 className="text-base font-black text-gray-900 mb-3">
            {section.title}
          </h3>

          <ul className="space-y-2">
            {section.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-orange-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
</section>
)}

<section className="max-w-5xl mx-auto px-6 pb-20">
  <div className="rounded-[36px] bg-gray-900 p-8 sm:p-10 text-white">
    <p className="text-sm font-black text-orange-400 uppercase tracking-wide mb-3">
      Still need help?
    </p>

    <h2 className="heading-font text-3xl sm:text-4xl font-black mb-4">
      Contact PAUSTICA support.
    </h2>

    <p className="text-gray-300 leading-relaxed mb-6">
      For privacy requests, account deletion, product questions, or support,
      contact us anytime.
    </p>

    <a
      href="mailto:paustica@gmail.com"
      className="inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-black text-white hover:bg-orange-600 transition"
    >
      Email Support
    </a>
  </div>
</section>
<p className="text-sm font-bold text-gray-400 mb-10">
  Last updated: June 2026
</p>

    </main>
  );
}
