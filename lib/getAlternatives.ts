export type SmartAlternative = {
  name: string;
  score: number;
  reason: string;
};

export function getAlternatives(productName: string): SmartAlternative[] {
  const lower = productName.toLowerCase();

  if (
    lower.includes("cola") ||
    lower.includes("soda") ||
    lower.includes("pepsi") ||
    lower.includes("coke")
  ) {
    return [
      {
        name: "Coconut Water",
        score: 92,
        reason: "Naturally hydrating with lower processing.",
      },
      {
        name: "Fresh Lime Water",
        score: 90,
        reason: "Low sugar when made without added sweeteners.",
      },
      {
        name: "Unsweetened Sparkling Water",
        score: 86,
        reason: "Carbonated but usually sugar-free.",
      },
    ];
  }

  if (
    lower.includes("chip") ||
    lower.includes("lays") ||
    lower.includes("kurkure") ||
    lower.includes("bingo")
  ) {
    return [
      {
        name: "Roasted Makhana",
        score: 91,
        reason: "Light, crunchy, and less processed than fried snacks.",
      },
      {
        name: "Roasted Chickpeas",
        score: 88,
        reason: "Higher protein and fiber compared with chips.",
      },
      {
        name: "Air-Popped Popcorn",
        score: 82,
        reason: "Better snack when made with less oil and salt.",
      },
    ];
  }

  if (lower.includes("noodle") || lower.includes("maggi")) {
    return [
      {
        name: "Oats Upma",
        score: 88,
        reason: "More fiber and less processing.",
      },
      {
        name: "Millet Noodles",
        score: 80,
        reason: "Better grain profile than refined instant noodles.",
      },
      {
        name: "Vegetable Poha",
        score: 84,
        reason: "Simple meal with vegetables and lower additives.",
      },
    ];
  }

  if (
    lower.includes("cookie") ||
    lower.includes("biscuit") ||
    lower.includes("oreo")
  ) {
    return [
      {
        name: "Oat Cookies",
        score: 78,
        reason: "Better if made with oats and less sugar.",
      },
      {
        name: "Dates with Nuts",
        score: 86,
        reason: "Naturally sweet with fiber and minerals.",
      },
      {
        name: "Dry Fruits",
        score: 84,
        reason: "More nutrient-dense than refined biscuits.",
      },
    ];
  }

  if (lower.includes("chocolate")) {
    return [
      {
        name: "Dark Chocolate",
        score: 76,
        reason: "Better choice when cocoa is high and sugar is lower.",
      },
      {
        name: "Dates",
        score: 84,
        reason: "Natural sweetness with fiber.",
      },
      {
        name: "Nut Bar",
        score: 72,
        reason: "Can be better if low in added sugar.",
      },
    ];
  }

  return [];
}