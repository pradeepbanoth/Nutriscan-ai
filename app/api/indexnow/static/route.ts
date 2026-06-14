import { NextResponse } from "next/server";

const host = "nutriscan-ai-orpin.vercel.app";


export async function POST(request: Request) {
const key = process.env.INDEXNOW_KEY;

const adminSecret = process.env.INDEXNOW_ADMIN_SECRET;
const providedSecret = request.headers.get("x-indexnow-secret");

if (!adminSecret || providedSecret !== adminSecret) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
  if (!key) {
    return NextResponse.json(
      { error: "Missing INDEXNOW_KEY" },
      { status: 500 }
    );
  }

  const urlList = [
    `https://${host}/`,
    `https://${host}/trust`,
    `https://${host}/sitemap.xml`,
  ];

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `https://${host}/${key}.txt`,
      urlList,
    }),
  });

  return NextResponse.json({
    success: response.ok,
    submitted: urlList,
  });
}