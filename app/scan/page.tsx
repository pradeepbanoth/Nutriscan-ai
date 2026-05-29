"use client";

import { useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function ScanPage() {
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState<any>(null);

  const [analysis, setAnalysis] = useState<any>(null);

  const [warnings, setWarnings] = useState<string[]>([]);

  const startScanner = async () => {
    try {
      setLoading(true);

      const codeReader = new BrowserMultiFormatReader();

      const result = await codeReader.decodeOnceFromVideoDevice(
  undefined,
  "video"
);

      const barcode = result.getText();

      const response = await fetch(
        `/api/product?barcode=${barcode}`
      );

      const data = await response.json();

      setProduct(data.product);

      const p = data.product;

      /* ---------------- HEALTH SCORE ---------------- */

      let healthScore = 100;

      if (p.nova >= 4) healthScore -= 30;

      if (p.sugar > 15) healthScore -= 25;

      if (p.fat > 20) healthScore -= 20;

      if (p.salt > 1.5) healthScore -= 15;

      if (p.nutriscore === "d") healthScore -= 15;

      if (p.nutriscore === "e") healthScore -= 25;

      healthScore = Math.max(0, healthScore);

      let verdict = "Healthy";

      let color = "text-green-600";

      let message =
        "Good nutritional profile with lower health risks.";

      if (healthScore < 75) {
        verdict = "Moderate";

        color = "text-yellow-500";

        message =
          "Contains some processed ingredients and should be consumed in moderation.";
      }

      if (healthScore < 50) {
        verdict = "Unhealthy";

        color = "text-red-600";

        message =
          "Highly processed food with elevated sugar, fat, or harmful additives.";
      }

      setAnalysis({
        healthScore,
        verdict,
        color,
        message,
      });

      /* ---------------- INGREDIENT WARNING SYSTEM ---------------- */

      const ingredientText =
        p.ingredients?.toLowerCase() || "";

      const dangerIngredients = [
        {
          keyword: "high fructose corn syrup",
          warning:
            "High Fructose Corn Syrup may increase obesity and diabetes risk.",
        },

        {
          keyword: "palm oil",
          warning:
            "Palm Oil is highly processed and linked with unhealthy fats.",
        },

        {
          keyword: "artificial color",
          warning:
            "Artificial colors may affect hyperactivity and health.",
        },

        {
          keyword: "trans fat",
          warning:
            "Trans fats are linked to heart disease.",
        },

        {
          keyword: "aspartame",
          warning:
            "Aspartame is an artificial sweetener with health concerns.",
        },

        {
          keyword: "sodium benzoate",
          warning:
            "Sodium Benzoate is a preservative linked to potential risks.",
        },

        {
          keyword: "msg",
          warning:
            "MSG may cause sensitivity reactions in some individuals.",
        },
      ];

      const detectedWarnings: string[] = [];

      dangerIngredients.forEach((item) => {
        if (ingredientText.includes(item.keyword)) {
          detectedWarnings.push(item.warning);
        }
      });

      setWarnings(detectedWarnings);

      setLoading(false);
    } catch (err) {
      console.error(err);

      setLoading(false);

      alert("Failed to scan barcode");
    }
  };

  return (
    <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-8 border border-orange-100">
        <h1 className="text-4xl font-black text-center mb-6 text-gray-900">
          PAUSTICA AI Scanner
        </h1>

        <button
          onClick={startScanner}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:scale-[1.02]"
          style={{
            background:
              "linear-gradient(135deg, #f97316, #ea580c)",
          }}
        >
          {loading ? "Scanning..." : "Start Barcode Scan"}
        </button>

        <video
          id="video"
          className="w-full rounded-2xl mt-6 border border-orange-100"
        />

        {/* AI ANALYSIS */}

        {analysis && (
          <div className="mt-8 rounded-3xl p-6 bg-white border border-orange-100 shadow-sm">
            <div className="text-center">
              <div className="text-sm uppercase tracking-widest text-gray-400 mb-2">
                AI Health Analysis
              </div>

              <div className={`text-6xl font-black ${analysis.color}`}>
                {analysis.healthScore}
              </div>

              <div className={`text-2xl font-bold mt-2 ${analysis.color}`}>
                {analysis.verdict}
              </div>

              <p className="text-gray-500 mt-4 leading-relaxed max-w-md mx-auto">
                {analysis.message}
              </p>
            </div>
          </div>
        )}

        {/* INGREDIENT WARNINGS */}

        {warnings.length > 0 && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-3xl p-5">
            <div className="text-lg font-black text-red-600 mb-4">
              Ingredient Warnings
            </div>

            <div className="space-y-3">
              {warnings.map((warning, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 border border-red-100"
                >
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {warning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCT DETAILS */}

        {product && (
          <div className="mt-8 bg-[#fff7ed] rounded-3xl p-6 border border-orange-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-40 mx-auto rounded-2xl mb-4"
            />

            <h2 className="text-2xl font-black text-center text-gray-900">
              {product.name}
            </h2>

            <p className="text-center text-gray-500 mb-6">
              {product.brand}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4">
                <div className="text-sm text-gray-400">
                  NutriScore
                </div>

                <div className="text-3xl font-black uppercase text-orange-500">
                  {product.nutriscore}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4">
                <div className="text-sm text-gray-400">
                  NOVA Group
                </div>

                <div className="text-3xl font-black text-red-500">
                  {product.nova}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4">
                <div className="text-sm text-gray-400">
                  Sugar
                </div>

                <div className="text-2xl font-black">
                  {product.sugar}g
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4">
                <div className="text-sm text-gray-400">
                  Fat
                </div>

                <div className="text-2xl font-black">
                  {product.fat}g
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-2xl p-4">
              <div className="text-sm font-bold text-gray-400 mb-2">
                Ingredients
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {product.ingredients}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}