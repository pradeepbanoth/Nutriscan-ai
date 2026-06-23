"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { analyzeHealth } from "../../lib/healthEngine";

type ScanRow = {
  id: number;
  product_name: string;
  brand: string | null;
  image: string | null;
  nova: string | null;
  sugar: number | null;
  fat: number | null;
  salt: number | null;
  created_at?: string;
};

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await supabase.auth.getUser();

        if (!data.user) {
          window.location.href = "/auth";
          return;
        }

        setEmail(data.user.email || "");

        const [{ data: scanData, error: scanError }, { count }] =
          await Promise.all([
            supabase
              .from("scan_history")
              .select("*")
              .eq("user_id", data.user.id)
              .order("created_at", { ascending: false })
              .limit(50),

            supabase
              .from("favorites")
              .select("*", { count: "exact", head: true })
              .eq("user_id", data.user.id),
          ]);

        if (scanError) throw scanError;

        setScans((scanData || []) as ScanRow[]);
        setFavoritesCount(count || 0);
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setError("Could not load dashboard. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const dashboard = useMemo(() => {
    const scoredScans = scans.map((scan) => {
      const analysis = analyzeHealth({
        sugar: scan.sugar || 0,
        fat: scan.fat || 0,
        salt: scan.salt || 0,
        nova: scan.nova || "N/A",
        ingredients: "",
        healthGoal: "General Wellness",
      });

      return {
        ...scan,
        score: analysis.score,
        grade: analysis.grade,
        label: analysis.label,
      };
    });

    const averageScore =
      scoredScans.length > 0
        ? Math.round(
            scoredScans.reduce((sum, item) => sum + item.score, 0) /
              scoredScans.length
          )
        : 0;

    const recentScores = scoredScans.slice(0, 5).map((item) => item.score);
    const olderScores = scoredScans.slice(5, 10).map((item) => item.score);

    const recentAverage =
      recentScores.length > 0
        ? Math.round(
            recentScores.reduce((sum, score) => sum + score, 0) /
              recentScores.length
          )
        : 0;

    const olderAverage =
      olderScores.length > 0
        ? Math.round(
            olderScores.reduce((sum, score) => sum + score, 0) /
              olderScores.length
          )
        : 0;

    const healthTrend =
      olderScores.length === 0
        ? "Not enough data"
        : recentAverage > olderAverage
        ? "Improving"
        : recentAverage < olderAverage
        ? "Declining"
        : "Stable";

    const bestProduct =
      scoredScans.length > 0
        ? [...scoredScans].sort((a, b) => b.score - a.score)[0]
        : null;

    const worstProduct =
      scoredScans.length > 0
        ? [...scoredScans].sort((a, b) => a.score - b.score)[0]
        : null;

    const highSugar = scans.filter((item) => (item.sugar || 0) > 15).length;
    const ultraProcessed = scans.filter((item) => Number(item.nova) >= 4).length;

    const uniqueDays = [
      ...new Set(
        scans
          .map((scan) =>
            scan.created_at
              ? new Date(scan.created_at).toISOString().split("T")[0]
              : null
          )
          .filter(Boolean)
      ),
    ];

    const today = new Date().toISOString().split("T")[0];

    const todaysScans = scans.filter(
      (scan) =>
        scan.created_at &&
        new Date(scan.created_at).toISOString().split("T")[0] === today
    );

    const nextAction =
      highSugar > 3
        ? "Reduce sugary drinks today"
        : ultraProcessed > 3
        ? "Choose less processed foods"
        : "Keep building healthy habits";

    const insight =
      averageScore >= 75
        ? "Great progress. Your recent food choices look healthier overall."
        : averageScore >= 50
        ? "Your choices are mixed. Try reducing high-sugar and ultra-processed products."
        : "Your recent scans show high-risk patterns. Focus on fresher, less processed foods.";

    return {
      scoredScans,
      averageScore,
      healthTrend,
      bestProduct,
      worstProduct,
      highSugar,
      ultraProcessed,
      riskItems: highSugar + ultraProcessed,
      streak: uniqueDays.length,
      todaysScans,
      nextAction,
      insight,
    };
  }, [scans]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center">
        <p className="text-gray-500 font-bold">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <DashboardNav />

        <Hero email={email} />

        {error && (
          <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-5 font-bold text-red-600">
            {error}
          </div>
        )}

        <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <StatCard label="Total Scans" value={scans.length} />
          <StatCard label="Favorites" value={favoritesCount} />
          <StatCard label="Average Score" value={dashboard.averageScore} />
          <StatCard label="Risk Items" value={dashboard.riskItems} danger />
          <StatCard label="Health Trend" value={dashboard.healthTrend} text />
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <InsightCard
            label="Today's Scans"
            value={dashboard.todaysScans.length}
            description="Stay consistent every day."
          />

          <InsightCard
            label="Current Streak"
            value={dashboard.streak}
            description="Days you've scanned food."
          />

          <InsightCard
            label="Next Action"
            value={dashboard.nextAction}
            description="Personalized recommendation."
            text
          />
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-8">
          <ProductHighlight
            type="best"
            title="Best Product"
            product={dashboard.bestProduct}
          />

          <ProductHighlight
            type="worst"
            title="Worst Product"
            product={dashboard.worstProduct}
          />
        </section>

        <section className="bg-white border border-orange-100 rounded-3xl shadow-sm p-8 md:p-10 mb-8">
          <h3 className="text-3xl font-black text-gray-900 mb-4">
            AI Insight
          </h3>

          <p className="text-gray-700 text-lg leading-relaxed">
            {dashboard.insight}
          </p>
        </section>

        <RecentActivity scans={scans} />
      </div>
    </main>
  );
}

