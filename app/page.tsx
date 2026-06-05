"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
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
import posthog from "posthog-js";
import { getPersonalizedWarning } from "../lib/getPersonalizedWarning";
import Image from "next/image";


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
  const [isFetching, setIsFetching] = useState(false);

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

  const fetchSuggestions = async (query: string) => {
  if (query.length < 2) {
    setSuggestions([]);
    return;
  }

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&search_simple=1&action=process&json=1&page_size=5`
    );

    const data = await res.json();

    setSuggestions(data.products || []);
  } catch {
    setSuggestions([]);
  }
};

  useEffect(() => {
  const timer = setTimeout(() => {
    fetchSuggestions(searchQuery);
  }, 400);

  return () => clearTimeout(timer);
}, [searchQuery]);

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
  posthog.capture("homepage_loaded");
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

  const alternatives = product?.name ? getAlternatives(product.name) : [];
  const comparisons = product?.name
  ? getProductComparisons(product.name)
  : [];
  
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

const breakdown = product
  ? getScoreBreakdown(
      product.sugar,
      product.fat,
      product.salt,
      Number(product.nova),
      ingredientInsights.length
    )
  : {
      sugarImpact: 0,
      fatImpact: 0,
      saltImpact: 0,
      processingImpact: 0,
      additiveImpact: 0,
      totalImpact: 0,
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
       
      const personalizedWarning = product
  ? getPersonalizedWarning(
      selectedGoal,
      product.sugar,
      product.fat,
      product.salt,
      Number(product.nova),
      ingredientInsights.length
    )
  : null;

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

  

  const fetchedProduct: Product = {
    id: 0,
    name: String(item.product_name ?? "Unknown Product"),
    brand: String(item.brands ?? "Unknown Brand"),
    image: String(item.image_front_url ?? ""),
    ingredients: String(item.ingredients_text ?? "Ingredients unavailable"),
    nutriscore: String(item.nutriscore_grade ?? "unknown"),
    nova: String(item.nova_group ?? "N/A"),
    sugar: Number(
  (item as any).nutriments?.sugars_100g ?? 0
),

fat: Number(
  (item as any).nutriments?.fat_100g ?? 0
),

salt: Number(
  (item as any).nutriments?.salt_100g ?? 0
),
  };

  setProduct(fetchedProduct);
  posthog.capture("barcode_scan_success", {
  product_name: fetchedProduct.name,
  brand: fetchedProduct.brand,
});
  recordScanToday(); 
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

    const searchProduct = async () => {
  if (!searchQuery.trim()) return;
  posthog.capture("product_search_started", {
  query: searchQuery,
});
  if (!canScanToday()) {
    posthog.capture("premium_modal_opened");
    setUpgradeOpen(true);
    setLoading(false);
  return;
}

  setLoading(true);

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        searchQuery
      )}&search_simple=1&action=process&json=1&page_size=8`
    );

    const data = await res.json();
    const results = data.products || [];

    if (results.length === 0) {
      alert("No product found. Try a more specific name.");
      setSearchResults([]);
      return;
    }

    setSearchResults(results);
    setSuggestions([]);
    setScannerOpen(false);
    setProduct(null);
  } catch (error) {
    console.log(error);
    alert("Search failed. Please try again.");
  }

  setLoading(false);
};

   const canScanToday = () => {
  const today = new Date().toISOString().split("T")[0];
  const saved = localStorage.getItem("paustica_daily_scans");

  if (!saved) {
    return true;
  }

  const data = JSON.parse(saved);

  if (data.date !== today) {
    return true;
  }

  return data.count < FREE_DAILY_SCAN_LIMIT;
};

