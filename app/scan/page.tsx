"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import BarcodeScanner from "../components/BarcodeScanner";

interface NutrimentData {
  "energy-kcal_100g"?: number;
  proteins_100g?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  fat_100g?: number;
  "saturated-fat_100g"?: number;
  fiber_100g?: number;
  sodium_100g?: number;
}

interface ProductData {
  product_name?: string;
  brands?: string;
  image_url?: string;
  ingredients_text?: string;
  nutriscore_grade?: string;
  nova_group?: number;
  nutriments?: NutrimentData;
}

interface ScanResult {
  found: boolean;
  product?: ProductData;
  healthScore?: number;
  verdict?: string;
  warnings?: string[];
}

function calculateHealthScore(product: ProductData): { score: number; verdict: string; warnings: string[] } {
  let score = 70;
  const warnings: string[] = [];
  const n = product.nutriments || {};

  if ((n.sugars_100g ?? 0) > 20) { score -= 20; warnings.push("Very high sugar content"); }
  else if ((n.sugars_100g ?? 0) > 10) { score -= 10; warnings.push("High sugar content"); }
  if ((n["saturated-fat_100g"] ?? 0) > 10) { score -= 15; warnings.push("High saturated fat"); }
  else if ((n["saturated-fat_100g"] ?? 0) > 5) { score -= 7; warnings.push("Moderate saturated fat"); }
  if ((n.sodium_100g ?? 0) > 1) { score -= 15; warnings.push("Very high sodium"); }
  else if ((n.sodium_100g ?? 0) > 0.5) { score -= 8; warnings.push("High sodium"); }
  if ((n.fiber_100g ?? 0) > 5) score += 10;
  else if ((n.fiber_100g ?? 0) > 3) score += 5;
  if ((n.proteins_100g ?? 0) > 15) score += 8;
  else if ((n.proteins_100g ?? 0) > 8) score += 4;
  if (product.nova_group === 4) { score -= 15; warnings.push("Ultra-processed food (NOVA 4)"); }
  else if (product.nova_group === 3) { score -= 5; warnings.push("Processed food (NOVA 3)"); }

  const ingredients = (product.ingredients_text || "").toLowerCase();
  if (ingredients.includes("high fructose") || ingredients.includes("hfcs")) { score -= 10; warnings.push("Contains High Fructose Corn Syrup"); }
  if (ingredients.includes("partially hydrogenated")) { score -= 15; warnings.push("Contains Trans Fats"); }
  if (ingredients.includes("sodium nitrate") || ingredients.includes("sodium nitrite")) { score -= 8; warnings.push("Contains Nitrates/Nitrites"); }
  if (ingredients.includes("artificial color") || ingredients.includes("red 40") || ingredients.includes("yellow 5")) { score -= 5; warnings.push("Contains Artificial Colors"); }
  if (ingredients.includes("aspartame") || ingredients.includes("sucralose")) { score -= 5; warnings.push("Contains Artificial Sweeteners"); }

  score = Math.max(5, Math.min(100, score));
  let verdict = "Excellent";
  if (score < 40) verdict = "Poor";
  else if (score < 60) verdict = "Moderate";
  else if (score < 75) verdict = "Good";
  return { score, verdict, warnings };
}

function generateAIExplanation(product: ProductData, score: number, warnings: string[]): string[] {
  const n = product.nutriments || {};
  const name = product.product_name || "This product";
  const paragraphs: string[] = [];

  if (score >= 75) {
    paragraphs.push(`${name} has a good nutritional profile with no major red flags detected.`);
  } else if (score >= 60) {
    paragraphs.push(`${name} is acceptable but has some nutritional concerns worth noting.`);
  } else if (score >= 40) {
    paragraphs.push(`${name} has several nutritional concerns. Best consumed occasionally.`);
  } else {
    paragraphs.push(`${name} scores poorly nutritionally with multiple health concerns detected.`);
  }

  if ((n.sugars_100g ?? 0) > 20) paragraphs.push(`⚠️ Contains ${n.sugars_100g}g sugar per 100g — extremely high. WHO recommends max 25g/day.`);
  if ((n["saturated-fat_100g"] ?? 0) > 10) paragraphs.push(`🫀 High saturated fat (${n["saturated-fat_100g"]}g/100g) linked to elevated LDL cholesterol.`);
  if ((n.sodium_100g ?? 0) > 0.5) paragraphs.push(`🧂 High sodium (${Math.round((n.sodium_100g ?? 0) * 1000)}mg/100g) linked to hypertension.`);
  if (product.nova_group === 4) paragraphs.push(`🏭 Ultra-processed (NOVA 4) — linked to obesity, cancer risk, and poor metabolic health.`);
  if (warnings.includes("Contains High Fructose Corn Syrup")) paragraphs.push(`🚫 Contains HFCS — linked to fatty liver disease and metabolic syndrome.`);
  if ((n.fiber_100g ?? 0) > 5) paragraphs.push(`✅ Good fiber content (${n.fiber_100g}g/100g) — supports digestive health.`);
  if ((n.proteins_100g ?? 0) > 15) paragraphs.push(`✅ High protein (${n.proteins_100g}g/100g) — supports muscle maintenance.`);

  if (score < 50) paragraphs.push(`💡 Look for alternatives with simpler ingredients and NOVA 1-2 classification.`);
  else if (score < 75) paragraphs.push(`💡 Acceptable in moderation — balance with whole foods daily.`);
  else paragraphs.push(`💡 A solid nutritional choice. Keep making similar decisions!`);

  return paragraphs;
}

