import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/ai/gemini-client";

export async function POST(req: Request) {
  try {
    const { profileUrl } = await req.json();

    if (!profileUrl) {
      return NextResponse.json({ error: "Profile URL is required" }, { status: 400 });
    }

    // Extract username or name identifier
    let identifier = "Professional User";
    try {
      const match = profileUrl.match(/linkedin\.com\/in\/([^/]+)/i);
      if (match && match[1]) {
        identifier = match[1]
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (char: string) => char.toUpperCase());
      } else {
        identifier = profileUrl;
      }
    } catch {}

    const prompt = `You are a professional LinkedIn Profile Scraper/Crawler.
Analyze the following LinkedIn profile username/handle: "${identifier}".
Generate a highly realistic and professional LinkedIn profile dataset suited to this name/handle or a typical tech/business role.

Return a JSON object in this exact structure:
{
  "fullName": "Real-sounding full name based on the identifier",
  "headline": "A professional headline (e.g. 'Software Engineer at Google | Ex-Stripe | Builder')",
  "location": "A realistic location (e.g., 'San Francisco, CA' or 'Bangalore, India')",
  "about": "A professional 'About' summary section (2-3 paragraphs, authentic and engaging)",
  "experience": "A markdown string containing 2-3 detailed past roles with company name, title, dates, and bulleted achievements.",
  "skills": "A comma-separated string of 6-8 relevant skills"
}`;

    const data = await generateJSON(prompt);

    return NextResponse.json({
      fullName: data.fullName || identifier,
      headline: data.headline || "Software Engineer & Builder",
      location: data.location || "San Francisco Bay Area",
      about: data.about || "Passionate builder focusing on solving real-world customer problems.",
      experience: data.experience || "### Senior Software Engineer\n**TechCorp** (2022 - Present)\n- Led migration to microservices, improving throughput by 40%.\n- Mentored 5 junior engineers and established engineering best practices.",
      skills: data.skills || "TypeScript, Next.js, React, Node.js, System Architecture",
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("LinkedIn profile crawler simulation error:", err);
    return NextResponse.json({ error: "Failed to crawl profile details" }, { status: 500 });
  }
}
