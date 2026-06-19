export type PlanType = "free" | "premium";

export const plans = {
  free: {
    id: "free",

    name: "Free",

    price: "₹0",

    badge: "Start here",

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

      ingredientIntelligence: false,

      smartAlternatives: false,
    },
  },

  premium: {
    id: "premium",

    name: "Premium",

    price: "₹99/month",

    yearlyPrice: "₹699/year",

    badge: "Most Popular",

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

      ingredientIntelligence: true,

      smartAlternatives: true,
    },
  },
};

export function isPremiumFeature(
  feature: keyof typeof plans.free.features
) {
  return plans.free.features[feature] === false;
}