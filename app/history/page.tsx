"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Scan {
  id: number;
  product_name: string;
  barcode: string;
  health_score: number;
  verdict: string;
  image_url: string;
  created_at: string;
}

function getScoreStyle(score: number) {
  if (score >= 75) return { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" };
  if (score >= 60) return { color: "#d97706", bg: "#fffbeb", border: "#fde68a" };
  if (score >= 40) return { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" };
  return { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" };
}

function ScoreBadge({ score, verdict }: { score: number; verdict: string }) {
  const style = getScoreStyle(score);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-14">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="4" />
          <circle cx="24" cy="24" r={radius} fill="none" stroke={style.color} strokeWidth="4"
            strokeDasharray={`${progress} ${circumference}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black" style={{ color: style.color }}>{score}</span>
        </div>
      </div>
      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
        {verdict}
      </span>
    </div>
  );
}

function timeAgo(dateStr: string): string {
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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function loadHistory() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || "00000000-0000-0000-0000-000000000000";
      const { data } = await supabase
        .from("scans").select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setScans(data || []);
      setLoading(false);
    }
    loadHistory();
  }, []);

  // Filter and search
  const filtered = scans.filter(scan => {
    const matchSearch = scan.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      scan.barcode?.includes(search);
    const matchFilter =
      filter === "all" ? true :
      filter === "excellent" ? scan.health_score >= 75 :
      filter === "good" ? scan.health_score >= 60 && scan.health_score < 75 :
      filter === "moderate" ? scan.health_score >= 40 && scan.health_score < 60 :
      filter === "poor" ? scan.health_score < 40 : true;
    return matchSearch && matchFilter;
  });

  const avgScore = scans.length ? Math.round(scans.reduce((a, s) => a + s.health_score, 0) / scans.length) : 0;
  const poor = scans.filter(s => s.health_score < 40).length;
  const excellent = scans.filter(s => s.health_score >= 75).length;

  return (
    <main className="min-h-screen pb-24" style={{ background: "#fff7ed" }}>
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-40" style={{ borderColor: "#fed7aa" }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              <span className="text-white font-black text-sm">D</span>
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">DANTEY <span style={{ color: "#f97316" }}>AI</span></span>
          </a>
          <a href="/scan" className="text-sm font-bold px-4 py-2 rounded-full text-white shadow-sm" style={{ background: "#f97316" }}>
            + New Scan
          </a>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Scan History</h1>
          <p className="text-gray-400 text-sm mt-1">Every product you have analyzed</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 rounded-full mx-auto mb-4 animate-spin" style={{ border: "3px solid #fed7aa", borderTopColor: "#f97316" }} />
            <p className="text-gray-400 text-sm">Loading your history...</p>
          </div>
        )}

        {/* Stats */}
        {!loading && scans.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Scans", value: scans.length, color: "#111827" },
              { label: "Avg Score", value: avgScore, color: avgScore >= 60 ? "#16a34a" : "#dc2626" },
              { label: "Poor Rated", value: poor, color: "#dc2626" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 text-center border shadow-sm" style={{ borderColor: "#fed7aa" }}>
                <div className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Diet summary */}
        {!loading && scans.length > 0 && (
          <div className="bg-white rounded-2xl p-5 mb-6 border shadow-sm" style={{ borderColor: "#fed7aa" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Your Diet Score</p>
                <p className="text-2xl font-black text-gray-900">
                  {avgScore >= 75 ? "Eating Well! 🥗" : avgScore >= 60 ? "Room to Improve 🙂" : avgScore >= 40 ? "Needs Attention ⚠️" : "Poor Diet 🚨"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {excellent} excellent · {poor} poor · {scans.length - excellent - poor} moderate
                </p>
              </div>
              <div className="text-5xl">{avgScore >= 75 ? "🥗" : avgScore >= 60 ? "🙂" : avgScore >= 40 ? "⚠️" : "🚨"}</div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        {!loading && scans.length > 0 && (
          <div className="space-y-3 mb-6">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-white border rounded-2xl pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none shadow-sm"
                style={{ borderColor: "#fed7aa" }}
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { value: "all", label: "All" },
                { value: "excellent", label: "✅ Excellent" },
                { value: "good", label: "🟡 Good" },
                { value: "moderate", label: "🟠 Moderate" },
                { value: "poor", label: "🔴 Poor" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className="text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all"
                  style={{
                    background: filter === f.value ? "#f97316" : "white",
                    color: filter === f.value ? "white" : "#6b7280",
                    border: filter === f.value ? "1px solid #f97316" : "1px solid #fed7aa",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && scans.length === 0 && (
          <div className="bg-white rounded-3xl border p-12 text-center shadow-sm" style={{ borderColor: "#fed7aa" }}>
            <div className="text-5xl mb-4">📦</div>
            <h3 className="font-bold text-gray-800 mb-2">No scans yet</h3>
            <p className="text-gray-400 text-sm mb-6">Start scanning food products to track your nutrition</p>
            <a href="/scan" className="font-bold px-6 py-3 rounded-full text-white text-sm" style={{ background: "#f97316" }}>
              Scan Your First Product →
            </a>
          </div>
        )}

        {/* No results */}
        {!loading && scans.length > 0 && filtered.length === 0 && (
          <div className="bg-white rounded-3xl border p-10 text-center shadow-sm" style={{ borderColor: "#fed7aa" }}>
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold text-gray-800 mb-1">No results found</h3>
            <p className="text-gray-400 text-sm">Try a different search or filter</p>
          </div>
        )}

        {/* Scan list */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">
              {filtered.length} {filtered.length === scans.length ? "Products Scanned" : `of ${scans.length} shown`}
            </p>
            {filtered.map((scan) => (
              <div key={scan.id} className="bg-white rounded-2xl border p-4 flex items-center gap-4 hover:shadow-md transition-shadow" style={{ borderColor: "#fed7aa" }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
                  {scan.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={scan.image_url} alt={scan.product_name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{scan.product_name || "Unknown"}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">{scan.barcode}</p>
                  <p className="text-xs text-gray-300 mt-1">{timeAgo(scan.created_at)}</p>
                </div>
                <ScoreBadge score={scan.health_score} verdict={scan.verdict} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3 flex items-center justify-around md:hidden z-40" style={{ borderColor: "#fed7aa" }}>
        <a href="/" className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xl">🏠</span>
          <span className="text-xs font-medium">Home</span>
        </a>
        <a href="/scan" className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg -mt-6" style={{ background: "#f97316" }}>
            <span className="text-xl">📷</span>
          </div>
          <span className="text-xs font-medium" style={{ color: "#f97316" }}>Scan</span>
        </a>
        <a href="/history" className="flex flex-col items-center gap-1" style={{ color: "#f97316" }}>
          <span className="text-xl">📋</span>
          <span className="text-xs font-medium">History</span>
        </a>
      </div>
    </main>
  );
}
