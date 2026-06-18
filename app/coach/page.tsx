"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { calculateGoalScore } from "../../lib/goalScoring";
import { getUserPlan } from "../../lib/getUserPlan";
import PremiumGate from "../../components/PremiumGateComponent";
import Image from "next/image";

type ScanRow = {
  id: number;
  product_name: string;
  brand: string | null;
  nova: string | null;
  sugar: number | null;
  fat: number | null;
  salt: number | null;
};

export default function CoachPage() {
  const [email, setEmail] = useState("");
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [question, setQuestion] = useState("");
  const [coachAnswer, setCoachAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const loadCoach = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/auth";
        return;
      }

      setEmail(data.user.email || "");

      const plan = await getUserPlan(data.user.id);
      setIsPremium(plan === "premium");

      const { data: scanData } = await supabase
        .from("scan_history")
        .select("*")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false });

      setScans((scanData || []) as ScanRow[]);
      setLoading(false);
    };

    loadCoach();
  }, []);

  const scoredScans = scans.map((scan) => ({
    ...scan,
    score: calculateGoalScore(
      "General Wellness",
      scan.sugar || 0,
      scan.fat || 0,
      scan.salt || 0,
      Number(scan.nova),
      0
    ),
  }));

  const averageScore =
    scoredScans.length > 0
      ? Math.round(
          scoredScans.reduce((sum, item) => sum + item.score, 0) /
            scoredScans.length
        )
      : 0;

  const highSugar = scans.filter((item) => (item.sugar || 0) > 15).length;
  const highSalt = scans.filter((item) => (item.salt || 0) > 1.5).length;
  const ultraProcessed = scans.filter((item) => Number(item.nova) >= 4).length;

  const advice =
    averageScore >= 75
      ? "You are making strong food choices. Keep prioritizing minimally processed foods, balanced macros, and consistent habits."
      : averageScore >= 50
      ? "Your recent scans are mixed. Try reducing high-sugar snacks, salty packaged foods, and ultra-processed products."
      : "Your recent scans show higher risk patterns. Focus on whole foods, fresh snacks, home-cooked meals, and lower-sugar alternatives.";

const askCoach = async () => {
  if (!question.trim()) return;

  setAsking(true);
  setCoachAnswer("");

  const recentScans = scoredScans.slice(0, 8).map((item) => ({
    name: item.product_name,
    brand: item.brand,
    score: item.score,
    sugar: item.sugar,
    fat: item.fat,
    salt: item.salt,
    nova: item.nova,
  }));

  const res = await fetch("/api/coach", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: question,
      context: {
        averageScore,
        highSugar,
        highSalt,
        ultraProcessed,
        recentScans,
      },
    }),
  });

  const data = await res.json();

  setCoachAnswer(data.answer || data.error || "No answer received.");
  setAsking(false);
};

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center">
        <p className="text-gray-500 font-bold">Loading AI Coach...</p>
      </main>
    );
  }

  if (!isPremium) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
        <PremiumGate
          title="AI Coach is Premium"
          description="Upgrade to unlock personalized nutrition coaching and deeper food insights."
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Image
  src="/logo.png"
  alt="PAUSTICA"
  width={48}
  height={48}
  className="object-contain"
  priority
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

        <div className="bg-white border border-orange-100 rounded-3xl shadow-sm p-8 mb-8">
          <p className="text-orange-600 font-bold mb-2">AI Nutrition Coach</p>

          <h2 className="text-4xl font-black text-gray-900 mb-2">
            Personalized Food Guidance
          </h2>

          <p className="text-gray-500">{email}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 font-semibold mb-2">Total Scans</p>
            <h3 className="text-5xl font-black text-orange-600">
              {scans.length}
            </h3>
          </div>

          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 font-semibold mb-2">Average Score</p>
            <h3 className="text-5xl font-black text-orange-600">
              {averageScore}
            </h3>
          </div>

          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 font-semibold mb-2">High Sugar</p>
            <h3 className="text-5xl font-black text-red-500">{highSugar}</h3>
          </div>

          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-">
            <p className="text-gray-500 font-semibold mb-2">
              Ultra Processed
            </p>
            <h3 className="text-5xl font-black text-red-500">
              {ultraProcessed}
            </h3>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8">
            <h3 className="text-2xl font-black text-gray-900 mb-4">
              Today&apos;s Coach Advice
            </h3>

            <p className="text-gray-700 leading-relaxed">{advice}</p>
          </div>

          <div className="bg-white border border-orange-100 rounded-3xl p-8">
            <h3 className="text-2xl font-black text-gray-900 mb-4">
              Risk Pattern
            </h3>

            <div className="space-y-3">
              <p className="text-gray-700">
                High sugar products scanned: <b>{highSugar}</b>
              </p>
              <p className="text-gray-700">
                High salt products scanned: <b>{highSalt}</b>
              </p>
              <p className="text-gray-700">
                Ultra-processed products scanned: <b>{ultraProcessed}</b>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-orange-100 rounded-3xl shadow-sm p-8">
          <h3 className="text-3xl font-black text-gray-900 mb-6">
            AI Recommendations
          </h3>

          <div className="bg-white border border-orange-100 rounded-3xl shadow-sm p-8 mb-8">
  <h3 className="text-3xl font-black text-gray-900 mb-4">
    Ask PAUSTICA AI Coach
  </h3>

  <p className="text-gray-500 mb-6">
    Ask anything about your recent scans, sugar, salt, processing level, or
    healthier food choices.
  </p>

  <textarea
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    placeholder="Example: Based on my recent scans, what should I reduce this week?"
    className="w-full min-h-[140px] rounded-3xl border border-orange-200 bg-orange-50 p-5 text-gray-900 outline-none focus:border-orange-500 resize-none"
  />

  <button
    onClick={askCoach}
    disabled={asking}
    className="mt-5 rounded-full bg-orange-600 px-8 py-4 font-bold text-white shadow-sm hover:bg-orange-700 disabled:opacity-60"
  >
    {asking ? "Thinking..." : "Ask Coach"}
  </button>

  {coachAnswer && (
    <div className="mt-8 rounded-3xl border border-orange-100 bg-orange-50 p-6">
      <h4 className="text-xl font-black text-gray-900 mb-3">
        Coach Answer
      </h4>

      <p className="whitespace-pre-line text-gray-700 leading-relaxed">
        {coachAnswer}
      </p>
    </div>
  )}
</div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-3xl p-6">
              <h4 className="font-black text-green-700 mb-3">
                Better Snacks
              </h4>
              <p className="text-gray-700">
                Try fruits, roasted makhana, nuts, curd, or homemade snacks.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6">
              <h4 className="font-black text-yellow-700 mb-3">
                Reduce Often
              </h4>
              <p className="text-gray-700">
                Limit sugary drinks, fried chips, instant noodles, and candy.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6">
              <h4 className="font-black text-blue-700 mb-3">Build Habit</h4>
              <p className="text-gray-700">
                Scan before buying. Choose products with lower sugar, salt, and
                NOVA score.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}