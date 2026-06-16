"use client";

import { useCallback, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export type Product = {
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

export function useFoodLibrary(userId: string | null) {
  const [scanHistory, setScanHistory] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  const loadLocalFoodLibrary = useCallback(() => {
    requestAnimationFrame(() => {
      const savedHistory = localStorage.getItem("paustica_scan_history");
      const savedFavorites = localStorage.getItem("paustica_favorites");

      if (savedHistory) setScanHistory(JSON.parse(savedHistory));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    });
  }, []);

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
    localStorage.setItem("paustica_scan_history", JSON.stringify(updatedHistory));
  };

  const saveFavorites = (updatedFavorites: Product[]) => {
    setFavorites(updatedFavorites);
    localStorage.setItem("paustica_favorites", JSON.stringify(updatedFavorites));
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

  const clearHistory = async () => {
    setScanHistory([]);
    localStorage.removeItem("paustica_scan_history");

    if (userId) {
      await supabase.from("scan_history").delete().eq("user_id", userId);
    }
  };

  return {
    scanHistory,
    setScanHistory,
    favorites,
    setFavorites,
    loadLocalFoodLibrary,
    loadCloudData,
    saveHistory,
    saveFavorites,
    removeFavorite,
    clearHistory,
  };
}