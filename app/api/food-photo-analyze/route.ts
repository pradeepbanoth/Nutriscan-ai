import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof File)) {
      return Response.json(
        { error: "Image required" },
        { status: 400 }
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

    return Response.json(JSON.parse(text));
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
