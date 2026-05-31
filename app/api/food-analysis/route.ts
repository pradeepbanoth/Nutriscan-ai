import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key missing in .env.local" },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const prompt = `
Analyze this food/product image for PAUSTICA.

Return ONLY raw valid JSON. No markdown. No explanation.

{
  "name": "detected food name",
  "calories": "estimated calories per 100g",
  "processing": "low processed / processed / ultra processed",
  "score": 0,
  "risks": ["risk 1", "risk 2", "risk 3"],
  "alternatives": ["alternative 1", "alternative 2", "alternative 3"]
}
`;

    const geminiRes = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
{        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: file.type || "image/png",
                    data: base64Image,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      console.log("Gemini API Error:", geminiData);

      return NextResponse.json(
        {
          error:
            geminiData?.error?.message ||
            "Gemini API rejected the request",
        },
        { status: 500 }
      );
    }

    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let result;

    try {
      result = JSON.parse(cleanedText);
    } catch {
      console.log("Gemini returned non-JSON:", rawText);

      return NextResponse.json(
        {
          error: "Gemini returned invalid JSON",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.log("Food analysis route error:", error);

    return NextResponse.json(
      { error: "Failed to analyze food image" },
      { status: 500 }
    );
  }
}