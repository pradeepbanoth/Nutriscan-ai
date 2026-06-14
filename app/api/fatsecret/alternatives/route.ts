
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
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();

type FatSecretFood = {
  food_id: string;
  food_name: string;
  food_description?: string;
  food_url?: string;
};

  if (!query) {
    return Response.json({ alternatives: [] });
  }

  if (query.length > 80) {
    return Response.json(
      { error: "Query is too long." },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getFatSecretToken();

if (!accessToken) {
  return Response.json({ alternatives: [] }, { status: 502 });
}

   const searchTerms = [
  `low sugar ${query}`,
  `low calorie ${query}`,
  `high protein ${query}`,
  `healthy ${query}`,
  `baked ${query}`,
  `unsweetened ${query}`,
];

   const responses = await Promise.allSettled(
  searchTerms.map(async (term) => {
    const foodRes = await fetch(
      `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${encodeURIComponent(
        term
      )}&format=json&max_results=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!foodRes.ok) return [];

    const data = await foodRes.json();
    const foods = data?.foods?.food;

    if (Array.isArray(foods)) return foods;
    if (foods) return [foods];

    return [];
  })
);

const results: FatSecretFood[] = responses
  .filter((result) => result.status === "fulfilled")
  .flatMap((result) => result.value);

   const bannedWords = [
  "fried",
  "cream",
  "syrup",
  "sugar",
  "candy",
  "chocolate",
  "cake",
  "dessert",
];

const unique = Array.from(
  new Map(
    results.map((item: FatSecretFood) => [item.food_id, item])
  ).values()
)
  .filter((item) => {
    const text = `${item.food_name} ${item.food_description || ""}`.toLowerCase();

    return !bannedWords.some((word) => text.includes(word));
  })
  .slice(0, 6);

  return Response.json(
  {
    alternatives: unique.map((item: FatSecretFood) => ({
      id: item.food_id,
      name: item.food_name,
      description: item.food_description,
      url: item.food_url,
    })),
  },
  {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  }
);
  } catch (error) {
    console.error("FatSecret alternatives error:", error);
    return Response.json({ alternatives: [] }, { status: 500 });
  }
}