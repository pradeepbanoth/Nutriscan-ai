"use client";

import { useEffect, useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";
import { getAlternatives } from "../lib/getAlternatives";
import { ingredientIntelligence } from "../lib/ingredientIntelligence";
import { calculateGoalScore, HealthGoal } from "../lib/goalScoring";
import { supabase } from "./lib/supabase";
import InstallButton from "../components/InstallButton";
type Product = {
  id: number;
  name: string;
  brand: string;
  image: string;
  ingredients: string;
  nutriscore: string;
  nova: string | number;
  sugar: number;
  fat: number;
  salt: number;
};

type ProductRow = {
  id: number;
  product_name: string;
  brand: string | null;
  image: string | null;
  ingredients: string | null;
  nutriscore: string | null;
  nova: string | null;
  sugar: number | null;
  fat: number | null;
  salt: number | null;
};

export default function Home() {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] =
    useState<HealthGoal>("General Wellness");

  const [scanHistory, setScanHistory] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  const harmfulIngredients = [
    "palm oil",
    "high fructose corn syrup",
    "msg",
    "monosodium glutamate",
    "aspartame",
    "sodium benzoate",
    "artificial flavor",
    "artificial colour",
    "artificial color",
    "yellow 5",
    "red 40",
    "sucralose",
    "acesulfame k",
    "maltodextrin",
    "corn syrup",
  ];

  const mapRowToProduct = (item: ProductRow): Product => ({
    id: item.id,
    name: item.product_name,
    brand: item.brand || "",
    image: item.image || "",
    ingredients: item.ingredients || "",
    nutriscore: item.nutriscore || "unknown",
    nova: item.nova || "N/A",
    sugar: item.sugar || 0,
    fat: item.fat || 0,
    salt: item.salt || 0,
  });

  async function loadCloudData(uid: string) {
    const { data: historyData } = await supabase
      .from("scan_history")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    const { data: favoritesData } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (historyData) {
      setScanHistory((historyData as ProductRow[]).map(mapRowToProduct));
    }

    if (favoritesData) {
      setFavorites((favoritesData as ProductRow[]).map(mapRowToProduct));
    }
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      const savedHistory = localStorage.getItem("paustica_scan_history");
      const savedFavorites = localStorage.getItem("paustica_favorites");

      if (savedHistory) {
        setScanHistory(JSON.parse(savedHistory));
      }

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    });
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setUserEmail(data.user.email ?? null);
        setUserId(data.user.id);
        await loadCloudData(data.user.id);
      }
    };

    getUser();
  }, []);

  const saveHistory = async (newItem: Product) => {
    const updatedHistory = [
      newItem,
      ...scanHistory.filter((item) => item.name !== newItem.name),
    ].slice(0, 12);

    if (userId) {
      await supabase.from("scan_history").insert({
        user_id: userId,
        product_name: newItem.name,
        brand: newItem.brand,
        image: newItem.image,
        ingredients: newItem.ingredients,
        nutriscore: newItem.nutriscore,
        nova: String(newItem.nova),
        sugar: newItem.sugar,
        fat: newItem.fat,
        salt: newItem.salt,
      });
    }

    setScanHistory(updatedHistory);
    localStorage.setItem(
      "paustica_scan_history",
      JSON.stringify(updatedHistory)
    );
  };

  const saveFavorites = (updatedFavorites: Product[]) => {
    setFavorites(updatedFavorites);
    localStorage.setItem(
      "paustica_favorites",
      JSON.stringify(updatedFavorites)
    );
  };

  const isFavorite = product
    ? favorites.some((item) => item.name === product.name)
    : false;

  const toggleFavorite = async () => {
    if (!product) return;

    if (isFavorite) {
      await removeFavorite(product.name);
    } else {
      const updatedFavorites = [product, ...favorites];

      if (userId) {
        await supabase.from("favorites").insert({
          user_id: userId,
          product_name: product.name,
          brand: product.brand,
          image: product.image,
          ingredients: product.ingredients,
          nutriscore: product.nutriscore,
          nova: String(product.nova),
          sugar: product.sugar,
          fat: product.fat,
          salt: product.salt,
        });
      }

      saveFavorites(updatedFavorites);
    }
  };

  const removeFavorite = async (name: string) => {
    const updatedFavorites = favorites.filter((item) => item.name !== name);

    if (userId) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("product_name", name);
    }

    saveFavorites(updatedFavorites);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    setUserId(null);
    window.location.href = "/";
  };

  const detectedHarmful =
    product?.ingredients
      ?.toLowerCase()
      ?.split(",")
      ?.filter((ingredient: string) =>
        harmfulIngredients.some((harmful) => ingredient.includes(harmful))
      ) || [];

  const ingredientInsights = detectedHarmful
    .map((ingredient) => {
      const key = ingredient.trim().toLowerCase();

      return {
        ingredient,
        info: ingredientIntelligence[key],
      };
    })
    .filter((item) => item.info);

  const alternatives = product?.name ? getAlternatives(product.name) : [];

  const healthScore = product
    ? calculateGoalScore(
        selectedGoal,
        product.sugar,
        product.fat,
        product.salt,
        Number(product.nova),
        detectedHarmful.length
      )
    : 0;

  const healthGrade =
    healthScore >= 85
      ? "A"
      : healthScore >= 70
      ? "B"
      : healthScore >= 55
      ? "C"
      : healthScore >= 40
      ? "D"
      : "E";

  const healthVerdict =
    healthScore >= 75
      ? "This product looks like a better choice with relatively lower risk."
      : healthScore >= 50
      ? "This product is moderate. Consume occasionally and check portion size."
      : "This product looks unhealthy due to processing, sugar, salt, fat, or additives.";

  const fetchProduct = async (code?: string) => {
    const finalBarcode = code || barcode;

    if (!finalBarcode) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${finalBarcode}.json`
      );

      const data = await res.json();

      if (data.status === 1) {
        const fetchedProduct: Product = {
          id: Date.now(),
          name: data.product.product_name || "Unknown Product",
          brand: data.product.brands || "Unknown Brand",
          image: data.product.image_front_url || "",
          ingredients:
            data.product.ingredients_text || "Ingredients unavailable",
          nutriscore: data.product.nutriscore_grade || "unknown",
          nova: data.product.nova_group || "N/A",
          sugar: data.product.nutriments?.sugars_100g ?? 0,
          fat: data.product.nutriments?.fat_100g ?? 0,
          salt: data.product.nutriments?.salt_100g ?? 0,
        };

        setProduct(fetchedProduct);
        await saveHistory(fetchedProduct);
        setScannerOpen(false);
      } else {
        alert("Product not found");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  const clearHistory = async () => {
    setScanHistory([]);
    localStorage.removeItem("paustica_scan_history");

    if (userId) {
      await supabase.from("scan_history").delete().eq("user_id", userId);
    }
  };

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#fff7ed" }}
    >
      <nav className="sticky top-0 z-50 border-b border-orange-100 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
  <img
    src="/logo.png"
    alt="PAUSTICA"
    className="w-12 h-12 object-contain"
  />

  <span className="text-xl font-black tracking-tight text-[#0f172a]">
    PAUSTICA
  </span>
</div>

         {userEmail ? (
  <div className="flex items-center gap-3">
    <a
      href="/profile"
      className="rounded-full px-5 py-3 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100"
    >
      Profile
    </a>

    <a
      href="/report"
      className="rounded-full px-5 py-3 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100"
    >
      Report
    </a>

    <a
      href="/coach"
      className="rounded-full px-5 py-3 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100"
    >
      AI Coach
    </a>

    <a
      href="/ocr"
      className="rounded-full px-5 py-3 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100"
    >
      OCR
    </a>
    <a
  href="/food-photo"
  className="rounded-full px-5 py-3 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100"
>
  Food Photo
</a>

   <InstallButton />

    <button
      onClick={logout}
      className="rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg"
      style={{
        background: "linear-gradient(135deg, #f97316, #ea580c)",
      }}
    >
      Logout
    </button>
  </div>
) : (
  <div className="flex items-center gap-3">
    <a
      href="/ocr"
      className="rounded-full px-5 py-3 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100"
    >
      OCR
    </a>

    <a
      href="/auth"
      className="rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg"
      style={{
        background: "linear-gradient(135deg, #f97316, #ea580c)",
      }}
    >
      Login
    </a>
  </div>
)}
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20 text-center">
        <img
  src="/logo.png"
  alt="PAUSTICA"
  className="w-32 h-32 mx-auto mb-8 object-contain"
/>
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-[-0.06em] leading-[0.9] text-gray-900 mb-10">
          Scan your food
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            instantly
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-gray-500 mb-12">
          AI-powered barcode scanner that detects unhealthy packaged foods,
          harmful ingredients, additives, sugar spikes and ultra-processed
          products.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
          <button
            onClick={() => setScannerOpen(true)}
            className="px-8 py-5 rounded-2xl text-white font-bold text-lg shadow-xl"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
            }}
          >
            Open Camera Scanner
          </button>

          <button
            onClick={() => fetchProduct("0737628064502")}
            className="px-8 py-5 rounded-2xl bg-white border border-orange-100 text-orange-600 font-bold text-lg"
          >
            Demo Product
          </button>
        </div>

        {scannerOpen && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-[32px] border border-orange-100 shadow-2xl mb-10">
            <BarcodeScanner
              onScan={(code) => {
                setBarcode(code);
                fetchProduct(code);
              }}
            />

            <p className="text-sm text-gray-400 mt-4">
              Point your camera at barcode
            </p>
          </div>
        )}

        {loading && (
          <div className="mt-10">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-500 font-medium">
              AI analyzing product...
            </p>
          </div>
        )}

        {product && !loading && (
          <div className="mt-10 w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-[32px] shadow-2xl border border-orange-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />

              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-44 h-44 object-cover rounded-3xl border border-orange-100 shadow-md"
                    />
                  )}

                  <div className="flex-1 text-left">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">
                          {product.name}
                        </h2>

                        <p className="text-gray-500 mb-6">{product.brand}</p>
                      </div>

                      <button
                        onClick={toggleFavorite}
                        className={`px-4 py-3 rounded-2xl font-bold border transition-all ${
                          isFavorite
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-orange-50 text-orange-600 border-orange-100"
                        }`}
                      >
                        {isFavorite ? "Saved" : "Save"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                        <p className="text-xs text-gray-400 mb-1">Sugar</p>
                        <p className="text-2xl font-black text-orange-600">
                          {product.sugar}g
                        </p>
                      </div>

                      <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                        <p className="text-xs text-gray-400 mb-1">Fat</p>
                        <p className="text-2xl font-black text-orange-600">
                          {product.fat}g
                        </p>
                      </div>

                      <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                        <p className="text-xs text-gray-400 mb-1">Salt</p>
                        <p className="text-2xl font-black text-orange-600">
                          {product.salt}g
                        </p>
                      </div>

                      <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                        <p className="text-xs text-gray-400 mb-1">NOVA</p>
                        <p className="text-2xl font-black text-orange-600">
                          {product.nova}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-left">
                  <label className="block text-sm font-bold text-gray-500 mb-3">
                    Personal Health Goal
                  </label>

                  <select
                    value={selectedGoal}
                    onChange={(e) =>
                      setSelectedGoal(e.target.value as HealthGoal)
                    }
                    className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 font-bold text-gray-800 outline-none"
                  >
                    <option>General Wellness</option>
                    <option>Weight Loss</option>
                    <option>Diabetes Friendly</option>
                    <option>Muscle Gain</option>
                    <option>Heart Health</option>
                    <option>Kids Nutrition</option>
                  </select>
                </div>

                <div className="mt-8 text-left">
                  <div
                    className={`rounded-3xl p-6 border ${
                      healthScore >= 75
                        ? "bg-green-50 border-green-200"
                        : healthScore >= 50
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 font-semibold">
                          AI Health Score
                        </p>

                        <h3 className="text-5xl font-black text-gray-900">
                          {healthScore}/100
                        </h3>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500 font-semibold">
                          Grade
                        </p>

                        <div className="text-5xl font-black text-orange-600">
                          {healthGrade}
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-4 bg-white rounded-full overflow-hidden mb-6">
                      <div
                        className={`h-full rounded-full ${
                          healthScore >= 75
                            ? "bg-green-500"
                            : healthScore >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${healthScore}%` }}
                      />
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">
                      {healthVerdict}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-2xl p-4 border border-orange-100">
                        <p className="text-xs text-gray-400 mb-1">
                          Sugar Risk
                        </p>
                        <p className="font-black text-orange-600">
                          {product.sugar > 15
                            ? "High"
                            : product.sugar > 7
                            ? "Medium"
                            : "Low"}
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border border-orange-100">
                        <p className="text-xs text-gray-400 mb-1">Fat Risk</p>
                        <p className="font-black text-orange-600">
                          {product.fat > 20
                            ? "High"
                            : product.fat > 10
                            ? "Medium"
                            : "Low"}
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border border-orange-100">
                        <p className="text-xs text-gray-400 mb-1">
                          Salt Risk
                        </p>
                        <p className="font-black text-orange-600">
                          {product.salt > 1.5
                            ? "High"
                            : product.salt > 0.5
                            ? "Medium"
                            : "Low"}
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border border-orange-100">
                        <p className="text-xs text-gray-400 mb-1">
                          Processing
                        </p>
                        <p className="font-black text-orange-600">
                          {Number(product.nova) >= 4
                            ? "Ultra"
                            : Number(product.nova) >= 3
                            ? "Processed"
                            : "Low"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 text-left">
                  <h3 className="text-xl font-black text-gray-900 mb-4">
                    Ingredients
                  </h3>

                  <div className="bg-orange-50 rounded-3xl border border-orange-100 p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {product.ingredients}
                    </p>
                  </div>
                </div>

                {detectedHarmful.length > 0 && (
                  <div className="mt-10 text-left">
                    <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
                      <h3 className="text-2xl font-black text-red-700 mb-6">
                        Harmful Ingredients Detected
                      </h3>

                      <div className="flex flex-wrap gap-3">
                        {detectedHarmful.map((ingredient, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 rounded-2xl bg-white border border-red-200 text-red-700 font-semibold"
                          >
                            {ingredient}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {ingredientInsights.length > 0 && (
                  <div className="mt-10 text-left">
                    <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8">
                      <h3 className="text-2xl font-black text-blue-700 mb-6">
                        AI Ingredient Intelligence
                      </h3>

                      <div className="space-y-6">
                        {ingredientInsights.map((item, index) => (
                          <div
                            key={index}
                            className="bg-white border border-blue-100 rounded-3xl p-6"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-xl font-black text-gray-900">
                                {item.ingredient}
                              </h4>

                              <span
                                className={`px-4 py-2 rounded-full text-sm font-bold ${
                                  item.info?.risk === "High"
                                    ? "bg-red-100 text-red-700"
                                    : item.info?.risk === "Medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {item.info?.risk} Risk
                              </span>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className="font-bold text-gray-900 mb-1">
                                  Why it matters
                                </p>

                                <p className="text-gray-700">
                                  {item.info?.why}
                                </p>
                              </div>

                              <div>
                                <p className="font-bold text-gray-900 mb-1">
                                  Scientific View
                                </p>

                                <p className="text-gray-700">
                                  {item.info?.scientificView}
                                </p>
                              </div>

                              <div>
                                <p className="font-bold text-gray-900 mb-1">
                                  Recommendation
                                </p>

                                <p className="text-gray-700">
                                  {item.info?.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {alternatives.length > 0 && (
                  <div className="mt-10 text-left">
                    <div className="bg-green-50 border border-green-200 rounded-3xl p-8">
                      <h3 className="text-2xl font-black text-green-700 mb-6">
                        Better Alternatives
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {alternatives.map((alternative, index) => (
                          <div
                            key={index}
                            className="bg-white border border-green-200 rounded-2xl p-4"
                          >
                            <p className="font-semibold text-green-700">
                              {alternative}
                            </p>
                          </div>
                        ))}
                      </div>

                      <p className="mt-6 text-gray-700">
                        These alternatives are generally less processed and may
                        offer better nutritional value.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="max-w-6xl mx-auto mt-20 text-left">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              Favorites
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-orange-100 p-5 shadow-lg"
                >
                  <button
                    onClick={() => setProduct(item)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-2xl object-cover border border-orange-100"
                        />
                      )}

                      <div className="flex-1">
                        <h3 className="font-black text-gray-900 line-clamp-2">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray-400 mb-3">
                          {item.brand}
                        </p>

                        <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                          Tap to view
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => removeFavorite(item.name)}
                    className="mt-4 w-full text-sm font-bold text-red-500 bg-red-50 px-4 py-2 rounded-full border border-red-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {scanHistory.length > 0 && (
          <div className="max-w-6xl mx-auto mt-20 text-left">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-gray-900">
                Recent Scans
              </h2>

              <button
                onClick={clearHistory}
                className="text-sm font-bold text-red-500 bg-red-50 px-4 py-2 rounded-full border border-red-100"
              >
                Clear History
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scanHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setProduct(item)}
                  className="text-left bg-white rounded-3xl border border-orange-100 p-5 shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-2xl object-cover border border-orange-100"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="font-black text-gray-900 line-clamp-2">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-400 mb-3">
                        {item.brand}
                      </p>

                      <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                        Tap to view
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}