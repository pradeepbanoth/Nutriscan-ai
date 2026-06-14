import { nutritionRateLimit } from "@/lib/rateLimit";
import { cacheHeaders } from "@/lib/cacheHeaders";



let cachedToken: string | null = null;
let cachedTokenExpiry = 0;

async function getFatSecretToken() {
  const now = Date.now();

  if (cachedToken && now < cachedTokenExpiry) {
    return cachedToken;
  }

  const credentials = Buffer.from(
    `${process.env.FATSECRET_CLIENT_ID}:${process.env.FATSECRET_CLIENT_SECRET}`
  ).toString("base64");

  const tokenRes = await fetch("https://oauth.fatsecret.com/connect/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=basic",
  });

  if (!tokenRes.ok) {
    return null;
  }

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return null;
  }

  cachedToken = tokenData.access_token;
  cachedTokenExpiry = now + 50 * 60 * 1000;

  return cachedToken;
}
export async function GET(req: Request) {
  const startedAt = Date.now();
  const ip =
  req.headers.get("x-forwarded-for") ||
  req.headers.get("x-real-ip") ||
  "anonymous";

const rate = nutritionRateLimit
  ? await nutritionRateLimit.limit(ip)
  : { success: true };

if (!rate.success) {
  return Response.json(
    { error: "Too many nutrition requests. Please try again shortly." },
    { status: 429 }
  );
}
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();

 if (!query) {
  return Response.json(
    { error: "Missing query" },
    {
      status: 400,
    headers: cacheHeaders.short,
    }
  );
}

  if (query.length > 80) {
    return Response.json(
      { error: "Search query is too long." },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getFatSecretToken();

if (!accessToken) {
  return Response.json(
    { error: "Nutrition service unavailable." },
    { status: 502 }
  );
}

   const foodRes = await fetch(
  `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${encodeURIComponent(
    query
  )}&format=json`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 60 * 60,
    },
  }
);

    if (!foodRes.ok) {
      return Response.json(
        { error: "Nutrition search unavailable." },
        { status: 502 }
      );
    }

    const data = await foodRes.json();

    if (process.env.NODE_ENV === "development") {
  console.log("FatSecret search API completed in", Date.now() - startedAt, "ms");
}
    console.log("FatSecret search API completed in", Date.now() - startedAt, "ms");
    return Response.json(data, {
 headers: cacheHeaders.nutrition,
});
  } catch (error) {
    console.error("FatSecret API error:", error);

    return Response.json(
      { error: "Nutrition search temporarily unavailable." },
      { status: 500 }
    );
  }
}