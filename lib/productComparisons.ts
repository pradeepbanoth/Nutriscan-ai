export type ComparedProduct = {
  name: string;
  score: number;
  sugar: string;
  processing: string;
  verdict: string;
};

export function getProductComparisons(productName: string): ComparedProduct[] {
  const lower = productName.toLowerCase();

  if (
    lower.includes("cola") ||
    lower.includes("coke") ||
    lower.includes("pepsi") ||
    lower.includes("soda")
  ) {
    return [
      {
        name: "Coca-Cola",
        score: 18,
        sugar: "High",
        processing: "Ultra Processed",
        verdict: "Avoid frequent consumption",
      },
      {
        name: "Pepsi",
        score: 16,
        sugar: "High",
        processing: "Ultra Processed",
        verdict: "Similar high-sugar soft drink",
      },
      {
        name: "Coconut Water",
        score: 92,
        sugar: "Low",
        processing: "Low Processed",
        verdict: "Better hydration choice",
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
        name: "Kurkure",
        score: 22,
        sugar: "Low",
        processing: "Ultra Processed",
        verdict: "Highly processed snack",
      },
      {
        name: "Lay's",
        score: 28,
        sugar: "Low",
        processing: "Ultra Processed",
        verdict: "High fat and salt risk",
      },
      {
        name: "Roasted Makhana",
        score: 91,
        sugar: "Low",
        processing: "Low Processed",
        verdict: "Better crunchy snack",
      },
    ];
  }

  if (lower.includes("noodle") || lower.includes("maggi")) {
    return [
      {
        name: "Instant Noodles",
        score: 32,
        sugar: "Low",
        processing: "Ultra Processed",
        verdict: "High sodium and additives",
      },
      {
        name: "Millet Noodles",
        score: 78,
        sugar: "Low",
        processing: "Processed",
        verdict: "Better grain profile",
      },
      {
        name: "Oats Upma",
        score: 88,
        sugar: "Low",
        processing: "Low Processed",
        verdict: "More balanced homemade option",
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
        name: "Cream Biscuits",
        score: 30,
        sugar: "High",
        processing: "Ultra Processed",
        verdict: "High sugar and refined flour",
      },
      {
        name: "Oat Cookies",
        score: 72,
        sugar: "Medium",
        processing: "Processed",
        verdict: "Better if low sugar",
      },
      {
        name: "Dates with Nuts",
        score: 86,
        sugar: "Natural",
        processing: "Low Processed",
        verdict: "Better sweet snack",
      },
    ];
  }

  return [];
}