const recordScanToday = () => {
  const today = new Date().toISOString().split("T")[0];
  const saved = localStorage.getItem("paustica_daily_scans");

  if (!saved) {
    localStorage.setItem(
      "paustica_daily_scans",
      JSON.stringify({ date: today, count: 1 })
    );

    setDailyScansUsed(1);
    return;
  }

  const data = JSON.parse(saved);

  if (data.date !== today) {
    localStorage.setItem(
      "paustica_daily_scans",
      JSON.stringify({ date: today, count: 1 })
    );

    setDailyScansUsed(1);
    return;
  }

  const newCount = data.count + 1;

  localStorage.setItem(
    "paustica_daily_scans",
    JSON.stringify({ date: today, count: newCount })
  );

  setDailyScansUsed(newCount);
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

    if (!canScanToday()) {
     posthog.capture("premium_modal_opened");
     setUpgradeOpen(true);
      setLoading(false);
    setScannerOpen(false);
    return;
    }

  const cached = localStorage.getItem(`product_${finalBarcode}`);

  if (cached) {
    const cachedProduct = JSON.parse(cached);

    setProduct(cachedProduct);
    setScannerOpen(false);
    setLoading(false);
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${finalBarcode}`
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

      localStorage.setItem(
        `product_${finalBarcode}`,
        JSON.stringify(fetchedProduct)
      );

      setScannerOpen(false);
      setProduct(fetchedProduct);

      await saveHistory(fetchedProduct);
    } else {
  setProduct(null);
  alert("Product not found in database. Try another barcode or enter product details manually.");
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

    <MobileMenu loggedIn={!!userEmail} onLogout={logout} />

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

          <button
  onClick={() => setProfileOpen(true)}
  className="rounded-full px-5 py-3 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100"
>
  Health Profile
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

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20 text-center">
      <Image
  src="/logo.png"
  alt="PAUSTICA"
  width={96}
  height={96}
  className="mx-auto mb-6 object-contain"
/>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-[-0.04em] leading-[0.95] text-gray-900 mb-6">
          Know what's really
<br />
<span
  style={{
    background:
      "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  inside your food
</span>
        </h1>

        <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-gray-500 mb-12">
          Scan packaged foods and instantly understand health risks, additives,
          processing levels, and better alternatives.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
          <button
            onClick={() => {
             posthog.capture("scanner_opened");
             setScannerOpen(true);
            }}
            className="px-8 py-5 rounded-2xl text-white font-bold text-lg shadow-xl"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
            }}
          >
            Open Camera Scanner
          </button>

          <button
            onClick={() => {
  posthog.capture("scanner_opened");
  setScannerOpen(true);
}}
              className="..."
               >
               Scan Product
               </button> 
          <input
  value={barcode}
  onChange={(e) => setBarcode(e.target.value)}
  placeholder="Enter barcode manually"
  className="px-6 py-5 rounded-2xl bg-white border border-orange-100 text-gray-900 font-bold outline-none"
/>

       <button
        disabled={loading}
        onClick={() => fetchProduct()}
        className="px-8 py-5 rounded-2xl bg-gray-900 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
        {loading ? "Analyzing..." : "Analyze Barcode"}
           </button>
        </div> 

        <div className="max-w-2xl mx-auto mt-6">
  <div className="flex flex-col sm:flex-row gap-3">
    <input
      value={searchQuery}
     onChange={(e) => {
  setSearchQuery(e.target.value);
}}
      onKeyDown={(e) => {
 if (e.key === "Enter") {
  setSuggestions([]);
  searchProduct();
}
}}
      placeholder="Search product name..."
      className="flex-1 px-6 py-4 rounded-2xl border border-orange-100 bg-white outline-none font-medium"
    />

    <button
  disabled={loading}
  onClick={searchProduct}
  className="px-6 py-4 rounded-2xl bg-orange-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? "Searching..." : "Search"}
</button>
  </div>
</div>
  {searchResults.length > 0 && !product && (
  <div className="max-w-4xl mx-auto mt-8 bg-white rounded-[32px] border border-orange-100 shadow-xl p-6 text-left">
    <h2 className="text-2xl font-black text-gray-900 mb-5">
      Search Results
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {searchResults.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            analyzeSelectedProduct(item);
            setSearchResults([]);
          }}
          className="flex items-center gap-4 text-left p-4 rounded-2xl border border-orange-100 hover:bg-orange-50 transition"
        >
          {item.image_front_url && (
            <Image
  src={item.image_front_url}
  alt={item.product_name}
  width={64}
  height={64}
  className="rounded-xl object-cover border border-orange-100"
  unoptimized
/>
          )}

          <div>
            <h3 className="font-black text-gray-900 line-clamp-2">
              {item.product_name || "Unknown Product"}
            </h3>

            <p className="text-sm text-gray-400">
              {item.brands || "Unknown Brand"}
            </p>
          </div>
        </button>
      ))}
    </div>
  </div>
)}

  <p className="mt-4 text-sm text-gray-500 font-medium">
  {dailyScansUsed} / {FREE_DAILY_SCAN_LIMIT} scans used today
</p>

        {scannerOpen && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-[32px] border border-orange-100 shadow-2xl mb-10">
           <BarcodeScanner
              onScan={(code) => {
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

        {loading && (
          <div className="mt-10">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-500 font-medium">
              AI analyzing product...
            </p>
          </div>
        )}
         
         {!product && !loading && !scannerOpen && (
  <div className="mt-10 max-w-2xl mx-auto bg-white rounded-[32px] border border-orange-100 shadow-xl p-8">
    <h2 className="text-2xl font-black text-gray-900 mb-3">
      Ready to analyze your food
    </h2>

    <p className="text-gray-500 mb-6">
      Open the scanner or enter a barcode manually to get instant health insights.
    </p>

    <button
      onClick={() => setScannerOpen(true)}
      className="px-8 py-4 rounded-2xl text-white font-bold shadow-lg"
      style={{
        background: "linear-gradient(135deg, #f97316, #ea580c)",
      }}
    >
      Start Scanning
    </button>
  </div>
)}

        {product && !loading && (
          <div className="mt-10 w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-[32px] shadow-2xl border border-orange-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />

              <div className="p-8">
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
                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                  {product.image && (
                   <Image
    src={product.image}
    alt={product.name}
  width={140}
  height={140}
  className="mx-auto md:mx-0 object-cover rounded-3xl border border-orange-100 shadow-md"
  unoptimized
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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

<div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
  <p className="text-xs text-gray-400 mb-1">
    Data Quality
  </p>

  <p
    className={`text-2xl font-black ${
      confidence.label === "Excellent" || confidence.label === "Good"
        ? "text-green-600"
        : confidence.label === "Fair"
        ? "text-yellow-600"
        : "text-red-600"
    }`}
  >
    {confidence.label}
  </p>

  <p className="text-xs text-gray-400 mt-1">
    {confidence.score}% complete
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
                    <div className="flex flex-col md:flex-row gap-6 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 font-semibold">
                          AI Health Score
                        </p>

                        <h3 className="text-5xl font-black text-gray-900">
                          {healthScore}/100
                        </h3>
                      </div>
                      <div className="mt-6 rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6">
  <p className="text-sm font-black uppercase tracking-wider text-orange-600 mb-2">
    Premium Insights
  </p>

  {isPremium ? (
    <div className="space-y-2 text-sm text-gray-700">
      <p>✓ Personalized nutrition analysis</p>
      <p>✓ Ingredient risk breakdown</p>
      <p>✓ Better product alternatives</p>
      <p>✓ Weekly health reports</p>
    </div>
  ) : (
    <>
      <p className="text-gray-500 mb-4">
        Unlock advanced nutrition intelligence and personalized recommendations.
      </p>

      <button
  onClick={() => setUpgradeOpen(true)}
  className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-bold"
>
  Upgrade to Premium
</button>
    </>
  )}
</div>
                      <div className="mt-6 bg-white border border-orange-100 rounded-3xl p-6 shadow-lg">
  <h3 className="text-xl font-black text-gray-900 mb-4">
    Score Breakdown
  </h3>

  <div className="space-y-3">
    <div className="flex justify-between">
      <span>Sugar Impact</span>
      <span className="font-bold text-red-500">
        -{breakdown.sugarImpact}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Fat Impact</span>
      <span className="font-bold text-red-500">
        -{breakdown.fatImpact}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Salt Impact</span>
      <span className="font-bold text-red-500">
        -{breakdown.saltImpact}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Processing Impact</span>
      <span className="font-bold text-red-500">
        -{breakdown.processingImpact}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Additives Impact</span>
      <span className="font-bold text-red-500">
        -{breakdown.additiveImpact}
      </span>
    </div>

    <hr className="my-3" />

    <div className="flex justify-between text-lg">
      <span className="font-black">Total Impact</span>
      <span className="font-black text-red-600">
        -{breakdown.totalImpact}
      </span>
    </div>
  </div>
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

                    {personalizedWarning && (
  <div
    className={`mb-6 rounded-2xl border p-5 ${
      personalizedWarning.level === "High"
        ? "bg-red-50 border-red-200 text-red-700"
        : "bg-yellow-50 border-yellow-200 text-yellow-700"
    }`}
  >
    <p className="font-black mb-2">
      {personalizedWarning.title}
    </p>

    <p className="text-sm leading-relaxed">
      {personalizedWarning.message}
    </p>
  </div>
)}

                    <div className="mt-5 bg-white rounded-2xl border border-orange-100 p-5">
  <p className="font-black text-gray-900 mb-2">
    Why this score?
  </p>

  <ul className="space-y-2 text-gray-700">
    {product.sugar > 15 && <li>High sugar content reduces the score.</li>}
    {product.salt > 1.5 && <li>High salt level may not be ideal for daily intake.</li>}
    {product.fat > 20 && <li>High fat content increases calorie density.</li>}
    {Number(product.nova) >= 4 && <li>Ultra-processed food lowers the health rating.</li>}
    {ingredientInsights.length > 0 && <li>Detected additives or risky ingredients affect the score.</li>}
    {product.sugar <= 15 &&
      product.salt <= 1.5 &&
      product.fat <= 20 &&
      Number(product.nova) < 4 &&
      ingredientInsights.length === 0 && (
        <li>No major red flags detected from available data.</li>
      )}
  </ul>
</div>

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

<div className="mt-4 bg-white rounded-2xl border border-orange-100 p-5 text-left">
  <p className="font-black text-gray-900 mb-3">
    Data Availability
  </p>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
    <div>{confidence.checks.image ? "Available" : "Missing"} Image</div>
    <div>{confidence.checks.ingredients ? "Available" : "Missing"} Ingredients</div>
    <div>{confidence.checks.nutriscore ? "Available" : "Missing"} NutriScore</div>
    <div>{confidence.checks.nova ? "Available" : "Missing"} NOVA</div>
    <div>{confidence.checks.nutrition ? "Available" : "Missing"} Nutrition</div>
  </div>
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

                      <div className="mb-6 bg-white border border-blue-100 rounded-3xl p-6">
  <p className="text-sm font-bold text-gray-500 mb-2">
    Ingredient Quality
  </p>

  <h4 className="text-3xl font-black text-gray-900 mb-4">
    {ingredientQuality}
  </h4>

  <div className="grid grid-cols-3 gap-3">
    <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
      <p className="text-xs text-red-400 font-bold">High Risk</p>
      <p className="text-2xl font-black text-red-600">
        {highRiskIngredients}
      </p>
    </div>

    <div className="rounded-2xl bg-yellow-50 border border-yellow-100 p-4">
      <p className="text-xs text-yellow-500 font-bold">Medium Risk</p>
      <p className="text-2xl font-black text-yellow-600">
        {mediumRiskIngredients}
      </p>
    </div>

    <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
      <p className="text-xs text-green-500 font-bold">Low Risk</p>
      <p className="text-2xl font-black text-green-600">
        {lowRiskIngredients}
      </p>
    </div>
  </div>
</div>

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
    className="bg-white border border-green-200 rounded-2xl p-5"
  >
    <div className="flex items-center justify-between gap-3 mb-3">
      <p className="font-black text-green-700">
        {alternative.name}
      </p>

      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-black">
        {alternative.score}/100
      </span>
    </div>

    <p className="text-sm text-gray-600 leading-relaxed">
      {alternative.reason}
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

        {comparisons.length > 0 && (
  <div className="mt-10 text-left">
    <div className="bg-white border border-orange-100 rounded-3xl p-8 shadow-xl">
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
                  className="bg-white rounded-3xl border border-orange-100 p-5 shadow-lg"
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
  className="rounded-2xl object-cover border border-orange-100"
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
                  <div className="flex items-start gap-3">
                    {item.image && (
                     <Image
  src={item.image}
  alt={item.name}
  width={64}
  height={64}
  className="rounded-2xl object-cover border border-orange-100"
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
          </div>
        )}
      </section>

{upgradeOpen && (
  <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6">
    <div className="bg-white max-w-lg w-full rounded-[32px] p-8 shadow-2xl">
      <h2 className="text-3xl font-black text-gray-900 mb-3">
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
        className="w-full py-4 rounded-2xl bg-orange-500 text-white font-black mb-3"
      >
        Coming Soon
      </button>

      <button
        onClick={() => setUpgradeOpen(false)}
        className="w-full py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold"
      >
        Close
      </button>
    </div>
  </div>
)}
{profileOpen && (
  <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6">
    <div className="bg-white max-w-lg w-full rounded-[32px] p-8 shadow-2xl">
      <h2 className="text-3xl font-black text-gray-900 mb-3">
        Health Profile
      </h2>

      <p className="text-gray-500 mb-6">
        Personalize PAUSTICA recommendations based on your body and goal.
      </p>

      <div className="space-y-4">
        <input value={userAge} onChange={(e) => setUserAge(e.target.value)} placeholder="Age" className="w-full px-5 py-4 rounded-2xl border border-orange-100 bg-orange-50 outline-none font-bold" />
        <input value={userWeight} onChange={(e) => setUserWeight(e.target.value)} placeholder="Weight in kg" className="w-full px-5 py-4 rounded-2xl border border-orange-100 bg-orange-50 outline-none font-bold" />
        <input value={userHeight} onChange={(e) => setUserHeight(e.target.value)} placeholder="Height in cm" className="w-full px-5 py-4 rounded-2xl border border-orange-100 bg-orange-50 outline-none font-bold" />

        {bmi > 0 && (
          <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5">
            <p className="text-sm font-bold text-gray-500 mb-1">Estimated BMI</p>
            <p className="text-3xl font-black text-gray-900">{bmi.toFixed(1)}</p>
            <p className="text-sm font-bold text-orange-600 mt-1">{bmiCategory}</p>
          </div>
        )}

        <div className="rounded-2xl bg-white border border-orange-100 p-5">
          <p className="font-black text-gray-900 mb-3">Achievements</p>

          <div className="space-y-3">
            {achievements.map((achievement) => {
              const percent = Math.round((achievement.current / achievement.target) * 100);
              const unlocked = achievement.current >= achievement.target;

              return (
                <div key={achievement.title} className="rounded-2xl border border-orange-100 p-4">
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
        </div>
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
        className="mt-6 w-full py-4 rounded-2xl bg-orange-500 text-white font-black"
      >
        Save Profile
      </button>

      <button
        onClick={() => setProfileOpen(false)}
        className="mt-3 w-full py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold"
      >
        Close
      </button>
    </div>
  </div>
)}

</main>
    
  );
}