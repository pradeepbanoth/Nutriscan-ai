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

function getScoreColor(score: number) {
  if (score >= 75) return { text: "text-[#00ff87]", border: "border-[#00ff87]/20" };
  if (score >= 60) return { text: "text-yellow-400", border: "border-yellow-400/20" };
  if (score >= 40) return { text: "text-orange-400", border: "border-orange-400/20" };
  return { text: "text-red-400", border: "border-red-400/20" };
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
      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Data:", data);
      console.log("Error:", error);
      setScans(data || []);
      setLoading(false);
    }
    loadHistory();
  }, []);

  const avgScore = scans.length ? Math.round(scans.reduce((a, s) => a + s.health_score, 0) / scans.length) : 0;
  const unhealthy = scans.filter(s => s.verdict === "Unhealthy").length;
  const healthy = scans.filter(s => s.verdict === "Healthy").length;

  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00ff87] opacity-[0.04] blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <a href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff87] to-[#00c853] flex items-center justify-center">
            <span className="text-black font-black text-xs">N</span>
          </div>
          <span className="font-bold tracking-tight">Nutri<span className="text-[#00ff87]">Scan</span> AI</span>
        </a>
        <a href="/scan" className="text-sm bg-[#00ff87] text-black font-bold px-4 py-2 rounded-full hover:bg-[#69ff47] transition-colors">
          + New Scan
        </a>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter mb-2">
            Your Scan <span className="text-[#00ff87]">History</span>
          </h1>
          <p className="text-white/40 text-sm">Every product you've analyzed, in one place.</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-[#00ff87]/20 border-t-[#00ff87] animate-spin mx-auto mb-4" />
            <p className="text-white/30 text-sm">Loading your history...</p>
          </div>
        )}

        {/* Stats */}
        {!loading && scans.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Scans", value: scans.length, color: "text-white" },
              { label: "Avg Health Score", value: avgScore, color: avgScore >= 60 ? "text-[#00ff87]" : "text-red-400" },
              { label: "Unhealthy Found", value: unhealthy, color: "text-red-400" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/[0.02] border border-white/8 rounded-2xl p-5 text-center">
                <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-white/30 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && scans.length === 0 && (
          <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/[0.02]">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="font-bold mb-2">No scans yet</h3>
            <p className="text-white/30 text-sm mb-6">Start scanning food products to build your history</p>
            <a href="/scan" className="bg-[#00ff87] text-black font-bold px-6 py-3 rounded-full text-sm hover:bg-[#69ff47] transition-colors">
              Scan Your First Product →
            </a>
          </div>
        )}

        {/* Scan list */}
        {!loading && scans.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/30 uppercase tracking-widest">{scans.length} Products Scanned</span>
              <span className="text-xs text-white/20">{healthy} healthy · {unhealthy} unhealthy</span>
            </div>
            {scans.map((scan) => {
              const colors = getScoreColor(scan.health_score);
              return (
                <div key={scan.id} className="flex items-center gap-4 bg-white/[0.02] border border-white/8 hover:border-white/15 rounded-2xl p-4 transition-all">
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {scan.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={scan.image_url} alt={scan.product_name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{scan.product_name || "Unknown Product"}</h3>
                    <p className="text-xs text-white/30 mt-0.5 font-mono">{scan.barcode}</p>
                    <p className="text-xs text-white/20 mt-1">{timeAgo(scan.created_at)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-2xl font-black ${colors.text}`}>{scan.health_score}</div>
                    <div className={`text-xs mt-1 px-2 py-0.5 rounded-full border ${colors.border} ${colors.text}`}>
                      {scan.verdict}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
