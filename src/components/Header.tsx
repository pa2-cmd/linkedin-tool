"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/lib/storage";
import { Sparkles, AlertTriangle } from "lucide-react";

const TAB_TITLES: Record<string, string> = {
  dashboard: "LinkedIn Pulse",
  analytics: "Analytics & Metrics",
  profile: "Profile Optimizer",
  studio: "Content Studio",
  calendar: "Post Calendar",
  coach: "Growth Coach",
  settings: "Settings",
};

interface HeaderProps {
  activeTab: string;
}

export default function Header({ activeTab }: HeaderProps) {
  const settings = useSettings();
  const [hasSystemKey, setHasSystemKey] = useState(false);
  const hasApiKey = !!settings.geminiApiKey || hasSystemKey;
  const [session, setSession] = useState<{ user?: { name?: string | null; image?: string | null } } | null>(null);

  useEffect(() => {
    fetch("/api/ai/status")
      .then((res) => res.json())
      .then((data) => setHasSystemKey(!!data.hasSystemKey))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            setSession(data);
          }
        }
      } catch {}
    };
    fetchSession();
  }, []);

  return (
    <header className="h-[60px] border-b border-border bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-[15px] font-bold text-txt tracking-tight">
            {TAB_TITLES[activeTab] || "LinkedIn Growth"}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* API Key Warning */}
        {!hasApiKey && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning-light border border-warning/20 text-warning text-[11px] font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>API Key Missing</span>
          </div>
        )}

        {/* AI Status */}
        {hasApiKey && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success-light border border-success/20 text-success text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Ready</span>
          </div>
        )}

        {/* LinkedIn connection status */}
        {session && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Connected</span>
          </div>
        )}

        {/* User Avatar */}
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt=""
            className="w-8 h-8 rounded-full border border-primary/20 object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            {settings.fullName
              ? settings.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "U"}
          </div>
        )}
      </div>
    </header>
  );
}
