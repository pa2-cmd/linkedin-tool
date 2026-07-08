/**
 * LinkedIn Editor Agent
 * Scores and rewrites LinkedIn post drafts for maximum engagement.
 */

import { generateJSON } from "./gemini-client";

export interface EditPostInput {
  post: string;
  format: string;
  audience: string;
  apiKey: string;
  aiModel?: "flash" | "pro";
}

export interface EditResult {
  editedPost: string;
  hookScore: number;
  dwellTimeScore: number;
  engagementScore: number;
  hashtagQuality: number;
  overallScore: number;
  improvements: string[];
  suggestedHashtags: string[];
}

export async function editLinkedInPost(input: EditPostInput): Promise<EditResult> {
  const modelTier = input.aiModel === "pro" ? "pro" : "flash";
  
  const prompt = `You are a ruthless LinkedIn content editor. Your edits have turned mediocre posts into viral hits with 100K+ impressions.

TASK: Edit and score this LinkedIn post. Be AGGRESSIVE with improvements.

ORIGINAL POST:
"""
${input.post}
"""

FORMAT: ${input.format}
TARGET AUDIENCE: ${input.audience}

YOUR EDITING PHILOSOPHY:
1. The hook (first line) must be impossible to scroll past. Rewrite it if it's weak.
2. Remove every generic phrase and replace with specifics (numbers, names, examples).
3. Add strategic line breaks for dwell time. LinkedIn rewards time spent reading.
4. Each paragraph should be 1-2 sentences maximum.
5. The CTA (call-to-action) should feel like a genuine invitation, not a sales pitch.
6. Hashtags: Suggest 3-5 optimal ones. Remove spammy or over-used ones.
7. Check emoji usage — max 1-3, meaningful only.
8. Ensure total length is 800-1500 characters for optimal reach.

STRICT EDITING RULES:
- Identify and REMOVE any "AI-isms" (e.g. leverage, utilize, robust, streamline, delve, testament, landscape, foster, seamless, pivotal, unlock, revolutionizing).
- Convert any emoji-heavy bullet lists into plain bullet points (e.g., using numbers or simple dashes "-"). Emojis should never decorate the start of list lines.
- Ensure the resulting text flows naturally like a human post, and reads with an authentic, conversational voice.

Return this JSON:
{
  "editedPost": "the fully improved post — noticeably better than the original",
  "hookScore": <0-100, how strong is the first line?>,
  "dwellTimeScore": <0-100, will people read the whole thing?>,
  "engagementScore": <0-100, will this drive comments/shares?>,
  "hashtagQuality": <0-100, are the hashtags relevant and strategic?>,
  "overallScore": <0-100>,
  "improvements": ["specific change made and WHY it's better"],
  "suggestedHashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
}

SCORING: Most posts land 50-70. Only give 85+ if genuinely exceptional. Be honest.`;

  return (await generateJSON(prompt, { apiKey: input.apiKey, tier: modelTier })) as unknown as EditResult;
}
