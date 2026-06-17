"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect,  useRef, useState } from "react";
import dynamic from "next/dynamic";

const BarcodeScanner = dynamic(
  () => import("../components/BarcodeScanner"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] bg-black rounded-[28px] flex items-center justify-center text-white font-bold">
        Loading scanner...
      </div>
    ),
  }
);
import { getAlternatives } from "../lib/getAlternatives";
import { HealthGoal } from "../lib/goalScoring";
import { supabase } from "./lib/supabase";
import { getProductComparisons } from "../lib/productComparisons";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/home/Hero";
import TrustStats from "@/components/home/TrustStats";
import PrimaryActions from "@/components/home/PrimaryActions";
import LiveProductPreview from "@/components/home/LiveProductPreview";
import FeatureCards from "@/components/home/FeatureCards";
import HowItWorks from "@/components/home/HowItWorks";
import FinalCTA from "@/components/home/FinalCTA";
import ProductAnalysisModal from "@/components/product/ProductAnalysisModal";
import ScannerSection from "@/components/scan/ScannerSection";
import SearchSection from "@/components/scan/SearchSection";
import QuickSearches from "@/components/scan/QuickSearches";
import ReadyToAnalyze from "@/components/scan/ReadyToAnalyze";
import { useCache } from "@/hooks/useCache";
import { useDedupeRequest } from "@/hooks/useDedupeRequest";
import { searchProductByName } from "@/services/searchService";
import { useScanPermission } from "@/hooks/useScanPermission";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useCanRunAction } from "@/hooks/useCanRunAction";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useFoodLibrary } from "@/hooks/useFoodLibrary";
import { useAuthActions } from "@/hooks/useAuthActions";
import ProductAnalysisSkeleton from "@/components/product/ProductAnalysisSkeleton";
import DifferenceCarousel from "@/components/home/DifferenceCarousel";
import ProfileModal from "@/components/profile/ProfileModal";
import UpgradeModal from "@/components/pricing/UpgradeModal";
import ProductComparison from "@/components/product/ProductComparison";
import FavoritesSection from "@/components/history/FavoritesSection";
import ScanHistory from "@/components/history/ScanHistory";
import type { Product } from "@/hooks/useFoodLibrary";
import { useHealthMetrics } from "@/hooks/useHealthMetrics";
import { useScoreDisplay } from "@/hooks/useScoreDisplay";
import { useIngredientInsights } from "@/hooks/useIngredientInsights";
import { useScanStats } from "@/hooks/useScanStats";
import { useDailyScans } from "@/hooks/useDailyScans";
import ProductAnalysisContent from "@/components/product/ProductAnalysisContent";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ScannerPanel from "@/components/scan/ScannerPanel";
import BackgroundEffects from "@/components/layout/BackgroundEffects";
import { useFoodAlternatives } from "@/hooks/useFoodAlternatives";
import { useAnalyzeProduct } from "@/hooks/useAnalyzeProduct";
import { useBarcodeProduct } from "@/hooks/useBarcodeProduct";
import Testimonials from "@/components/home/Testimonials";
import FoodCategories from "@/components/home/FoodCategories";
import BeforeAfter from "@/components/home/BeforeAfter";

