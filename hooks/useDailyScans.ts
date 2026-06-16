"use client";

import { useState } from "react";

export function useDailyScans() {
  const FREE_DAILY_SCAN_LIMIT = 10;

  const [dailyScansUsed] = useState(() => {
    if (typeof window === "undefined") return 0;

    const today = new Date().toISOString().split("T")[0];

    const saved = localStorage.getItem(
      "paustica_daily_scans"
    );

    if (!saved) return 0;

    const data = JSON.parse(saved);

    return data.date === today ? data.count : 0;
  });

  return {
    dailyScansUsed,
    FREE_DAILY_SCAN_LIMIT,
  };
}