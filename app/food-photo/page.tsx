"use client";

import { useState } from "react";
import PremiumGate from "../../components/PremiumGateComponent";
import { usePremium } from "@/hooks/usePremium";
import Image from "next/image";
import posthog from "posthog-js";
import { AnalyticsEvents } from "@/lib/analyticsEvents";

type FoodResult = {
  foodName: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthScore: number;
  verdict: string;
  healthierSuggestion: string;
};

export default function FoodPhotoPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { loading: checkingPlan, isPremium } = usePremium();

 

  const analyzeFood = async (file: File) => {
    try {

      posthog.capture(AnalyticsEvents.FOOD_PHOTO_STARTED, {
  file_size_mb: Number((file.size / (1024 * 1024)).toFixed(2)),
  file_type: file.type,
});

      setLoading(true);
      setResult(null);

      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/food-photo-analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);

      posthog.capture(AnalyticsEvents.FOOD_PHOTO_COMPLETED, {
  success: true,
  food_name: data.foodName,
  confidence: data.confidence,
  health_score: data.healthScore,
});
    } catch (error) {
      console.error("Food analysis error:", error);
      posthog.capture(AnalyticsEvents.FOOD_PHOTO_COMPLETED, {
  success: false,
});
      alert("Food photo analysis failed. Please try another image.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingPlan) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
        <p className="text-gray-500 font-bold">Checking your plan...</p>
      </main>
    );
  }

  if (!isPremium) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
        <PremiumGate
          title="Food Photo AI is Premium"
          description="Upgrade to analyze food photos using AI."
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
           <Image
  src="/logo.png"
  alt="PAUSTICA"
  width={40}
  height={40}
  className="object-contain"
  priority
/>
            <h1 className="text-2xl font-black text-gray-900">PAUSTICA</h1>
          </div>

          <a href="/" className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-bold">
            Home
          </a>
        </nav>

        <div className="bg-white border border-orange-100 rounded-3xl shadow-sm p-6 text-center mb-8">
          <p className="text-orange-600 font-bold mb-2">Food Photo AI</p>

          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Analyze Food From a Photo
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            Upload any meal photo. PAUSTICA estimates calories, macros, health score, and a healthier suggestion.
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
          <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-8 text-center">
            <div className="w-14 h-14 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-bold">AI analyzing food photo...</p>
          </div>
        )}

        {image && !loading && result && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-4">Uploaded Food</h3>
             <Image
  src={image}
  alt="Uploaded food"
  width={900}
  height={700}
  className="w-full rounded-2xl border border-orange-100 object-cover"
  unoptimized
/>
            </div>

            <div className="space-y-5">
              <div
                className={`rounded-3xl p-6 border ${
                  result.healthScore >= 80
                    ? "bg-green-50 border-green-200"
                    : result.healthScore >= 60
                    ? "bg-yellow-50 border-yellow-200"
                    : result.healthScore >= 40
                    ? "bg-orange-50 border-orange-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <p className="text-gray-500 font-bold mb-2">Estimated Health Score</p>

                <h3 className="text-6xl font-black text-gray-900">
                  {result.healthScore}
                  <span className="text-2xl text-gray-400">/100</span>
                </h3>

                <p className="text-gray-700 mt-4 font-bold">{result.verdict}</p>
                <p className="text-sm text-gray-500 mt-2">Confidence: {result.confidence}%</p>
              </div>

              <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-3">
                  Detected Food
                </h3>

                <p className="text-gray-800 font-black text-lg">{result.foodName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-orange-100 rounded-2xl p-4">
                  <p className="text-xs text-gray-400">Calories</p>
                  <p className="text-2xl font-black text-orange-600">{result.calories}</p>
                </div>

                <div className="bg-white border border-orange-100 rounded-2xl p-4">
                  <p className="text-xs text-gray-400">Protein</p>
                  <p className="text-2xl font-black text-orange-600">{result.protein}g</p>
                </div>

                <div className="bg-white border border-orange-100 rounded-2xl p-4">
                  <p className="text-xs text-gray-400">Carbs</p>
                  <p className="text-2xl font-black text-orange-600">{result.carbs}g</p>
                </div>

                <div className="bg-white border border-orange-100 rounded-2xl p-4">
                  <p className="text-xs text-gray-400">Fat</p>
                  <p className="text-2xl font-black text-orange-600">{result.fat}g</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-3xl p-5">
                <h3 className="text-xl font-black text-green-700 mb-3">
                  Healthier Suggestion
                </h3>

                <p className="text-gray-700 font-bold">
                  {result.healthierSuggestion}
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mt-10">
          Food photo analysis uses AI estimates and may not always be perfect. Verify labels when possible.
        </p>
      </div>
    </main>
  );
}