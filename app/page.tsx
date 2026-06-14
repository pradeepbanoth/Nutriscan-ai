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
import { ingredientIntelligence } from "../lib/ingredientIntelligence";
import { calculateGoalScore, HealthGoal } from "../lib/goalScoring";
import { supabase } from "./lib/supabase";
import InstallButton from "../components/InstallButton";
import { getScoreBreakdown } from "../lib/scoreBreakdown";
import { getProductComparisons } from "../lib/productComparisons";
import MobileMenu from "../components/MobileMenu";
import { getConfidenceScore } from "../lib/getConfidenceScore"; 
import { getPersonalizedWarning } from "../lib/getPersonalizedWarning";
import Image from "next/image";
import { parseFatSecretNutrition } from "../lib/parseFatSecretNutrition";
import { getRealAlternatives } from "../lib/getRealAlternatives";
import { createSlug } from "../lib/createSlug";
import Link from "next/link";
import { analyzeHealth } from "../lib/healthEngine";
import { detectProductCategory } from "../lib/categoryEngine";


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

  calories?: number;
protein?: number;
carbs?: number;
fiber?: number;
saturatedFat?: number;
sodium?: number;
  category?: string;

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

function ProductAnalysisSkeleton() {
  return (
    <div className="mt-10 w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-[32px] shadow-2xl border border-orange-100 overflow-hidden animate-pulse">
        <div className="h-2 bg-orange-200" />

        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex justify-end mb-6">
            <div className="h-12 w-40 rounded-full bg-orange-100" />
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            <div className="mx-auto md:mx-0 w-32 h-32 md:w-40 md:h-40 rounded-[28px] bg-orange-100" />

            <div className="flex-1">
              <div className="h-8 w-3/4 rounded-full bg-orange-100 mb-4" />
              <div className="h-5 w-1/3 rounded-full bg-orange-100 mb-6" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-orange-50 border border-orange-100 p-4"
                  >
                    <div className="h-3 w-16 rounded-full bg-orange-100 mb-3" />
                    <div className="h-7 w-20 rounded-full bg-orange-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-orange-50 border border-orange-100 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-40 h-40 rounded-full bg-orange-100 mx-auto md:mx-0" />

              <div className="flex-1 space-y-4">
                <div className="h-7 w-1/2 rounded-full bg-orange-100" />
                <div className="h-4 w-full rounded-full bg-orange-100" />
                <div className="h-4 w-5/6 rounded-full bg-orange-100" />
                <div className="h-4 w-2/3 rounded-full bg-orange-100" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 rounded-2xl bg-white border border-orange-100"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm font-bold text-orange-600">
            Analyzing food intelligence...
          </p>
        </div>
      </div>
    </div>
  );
}




  

const CACHE_TTL = 24 * 60 * 60 * 1000;

function setCache<T>(
  key: string,
  value: T,
  ttl = DEFAULT_CACHE_TTL
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    key,
    JSON.stringify({
      value,
      expiry: Date.now() + ttl,
    })
  );
}



const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;

function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay = 450
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

function throttle<T extends (...args: any[]) => void>(
  callback: T,
  delay = 1200
) {
  let lastRun = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastRun < delay) return;

    lastRun = now;
    callback(...args);
  };
}

const canRunAction = (
  ref: React.MutableRefObject<number>,
  delay = 1200
) => {
  const now = Date.now();

  if (now - ref.current < delay) return false;

  ref.current = now;
  return true;
};



function getCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached);

    if (!parsed.expiry || Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.value as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function removeCache(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}
function createCacheKey(prefix: string, value: string | number) {
  return `${prefix}_${String(value).trim().toLowerCase()}`;
}
async function dedupeRequest<T>(
  key: string,
  requestFn: () => Promise<T>,
  activeRequests: React.MutableRefObject<Record<string, Promise<any> | undefined>>
): Promise<T> {
  if (activeRequests.current[key]) {
    return activeRequests.current[key];
  }

  const request = requestFn().finally(() => {
    delete activeRequests.current[key];
  });

  activeRequests.current[key] = request;
  return request;
}


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
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const FREE_DAILY_SCAN_LIMIT = 10;
  const [profileOpen, setProfileOpen] = useState(false);
  const [userAge, setUserAge] = useState("");
  const [userWeight, setUserWeight] = useState("");
  const [userHeight, setUserHeight] = useState("");
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalScans, setTotalScans] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [realAlternatives, setRealAlternatives] = useState<any[]>([]);
  const [showDemo, setShowDemo] = useState(false);
  const [showScoreFactors, setShowScoreFactors] = useState(false);
  const [scanRemaining, setScanRemaining] = useState<number | null>(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [fatSecretAlternatives, setFatSecretAlternatives] = useState<any[]>([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const suggestionAbortRef = useRef<AbortController | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const productAbortRef = useRef<AbortController | null>(null);
  const activeRequestsRef = useRef<Record<string, Promise<any> | undefined>>({});
  const MIN_LOADING_TIME = 700;


const fetchAlternatives = async (productName: string) => {
  const cleanName = productName.trim().toLowerCase();
  const cacheKey = createCacheKey(
  "fatsecret_alternatives",
  cleanName
);

  try {
    setLoadingAlternatives(true);

    const cachedAlternatives = getCache<any[]>(cacheKey);

    if (cachedAlternatives) {
      setFatSecretAlternatives(cachedAlternatives);
      return;
    }

   const fatsecretData = await dedupeRequest(
  createCacheKey("api_fatsecret_alternatives", cleanName),
  async () => {
    const fatsecretRes = await fetch(
      `/api/fatsecret/search?query=${encodeURIComponent(cleanName)}`
    );

    return fatsecretRes.json();
  },
  activeRequestsRef
);

    const foods = fatsecretData?.foods?.food || [];

    const alternatives = Array.isArray(foods)
      ? foods.slice(0, 5)
      : foods
      ? [foods]
      : [];

    setFatSecretAlternatives(alternatives);
    setCache(cacheKey, alternatives, 24 * 60 * 60 * 1000);
  } catch (error) {
    console.error("Alternative fetch failed:", error);
    setFatSecretAlternatives([]);
  } finally {
    setLoadingAlternatives(false);
  }
};
  const carouselRef = useRef<HTMLDivElement | null>(null);
const [activeSlide, setActiveSlide] = useState(0);
const differenceSlides = [
  {
    title: "Beyond Nutrition Labels",
    tag: "Clarity",
    text: "PAUSTICA explains what sugar, salt, fat, additives, and processing levels actually mean before you decide what to eat.",
  },
  {
    title: "Personalized Health Goals",
    tag: "Personalized",
    text: "Choose goals like diabetes friendly, heart health, weight loss, muscle gain, or kids nutrition for smarter food insights.",
  },
  {
    title: "Ingredient Intelligence",
    tag: "AI Analysis",
    text: "Understand risky additives, ultra-processing signals, and ingredient quality in simple, friendly language.",
  },
  {
    title: "Smarter Alternatives",
    tag: "Better Choices",
    text: "When a product is not ideal, PAUSTICA helps suggest better options instead of only showing warnings.",
  },
  {
    title: "Food Confidence",
    tag: "Trust",
    text: "PAUSTICA turns complex nutrition data into clear scores, warnings, positives, and simple next steps.",
  },
];

const scrollToSlide = (index: number) => {
  const slider = carouselRef.current;
  if (!slider) return;

  const slide = slider.children[index] as HTMLElement;
  if (!slide) return;

  slide.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  });

  setActiveSlide(index);
};

  const [dailyScansUsed, setDailyScansUsed] = useState(() => {
  if (typeof window === "undefined") return 0;

  const today = new Date().toISOString().split("T")[0];
  const saved = localStorage.getItem("paustica_daily_scans");

  if (!saved) return 0;

  const data = JSON.parse(saved);

  return data.date === today ? data.count : 0;
});
    



  const getDailyScansUsed = () => {
  const today = new Date().toISOString().split("T")[0];
  const saved = localStorage.getItem("paustica_daily_scans");

  if (!saved) return 0;

  const data = JSON.parse(saved);

  if (data.date !== today) return 0;

  return data.count || 0;
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
  },
  activeRequestsRef
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
    if (error.name === "AbortError") return;
    setSuggestions([]);
  }
}, []);

useEffect(() => {
  const timer = setTimeout(() => {
    fetchSuggestions(searchQuery);
  }, 450);

  return () => clearTimeout(timer);
}, [searchQuery, fetchSuggestions]);

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
    "ins 211",
    "ins211",
    "e211",
    "ins 621",
    "ins621",
    "e621",
    "ins 950",
    "ins950",
    "e950",
    "ins 951",
    "ins951",
    "e951",
    "ins 330",
    "ins330",
    "e330",
    "acesulfame k",
    "potassium sorbate",
    "carrageenan",
    "titanium dioxide",
    "polysorbate 80",
    "potassium benzoate",
    "xanthan gum",
    "guar gum",
    "erythritol",
    "stevia",
     ]; 

  const ingredientAliases: Record<string, string> = {
  "e621": "msg",
  "ins621": "msg",
  "ins 621": "msg",
  "monosodium glutamate": "msg",

  "e211": "sodium benzoate",
  "ins211": "sodium benzoate",
  "ins 211": "sodium benzoate",

  "e950": "acesulfame k",
  "ins950": "acesulfame k",
  "ins 950": "acesulfame k",

  "e951": "aspartame",
  "ins951": "aspartame",
  "ins 951": "aspartame",

  "e330": "ins 330",
  "ins330": "ins 330",
};

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

 const loadCloudData = useCallback(async (uid: string) => {
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
}, []);

useEffect(() => {
  if (product && !loading) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [product, loading]);


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
  const timer = setTimeout(() => {
    const saved = localStorage.getItem("paustica_recent_searches");

    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, 0);

  return () => clearTimeout(timer);
}, []);

