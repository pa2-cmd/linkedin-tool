"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Sparkles, AlertCircle, RefreshCw, Trash2 } from "lucide-react";
import { useSettings, useChatHistory, saveChatMessage, clearChatHistory, type ChatMessage } from "@/lib/storage";
import { generate } from "@/lib/ai/gemini-client";

const SUGGESTED_PROMPTS = [
  "Draft a connection message to a senior executive in SaaS.",
  "Give me 3 content ideas about career growth for engineers.",
  "Review my current headline and tell me how to make it pop.",
  "What is the best way to handle comments on a viral post?",
];

export default function GrowthCoach() {
  const settings = useSettings();
  const history = useChatHistory();
  const [hasSystemKey, setHasSystemKey] = useState(false);
  const hasApiKey = !!settings.geminiApiKey || hasSystemKey;

  useEffect(() => {
    fetch("/api/ai/status")
      .then((res) => res.json())
      .then((data) => setHasSystemKey(!!data.hasSystemKey))
      .catch((err) => console.error(err));
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>(history);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    if (!hasApiKey) {
      setError("Please add your Gemini API key in Settings first to speak with the Growth Coach.");
      return;
    }

    if (!textToSend.trim()) return;

    setError(null);
    setInput("");
    setLoading(true);

    const userMsg: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    saveChatMessage(userMsg);

    try {
      // Build context including profile details
      const profileCtx = `
USER CONTEXT:
- Name: ${settings.fullName || "User"}
- Headline: ${settings.headline || "Not provided"}
- Industry/Niche: ${settings.industry || "Not provided"}
- Target Audience: ${settings.targetAudience || "Not provided"}
- Content Pillars: ${(settings.contentPillars || []).join(", ")}
- Brand Voice/Tone: ${settings.brandVoice || "Not provided"}
`;

      const chatCtx = messages
        .slice(-6)
        .map((m) => `${m.role === "user" ? "User" : "Coach"}: ${m.content}`)
        .join("\n\n");

      const prompt = `You are an elite LinkedIn Growth Coach and Personal Branding Advisor.
Your objective is to help the user optimize their LinkedIn profile, write better content, build high-quality connections, and increase overall profile views and engagement.

${profileCtx}

CONVERSATION HISTORY:
${chatCtx}

USER MESSAGE:
"${textToSend}"

COACH ANSWER:
- Be highly actionable, specific, and direct.
- Focus exclusively on LinkedIn growth strategies.
- Use formatting (bullet points, clear paragraphs) to make your response easy to read.
- Do not use corporate platitudes. Give real, practical advice.`;

      const aiText = await generate(prompt, { apiKey: settings.geminiApiKey, tier: "flash" });

      const coachMsg: ChatMessage = {
        id: `${Date.now()}-coach`,
        role: "assistant",
        content: aiText as string,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, coachMsg]);
      saveChatMessage(coachMsg);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to contact Growth Coach. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    clearChatHistory();
    setMessages([]);
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-[1000px] mx-auto space-y-6 animate-fade-in flex flex-col h-[calc(100vh-80px)]">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-txt tracking-tight flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" strokeWidth={2.5} /> Growth Coach
          </h3>
          <p className="text-sm text-txt-secondary font-medium">
            Personalized advice, outreach templates, and strategist help for your LinkedIn growth.
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="p-2 border border-border hover:bg-danger-light hover:text-danger rounded-xl text-txt-secondary transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 min-h-0 rounded-2xl bg-white border border-border p-4 overflow-y-auto custom-scroll space-y-4 shadow-card">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <Sparkles className="w-12 h-12 text-primary/25 mb-4 animate-float" />
            <h4 className="text-base font-bold text-txt">Ask LinkedIn Coach</h4>
            <p className="text-sm text-txt-secondary max-w-sm mt-1.5 leading-relaxed font-medium">
              Start by typing a question, or pick one of the suggestions below to ask the AI growth advisor.
            </p>

            {/* Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-lg">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="p-3 text-left text-xs font-semibold text-txt-secondary hover:text-primary bg-bg-surface/50 border border-border/50 hover:border-primary/30 rounded-xl transition-all cursor-pointer leading-normal"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                  isUser
                    ? "bg-primary text-white"
                    : "bg-accent text-white"
                }`}
              >
                {isUser ? "U" : "C"}
              </div>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed font-medium ${
                  isUser
                    ? "bg-primary text-white"
                    : "bg-bg-surface border border-border text-txt"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 mr-auto max-w-[85%] animate-pulse">
            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs shrink-0">
              C
            </div>
            <div className="p-4 rounded-2xl bg-bg-surface border border-border text-txt-muted text-sm font-semibold flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-primary" />
              <span>Coach is typing...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-danger-light border border-danger/10 text-danger text-sm flex items-start gap-2 animate-scale-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder="Ask about headline rewrites, post ideas, connection strategies..."
          disabled={loading}
          className="flex-1 px-5 py-4 rounded-2xl bg-white border border-border text-sm text-txt shadow-sm"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={loading || !input.trim()}
          className={`p-4 rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow-md ${
            input.trim() && !loading
              ? "grad-linkedin text-white shadow-primary/20 hover:shadow-lg"
              : "bg-bg-surface text-txt-muted cursor-not-allowed border border-border"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