// Circular Score Ring Component
function ScoreRing({ score, verdict }: { score: number; verdict: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const color = score >= 75 ? "#00c853" : score >= 60 ? "#ffd600" : score >= 40 ? "#ff6d00" : "#d50000";
  const bgColor = score >= 75 ? "#e8f5e9" : score >= 60 ? "#fffde7" : score >= 40 ? "#fff3e0" : "#ffebee";
  const textColor = score >= 75 ? "text-[#00c853]" : score >= 60 ? "text-[#ffd600]" : score >= 40 ? "text-[#ff6d00]" : "text-[#d50000]";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease-in-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black ${textColor}`}>{score}</span>
          <span className="text-xs text-gray-400 font-medium">/100</span>
        </div>
      </div>
      <div
        className="mt-3 px-5 py-1.5 rounded-full text-sm font-bold"
        style={{ backgroundColor: bgColor, color }}
      >
        {verdict}
      </div>
    </div>
  );
}

function NovaBadge({ group }: { group?: number }) {
  const labels: Record<number, { label: string; color: string }> = {
    1: { label: "NOVA 1 · Unprocessed", color: "bg-green-100 text-green-700" },
    2: { label: "NOVA 2 · Culinary", color: "bg-yellow-100 text-yellow-700" },
    3: { label: "NOVA 3 · Processed", color: "bg-orange-100 text-orange-700" },
    4: { label: "NOVA 4 · Ultra-Processed ⚠", color: "bg-red-100 text-red-700" },
  };
  if (!group || !labels[group]) return null;
  const { label, color } = labels[group];
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${color}`}>{label}</span>;
}

