"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import posthog from "posthog-js";

import ScannerSection from "@/components/scan/ScannerSection";
import SearchSection from "@/components/scan/SearchSection";
import QuickSearches from "@/components/scan/QuickSearches";
import ProductAnalysisModal from "@/components/product/ProductAnalysisModal";
import ProductAnalysisContent from "@/components/product/ProductAnalysisContent";
import ProductAnalysisSkeleton from "@/components/product/ProductAnalysisSkeleton";
import UpgradeModal from "@/components/pricing/UpgradeModal";

import { supabase } from "../lib/supabase";
import { HealthGoal } from "@/lib/goalScoring";
import { getAlternatives } from "@/lib/getAlternatives";
import { searchProductByName } from "@/services/searchService";

import type { Product } from "@/hooks/useFoodLibrary";
import { useCache } from "@/hooks/useCache";
import { useDedupeRequest } from "@/hooks/useDedupeRequest";
import { useCanRunAction } from "@/hooks/useCanRunAction";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useFoodLibrary } from "@/hooks/useFoodLibrary";
import { useScanPermission } from "@/hooks/useScanPermission";
import { useFoodAlternatives } from "@/hooks/useFoodAlternatives";
import { useBarcodeProduct } from "@/hooks/useBarcodeProduct";
import { useAnalyzeProduct } from "@/hooks/useAnalyzeProduct";
import { useIngredientInsights } from "@/hooks/useIngredientInsights";
import { useHealthMetrics } from "@/hooks/useHealthMetrics";
import { useScoreDisplay } from "@/hooks/useScoreDisplay";
import { useScanStats } from "@/hooks/useScanStats";
import { useDailyScans } from "@/hooks/useDailyScans";
import { useScrollLock } from "@/hooks/useScrollLock";

const BarcodeScanner = dynamic(
  () => import("@/components/BarcodeScanner"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-3xl bg-black font-bold text-white">
        Loading scanner...
      </div>
    ),
  }
);

