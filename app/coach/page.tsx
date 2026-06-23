"use client";


import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import posthog from "posthog-js";

import { supabase } from "../lib/supabase";
import { calculateGoalScore } from "../../lib/goalScoring";
import { usePremium } from "@/hooks/usePremium";
import PremiumGate from "../../components/PremiumGateComponent";
import { AnalyticsEvents } from "@/lib/analyticsEvents";

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
  const [question, setQuestion] = useState("");
  const [coachAnswer, setCoachAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  const { loading: premiumLoading, isPremium } = usePremium();

  useEffect(() => {
    const loadCoach = async () => {
      try {
        const { data } = await supabase.auth.getUser();

        if (!data.user) {
          window.location.href = "/auth";
          return;
        }

        setEmail(data.user.email || "");

        const { data: scanData, error: scanError } = await supabase
          .from("scan_history")
          .select("*")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false })
          .limit(50);

        if (scanError) {
          throw scanError;
        }

        setScans((scanData || []) as ScanRow[]);
      } catch (err) {
        console.error("Coach load failed:", err);
        setError("Could not load your coach data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    loadCoach();
  }, []);

  const scoredScans = useMemo(
    () =>
      scans.map((scan) => ({
        ...scan,
        score: calculateGoalScore(
          "General Wellness",
          scan.sugar || 0,
          scan.fat || 0,
          scan.salt || 0,
          Number(scan.nova),
          0
        ),
      })),
    [scans]
  );

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
    const cleanQuestion = question.trim();

    if (!cleanQuestion || asking) return;

    if (cleanQuestion.length > 500) {
      setError("Please keep your question under 500 characters.");
      return;
    }

    setAsking(true);
    setCoachAnswer("");
    setError("");

    posthog.capture(AnalyticsEvents.COACH_USED, {
      question_length: cleanQuestion.length,
      scans_available: scans.length,
      average_score: averageScore,
      high_sugar: highSugar,
      high_salt: highSalt,
      ultra_processed: ultraProcessed,
    });

    try {
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
          message: cleanQuestion,
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

      if (!res.ok || data.error) {
        posthog.capture(AnalyticsEvents.COACH_USED, {
          success: false,
        });

        setCoachAnswer(data.error || "Coach could not answer right now.");
        return;
      }

      posthog.capture(AnalyticsEvents.COACH_USED, {
        success: true,
        response_length: data.answer?.length || 0,
      });

      setCoachAnswer(data.answer || "No answer received.");
    } catch (err) {
      console.error("Coach request failed:", err);

      posthog.capture(AnalyticsEvents.COACH_USED, {
        success: false,
      });

      setCoachAnswer("Something went wrong. Please try again.");
    } finally {
      setAsking(false);
    }
  };

  if (loading || premiumLoading) {
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

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-5 font-bold text-red-600">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Scans" value={scans.length} />
          <StatCard label="Average Score" value={averageScore} />
          <StatCard label="High Sugar" value={highSugar} danger />
          <StatCard label="Ultra Processed" value={ultraProcessed} danger />
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
            Ask PAUSTICA AI Coach
          </h3>

          <p className="text-gray-500 mb-6">
            Ask anything about your recent scans, sugar, salt, processing level,
            or healthier food choices.
          </p>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={500}
            placeholder="Example: Based on my recent scans, what should I reduce this week?"
            className="w-full min-h-[140px] rounded-3xl border border-orange-200 bg-orange-50 p-5 text-gray-900 outline-none focus:border-orange-500 resize-none"
          />

          <div className="mt-2 text-right text-xs font-bold text-gray-400">
            {question.length}/500
          </div>

          <button
            onClick={askCoach}
            disabled={asking || !question.trim()}
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

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <CoachTip
              title="Better Snacks"
              body="Try fruits, roasted makhana, nuts, curd, or homemade snacks."
              color="green"
            />
            <CoachTip
              title="Reduce Often"
              body="Limit sugary drinks, fried chips, instant noodles, and candy."
              color="yellow"
            />
            <CoachTip
              title="Build Habit"
              body="Scan before buying. Choose products with lower sugar, salt, and NOVA score."
              color="blue"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm">
      <p className="text-gray-500 font-semibold mb-2">{label}</p>
      <h3
        className={`text-5xl font-black ${
          danger ? "text-red-500" : "text-orange-600"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function CoachTip({
  title,
  body,
  color,
}: {
  title: string;
  body: string;
  color: "green" | "yellow" | "blue";
}) {
  const styles = {
    green: "bg-green-50 border-green-200 text-green-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <div className={`rounded-3xl border p-6 ${styles[color]}`}>
      <h4 className="font-black mb-3">{title}</h4>
      <p className="text-gray-700">{body}</p>
    </div>
  );
}