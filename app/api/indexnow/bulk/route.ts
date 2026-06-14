import { NextResponse } from "next/server";

const host = "nutriscan-ai-orpin.vercel.app";

export async function POST(request: Request) {
  const key = process.env.INDEXNOW_KEY;
  const adminSecret = process.env.INDEXNOW_ADMIN_SECRET;
  const providedSecret = request.headers.get("x-indexnow-secret");

  if (!adminSecret || providedSecret !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!key) {
    return NextResponse.json({ error: "Missing INDEXNOW_KEY" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));

  const urls =
    Array.isArray(body.urls) && body.urls.length > 0
      ? body.urls
      : [];

  const validUrls = urls
    .filter(
      (url: string) =>
        typeof url === "string" &&
        url.startsWith(`https://${host}`)
    )
    .slice(0, 10000);

  if (validUrls.length === 0) {
    return NextResponse.json({ error: "No valid URLs provided" }, { status: 400 });
  }

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `https://${host}/${key}.txt`,
      urlList: validUrls,
    }),
  });

  return NextResponse.json({
    success: response.ok,
    submittedCount: validUrls.length,
  });
}