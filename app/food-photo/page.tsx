"use client";

import { useState } from "react";
import PremiumGate from "../../components/PremiumGate";

type FoodResult = {
  name: string;
  calories: string;
  processing: string;
  score: number;
  risks: string[];
  alternatives: string[];
};

export default function FoodPhotoPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [loading, setLoading] = useState(false); 

  const isPremium = false;

if (!isPremium) {
  return (
    <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
      <PremiumGate
        title="food-photo is Premium"
        description="Upgrade to scan ingredient labels from photos."
      />
    </main>
  );
}

const analyzeFood = async (file: File) => {
  try {
    setLoading(true);
    setResult(null);

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/food-analysis", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Analysis failed");
    }

    setResult(data);
  } catch (error) {
  console.error("Food analysis error:", error);
  alert(String(error));
}finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-[#fff7ed] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="PAUSTICA"
              className="w-12 h-12 object-contain"
            />

            <h1 className="text-3xl font-black text-gray-900">
              PAUSTICA
            </h1>
          </div>

          <a
            href="/"
            className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-bold"
          >
            Home
          </a>
        </nav>

        <div className="bg-white border border-orange-100 rounded-[36px] shadow-2xl p-8 text-center mb-8">
          <p className="text-orange-600 font-bold mb-2">
            Food Photo Recognition
          </p>

          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Analyze Food From a Photo
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            Upload a food or snack image. PAUSTICA will estimate food type,
            processing risk, health score, and better alternatives.
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) analyzeFood(file);
            }}
            className="block w-full max-w-md mx-auto text-sm text-gray-500
            file:mr-4 file:py-4 file:px-6
            file:rounded-2xl file:border-0
            file:text-sm file:font-bold
            file:bg-orange-500 file:text-white
            hover:file:bg-orange-600"
          />
        </div>

        {loading && (
          <div className="bg-white rounded-3xl border border-orange-100 shadow-lg p-8 text-center">
            <div className="w-14 h-14 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-gray-500 font-bold">
              AI analyzing food photo...
            </p>
          </div>
        )}

        {image && !loading && result && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-lg">
              <h3 className="text-2xl font-black text-gray-900 mb-4">
                Uploaded Food
              </h3>

              <img
                src={image}
                alt="Uploaded food"
                className="w-full rounded-2xl border border-orange-100"
              />
            </div>

            <div className="space-y-6">
              <div
                className={`rounded-3xl p-8 border ${
                  result.score >= 75
                    ? "bg-green-50 border-green-200"
                    : result.score >= 50
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <p className="text-gray-500 font-bold mb-2">
                  Estimated Health Score
                </p>

                <h3 className="text-6xl font-black text-gray-900">
                  {result.score}/100
                </h3>

                <p className="text-gray-700 mt-4">
                  {result.processing}
                </p>
              </div>

              <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-lg">
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  Detected Food Type
                </h3>

                <p className="text-gray-700 font-bold">
                  {result.name}
                </p>

                <p className="text-gray-500 mt-2">
                  {result.calories}
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-3xl p-6">
                <h3 className="text-2xl font-black text-red-700 mb-4">
                  Possible Risks
                </h3>

                <div className="space-y-2">
                  {result.risks.map((risk) => (
                    <p key={risk} className="text-gray-700">
                      {risk}
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-3xl p-6">
                <h3 className="text-2xl font-black text-green-700 mb-4">
                  Better Alternatives
                </h3>

                <div className="space-y-2">
                  {result.alternatives.map((item) => (
                    <p key={item} className="text-gray-700 font-bold">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mt-10">
          Current version uses a basic demo analysis. Real AI vision can be added later using a secure backend API.
        </p>
      </div>
    </main>
  );
}