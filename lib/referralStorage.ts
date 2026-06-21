const REFERRAL_KEY = "paustica_referral_code";

export function saveReferralCode(code: string) {
  if (typeof window === "undefined") return;
  if (!code.trim()) return;

  sessionStorage.setItem(REFERRAL_KEY, code.trim());
}

export function getReferralCode() {
  if (typeof window === "undefined") return null;

  return sessionStorage.getItem(REFERRAL_KEY);
}

export function clearReferralCode() {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(REFERRAL_KEY);
}