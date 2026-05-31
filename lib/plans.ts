export type PlanType = "free" | "premium";

export const plans = {
  free: {
    name: "Free",
    price: "₹0",
    scanLimitPerDay: 10,
    features: {
      barcodeScan: true,
      basicHealthScore: true,
      favorites: true,
      scanHistory: true,
      ocrScanner: false,
      foodPhotoAI: false,
      aiCoach: false,
      weeklyReport: false,
      productComparison: false,
      unlimitedScans: false,
    },
  },

  premium: {
    name: "Premium",
    price: "₹99/month",
    scanLimitPerDay: "Unlimited",
    features: {
      barcodeScan: true,
      basicHealthScore: true,
      favorites: true,
      scanHistory: true,
      ocrScanner: true,
      foodPhotoAI: true,
      aiCoach: true,
      weeklyReport: true,
      productComparison: true,
      unlimitedScans: true,
    },
  },
};

export function isPremiumFeature(feature: keyof typeof plans.free.features) {
  return plans.free.features[feature] === false;
}