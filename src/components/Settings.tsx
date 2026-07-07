"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, UserCheck, ShieldCheck, Zap, Info, Check } from "lucide-react";
import { useSettings, saveSettings, type LinkedInSettings } from "@/lib/storage";
import LinkedInConnect from "./LinkedInConnect";

export default function Settings() {
  const currentSettings = useSettings();
  const [settings, setSettings] = useState<LinkedInSettings>(currentSettings);
  const [activeTab, setActiveTab] = useState<"identity" | "context" | "engine">("identity");
  const [saved, setSaved] = useState(false);
  const [hasSystemKey, setHasSystemKey] = useState(false);

  useEffect(() => {
    fetch("/api/ai/status")
      .then((res) => res.json())
      .then((data) => setHasSystemKey(!!data.hasSystemKey))
      .catch((err) => console.error(err));
  }, []);

  const update = (key: keyof LinkedInSettings, value: string | string[]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-[1000px] mx-auto space-y-8 animate-fade-in">
      <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-txt tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-primary" strokeWidth={2.5} /> Settings
          </h3>
          <p className="text-sm text-txt-secondary font-medium">
            Configure your LinkedIn brand details and local Gemini API key credentials.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-primary/10 self-start sm:self-auto"
        >
          {saved ? <Check className="w-4 h-4" /> : null}
          <span>{saved ? "Settings Saved" : "Save Changes"}</span>
        </button>
      </div>

      <div className="flex gap-2 p-1 border border-border bg-bg-surface/50 rounded-xl w-fit">
        {[
          { id: "identity", label: "Identity", icon: UserCheck },
          { id: "context", label: "Brand Context", icon: ShieldCheck },
          { id: "engine", label: "AI Engine", icon: Zap },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as "identity" | "context" | "engine")}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === t.id
                ? "bg-white text-primary shadow-sm"
                : "text-txt-secondary hover:text-txt"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 shadow-card min-h-[400px]">
        {activeTab === "identity" && (
          <div className="space-y-6 animate-fade-in">
            <LinkedInConnect />

            <div className="border-b border-border pb-4">
              <h4 className="text-sm font-bold text-txt">Profile Identity</h4>
              <p className="text-xs text-txt-secondary mt-0.5 leading-relaxed font-medium">
                Set up details matching your LinkedIn profile to customize the AI optimization models.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt-secondary uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={settings.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt-secondary uppercase tracking-wider">Headline Location</label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => update("location", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-txt-secondary uppercase tracking-wider">Current Headline</label>
                <input
                  type="text"
                  value={settings.headline}
                  onChange={(e) => update("headline", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "context" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h4 className="text-sm font-bold text-txt">LinkedIn Niche & Target Audience</h4>
              <p className="text-xs text-txt-secondary mt-0.5 leading-relaxed font-medium">
                Pillars, target keywords, and brand voice guidelines injected into the AI generation engines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt-secondary uppercase tracking-wider">Industry / Focus</label>
                <input
                  type="text"
                  value={settings.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt-secondary uppercase tracking-wider">Target Niche Audience</label>
                <input
                  type="text"
                  value={settings.targetAudience}
                  onChange={(e) => update("targetAudience", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-txt-secondary uppercase tracking-wider">Competitors (Optional)</label>
                <input
                  type="text"
                  value={settings.competitors}
                  onChange={(e) => update("competitors", e.target.value)}
                  placeholder="LinkedIn profiles or URLs of creators you look up to (comma separated)"
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-txt-secondary uppercase tracking-wider">Brand Voice Guidelines</label>
                <textarea
                  value={settings.brandVoice}
                  onChange={(e) => update("brandVoice", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "engine" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h4 className="text-sm font-bold text-txt">Google Gemini Engine Config</h4>
              <p className="text-xs text-txt-secondary mt-0.5 leading-relaxed font-medium">
                Connect the local AI engine with your personal Google Gemini API Key.
              </p>
            </div>

            <div className="space-y-4">
              {hasSystemKey && (
                <div className="p-3.5 rounded-xl bg-success/5 border border-success/20 text-xs text-success font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span>System-wide Gemini API Key is configured and active. Personal API key is optional.</span>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-txt-secondary uppercase tracking-wider">
                  Gemini API Key {hasSystemKey ? "(Optional)" : ""}
                </label>
                <input
                  type="password"
                  value={settings.geminiApiKey}
                  onChange={(e) => update("geminiApiKey", e.target.value)}
                  placeholder={hasSystemKey ? "Using system key (enter custom key to override)" : "AIzaSy..."}
                  className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>

              <div className="p-4 rounded-xl bg-bg-surface border border-border/80 flex items-start gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-txt-secondary leading-relaxed font-medium space-y-1">
                  <p>
                    Your API Key is kept <strong>only in local storage</strong> and sent directly to Google Gemini servers to run optimization processes. It is never stored or logged on third-party servers.
                  </p>
                  <p>
                    You can sign up and acquire a free personal API key on the official Google site:{" "}
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-bold"
                    >
                      Google AI Studio Key Setup
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
