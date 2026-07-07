"use client";

import { useState, useEffect } from "react";
import { PenTool, Sparkles, Copy, Award, AlertCircle, Check, Calendar as CalendarIcon, Globe, RefreshCw } from "lucide-react";
import { useSettings } from "@/lib/storage";
import { writeLinkedInPost, type PostFormat } from "@/lib/ai/linkedin-writer";
import { editLinkedInPost, type EditResult } from "@/lib/ai/linkedin-editor";
import LinkedInPostPreview from "./LinkedInPostPreview";

const FORMATS: { id: PostFormat; label: string; desc: string }[] = [
  { id: "thought_leadership", label: "Thought Leadership", desc: "Insight-driven & structured" },
  { id: "story_post", label: "Personal Story", desc: "Authentic & story-driven" },
  { id: "news_commentary", label: "News Reaction", desc: "Commentary on trending news" },
  { id: "carousel_outline", label: "Carousel Text", desc: "Slide-by-slide structure" },
  { id: "hook_spark", label: "Hook Spark", desc: "Short, discussion starter" },
];

const TONES = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Conversational" },
  { id: "inspirational", label: "Inspirational" },
  { id: "contrarian", label: "Contrarian Take" },
  { id: "educational", label: "Step-by-Step" },
  { id: "data_driven", label: "Data Heavy" },
];