useEffect(() => {
  return () => {
    suggestionAbortRef.current?.abort();
    searchAbortRef.current?.abort();
    productAbortRef.current?.abort();
  };
}, []);

  
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
  setUserEmail(data.user.email ?? null);
  setUserId(data.user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("health_goal, age, weight, height, current_streak, best_streak, total_scans, last_scan_date")
    .eq("id", data.user.id)
    .single();

  if (profile?.health_goal) {
  setSelectedGoal(profile.health_goal as HealthGoal);
}

if (profile?.age) {
  setUserAge(String(profile.age));
}

if (profile?.weight) {
  setUserWeight(String(profile.weight));
}

if (profile?.height) {
  setUserHeight(String(profile.height));
}

if (profile?.current_streak !== null && profile?.current_streak !== undefined) {
  setCurrentStreak(profile.current_streak);
}

if (profile?.best_streak !== null && profile?.best_streak !== undefined) {
  setBestStreak(profile.best_streak);
}

if (profile?.total_scans !== null && profile?.total_scans !== undefined) {
  setTotalScans(profile.total_scans);
}

  await loadCloudData(data.user.id);
}
    };

    getUser();
  }, [loadCloudData]);

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
    const rawKey = ingredient
      .trim()
      .toLowerCase()
      .replace(/[\-\(\)]/g, " ")
      .replace(/\s+/g, " ");

    const normalizedKey = ingredientAliases[rawKey] || rawKey;

    return {
      ingredient,
      info: ingredientIntelligence[normalizedKey],
    };
  })
  .filter((item) => item.info);

const highRiskIngredients = ingredientInsights.filter(
  (item) => item.info?.risk === "High"
).length;

const mediumRiskIngredients = ingredientInsights.filter(
  (item) => item.info?.risk === "Medium"
).length;

const lowRiskIngredients = ingredientInsights.filter(
  (item) => item.info?.risk === "Low"
).length;

const ingredientQuality =
  highRiskIngredients >= 2
    ? "Poor"
    : highRiskIngredients >= 1
    ? "Fair"
    : mediumRiskIngredients >= 3
    ? "Moderate"
    : ingredientInsights.length > 0
    ? "Good"
    : "Excellent";

   const alternatives = product?.name
  ? getAlternatives(product.name, selectedGoal)
  : [];
    const comparisons = product?.name
  ? getProductComparisons(product.name)
  : [];

  const healthAnalysis = product
  ? analyzeHealth({
      sugar: product.sugar,
      fat: product.fat,
      salt: product.salt,
      protein: product.protein,
      carbs: product.carbs,
      calories: product.calories,
      nova: product.nova,
      ingredients: product.ingredients,
      healthGoal: selectedGoal,
      fiber: product.fiber,
      saturatedFat: product.saturatedFat,
      sodium: product.sodium,
      servingSize: 0,
    })
  : null;

  const productCategory = product
  ? detectProductCategory({
      name: product.name,
      category: product.category,
      ingredients: product.ingredients,
    })
  : "Unknown";
  
  const healthScore = healthAnalysis?.score ?? 0;

const breakdown = healthAnalysis?.breakdown ?? {
  nutrition: 0,
  ingredients: 0,
  additives: 0,
  processing: 0,
  personalization: 0,
};
  const confidence = product
  ? getConfidenceScore(product)
  : {
      label: "Limited",
      score: 0,
      checks: {
        image: false,
        ingredients: false,
        nutriscore: false,
        nova: false,
        nutrition: false,
      },
    };

  const scoreLabel =
  healthAnalysis?.label ?? "Moderate Choice";

    const scoreRingColor =
  healthScore >= 80
    ? "#16a34a"
    : healthScore >= 60
    ? "#ca8a04"
    : healthScore >= 40
    ? "#ca8a04"
    : "#dc2626";

const scoreCircumference = 2 * Math.PI * 54;
const scoreOffset =
  scoreCircumference - (healthScore / 100) * scoreCircumference;

    const healthColor =
  healthScore >= 80
    ? "green"
    : healthScore >= 60
    ? "yellow"
    : healthScore >= 40
    ? "orange"
    : "red";

const confidenceScore = product
  ? [
      product.image,
      product.ingredients,
      product.nutriscore,
      product.nova,
    ].filter(Boolean).length * 25
  : 0;
    
const healthBadgeClass =
  healthColor === "green"
    ? "bg-green-100 text-green-700 border-green-200"
    : healthColor === "yellow"
    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
    : healthColor === "orange"
    ? "bg-orange-100 text-yellow-700 border-orange-200"
    : "bg-red-100 text-red-700 border-red-200";

    const topReasons = product
  ? [
      {
        label:
          product.sugar <= 7
            ? "Low sugar"
            : product.sugar > 15
            ? "High sugar"
            : "Moderate sugar",
        type: product.sugar > 15 ? "bad" : "good",
      },

     

      {
        label:
          product.salt <= 0.5
            ? "Low salt"
            : product.salt > 1.5
            ? "High salt"
            : "Moderate salt",
        type: product.salt > 1.5 ? "bad" : "good",
      },
      {
        label:
          Number(product.nova) >= 4
            ? "Ultra processed"
            : "Lower processing",
        type: Number(product.nova) >= 4 ? "bad" : "good",
      },
    ]
  : [];

  const healthGrade = healthAnalysis?.grade ?? "C";

  const healthVerdict =
    healthScore >= 75
      ? "This product looks like a better choice with relatively lower risk."
      : healthScore >= 50
      ? "This product is moderate. Consume occasionally and check portion size."
      : "This product looks unhealthy due to processing, sugar, salt, fat, or additives.";
       
const nutritionSummary = (() => {
  const messages = [];

  if ((product?.protein || 0) >= 10)
    messages.push("Good source of protein");

  if ((product?.sugar || 0) > 15)
    messages.push("High in sugar");

  if ((product?.salt || 0) > 1.5)
    messages.push("High in salt");

  if (Number(product?.nova || 0) >= 4)
    messages.push("Ultra-processed");

  if ((product?.calories || 0) > 300)
    messages.push("Calorie dense");

  return messages.slice(0, 3);
})();

 const personalizedWarnings = product
  ? getPersonalizedWarning(
      selectedGoal,
      product.sugar,
      product.fat,
      product.salt,
      Number(product.nova),
      ingredientInsights.length
    )
  : [];

  const bmi =
  Number(userHeight) > 0
    ? Number(userWeight) /
      Math.pow(Number(userHeight) / 100, 2)
    : 0;

const bmiCategory =
  bmi === 0
    ? "Not calculated"
    : bmi < 18.5
    ? "Underweight"
    : bmi < 25
    ? "Healthy range"
    : bmi < 30
    ? "Overweight"
    : "Obese range";

const bmr =
  Number(userWeight) > 0 &&
  Number(userHeight) > 0 &&
  Number(userAge) > 0
    ? 10 * Number(userWeight) +
      6.25 * Number(userHeight) -
      5 * Number(userAge) +
      5
    : 0;

const dailyCalorieTarget =
  bmr === 0
    ? 0
    : selectedGoal === "Weight Loss"
    ? Math.round(bmr + 200)
    : selectedGoal === "Muscle Gain"
    ? Math.round(bmr + 700)
    : Math.round(bmr + 400);

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
 
     const analyzeSelectedProduct = async (item: Record<string, unknown>) => {
      if (!item) return;

  setLoading(true);
  
setSuggestions([]);

const productName = String(item.product_name ?? "");
const fatsecretCacheKey = `fatsecret_search_${productName.toLowerCase()}`;

let fatsecretData = getCache<any>(fatsecretCacheKey);

if (!fatsecretData) {
  fatsecretData = await dedupeRequest(
  createCacheKey("api_fatsecret", productName),
  async () => {
    const fatsecretRes = await fetch(
      `/api/fatsecret/search?query=${encodeURIComponent(productName)}`
    );

    return fatsecretRes.json();
  },
  activeRequestsRef
);

  setCache(fatsecretCacheKey, fatsecretData);
}

const firstFood = fatsecretData?.foods?.food?.[0];

const nutrition = firstFood
  ? parseFatSecretNutrition(firstFood.food_description)
  : null;

const fetchedProduct: Product = {

    id: 0,
    name: productName || "Unknown Product",
    brand: String(item.brands ?? "Unknown Brand"),
    image: String(item.image_front_url ?? ""),
    ingredients: String(item.ingredients_text ?? "Ingredients unavailable"),
    nutriscore: String(item.nutriscore_grade ?? "unknown"),
    nova: String(item.nova_group ?? "N/A"),
    sugar: Number(
  (item as any).nutriments?.sugars_100g ?? 0
),

calories: nutrition?.calories || 0,
protein: nutrition?.protein || 0,
carbs: nutrition?.carbs || 0,
fiber: nutrition?.fiber || 0,
saturatedFat: nutrition?.saturatedFat || 0,
sodium: nutrition?.sodium || 0,

fat: Number(
  (item as any).nutriments?.fat_100g ?? 0
),

salt: Number(
  (item as any).nutriments?.salt_100g ?? 0
),
  };

  

  setProduct(fetchedProduct);
  const analysis = analyzeHealth({
  sugar: fetchedProduct.sugar,
  fat: fetchedProduct.fat,
  salt: fetchedProduct.salt,
  protein: fetchedProduct.protein,
  carbs: fetchedProduct.carbs,
  calories: fetchedProduct.calories,
  nova: fetchedProduct.nova,
  ingredients: fetchedProduct.ingredients,
  healthGoal: selectedGoal,
});

if (analysis.score < 60) {
  fetchAlternatives(fetchedProduct.name);
} else {
  setFatSecretAlternatives([]);
}
const realAlternativesCacheKey =
  createCacheKey(
    "real_alternatives",
    fetchedProduct.name
  );

const cachedRealAlternatives = getCache<any[]>(realAlternativesCacheKey);

if (cachedRealAlternatives) {
  setRealAlternatives(cachedRealAlternatives);
} else {
const realItems = await dedupeRequest(
  createCacheKey("api_real_alternatives", fetchedProduct.name),
  async () => getRealAlternatives(fetchedProduct.name),
  activeRequestsRef
);
  setRealAlternatives(realItems);
  setCache(realAlternativesCacheKey, realItems, 24 * 60 * 60 * 1000);
}
  
  
  await updateScanStats();
  const getDailyScansUsed = () => {
  const today = new Date().toISOString().split("T")[0];
  const saved = localStorage.getItem("paustica_daily_scans");

  if (!saved) return 0;

  const data = JSON.parse(saved);

  if (data.date !== today) return 0;

  return data.count || 0;
};
  setScannerOpen(false);

  await saveHistory(fetchedProduct);

  setLoading(false);
};