export default function ScanPage() {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [realAlternatives, setRealAlternatives] = useState<any[]>([]);
  const suggestionAbortRef = useRef<AbortController | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const productAbortRef = useRef<AbortController | null>(null);

  const lastSearchClickRef = useRef(0);
  const lastBarcodeClickRef = useRef(0);
  const lastScannerScanRef = useRef(0);
  const scannedBarcodeHandledRef = useRef(false);

  const MIN_LOADING_TIME = 400;

  const { recentSearches, saveRecentSearch } = useRecentSearches();
  const { canRunAction } = useCanRunAction();
  const { dedupeRequest } = useDedupeRequest();
  const { setCache, getCache, createCacheKey } = useCache();

  const {
    userId,
    selectedGoal,
    setSelectedGoal,
    userAge,
    userWeight,
    userHeight,
    setCurrentStreak,
    setBestStreak,
    setTotalScans,
    loadProfile,
  } = useUserProfile();

  const {
    favorites,
    saveHistory,
    saveFavorites,
    removeFavorite,
    loadLocalFoodLibrary,
    loadCloudData,
  } = useFoodLibrary(userId);

  const { dailyScansUsed, FREE_DAILY_SCAN_LIMIT } = useDailyScans();

  const { checkScanPermission } = useScanPermission();

  const { loadingAlternatives, fetchAlternatives } = useFoodAlternatives({
    getCache,
    setCache,
    createCacheKey,
    dedupeRequest,
  });

  const { updateScanStats } = useScanStats({
    userId,
    setTotalScans,
    setCurrentStreak,
    setBestStreak,
  });

  useScrollLock(!!product && !loading);

  useEffect(() => {
    loadLocalFoodLibrary();
  }, [loadLocalFoodLibrary]);

  

  useEffect(() => {
    const getUser = async () => {
      await loadProfile();

      const { data } = await supabase.auth.getUser();

      if (data.user) {
        await loadCloudData(data.user.id);
      }
    };

    getUser();
  }, [loadProfile, loadCloudData]);

  useEffect(() => {
    const suggestionRef = suggestionAbortRef;
    const searchRef = searchAbortRef;
    const productRef = productAbortRef;

    return () => {
      suggestionRef.current?.abort();
      searchRef.current?.abort();
      productRef.current?.abort();
    };
  }, []);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      const cleanQuery = query.trim().toLowerCase();

      if (cleanQuery.length < 3) {
        suggestionAbortRef.current?.abort();
        setSuggestions([]);
        return;
      }

      const cacheKey = createCacheKey("suggestions", cleanQuery);
      const cachedSuggestions = getCache<any[]>(cacheKey);

      if (cachedSuggestions) {
        setSuggestions(cachedSuggestions);
        return;
      }

      suggestionAbortRef.current?.abort();

      const controller = new AbortController();
      suggestionAbortRef.current = controller;

      try {
        const data = await dedupeRequest(
          createCacheKey("api_search_suggestions", cleanQuery),
          async () => {
            const res = await fetch(
              `/api/search?q=${encodeURIComponent(cleanQuery)}`,
              { signal: controller.signal }
            );

            return res.json();
          }
        );

        const mappedSuggestions = (data.products || []).map((p: any) => ({
          product_name: p.name,
          brands: p.brand,
          image_front_url: p.image,
          ingredients_text: p.ingredients,
          nutriscore_grade: p.nutriscore,
          nova_group: p.nova,
          nutriments: {
            sugars_100g: p.sugar,
            fat_100g: p.fat,
            salt_100g: p.salt,
          },
        }));

        setSuggestions(mappedSuggestions);
        setCache(cacheKey, mappedSuggestions, 6 * 60 * 60 * 1000);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.log(error);
        }
      }
    },
    [createCacheKey, dedupeRequest, getCache, setCache]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchSuggestions]);

  const {
    detectedHarmful,
    ingredientInsights,
    highRiskIngredients,
    mediumRiskIngredients,
    lowRiskIngredients,
    ingredientQuality,
  } = useIngredientInsights(product);

  const {
    productCategory,
    healthAnalysis,
    personalizedWarnings,
  } = useHealthMetrics(
    product,
    selectedGoal,
    ingredientInsights,
    userHeight,
    userWeight,
    userAge
  );

  const {
    healthScore,
    scoreLabel,
    scoreRingColor,
    scoreCircumference,
    scoreOffset,
    confidenceScore,
    healthBadgeClass,
    topReasons,
    breakdown,
  } = useScoreDisplay(healthAnalysis, product);

  const alternatives = product?.name
    ? getAlternatives(product.name, selectedGoal)
    : [];

  const isFavorite = product
    ? favorites.some((item) => item.name === product.name)
    : false;

  const toggleFavorite = async () => {
    if (!product) return;

    if (isFavorite) {
      await removeFavorite(product.name);
      return;
    }

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
  };

  const { analyzeSelectedProduct } = useAnalyzeProduct({
    createCacheKey,
    getCache,
    setCache,
    dedupeRequest,
    selectedGoal,
    fetchAlternatives,
    setProduct,
    setRealAlternatives,
    setSuggestions,
    setScannerOpen,
    setLoading,
    saveHistory,
    updateScanStats,
  });

  const searchProduct = async () => {
    if (loading) return;

    if (!searchQuery.trim()) return;

    saveRecentSearch(searchQuery);

    const cleanQuery = searchQuery.trim().toLowerCase();
    const searchCacheKey = createCacheKey("search_result", cleanQuery);
    const cachedSearch = getCache<any>(searchCacheKey);

    if (cachedSearch?.[0]) {
      setProduct(cachedSearch[0]);
      setSuggestions([]);
      setScannerOpen(false);
      return;
    }

    const permission = await checkScanPermission();
   

    if (!permission.allowed) {
      setUpgradeOpen(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    posthog.capture("product_searched", {
  query: cleanQuery,
});

    const loadingStartedAt = Date.now();

    searchAbortRef.current?.abort();

    const controller = new AbortController();
    searchAbortRef.current = controller;

    try {
      const foundProduct = await dedupeRequest(
        createCacheKey("api_search", cleanQuery),
        async () =>
          searchProductByName({
            query: cleanQuery,
            signal: controller.signal,
          })
      );

      if (!foundProduct) {
        alert("No product found. Try a more specific name.");
        return;
      }

      setCache(searchCacheKey, [foundProduct], 12 * 60 * 60 * 1000);

      setSuggestions([]);
      setScannerOpen(false);
      setProduct(foundProduct as unknown as Product)
      
;
      await saveHistory(foundProduct as unknown as Product);
      await updateScanStats();
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.log(error);
        alert("Search failed. Please try again.");
      }
    } finally {
      const elapsed = Date.now() - loadingStartedAt;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);

      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };

  const { fetchProduct } = useBarcodeProduct({
    barcode,
    selectedGoal,
    productAbortRef,
    checkScanPermission,
    setUpgradeOpen,
    createCacheKey,
    getCache,
    setCache,
    dedupeRequest,
    fetchAlternatives,
    setRealAlternatives,
    setProduct,
    setScannerOpen,
    setLoading,
    saveHistory,
    minLoadingTime: MIN_LOADING_TIME,
  });

  useEffect(() => {
  if (scannedBarcodeHandledRef.current) return;

  const scannedBarcode = localStorage.getItem("paustica_scanned_barcode");

  if (!scannedBarcode) return;

  scannedBarcodeHandledRef.current = true;

  localStorage.removeItem("paustica_scanned_barcode");

  const timer = setTimeout(() => {
    setBarcode(scannedBarcode);
    fetchProduct(scannedBarcode);
  }, 300);

  return () => clearTimeout(timer);
}, [fetchProduct]);

  const logFood = async () => {
    if (!product) return;

    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      window.location.href = "/auth";
      return;
    }

    const { error } = await supabase.from("daily_food_logs").insert({
      user_id: data.user.id,
      product_name: product.name,
      brand: product.brand,
      calories: product.calories ?? 0,
      protein: product.protein ?? 0,
      carbs: product.carbs ?? 0,
      fat: product.fat ?? 0,
      sugar: product.sugar ?? 0,
      salt: product.salt ?? 0,
      fiber: 0,
      paustica_score: healthAnalysis?.score ?? 0,
      servings: 1,
    });

    if (error) {
      alert("Could not log food. Please try again.");
      return;
    }

    alert("Food logged for today.");
  };

  return (
    <main className="min-h-screen bg-[#fff7ed]">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-16 text-center">
          <p className="text-sm font-black uppercase tracking-wider text-orange-600">
            Scan Food
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-black text-gray-900">
            Analyze food in seconds
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500">
            Scan a barcode or search a product to understand ingredients,
            processing levels and healthier alternatives.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <ScannerSection
            barcode={barcode}
            setBarcode={setBarcode}
            loading={loading}
            fetchProduct={fetchProduct}
            scannerOpen={scannerOpen}
            setScannerOpen={setScannerOpen}
            setLoading={setLoading}
            BarcodeScanner={BarcodeScanner}
            canRunAction={canRunAction}
            lastBarcodeClickRef={lastBarcodeClickRef}
            lastScannerScanRef={lastScannerScanRef}
          />

          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            loading={loading}
            searchProduct={searchProduct}
            analyzeSelectedProduct={analyzeSelectedProduct}
            canRunAction={canRunAction}
            lastSearchClickRef={lastSearchClickRef}
          />
        </div>

        <QuickSearches
          recentSearches={recentSearches}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          saveRecentSearch={saveRecentSearch}
          searchProduct={searchProduct}
        />

        <div className="mt-10 text-center">
          <Link
            href="/compare"
            onClick={() =>
  posthog.capture("compare_clicked")
}
            className="inline-flex items-center rounded-full bg-gray-900 px-8 py-4 text-sm font-black text-white transition hover:bg-black"
          >
            Compare Foods
          </Link>
        </div>

        {loading && (
          <div className="mt-10">
            <ProductAnalysisSkeleton />
          </div>
        )}

        {product && !loading && (
          <ProductAnalysisModal
            onClose={() => {
              setProduct(null);
              setBarcode("");
            }}
          >
            <ProductAnalysisContent
              product={product}
              productCategory={productCategory}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              selectedGoal={selectedGoal}
              onGoalChange={async (value) => {
                const goal = value as HealthGoal;
                setSelectedGoal(goal);

                if (userId) {
                  await supabase.from("profiles").upsert({
                    id: userId,
                    health_goal: goal,
                  });
                }
              }}
              healthScore={healthScore}
              scoreLabel={scoreLabel}
              healthBadgeClass={healthBadgeClass}
              scoreRingColor={scoreRingColor}
              scoreOffset={scoreOffset}
              scoreCircumference={scoreCircumference}
              topReasons={topReasons}
              confidenceScore={confidenceScore}
              breakdown={breakdown}
              realAlternatives={realAlternatives}
              logFood={logFood}
              personalizedWarnings={personalizedWarnings}
              healthAnalysis={healthAnalysis}
              loadingAlternatives={loadingAlternatives}
              alternatives={alternatives}
              onScanAnother={() => {
                setProduct(null);
                setBarcode("");
                setScannerOpen(true);
              }}
              ingredientInsights={ingredientInsights}
              ingredientQuality={ingredientQuality}
              highRiskIngredients={highRiskIngredients}
              mediumRiskIngredients={mediumRiskIngredients}
              lowRiskIngredients={lowRiskIngredients}
              detectedHarmful={detectedHarmful}
            />
          </ProductAnalysisModal>
        )}
      </section>

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        dailyScansUsed={dailyScansUsed}
        freeDailyScanLimit={FREE_DAILY_SCAN_LIMIT}
      />
    </main>
  );
}