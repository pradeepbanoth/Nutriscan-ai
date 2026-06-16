"use client";

import { useEffect, useState } from "react";

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem("paustica_recent_searches");

      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

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

  return {
    recentSearches,
    saveRecentSearch,
  };
}