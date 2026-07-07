/**
 * LinkedIn Growth Tool — Gemini AI Client
 * Handles all communication with Google Gemini API.
 * Supports both server-side (.env) and client-side (localStorage) API keys.
 */

import { GoogleGenAI } from "@google/genai";

const _clientCache: Map<string, GoogleGenAI> = new Map();

function getClient(apiKey: string): GoogleGenAI {
  if (!apiKey) throw new Error("Gemini API key is required");
  if (!_clientCache.has(apiKey)) {
    _clientCache.set(apiKey, new GoogleGenAI({ apiKey }));
  }
  return _clientCache.get(apiKey)!;
}

function getApiKey(providedKey?: string): string {
  if (providedKey) return providedKey;
  const envKey = process.env.GEMINI_API_KEY;
  if (envKey) return envKey;
  throw new Error("No Gemini API key provided. Set it in Settings or in .env.local");
}

/**
 * Generate text content with Gemini.
 */
export async function generate(
  prompt: string,
  options: {
    apiKey?: string;
    tier?: "pro" | "flash";
    jsonMode?: boolean;
    maxRetries?: number;
  } = {}
): Promise<string | Record<string, unknown>> {
  const { tier = "flash", jsonMode = false, maxRetries = 2 } = options;

  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, options }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Proxy error: ${res.statusText}`);
      }
      const data = await res.json();
      return data.result;
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      throw new Error(error.message || "Failed to generate AI content via proxy");
    }
  }

  const key = getApiKey(options.apiKey);
  const ai = getClient(key);
  const model = tier === "pro" ? "gemini-2.5-pro" : "gemini-2.5-flash";

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        ...(jsonMode ? { config: { responseMimeType: "application/json" } } : {}),
      });
      const text = response.text || "";

      if (jsonMode) {
        return parseJSON(text);
      }
      return text;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`Gemini attempt ${attempt + 1} failed:`, lastError.message);
      if (attempt < maxRetries) {
        await sleep(1000 * (attempt + 1));
      }
    }
  }

  throw new Error(`Gemini generation failed after ${maxRetries + 1} attempts: ${lastError?.message}`);
}

/**
 * Generate structured JSON output.
 */
export async function generateJSON(
  prompt: string,
  options: { apiKey?: string; tier?: "pro" | "flash" } = {}
): Promise<Record<string, unknown>> {
  const result = await generate(prompt, { ...options, jsonMode: true });
  return result as Record<string, unknown>;
}

/**
 * Robust JSON parser — handles markdown-wrapped JSON responses.
 */
function parseJSON(text: string): Record<string, unknown> {
  // Direct parse
  try { return JSON.parse(text); } catch {}

  // Extract from markdown code blocks
  const jsonBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlock) {
    try { return JSON.parse(jsonBlock[1].trim()); } catch {}
  }

  // Find JSON object or array
  const jsonMatch = text.match(/([\[{][\s\S]*[\]}])/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[1]); } catch {}
  }

  throw new Error("Failed to parse AI response as JSON");
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
