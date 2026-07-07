/**
 * LinkedIn Writer Agent
 * Generates LinkedIn posts optimized for the platform's algorithm.
 */

import { generate } from "./gemini-client";

export type PostFormat =
  | "thought_leadership"
  | "carousel_outline"
  | "hook_spark"
  | "news_commentary"
  | "story_post";

export interface WritePostInput {
  topic: string;
  format: PostFormat;
  tone: string;
  audience: string;
  industry: string;
  contentPillars: string[];
  brandVoice: string;
  apiKey: string;
}

const FORMAT_SPECS: Record<PostFormat, { name: string; structure: string; notes: string }> = {
  thought_leadership: {
    name: "Thought Leadership Post",
    structure: "Hook line (bold claim or insight) → 2 blank lines → Context (2-3 sentences) → Key insight with data → 3-5 bullet takeaways → Soft CTA with question",
    notes: "First line MUST stop the feed. Use ample line breaks (LinkedIn rewards dwell time). Mix personal experience with data. Keep paragraphs 1-2 sentences max. End with an engaging question to drive comments. Max 3-5 relevant hashtags at the very end.",
  },
  carousel_outline: {
    name: "Carousel Outline (PDF Text)",
    structure: "Slide 1: Bold hook title → Slides 2-3: Problem setup → Slides 4-8: Framework/Tips → Slide 9: Summary → Slide 10: CTA + follow prompt",
    notes: "Max 25 words per slide. Each slide must create a reason to swipe. Use numbers, contrarian takes, or frameworks. Write the caption text separately (short hook + hashtags). Output both slide content AND caption.",
  },
  hook_spark: {
    name: "Mini Hook & Spark",
    structure: "Provocative one-liner → blank line → 2-3 sentence expansion → Question that invites replies",
    notes: "Ultra-short format. Designed to spark conversation in comments. The hook should be a bold statement, surprising stat, or contrarian take. Under 500 characters total.",
  },
  news_commentary: {
    name: "Industry News Commentary",
    structure: "News reference (what happened) → Your take (why it matters) → What it means for the audience → Question or prediction",
    notes: "Position yourself as a thought leader by adding unique perspective to trending news. Reference the source. Add 2-3 takeaways. Keep it under 1300 characters.",
  },
  story_post: {
    name: "Personal Story Post",
    structure: "Hook (surprising moment or failure) → Scene setting → Conflict/challenge → Resolution/lesson → Takeaway for the reader → CTA",
    notes: "LinkedIn rewards vulnerability and authenticity. Use 'I' statements. Show the messy middle, not just the win. Line breaks between every 1-2 sentences. Most engaging format on LinkedIn.",
  },
};

const TONE_MAP: Record<string, string> = {
  professional: "Professional, authoritative, data-backed. Like a McKinsey consultant sharing insights.",
  casual: "Casual, conversational, warm. Like a smart colleague sharing over coffee.",
  inspirational: "Inspirational, motivating, uplifting. Encourages action and personal growth.",
  contrarian: "Contrarian, bold, debate-sparking. Challenges conventional wisdom with evidence.",
  educational: "Educational, clear, step-by-step. Makes complex ideas simple with examples.",
  storytelling: "Story-driven, narrative arc. Opens with a scene, builds tension, delivers the lesson.",
  data_driven: "Data-heavy, research-backed. Every claim has a number or citation.",
};

export async function writeLinkedInPost(input: WritePostInput): Promise<string> {
  const spec = FORMAT_SPECS[input.format] || FORMAT_SPECS.thought_leadership;
  const toneDesc = TONE_MAP[input.tone] || TONE_MAP.professional;
  const today = new Date().toISOString().split("T")[0];

  const prompt = `You are an elite LinkedIn content strategist who has helped 500+ professionals grow their LinkedIn following.

DATE: ${today}

TASK: Write a ${spec.name} about "${input.topic}" for LinkedIn.

CONTEXT:
- Author's Industry: ${input.industry}
- Target Audience: ${input.audience}
- Content Pillars: ${input.contentPillars.join(", ")}
- Brand Voice: ${input.brandVoice}
- Desired Tone: ${toneDesc}

FORMAT SPECIFICATION:
- Name: ${spec.name}
- Structure: ${spec.structure}
- Platform Rules: ${spec.notes}

LINKEDIN ALGORITHM RULES (2025-2026):
1. First line is EVERYTHING — it appears before "...see more". Make it impossible to not click.
2. LinkedIn rewards dwell time. Use line breaks generously (double-space between paragraphs).
3. Posts with 1-2 sentences per paragraph perform 40% better than walls of text.
4. Questions at the end drive 2x more comments.
5. Hashtags: Use 3-5 maximum. Place them at the very end, not inline.
6. Emojis: Use sparingly (1-3 max). They should add meaning, not decoration.
7. Posts between 800-1500 characters get the most engagement.
8. Personal stories with lessons outperform generic advice 3:1.

QUALITY RULES:
- NO generic platitudes ("In today's fast-paced world...", "It's no secret that...")
- NO filler sentences. Every line must earn its place.
- Use specific numbers, examples, or stories — not vague claims.
- The hook must be a bold claim, surprising stat, personal failure, or contrarian take.
- Write like a real human, not a corporate press release.

Output ONLY the LinkedIn post text. No markdown, no explanations, no JSON wrapper.`;

  const result = await generate(prompt, { apiKey: input.apiKey, tier: "flash" });
  return typeof result === "string" ? result : JSON.stringify(result);
}
