"use client";

import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import { ingredientIntelligence } from "../../lib/ingredientIntelligence";
import { getUserPlan } from "../../lib/getUserPlan";
import PremiumGate from "../../components/PremiumGateComponent";
import { supabase } from "../lib/supabase";
import Image from "next/image";

export default function OCRPage() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPlan = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsPremium(false);
        setPlanLoading(false);
        return;
      }

      const plan = await getUserPlan(user.id);
      setIsPremium(plan === "premium");
      setPlanLoading(false);
    };

    checkPlan();
  }, []);

  const harmfulIngredients = Object.keys(ingredientIntelligence);

  const detectedIngredients = harmfulIngredients.filter((item) =>
    text.toLowerCase().includes(item)
  );

  const scanImage = async (file: File) => {
    setLoading(true);
    setText("");

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);

    const result = await Tesseract.recognize(file, "eng");

    setText(result.data.text);
    setLoading(false);
  };

  const healthScore = Math.max(0, 100 - detectedIngredients.length * 12);

  if (planLoading) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center">
        <p className="font-bold text-gray-600">Checking subscription...</p>
      </main>
    );
  }

  if (!isPremium) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
        <PremiumGate
          title="OCR Scanner is Premium"
          description="Upgrade to scan ingredient labels from photos."
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Image
  src="/logo.png"
  alt="PAUSTICA"
  width={48}
  height={48}
  className="object-contain"
  priority
/>
            <h1 className="text-3xl font-black text-gray-900">PAUSTICA</h1>
          </div>

          <a href="/" className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-bold">
            Home
          </a>
        </nav>

        <div className="bg-white border border-orange-100 rounded-3xl shadow-sm p-8 mb-8 text-center">
          <p className="text-orange-600 font-bold mb-2">OCR Ingredient Scanner</p>

          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Scan Ingredients from a Photo
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            Upload a photo of the ingredient label. PAUSTICA will extract text,
            detect risky additives, and generate a simple health score.
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) scanImage(file);
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
            <div className="w-14 h-14 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold">Reading ingredient label...</p>
          </div>
        )}

        {image && !loading && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-2xl font-black text-gray-900 mb-4">
                Uploaded Image
              </h3>

              <Image
  src={image}
  alt="Uploaded ingredient label"
  width={900}
  height={700}
  className="w-full rounded-2xl border border-orange-100 object-cover"
  unoptimized
/>
            </div>

            <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-2xl font-black text-gray-900 mb-4">
                OCR Result
              </h3>

              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {text || "No text detected."}
              </p>
            </div>
          </div>
        )}

        {text && !loading && (
          <div className="mt-8 space-y-8">
            <div
              className={`rounded-3xl p-8 border ${
                healthScore >= 75
                  ? "bg-green-50 border-green-200"
                  : healthScore >= 50
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p className="text-gray-500 font-bold mb-2">OCR Health Score</p>

              <h3 className="text-6xl font-black text-gray-900">
                {healthScore}/100
              </h3>

              <p className="text-gray-700 mt-4">
                This score is based on risky ingredient matches detected from
                the uploaded label.
              </p>
            </div>

            {detectedIngredients.length > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
                <h3 className="text-2xl font-black text-red-700 mb-6">
                  Risky Ingredients Detected
                </h3>

                <div className="space-y-6">
                  {detectedIngredients.map((ingredient) => {
                    const info = ingredientIntelligence[ingredient];

                    return (
                      <div
                        key={ingredient}
                        className="bg-white border border-red-100 rounded-3xl p-6"
                      >
                        <h4 className="text-xl font-black text-gray-900 mb-3">
                          {ingredient}
                        </h4>

                        <p className="text-gray-700 mb-3">
                          <b>Why it matters:</b> {info.why}
                        </p>

                        <p className="text-gray-700 mb-3">
                          <b>Scientific View:</b> {info.scientificView}
                        </p>

                        <p className="text-gray-700">
                          <b>Recommendation:</b> {info.recommendation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-3xl p-8">
                <h3 className="text-2xl font-black text-green-700 mb-3">
                  No Major Risky Ingredients Detected
                </h3>

                <p className="text-gray-700">
                  PAUSTICA did not find any known risky ingredients from the
                  current database. OCR may miss unclear text, so always
                  double-check the label.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}