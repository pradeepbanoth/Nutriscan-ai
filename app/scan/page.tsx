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
  categories?: string;
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
  if (ingredients.includes("artificial color") || ingredients.includes("red 40")) { score -= 5; warnings.push("Contains Artificial Colors"); }
  if (ingredients.includes("aspartame") || ingredients.includes("sucralose")) { score -= 5; warnings.push("Contains Artificial Sweeteners"); }
  score = Math.max(5, Math.min(100, score));
  let verdict = "Excellent";
  if (score < 40) verdict = "Poor";
  else if (score < 60) verdict = "Moderate";
  else if (score < 75) verdict = "Good";
  return { score, verdict, warnings };
}

function generateAIExplanation(product: ProductData, score: number): string[] {
  const n = product.nutriments || {};
  const name = product.product_name || "This product";
  const paragraphs: string[] = [];
  if (score >= 75) paragraphs.push(`${name} has a good nutritional profile with no major red flags.`);
  else if (score >= 60) paragraphs.push(`${name} is acceptable but has some nutritional concerns.`);
  else if (score >= 40) paragraphs.push(`${name} has several concerns. Best consumed occasionally.`);
  else paragraphs.push(`${name} scores poorly with multiple health concerns detected.`);
  if ((n.sugars_100g ?? 0) > 20) paragraphs.push(`️ Contains ${n.sugars_100g}g sugar per 100g — extremely high. WHO recommends max 25g/day.`);
  if ((n["saturated-fat_100g"] ?? 0) > 10) paragraphs.push(` High saturated fat (${n["saturated-fat_100g"]}g/100g) linked to elevated LDL cholesterol.`);
  if ((n.sodium_100g ?? 0) > 0.5) paragraphs.push(` High sodium (${Math.round((n.sodium_100g ?? 0) * 1000)}mg/100g) linked to hypertension.`);
  if (product.nova_group === 4) paragraphs.push(` Ultra-processed (NOVA 4) — linked to obesity and poor metabolic health.`);
  if ((n.fiber_100g ?? 0) > 5) paragraphs.push(` Good fiber content (${n.fiber_100g}g/100g) — supports digestive health.`);
  if ((n.proteins_100g ?? 0) > 15) paragraphs.push(` High protein (${n.proteins_100g}g/100g) — supports muscle maintenance.`);
  if (score < 50) paragraphs.push(` Consider switching to whole food alternatives with simpler ingredients.`);
  else if (score < 75) paragraphs.push(` Acceptable in moderation — balance with whole foods daily.`);
  else paragraphs.push(` A solid nutritional choice!`);
  return paragraphs;
}

function getHealthierTips(product: ProductData, score: number): string[] {
  const n = product.nutriments || {};
  const tips: string[] = [];

  if ((n.sugars_100g ?? 0) > 10) tips.push("Choose products with less than 5g of sugar per 100g");
  if ((n["saturated-fat_100g"] ?? 0) > 5) tips.push("Look for products with less than 3g saturated fat per 100g");
  if ((n.sodium_100g ?? 0) > 0.5) tips.push("Pick low-sodium options with less than 400mg sodium per 100g");
  if (product.nova_group === 4) tips.push("Choose NOVA 1 or 2 classified products — minimally processed");
  if (score < 50) tips.push("Look for products with fewer than 5 ingredients on the label");
  tips.push("Pick products where first ingredient is a whole food (oats, rice, wheat)");
  tips.push("Avoid products with artificial colors, preservatives or sweeteners");

  return tips.slice(0, 4);
}

