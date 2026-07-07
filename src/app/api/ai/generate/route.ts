import { NextResponse } from "next/server";
import { generate } from "@/lib/ai/gemini-client";

export async function POST(req: Request) {
  try {
    const { prompt, options } = await req.json();
    const result = await generate(prompt, options);
    return NextResponse.json({ result });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("AI Generation Proxy error:", err);
    return NextResponse.json({ error: err.message || "AI Generation failed" }, { status: 500 });
  }
}
