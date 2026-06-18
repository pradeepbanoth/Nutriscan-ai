import { NextResponse } from "next/server";
import type { SearchHit } from "@elastic/elasticsearch/lib/api/types";
import { elastic, PRODUCT_INDEX } from "@/lib/elasticsearch";
import { searchRateLimit } from "@/lib/rateLimit";
import { cacheHeaders } from "@/lib/cacheHeaders";

type ProductSource = {
  barcode?: string;
  name?: string;
  brand?: string;
  category?: string;
  ingredients?: string;
  nutriscore?: string;
  nova?: number | null;
  image?: string;
  sugar?: number | null;
  fat?: number | null;
  salt?: number | null;
  source?: string;
  updatedAt?: string;
};

function mapProduct(hit: SearchHit<ProductSource>) {
  const p = hit._source || {};

  return {
    id: hit._id,
    score: hit._score,
    barcode: p.barcode || "",
    name: p.name || "",
    brand: p.brand || "",
    category: p.category || "",
    ingredients: p.ingredients || "",
    nutriscore: p.nutriscore || "unknown",
    nova: p.nova ?? "N/A",
    image: p.image || "",
    sugar: Number(p.sugar ?? 0),
    fat: Number(p.fat ?? 0),
    salt: Number(p.salt ?? 0),
    source: p.source || "elasticsearch",
    updatedAt: p.updatedAt || "",
  };
}

export async function GET(request: Request) {
  const startedAt = Date.now();

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  const rate = searchRateLimit
    ? await searchRateLimit.limit(ip)
    : { success: true };

  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many searches. Please try again shortly." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";
  const category = searchParams.get("category")?.trim() || "";

  if (!q && !category) {
    return NextResponse.json(
      { products: [] },
      { headers: cacheHeaders.search }
    );
  }

  const queryText = q || category;

  if (queryText.length > 80) {
    return NextResponse.json(
      { error: "Search query is too long." },
      { status: 400 }
    );
  }

  if (queryText.length < 2) {
    return NextResponse.json(
      { products: [] },
      { headers: cacheHeaders.search }
    );
  }

  if (!/^[a-zA-Z0-9\s\-&.,()]+$/.test(queryText)) {
    return NextResponse.json(
      { error: "Search contains unsupported characters." },
      { status: 400 }
    );
  }

  if (!elastic) {
    return NextResponse.json(
      { products: [], error: "Elasticsearch is not configured." },
      { status: 200 }
    );
  }

  try {
    const result = await elastic.search<ProductSource>(
      {
        index: PRODUCT_INDEX,
        size: 12,
        query: {
          bool: {
            should: [
              {
                term: {
                  barcode: {
                    value: queryText,
                    boost: 20,
                  },
                },
              },
              {
                match_phrase_prefix: {
                  name: {
                    query: queryText,
                    boost: 8,
                  },
                },
              },
              {
                multi_match: {
                  query: queryText,
                  type: "bool_prefix",
                  fields: [
                    "name^5",
                    "name._2gram^3",
                    "name._3gram^3",
                    "brand^3",
                    "brand._2gram",
                    "brand._3gram",
                    "category^2",
                  ],
                  boost: 4,
                },
              },
              {
                multi_match: {
                  query: queryText,
                  fields: [
                    "name^4",
                    "brand^3",
                    "category^2",
                    "ingredients",
                  ],
                  fuzziness: queryText.length >= 4 ? "AUTO" : 0,
                  prefix_length: 2,
                  max_expansions: 25,
                  boost: 2,
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
      },
      {
        requestTimeout: 3000,
      }
    );

    const products = result.hits.hits.map(mapProduct);

    if (process.env.NODE_ENV === "development") {
      console.log("Search API completed in", Date.now() - startedAt, "ms");
    }

    return NextResponse.json(
      { products },
      { headers: cacheHeaders.search }
    );
  } catch (error) {
    console.error("Search API error:", error);

    return NextResponse.json(
      { error: "Search temporarily unavailable." },
      { status: 500 }
    );
  }
}