import { NextResponse } from "next/server";
import { elastic, PRODUCT_INDEX } from "@/lib/elasticsearch";

export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-sync-secret");

    if (secret !== process.env.SYNC_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Creating/checking index:", PRODUCT_INDEX);

    const exists = await elastic.indices.exists({
      index: PRODUCT_INDEX,
    });

    if (exists) {
      return NextResponse.json({
        ok: true,
        message: "Index already exists",
        index: PRODUCT_INDEX,
      });
    }

    await elastic.indices.create({
      index: PRODUCT_INDEX,
      mappings: {
        properties: {
          barcode: { type: "keyword" },
          name: { type: "search_as_you_type" },
          brand: { type: "search_as_you_type" },
          category: { type: "text" },
          ingredients: { type: "text" },
          nutriscore: { type: "keyword" },
          nova: { type: "integer" },
          image: { type: "keyword", index: false },
          sugar: { type: "float" },
          fat: { type: "float" },
          salt: { type: "float" },
          source: { type: "keyword" },
          updatedAt: { type: "date" },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Index created",
      index: PRODUCT_INDEX,
    });
  } catch (error: unknown) {
  console.error("Create index failed:", error);

  return NextResponse.json(
    {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    },
    { status: 500 }
  );
}
}