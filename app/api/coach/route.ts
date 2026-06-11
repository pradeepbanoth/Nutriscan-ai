import { NextResponse } from "next/server";
import { nutritionRateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "anonymous";

  const rate = nutritionRateLimit
    ? await nutritionRateLimit.limit(ip)
    : { success: true };

  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many coach requests. Please try again shortly." },
      { status: 429 }
    );
  }

  try {
    const { message, context } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (message.length > 600) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service is not configured." },
        { status: 500 }
      );
    }

    const prompt = `
You are PAUSTICA AI Nutrition Coach.

Rules:
- Give practical, clear nutrition guidance.
- Do not diagnose diseases.
- Do not replace a doctor or dietitian.
- Keep answer under 140 words.
- Be specific to the user's scanned-food history.
- Avoid fear-based language.
- Suggest healthier habits and alternatives.

User context:
${JSON.stringify(context || {}, null, 2)}

User question:
${message}
`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      return NextResponse.json(
        {
          error:
            geminiData?.error?.message ||
            "AI coach temporarily unavailable.",
        },
        { status: 502 }
      );
    }

    const answer =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate advice right now.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Coach API error:", error);

    return NextResponse.json(
      { error: "Failed to generate coaching advice." },
      { status: 500 }
    );
  }
}