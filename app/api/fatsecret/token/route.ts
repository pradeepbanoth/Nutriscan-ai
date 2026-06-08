export async function GET() {
  const credentials = Buffer.from(
    `${process.env.FATSECRET_CLIENT_ID}:${process.env.FATSECRET_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(
    "https://oauth.fatsecret.com/connect/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials&scope=basic",
    }
  );

  const data = await response.json();

  return Response.json(data);
}