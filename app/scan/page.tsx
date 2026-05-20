"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

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

function generateAIExplanation(product: ProductData, score: number, warnings: string[]): string[] {
  const n = product.nutriments || {};
  const name = product.product_name || "This product";
  const paragraphs: string[] = [];

  if (score >= 75) {
    paragraphs.push(`${name} scores well nutritionally. It shows a balanced macronutrient profile with no major red flags detected in its ingredient list.`);
  } else if (score >= 60) {
    paragraphs.push(`${name} has an acceptable nutritional profile but has some areas of concern. There are better alternatives depending on your health goals.`);
  } else if (score >= 40) {
    paragraphs.push(`${name} has several nutritional concerns. It should be treated as an occasional food rather than a daily staple.`);
  } else {
    paragraphs.push(`${name} scores poorly from a nutritional standpoint. With a health score of ${score}/100, this product has multiple markers associated with poor metabolic health.`);
  }

  if ((n.sugars_100g ?? 0) > 20) {
    paragraphs.push(`⚠️ Sugar Alert: This product contains ${n.sugars_100g}g of sugar per 100g — extremely high. The WHO recommends no more than 25g of free sugars per day.`);
  } else if ((n.sugars_100g ?? 0) > 10) {
    paragraphs.push(`Sugar content is elevated at ${n.sugars_100g}g per 100g. Regular consumption adds up quickly.`);
  }

  if ((n["saturated-fat_100g"] ?? 0) > 10) {
    paragraphs.push(`🫀 Heart Health Concern: Saturated fat content of ${n["saturated-fat_100g"]}g per 100g is high, linked to elevated LDL cholesterol.`);
  }

  if ((n.sodium_100g ?? 0) > 0.5) {
    const sodiumMg = Math.round((n.sodium_100g ?? 0) * 1000);
    paragraphs.push(`🧂 Sodium Warning: At ${sodiumMg}mg per 100g, this product is high in salt, linked to hypertension.`);
  }

  if (product.nova_group === 4) {
    paragraphs.push(`🏭 Ultra-Processed (NOVA 4): Research links high consumption of NOVA 4 foods to obesity, cancer, and depression.`);
  }

  if (warnings.includes("Contains High Fructose Corn Syrup")) {
    paragraphs.push(`🚫 HFCS Detected: Linked to fatty liver disease, obesity, and metabolic syndrome.`);
  }

  if ((n.fiber_100g ?? 0) > 5) {
    paragraphs.push(`✅ Good Fiber: ${n.fiber_100g}g per 100g supports digestive health and stable blood sugar.`);
  }

  if ((n.proteins_100g ?? 0) > 15) {
    paragraphs.push(`✅ High Protein: ${n.proteins_100g}g per 100g supports muscle maintenance and satiety.`);
  }

  if (score < 50) {
    paragraphs.push(`💡 Recommendation: Consider whole food alternatives with shorter ingredient lists and NOVA 1 or 2 classification.`);
  } else if (score < 75) {
    paragraphs.push(`💡 Recommendation: Acceptable in moderation. Balance with whole foods throughout the day.`);
  } else {
    paragraphs.push(`💡 Recommendation: A solid nutritional choice. Keep making similar decisions!`);
  }

  return paragraphs;
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
  let verdict = "Healthy";
  if (score < 40) verdict = "Unhealthy";
  else if (score < 60) verdict = "Moderate";
  else if (score < 75) verdict = "Acceptable";
  return { score, verdict, warnings };
}

function getScoreColor(score: number) {
  if (score >= 75) return { text: "text-[#00ff87]", bg: "bg-[#00ff87]" };
  if (score >= 60) return { text: "text-yellow-400", bg: "bg-yellow-400" };
  if (score >= 40) return { text: "text-orange-400", bg: "bg-orange-400" };
  return { text: "text-red-400", bg: "bg-red-500" };
}

