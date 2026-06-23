"use client";



import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Scan = {
  id: number;
  product_name: string;
  barcode: string | null;
  health_score: number | null;
  verdict: string | null;
  image_url: string | null;
  created_at: string;
};

type FilterType = "all" | "excellent" | "good" | "moderate" | "poor";

function getScoreStyle(score: number) {
  if (score >= 75) return "text-green-600 bg-green-50 border-green-200";
  if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  if (score >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
  return "text-red-600 bg-red-50 border-red-200";
}

function getScoreLabel(score: number) {
  if (score >= 75) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  return "Poor";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function HistoryPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          window.location.href = "/auth";
          return;
        }

        const { data, error: scanError } = await supabase
          .from("scans")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(100);

        if (scanError) throw scanError;

        setScans((data || []) as Scan[]);
      } catch (err) {
        console.error("History load failed:", err);
        setError("Could not load your scan history. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const stats = useMemo(() => {
    const total = scans.length;

    const averageScore = total
      ? Math.round(
          scans.reduce((sum, scan) => sum + Number(scan.health_score || 0), 0) /
            total
        )
      : 0;

    const excellent = scans.filter(
      (scan) => Number(scan.health_score || 0) >= 75
    ).length;

    const poor = scans.filter(
      (scan) => Number(scan.health_score || 0) < 40
    ).length;

    const healthyRate = total ? Math.round((excellent / total) * 100) : 0;

    return {
      total,
      averageScore,
      excellent,
      poor,
      healthyRate,
    };
  }, [scans]);

  const filteredScans = useMemo(() => {
    const cleanSearch = search.toLowerCase().trim();

    return scans.filter((scan) => {
      const score = Number(scan.health_score || 0);

      const matchesSearch =
        !cleanSearch ||
        scan.product_name?.toLowerCase().includes(cleanSearch) ||
        scan.barcode?.includes(cleanSearch);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "excellent"
          ? score >= 75
          : filter === "good"
          ? score >= 60 && score < 75
          : filter === "moderate"
          ? score >= 40 && score < 60
          : score < 40;

      return matchesSearch && matchesFilter;
    });
  }, [scans, search, filter]);

  const dietSummary =
    stats.averageScore >= 75
      ? "Eating well"
      : stats.averageScore >= 60
      ? "Room to improve"
      : stats.averageScore >= 40
      ? "Needs attention"
      : "High-risk pattern";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center">
        <p className="font-bold text-gray-500">Loading your history...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-12 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="PAUSTICA"
              width={48}
              height={48}
              className="object-contain"
              priority
            />

            <span className="text-2xl font-black text-gray-900">
              PAUSTICA
            </span>
          </a>

          <a
            href="/scan"
            className="rounded-full bg-gray-900 px-6 py-3 text-sm font-black text-white"
          >
            New Scan
          </a>
        </nav>

        <section className="mb-8 rounded-3xl bg-gray-900 p-8 text-white">
          <p className="text-sm font-black uppercase tracking-wider text-orange-300">
            Scan History
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-6xl">
            Your food timeline
          </h1>

          <p className="mt-4 max-w-2xl text-white/60">
            Review every product you scanned, filter by health quality, and spot
            patterns in your food choices.
          </p>
        </section>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-5 font-bold text-red-600">
            {error}
          </div>
        )}

        {scans.length > 0 && (
          <>
            <section className="mb-8 grid gap-4 md:grid-cols-4">
              <StatCard label="Total Scans" value={stats.total} />
              <StatCard label="Average Score" value={`${stats.averageScore}/100`} />
              <StatCard label="Excellent" value={stats.excellent} />
              <StatCard label="Poor Rated" value={stats.poor} danger />
            </section>

            <section className="mb-8 rounded-3xl border border-orange-100 bg-white p-8 shadow-sm">
              <p className="text-sm font-black uppercase tracking-wider text-orange-600">
                Insights
              </p>

              <h2 className="mt-3 text-3xl font-black text-gray-900">
                {dietSummary}
              </h2>

              <p className="mt-3 text-gray-500">
                {stats.healthyRate}% of your scanned foods are excellent choices.
                Keep scanning before buying to improve your food decisions.
              </p>
            </section>

            <section className="mb-8 grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products or barcode..."
                className="rounded-2xl border border-orange-100 bg-white px-5 py-4 font-bold text-gray-900 outline-none focus:border-orange-400"
              />

              <div className="flex gap-2 overflow-x-auto">
                {[
                  ["all", "All"],
                  ["excellent", "Excellent"],
                  ["good", "Good"],
                  ["moderate", "Moderate"],
                  ["poor", "Poor"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value as FilterType)}
                    className={
                      filter === value
                        ? "rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white"
                        : "rounded-2xl border border-orange-100 bg-white px-5 py-3 text-sm font-black text-gray-500"
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {scans.length === 0 ? (
          <EmptyState />
        ) : filteredScans.length === 0 ? (
          <div className="rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-sm">
            <h3 className="text-2xl font-black text-gray-900">
              No results found
            </h3>
            <p className="mt-2 text-gray-500">
              Try another search term or filter.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">
              {filteredScans.length}{" "}
              {filteredScans.length === scans.length
                ? "products scanned"
                : `of ${scans.length} shown`}
            </p>

            {filteredScans.map((scan) => (
              <ScanHistoryCard key={scan.id} scan={scan} />
            ))}
          </section>
        )}
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
  value: number | string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold text-gray-500">{label}</p>

      <h3
        className={`mt-2 text-4xl font-black ${
          danger ? "text-red-500" : "text-orange-600"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function ScanHistoryCard({ scan }: { scan: Scan }) {
  const score = Number(scan.health_score || 0);

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50">
        {scan.image_url ? (
          <Image
            src={scan.image_url}
            alt={scan.product_name || "Product"}
            width={64}
            height={64}
            className="h-full w-full object-contain p-1"
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-orange-50" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-black text-gray-900">
          {scan.product_name || "Unknown product"}
        </h3>

        <p className="mt-1 font-mono text-xs text-gray-400">
          {scan.barcode || "No barcode"}
        </p>

        <p className="mt-1 text-xs font-semibold text-gray-400">
          {timeAgo(scan.created_at)}
        </p>
      </div>

      <ScoreBadge score={score} verdict={scan.verdict || getScoreLabel(score)} />
    </div>
  );
}

function ScoreBadge({ score, verdict }: { score: number; verdict: string }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-center ${getScoreStyle(
        score
      )}`}
    >
      <p className="text-2xl font-black">{score}</p>
      <p className="text-xs font-black">{verdict}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-12 text-center shadow-sm">
      <h3 className="text-3xl font-black text-gray-900">No scans yet</h3>

      <p className="mx-auto mt-3 max-w-md text-gray-500">
        Start scanning food products to build your personalized nutrition
        history.
      </p>

      <a
        href="/scan"
        className="mt-6 inline-flex rounded-2xl bg-orange-500 px-6 py-4 font-black text-white"
      >
        Scan Your First Product
      </a>
    </div>
  );
}