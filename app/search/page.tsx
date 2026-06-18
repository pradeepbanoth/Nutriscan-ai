"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Suspense, useCallback, useEffect, useRef, useState } from "react";

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
import { useAnalyzeProduct } from "@/hooks/useAnalyzeProduct";
import { useIngredientInsights } from "@/hooks/useIngredientInsights";
import { useHealthMetrics } from "@/hooks/useHealthMetrics";
import { useScoreDisplay } from "@/hooks/useScoreDisplay";
import { useScanStats } from "@/hooks/useScanStats";
import { useDailyScans } from "@/hooks/useDailyScans";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useSearchParams } from "next/navigation";

function SearchPageContent() {
    const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [realAlternatives, setRealAlternatives] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const suggestionAbortRef = useRef<AbortController | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const lastSearchClickRef = useRef(0);

  const MIN_LOADING_TIME = 700;

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

    return () => {
      suggestionRef.current?.abort();
      searchRef.current?.abort();
    };
  }, []);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      const cleanQuery = query.trim().toLowerCase();

      if (cleanQuery.length < 2) {
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

   const searchProduct = useCallback(async () => {
  if (!searchQuery.trim()) return;

  saveRecentSearch(searchQuery);

  const cleanQuery = searchQuery.trim().toLowerCase();
  const searchCacheKey = createCacheKey("search_result", cleanQuery);
  const cachedSearch = getCache<any>(searchCacheKey);

  if (cachedSearch?.[0]) {
    setProduct(cachedSearch[0] as unknown as Product);
    setSuggestions([]);
    return;
  }

  const permission = await checkScanPermission();

  if (!permission.allowed) {
    setUpgradeOpen(true);
    setLoading(false);
    return;
  }

  setLoading(true);

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
    setProduct(foundProduct as unknown as Product);
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
}, [
  searchQuery,
  saveRecentSearch,
  createCacheKey,
  getCache,
  checkScanPermission,
  dedupeRequest,
  setCache,
  saveHistory,
  updateScanStats,
]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchSuggestions]);

 useEffect(() => {
  const q = searchParams.get("q");

  if (!q) return;

  const timer = setTimeout(() => {
    setSearchQuery((prev) => {
      if (prev === q) return prev;
      return q;
    });
  }, 0);

  return () => clearTimeout(timer);
}, [searchParams]);

useEffect(() => {
  if (!searchQuery.trim()) return;

  const timer = setTimeout(() => {
    searchProduct();
  }, 300);

  return () => clearTimeout(timer);
}, [searchQuery, searchProduct]);

  const {
    detectedHarmful,
    ingredientInsights,
    highRiskIngredients,
    mediumRiskIngredients,
    lowRiskIngredients,
    ingredientQuality,
  } = useIngredientInsights(product);

  const { productCategory, healthAnalysis, personalizedWarnings } =
    useHealthMetrics(
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
    setScannerOpen: () => {},
    setLoading,
    saveHistory,
    updateScanStats,
  });

 

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
            Search Food
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-black text-gray-900">
            Search any packaged food
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500">
            Find products by name and understand nutrition, ingredients,
            processing level, and healthier alternatives.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
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

          <QuickSearches
            recentSearches={recentSearches}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            saveRecentSearch={saveRecentSearch}
            searchProduct={searchProduct}
          />
        </div>

        <div className="mt-8">

<p className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">

Trending Searches

</p>

<div className="flex flex-wrap gap-3">

{["Maggi", "Nutella", "Diet Coke", "Red Bull", "Lay's"].map(
(item) => (

<button
key={item}
onClick={() => setSearchQuery(item)}
className="rounded-full border border-orange-100 bg-white px-5 py-3 text-sm font-black text-gray-700 hover:bg-orange-50"
>

{item}

</button>

)
)}

</div>

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
                window.location.href = "/scan";
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
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center">
          <p className="font-bold text-gray-500">Loading search...</p>
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}