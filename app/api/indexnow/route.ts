import { NextResponse } from "next/server";

const host = "nutriscan-ai-orpin.vercel.app";

export async function GET() {
  return NextResponse.json({
    status: "IndexNow route is ready",
    usage: "Send a POST request with { urls: ['https://nutriscan-ai-orpin.vercel.app/'] }",
  });
}

export async function POST(request: Request) {
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    return NextResponse.json(
      { error: "Missing INDEXNOW_KEY" },
      { status: 500 }
    );
  }
  

  const body = await request.json().catch(() => ({}));

  const urls =
    Array.isArray(body.urls) && body.urls.length > 0
      ? body.urls
      : [`https://${host}/`, `https://${host}/trust`];

  const validUrls = urls.filter(
    (url: string) =>
      typeof url === "string" &&
      url.startsWith(`https://${host}`)
  );

  if (validUrls.length === 0) {
    return NextResponse.json(
      { error: "No valid URLs provided" },
      { status: 400 }
    );
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
    submitted: validUrls.length,
  });
}