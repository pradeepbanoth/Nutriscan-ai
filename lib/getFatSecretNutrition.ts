import { parseFatSecretNutrition } from "./parseFatSecretNutrition";

export async function getFatSecretNutrition(
  productName: string
) {
  try {
    const res = await fetch(
      `/api/fatsecret/search?query=${encodeURIComponent(productName)}`
    );

    const data = await res.json();

    const firstFood = data?.foods?.food?.[0];

    if (!firstFood) return null;

    return parseFatSecretNutrition(
      firstFood.food_description
    );
  } catch {
    return null;
  }
}