type FatSecretTokenResponse = {
  access_token?: string;
};

export function normalizeBarcodeToGTIN13(barcode: string) {
  const digits = barcode.replace(/\D/g, "");

  if (digits.length > 13) return null;

  return digits.padStart(13, "0");
}

export async function getFatSecretToken() {
  const clientId = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing FatSecret credentials");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const tokenRes = await fetch("https://oauth.fatsecret.com/connect/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=basic",
  });

  if (!tokenRes.ok) {
    throw new Error("Failed to get FatSecret token");
  }

  const tokenData = (await tokenRes.json()) as FatSecretTokenResponse;

  if (!tokenData.access_token) {
    throw new Error("FatSecret token missing");
  }

  return tokenData.access_token;
}

export async function findFatSecretFoodIdByBarcode(barcode: string) {
  const gtin13 = normalizeBarcodeToGTIN13(barcode);

  if (!gtin13) return null;

  const token = await getFatSecretToken();

  const res = await fetch(
    `https://platform.fatsecret.com/rest/server.api?method=food.find_id_for_barcode&barcode=${encodeURIComponent(
      gtin13
    )}&format=json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) return null;

  const data = await res.json();

  return data?.food_id || data?.food?.food_id || null;
}

export async function getFatSecretFood(foodId: string | number) {
  const token = await getFatSecretToken();

  const res = await fetch(
    `https://platform.fatsecret.com/rest/server.api?method=food.get&food_id=${encodeURIComponent(
      String(foodId)
    )}&format=json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) return null;

  return res.json();
}