import { parseFatSecretNutrition } from "@/lib/parseFatSecretNutrition";

type Product = {
  id: number;
  name: string;
  brand: string;
  image: string;
  ingredients: string;
  nutriscore: string;
  nova: string | number;
  sugar: number;
  fat: number;
  salt: number;
  calories?: number;
  protein?: number;
  carbs?: number;
};

type FetchProductParams = {
  barcode: string;
  signal?: AbortSignal;
};

export async function fetchProductByBarcode({
  barcode,
  signal,
}: FetchProductParams): Promise<Product | null> {
  const res = await fetch(`/api/product?barcode=${encodeURIComponent(barcode)}`, {
    signal,
  });

  const data = await res.json();

  if (!data.success || !data.product) {
    return null;
  }

  const productName =
    data.product.name || data.product.product_name || "Unknown Product";

  const fatsecretRes = await fetch(
    `/api/fatsecret/search?query=${encodeURIComponent(productName)}`
  );

  const fatsecretData = await fatsecretRes.json();

  const firstFood = fatsecretData?.foods?.food?.[0];

  const nutrition = firstFood
    ? parseFatSecretNutrition(firstFood.food_description)
    : null;

  return {
    id: Number(barcode),
    name: data.product.name || "Unknown Product",
    brand: data.product.brand || "Unknown Brand",
    image: data.product.image || "",
    ingredients: data.product.ingredients || "Ingredients unavailable",
    nutriscore: data.product.nutriscore || "unknown",
    nova: data.product.nova || "N/A",
    sugar: data.product.sugar ?? 0,
    fat: data.product.fat ?? 0,
    salt: data.product.salt ?? 0,
    calories: nutrition?.calories || 0,
    protein: nutrition?.protein || 0,
    carbs: nutrition?.carbs || 0,
  };
}

export async function fetchFatSecretNutrition(productName: string) {
  const fatsecretRes = await fetch(
    `/api/fatsecret/search?query=${encodeURIComponent(productName)}`
  );

  const fatsecretData = await fatsecretRes.json();

  const firstFood = fatsecretData?.foods?.food?.[0];

  return firstFood
    ? parseFatSecretNutrition(firstFood.food_description)
    : null;
}