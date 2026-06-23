

import { supabase } from "@/app/lib/supabase";

export type SecurityEvent =
  | "search"
  | "barcode_scan"
  | "ocr_scan"
  | "food_photo"
  | "referral"
  | "payment"
  | "login"
  | "api";

type SecurityInput = {
  userId?: string | null;
  eventName: SecurityEvent;
  request?: Request;
  fingerprint?: string;
  metadata?: Record<string, unknown>;
};

type SecurityResult = {
  allowed: boolean;
  riskScore: number;
  cooldownSeconds: number;
  reasons: string[];
};

const WINDOW_MINUTES = 10;

const THRESHOLDS = {
  search: 80,
  barcode_scan: 60,
  ocr_scan: 25,
  food_photo: 20,
  referral: 10,
  payment: 10,
  login: 20,
  api: 120,
};

export function getClientIp(request?: Request) {
  if (!request) return "unknown";

  return (
    request.headers.get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function securityGuard({
  userId,
  eventName,
  request,
  fingerprint,
  metadata = {},
}: SecurityInput): Promise<SecurityResult> {

  try {
    const ipAddress = getClientIp(request);

    const since = new Date(
      Date.now() - WINDOW_MINUTES * 60 * 1000
    ).toISOString();

    let riskScore = 0;

    const reasons: string[] = [];

    const { count: ipCount } = await supabase
      .from("security_events")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("event_name", eventName)
      .eq("ip_address", ipAddress)
      .gte("created_at", since);

    const { count: userCount } = await supabase
      .from("security_events")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("event_name", eventName)
      .eq("user_id", userId || "")
      .gte("created_at", since);

    if ((ipCount || 0) > THRESHOLDS[eventName]) {
      riskScore += 40;

      reasons.push("ip_velocity");
    }

    if ((userCount || 0) > THRESHOLDS[eventName]) {
      riskScore += 35;

      reasons.push("user_velocity");
    }

    if (eventName === "referral") {
      const { count } = await supabase
        .from("referrals")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("referred_email", metadata.email || "");

      if ((count || 0) > 0) {
        riskScore += 100;

        reasons.push("duplicate_referral");
      }
    }

    if (eventName === "payment") {
      const amount = Number(metadata.amount || 0);

      if (amount > 50000) {
        riskScore += 60;

        reasons.push("high_value_payment");
      }
    }

    if (eventName === "login") {
      if ((ipCount || 0) > 10) {
        riskScore += 50;

        reasons.push("login_spam");
      }
    }

    const allowed = riskScore < 100;

    let cooldownSeconds = 0;

    if (riskScore >= 100) {
      cooldownSeconds = 3600;
    } else if (riskScore >= 75) {
      cooldownSeconds = 900;
    } else if (riskScore >= 50) {
      cooldownSeconds = 300;
    }

    await supabase
      .from("security_events")
      .insert({
        user_id: userId || null,

        event_name: eventName,

        ip_address: ipAddress,

        fingerprint,

        risk_score: riskScore,

        metadata: {
          ...metadata,

          reasons,

          cooldownSeconds,
        },
      });

    return {
      allowed,

      riskScore,

      cooldownSeconds,

      reasons,
    };
  } catch (error) {
    console.error(error);

    return {
      allowed: true,

      riskScore: 0,

      cooldownSeconds: 0,

      reasons: [],
    };
  }
}