function DashboardNav() {
  return (
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
        href="/scan"
        className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-bold"
      >
        Scan Food
      </a>
    </nav>
  );
}

function Hero({ email }: { email: string }) {
  return (
    <section className="relative overflow-hidden bg-gray-900 rounded-3xl shadow-sm p-8 md:p-12 mb-8 text-white">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative">
        <p className="text-orange-300 font-black uppercase tracking-[0.2em] mb-3">
          Dashboard
        </p>

        <h2 className="text-4xl md:text-6xl font-black mb-4">
          Your nutrition overview
        </h2>

        <p className="text-white/60 font-semibold">{email}</p>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  danger = false,
  text = false,
}: {
  label: string;
  value: number | string;
  danger?: boolean;
  text?: boolean;
}) {
  return (
    <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
      <p className="text-gray-500 font-semibold mb-2">{label}</p>

      <h3
        className={`font-black ${
          text ? "text-3xl" : "text-5xl"
        } ${danger ? "text-red-500" : "text-orange-600"}`}
      >
        {value}
      </h3>
    </div>
  );
}

function InsightCard({
  label,
  value,
  description,
  text = false,
}: {
  label: string;
  value: number | string;
  description: string;
  text?: boolean;
}) {
  return (
    <div className="bg-white border border-orange-100 rounded-3xl p-8 shadow-sm">
      <p className="text-gray-500 font-semibold mb-2">{label}</p>

      <h3
        className={`font-black ${
          text ? "text-2xl text-gray-900" : "text-5xl text-orange-600"
        }`}
      >
        {value}
      </h3>

      <p className="mt-3 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function ProductHighlight({
  title,
  product,
  type,
}: {
  title: string;
  product: any;
  type: "best" | "worst";
}) {
  const styles =
    type === "best"
      ? "bg-green-50 border-green-200 text-green-700"
      : "bg-red-50 border-red-200 text-red-700";

  return (
    <div className={`rounded-3xl border p-8 shadow-sm ${styles}`}>
      <h3 className="text-2xl font-black mb-4">{title}</h3>

      {product ? (
        <>
          <p className="text-3xl font-black text-gray-900">
            {product.product_name}
          </p>

          <p className="text-gray-500 mt-2">Score: {product.score}/100</p>
        </>
      ) : (
        <p className="text-gray-500">No scans yet.</p>
      )}
    </div>
  );
}

function RecentActivity({ scans }: { scans: ScanRow[] }) {
  return (
    <section className="bg-white border border-orange-100 rounded-3xl shadow-sm p-8 md:p-10">
      <h3 className="text-3xl font-black text-gray-900 mb-6">
        Recent Activity
      </h3>

      {scans.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-5">
          {scans.slice(0, 6).map((scan) => (
            <div
              key={scan.id}
              className="rounded-3xl border border-orange-100 bg-orange-50/40 p-5 hover:bg-white hover:shadow-sm transition-all"
            >
              <p className="font-black text-gray-900 line-clamp-2">
                {scan.product_name}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {scan.brand || "Unknown Brand"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-orange-100 bg-orange-50/60 p-8 text-center">
          <h4 className="text-2xl font-black text-gray-900">No scans yet</h4>

          <p className="mt-3 text-gray-500">
            Scan your first product to unlock your nutrition overview.
          </p>

          <a
            href="/scan"
            className="mt-6 inline-flex rounded-[20px] bg-orange-500 px-6 py-4 text-white font-black"
          >
            Start Scanning
          </a>
        </div>
      )}
    </section>
  );
}