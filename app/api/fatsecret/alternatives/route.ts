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
      return Response.json({ alternatives: [] }, { status: 502 });
    }

    const tokenData = await tokenRes.json();

   const searchTerms = [
  `low sugar ${query}`,
  `low calorie ${query}`,
  `high protein ${query}`,
  `healthy ${query}`,
  `baked ${query}`,
  `unsweetened ${query}`,
];

    const results: FatSecretFood[] = [];

    for (const term of searchTerms) {
      const foodRes = await fetch(
        `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${encodeURIComponent(
          term
        )}&format=json&max_results=5`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );

      if (!foodRes.ok) continue;

      const data = await foodRes.json();
      const foods = data?.foods?.food;

      if (Array.isArray(foods)) {
        results.push(...foods);
      } else if (foods) {
        results.push(foods);
      }
    }

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

    return Response.json({
      alternatives: unique.map((item: FatSecretFood) => ({
        id: item.food_id,
        name: item.food_name,
        description: item.food_description,
        url: item.food_url,
      })),
    });
  } catch (error) {
    console.error("FatSecret alternatives error:", error);
    return Response.json({ alternatives: [] }, { status: 500 });
  }
}