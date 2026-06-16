"use client";

import { useState } from "react";
import { checkScanUsage } from "@/services/usageService";

export function useScanPermission() {
  const [scanRemaining, setScanRemaining] = useState<number | null>(null);
  const [currentPlan, setCurrentPlan] = useState("free");

  const checkScanPermission = async () => {
    const data = await checkScanUsage();

    if (data.plan) {
      setCurrentPlan(data.plan);
    }

    if (typeof data.remaining !== "undefined") {
      setScanRemaining(data.remaining);
    }

    return data;
  };

  return {
    scanRemaining,
    currentPlan,
    checkScanPermission,
  };
}