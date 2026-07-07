"use client";

import { useState, useEffect } from "react";
import { User, Sparkles, CheckCircle2, Copy, AlertCircle, ShieldAlert, Award, Globe, History, Trash2, Check, RefreshCw } from "lucide-react";

type RewriteStyle = "thoughtLeader" | "storyteller" | "seoBooster";
import { useSettings, saveSettings } from "@/lib/storage";
import { auditProfile, type ProfileAuditResult } from "@/lib/ai/profile-analyst";

export default function ProfileOptimizer() {
  const settings = useSettings();
  const [hasSystemKey, setHasSystemKey] = useState(false);
  const hasApiKey = !!settings.geminiApiKey || hasSystemKey;

  useEffect(() => {
    fetch("/api/ai/status")
      .then((res) => res.json())
      .then((data) => setHasSystemKey(!!data.hasSystemKey))
      .catch((err) => console.error(err));
  }, []);

  const [headline, setHeadline] = useState(settings.headline || "");
  const [about, setAbout] = useState(settings.about || "");
  const [experience, setExperience] = useState(settings.experience || "");
  const [skills, setSkills] = useState(settings.skills || "");

  // Sync inputs back to localStorage settings
  useEffect(() => {
    saveSettings({ headline, about, experience, skills });
  }, [headline, about, experience, skills]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProfileAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"audit" | "headlines" | "about">("audit");
  const [selectedHeadlineStyle, setSelectedHeadlineStyle] = useState<"thoughtLeader" | "storyteller" | "seoBooster">("seoBooster");
  const [selectedAboutStyle, setSelectedAboutStyle] = useState<"thoughtLeader" | "storyteller" | "seoBooster">("seoBooster");

  interface ProfileSnapshot {
    id: string;
    createdAt: string;
    score: number | null;
    headline: string;
    about: string;
    experience?: string | null;
    skills?: string | null;
  }

  const [history, setHistory] = useState<ProfileSnapshot[]>([]);
  const [isSavingSnapshot, setIsSavingSnapshot] = useState(false);
  const [snapshotSaved, setSnapshotSaved] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/profile/snapshot");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch snapshot history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (history.length > 0 && !headline && !about && !experience && !skills) {
      const latest = history[0];
      setHeadline(latest.headline || "");
      setAbout(latest.about || "");
      setExperience(latest.experience || "");
      setSkills(latest.skills || "");
    }
  }, [history, headline, about, experience, skills]);

  const handleSaveSnapshot = async () => {
    if (!result) return;
    setIsSavingSnapshot(true);
    try {
      const res = await fetch("/api/profile/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline,
          about,
          experience,
          skills,
          score: result.overallScore,
          aiRewrites: {
            headlineRewrites: result.headlineRewrites,
            aboutRewrites: result.aboutRewrites,
          },
        }),
      });
      if (res.ok) {
        setSnapshotSaved(true);
        fetchHistory();
        setTimeout(() => setSnapshotSaved(false), 2000);
      }
    } catch (err) {
      console.error("Failed to save snapshot:", err);
    } finally {
      setIsSavingSnapshot(false);
    }
  };

  const handleDeleteSnapshot = async (id: string) => {
    try {
      const res = await fetch(`/api/profile/snapshot?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchHistory();
      }
    } catch (err) {
      console.error("Failed to delete snapshot:", err);
    }
  };

  const handleAudit = async () => {
    if (!hasApiKey) {
      setError("Please add your Gemini API key in Settings first to run AI profile audits.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await auditProfile({
        headline,
        about,
        experience,
        skills,
        industry: settings.industry || "General Professional",
        targetAudience: settings.targetAudience || "LinkedIn network",
        apiKey: settings.geminiApiKey,
      });

      setResult(data);
      setActiveTab("audit");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to audit profile. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-success border-success/20 bg-success/5";
    if (score >= 50) return "text-warning border-warning/20 bg-warning/5";
    return "text-danger border-danger/20 bg-danger/5";
  };



  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-[1400px] mx-auto space-y-8 animate-fade-in">
      <div className="border-b border-border pb-5">
        <h3 className="text-2xl font-bold text-txt tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" strokeWidth={2.5} /> Profile Optimizer
        </h3>
        <p className="text-sm text-txt-secondary font-medium">
          Audit your LinkedIn profile copy and generate high-converting headline & summary variations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white border border-border p-6 space-y-5 shadow-card">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <User className="w-5 h-5 text-primary" />
              <h4 className="text-sm font-bold text-txt">Your Profile Text</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt uppercase tracking-wider flex justify-between">
                  <span>Current Headline</span>
                  <span className="text-txt-muted">{headline.length}/220</span>
                </label>
                <textarea
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value.slice(0, 220))}
                  placeholder="Paste your current LinkedIn headline..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm text-txt resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt uppercase tracking-wider">
                  <span>About / Summary</span>
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Paste your current LinkedIn About summary..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm text-txt resize-none custom-scroll"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt uppercase tracking-wider">
                  <span>Experience Details (Optional)</span>
                </label>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="List key job titles and achievements..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm text-txt resize-none custom-scroll"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt uppercase tracking-wider">
                  <span>Skills Listed (Optional)</span>
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Comma separated: React, Marketing, SEO..."
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm text-txt"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-danger-light border border-danger/10 text-danger text-sm flex items-start gap-2 animate-scale-in">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleAudit}
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
                  <span>Auditing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Optimize Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit Results */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !loading && (
            <div className="h-full min-h-[400px] border border-dashed border-border rounded-2xl bg-white flex flex-col items-center justify-center p-8 text-center shadow-card">
              <Sparkles className="w-12 h-12 text-primary/25 mb-4 animate-float" />
              <h4 className="text-base font-bold text-txt">Ready to Optimize Your Profile?</h4>
              <p className="text-sm text-txt-secondary max-w-sm mt-1.5 leading-relaxed font-medium">
                Enter your current headline and summary details, then click &quot;Optimize Profile&quot; to audit your copy.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] border border-border rounded-2xl bg-white p-6 space-y-6 shadow-card animate-pulse">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-bg-surface" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-bg-surface rounded w-1/4" />
                  <div className="h-3 bg-bg-surface rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-bg-surface rounded" />
                <div className="h-4 bg-bg-surface rounded w-5/6" />
                <div className="h-4 bg-bg-surface rounded w-2/3" />
              </div>
            </div>
          )}

          {result && (
            <div className="rounded-2xl bg-white border border-border overflow-hidden shadow-card animate-fade-in flex flex-col min-h-[600px]">
              {/* Tabs */}
              <div className="flex border-b border-border bg-bg-surface/10 p-2 justify-between items-center">
                <div className="flex gap-2">
                  {[
                    { id: "audit", label: "Dashboard Audit" },
                    { id: "headlines", label: "Headline Variations" },
                    { id: "about", label: "About Summary" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as "audit" | "headlines" | "about")}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === t.id
                          ? "bg-primary text-white shadow-sm"
                          : "text-txt-secondary hover:bg-bg-surface"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <button
                  disabled={isSavingSnapshot}
                  onClick={handleSaveSnapshot}
                  className="mr-2 px-3.5 py-2 bg-success text-white hover:bg-success-hover rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50 transition-all"
                >
                  {isSavingSnapshot ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : snapshotSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Save Snapshot</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto custom-scroll max-h-[580px]">
                {/* Dashboard Audit Tab */}
                {activeTab === "audit" && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Score Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      <ScoreMetric label="Overall Score" score={result.overallScore} colors={scoreColor(result.overallScore)} />
                      <ScoreMetric label="Headline Score" score={result.headlineScore} colors={scoreColor(result.headlineScore)} />
                      <ScoreMetric label="About Score" score={result.aboutScore} colors={scoreColor(result.aboutScore)} />
                    </div>

                    {/* Gaps / Strengths */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-danger/10 bg-danger/5 p-4 space-y-2">
                        <h5 className="text-[11px] font-bold text-danger uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4" /> Areas for Improvement
                        </h5>
                        <ul className="space-y-1.5 pl-5 list-disc text-txt text-xs font-medium">
                          {result.gaps.map((gap, i) => (
                            <li key={i}>{gap}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-success/15 bg-success/5 p-4 space-y-2">
                        <h5 className="text-[11px] font-bold text-success uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Strengths
                        </h5>
                        <ul className="space-y-1.5 pl-5 list-disc text-txt text-xs font-medium">
                          {result.strengths.map((str, i) => (
                            <li key={i}>{str}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Tips & Extras */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h5 className="text-xs font-extrabold text-txt uppercase tracking-wider">Social Selling Index (SSI) Growth</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {result.ssiTips.map((tip, i) => (
                            <div key={i} className="p-3 bg-bg-surface/50 border border-border/50 rounded-xl text-xs text-txt-secondary font-medium leading-relaxed">
                              {tip}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-primary-muted/20 border border-primary/10 rounded-xl space-y-1">
                        <h5 className="text-xs font-bold text-primary flex items-center gap-1">
                          <Globe className="w-4 h-4" /> LinkedIn Banner strategy
                        </h5>
                        <p className="text-xs text-txt-secondary leading-relaxed font-medium">
                          {result.bannerAdvice}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Headline Variations Tab */}
                {activeTab === "headlines" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex gap-2 p-1.5 rounded-xl bg-bg-surface border border-border w-fit">
                      {[
                        { id: "seoBooster", label: "SEO Booster" },
                        { id: "thoughtLeader", label: "Thought Leader" },
                        { id: "storyteller", label: "Storyteller" },
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedHeadlineStyle(style.id as RewriteStyle)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            selectedHeadlineStyle === style.id
                              ? "bg-white text-primary shadow-sm"
                              : "text-txt-secondary hover:text-txt"
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-6 rounded-2xl bg-bg-surface/30 border border-border space-y-4 relative">
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                          Optimized Headline
                        </span>
                        <button
                          onClick={() => handleCopy(result.headlineRewrites[selectedHeadlineStyle], "headline")}
                          className="px-3 py-1.5 bg-white border border-border hover:bg-bg-surface rounded-lg text-xs text-txt-secondary font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedSection === "headline" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <p className="text-base font-extrabold text-txt leading-snug">
                        {result.headlineRewrites[selectedHeadlineStyle]}
                      </p>
                    </div>

                    {/* Mockup Preview */}
                    <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
                      <div className="bg-primary/20 h-28 relative">
                        <div className="absolute bottom-[-24px] left-6 w-20 h-20 rounded-full border-4 border-white bg-primary/10 flex items-center justify-center text-primary font-bold">
                          Avatar
                        </div>
                      </div>
                      <div className="pt-8 p-6 space-y-2">
                        <h4 className="text-lg font-bold text-txt">{settings.fullName || "Your Name"}</h4>
                        <p className="text-sm font-medium text-txt-secondary leading-normal max-w-[480px]">
                          {result.headlineRewrites[selectedHeadlineStyle]}
                        </p>
                        <p className="text-xs text-txt-muted font-bold">
                          {settings.location} • <span className="text-primary hover:underline cursor-pointer">Contact info</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* About Summary Tab */}
                {activeTab === "about" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex gap-2 p-1.5 rounded-xl bg-bg-surface border border-border w-fit">
                      {[
                        { id: "seoBooster", label: "SEO Booster" },
                        { id: "thoughtLeader", label: "Thought Leader" },
                        { id: "storyteller", label: "Storyteller" },
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedAboutStyle(style.id as RewriteStyle)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            selectedAboutStyle === style.id
                              ? "bg-white text-primary shadow-sm"
                              : "text-txt-secondary hover:text-txt"
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-6 rounded-2xl bg-bg-surface/30 border border-border space-y-4 relative">
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                          Optimized Summary
                        </span>
                        <button
                          onClick={() => handleCopy(result.aboutRewrites[selectedAboutStyle], "about")}
                          className="px-3 py-1.5 bg-white border border-border hover:bg-bg-surface rounded-lg text-xs text-txt-secondary font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedSection === "about" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <p className="text-sm text-txt-secondary leading-relaxed whitespace-pre-wrap font-medium">
                        {result.aboutRewrites[selectedAboutStyle]}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Snapshot History Section */}
      <div className="rounded-2xl bg-white border border-border p-6 shadow-card space-y-4">
        <h4 className="text-sm font-bold text-txt flex items-center gap-2">
          <History className="w-4.5 h-4.5 text-primary" strokeWidth={2.5} /> Profile Audit History & Tracking
        </h4>
        <p className="text-xs text-txt-secondary font-medium font-semibold">
          Track your profile scores over time. You can delete past snapshots or quickly reload them back into the editor inputs.
        </p>

        {history.length === 0 ? (
          <div className="text-center py-8 text-txt-secondary text-xs italic bg-bg-surface/30 rounded-xl border border-dashed border-border">
            No past snapshots saved. Run an audit and click &quot;Save Snapshot&quot; to build your optimization timeline!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((snapshot) => (
              <div key={snapshot.id} className="p-4 rounded-xl border border-border bg-bg-surface/20 space-y-3 relative group hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-txt-muted">
                    {new Date(snapshot.createdAt).toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setHeadline(snapshot.headline);
                        setAbout(snapshot.about);
                        setExperience(snapshot.experience || "");
                        setSkills(snapshot.skills || "");
                      }}
                      className="px-2 py-1 bg-white hover:bg-bg-surface border border-border rounded text-[10px] font-extrabold text-primary cursor-pointer shadow-sm"
                      title="Load this snapshot text back into the editor inputs"
                    >
                      Reload
                    </button>
                    <button
                      onClick={() => handleDeleteSnapshot(snapshot.id)}
                      className="text-txt-muted hover:text-danger cursor-pointer"
                      title="Delete snapshot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 border-t border-b border-border/50 py-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${scoreColor(snapshot.score || 0)}`}>
                    {snapshot.score ?? "--"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-txt truncate" title={snapshot.headline}>
                      {snapshot.headline}
                    </p>
                    <p className="text-[10px] text-txt-secondary mt-0.5 truncate">
                      {snapshot.about}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreMetric({
  label,
  score,
  colors,
}: {
  label: string;
  score: number;
  colors: string;
}) {
  return (
    <div className={`rounded-xl border p-4 text-center ${colors}`}>
      <p className="text-2xl font-black">{score}</p>
      <p className="text-[10px] text-txt-secondary font-bold uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}