const saveRecentSearch = (query: string) => {
  const cleanQuery = query.trim();

  if (!cleanQuery) return;

  const updated = [
    cleanQuery,
    ...recentSearches.filter(
      (item) => item.toLowerCase() !== cleanQuery.toLowerCase()
    ),
  ].slice(0, 5);

  setRecentSearches(updated);
  localStorage.setItem("paustica_recent_searches", JSON.stringify(updated));
};


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
  setSearchResults(cachedSearch);
  setSuggestions([]);
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
  const data = await dedupeRequest(
  createCacheKey("api_search", cleanQuery),
  async () => {
    const res = await fetch(
      `/api/search?q=${encodeURIComponent(cleanQuery)}`,
      { signal: controller.signal }
    );

    return res.json();
  },
  activeRequestsRef
);

    if (!data.success || !data.product) {
      alert("No product found. Try a more specific name.");
      setSearchResults([]);
      return;
    }

    const p = data.product;

 const mappedSearchResult = [
  {
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
  },
];

setSearchResults(mappedSearchResult);
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

 const checkScanPermission = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    setCurrentPlan("guest");
    setScanRemaining(null);

    return {
      allowed: true,
      remaining: null,
      plan: "guest",
    };
  }

  const res = await fetch("/api/usage/scan", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const data = await res.json();

  if (typeof data.remaining !== "undefined") {
    setScanRemaining(data.remaining);
  }

  if (data.plan) {
    setCurrentPlan(data.plan);
  }

  return data;
};


const updateScanStats = async () => {
  if (!userId) return;

  const today = new Date().toISOString().split("T")[0];

  const { data: profile } = await supabase
    .from("profiles")
    .select("current_streak, best_streak, total_scans, last_scan_date")
    .eq("id", userId)
    .single();

  const previousTotalScans = profile?.total_scans ?? 0;
  const previousCurrentStreak = profile?.current_streak ?? 0;
  const previousBestStreak = profile?.best_streak ?? 0;
  const lastScanDate = profile?.last_scan_date;

  let newCurrentStreak = previousCurrentStreak;

  if (!lastScanDate) {
    newCurrentStreak = 1;
  } else {
    const lastDate = new Date(lastScanDate);
    const todayDate = new Date(today);

    const diffDays = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      newCurrentStreak = previousCurrentStreak;
    } else if (diffDays === 1) {
      newCurrentStreak = previousCurrentStreak + 1;
    } else {
      newCurrentStreak = 1;
    }
  }

  const newTotalScans = previousTotalScans + 1;
  const newBestStreak = Math.max(previousBestStreak, newCurrentStreak);

  setTotalScans(newTotalScans);
  setCurrentStreak(newCurrentStreak);
  setBestStreak(newBestStreak);

  await supabase.from("profiles").upsert({
    id: userId,
    total_scans: newTotalScans,
    current_streak: newCurrentStreak,
    best_streak: newBestStreak,
    last_scan_date: today,
  });
};

      const fetchProduct = async (code?: string) => {
  const finalBarcode = code || barcode;

  if (!finalBarcode) return;
  

 


   const permission = await checkScanPermission();

    // eslint-disable-next-line react-hooks/purity
const loadingStartedAt = Date.now();

    productAbortRef.current?.abort();

const controller = new AbortController();
productAbortRef.current = controller;

 const productCacheKey = createCacheKey(
  "product",
  finalBarcode
);
const cachedProduct = getCache<Product>(productCacheKey);

if (cachedProduct) {
  setProduct(cachedProduct);
  setScannerOpen(false);
  setLoading(false);
  return;
}

  setLoading(true);

  try {
 const data = await dedupeRequest(
  createCacheKey("api_product", finalBarcode),
  async () => {
    const res = await fetch(
      `/api/product?barcode=${encodeURIComponent(finalBarcode)}`,
      { signal: controller.signal }
    );

    return res.json();
  },
  activeRequestsRef
);

   if (data.success && data.product) {
     
  const productNameForNutrition =
  data.product.name ||
  data.product.product_name ||
  "Unknown Product";

const fatsecretCacheKey = `fatsecret_search_${productNameForNutrition.toLowerCase()}`;

let fatsecretData = getCache<any>(fatsecretCacheKey);

if (!fatsecretData) {
fatsecretData = await dedupeRequest(
  createCacheKey("api_fatsecret", productNameForNutrition),
  async () => {
    const fatsecretRes = await fetch(
      `/api/fatsecret/search?query=${encodeURIComponent(productNameForNutrition)}`
    );

    return fatsecretRes.json();
  },
  activeRequestsRef
);

  setCache(fatsecretCacheKey, fatsecretData);
}

const firstFood = fatsecretData?.foods?.food?.[0];

const nutrition = firstFood
  ? parseFatSecretNutrition(firstFood.food_description)
  : null;

  
const fetchedProduct: Product = {
        id: Number(finalBarcode),
        name: data.product.name || "Unknown Product",
        brand: data.product.brand || "Unknown Brand",
        image: data.product.image || "",
        ingredients:
          data.product.ingredients || "Ingredients unavailable",
        nutriscore: data.product.nutriscore || "unknown",
        nova: data.product.nova || "N/A",
        sugar: data.product.sugar ?? 0,
        fat: data.product.fat ?? 0,
        salt: data.product.salt ?? 0,
        
        calories: nutrition?.calories || 0,
        protein: nutrition?.protein || 0,
        carbs: nutrition?.carbs || 0,
        

      };

     setCache(productCacheKey, fetchedProduct, 7 * 24 * 60 * 60 * 1000);

      setScannerOpen(false);
      setProduct(fetchedProduct);

      const analysis = analyzeHealth({
  sugar: fetchedProduct.sugar,
  fat: fetchedProduct.fat,
  salt: fetchedProduct.salt,
  protein: fetchedProduct.protein,
  carbs: fetchedProduct.carbs,
  calories: fetchedProduct.calories,
  nova: fetchedProduct.nova,
  ingredients: fetchedProduct.ingredients,
  healthGoal: selectedGoal,
});

if (analysis.score < 60) {
  fetchAlternatives(fetchedProduct.name);
} else {
  setFatSecretAlternatives([]);
}

  const realAlternativesCacheKey = `real_alternatives_${fetchedProduct.name
  .trim()
  .toLowerCase()}`;

const cachedRealAlternatives = getCache<any[]>(realAlternativesCacheKey);

if (cachedRealAlternatives) {
  setRealAlternatives(cachedRealAlternatives);
} else {
const realItems = await dedupeRequest(
  createCacheKey("api_real_alternatives", fetchedProduct.name),
  async () => getRealAlternatives(fetchedProduct.name),
  activeRequestsRef
);
  setRealAlternatives(realItems);
  setCache(realAlternativesCacheKey, realItems, 24 * 60 * 60 * 1000);
}

      await saveHistory(fetchedProduct);
    } else {
  setProduct(null);
  alert("Product not found in database. Try another barcode or enter product details manually.");
}
} catch (error: any) {
  if (error.name !== "AbortError") {
    console.log(error);
    alert("Something went wrong");
  }
} finally {
  const elapsed = Date.now() - loadingStartedAt;
  const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);

  setTimeout(() => {
    setLoading(false);
  }, remainingTime);
}
};
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

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
  <div
    className="bubble-float absolute top-24 left-16 h-96 w-96 rounded-full bg-orange-300/10 blur-[120px]"
  />

  <div
    className="bubble-float absolute top-[40%] right-0 h-[500px] w-[500px] rounded-full bg-orange-400/15 blur-[140px]"
    style={{ animationDelay: "3s" }}
  />

  <div
    className="bubble-float absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-yellow-300/15 blur-[140px]"
    style={{ animationDelay: "6s" }}
  />
</div>
<nav className="sticky top-0 z-50 border-b border-orange-100 bg-white/70 backdrop-blur-xl">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Image
  src="/logo.png"
  alt="PAUSTICA"
  width={48}
  height={48}
  className="object-contain"
/>

      <span className="text-xl font-black tracking-tight text-[#0f172a]">
        PAUSTICA
      </span>
    </div>

    <MobileMenu
  loggedIn={!!userEmail}
  onLogout={logout}
  onOpenProfile={() => setProfileOpen(true)}
/>

    <div className="hidden md:flex items-center gap-3">
      {userEmail ? (
        <>
          <a
            href="/dashboard"
            className="rounded-full px-5 py-3 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100"
          >
            Dashboard
          </a>
          <button
  onClick={() => setUpgradeOpen(true)}
  className="rounded-full px-5 py-3 text-sm font-bold text-white bg-gray-900"
>
  Upgrade
</button>

          <a
            href="/menu"
            className="rounded-full px-5 py-3 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100"
          >
            Menu
          </a>

          <button
            onClick={logout}
            className="rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
            }}
          >
            Logout
          </button>

         
        </>
      ) : (
        <>
          <a
            href="/menu"
            className="rounded-full px-5 py-3 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100"
          >
            Menu
          </a>
          <button
  onClick={() => setUpgradeOpen(true)}
  className="rounded-full px-5 py-3 text-sm font-bold text-white bg-gray-900"
>
  Upgrade
</button>

          <a
            href="/auth"
            className="rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
            }}
          >
            Login
          </a>
        </>
      )}
    </div>
  </div>
