import { UnifiedFoodProduct } from "./types/foodSource";

export function mergeFoodSources(
  products: Array<UnifiedFoodProduct | null>
): UnifiedFoodProduct | null {
  const validProducts = products.filter(Boolean) as UnifiedFoodProduct[];

  if (validProducts.length === 0) return null;

  const primary = validProducts[0];

  function isIndianDish(product: UnifiedFoodProduct): boolean {
  return (
    product.source === "bonhappetee" &&
    product.brand === "Bon Happetee"
  );
}

  return {
    source: "merged",

    name: primary.name,
    brand: primary.brand,
    barcode: primary.barcode,
    image: primary.image,
    ingredients: primary.ingredients,

    calories: firstNumber(validProducts, "calories"),
    protein: firstNumber(validProducts, "protein"),
    carbs: firstNumber(validProducts, "carbs"),
    fat: firstNumber(validProducts, "fat"),
    sugar: firstNumber(validProducts, "sugar"),
    salt: firstNumber(validProducts, "salt"),
    fiber: firstNumber(validProducts, "fiber"),
    saturatedFat: firstNumber(validProducts, "saturatedFat"),
    sodium: firstNumber(validProducts, "sodium"),

    nutriscore: isIndianDish(primary) ? "unknown" : firstString(validProducts, "nutriscore"),
nova: isIndianDish(primary) ? "N/A" : firstValue(validProducts, "nova"),

    healthTags: uniqueFlat(validProducts, "healthTags"),
    alternatives: uniqueFlat(validProducts, "alternatives"),

    confidence: Math.min(
      100,
      validProducts.reduce((sum, item) => sum + item.confidence, 0)
    ),
  };
}

function firstNumber(
  products: UnifiedFoodProduct[],
  key: keyof UnifiedFoodProduct
): number | undefined {
  for (const product of products) {
    const value = product[key];

    if (typeof value === "number" && value > 0) {
      return value;
    }
  }

  return undefined;
}

function firstString(
  products: UnifiedFoodProduct[],
  key: keyof UnifiedFoodProduct
): string | undefined {
  for (const product of products) {
    const value = product[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return undefined;
}

function firstValue(
  products: UnifiedFoodProduct[],
  key: keyof UnifiedFoodProduct
): string | number | undefined {
  for (const product of products) {
    const value = product[key];

    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
  }

  return undefined;
}

function uniqueFlat(
  products: UnifiedFoodProduct[],
  key: keyof UnifiedFoodProduct
): string[] {
  return Array.from(
    new Set(
      products.flatMap((product) => {
        const value = product[key];
        return Array.isArray(value) ? value : [];
      })
    )
  );
}