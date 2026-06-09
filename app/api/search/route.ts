import { NextResponse } from "next/server";
import type { SearchHit } from "@elastic/elasticsearch/lib/api/types";
import { elastic, PRODUCT_INDEX } from "@/lib/elasticsearch";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ products: [] });
  }

  const result = await elastic.search<ProductSource>({
    index: PRODUCT_INDEX,
    size: 8,
    query: {
      bool: {
        should: [
          {
            term: {
              barcode: {
                value: q,
                boost: 10,
              },
            },
          },
          {
            multi_match: {
              query: q,
              type: "bool_prefix",
              fields: [
                "name",
                "name._2gram",
                "name._3gram",
                "brand",
                "brand._2gram",
                "brand._3gram",
              ],
              boost: 4,
            },
          },
          {
            multi_match: {
              query: q,
              fields: ["name", "brand", "category", "ingredients"],
              fuzziness: "AUTO",
              boost: 2,
            },
          },
        ],
      },
    },
  });

  const products = result.hits.hits.map((hit: SearchHit<ProductSource>) => ({
    id: hit._id,
    score: hit._score,
    ...hit._source,
  }));

  return NextResponse.json({ products });
}