function NovaBadge({ group }: { group?: number }) {
  const labels: Record<number, { label: string; color: string }> = {
    1: { label: "NOVA 1 · Unprocessed", color: "text-[#00ff87] border-[#00ff87]/30 bg-[#00ff87]/10" },
    2: { label: "NOVA 2 · Culinary Ingredient", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
    3: { label: "NOVA 3 · Processed", color: "text-orange-400 border-orange-400/30 bg-orange-400/10" },
    4: { label: "NOVA 4 · Ultra-Processed ⚠", color: "text-red-400 border-red-400/30 bg-red-400/10" },
  };
  if (!group || !labels[group]) return null;
  const { label, color } = labels[group];
  return <span className={`text-xs border rounded-full px-3 py-1 ${color}`}>{label}</span>;
}

export default function ScanPage() {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

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

        const { error: saveError } = await supabase.from("scans").insert({
          user_id: "00000000-0000-0000-0000-000000000000",
          product_name: product.product_name || "Unknown",
          barcode: barcode.trim(),
          health_score: score,
          verdict: verdict,
          image_url: product.image_url || "",
        });
        if (!saveError) setSaved(true);
        else console.log("Save error:", saveError);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const scoreColors = result?.healthScore ? getScoreColor(result.healthScore) : null;
  const n = result?.product?.nutriments || {};

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
        <div className="flex items-center gap-4">
          <a href="/history" className="text-sm text-white/40 hover:text-white transition-colors">My History</a>
          <a href="/login" className="text-sm text-white/40 hover:text-white transition-colors">Account</a>
        </div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 border border-[#00ff87]/20 bg-[#00ff87]/5 rounded-full px-4 py-1.5 text-xs text-[#00ff87] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse inline-block" />
            Real-time Food Analysis
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-3">
            Scan any <span className="text-[#00ff87]">food product</span>
          </h1>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Enter the barcode number from the back of any packaged food.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 mb-8">
          <label className="block text-xs text-white/40 uppercase tracking-widest mb-3">Barcode Number (UPC / EAN)</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="e.g. 0038000845581"
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff87]/50 transition-all text-sm font-mono"
            />
            <button
              onClick={handleScan}
              disabled={loading}
              className="bg-[#00ff87] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#69ff47] transition-all disabled:opacity-50 text-sm whitespace-nowrap"
            >
              {loading ? "Scanning..." : "Analyze →"}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-white/20">Try these:</span>
            {[
              { label: "Kellogg's Corn Flakes", code: "0038000845581" },
              { label: "Nutella", code: "3017620422003" },
              { label: "Coca-Cola", code: "5449000000996" },
            ].map((ex) => (
              <button key={ex.code} onClick={() => setBarcode(ex.code)} className="text-xs text-[#00ff87]/60 hover:text-[#00ff87] underline underline-offset-2 transition-colors">
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#00ff87]/20 border-t-[#00ff87] animate-spin" />
              <p className="text-white/40 text-sm">Analyzing product data...</p>
            </div>
          </div>
        )}

        {result && !result.found && (
          <div className="text-center py-16 border border-white/5 rounded-2xl bg-white/[0.02]">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-bold mb-2">Product Not Found</h3>
            <p className="text-white/30 text-sm">This barcode isn't in our database yet.</p>
          </div>
        )}

        {result?.found && result.product && scoreColors && (
          <div className="space-y-4">
            {saved && (
              <div className="bg-[#00ff87]/10 border border-[#00ff87]/20 rounded-xl px-4 py-2 text-[#00ff87] text-xs text-center">
                ✅ Scan saved to your history
              </div>
            )}

            <div className="flex items-center gap-5 bg-white/[0.02] border border-white/8 rounded-2xl p-5">
              {result.product.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.product.image_url} alt={result.product.product_name || "Product"} className="w-20 h-20 object-contain rounded-xl bg-white/5" />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-black text-xl leading-tight truncate">{result.product.product_name || "Unknown Product"}</h2>
                <p className="text-white/40 text-sm mt-1">{result.product.brands || "Unknown Brand"}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <NovaBadge group={result.product.nova_group} />
                  {result.product.nutriscore_grade && (
                    <span className="text-xs border border-white/10 bg-white/5 rounded-full px-3 py-1 text-white/50 uppercase">
                      Nutri-Score {result.product.nutriscore_grade}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-white/30 uppercase tracking-widest">Overall Health Score</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  result.verdict === "Healthy" ? "text-[#00ff87] border-[#00ff87]/30 bg-[#00ff87]/10" :
                  result.verdict === "Unhealthy" ? "text-red-400 border-red-400/30 bg-red-400/10" :
                  "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                }`}>{result.verdict}</span>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className={`text-7xl font-black ${scoreColors.text}`}>{result.healthScore}</span>
                <span className="text-white/20 text-xl mb-3">/100</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${scoreColors.bg} rounded-full`} style={{ width: `${result.healthScore}%` }} />
              </div>
            </div>

            {result.warnings && result.warnings.length > 0 && (
              <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-red-400 mb-3">⚠ Health Warnings</h3>
                <ul className="space-y-2">
                  {result.warnings.map((w) => (
                    <li key={w} className="flex items-start gap-2 text-sm text-white/50">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white/[0.02] border border-[#00ff87]/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-[#00ff87]/20 flex items-center justify-center">
                  <span className="text-sm">🧠</span>
                </div>
                <h3 className="text-sm font-bold text-[#00ff87]">AI Health Analysis</h3>
              </div>
              <div className="space-y-4">
                {generateAIExplanation(result.product, result.healthScore!, result.warnings!).map((paragraph, i) => (
                  <p key={i} className="text-sm text-white/55 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
              <h3 className="text-xs text-white/30 uppercase tracking-widest mb-4">Nutrition per 100g</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Calories", value: n["energy-kcal_100g"], unit: "kcal" },
                  { label: "Protein", value: n.proteins_100g, unit: "g" },
                  { label: "Carbs", value: n.carbohydrates_100g, unit: "g" },
                  { label: "Sugar", value: n.sugars_100g, unit: "g" },
                  { label: "Fat", value: n.fat_100g, unit: "g" },
                  { label: "Saturated Fat", value: n["saturated-fat_100g"], unit: "g" },
                  { label: "Fiber", value: n.fiber_100g, unit: "g" },
                  { label: "Sodium", value: n.sodium_100g ? n.sodium_100g * 1000 : undefined, unit: "mg" },
                ].map(({ label, value, unit }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-xs text-white/40">{label}</span>
                    <span className="text-sm font-semibold">{value !== undefined ? `${Math.round(value * 10) / 10}${unit}` : "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            {result.product.ingredients_text && (
              <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
                <h3 className="text-xs text-white/30 uppercase tracking-widest mb-3">Ingredients</h3>
                <p className="text-sm text-white/50 leading-relaxed">{result.product.ingredients_text}</p>
              </div>
            )}

            <button
              onClick={() => { setResult(null); setBarcode(""); setSaved(false); }}
              className="w-full py-4 border border-white/10 rounded-2xl text-white/40 hover:text-white hover:border-white/20 transition-all text-sm"
            >
              ← Scan Another Product
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
