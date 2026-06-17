"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchFatSecretNutrition } from "@/services/productService";
import { fetchRealAlternatives } from "@/services/alternativeService";
import { analyzeHealth } from "@/lib/healthEngine";
import { HealthGoal } from "@/lib/goalScoring";

type Params = {
  createCacheKey: (...parts: string[]) => string;
  getCache: <T>(key: string) => T | null;
  setCache: <T>(key: string, value: T, ttl?: number) => void;
  dedupeRequest: <T>(
    key: string,
    requestFn: () => Promise<T>
  ) => Promise<T>;

  selectedGoal: HealthGoal;

  fetchAlternatives: (name: string) => Promise<void>;

  setProduct: (product: any) => void;

  setRealAlternatives: (items: any[]) => void;

  setSuggestions: (items: any[]) => void;

  setScannerOpen: (value: boolean) => void;

  setLoading: (value: boolean) => void;

  saveHistory: (product: any) => Promise<void>;

  updateScanStats: () => Promise<void>;
};

export function useAnalyzeProduct({
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
}: Params) {
  const analyzeSelectedProduct = async (
    item: Record<string, unknown>
  ) => {
    if (!item) return;

    setLoading(true);

    setSuggestions([]);

    const productName = String(
      item.product_name ?? ""
    );

    const nutritionCacheKey =
      createCacheKey(
        "nutrition",
        productName
      );

    let nutrition =
      getCache<
        Awaited<
          ReturnType<
            typeof fetchFatSecretNutrition
          >
        >
      >(nutritionCacheKey);

    if (!nutrition) {
      nutrition = await dedupeRequest(
        createCacheKey(
          "api_nutrition",
          productName
        ),
        async () =>
          fetchFatSecretNutrition(
            productName
          )
      );

      setCache(
        nutritionCacheKey,
        nutrition,
        24 * 60 * 60 * 1000
      );
    }

    const fetchedProduct = {
      id: 0,

      name:
        productName ||
        "Unknown Product",

      brand: String(
        item.brands ??
          "Unknown Brand"
      ),

      image: String(
        item.image_front_url ?? ""
      ),

      ingredients: String(
        item.ingredients_text ??
          "Ingredients unavailable"
      ),

      nutriscore: String(
        item.nutriscore_grade ??
          "unknown"
      ),

      nova: String(
        item.nova_group ?? "N/A"
      ),

      sugar: Number(
        (item as any).nutriments
          ?.sugars_100g ?? 0
      ),

      fat: Number(
        (item as any).nutriments
          ?.fat_100g ?? 0
      ),

      salt: Number(
        (item as any).nutriments
          ?.salt_100g ?? 0
      ),

      calories:
        nutrition?.calories || 0,

      protein:
        nutrition?.protein || 0,

      carbs:
        nutrition?.carbs || 0,

      fiber:
        nutrition?.fiber || 0,

      saturatedFat:
        nutrition?.saturatedFat ||
        0,

      sodium:
        nutrition?.sodium || 0,
    };

    setProduct(fetchedProduct);

    const analysis = analyzeHealth({
      sugar: fetchedProduct.sugar,
      fat: fetchedProduct.fat,
      salt: fetchedProduct.salt,
      protein: fetchedProduct.protein,
      carbs: fetchedProduct.carbs,
      calories:
        fetchedProduct.calories,
      nova: fetchedProduct.nova,
      ingredients:
        fetchedProduct.ingredients,
      healthGoal:
        selectedGoal,
    });

    if (analysis.score < 60) {
      await fetchAlternatives(
        fetchedProduct.name
      );
    }

    const cacheKey =
      createCacheKey(
        "real_alternatives",
        fetchedProduct.name
      );

    const cached =
      getCache<any[]>(cacheKey);

    if (cached) {
      setRealAlternatives(cached);
    } else {
      const realItems =
        await dedupeRequest(
          createCacheKey(
            "api_real_alternatives",
            fetchedProduct.name
          ),

          async () =>
            fetchRealAlternatives(
              fetchedProduct.name
            )
        );

      setRealAlternatives(
        realItems
      );

      setCache(
        cacheKey,
        realItems,
        24 * 60 * 60 * 1000
      );
    }

    await updateScanStats();

    setScannerOpen(false);

    await saveHistory(
      fetchedProduct
    );

    setLoading(false);
  };

  return {
    analyzeSelectedProduct,
  };
}