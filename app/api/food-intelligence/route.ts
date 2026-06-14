import { NextResponse } from "next/server";
import { searchBonHappeteeProduct } from "../../../lib/providers/bonhappetee";
import { mergeFoodSources } from "../../../lib/mergeFoodSources";
import { UnifiedFoodProduct } from "../../../lib/types/foodSource";
import { parseFatSecretNutrition } from "../../../lib/parseFatSecretNutrition";

async function searchOpenFoodFacts(query: string): Promise<UnifiedFoodProduct | null> {
  const searchUrls = [
    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      query
    )}&search_simple=1&action=process&json=1&page_size=5&countries_tags_en=india`,

    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      query
    )}&search_simple=1&action=process&json=1&page_size=5`,
  ];

  for (const url of searchUrls) {
    try {
      const res = await fetch(url);

      if (!res.ok) continue;

      const data = await res.json();
      const product = data.products?.[0];

      if (!product) continue;

      return {
        source: "openfoodfacts",
        name: product.product_name || "Unknown Product",
        brand: product.brands || "Unknown Brand",
        barcode: product.code,
        image: product.image_front_url,
        ingredients: product.ingredients_text,

        sugar: Number(product.nutriments?.sugars_100g ?? 0),
        fat: Number(product.nutriments?.fat_100g ?? 0),
        salt: Number(product.nutriments?.salt_100g ?? 0),

        nutriscore: product.nutriscore_grade,
        nova: product.nova_group,

        confidence: url.includes("countries_tags_en=india") ? 45 : 30,
      };
    } catch (error) {
      console.error("OpenFoodFacts search error:", error);
    }
  }

  return null;
}

async function searchFatSecret(query: string): Promise<UnifiedFoodProduct | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const res = await fetch(
      `${baseUrl}/api/fatsecret/search?query=${encodeURIComponent(query)}`
    );

    if (!res.ok) return null;

    const data = await res.json();
   const foods = data?.foods?.food;
const firstFood = Array.isArray(foods) ? foods[0] : foods;

if (!firstFood?.food_description) return null;

    const nutrition = parseFatSecretNutrition(firstFood.food_description);

    return {
      source: "fatsecret",
      name: firstFood.food_name || query,
      brand: "FatSecret",
      calories: nutrition?.calories || 0,
      protein: nutrition?.protein || 0,
      carbs: nutrition?.carbs || 0,
      fat: nutrition?.fat || 0,
      fiber: nutrition?.fiber || 0,
      saturatedFat: nutrition?.saturatedFat || 0,
      sodium: nutrition?.sodium || 0,
      confidence: 25,
    };
  } catch (error) {
    console.error("FatSecret merge error:", error);
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json(
      { success: false, error: "Query is required" },
      { status: 400 }
    );
  }

  const [bonHappeteeProduct, openFoodFactsProduct, fatSecretProduct] =
  await Promise.all([
    searchBonHappeteeProduct(query),
    searchOpenFoodFacts(query),
    searchFatSecret(query),
  ]);

  const mergedProduct = mergeFoodSources([
  bonHappeteeProduct,
  openFoodFactsProduct,
  fatSecretProduct,
]);

  if (!mergedProduct) {
    return NextResponse.json({
      success: false,
      product: null,
      message: "No product found",
    });
  }

  return NextResponse.json({
    success: true,
    product: mergedProduct,
  });
}