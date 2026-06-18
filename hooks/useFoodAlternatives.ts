/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";

type Params = {
  getCache: <T>(key: string) => T | null;
  setCache: <T>(key: string, value: T, ttl?: number) => void;
  createCacheKey: (...parts: string[]) => string;
  dedupeRequest: <T>(key: string, requestFn: () => Promise<T>) => Promise<T>;
};

export function useFoodAlternatives({
  getCache,
  setCache,
  createCacheKey,
  dedupeRequest,
}: Params) {
  const [fatSecretAlternatives, setFatSecretAlternatives] = useState<any[]>([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);

  const fetchAlternatives = async (productName: string) => {
    const cleanName = productName.trim().toLowerCase();
    const cacheKey = createCacheKey("fatsecret_alternatives", cleanName);

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
        }
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

  return {
    fatSecretAlternatives,
    loadingAlternatives,
    fetchAlternatives,
  };
}