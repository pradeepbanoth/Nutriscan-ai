import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://nutriscan-ai-orpin.vercel.app";

  const res = await fetch(`${baseUrl}/api/products/sync-openfoodfacts`, {
    method: "POST",
    headers: {
      "x-sync-secret": process.env.SYNC_SECRET || "",
    },
  });

  const data = await res.json();

  return NextResponse.json(data);
}