export default function ContentStudio() {
  const settings = useSettings();
  const [hasSystemKey, setHasSystemKey] = useState(false);
  const hasApiKey = !!settings.geminiApiKey || hasSystemKey;

  useEffect(() => {
    fetch("/api/ai/status")
      .then((res) => res.json())
      .then((data) => setHasSystemKey(!!data.hasSystemKey))
      .catch((err) => console.error(err));
  }, []);

  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState<PostFormat>("thought_leadership");
  const [tone, setTone] = useState("professional");
  
  const [loading, setLoading] = useState(false);
  const [draftPost, setDraftPost] = useState("");
  const [editResult, setEditResult] = useState<EditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<"preview" | "improvements">("preview");
  const [isScheduled, setIsScheduled] = useState(false);
  const [hasConnectedProfile, setHasConnectedProfile] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setHasConnectedProfile(!!(data && data.user));
        }
      } catch {
        setHasConnectedProfile(false);
      }
    };
    checkProfile();
  }, []);

  const handlePublish = async () => {
    if (!draftPost) return;
    setIsPublishing(true);
    setError(null);
    try {
      const res = await fetch("/api/linkedin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draftPost }),
      });
      if (res.ok) {
        setPublishSuccess(true);
        setTimeout(() => setPublishSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to publish post to LinkedIn.");
      }
    } catch {
      setError("An error occurred while publishing to LinkedIn.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSchedule = async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0); // 9:00 AM

      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic || "AI LinkedIn Post",
          format,
          content: draftPost,
          scheduledFor: tomorrow.toISOString(),
          status: "scheduled",
        }),
      });

      setIsScheduled(true);
      setTimeout(() => setIsScheduled(false), 2000);
    } catch {
      setIsScheduled(true);
      setTimeout(() => setIsScheduled(false), 2000);
    }
  };

  const handleGenerate = async () => {
    if (!hasApiKey) {
      setError("Please add your Gemini API key in Settings first to generate posts.");
      return;
    }

    if (!topic.trim()) {
      setError("Please enter a topic or concept for the post.");
      return;
    }

    setLoading(true);
    setError(null);
    setDraftPost("");
    setEditResult(null);

    try {
      // 1. Generate post using Writer Agent
      const rawPost = await writeLinkedInPost({
        topic,
        format,
        tone,
        audience: settings.targetAudience || "LinkedIn network",
        industry: settings.industry || "General Niche",
        contentPillars: settings.contentPillars || [],
        brandVoice: settings.brandVoice || "Professional",
        apiKey: settings.geminiApiKey,
      });

      setDraftPost(rawPost);

      // 2. Improve and audit post using Editor Agent
      const audit = await editLinkedInPost({
        post: rawPost,
        format,
        audience: settings.targetAudience || "LinkedIn network",
        apiKey: settings.geminiApiKey,
      });

      setEditResult(audit);
      setDraftPost(audit.editedPost);
      setActivePreviewTab("preview");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftPost);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-[1400px] mx-auto space-y-8 animate-fade-in">
      <div className="border-b border-border pb-5">
        <h3 className="text-2xl font-bold text-txt tracking-tight flex items-center gap-2">
          <PenTool className="w-6 h-6 text-primary" strokeWidth={2.5} /> Content Studio
        </h3>
        <p className="text-sm text-txt-secondary font-medium">
          Draft, score, and edit LinkedIn posts using specialized AI Writer & Editor agents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Creator Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white border border-border p-6 space-y-5 shadow-card">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt uppercase tracking-wider">
                  Post Topic / Concept
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What is this post about? (e.g., '3 tips for junior developers starting in SaaS')"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm text-txt resize-none custom-scroll"
                />
              </div>

              {/* Format selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt uppercase tracking-wider">
                  Post Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FORMATS.map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setFormat(fmt.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        format === fmt.id
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-white border-border hover:bg-bg-surface"
                      }`}
                    >
                      <p className={`text-xs font-bold ${format === fmt.id ? "text-primary" : "text-txt"}`}>
                        {fmt.label}
                      </p>
                      <p className="text-[10px] text-txt-secondary font-medium mt-0.5 leading-normal">
                        {fmt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt uppercase tracking-wider">
                  Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        tone === t.id
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-txt-secondary border-border hover:bg-bg-surface"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-danger-light border border-danger/10 text-danger text-sm flex items-start gap-2 animate-scale-in">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !hasApiKey}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                loading
                  ? "bg-bg-surface text-txt-muted cursor-not-allowed"
                  : hasApiKey
                  ? "grad-linkedin text-white shadow-primary/20 hover:shadow-lg"
                  : "bg-bg-surface text-txt-muted cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Drafting & Polishing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Post</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Studio Preview / Editor Feedback */}
        <div className="lg:col-span-7 space-y-6">
          {!draftPost && !loading && (
            <div className="h-full min-h-[450px] border border-dashed border-border rounded-2xl bg-white flex flex-col items-center justify-center p-8 text-center shadow-card">
              <Sparkles className="w-12 h-12 text-primary/25 mb-4 animate-float" />
              <h4 className="text-base font-bold text-txt">Ready to Draft?</h4>
              <p className="text-sm text-txt-secondary max-w-sm mt-1.5 leading-relaxed font-medium">
                Set your topic and options on the left, then click &quot;Generate Post&quot; to write your LinkedIn post.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[450px] border border-border rounded-2xl bg-white p-6 space-y-6 shadow-card animate-pulse">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-bg-surface" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-bg-surface rounded w-1/4" />
                  <div className="h-3 bg-bg-surface rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-bg-surface rounded" />
                <div className="h-4 bg-bg-surface rounded w-5/6" />
                <div className="h-4 bg-bg-surface rounded w-1/2" />
              </div>
            </div>
          )}

          {draftPost && (
            <div className="rounded-2xl bg-white border border-border overflow-hidden shadow-card animate-fade-in flex flex-col min-h-[580px]">
              {/* Header / Tabs */}
              <div className="flex border-b border-border bg-bg-surface/10 p-2 items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActivePreviewTab("preview")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activePreviewTab === "preview"
                        ? "bg-primary text-white shadow-sm"
                        : "text-txt-secondary hover:bg-bg-surface"
                    }`}
                  >
                    LinkedIn Mockup
                  </button>
                  {editResult && (
                    <button
                      onClick={() => setActivePreviewTab("improvements")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activePreviewTab === "improvements"
                          ? "bg-primary text-white shadow-sm"
                          : "text-txt-secondary hover:bg-bg-surface"
                      }`}
                    >
                      AI Editor Scores
                    </button>
                  )}
                </div>

                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2 bg-white border border-border hover:bg-bg-surface rounded-xl text-xs text-txt-secondary font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-success">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Post</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleSchedule}
                  className="px-3.5 py-2 bg-white border border-border hover:bg-bg-surface text-txt-secondary hover:text-txt rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {isScheduled ? (
                    <>
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-success">Scheduled</span>
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="w-4 h-4" />
                      <span>Schedule Post</span>
                    </>
                  )}
                </button>

                {hasConnectedProfile && (
                  <button
                    disabled={isPublishing}
                    onClick={handlePublish}
                    className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : publishSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Published ✓</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4" />
                        <span>Publish to LinkedIn</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex-1 overflow-y-auto custom-scroll max-h-[500px]">
                {activePreviewTab === "preview" && (
                  <div className="space-y-4 animate-fade-in">
                    <LinkedInPostPreview post={draftPost} />
                  </div>
                )}

                {activePreviewTab === "improvements" && editResult && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Scores grid */}
                    <div className="grid grid-cols-4 gap-2">
                      <ScoreMetric label="Overall" score={editResult.overallScore} />
                      <ScoreMetric label="Hook" score={editResult.hookScore} />
                      <ScoreMetric label="Dwell Time" score={editResult.dwellTimeScore} />
                      <ScoreMetric label="Engagement" score={editResult.engagementScore} />
                    </div>

                    {/* Editorial Actions */}
                    <div className="rounded-xl border border-success/15 bg-success/5 p-4 space-y-2">
                      <h5 className="text-[11px] font-bold text-success uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-4 h-4" /> Optimizations Made
                      </h5>
                      <ul className="space-y-1.5 pl-5 list-disc text-txt text-xs font-medium">
                        {editResult.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggested tags */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-extrabold text-txt uppercase tracking-wider">Suggested Hashtags</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {editResult.suggestedHashtags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/5 text-primary border border-primary/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreMetric({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? "text-success bg-success/5 border-success/10" : score >= 50 ? "text-warning bg-warning/5 border-warning/10" : "text-danger bg-danger/5 border-danger/10";
  return (
    <div className={`rounded-xl border p-3 text-center ${color}`}>
      <p className="text-lg font-black">{score}</p>
      <p className="text-[9px] text-txt-secondary font-bold uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}