export default function Home() {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [realAlternatives, setRealAlternatives] = useState<any[]>([]);
  
  const [fatSecretAlternatives, setFatSecretAlternatives] = useState<any[]>([]);
  const suggestionAbortRef = useRef<AbortController | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const productAbortRef = useRef<AbortController | null>(null);
  const { recentSearches, saveRecentSearch } = useRecentSearches();
  
  const MIN_LOADING_TIME = 700;

const { dedupeRequest } = useDedupeRequest();

const {
  setCache,
  getCache,
  createCacheKey,
} = useCache();

const {
  loadingAlternatives,
  fetchAlternatives,
} = useFoodAlternatives({
  getCache,
  setCache,
  createCacheKey,
  dedupeRequest,
});

useScrollLock(!!product && !loading);

const { canRunAction } = useCanRunAction();

const { logout } = useAuthActions();

const {
  userEmail,
  userId,
  selectedGoal,
  setSelectedGoal,
  userAge,
  userWeight,
  userHeight,
  setUserAge,
setUserWeight,
setUserHeight,
  currentStreak,
  setCurrentStreak,
  setBestStreak,
  totalScans,
  setTotalScans,
  loadProfile,
} = useUserProfile();

const {
  scanHistory,
  favorites,
  loadLocalFoodLibrary,
  loadCloudData,
  saveHistory,
  saveFavorites,
  removeFavorite,
  clearHistory,
} = useFoodLibrary(userId);



const {
  dailyScansUsed,
  FREE_DAILY_SCAN_LIMIT,
} = useDailyScans();

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


 
const fetchSuggestions = useCallback(async (query: string) => {
    const cleanQuery = query.trim().toLowerCase();

  if (cleanQuery.length < 2) {
    suggestionAbortRef.current?.abort();
    setSuggestions([]);
    return;
  }

  const cacheKey = createCacheKey(
  "suggestions",
  cleanQuery
);
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
}, [createCacheKey, dedupeRequest, getCache, setCache]);

useEffect(() => {
  const timer = setTimeout(() => {
    fetchSuggestions(searchQuery);
  }, 450);

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

 

 useEffect(() => {
  loadLocalFoodLibrary();
}, [loadLocalFoodLibrary]);



useEffect(() => {
  return () => {
    suggestionAbortRef.current?.abort();
    searchAbortRef.current?.abort();
    productAbortRef.current?.abort();
  };
}, []);

  
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

   const alternatives = product?.name
  ? getAlternatives(product.name, selectedGoal)
  : [];
    const comparisons = product?.name
  ? getProductComparisons(product.name)
  : [];

 

  const {
  productCategory,
  healthAnalysis,
  personalizedWarnings,
  bmi,
  bmiCategory,
  dailyCalorieTarget,
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
} = useScoreDisplay(
  healthAnalysis,
  product
);


   const achievements = [
  {
    title: "First Scan",
    current: Math.min(totalScans, 1),
    target: 1,
  },
  {
    title: "10 Products Analyzed",
    current: Math.min(totalScans, 10),
    target: 10,
  },
  {
    title: "50 Products Analyzed",
    current: Math.min(totalScans, 50),
    target: 50,
  },
  {
    title: "3-Day Streak",
    current: Math.min(currentStreak, 3),
    target: 3,
  },
  {
    title: "7-Day Streak",
    current: Math.min(currentStreak, 7),
    target: 7,
  },
];

const { updateScanStats } = useScanStats({
  userId,
  setTotalScans,
  setCurrentStreak,
  setBestStreak,
});
 
  const { analyzeSelectedProduct } =
  useAnalyzeProduct({
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
   
  if (!searchQuery.trim()) return;

  saveRecentSearch(searchQuery);
  const cleanQuery = searchQuery.trim().toLowerCase();
const searchCacheKey = createCacheKey(
  "search_result",
  cleanQuery
);
const cachedSearch = getCache<any>(searchCacheKey);

if (cachedSearch) {
    
  setScannerOpen(false);
  setProduct(null);
  return;
}

  const permission = await checkScanPermission();

 if (!permission.allowed) {
  
  setUpgradeOpen(true);
  setLoading(false);
  return;
}

setLoading(true);

 // eslint-disable-next-line react-hooks/purity
const loadingStartedAt = Date.now();

searchAbortRef.current?.abort();

const controller = new AbortController();
searchAbortRef.current = controller;

  setLoading(true);

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
   const mappedSearchResult = [foundProduct];


setCache(searchCacheKey, mappedSearchResult, 12 * 60 * 60 * 1000);

    setSuggestions([]);
    setScannerOpen(false);
    setProduct(null);
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

 const {
  scanRemaining,
  currentPlan,
  checkScanPermission,
} = useScanPermission();

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


const lastSearchClickRef = useRef(0);
const lastBarcodeClickRef = useRef(0);
const lastScannerScanRef = useRef(0);


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
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#fff7ed" }}
    >

    <BackgroundEffects />

<Navbar
  userEmail={userEmail}
  logout={logout}
  onOpenProfile={() => setProfileOpen(true)}
  onUpgrade={() => setUpgradeOpen(true)}
/>
<Hero
  onScan={() => setScannerOpen(true)}
  onSearchFocus={() => {
    document.getElementById("paustica-search")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }}
/>
<TrustStats />

<PrimaryActions
  onScan={() => setScannerOpen(true)}
  onSearchFocus={() => {
    document.getElementById("paustica-search")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }}
/>

<ScannerPanel>

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

<QuickSearches
  recentSearches={recentSearches}
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  saveRecentSearch={saveRecentSearch}
  searchProduct={searchProduct}
/>

{!product && !loading && !scannerOpen && (
  <ReadyToAnalyze onScan={() => setScannerOpen(true)} />
)}

 <p className="mt-4 text-sm text-gray-500 font-medium">
  {currentPlan === "guest"
    ? "Guest scans available"
    : scanRemaining === null
    ? `${currentPlan.toUpperCase()} plan`
    : `${scanRemaining} free scans remaining today`}
</p>

        {loading && <ProductAnalysisSkeleton />}

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
      

      <ProductComparison comparisons={comparisons} />
      
       <FavoritesSection
  favorites={favorites}
  onSelect={setProduct}
  onRemove={removeFavorite}
/>

      <ScanHistory
  scanHistory={scanHistory}
  onSelect={(item) => setProduct(item)}
  onClear={clearHistory}
/>
    </ScannerPanel>

      <LiveProductPreview />

<FeatureCards />



<BeforeAfter />

<FoodCategories />

<Testimonials />

<HowItWorks />

<FinalCTA onScan={() => setScannerOpen(true)} />

<DifferenceCarousel />

<section className="mt-24 max-w-5xl mx-auto px-4 sm:px-6 text-center">
  <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
    Built on trusted references
  </p>

  <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
    PAUSTICA explains food using nutrition data, ingredient signals, and health-focused references.
  </h2>

  <p className="mt-5 text-gray-500 leading-relaxed">
    Inspired by public nutrition guidance and references from sources like WHO, FDA, EFSA, and IARC.
  </p>


</section>

<Footer onUpgrade={() => setUpgradeOpen(true)} />

<UpgradeModal
  open={upgradeOpen}
  onClose={() => setUpgradeOpen(false)}
  dailyScansUsed={dailyScansUsed}
  freeDailyScanLimit={FREE_DAILY_SCAN_LIMIT}
/>
<ProfileModal
  open={profileOpen}
  onClose={() => setProfileOpen(false)}

  userId={userId}

  userAge={userAge}
  setUserAge={setUserAge}

  userWeight={userWeight}
  setUserWeight={setUserWeight}

  userHeight={userHeight}
  setUserHeight={setUserHeight}

  selectedGoal={selectedGoal}

  bmi={bmi}
  bmiCategory={bmiCategory}

  dailyCalorieTarget={dailyCalorieTarget}

  totalScans={totalScans}
  currentStreak={currentStreak}

  achievements={achievements}
/>

</main>
    
  );
}