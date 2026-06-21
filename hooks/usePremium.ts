"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export function usePremium() {
  const [loading, setLoading] = useState(true);

  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const loadPremium = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("subscriptions")
        .select("status,end_date")
        .eq("user_id", user.id)
        .single();

      if (
        data?.status === "active" &&
        new Date(data.end_date) > new Date()
      ) {
        setIsPremium(true);
      }

      setLoading(false);
    };

    loadPremium();
  }, []);

  return {
    loading,
    isPremium,
  };
}