function NutrientBar({ label, value, unit, max, color }: { label: string; value?: number; unit: string; max: number; color: string }) {
  const pct = value ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-xs font-bold text-gray-700">{value !== undefined ? `${Math.round(value * 10) / 10}${unit}` : "—"}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ScanPage() {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  async function handleScan() {
    if (!barcode.trim()) { setError("Please enter a barcode number."); return; }
    setError("");
    setLoading(true);
    setResult(null);
    setSaved(false);

    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode.trim()}.json`);
      const data = await res.json();

      if (data.status === 0 || !data.product) {
        setResult({ found: false });
      } else {
        const product: ProductData = data.product;
        const { score, verdict, warnings } = calculateHealthScore(product);
        setResult({ found: true, product, healthScore: score, verdict, warnings });

        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || "00000000-0000-0000-0000-000000000000";
        const { error: saveError } = await supabase.from("scans").insert({
          user_id: userId,
          product_name: product.product_name || "Unknown",
          barcode: barcode.trim(),
          health_score: score,
          verdict,
          image_url: product.image_url || "",
        });
        if (!saveError) setSaved(true);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  const n = result?.product?.nutriments || {};

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00ff87] to-[#00c853] flex items-center justify-center shadow-sm">
              <span className="text-black font-black text-xs">N</span>
            </div>
            <span className="font-black text-gray-900 tracking-tight">NutriScan</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/history" className="text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors">History</a>
            <a href="/login" className="text-sm bg-gray-900 text-white font-semibold px-4 py-2 rounded-full hover:bg-gray-700 transition-colors">Account</a>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Barcode Number</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="e.g. 0038000845581"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#00c853] focus:ring-2 focus:ring-[#00c853]/20 transition-all text-sm font-mono"
            />
            <button
              onClick={() => setShowCamera(true)}
              className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all text-lg"
              title="Scan with camera"
            >
              📷
            </button>
            <button
              onClick={handleScan}
              disabled={loading}
              className="bg-[#00c853] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#00b548] transition-all disabled:opacity-50 text-sm whitespace-nowrap shadow-sm"
            >
              {loading ? "..." : "Scan →"}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-gray-300">Try:</span>
            {[
              { label: "Corn Flakes", code: "0038000845581" },
              { label: "Nutella", code: "3017620422003" },
              { label: "Coca-Cola", code: "5449000000996" },
            ].map((ex) => (
              <button key={ex.code} onClick={() => setBarcode(ex.code)} className="text-xs text-[#00c853] hover:underline font-medium">
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-full border-3 border-gray-100 border-t-[#00c853] animate-spin mx-auto mb-4" style={{ borderWidth: 3 }} />
            <p className="text-gray-400 text-sm font-medium">Analyzing product...</p>
          </div>
        )}

        {/* Not Found */}
        {result && !result.found && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-bold text-gray-800 mb-2">Product Not Found</h3>
            <p className="text-gray-400 text-sm">This barcode isn't in our database yet. Try another product.</p>
          </div>
        )}

        {/* Results */}
        {result?.found && result.product && (
          <div className="space-y-4">
            {/* Saved toast */}
            {saved && (
              <div className="bg-[#00c853]/10 border border-[#00c853]/20 rounded-xl px-4 py-2.5 text-[#00c853] text-xs font-semibold text-center">
                ✅ Saved to your history
              </div>
            )}

            {/* Product Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Product header */}
              <div className="p-5 flex items-center gap-4 border-b border-gray-50">
                {result.product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={result.product.image_url} alt="" className="w-20 h-20 object-contain rounded-xl bg-gray-50 p-1" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-3xl">📦</div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-gray-900 text-lg leading-tight truncate">
                    {result.product.product_name || "Unknown Product"}
                  </h2>
                  <p className="text-gray-400 text-sm mt-0.5">{result.product.brands || "Unknown Brand"}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <NovaBadge group={result.product.nova_group} />
                    {result.product.nutriscore_grade && (
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase">
                        Nutri-Score {result.product.nutriscore_grade}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Score Ring */}
              <div className="p-6 flex flex-col items-center border-b border-gray-50">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">Health Score</p>
                <ScoreRing score={result.healthScore!} verdict={result.verdict!} />
              </div>

              {/* Warnings */}
              {result.warnings && result.warnings.length > 0 && (
                <div className="p-5 border-b border-gray-50">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Concerns</p>
                  <div className="space-y-2">
                    {result.warnings.map((w) => (
                      <div key={w} className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2">
                        <span className="text-red-400 text-sm">⚠</span>
                        <span className="text-sm text-red-600 font-medium">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              <div className="p-5 border-b border-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-[#00c853]/10 flex items-center justify-center">
                    <span className="text-xs">🧠</span>
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">AI Analysis</p>
                </div>
                <div className="space-y-2">
                  {generateAIExplanation(result.product, result.healthScore!, result.warnings!).map((p, i) => (
                    <p key={i} className="text-sm text-gray-600 leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>

              {/* Nutrition Bars */}
              <div className="p-5 border-b border-gray-50">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">Nutrition per 100g</p>
                <NutrientBar label="Calories" value={n["energy-kcal_100g"]} unit="kcal" max={500} color="bg-purple-400" />
                <NutrientBar label="Sugar" value={n.sugars_100g} unit="g" max={50} color="bg-red-400" />
                <NutrientBar label="Fat" value={n.fat_100g} unit="g" max={40} color="bg-orange-400" />
                <NutrientBar label="Saturated Fat" value={n["saturated-fat_100g"]} unit="g" max={20} color="bg-red-500" />
                <NutrientBar label="Protein" value={n.proteins_100g} unit="g" max={30} color="bg-blue-400" />
                <NutrientBar label="Fiber" value={n.fiber_100g} unit="g" max={10} color="bg-green-400" />
                <NutrientBar label="Sodium" value={n.sodium_100g ? n.sodium_100g * 1000 : undefined} unit="mg" max={1000} color="bg-yellow-400" />
              </div>

              {/* Ingredients */}
              {result.product.ingredients_text && (
                <div className="p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Ingredients</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{result.product.ingredients_text}</p>
                </div>
              )}
            </div>

            {/* Scan another */}
            <button
              onClick={() => { setResult(null); setBarcode(""); setSaved(false); }}
              className="w-full py-4 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all text-sm font-medium shadow-sm"
            >
              ← Scan Another Product
            </button>
          </div>
        )}
      </div>

      {/* Bottom nav for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-around md:hidden z-40">
        <a href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-700">
          <span className="text-xl">🏠</span>
          <span className="text-xs font-medium">Home</span>
        </a>
        <a href="/scan" className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-[#00c853] rounded-full flex items-center justify-center shadow-lg -mt-6">
            <span className="text-xl">📷</span>
          </div>
          <span className="text-xs font-medium text-[#00c853]">Scan</span>
        </a>
        <a href="/history" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-700">
          <span className="text-xl">📋</span>
          <span className="text-xs font-medium">History</span>
        </a>
      </div>

      {/* Camera scanner */}
      {showCamera && (
        <BarcodeScanner
          onScan={(code) => {
            setBarcode(code);
            setShowCamera(false);
            setTimeout(() => handleScan(), 100);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </main>
  );
}
