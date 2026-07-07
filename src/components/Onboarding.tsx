"use client";

import { useState } from "react";
import {
  User,
  Briefcase,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { saveSettings, setOnboarded, type LinkedInSettings, DEFAULT_SETTINGS } from "@/lib/storage";
import LinkedInConnect from "./LinkedInConnect";
import { useEffect } from "react";

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  { title: "Your Identity", desc: "Tell us who you are on LinkedIn", icon: User },
  { title: "Industry & Audience", desc: "Who are you trying to reach?", icon: Briefcase },
  { title: "Content Pillars", desc: "What topics do you post about?", icon: Target },
];

const PILLAR_SUGGESTIONS = [
  "Leadership & Management",
  "Career Growth & Job Search",
  "Technology & AI",
  "Entrepreneurship & Startups",
  "Marketing & Growth",
  "Personal Development",
  "Industry Insights",
  "Education & Learning",
  "Product Management",
  "Data Science & Analytics",
  "Finance & Investing",
  "Design & UX",
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [settings, setSettings] = useState<LinkedInSettings>({ ...DEFAULT_SETTINGS });
  const [isConnected, setIsConnected] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [crawling, setCrawling] = useState(false);
  const [crawlSuccess, setCrawlSuccess] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            setIsConnected(true);
            setSettings((prev) => ({
              ...prev,
              fullName: prev.fullName || data.user.name || "",
              profilePhotoUrl: prev.profilePhotoUrl || data.user.image || "",
            }));
          } else {
            setIsConnected(false);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkSession();
    const interval = setInterval(checkSession, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCrawl = async () => {
    if (!profileUrl.trim()) return;
    setCrawling(true);
    try {
      const res = await fetch("/api/linkedin/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileUrl }),
      });
      if (res.ok) {
        const crawledData = await res.json();
        setSettings((prev) => ({
          ...prev,
          fullName: crawledData.fullName || prev.fullName,
          headline: crawledData.headline || prev.headline,
          location: crawledData.location || prev.location,
          about: crawledData.about || prev.about,
          experience: crawledData.experience || prev.experience,
          skills: crawledData.skills || prev.skills,
        }));
        
        try {
          await fetch("/api/profile/snapshot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              headline: crawledData.headline,
              about: crawledData.about,
              experience: crawledData.experience,
              skills: crawledData.skills,
              score: 75,
              aiRewrites: "{}",
            }),
          });
        } catch (dbErr) {
          console.warn("Could not save snapshot to database (expected on serverless):", dbErr);
        }

        setCrawlSuccess(true);
        setTimeout(() => setCrawlSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Crawl failed:", err);
    } finally {
      setCrawling(false);
    }
  };

  const update = (key: keyof LinkedInSettings, value: string | string[]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const togglePillar = (pillar: string) => {
    const current = settings.contentPillars;
    if (current.includes(pillar)) {
      update("contentPillars", current.filter((p) => p !== pillar));
    } else if (current.length < 5) {
      update("contentPillars", [...current, pillar]);
    }
  };

  const handleFinish = () => {
    saveSettings(settings);
    setOnboarded(true);
    onComplete();
  };

  const canProceed = () => {
    switch (step) {
      case 0: return settings.fullName.trim().length > 0;
      case 1: return settings.industry.trim().length > 0;
      case 2: return settings.contentPillars.length > 0;
      case 3: return true; // API key is optional
      default: return true;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-elevated overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="grad-linkedin p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <LinkedInIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-white">LinkedIn Growth Tool</h1>
                <p className="text-[11px] text-white/70 font-semibold">AI-Powered Profile & Content Optimizer</p>
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-2 mt-4">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                    i <= step ? "bg-white" : "bg-white/25"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {(() => {
                const StepIcon = STEPS[step].icon;
                return <StepIcon className="w-3.5 h-3.5 text-white/80" />;
              })()}
              <p className="text-[11px] font-bold text-white/80">
                Step {step + 1} of {STEPS.length} — {STEPS[step].title}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 min-h-[280px]">
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm text-txt-secondary font-medium">
                Let&apos;s set up your LinkedIn identity so the AI can generate
                personalized content.
              </p>
              <LinkedInConnect />
              
              {isConnected && (
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                  <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Auto-import your full profile details
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter LinkedIn Profile URL (e.g. linkedin.com/in/username)"
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-border text-xs"
                    />
                    <button
                      onClick={handleCrawl}
                      disabled={crawling || !profileUrl.trim()}
                      className="px-3.5 py-2 bg-primary hover:bg-primary-hover disabled:bg-txt-muted text-white text-xs font-extrabold rounded-xl shadow-sm cursor-pointer shrink-0 transition-colors flex items-center gap-1"
                    >
                      {crawling ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Importing...</span>
                        </>
                      ) : (
                        <span>Import</span>
                      )}
                    </button>
                  </div>
                  {crawlSuccess && (
                    <p className="text-[10px] text-success font-bold">✓ Successfully imported headline, summary, experience, and skills!</p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <FieldInput
                  label="Full Name"
                  placeholder="e.g. Priya Sharma"
                  value={settings.fullName}
                  onChange={(v) => update("fullName", v)}
                />
                <FieldInput
                  label="Current Headline"
                  placeholder="e.g. Product Manager at Google | Ex-Flipkart"
                  value={settings.headline}
                  onChange={(v) => update("headline", v)}
                />
                <FieldInput
                  label="Location"
                  placeholder="e.g. Bangalore, India"
                  value={settings.location}
                  onChange={(v) => update("location", v)}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm text-txt-secondary font-medium">
                This helps the AI tailor content to your niche and audience.
              </p>
              <div className="space-y-3">
                <FieldInput
                  label="Industry / Niche"
                  placeholder="e.g. EdTech, SaaS, Healthcare, Consulting"
                  value={settings.industry}
                  onChange={(v) => update("industry", v)}
                />
                <FieldInput
                  label="Target Audience"
                  placeholder="e.g. Founders, HR leaders, CS students"
                  value={settings.targetAudience}
                  onChange={(v) => update("targetAudience", v)}
                />
                <FieldInput
                  label="Brand Voice / Tone"
                  placeholder="e.g. Professional, insightful, data-driven"
                  value={settings.brandVoice}
                  onChange={(v) => update("brandVoice", v)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm text-txt-secondary font-medium">
                Pick 1-5 topics you regularly post about. This shapes your AI content strategy.
              </p>
              <div className="flex flex-wrap gap-2">
                {PILLAR_SUGGESTIONS.map((pillar) => {
                  const selected = settings.contentPillars.includes(pillar);
                  return (
                    <button
                      key={pillar}
                      onClick={() => togglePillar(pillar)}
                      className={`px-3 py-2 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${
                        selected
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-txt-secondary border-border hover:border-primary/30 hover:bg-primary/5"
                      }`}
                    >
                      {selected && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                      {pillar}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-txt-muted font-medium">
                {settings.contentPillars.length}/5 selected
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-txt-secondary hover:bg-bg-surface cursor-pointer"
            >
              Back
            </button>
          ) : (
            <button
              onClick={() => { setOnboarded(true); onComplete(); }}
              className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-txt-muted hover:bg-bg-surface cursor-pointer"
            >
              Skip Setup
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed()}
              className={`px-5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-2 cursor-pointer ${
                canProceed()
                  ? "grad-linkedin text-white shadow-md shadow-primary/20 hover:shadow-lg"
                  : "bg-bg-surface text-txt-muted cursor-not-allowed"
              }`}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-xl text-[13px] font-bold grad-linkedin text-white shadow-md shadow-primary/20 hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Launch Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-txt uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm text-txt placeholder:text-txt-muted"
      />
    </div>
  );
}
