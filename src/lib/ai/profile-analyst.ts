/**
 * LinkedIn Profile Analyst Agent
 * Audits LinkedIn profile sections and generates optimized rewrites.
 */

import { generateJSON } from "./gemini-client";

export interface ProfileAuditInput {
  headline: string;
  about: string;
  experience?: string;
  skills?: string;
  industry: string;
  targetAudience: string;
  apiKey: string;
}

export interface ProfileAuditResult {
  overallScore: number;
  headlineScore: number;
  aboutScore: number;
  gaps: string[];
  strengths: string[];
  headlineRewrites: {
    thoughtLeader: string;
    storyteller: string;
    seoBooster: string;
  };
  aboutRewrites: {
    thoughtLeader: string;
    storyteller: string;
    seoBooster: string;
  };
  experienceTips: string[];
  skillsSuggestions: string[];
  bannerAdvice: string;
  featuredSectionTips: string[];
  ssiTips: string[];
  keywordsMissing: string[];
}

export async function auditProfile(input: ProfileAuditInput): Promise<ProfileAuditResult> {
  const today = new Date().toISOString().split("T")[0];

  const prompt = `You are an elite LinkedIn Profile Strategist and Personal Branding Expert.

DATE: ${today}

TASK: Perform a comprehensive audit of this LinkedIn profile and generate optimized rewrites.

PROFILE DATA:
- Industry: ${input.industry}
- Target Audience: ${input.targetAudience}
- Current Headline: "${input.headline || "Not provided"}"
- Current About/Summary: "${input.about || "Not provided"}"
- Experience Summary: "${input.experience || "Not provided"}"
- Skills Listed: "${input.skills || "Not provided"}"

LINKEDIN ALGORITHM KNOWLEDGE (2025-2026):
- LinkedIn SSI (Social Selling Index) weighs: professional brand, finding people, engaging with insights, building relationships
- Headlines should be keyword-rich (LinkedIn search indexes them heavily)
- The About section's first 3 lines appear above the fold — they MUST hook
- Featured sections boost credibility when they showcase articles, media, or testimonials
- Skills endorsements affect search ranking — order matters
- Profile completeness directly affects search visibility
- Creator mode boosts content reach for profiles with consistent posting

SCORING RULES:
- 0-30: Critical gaps, profile is essentially invisible
- 31-50: Below average, missing fundamental positioning
- 51-70: Functional but not optimized for growth
- 71-85: Strong profile with minor improvements needed
- 86-100: Elite profile, well-positioned for growth

Return this EXACT JSON structure:
{
  "overallScore": <0-100>,
  "headlineScore": <0-100>,
  "aboutScore": <0-100>,
  "gaps": ["specific actionable gap 1", "gap 2", ...],
  "strengths": ["what they're doing well 1", ...],
  "headlineRewrites": {
    "thoughtLeader": "<220 char max, authority-driven headline>",
    "storyteller": "<220 char max, narrative/hook headline>",
    "seoBooster": "<220 char max, keyword-rich for LinkedIn search>"
  },
  "aboutRewrites": {
    "thoughtLeader": "<2600 char max, authority-driven about section with clear value prop>",
    "storyteller": "<2600 char max, narrative-driven about with a hook opening>",
    "seoBooster": "<2600 char max, keyword-optimized for LinkedIn search algorithm>"
  },
  "experienceTips": ["actionable tip for experience descriptions"],
  "skillsSuggestions": ["skill 1 to add", "skill 2 to add"],
  "bannerAdvice": "specific advice for the LinkedIn banner image",
  "featuredSectionTips": ["what to pin in Featured section"],
  "ssiTips": ["tip to improve Social Selling Index"],
  "keywordsMissing": ["keyword they should include based on their industry"]
}

Be specific, actionable, and honest with scores. Most profiles score 40-65.`;

  return (await generateJSON(prompt, { apiKey: input.apiKey, tier: "flash" })) as unknown as ProfileAuditResult;
}
