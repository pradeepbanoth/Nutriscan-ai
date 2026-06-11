import { NextResponse } from "next/server";
import { elastic, PRODUCT_INDEX } from "@/lib/elasticsearch";

export const dynamic = "force-dynamic";

type OFFProduct = {
  code?: string;
  product_name?: string;
  product_name_en?: string;
  brands?: string;
  categories?: string;
  ingredients_text?: string;
  nutriscore_grade?: string;
  nova_group?: number;
  image_front_url?: string;
  nutriments?: {
    sugars_100g?: number;
    fat_100g?: number;
    salt_100g?: number;
  };
};

const seedQueries = [
  "coke",
  "pepsi",
  "lays",
  "doritos",
  "kurkure",
  "maggi",
  "oreo",
  "kitkat",
  "amul",
  "nestle",
];

async function fetchWithRetry(
  url: string,
  retries = 3,
  timeoutMs = 15000
) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        cache: "no-store",
        headers: {
          "User-Agent":
            "PAUSTICA/1.0 (https://paustica.app; support@paustica.app)",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        return response;
      }

      if (
        response.status === 429 ||
        response.status === 500 ||
        response.status === 502 ||
        response.status === 503
      ) {
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, attempt * 2000));
          continue;
        }
      }

      return response;
    } catch (error) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, attempt * 2000));
        continue;
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error("Fetch failed");
}

export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-sync-secret");

    if (secret !== process.env.SYNC_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let indexed = 0;
    const errors: string[] = [];

    for (const query of seedQueries) {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&json=1&page_size=10`;

      const response = await fetchWithRetry(url);

      if (!response.ok) {
        errors.push(`${query}: OpenFoodFacts failed ${response.status}`);
        continue;
      }

      const data = await response.json();
      const products: OFFProduct[] = data.products || [];

      for (const product of products) {
        const name = product.product_name || product.product_name_en;

        if (!product.code || !name) continue;

        await elastic.index({
          index: PRODUCT_INDEX,
          id: product.code,
          document: {
            barcode: product.code,
            name,
            brand: product.brands || "",
            category: product.categories || "",
            ingredients: product.ingredients_text || "",
            nutriscore: product.nutriscore_grade || "unknown",
            nova: product.nova_group ?? null,
            image: product.image_front_url || "",
            sugar: product.nutriments?.sugars_100g ?? null,
            fat: product.nutriments?.fat_100g ?? null,
            salt: product.nutriments?.salt_100g ?? null,
            source: "openfoodfacts",
            updatedAt: new Date().toISOString(),
          },
        });

        indexed++;
      }
    }

    await elastic.indices.refresh({ index: PRODUCT_INDEX });

    return NextResponse.json({
      ok: true,
      indexed,
      errors,
      index: PRODUCT_INDEX,
    });
  } catch (error) {
    console.error("Sync failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown sync error",
      },
      { status: 500 }
    );
  }
}