</nav>

<section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-14 text-center">
      <Image
  src="/logo.png"
  alt="PAUSTICA"
  width={72}
  height={72}
  className="mx-auto mb-6 object-contain"
/>
        <h1 className="heading-font text-3xl sm:text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[0.95] text-gray-900 mb-6">
        Scan Food
<br />
<span
  style={{
    background:
      "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  Smarter
</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed text-gray-500 mb-10">
          Instantly understand ingredients, additives, nutrition and healthier alternatives.
        </p>

        <div className="flex flex-col md:flex-row gap-3 justify-center mb-8">
          <button
            
            className="px-8 py-5 rounded-[20px] text-white font-bold text-lg shadow-xl"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
            }}
          >
          SCAN FOOD
          </button>

         
          <input
  value={barcode}
  onChange={(e) => setBarcode(e.target.value)}
  placeholder="Enter barcode manually"
className="px-6 py-5 rounded-2xl bg-white text-gray-900 font-bold outline-none shadow-sm"
/>

       <button
        disabled={loading}
        onClick={() => {
  if (!canRunAction(lastBarcodeClickRef, 1500)) return;
  fetchProduct();
}}
className="px-7 py-5 rounded-2xl bg-gray-900 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
        {loading ? "Analyzing..." : "Analyze Barcode"}
           </button>
        </div> 

       <div className="max-w-2xl mx-auto mt-4">
  <div className="relative">
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        onKeyDown={(e) => {
         if (e.key === "Enter") {
  setSuggestions([]);
  if (!canRunAction(lastSearchClickRef, 1500)) return;
searchProduct();
}
        }}
        placeholder="Search product name..."
        className="flex-1 px-6 py-4 rounded-[20px] border border-orange-100 bg-white outline-none font-semibold shadow-sm"
      />

      <button
        disabled={loading}
       onClick={() => {
  if (!canRunAction(lastSearchClickRef, 1500)) return;
  searchProduct();
}}
        className="px-6 py-4 rounded-[20px] bg-orange-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>

    {suggestions.length > 0 && (
      <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-2xl">
        {suggestions.slice(0, 5).map((item: any, index: number) => (
          <button
            key={index}
            onClick={() => {
              setSearchQuery(item.product_name || "");
              analyzeSelectedProduct(item);
              setSuggestions([]);
            }}
            className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-orange-50"
          >
            {item.image_front_url ? (
              <Image
                src={item.image_front_url}
                alt={item.product_name}
                width={48}
                height={48}
                className="rounded-[20px] object-cover border border-orange-100"
                unoptimized
              />
            ) : (
              <div className="h-12 w-12 rounded-[20px] bg-orange-50 border border-orange-100" />
            )}

            <div>
              <p className="font-bold text-gray-900">
                {item.product_name || "Unknown Product"}
              </p>
              <p className="text-sm text-gray-500">
                {item.brands || "Unknown Brand"}
              </p>
            </div>
          </button>
        ))}
      </div>
    )}
  </div>
</div>

{recentSearches.length > 0 && searchQuery.length === 0 && (
  <div className="mt-4 flex flex-wrap justify-center gap-2">
    {recentSearches.map((item) => (
      <button
        key={item}
        onClick={() => {
  setSearchQuery(item);
setSuggestions([]);
saveRecentSearch(item);

setTimeout(() => {
  searchProduct();
}, 0);
}}
        className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-bold text-gray-600 hover:bg-orange-50"
      >
        {item}
      </button>
    ))}
  </div>
)}
{recentSearches.length === 0 && searchQuery.length === 0 && (
  <div className="mt-4 flex flex-wrap justify-center gap-2">
    {["Diet Coke", "Maggi", "Nutella", "Red Bull", "Lay's"].map((item) => (
      <button
        key={item}
        onClick={() => {
          setSearchQuery(item);
          setSuggestions([]);
        }}
        className="rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600 hover:bg-white"
      >
        {item}
      </button>
    ))}
  </div>
)}

 <p className="mt-4 text-sm text-gray-500 font-medium">
  {currentPlan === "guest"
    ? "Guest scans available"
    : scanRemaining === null
    ? `${currentPlan.toUpperCase()} plan`
    : `${scanRemaining} free scans remaining today`}
