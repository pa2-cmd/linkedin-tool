import { NextResponse } from "next/server";

export async function GET() {
  const hasSystemKey = !!process.env.GEMINI_API_KEY;
  return NextResponse.json({ hasSystemKey });
}
