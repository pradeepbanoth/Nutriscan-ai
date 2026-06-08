type OpenFoodFactsProduct = {
  product_name?: string;
  brands?: string;
  image_front_url?: string;
  nutriscore_grade?: string;
  nova_group?: string | number;
  nutriments?: {
    sugars_100g?: number;
    fat_100g?: number;
    salt_100g?: number;
  };
};

export type RealAlternative = {
  name: string;
  brand: string;
  image: string;
  nutriscore: string;
  nova: string | number;
  sugar: number;
  fat: number;
  salt: number;
  reason: string;
};

export async function getRealAlternatives(productName: string) {
  const query = productName
    .replace(/cola|coke|pepsi/gi, "healthy drink")
    .replace(/chips|lays|kurkure|bingo/gi, "roasted snack")
    .replace(/noodles|maggi|ramen/gi, "millet noodles")
    .replace(/chocolate|cookie|biscuit|oreo/gi, "healthy snack");

  const res = await fetch(
    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      query
    )}&search_simple=1&action=process&json=1&page_size=8`
  );

  const data = await res.json();

  const products = (data.products || []) as OpenFoodFactsProduct[];

  return products
    .filter((item) => item.product_name)
    .map((item) => ({
      name: item.product_name || "Unknown Product",
      brand: item.brands || "Unknown Brand",
      image: item.image_front_url || "",
      nutriscore: item.nutriscore_grade || "unknown",
      nova: item.nova_group || "N/A",
      sugar: Number(item.nutriments?.sugars_100g ?? 0),
      fat: Number(item.nutriments?.fat_100g ?? 0),
      salt: Number(item.nutriments?.salt_100g ?? 0),
      reason:
        "Found from real product database with potentially better nutrition profile.",
    }))
    .slice(0, 3);
}