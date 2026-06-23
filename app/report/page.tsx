"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";

import { supabase } from "../lib/supabase";
import { calculateGoalScore } from "../../lib/goalScoring";
import PremiumGate from "../../components/PremiumGateComponent";
import { usePremium } from "@/hooks/usePremium";
import { AnalyticsEvents } from "@/lib/analyticsEvents";

type ScanRow = {
  id: number;
  product_name: string;
  brand: string | null;
  image: string | null;
  ingredients: string | null;
  nutriscore: string | null;
  nova: string | null;
  sugar: number | null;
  fat: number | null;
  salt: number | null;
};

export default function ReportPage() {
  const [email, setEmail] = useState("");
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const trackedRef = useRef(false);
  const { loading: premiumLoading, isPremium } = usePremium();

  useEffect(() => {
    const loadReport = async () => {
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
        console.error("Report load failed:", err);
        setError("Could not load your weekly report. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  const report = useMemo(() => {
    const scoredScans = scans.map((scan) => {
      const score = calculateGoalScore(
        "General Wellness",
        scan.sugar || 0,
        scan.fat || 0,
        scan.salt || 0,
        Number(scan.nova),
        0
      );

      return { ...scan, score };
    });

    const averageScore =
      scoredScans.length > 0
        ? Math.round(
            scoredScans.reduce((sum, item) => sum + item.score, 0) /
              scoredScans.length
          )
        : 0;

    const bestProduct =
      scoredScans.length > 0
        ? [...scoredScans].sort((a, b) => b.score - a.score)[0]
        : null;

    const worstProduct =
      scoredScans.length > 0
        ? [...scoredScans].sort((a, b) => a.score - b.score)[0]
        : null;

    const highSugarCount = scans.filter((item) => (item.sugar || 0) > 15).length;
    const highSaltCount = scans.filter((item) => (item.salt || 0) > 1.5).length;
    const ultraProcessedCount = scans.filter(
      (item) => Number(item.nova) >= 4
    ).length;

    const mainRisk =
      highSugarCount >= highSaltCount &&
      highSugarCount >= ultraProcessedCount &&
      highSugarCount > 0
        ? "High Sugar"
        : highSaltCount >= highSugarCount &&
          highSaltCount >= ultraProcessedCount &&
          highSaltCount > 0
        ? "High Salt"
        : ultraProcessedCount > 0
        ? "Ultra-Processed Foods"
        : "No major pattern detected";

    const recommendation =
      averageScore >= 75
        ? "Great week. Keep choosing minimally processed foods and balanced nutrition."
        : averageScore >= 50
        ? "Moderate week. Try reducing sugary snacks, salty foods, and ultra-processed products."
        : "Your scans show frequent high-risk products. Focus on whole foods, lower sugar, and fewer packaged snacks.";

    return {
      scoredScans,
      averageScore,
      bestProduct,
      worstProduct,
      highSugarCount,
      highSaltCount,
      ultraProcessedCount,
      mainRisk,
      recommendation,
    };
  }, [scans]);

  useEffect(() => {
    if (trackedRef.current) return;
    if (loading || premiumLoading || !isPremium) return;

    trackedRef.current = true;

    posthog.capture(AnalyticsEvents.REPORT_VIEWED, {
      total_scans: scans.length,
      favorites_count: favoritesCount,
      average_score: report.averageScore,
      main_risk: report.mainRisk,
    });
  }, [
    loading,
    premiumLoading,
    isPremium,
    scans.length,
    favoritesCount,
    report.averageScore,
    report.mainRisk,
  ]);

  if (loading || premiumLoading) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center">
        <p className="text-gray-500 font-bold">Loading report...</p>
      </main>
    );
  }

  if (!isPremium) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
        <PremiumGate
          title="Weekly Reports are Premium"
          description="Upgrade to unlock advanced nutrition reports, trends, and health insights."
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <ReportNav />

        <section className="mb-8 rounded-3xl border border-orange-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-wider text-orange-600">
            Weekly Report
          </p>

          <h1 className="mt-3 text-4xl font-black text-gray-900">
            Your health insights
          </h1>

          <p className="mt-2 text-gray-500">{email}</p>
        </section>

        {error && (
          <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-5 font-bold text-red-600">
            {error}
          </div>
        )}

        <section className="mb-8 grid gap-6 md:grid-cols-4">
          <StatCard label="Total Scans" value={scans.length} />
          <StatCard label="Favorites" value={favoritesCount} />
          <StatCard label="Average Score" value={report.averageScore} />
          <StatCard label="Main Risk" value={report.mainRisk} text />
        </section>

        <section className="mb-8 grid gap-6 md:grid-cols-3">
          <RiskCard label="High Sugar" value={report.highSugarCount} />
          <RiskCard label="High Salt" value={report.highSaltCount} />
          <RiskCard
            label="Ultra-Processed"
            value={report.ultraProcessedCount}
          />
        </section>

        <section className="mb-8 grid gap-6 md:grid-cols-2">
          <ProductCard
            title="Best Product"
            type="best"
            product={report.bestProduct}
          />

          <ProductCard
            title="Worst Product"
            type="worst"
            product={report.worstProduct}
          />
        </section>

        <section className="rounded-3xl border border-orange-100 bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-black text-gray-900">
            AI Recommendation
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            {report.recommendation}
          </p>
        </section>
      </div>
    </main>
  );
}

function ReportNav() {
  return (
    <nav className="mb-12 flex items-center justify-between">
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
        className="rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white"
      >
        Scan Food
      </a>
    </nav>
  );
}

function StatCard({
  label,
  value,
  text = false,
}: {
  label: string;
  value: number | string;
  text?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
      <p className="mb-2 font-semibold text-gray-500">{label}</p>
      <h3
        className={`font-black text-orange-600 ${
          text ? "text-2xl" : "text-5xl"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function RiskCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6">
      <p className="font-semibold text-gray-500">{label}</p>
      <h3 className="mt-2 text-5xl font-black text-red-500">{value}</h3>
    </div>
  );
}

function ProductCard({
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
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div className={`rounded-3xl border p-6 ${styles}`}>
      <h3 className="mb-4 text-2xl font-black">{title}</h3>

      {product ? (
        <>
          <p className="text-3xl font-black text-gray-900">
            {product.product_name}
          </p>

          <p className="mt-2 text-gray-500">Score: {product.score}/100</p>
        </>
      ) : (
        <p className="text-gray-500">No scans yet.</p>
      )}
    </div>
  );
}