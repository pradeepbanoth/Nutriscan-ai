"use client";

import { useCallback, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { HealthGoal } from "@/lib/goalScoring";

export function useUserProfile() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [selectedGoal, setSelectedGoal] =
    useState<HealthGoal>("General Wellness");

  const [userAge, setUserAge] = useState("");
  const [userWeight, setUserWeight] = useState("");
  const [userHeight, setUserHeight] = useState("");

  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalScans, setTotalScans] = useState(0);

  const loadProfile = useCallback(async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) return;

    setUserEmail(data.user.email ?? null);
    setUserId(data.user.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "health_goal, age, weight, height, current_streak, best_streak, total_scans"
      )
      .eq("id", data.user.id)
      .single();

    if (!profile) return;

    if (profile.health_goal) {
      setSelectedGoal(profile.health_goal as HealthGoal);
    }

    if (profile.age) {
      setUserAge(String(profile.age));
    }

    if (profile.weight) {
      setUserWeight(String(profile.weight));
    }

    if (profile.height) {
      setUserHeight(String(profile.height));
    }

    setCurrentStreak(profile.current_streak ?? 0);

    setBestStreak(profile.best_streak ?? 0);

    setTotalScans(profile.total_scans ?? 0);
  }, []);

  return {
    userEmail,
    userId,

    selectedGoal,
    setSelectedGoal,

    userAge,
    userWeight,
    userHeight,

    currentStreak,
    setCurrentStreak,

    bestStreak,
    setBestStreak,

    totalScans,
    setTotalScans,

    loadProfile,

    setUserAge,
setUserWeight,
setUserHeight,
  };
}