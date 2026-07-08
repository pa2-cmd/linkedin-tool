/**
 * LinkedIn Growth Tool — localStorage helpers for settings & session state.
 * Prisma/SQLite handles persistent data (posts, metrics, snapshots).
 * localStorage handles volatile session state (settings, API key, onboarding).
 */

import { useMemo, useSyncExternalStore } from "react";

// ═══ STORAGE KEYS ═══
const KEYS = {
  settings: "linkedin_settings",
  onboarded: "linkedin_onboarded",
  chatHistory: "linkedin_chat_history",
} as const;

const STORAGE_EVENT = "linkedin-storage-updated";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readString(key: string, fallback: string): string {
  if (!canUseStorage()) return fallback;
  return localStorage.getItem(key) ?? fallback;
}

function writeString(key: string, value: string): void {
  if (!canUseStorage()) return;
  localStorage.setItem(key, value);
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}

function readJSON<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  writeString(key, JSON.stringify(value));
}

export function subscribeToStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(STORAGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(STORAGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function useStorageString(key: string, fallback: string): string {
  return useSyncExternalStore(
    subscribeToStorage,
    () => readString(key, fallback),
    () => fallback
  );
}

export interface LinkedInSettings {
  // Identity
  fullName: string;
  headline: string;
  location: string;
  profilePhotoUrl: string;
  bannerUrl: string;
  about: string;
  experience: string;
  skills: string;

  // LinkedIn Context
  industry: string;
  targetAudience: string;
  contentPillars: string[]; // 3-5 topics user posts about
  competitors: string; // competitor LinkedIn URLs
  brandVoice: string;

  // Engine
  geminiApiKey: string;
  aiModel: "flash" | "pro";
  responseStyle: string;

  // Session Cookies for Scraping
  liAtCookie: string;
  jSessionId: string;
}

export const DEFAULT_SETTINGS: LinkedInSettings = {
  fullName: "",
  headline: "",
  location: "India",
  profilePhotoUrl: "",
  bannerUrl: "",
  about: "",
  experience: "",
  skills: "",
  industry: "",
  targetAudience: "",
  contentPillars: [],
  competitors: "",
  brandVoice: "Professional, insightful, and authentic.",
  geminiApiKey: "",
  aiModel: "flash",
  responseStyle: "balanced",
  liAtCookie: "",
  jSessionId: "",
};

export function getSettings(): LinkedInSettings {
  return readJSON(KEYS.settings, DEFAULT_SETTINGS);
}

export function saveSettings(settings: Partial<LinkedInSettings>): void {
  const current = getSettings();
  writeJSON(KEYS.settings, { ...current, ...settings });
}

export function useSettings(): LinkedInSettings {
  const raw = useStorageString(KEYS.settings, JSON.stringify(DEFAULT_SETTINGS));
  return useMemo(() => {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }, [raw]);
}

// ═══ ONBOARDING ═══
export function isOnboarded(): boolean {
  return readString(KEYS.onboarded, "false") === "true";
}

export function setOnboarded(value: boolean): void {
  writeString(KEYS.onboarded, String(value));
}

export function useIsOnboarded(): boolean {
  const raw = useStorageString(KEYS.onboarded, "false");
  return raw === "true";
}

// ═══ CHAT HISTORY (lightweight — for Growth Coach) ═══
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function getChatHistory(): ChatMessage[] {
  return readJSON(KEYS.chatHistory, []);
}

export function saveChatMessage(msg: ChatMessage): void {
  const history = getChatHistory();
  history.push(msg);
  if (history.length > 100) history.splice(0, history.length - 100);
  writeJSON(KEYS.chatHistory, history);
}

export function clearChatHistory(): void {
  writeJSON(KEYS.chatHistory, []);
}

export function useChatHistory(): ChatMessage[] {
  const raw = useStorageString(KEYS.chatHistory, "[]");
  return useMemo(() => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [raw]);
}

// ═══ UTILITY ═══
export function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
