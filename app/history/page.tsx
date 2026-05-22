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
  if (score >= 75) return { color: "#00c853", bg: "bg-green-50", text: "text-green-600", border: "border-green-100" };
  if (score >= 60) return { color: "#ffd600", bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-100" };
  if (score >= 40) return { color: "#ff6d00", bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" };
  return { color: "#d50000", bg: "bg-red-50", text: "text-red-600", border: "border-red-100" };
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
          <circle cx="24" cy="24" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="4" />
          <circle cx="24" cy="24" r={radius} fill="none" stroke={style.color} strokeWidth="4"
            strokeDasharray={`${progress} ${circumference}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black" style={{ color: style.color }}>{score}</span>
        </div>
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
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

  useEffect(() => {
    async function loadHistory() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || "00000000-0000-0000-0000-000000000000";
      const { data } = await supabase
        .from("scans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setScans(data || []);
      setLoading(false);
    }
    loadHistory();
  }, []);

  const avgScore = scans.length ? Math.round(scans.reduce((a, s) => a + s.health_score, 0) / scans.length) : 0;
  const unhealthy = scans.filter(s => s.verdict === "Poor").length;
  const healthy = scans.filter(s => s.verdict === "Excellent").length;
  const scoreStyle = getScoreStyle(avgScore);

  return (
    <main className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00ff87] to-[#00c853] flex items-center justify-center shadow-sm">
              <span className="text-black font-black text-xs">N</span>
            </div>
            <span className="font-black text-gray-900 tracking-tight">NutriScan</span>
          </a>
          <a href="/scan" className="text-sm bg-[#00c853] text-white font-semibold px-4 py-2 rounded-full hover:bg-[#00b548] transition-colors shadow-sm">
            + New Scan
          </a>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Scan History</h1>
          <p className="text-gray-400 text-sm mt-1">Every product you've analyzed</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 rounded-full border-gray-100 border-t-[#00c853] animate-spin mx-auto mb-4" style={{ borderWidth: 3, borderStyle: "solid" }} />
            <p className="text-gray-400 text-sm">Loading your history...</p>
          </div>
        )}

        {/* Stats */}
        {!loading && scans.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-black text-gray-900">{scans.length}</div>
              <div className="text-xs text-gray-400 font-medium mt-1">Total Scans</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <div className={`text-3xl font-black ${scoreStyle.text}`}>{avgScore}</div>
              <div className="text-xs text-gray-400 font-medium mt-1">Avg Score</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-black text-red-500">{unhealthy}</div>
              <div className="text-xs text-gray-400 font-medium mt-1">Poor Rated</div>
            </div>
          </div>
        )}

        {/* Overall health summary */}
        {!loading && scans.length > 0 && (
          <div className={`bg-white rounded-2xl p-5 mb-6 shadow-sm border ${scoreStyle.border}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Your Diet Score</p>
                <p className="text-2xl font-black text-gray-900">
                  {avgScore >= 75 ? "Eating Well! 🥗" : avgScore >= 60 ? "Room to Improve 🙂" : avgScore >= 40 ? "Needs Attention ⚠️" : "Poor Diet 🚨"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {healthy} excellent · {unhealthy} poor · {scans.length - healthy - unhealthy} moderate
                </p>
              </div>
              <div className="text-5xl">
                {avgScore >= 75 ? "🥗" : avgScore >= 60 ? "🙂" : avgScore >= 40 ? "⚠️" : "🚨"}
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && scans.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="font-bold text-gray-800 mb-2">No scans yet</h3>
            <p className="text-gray-400 text-sm mb-6">Start scanning food products to track your nutrition</p>
            <a href="/scan" className="bg-[#00c853] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#00b548] transition-colors">
              Scan Your First Product →
            </a>
          </div>
        )}

        {/* Scan list */}
        {!loading && scans.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold px-1">{scans.length} Products Scanned</p>
            {scans.map((scan) => (
              <div key={scan.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100">
                  {scan.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={scan.image_url} alt={scan.product_name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{scan.product_name || "Unknown Product"}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">{scan.barcode}</p>
                  <p className="text-xs text-gray-300 mt-1">{timeAgo(scan.created_at)}</p>
                </div>

                {/* Score */}
                <ScoreBadge score={scan.health_score} verdict={scan.verdict} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-around md:hidden z-40">
        <a href="/" className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xl">🏠</span>
          <span className="text-xs font-medium">Home</span>
        </a>
        <a href="/scan" className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-[#00c853] rounded-full flex items-center justify-center shadow-lg -mt-6">
            <span className="text-xl">📷</span>
          </div>
          <span className="text-xs font-medium text-[#00c853]">Scan</span>
        </a>
        <a href="/history" className="flex flex-col items-center gap-1 text-[#00c853]">
          <span className="text-xl">📋</span>
          <span className="text-xs font-medium">History</span>
        </a>
      </div>
    </main>
  );
}
