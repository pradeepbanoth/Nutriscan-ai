"use client";

export function useCache() {
  const setCache = <T,>(
    key: string,
    value: T,
    ttl = 86400000
  ) => {
    if (typeof window === "undefined") return;

    localStorage.setItem(
      key,
      JSON.stringify({
        value,
        expiry: Date.now() + ttl,
      })
    );
  };

  const getCache = <T,>(
    key: string
  ): T | null => {
    if (typeof window === "undefined") return null;

    const cached = localStorage.getItem(key);

    if (!cached) return null;

    try {
      const parsed = JSON.parse(cached);

      if (
        !parsed.expiry ||
        Date.now() > parsed.expiry
      ) {
        localStorage.removeItem(key);

        return null;
      }

      return parsed.value;
    } catch {
      localStorage.removeItem(key);

      return null;
    }
  };

  const removeCache = (
    key: string
  ) => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(key);
  };

  const createCacheKey = (
    prefix: string,
    value: string | number
  ) => {
    return `${prefix}_${String(value)
      .trim()
      .toLowerCase()}`;
  };

  return {
    setCache,
    getCache,
    removeCache,
    createCacheKey,
  };
}