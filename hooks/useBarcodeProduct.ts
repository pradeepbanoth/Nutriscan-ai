"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchProductByBarcode } from "@/services/productService";
import { fetchRealAlternatives } from "@/services/alternativeService";
import { analyzeHealth } from "@/lib/healthEngine";
import { HealthGoal } from "@/lib/goalScoring";
import posthog from "posthog-js";
import { AnalyticsEvents } from "@/lib/analyticsEvents";
import { supabase } from "@/app/lib/supabase";

type Params = {
  barcode: string;
  selectedGoal: HealthGoal;
  productAbortRef: React.MutableRefObject<AbortController | null>;
  checkScanPermission: () => Promise<any>;
  setUpgradeOpen: (value: boolean) => void;
  createCacheKey: (...parts: string[]) => string;
  getCache: <T>(key: string) => T | null;
  setCache: <T>(key: string, value: T, ttl?: number) => void;
  dedupeRequest: <T>(key: string, requestFn: () => Promise<T>) => Promise<T>;
  fetchAlternatives: (name: string) => Promise<void>;
  setRealAlternatives: (items: any[]) => void;
  setProduct: (product: any) => void;
  setScannerOpen: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  saveHistory: (product: any) => Promise<void>;
  minLoadingTime: number;
};

export function useBarcodeProduct({
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
  minLoadingTime,
}: Params) {
  const fetchProduct = async (code?: string) => {
    const finalBarcode = code || barcode;

    if (!finalBarcode) return;

    const permission = await checkScanPermission();

    if (!permission.allowed) {
      setUpgradeOpen(true);
      return;
    }

    const loadingStartedAt = Date.now();

    productAbortRef.current?.abort();

    const controller = new AbortController();
    productAbortRef.current = controller;

    const productCacheKey = createCacheKey("product", finalBarcode);

    const cachedProduct = getCache<any>(productCacheKey);

    if (cachedProduct) {
      setProduct(cachedProduct);
      setScannerOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const fetchedBaseProduct = await fetchProductByBarcode({
        barcode: finalBarcode,
        signal: controller.signal,
      });

      if (fetchedBaseProduct) {
        const fetchedProduct = {
          ...fetchedBaseProduct,
        };

        setCache(
          productCacheKey,
          fetchedProduct,
          7 * 24 * 60 * 60 * 1000
        );

        setScannerOpen(false);
        setProduct(fetchedProduct);

        posthog.capture(AnalyticsEvents.SCAN_COMPLETED, {
  source: code ? "camera" : "manual_barcode",
  barcode_length: finalBarcode.length,
  product_name: fetchedProduct.name,
  brand: fetchedProduct.brand,
});

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
          await fetchAlternatives(fetchedProduct.name);
        }

        const realAlternativesCacheKey = createCacheKey(
          "real_alternatives",
          fetchedProduct.name
        );

        const cachedRealAlternatives = getCache<any[]>(
          realAlternativesCacheKey
        );

        if (cachedRealAlternatives) {
          setRealAlternatives(cachedRealAlternatives);
        } else {
          const realItems = await dedupeRequest(
            createCacheKey("api_real_alternatives", fetchedProduct.name),
            async () => fetchRealAlternatives(fetchedProduct.name)
          );

          setRealAlternatives(realItems);

          setCache(
            realAlternativesCacheKey,
            realItems,
            24 * 60 * 60 * 1000
          );
        }

        await saveHistory(fetchedProduct);
        const {
  data: { session },
} = await supabase.auth.getSession();

if (session) {
  await fetch("/api/referrals/qualify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      event: "first_scan",
    }),
  });
}
      } else {
        setProduct(null);

        posthog.capture(AnalyticsEvents.SCAN_COMPLETED, {
  source: code ? "camera" : "manual_barcode",
  barcode_length: finalBarcode.length,
  success: false,
});

        alert(
          "Product not found in database. Try another barcode or enter product details manually."
        );
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.log(error);
        alert("Something went wrong");
      }
    } finally {
      const elapsed = Date.now() - loadingStartedAt;
      const remainingTime = Math.max(0, minLoadingTime - elapsed);

      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };

  return { fetchProduct };
}