function ScoreRing({ score, verdict }: { score: number; verdict: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 75 ? "#16a34a" : score >= 60 ? "#d97706" : score >= 40 ? "#ea580c" : "#dc2626";
  const bgColor = score >= 75 ? "#f0fdf4" : score >= 60 ? "#fffbeb" : score >= 40 ? "#fff7ed" : "#fef2f2";
  const textColor = score >= 75 ? "#16a34a" : score >= 60 ? "#d97706" : score >= 40 ? "#ea580c" : "#dc2626";
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="10" />
          <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${progress} ${circumference}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black" style={{ color: textColor }}>{score}</span>
          <span className="text-xs text-gray-400 font-medium">/100</span>
        </div>
      </div>
      <div className="mt-3 px-5 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: bgColor, color }}>
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
    4: { label: "NOVA 4 · Ultra-Processed ", color: "bg-red-100 text-red-700" },
  };
  if (!group || !labels[group]) return null;
  const { label, color } = labels[group];
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${color}`}>{label}</span>;
}

export default function ScanPage() {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  async function handleScan() {
    const cleanBarcode = barcode.trim().replace(/[^0-9]/g, "");
    if (!cleanBarcode) { setError("Please enter a valid barcode number."); return; }
    if (cleanBarcode.length < 8 || cleanBarcode.length > 14) { setError("Barcode must be 8-14 digits."); return; }
    setError(""); setLoading(true); setResult(null); setSaved(false);
    try {
      let res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${cleanBarcode}.json`);
      let data = await res.json();

      if (data.status === 0 || !data.product) {
        res = await fetch(`https://in.openfoodfacts.org/api/v0/product/${cleanBarcode}.json`);
        data = await res.json();
      }

      if (data.status === 0 || !data.product) {
        setResult({ found: false });
      } else {
        const product: ProductData = data.product;
        const { score, verdict, warnings } = calculateHealthScore(product);
        setResult({ found: true, product, healthScore: score, verdict, warnings });
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || "00000000-0000-0000-0000-000000000000";
        const { error: saveError } = await supabase.from("scans").insert({
          user_id: userId, product_name: product.product_name || "Unknown",
          barcode: cleanBarcode, health_score: score, verdict, image_url: product.image_url || "",
        });
        if (!saveError) setSaved(true);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection.");
    } finally { setLoading(false); }
  }

  const n = result?.product?.nutriments || {};

  return (
    <main className="min-h-screen pb-24" style={{ background: "#fff7ed" }}>
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-40" style={{ borderColor: "#fed7aa" }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              <span className="text-white font-black text-sm">P</span>
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">PAUSTICA<span style={{ color: "#f97316" }}>AI</span></span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/history" className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors">History</a>
            <a href="/login" className="text-sm font-bold px-4 py-2 rounded-full text-white shadow-sm transition-all" style={{ background: "#f97316" }}>Account</a>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero text */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Scan any <span style={{ color: "#f97316" }}>food product</span>
          </h1>
          <p className="text-gray-500 text-sm">Enter the barcode from any packaged food for instant AI analysis</p>
        </div>

        {/* Search card */}
        <div className="bg-white rounded-3xl shadow-sm border p-5 mb-6" style={{ borderColor: "#fed7aa" }}>
          <div className="flex gap-2">
            <input
              type="text" value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="e.g. 0038000845581"
              className="flex-1 rounded-2xl px-4 py-3 text-sm font-mono text-gray-800 focus:outline-none border"
              style={{ background: "#fff7ed", borderColor: "#fed7aa" }}
            />
            <button onClick={() => setShowCamera(true)}
              className="px-4 py-3 rounded-2xl border text-gray-500 hover:bg-orange-50 transition-all text-lg"
              style={{ borderColor: "#fed7aa" }}></button>
            <button onClick={handleScan} disabled={loading}
              className="font-bold px-6 py-3 rounded-2xl text-white shadow-sm transition-all disabled:opacity-50 text-sm"
              style={{ background: "#f97316" }}>
              {loading ? "..." : "Scan →"}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400">Try:</span>
            {[
              { label: "Corn Flakes", code: "0038000845581" },
              { label: "Nutella", code: "3017620422003" },
              { label: "Coca-Cola", code: "5449000000996" },
            ].map((ex) => (
              <button key={ex.code} onClick={() => setBarcode(ex.code)}
                className="text-xs font-semibold hover:underline" style={{ color: "#f97316" }}>{ex.label}</button>
            ))}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border overflow-hidden animate-pulse" style={{ borderColor: "#fed7aa" }}>
              <div className="h-2" style={{ background: "#fed7aa" }} />
              <div className="p-5 flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl" style={{ background: "#f1f5f9" }} />
                <div className="flex-1 space-y-2">
                  <div className="h-5 rounded-full w-3/4" style={{ background: "#f1f5f9" }} />
                  <div className="h-3 rounded-full w-1/2" style={{ background: "#f1f5f9" }} />
                  <div className="h-6 rounded-full w-1/3" style={{ background: "#f1f5f9" }} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl border p-6 flex flex-col items-center animate-pulse" style={{ borderColor: "#fed7aa" }}>
              <div className="w-36 h-36 rounded-full" style={{ background: "#f1f5f9" }} />
              <div className="h-8 w-24 rounded-full mt-4" style={{ background: "#f1f5f9" }} />
            </div>
            <div className="bg-white rounded-3xl border p-5 animate-pulse space-y-3" style={{ borderColor: "#fed7aa" }}>
              <div className="h-4 rounded-full w-1/4" style={{ background: "#f1f5f9" }} />
              <div className="h-3 rounded-full w-full" style={{ background: "#f1f5f9" }} />
              <div className="h-3 rounded-full w-5/6" style={{ background: "#f1f5f9" }} />
            </div>
          </div>
        )}

        {/* Not found */}
        {result && !result.found && (
          <div className="bg-white rounded-3xl border p-10 text-center" style={{ borderColor: "#fed7aa" }}>
            <div className="text-5xl mb-4"></div>
            <h3 className="font-bold text-gray-800 mb-2">Product Not Found</h3>
            <p className="text-gray-400 text-sm mb-4">This barcode is not in our database yet.</p>
            <div className="rounded-2xl p-4 text-left" style={{ background: "#fff7ed" }}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tips while shopping:</p>
              <ul className="space-y-1.5">
                {["Check Nutri-Score label on the packaging", "Look for NOVA 1-2 products", "Choose products with fewer than 5 ingredients", "Avoid products with artificial colors or preservatives"].map((tip, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <span style={{ color: "#f97316" }}>•</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Results */}
        {result?.found && result.product && (
          <div className="space-y-4">
            {saved && (
              <div className="rounded-2xl px-4 py-2.5 text-center text-sm font-semibold" style={{ background: "#fff7ed", color: "#f97316", border: "1px solid #fed7aa" }}>
                 Saved to your history
              </div>
            )}

            {/* Product card */}
            <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor: "#fed7aa" }}>
              <div className="h-2" style={{ background: "linear-gradient(90deg, #f97316, #ea580c)" }} />
              <div className="p-5 flex items-center gap-4 border-b" style={{ borderColor: "#fff7ed" }}>
                {result.product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={result.product.image_url} alt="" className="w-20 h-20 object-contain rounded-2xl p-1" style={{ background: "#fff7ed" }} />
                ) : (
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl" style={{ background: "#fff7ed" }}></div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-gray-900 text-xl truncate">{result.product.product_name || "Unknown Product"}</h2>
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

              {/* Score */}
              <div className="p-6 flex flex-col items-center border-b" style={{ borderColor: "#fff7ed" }}>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Health Score</p>
                <ScoreRing score={result.healthScore!} verdict={result.verdict!} />
              </div>

              {/* Warnings */}
              {result.warnings && result.warnings.length > 0 && (
                <div className="p-5 border-b" style={{ borderColor: "#fff7ed" }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Concerns</p>
                  <div className="space-y-2">
                    {result.warnings.map((w) => (
                      <div key={w} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "#fff7ed" }}>
                        <span style={{ color: "#f97316" }}></span>
                        <span className="text-sm font-medium text-gray-700">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              <div className="p-5 border-b" style={{ borderColor: "#fff7ed" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs" style={{ background: "#fff7ed" }}></div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#f97316" }}>AI Analysis</p>
                </div>
                <div className="space-y-2">
                  {generateAIExplanation(result.product, result.healthScore!).map((p, i) => (
                    <p key={i} className="text-sm text-gray-600 leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>

              {/* Nutrition */}
              <div className="p-5 border-b" style={{ borderColor: "#fff7ed" }}>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Nutrition per 100g</p>
                {[
                  { label: "Calories", value: n["energy-kcal_100g"], unit: "kcal", max: 500, color: "#a855f7" },
                  { label: "Sugar", value: n.sugars_100g, unit: "g", max: 50, color: "#ef4444" },
                  { label: "Fat", value: n.fat_100g, unit: "g", max: 40, color: "#f97316" },
                  { label: "Saturated Fat", value: n["saturated-fat_100g"], unit: "g", max: 20, color: "#dc2626" },
                  { label: "Protein", value: n.proteins_100g, unit: "g", max: 30, color: "#3b82f6" },
                  { label: "Fiber", value: n.fiber_100g, unit: "g", max: 10, color: "#22c55e" },
                  { label: "Sodium", value: n.sodium_100g ? n.sodium_100g * 1000 : undefined, unit: "mg", max: 1000, color: "#eab308" },
                ].map(({ label, value, unit, max, color }) => (
                  <div key={label} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-500">{label}</span>
                      <span className="text-xs font-bold text-gray-700">{value !== undefined ? `${Math.round(value * 10) / 10}${unit}` : "—"}</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "#f1f5f9" }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value ? Math.min((value / max) * 100, 100) : 0}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Ingredients */}
              {result.product.ingredients_text && (
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Ingredients</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{result.product.ingredients_text}</p>
                </div>
              )}
            </div>

            {/* Healthier Alternatives */}
            {result.healthScore! < 65 && (
              <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor: "#bbf7d0" }}>
                <div className="h-2" style={{ background: "linear-gradient(90deg, #16a34a, #22c55e)" }} />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: "#f0fdf4" }}></div>
                    <h3 className="text-sm font-black text-gray-900">Healthier Alternatives</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold ml-auto">Better choices</span>
                  </div>
                  <div className="rounded-2xl p-4 border mb-3" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                    <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3">What to look for instead</p>
                    <ul className="space-y-2">
                      {getHealthierTips(result.product, result.healthScore!).map((tip, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-gray-600">
                          <span className="text-green-500 mt-0.5 flex-shrink-0 font-bold">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(result.product?.product_name?.split(" ")[0] || "healthy")}&nutrigrade=a&action=process`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border text-sm font-bold transition-all"
                    style={{ borderColor: "#16a34a", color: "#16a34a" }}
                  >
                     Find healthier alternatives →
                  </a>
                </div>
              </div>
            )}

            {/* Share + Scan Another */}
            <div className="flex gap-3">
              <button onClick={() => { setResult(null); setBarcode(""); setSaved(false); }}
                className="flex-1 py-4 bg-white rounded-2xl border text-gray-400 hover:text-gray-700 transition-all text-sm font-medium"
                style={{ borderColor: "#fed7aa" }}>
                ← Scan Another
              </button>
              <button
                onClick={() => {
                  const text = `I scanned ${result?.product?.product_name || "a product"} and it scored ${result?.healthScore}/100 (${result?.verdict}) on PAUSTICA!  Check your food: https://nutriscan-ai-orpin.vercel.app`;
                  if (navigator.share) {
                    navigator.share({ title: "PAUSTICA", text });
                  } else {
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                  }
                }}
                className="flex-1 py-4 rounded-2xl text-white text-sm font-bold transition-all"
                style={{ background: "#f97316" }}>
                Share Result 
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3 flex items-center justify-around md:hidden z-40" style={{ borderColor: "#fed7aa" }}>
        <a href="/" className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xl"></span>
          <span className="text-xs font-medium">Home</span>
        </a>
        <a href="/scan" className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg -mt-6" style={{ background: "#f97316" }}>
            <span className="text-xl"></span>
          </div>
          <span className="text-xs font-medium" style={{ color: "#f97316" }}>Scan</span>
        </a>
        <a href="/history" className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xl"></span>
          <span className="text-xs font-medium">History</span>
        </a>
      </div>

      {showCamera && (
        <BarcodeScanner
          onScan={(code) => {
            setBarcode(code);
            setShowCamera(false);
            setTimeout(() => {
              setBarcode(code);
              handleScan();
            }, 300);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </main>
  );
}
