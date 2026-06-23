import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { securityGuard } from "@/lib/securityEngine";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { error: "Image required" },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
  return NextResponse.json(
    { error: "Invalid image type." },
    { status: 400 }
  );
}

if (image.size > 8 * 1024 * 1024) {
  return NextResponse.json(
    { error: "Image is too large." },
    { status: 400 }
  );
}

const security = await securityGuard({
  eventName: "food_photo",
  request: req,
  metadata: {
    file_size_mb: Number((image.size / (1024 * 1024)).toFixed(2)),
    file_type: image.type,
  },
});

if (!security.allowed) {
  return NextResponse.json(
    {
      error: "Food photo analysis is temporarily limited. Please try again later.",
      cooldownSeconds: security.cooldownSeconds,
    },
    { status: 429 }
  );
}

    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: image.type,
            data: base64,
          },
        },
        {
          text: `
Analyze this food image.

Return ONLY valid JSON:

{
  "foodName": "",
  "confidence": 0,
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0,
  "healthScore": 0,
  "verdict": "",
  "healthierSuggestion": ""
}
`,
        },
      ],
    });

    const text = response.text ?? "";

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
