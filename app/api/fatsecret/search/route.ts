export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return Response.json({ error: "Missing query" }, { status: 400 });
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

  const tokenData = await tokenRes.json();

  const foodRes = await fetch(
    `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${encodeURIComponent(
      query
    )}&format=json`,
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );

  const data = await foodRes.json();

  return Response.json(data);
}