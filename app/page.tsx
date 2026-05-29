"use client";

import { useEffect, useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";
import { getAlternatives } from "../lib/getAlternatives";

export default function Home() {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

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

  useEffect(() => {
    const savedHistory = localStorage.getItem("paustica_scan_history");
    const savedFavorites = localStorage.getItem("paustica_favorites");

    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory));
    }

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const saveHistory = (newItem: any) => {
    const updatedHistory = [
      newItem,
      ...scanHistory.filter((item) => item.name !== newItem.name),
    ].slice(0, 12);

    setScanHistory(updatedHistory);

    localStorage.setItem(
      "paustica_scan_history",
      JSON.stringify(updatedHistory)
    );
  };

  const saveFavorites = (updatedFavorites: any[]) => {
    setFavorites(updatedFavorites);

    localStorage.setItem(
      "paustica_favorites",
      JSON.stringify(updatedFavorites)
    );
  };

  const isFavorite = product
    ? favorites.some((item) => item.name === product.name)
    : false;

  const toggleFavorite = () => {
    if (!product) return;

    if (isFavorite) {
      const updatedFavorites = favorites.filter(
        (item) => item.name !== product.name
      );

      saveFavorites(updatedFavorites);
    } else {
      const updatedFavorites = [product, ...favorites];

      saveFavorites(updatedFavorites);
    }
  };

  const removeFavorite = (name: string) => {
    const updatedFavorites = favorites.filter(
      (item) => item.name !== name
    );

    saveFavorites(updatedFavorites);
  };

  const detectedHarmful =
    product?.ingredients
      ?.toLowerCase()
      ?.split(",")
      ?.filter((ingredient: string) =>
        harmfulIngredients.some((harmful) =>
          ingredient.includes(harmful)
        )
      ) || [];

  const alternatives = product?.name
    ? getAlternatives(product.name)
    : [];

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
        const fetchedProduct = {
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
        saveHistory(fetchedProduct);
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

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem("paustica_scan_history");
  };

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#fff7ed" }}
    >
      <nav className="sticky top-0 z-50 border-b border-orange-100 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
              }}
            >
              <span className="text-white font-black text-sm">P</span>
            </div>

            <span className="text-xl font-black tracking-tight text-[#0f172a]">
              PAUSTICA<span className="text-orange-500">AI</span>
            </span>
          </div>

          <button
            className="rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
            }}
          >
            Smart Scanner
          </button>
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20 text-center">
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

                        <p className="text-gray-500 mb-6">
                          {product.brand}
                        </p>
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
                        {detectedHarmful.map(
                          (ingredient: string, index: number) => (
                            <div
                              key={index}
                              className="px-4 py-3 rounded-2xl bg-white border border-red-200 text-red-700 font-semibold"
                            >
                              {ingredient}
                            </div>
                          )
                        )}
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
                        {alternatives.map(
                          (alternative: string, index: number) => (
                            <div
                              key={index}
                              className="bg-white border border-green-200 rounded-2xl p-4"
                            >
                              <p className="font-semibold text-green-700">
                                {alternative}
                              </p>
                            </div>
                          )
                        )}
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