"use client";

import { supabase } from "@/app/lib/supabase";

type Params = {
  userId: string | null;
  setTotalScans: (value: number) => void;
  setCurrentStreak: (value: number) => void;
  setBestStreak: (value: number) => void;
};

export function useScanStats({
  userId,
  setTotalScans,
  setCurrentStreak,
  setBestStreak,
}: Params) {
  const updateScanStats = async () => {
    if (!userId) return;

    const today = new Date().toISOString().split("T")[0];

    const { data: profile } = await supabase
      .from("profiles")
      .select("current_streak, best_streak, total_scans, last_scan_date")
      .eq("id", userId)
      .maybeSingle();

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

  return { updateScanStats };
}