</p>

        {scannerOpen && (
  <div className="max-w-2xl mx-auto bg-white p-6 rounded-[32px] shadow-xl mb-10">
              <BarcodeScanner
             onScan={(code) => {
  if (!canRunAction(lastScannerScanRef, 2000)) return;




  setBarcode(code);
  setScannerOpen(false);
  setLoading(true);
  fetchProduct(code);
}}
              
              />
            <p className="text-sm text-gray-400 mt-4">
                Align barcode inside frame
              </p>
          </div>
        )}

        {loading && <ProductAnalysisSkeleton />}
         
         {!product && !loading && !scannerOpen && (
<div className="mt-10 max-w-2xl mx-auto bg-white rounded-[32px] shadow-sm p-8">
<h3 className="heading-font text-xl font-black text-gray-900 mb-3">
      Ready to analyze your food
    </h3>

    <p className="text-gray-500 mb-6">
      Open the scanner or enter a barcode manually to get instant health insights.
    </p>

    <button
      onClick={() => setScannerOpen(true)}
      className="px-8 py-4 rounded-[20px] text-white font-bold shadow-lg"
      style={{
        background: "linear-gradient(135deg, #f97316, #ea580c)",
      }}
    >
      Start Scanning
    </button>
  </div>
)}

      {product && !loading && (
  <>
    <div
      onClick={() => {
        setProduct(null);
        setBarcode("");
        setSearchResults([]);
      }}
      className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
    />
          <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-4xl rounded-t-[36px] border border-orange-100 bg-white shadow-2xl max-h-[88vh] overflow-y-auto pb-6 sm:bottom-6 sm:rounded-[36px]">
            <div className="overflow-hidden">
           <div className="sticky top-0 z-20 bg-white pt-3 pb-3 border-b border-orange-100">
  <div className="mx-auto h-1.5 w-16 rounded-full bg-gray-300 mb-3" />

  <div className="flex items-center justify-between px-5">
    <p className="text-sm font-black text-gray-500 uppercase tracking-wide">
      Product Analysis
    </p>

    <button
      onClick={() => {
        setProduct(null);
        setBarcode("");
        setSearchResults([]);
      }}
      className="h-9 w-9 rounded-full bg-orange-50 border border-orange-100 text-orange-600 font-black"
    >
      ×
    </button>
  </div>
</div>
                  <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />

                <div className="p-4 sm:p-6 md:p-8">
                <div className="flex justify-end mb-6">
  <button
    onClick={() => {
      setProduct(null);
      setBarcode("");
      setScannerOpen(true);
    }}
    className="px-5 py-3 rounded-full bg-orange-50 border border-orange-100 text-orange-600 font-bold"
  >
    Scan Another Product
  </button>
</div>
                <div className="text-center">
  {product.image && (
    <Image
      src={product.image}
      alt={product.name}
      width={160}
      height={160}
      className="mx-auto w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-[32px] border border-orange-100 shadow-md"
      unoptimized
    />
  )}

  <div className="mt-6">
                   <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mt-4 mb-2 leading-tight">
  {product.name}
</h2>

<p className="text-sm sm:text-base text-gray-500 mb-4">
  {product.brand}
</p>

<div className="flex justify-center gap-3 mb-6">
  <span className="inline-flex px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-black">
    {productCategory}
  </span>

  <button
    onClick={toggleFavorite}
    className={`px-4 py-2 rounded-full font-bold border transition-all ${
      isFavorite
        ? "bg-orange-500 text-white border-orange-500"
        : "bg-white text-orange-600 border-orange-100"
    }`}
  >
    {isFavorite ? "Saved" : "Save"}
  </button>
</div>

                 
                  </div>
                </div>

                <div className="mt-8 text-left">
                  <label className="block text-sm font-bold text-gray-500 mb-3">
                    Personal Health Goal
                  </label>

               <div className="relative">
  <select
    value={selectedGoal}
    onChange={async (e) => {
      const goal = e.target.value as HealthGoal;
      setSelectedGoal(goal);

      if (userId) {
        await supabase
          .from("profiles")
          .upsert({
            id: userId,
            health_goal: goal,
          });
      }
    }}
    className="w-full appearance-none rounded-[20px] border border-orange-100 bg-orange-50 px-5 py-4 pr-12 font-bold text-gray-800 outline-none shadow-sm"
  >
    <option>General Wellness</option>
    <option>Weight Loss</option>
    <option>Diabetes Friendly</option>
    <option>Muscle Gain</option>
    <option>Heart Health</option>
    <option>Kids Nutrition</option>
  </select>

  <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-orange-500">
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>
</div>
                </div>

                <div className="mt-8 text-left">
                  <div
className={`rounded-[32px] p-4 sm:p-6 shadow-sm ${
healthScore >= 80
    ? "bg-green-50"
    : healthScore >= 60
    ? "bg-yellow-50"
    : healthScore >= 40
    ? "bg-orange-50"
    : "bg-red-50"
}`}
                  >
                    <div className="flex flex-col md:flex-row gap-6 mb-4">
                      <div>
                        <p className="heading-font text-sm text-gray-500 font-semibold">
                         AI Health Score
                           </p>

<div className="relative w-40 h-40 mx-auto md:mx-0">
  <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
    <circle
      cx="60"
      cy="60"
      r="54"
      stroke="#e5e7eb"
      strokeWidth="10"
      fill="none"
    />

    <circle
      cx="60"
      cy="60"
      r="54"
      stroke={scoreRingColor}
      strokeWidth="10"
      fill="none"
      strokeLinecap="round"
      strokeDasharray={scoreCircumference}
      strokeDashoffset={scoreOffset}
    />
  </svg>

  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <p
      className={`text-4xl font-black ${
        healthScore >= 80
          ? "text-green-600"
          : healthScore >= 60
          ? "text-yellow-600"
          : healthScore >= 40
          ? "text-orange-600"
          : "text-red-600"
      }`}
    >
      {healthScore}
    </p>

    <p className="text-xs font-semibold text-gray-400 tracking-wide">
  out of 100
</p>
  </div>
</div>

<div className="mt-4 flex justify-center md:justify-start">
  <span className={`inline-flex items-center px-6 py-3 rounded-full border text-xl font-black shadow-sm ${healthBadgeClass}`}>
    {scoreLabel}
  </span>
</div>
<div className="mt-4 max-w-sm rounded-[24px] border border-orange-100 bg-white p-4 shadow-sm text-center md:text-left">
  <p className="text-sm font-black text-gray-900 mb-2">
    Why this score?
  </p>

  <div className="space-y-2">
    {topReasons.slice(0, 3).map((reason) => (
      <div
        key={reason.label}
        className="flex items-center justify-between gap-3 text-sm"
      >
        <span className="font-semibold text-gray-600">
          {reason.label}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            reason.type === "bad"
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          {reason.type === "bad" ? "Needs attention" : "Good"}
        </span>
      </div>
    ))}
  </div>
</div>


<div className="mt-4">
  <div className="flex justify-between text-xs text-gray-500 mb-1">
    <span>Analysis Confidence</span>
    <span>{confidenceScore}%</span>
  </div>

  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
    <div
      className="h-full bg-green-500 rounded-full"
      style={{ width: `${confidenceScore}%` }}
    />
  </div>
</div>
<div className="mt-4 flex flex-wrap gap-2">
  {topReasons.map((reason) => (
    <span
      key={reason.label}
      className={`px-3 py-2 rounded-full text-sm font-bold ${
        reason.type === "bad"
          ? "bg-red-50 text-red-700"
          : "bg-green-50 text-green-700"
      }`}
    >
      {reason.type === "bad" ? "!" : "✓"} {reason.label}
    </span>
  ))}
</div>

                      </div>
                     
                   <details className="mt-5 bg-white border border-orange-100 rounded-[32px] p-5 shadow-lg">
  <summary className="cursor-pointer text-lg font-black text-gray-900">
    Score Breakdown
  </summary>

  <div className="mt-4 space-y-3">
    <div className="flex justify-between">
      <span>Nutrition Quality</span>
      <span className="font-bold text-green-600">
        {breakdown.nutrition}/40
      </span>
    </div>

    <div className="flex justify-between">
      <span>Ingredient Quality</span>
      <span className="font-bold text-green-600">
        {breakdown.ingredients}/25
      </span>
    </div>

    <div className="flex justify-between">
      <span>Additive Safety</span>
      <span className="font-bold text-green-600">
        {breakdown.additives}/15
      </span>
    </div>

    <div className="flex justify-between">
      <span>Processing Level</span>
      <span className="font-bold text-green-600">
        {breakdown.processing}/10
      </span>
    </div>

    <div className="flex justify-between">
      <span>Personalization</span>
      <span className="font-bold text-green-600">
        {breakdown.personalization}/10
      </span>
    </div>
  </div>
</details>

                      </div>

                 
{realAlternatives.length > 0 && (
  <section className="mt-6 rounded-[32px] border border-green-100 bg-white p-5 shadow-sm">
    <div className="mb-5">
      <p className="text-xs font-black uppercase tracking-wide text-green-600">
        Better Alternatives
      </p>

      <h3 className="heading-font text-2xl font-black text-gray-900 mt-1">
        Cleaner choices to try
      </h3>

      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
        A few product options that may be better choices based on available nutrition data.
      </p>
    </div>

    <div className="space-y-3">
      {realAlternatives.slice(0, 3).map((item, index) => (
        <div
          key={`${item.name}-${index}`}
          className="rounded-[24px] border border-orange-100 bg-orange-50/40 p-4"
        >
          <div className="flex items-center gap-4">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded-[20px] border border-orange-100 bg-white object-cover"
                unoptimized
              />
            ) : (
              <div className="h-[72px] w-[72px] rounded-[20px] border border-orange-100 bg-white" />
            )}

            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-base font-black text-gray-900 leading-snug">
                {item.name}
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-gray-500">
                {item.brand || "Brand unavailable"}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[20px] bg-white border border-orange-100 p-4">
            <p className="text-sm font-bold text-gray-700">
              Why it may be better
            </p>

            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
              Usually a cleaner option means lower processing, better ingredient quality,
              or a stronger nutrition profile compared with the scanned product.
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
)}
  

<div className="mt-6">
  <div className="mt-6 flex flex-col sm:flex-row gap-3">
  <button
    onClick={logFood}
    className="inline-flex justify-center rounded-[20px] bg-orange-500 px-6 py-4 text-white font-black"
  >
    Log Food
  </button>

  <Link
    href={`/product/${createSlug(product.name)}`}
    className="inline-flex justify-center rounded-[20px] bg-gray-900 px-6 py-4 text-white font-black"
  >
    View Full Analysis
  </Link>
</div>
</div>


                   {personalizedWarnings.length > 0 && (
  <div className="space-y-3 mb-6">
    {personalizedWarnings.map((warning, index) => (
      <div
        key={index}
        className={`rounded-[20px] border p-5 ${
          warning.level === "High"
            ? "bg-red-50 border-red-200 text-red-700"
            : "bg-yellow-50 border-yellow-200 text-yellow-700"
        }`}
      >
        <p className="font-black mb-2">{warning.title}</p>
        <p className="text-sm leading-relaxed">{warning.message}</p>
      </div>
    ))}
  </div>
)}

<details className="mt-5 bg-white rounded-[20px] border border-orange-100 p-5">
  <summary className="cursor-pointer font-black text-gray-900">
    Nutrition Details
  </summary>

<div className="grid grid-cols-2 md:grid-cols-5 gap-4">

  <div className="bg-orange-50 rounded-2xl p-3 md:p-4">
    <p className="text-xs text-gray-400">Calories</p>
    <p className="font-black text-orange-600">
      {product.calories || 0}
    </p>
  </div>

  <div className="bg-orange-50 rounded-2xl p-3 md:p-4">
    <p className="text-xs text-gray-400">Protein</p>
    <p className="font-black text-orange-600">
      {product.protein || 0}g
    </p>
  </div>

  <div className="bg-orange-50 rounded-2xl p-3 md:p-4">
    <p className="text-xs text-gray-400">Carbs</p>
    <p className="font-black text-orange-600">
      {product.carbs || 0}g
    </p>
  </div>

  <div className="bg-orange-50 rounded-2xl p-3 md:p-4">
    <p className="text-xs text-gray-400">Sugar</p>
    <p className="font-black text-orange-600">
      {product.sugar}g
    </p>
  </div>

  <div className="bg-orange-50 rounded-2xl p-3 md:p-4">
    <p className="text-xs text-gray-400">Fat</p>
    <p className="font-black text-orange-600">
      {product.fat}g
    </p>
  </div>

</div>

  <div className="mt-4">
    {/* your Good/Bad or risk section goes here */}
  </div>
</details>

                   <details className="mt-5 bg-white rounded-[20px] border border-orange-100 p-5">
  <summary className="cursor-pointer font-black text-gray-900">
    Why this score?
  </summary>

  {(healthAnalysis?.additiveInsights?.length ?? 0) > 0 && (
  <details className="mt-5 bg-white rounded-[] border border-orange-100 p-5">
    <summary className="cursor-pointer font-black text-gray-900">
      Additive Intelligence
    </summary>

    <div className="mt-4 space-y-4">
      {(healthAnalysis?.additiveInsights || []).map((item) => (
        <div
          key={item.code}
          className="rounded-[20px] border border-orange-100 bg-orange-50 p-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-black text-gray-900">
              {item.name} ({item.code})
            </h4>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                item.risk === "high"
                  ? "bg-red-100 text-red-700"
                  : item.risk === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {item.risk.toUpperCase()}
            </span>
          </div>

          <p className="text-sm text-gray-700 mt-3">
            <strong>Why?</strong> {item.reason}
          </p>

          <p className="text-sm text-gray-700 mt-2">
            <strong>Scientific View:</strong> {item.scientificView}
          </p>
        </div>
      ))}
    </div>
  </details>
)}

{loadingAlternatives && (
  <div className="mt-5 rounded-[20px] border border-orange-100 bg-white p-5">
    Finding healthier alternatives...
  </div>
)}

{alternatives.length > 0 && (
  <div className="mt-5 rounded-[20px] border border-green-100 bg-green-50 p-5">
    <h3 className="text-lg font-black text-green-700 mb-4">
      Healthier Alternatives
    </h3>

    <div className="space-y-3">
     {alternatives.map((item, index) => (
        <div
          key={`${item.name}-${index}`}
          className="bg-white rounded-xl border border-green-100 p-4"
        >
          <p className="font-bold text-gray-900">
            {item.name}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {item.reason}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

  <div className="mt-4 grid md:grid-cols-2 gap-4">
    <div className="rounded-[20px] bg-green-50 border border-green-100 p-5">
      <h4 className="font-black text-green-700 mb-3">
        Positives
      </h4>

      <ul className="space-y-2 text-sm text-green-800">
        {(healthAnalysis?.positives || ["No strong positive signals found."]).map(
          (item) => (
            <li key={item}>{item}</li>
          )
        )}
      </ul>
    </div>

    <div className="rounded-[20px] bg-red-50 border border-red-100 p-5">
      <h4 className="font-black text-red-700 mb-3">
        Warnings
      </h4>

      <ul className="space-y-2 text-sm text-red-800">
        {(healthAnalysis?.warnings || ["No major red flags detected."]).map(
          (item) => (
            <li key={item}>{item}</li>
          )
        )}
      </ul>
    </div>
  </div>
</details>



                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-[20px] p-4 border border-orange-100">
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

                      <div className="bg-white rounded-[20px] p-4 border border-orange-100">
                        <p className="text-xs text-gray-400 mb-1">Fat Risk</p>
                        <p className="font-black text-orange-600">
                          {product.fat > 20
                            ? "High"
                            : product.fat > 10
                            ? "Medium"
                            : "Low"}
                        </p>
                      </div>

                      <div className="bg-white rounded-[20px] p-4 border border-orange-100">
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

                      <div className="bg-white rounded-[20px] p-4 border border-orange-100">
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

                

<details className="mt-4 text-left bg-white rounded-[32px] border border-orange-100 p-5 shadow-sm">
  <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
    <span className="text-lg font-black text-gray-900">
      Ingredients
    </span>

    <svg
      className="w-4 h-4 text-orange-500 transition-transform duration-300 group-open:rotate-180"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  </summary>

  <div className="mt-4 bg-orange-50 rounded-[28px] border border-orange-100 p-5">
    <p className="text-gray-700 leading-relaxed">
      {product.ingredients}
    </p>
  </div>

  {ingredientInsights.length > 0 && (
    <details className="group mt-4 rounded-[28px] border border-orange-100 bg-white p-5">
      <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black text-orange-600 uppercase tracking-wide">
            Ingredient Analysis
          </p>
          <p className="text-lg font-black text-gray-900">
            AI Ingredient Intelligence
          </p>
        </div>

        <svg
          className="w-4 h-4 text-orange-500 transition-transform duration-300 group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>

      <div className="mt-5 rounded-[24px] bg-orange-50/70 border border-orange-100 p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-gray-500">Ingredient Quality</p>
            <h4 className="text-2xl font-black text-gray-900">
              {ingredientQuality}
            </h4>
          </div>

          <span className="rounded-full bg-white border border-orange-100 px-4 py-2 text-sm font-black text-orange-600">
            {ingredientInsights.length} detected
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-[20px] bg-white border border-red-100 p-4">
            <p className="text-xs text-red-500 font-bold">High</p>
            <p className="text-2xl font-black text-red-600">{highRiskIngredients}</p>
          </div>

          <div className="rounded-[20px] bg-white border border-yellow-100 p-4">
            <p className="text-xs text-yellow-600 font-bold">Medium</p>
            <p className="text-2xl font-black text-yellow-600">{mediumRiskIngredients}</p>
          </div>

          <div className="rounded-[20px] bg-white border border-green-100 p-4">
            <p className="text-xs text-green-600 font-bold">Low</p>
            <p className="text-2xl font-black text-green-600">{lowRiskIngredients}</p>
          </div>
        </div>

        <div className="space-y-4">
          {ingredientInsights.map((item, index) => (
            <details
              key={index}
              className="group rounded-[24px] border border-orange-100 bg-white p-5"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-black text-gray-900">
                    {item.ingredient}
                  </h4>

                  <p className="text-sm text-gray-500">
                    Tap to view explanation
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      item.info?.risk === "High"
                        ? "bg-red-50 text-red-600"
                        : item.info?.risk === "Medium"
                        ? "bg-yellow-50 text-yellow-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {item.info?.risk}
                  </span>

                  <svg
                    className="w-4 h-4 text-orange-500 transition-transform duration-300 group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>

              <div className="mt-5 space-y-4 text-sm leading-relaxed text-gray-700">
                <div>
                  <p className="font-black text-gray-900 mb-1">Why it matters</p>
                  <p>{item.info?.why}</p>
                </div>

                <div>
                  <p className="font-black text-gray-900 mb-1">Scientific view</p>
                  <p>{item.info?.scientificView}</p>
                </div>

                <div>
                  <p className="font-black text-gray-900 mb-1">Recommendation</p>
                  <p>{item.info?.recommendation}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </details>
  )}
</details>
                

                {detectedHarmful.length > 0 && (
  <details className="mt-4 text-left bg-red-50 border border-red-200 rounded-[32px] p-4">
    <summary className="cursor-pointer text-lg font-black text-red-700">
      Harmful Ingredients Detected
    </summary>

                      <div className="flex flex-wrap gap-3">
                        {detectedHarmful.map((ingredient, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 rounded-[20px] bg-white border border-red-200 text-red-700 font-semibold"
                          >
                            {ingredient}
                          </div>
                        ))}
                      </div>
                      </details>
                        )}



              
                {alternatives.length > 0 && (
                  <div className="mt-10 text-left">
                    <div className="bg-green-50 border border-green-200 rounded-[32px] p-4">
                      <h3 className="text-lg font-black text-green-700 mb-3">
                        Better Alternatives
                      </h3>

                      <div className="grid grid-cols-1 gap-3">
                        {alternatives.map((alternative, index) => (
  <div
    key={index}
    className="bg-white border border-green-200 rounded-[20px] p-5"
  >
    <div className="flex items-center justify-between gap-3 mb-3">
    <div className="flex items-center justify-between mb-2">
  <div>
    <p className="font-black text-gray-900">
      {alternative.name}
    </p>

    <p className="text-xs text-green-600 font-bold uppercase tracking-wide">
      {alternative.category}
    </p>
  </div>

  
</div>

    
    </div>

  <p className="text-sm text-gray-600 leading-relaxed mb-3">
  {alternative.reason}
</p>

<button
  className="w-full rounded-xl bg-green-600 text-white py-2 text-sm font-bold"
>
  Better Choice
</button>
  </div>
))}
                      </div>

                      <p className="mt-4 text-sm text-gray-700">
                        These alternatives are generally less processed and may
                        offer better nutritional value.

                         {realAlternatives.length > 0 && (
  <div className="mt-6">
    <h4 className="font-black text-green-700 mb-4">
      Real Product Alternatives
    </h4>

    <div className="space-y-3">
      {realAlternatives.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 bg-white border border-green-200 rounded-[20px] p-4"
        >
          {item.image && (
            <Image
              src={item.image}
              alt={item.name}
              width={64}
              height={64}
              className="rounded-xl object-cover"
              unoptimized
            />
          )}

          <div className="flex-1">
            <p className="font-black text-gray-900">
              {item.name}
            </p>

            <p className="text-sm text-gray-500">
              {item.brand}
            </p>
          </div>

          <div className="text-right">
            <p className="font-black text-green-600">
              {item.nutriscore?.toUpperCase()}
            </p>

            <p className="text-xs text-gray-400">
              NOVA {item.nova}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
  </>
)}
      

        {comparisons.length > 0 && (
  <div className="hidden md:block mt-10 text-left">
    <div className="bg-white border border-orange-100 rounded-[32px] p-8 shadow-xl">
      <h3 className="text-2xl font-black text-gray-900 mb-6">
        Product Comparison
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-orange-100">
              <th className="py-3 text-gray-500">Product</th>
              <th className="py-3 text-gray-500">Score</th>
              <th className="py-3 text-gray-500">Sugar</th>
              <th className="py-3 text-gray-500">Processing</th>
              <th className="py-3 text-gray-500">Verdict</th>
            </tr>
          </thead>

          <tbody>
            {comparisons.map((item) => (
              <tr key={item.name} className="border-b border-orange-50">
                <td className="py-4 font-black text-gray-900">
                  {item.name}
                </td>

                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-black ${
                      item.score >= 75
                        ? "bg-green-100 text-green-700"
                        : item.score >= 50
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.score}/100
                  </span>
                </td>

                <td className="py-4 text-gray-700">{item.sugar}</td>

                <td className="py-4 text-gray-700">
                  {item.processing}
                </td>

                <td className="py-4 text-gray-700">
                  {item.verdict}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                  className="bg-white rounded-[32px] border border-orange-100 p-5 shadow-lg"
                >
                  <button
                    onClick={() => setProduct(item)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <Image
  src={item.image}
  alt={item.name}
  width={80}
  height={80}
  className="rounded-[20px] object-cover border border-orange-100"
  unoptimized
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
         <details className="max-w-6xl mx-auto mt-8 bg-white rounded-[32px] border border-orange-100 shadow-xl p-6">
<div className="flex items-center justify-between mb-6">
              <summary className="cursor-pointer text-2xl font-black text-gray-900 list-none">
             Recent Scans
               </summary>

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
                  className="text-left bg-white rounded-[32px] border border-orange-100 p-5 shadow-lg hover: transition-all"
                >
                  <div className="flex items-start gap-3">
                    {item.image && (
                     <Image
  src={item.image}
  alt={item.name}
  width={64}
  height={64}
  className="rounded-[20px] object-cover border border-orange-100"
  unoptimized
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
         </details>
        )}
      </section>
      

      <section className="mt-24 max-w-5xl mx-auto px-4 sm:px-6 text-left">
  <div className="p-0">
    <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
      Scientific Methodology
    </p>

    <h2 className="heading-font text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-5">
      Built on transparent food science, not guesswork.
    </h2>

    <p className="max-w-4xl text-lg text-gray-500 leading-relaxed">
      PAUSTICA explains food quality using nutrition data, processing level,
      ingredient risk, additive evidence, and personalized health goals. Every
      warning is designed to be understandable, balanced, and traceable to
      trusted scientific or regulatory sources.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
      <div className="rounded-[32px] bg-orange-50 border border-orange-100 p-6">
        <p className="text-4xl font-black text-orange-600 mb-3">60%</p>
        <h3 className="text-xl font-black text-gray-900 mb-2">
          Nutrition Quality
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Sugar, salt, fat, calories, protein, and nutrition balance.
        </p>
      </div>

      <div className="rounded-[32px] bg-red-50 border border-red-100 p-6">
        <p className="text-4xl font-black text-red-600 mb-3">30%</p>
        <h3 className="text-xl font-black text-gray-900 mb-2">
          Ingredient Risk
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Additives, preservatives, artificial sweeteners, colors, and risky
          ingredient signals.
        </p>
      </div>

      <div className="rounded-[32px] bg-green-50 border border-green-100 p-6">
        <p className="text-4xl font-black text-green-600 mb-3">10%</p>
        <h3 className="text-xl font-black text-gray-900 mb-2">
          Processing Context
        </h3>
        <p className="text-gray-600 leading-relaxed">
          NOVA processing level, product completeness, and goal-based adjustment.
        </p>
      </div>
    </div>
  </div>
</section>

<section className="mt-24 max-w-6xl mx-auto px-4 sm:px-6 text-left">
  <div className="p-0">
    <div className="max-w-3xl">
      <p className="text-sm font-black text-orange-400 uppercase tracking-wide mb-3">
        Why PAUSTICA is Different
      </p>

      <h2 className="heading-font text-3xl sm:text-5xl font-black text-gray tracking-tight mb-5">
        Food labels show data. PAUSTICA explains what it means.
      </h2>

      <p className="text-lg text-gray-500 leading-relaxed">
        Most people see calories, sugar, salt, additives, and ingredients — but
        still do not know whether a product is actually good for them.
        PAUSTICA turns confusing food labels into simple, personalized health
        intelligence.
      </p>
    </div>
    

   <div className="mt-10 relative">
  <div
    ref={carouselRef}
    onScroll={() => {
      const slider = carouselRef.current;
      if (!slider) return;

      const slideWidth = slider.scrollWidth / differenceSlides.length;
      const index = Math.round(slider.scrollLeft / slideWidth);
      setActiveSlide(Math.min(index, differenceSlides.length - 1));
    }}
    className="overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    <div className="flex gap-6">
      {differenceSlides.map((item, index) => (
        <div
          key={item.title}
          className="relative min-w-[86%] sm:min-w-[460px] snap-center overflow-hidden rounded-[36px] border border-orange-100 bg-white p-7 sm:p-9 shadow-2xl"
        >
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-100 blur-2xl" />

          <div className="relative z-10">
            <div className="mb-8 flex items-center justify-between">
              <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-orange-600 border border-orange-100">
                {item.tag}
              </span>

              <span className="text-5xl font-black text-orange-100">
                0{index + 1}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-4">
              {item.title}
            </h3>

            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>

  <div className="mt-4 flex items-center justify-center gap-4">
   

    <div className="flex gap-2">
      {differenceSlides.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollToSlide(index)}
          className={`h-2.5 rounded-full transition-all ${
            activeSlide === index
              ? "w-8 bg-orange-500"
              : "w-2.5 bg-orange-200"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>

   
  </div>

</div>
  </div>
</section>

<section className="mt-16 max-w-5xl mx-auto px-4 sm:px-6">
  <details className="group bg-white rounded-[36px] border border-orange-100 shadow-xl overflow-hidden">

    <summary className="cursor-pointer list-none p-8 flex items-center justify-between">

      <div>
        <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-2">
          Product Walkthrough
        </p>

        <h2 className="text-3xl font-black text-gray-900">
          How PAUSTICA Works
        </h2>

        <p className="mt-2 text-gray-500">
          Understand how your food is analyzed in seconds.
        </p>
      </div>

      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-orange-100 text-orange-600 transition-transform duration-300 group-open:rotate-180">
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M19 9l-7 7-7-7"
    />
  </svg>
</span>

    </summary>

    <div className="px-8 pb-8">

      <div className="grid md:grid-cols-4 gap-5">

        <div className="rounded-[32px] bg-orange-50 border border-orange-100 p-5">
          <div className="text-3xl font-black text-orange-600 mb-3">
            01
          </div>

          <h3 className="font-black text-gray-900 mb-2">
            Scan or Search
          </h3>

          <p className="text-gray-600">
            Scan a barcode or search a product manually.
          </p>
        </div>

        <div className="rounded-[32px] bg-orange-50 border border-orange-100 p-5">
          <div className="text-3xl font-black text-orange-600 mb-3">
            02
          </div>

          <h3 className="font-black text-gray-900 mb-2">
            AI Analysis
          </h3>

          <p className="text-gray-600">
            Ingredients, additives, nutrition and processing are analyzed.
          </p>
        </div>

        <div className="rounded-[32px] bg-orange-50 border border-orange-100 p-5">
          <div className="text-3xl font-black text-orange-600 mb-3">
            03
          </div>

          <h3 className="font-black text-gray-900 mb-2">
            Health Score
          </h3>

          <p className="text-gray-600">
            A personalized score is generated based on your health goal.
          </p>
        </div>

        <div className="rounded-[32px] bg-orange-50 border border-orange-100 p-5">
          <div className="text-3xl font-black text-orange-600 mb-3">
            04
          </div>

          <h3 className="font-black text-gray-900 mb-2">
            Better Choices
          </h3>

          <p className="text-gray-600">
            Get healthier alternatives and clear explanations.
          </p>
        </div>
      
      <div className="mt-8 text-center">
  <button
    onClick={() => setShowDemo(!showDemo)}
    className="px-6 py-4 rounded-[20px] bg-orange-500 text-white font-bold shadow-lg hover:scale-105 transition"
  >
    {showDemo ? "Hide Sample Analysis" : "View Sample Analysis"}
  </button>
</div>

{showDemo && (
  <div className="mt-8 rounded-[32px] border border-orange-100 bg-orange-50 p-6">

    <div className="grid md:grid-cols-3 gap-5">

      <div className="bg-white rounded-[32px] p-5 border border-orange-100">
        <p className="text-sm text-gray-500 mb-2">
          Sample Product
        </p>

        <h3 className="text-xl font-black text-gray-900">
          Cola Soft Drink
        </h3>

        <p className="text-gray-500 mt-2">
          Ultra-processed carbonated beverage
        </p>
      </div>

      <div className="bg-red-50 rounded-[32px] p-5 border border-red-100">
        <p className="text-sm text-gray-500 mb-2">
          AI Health Score
        </p>

        <div className="text-6xl font-black text-red-600">
          38
        </div>

        <p className="font-black text-red-700 mt-2">
          Avoid Often
        </p>
      </div>

      <div className="bg-green-50 rounded-[32px] p-5 border border-green-100">
        <p className="text-sm text-gray-500 mb-2">
          Better Alternative
        </p>

        <h3 className="font-black text-green-700">
          Sparkling Water
        </h3>

        <p className="text-gray-600 mt-2">
          Lower sugar and less processed.
        </p>
      </div>

    </div>

  </div>
)}
      
      </div>
    </div>

  </details>
</section>  

<section className="mt-24 max-w-6xl mx-auto px-4 sm:px-6 text-left">
  <div className="p-0">
    <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
      User Outcomes
    </p>

    <h2 className="heading-font text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-5">
      Make better food choices without overthinking.
    </h2>

    <p className="max-w-3xl text-lg text-gray-500 leading-relaxed mb-10">
      PAUSTICA helps users quickly understand what they are buying, why it
      matters, and what they can choose instead.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        {
          title: "Avoid misleading labels",
          text: "See beyond claims like natural, low-fat, or zero sugar by checking ingredients and processing.",
        },
        {
          title: "Understand risky ingredients",
          text: "Know why additives, sweeteners, preservatives, and colors may matter for your health goals.",
        },
        {
          title: "Find better alternatives",
          text: "Replace highly processed products with cleaner options when available.",
        },
      ].map((item) => (
        <div
          key={item.title}
          className="py-4"
        >
          <h3 className="text-xl font-black text-gray-900 mb-2">
            <div className="w-12 h-1 rounded-full bg-orange-500 mb-4" />
            {item.title}
          </h3>

          <p className="text-gray-600 leading-relaxed">
            {item.text}
          </p>
        </div>
      ))}
    </div>
    <div className="mt-8 text-center">
  <button
    onClick={() => setShowScoreFactors(!showScoreFactors)}
    className="px-6 py-4 rounded-[20px] bg-gray-900 text-white font-bold shadow-lg hover:scale-105 transition"
  >
    {showScoreFactors
      ? "Hide Score Factors"
      : "How Scores Are Calculated"}
  </button>
</div>

{showScoreFactors && (
  <div className="mt-8 grid md:grid-cols-5 gap-4">

    <div className="rounded-[28px] bg-white p-5 shadow-sm">
      <h3 className="font-black text-gray-900 mb-2">
        Sugar
      </h3>

      <p className="text-gray-600 text-sm">
        Higher sugar levels can lower the health score.
      </p>
    </div>

    <div className="rounded-[28px] bg-white p-5 shadow-sm">
      <h3 className="font-black text-gray-900 mb-2">
        Salt
      </h3>

      <p className="text-gray-600 text-sm">
        Excess sodium may reduce nutritional quality.
      </p>
    </div>

    <div className="rounded-[28px] bg-white p-5 shadow-sm">
      <h3 className="font-black text-gray-900 mb-2">
        Fat
      </h3>

      <p className="text-gray-600 text-sm">
        Certain fat levels influence the overall score.
      </p>
    </div>

    <div className="rounded-[28px] bg-white p-5 shadow-sm">
      <h3 className="font-black text-gray-900 mb-2">
        Processing
      </h3>

      <p className="text-gray-600 text-sm">
        Ultra-processed foods generally score lower.
      </p>
    </div>

    <div className="rounded-[28px] bg-white p-5 shadow-sm">
      <h3 className="font-black text-gray-900 mb-2">
        Ingredients
      </h3>

      <p className="text-gray-600 text-sm">
        Additives and ingredient quality affect ratings.
      </p>
    </div>

  </div>
)}

  </div>
</section>

<section className="mt-24 max-w-6xl mx-auto px-4 sm:px-6 text-left">
  <div className="rounded-[36px] bg-gray-950 p-6 sm:p-10 shadow-xl">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div>
        <p className="text-sm font-black text-orange-400 uppercase tracking-wide mb-3">
          PAUSTICA Premium
        </p>

        <h2 className="heading-font text-3xl sm:text-5xl font-black text-white tracking-tight mb-5">
          Unlock deeper food intelligence.
        </h2>

        <p className="text-lg text-gray-300 leading-relaxed">
          Go beyond basic scans with unlimited analysis, deeper personalization,
          smarter alternatives, and advanced nutrition reports.
        </p>
      </div>

      <div className="rounded-[32px] bg-white border border-white/10 p-6">
        <div className="space-y-4">
          {[
            "Unlimited product scans",
            "Advanced ingredient intelligence",
            "Personalized health goal reports",
            "Smarter healthy alternatives",
            "Family and daily food history insights",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="h-6 w-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black">
                ✓
              </span>

              <p className="font-bold text-gray-800">{item}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setUpgradeOpen(true)}
          className="mt-8 w-full rounded-[20px] bg-orange-500 px-6 py-4 text-white font-black shadow-lg hover:scale-[1.02] transition"
        >
          Upgrade to Premium
        </button>
      </div>
    </div>
  </div>
</section>


<section className="mt-24 max-w-5xl mx-auto px-4 sm:px-6 text-center">
  <div className="p-0">
    <h2 className="heading-font text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-5">
      Ready to know what you’re eating?
    </h2>

    <p className="max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed mb-8">
      Scan a barcode, search a product, and get instant food intelligence before
      you decide what to buy.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setScannerOpen(true);
        }}
        className="px-8 py-5 rounded-[20px] text-white font-black shadow-xl"
        style={{
          background: "linear-gradient(135deg, #f97316, #ea580c)",
        }}
      >
        Start Scanning
      </button>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="px-8 py-5 rounded-[20px] bg-orange-50 border border-orange-100 text-orange-600 font-black"
      >
        Search a Product
      </button>
    </div>
  </div>
</section>


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

<footer className="mt-20 border-t border-orange-100 bg-white">
  <div className="max-w-7xl mx-auto px-6 py-12">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <p className="text-xl font-black text-gray-900">
          PAUSTICA
        </p>
        <p className="mt-3 max-w-sm text-sm text-gray-500 leading-relaxed">
          Food intelligence made simple for everyday choices.
        </p>
      </div>

      <div>
        <p className="text-sm font-black text-gray-900 mb-4">
          Product
        </p>
        <div className="space-y-3 text-sm font-bold text-gray-500">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="block hover:text-orange-500 transition"
          >
            Scanner
          </button>
          <Link href="/dashboard" className="block hover:text-orange-500 transition">
            Dashboard
          </Link>
          <button
            onClick={() => setUpgradeOpen(true)}
            className="block hover:text-orange-500 transition"
          >
            Premium
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm font-black text-gray-900 mb-4">
          Support
        </p>
        <div className="space-y-3 text-sm font-bold text-gray-500">
          <Link href="/trust" className="block hover:text-orange-500 transition">
            Got a Question?
          </Link>
          <a
            href="mailto:banothpradeep0203@gmail.com"
            className="block hover:text-orange-500 transition"
          >
            Contact
          </a>
          <Link href="/trust#privacy" className="block hover:text-orange-500 transition">
            Privacy & Terms
          </Link>
        </div>
      </div>
    </div>

    <div className="mt-10 border-t border-orange-100 pt-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-400">
      <p>© 2026 PAUSTICA. All rights reserved.</p>
      <p>Made for smarter food decisions.</p>
    </div>
  </div>
</footer>

{upgradeOpen && (
  <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6">
    <div className="bg-white max-w-lg w-full rounded-[32px] p-8 shadow-2xl">
      <h2 className="heading-font text-xl font-black text-gray-900 mb-3">
        PAUSTICA Premium
      </h2>

      <p className="text-gray-500 mb-6">
      You've used {dailyScansUsed} / {FREE_DAILY_SCAN_LIMIT} free scans today. Upgrade to unlock unlimited scans, AI coach, weekly reports and advanced analysis.
      </p>

      <div className="space-y-3 mb-8">
        <div>✓ Unlimited Scans</div>
        <div>✓ AI Food Coach</div>
        <div>✓ Weekly Reports</div>
        <div>✓ Advanced Ingredient Analysis</div>
        <div>✓ Family Profiles</div>
      </div>

      <button
        className="w-full py-4 rounded-[20px] bg-orange-500 text-white font-black mb-3"
      >
        Coming Soon
      </button>

      <button
        onClick={() => setUpgradeOpen(false)}
        className="w-full py-4 rounded-[20px] bg-gray-100 text-gray-700 font-bold"
      >
        Close
      </button>
    </div>
  </div>
)}
{profileOpen && (
  <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6">
<div className="bg-white max-w-lg w-full max-h-[85vh] overflow-y-auto rounded-[36px] p-6 sm:p-8 shadow-xl">
    <div className="sticky top-0 bg-white z-20 flex justify-between items-start pb-4 border-b border-gray-100 mb-6">
  <div>

    <h2 className="heading-font text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-5">
      Health Profile
    </h2>

   
  </div>

  <button
    onClick={() => setProfileOpen(false)}
    className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50"
  >
    ✕
  </button>
</div>
      <p className="text-gray-500 mb-6">
        Personalize PAUSTICA recommendations based on your body and goal.
      </p>

     <div className="mb-5">
  <div className="flex items-center justify-between">
    <div>

<div className="mb-6 bg-white p-0">
  <div className="flex items-center justify-between mb-4">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
        Body Insights
      </p>
     
    </div>

   
  </div>

  <div className="space-y-4">
   <div className="rounded-3xl bg-orange-50 p-4">
      <p className="text-xs font-bold text-gray-400 mb-2">
        BMI
      </p>

      <p className="text-5xl font-black text-gray-900 leading-none">
        {bmi > 0 ? bmi.toFixed(1) : "—"}
      </p>

      <p className="mt-2 text-xs font-black text-green-500">
        {bmiCategory}
      </p>
    </div>

   <div className="bg-gray-50 rounded-3xl p-6">
  <p className="text-sm font-bold text-gray-400 mb-2">
    Daily Calorie Target
  </p>

  <p className="text-5xl font-black text-gray-900">
    {dailyCalorieTarget}
  </p>

  <p className="text-sm font-bold text-orange-500">
    kcal/day
  </p>


     
    </div>
  </div>
</div>

      <p className="text-sm text-gray-500 font-semibold">
        Current Goal
      </p>

      <p className="text-2xl font-black text-gray-900">
        {selectedGoal}
      </p>
    </div>

    
  </div>

  <div className="grid grid-cols-3 gap-3 mt-5">
    <div className="bg-orange-50 rounded-2xl p-3">
      <p className="text-xs text-gray-400">Scans</p>
      <p className="font-black text-gray-900">{totalScans}</p>
    </div>

    <div className="bg-orange-50 rounded-2xl p-3">
      <p className="text-xs text-gray-400">Streak</p>
      <p className="font-black text-gray-900">{currentStreak}</p>
    </div>

  </div>
</div>

      <div className="space-y-4">
       
       <div className="bg-gray-50 rounded-[32px] p-5 mb-4">

  <label className="block text-sm font-bold text-gray-500 mb-3">
    Age
  </label>
        <input value={userAge} onChange={(e) => setUserAge(e.target.value)} placeholder="Age" className="w-full px-5 py-4 rounded-[20px] border border-orange-100 bg-orange-50 outline-none font-bold" />
       </div>

       <div className="bg-gray-50 rounded-[32px] p-5  mb-4">

  <label className="block text-sm font-bold text-gray-500 mb-3">
    Weight
  </label>

        <input value={userWeight} onChange={(e) => setUserWeight(e.target.value)} placeholder="Weight in kg" className="w-full px-5 py-4 rounded-[20px] border border-orange-100 bg-orange-50 outline-none font-bold" />
       </div>
       
        <div className="bg-gray-50 rounded-[32px] p-5  mb-4">

  <label className="block text-sm font-bold text-gray-500 mb-3">
    Height
  </label>
        <input value={userHeight} onChange={(e) => setUserHeight(e.target.value)} placeholder="Height in cm" className="w-full px-5 py-4 rounded-[20px] border border-orange-100 bg-orange-50 outline-none font-bold" />
            </div>


        {bmi > 0 && (
          <div className="rounded-[20px] bg-orange-50 border border-orange-100 p-5">
            <p className="text-sm font-bold text-gray-500 mb-1">Estimated BMI</p>
            <p className="text-3xl font-black text-gray-900">{bmi.toFixed(1)}</p>
            <p className="text-sm font-bold text-orange-600 mt-1">{bmiCategory}</p>
          </div>
        )}

       <details className="rounded-[32px] bg-gray p-5">
  <summary className="cursor-pointer font-black text-gray-900">
    Achievements
  </summary>

          <div className="space-y-3">
            {achievements.map((achievement) => {
              const percent = Math.round((achievement.current / achievement.target) * 100);
              const unlocked = achievement.current >= achievement.target;

              return (
                <div key={achievement.title} className="rounded-[20px] p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-gray-900">{achievement.title}</p>
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${unlocked ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>
                      {unlocked ? "Completed" : `${percent}%`}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-2">
                    {achievement.current} / {achievement.target}
                  </p>

                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
      </details>
      </div>

      <button
        onClick={async () => {
          if (userId) {
            await supabase.from("profiles").upsert({
              id: userId,
              age: Number(userAge),
              weight: Number(userWeight),
              height: Number(userHeight),
              health_goal: selectedGoal,
            });
          }

          setProfileOpen(false);
        }}
className="w-full mt-6 py-4 rounded-[20px] bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black shadow-lg" 
>
        Save Profile
      </button>

      <button
        onClick={() => setProfileOpen(false)}
        className="mt-3 w-full py-4 rounded-[20px] bg-gray-100 text-gray-700 font-bold"
      >
        Close
      </button>
    </div>
  </div>
)}

</main>
    
  );
}