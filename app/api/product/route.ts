import { NextResponse } from "next/server";
import { barcodeRateLimit } from "@/lib/rateLimit";
import {findFatSecretFoodIdByBarcode,getFatSecretFood,} from "@/lib/fatsecret";
import { parseFatSecretNutrition } from "@/lib/parseFatSecretNutrition";
import { cacheHeaders } from "@/lib/cacheHeaders";


export async function GET(req: Request) {
  const startedAt = Date.now();
  const ip =
  req.headers.get("x-forwarded-for") ||
  req.headers.get("x-real-ip") ||
  "anonymous";

  const rate = barcodeRateLimit
  ? await barcodeRateLimit.limit(ip)
  : { success: true };

if (!rate.success) {
  return NextResponse.json(
    { success: false, message: "Too many barcode requests. Please try again shortly." },
    { status: 429 }
  );
}
  try {
    const { searchParams } = new URL(req.url);
    const barcode = searchParams.get("barcode")?.trim();

    if (!barcode) {
      return NextResponse.json(
        { success: false, message: "Barcode missing" },
        { status: 400 }
      );
    }

    if (!/^\d{8,14}$/.test(barcode)) {
      return NextResponse.json(
        { success: false, message: "Invalid barcode format" },
        { status: 400 }
      );
    }

   const response = await fetch(
  `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
  {
    headers: {
      "User-Agent": "PAUSTICA/1.0 contact: support@paustica.app",
    },
    next: {
      revalidate: 60 * 60 * 24,
    },
  }
);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Product service unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (data.status === 0) {
  try {
    const foodId = await findFatSecretFoodIdByBarcode(barcode);

   if (!foodId) {
  return NextResponse.json(
    {
      success: false,
      message: "Product not found",
    },
    {
     headers: cacheHeaders.nutrition,
    }
  );
}

    const fatSecretFood = await getFatSecretFood(foodId);

  if (!fatSecretFood?.food) {
  return NextResponse.json(
    {
      success: false,
      message: "Product not found",
    },
    {
      headers: cacheHeaders.nutrition,
    }
  );
}

   const food = fatSecretFood.food;
const nutrition = parseFatSecretNutrition(food.food_description || "");

if (process.env.NODE_ENV === "development") {
  console.log("Product API completed in", Date.now() - startedAt, "ms");
}
console.log("Product API completed in", Date.now() - startedAt, "ms");
return NextResponse.json(
  {
    success: true,
    source: "fatsecret",

    product: {
    name: food.food_name || "Unknown Product",
    brand: food.brand_name || "Unknown Brand",

    image: "",

    ingredients:
      food.food_description || "Nutrition data provided by FatSecret",

    nutriscore: "unknown",

    nova: "N/A",

    energy: nutrition.calories,

    calories: nutrition.calories,
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fiber: nutrition.fiber,

    sugar: nutrition.sugar,
    fat: nutrition.fat,
    salt: nutrition.salt,
    },
  },
  {
   headers: cacheHeaders.product,
  }
);
  }catch (error) {
  console.error("FatSecret fallback failed:", error);

  return NextResponse.json(
    {
      success: false,
      message: "Product not found",
    },
    {
     headers: cacheHeaders.nutrition,
    }
  );
}
    }
   const product = data.product;

const productName =
  product.product_name ||
  product.product_name_en ||
  product.generic_name ||
  product.abbreviated_product_name ||
  "Unknown Product";

const brand =
  product.brands ||
  product.brands_tags?.[0] ||
  "Unknown Brand";

  if (process.env.NODE_ENV === "development") {
  console.log("Product API completed in", Date.now() - startedAt, "ms");
}
  console.log("Product API completed in", Date.now() - startedAt, "ms");
return NextResponse.json(
  {
    success: true,
    source: "openfoodfacts",
    product: {
    name: productName,
    brand,
        image: product.image_url || "",
        ingredients: product.ingredients_text || "No ingredients available",
        nutriscore: product.nutriscore_grade || "unknown",
        nova: product.nova_group || "N/A",
        energy: product.nutriments?.energy_kcal ?? 0,
        sugar: product.nutriments?.sugars_100g ?? 0,
        fat: product.nutriments?.fat_100g ?? 0,
        salt: product.nutriments?.salt_100g ?? 0,
        calories: product.nutriments?.energy_kcal_100g ?? product.nutriments?.energy_kcal ?? 0,
        protein: product.nutriments?.proteins_100g ?? 0,
        carbs: product.nutriments?.carbohydrates_100g ?? 0,
        fiber: product.nutriments?.fiber_100g ?? 0,
         },
  },
  {
    headers: cacheHeaders.product,
  }
);
  } catch (error) {
    console.error("Barcode API error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}