import { UnifiedFoodProduct } from "../types/foodSource";

export type BonHappeteeProduct = {
  name?: string;
  brand?: string;
  barcode?: string;
  image?: string;
  ingredients?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  sugar?: number;
  salt?: number;
  fiber?: number;
  healthTags?: string[];
  alternatives?: string[];
};

export function normalizeBonHappeteeProduct(
  product: BonHappeteeProduct | null
): UnifiedFoodProduct | null {
  if (!product?.name) return null;

  return {
    source: "bonhappetee",
    name: product.name,
    brand: product.brand || "Unknown Brand",
    barcode: product.barcode,
    image: product.image,
    ingredients: product.ingredients,

    calories: product.calories,
    protein: product.protein,
    carbs: product.carbs,
    fat: product.fat,
    sugar: product.sugar,
    salt: product.salt,
    fiber: product.fiber,

    healthTags: product.healthTags || [],
    alternatives: product.alternatives || [],

    confidence: 35,
  };
}

function normalizeFoodName(value: string) {
  return value
    .toLowerCase()
    .replace(/chaat/g, "chat")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

type BonhappeteeItem = {
  name?: string;
  brand?: string;
  image?: string;
  ingredients?: string;
  nutriscore?: string;
  nova?: string | number;
  sugar?: number;
  fat?: number;
  salt?: number;
};

type BonHappeteeSearchItem = {
  food_name?: string;
  common_names?: string;
  meal_type?: string;
  serving_type?: string;
  calories_calculated_for?: number;
};

function pickBestBonHappeteeItem(
  items: BonHappeteeSearchItem[],
  query: string
) {
const normalizedQuery = normalizeFoodName(query);

  const scoredItems = items.map((item) => {
    const foodName = normalizeFoodName(item.food_name || "");
    const commonName = normalizeFoodName(item.common_names || "");

    let score = 0;

    if (foodName === normalizedQuery) score += 100;
    if (commonName === normalizedQuery) score += 100;

    if (foodName.startsWith(normalizedQuery)) score += 40;
    if (commonName.startsWith(normalizedQuery)) score += 40;

    if (foodName.includes(normalizedQuery)) score += 20;
    if (commonName.includes(normalizedQuery)) score += 20;

    const wordCount = foodName.split(" ").filter(Boolean).length;

    if (wordCount === 1) score += 30;
    if (wordCount <= 2) score += 15;

    return {
      item,
      score,
    };
  });

  scoredItems.sort((a, b) => b.score - a.score);

  return scoredItems[0]?.item || items[0];
}

export async function searchBonHappeteeProduct(
  query: string
): Promise<UnifiedFoodProduct | null> {
  try {
    const res = await fetch(
      `https://bonhappetee-food-nutrition-api2.p.rapidapi.com/search?value=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host":
            "bonhappetee-food-nutrition-api2.p.rapidapi.com",
          "x-rapidapi-key": process.env.BONHAPPETEE_API_KEY!,
        },
      }
    );

    if (!res.ok) {
      console.error("Bon Happetee failed:", res.status);
      return null;
    }

    const data = await res.json();
console.log(
  "Bon Happetee First Nutrients:",
  JSON.stringify(data?.items?.[0]?.nutrients, null, 2)
);
    
const item = pickBestBonHappeteeItem(data?.items || [], query);

    if (!item) return null;

    return {
      source: "bonhappetee",
      name: item.food_name || query,
      brand: "Bon Happetee",
      calories: item.calories_calculated_for || 0,
      confidence: 55,
    };
  } catch (error) {
    console.error("Bon Happetee error:", error);
    return null;
  }
}