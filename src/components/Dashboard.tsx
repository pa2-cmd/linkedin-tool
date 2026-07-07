"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Eye,
  Search,
  BarChart3,
  PenTool,
  User,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Zap,
  Target,
} from "lucide-react";
import { useSettings } from "@/lib/storage";
import dynamic from "next/dynamic";

const ThreeNetwork = dynamic(() => import("./ThreeNetwork"), { ssr: false });

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
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
      } catch (err) {
        console.error("Dashboard session error:", err);
      }
    };
    fetchSession();
  }, []);

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-[1400px] mx-auto space-y-6 animate-fade-in">
      {/* Hero Section */}
      <section className="rounded-3xl grad-premium p-6 md:p-10 relative overflow-hidden shadow-elevated">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(10,102,194,0.3),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(231,163,62,0.15),transparent_50%)]" />
        <div className="absolute -top-20 right-[-3rem] h-60 w-60 rounded-full border border-white/10 bg-white/5 blur-2xl" />
        <div className="absolute bottom-[-4rem] left-[30%] h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                LinkedIn Growth Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] text-white">
                {session?.user?.name || settings.fullName || "Welcome"}
                <span className="block text-white/60 text-xl md:text-2xl mt-2 font-bold">
                  {settings.headline || "Set up your profile to get AI-powered growth insights"}
                </span>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              {/* Quick Signal Card */}
              <div className="min-w-[220px] max-w-[260px] rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-md">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/50">
                  Growth Signal
                </p>
                <p className="mt-2 text-xs font-bold text-white leading-relaxed">
                  {hasApiKey
                    ? "AI engine is ready. Start by auditing your profile or creating your first post."
                    : "Add your Gemini API key in Settings to unlock AI features."}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${hasApiKey ? "bg-green-400" : "bg-amber-400"} animate-pulse`} />
                  <span className="text-[10px] font-bold text-white/60">
                    {hasApiKey ? "AI Connected" : "Needs Setup"}
                  </span>
                </div>
              </div>

              {/* LinkedIn Account Card */}
              <div className="min-w-[220px] max-w-[260px] rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-md">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/50">
                  LinkedIn Connection
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {session?.user?.image ? (
                    <img src={session.user?.image} className="w-8 h-8 rounded-lg object-cover border border-white/20" alt="" />
                  ) : null}
                  <div>
                    <p className="text-xs font-black text-white truncate max-w-[150px]">
                      {session ? session.user?.name : "Not Connected"}
                    </p>
                    <p className="text-[9px] text-white/60 font-bold">
                      {session ? "Direct Publish Ready" : "Manual Post Mode"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${session ? "bg-green-400" : "bg-amber-400"} animate-pulse`} />
                  <span className="text-[10px] font-bold text-white/60">
                    {session ? "Connected" : "Not Linked"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <ActionTile
              icon={User}
              label="Audit Profile"
              desc="Get your profile score"
              onClick={() => onNavigate("profile")}
            />
            <ActionTile
              icon={PenTool}
              label="Write Post"
              desc="Create LinkedIn content"
              onClick={() => onNavigate("studio")}
            />
            <ActionTile
              icon={MessageCircle}
              label="Ask Coach"
              desc="Get growth advice"
              onClick={() => onNavigate("coach")}
            />
            <ActionTile
              icon={BarChart3}
              label="Log Metrics"
              desc="Track your progress"
              onClick={() => onNavigate("analytics")}
            />
          </div>
        </div>
      </section>

      {/* Metric Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Connections" value="—" change="" color="text-primary" />
        <MetricCard icon={Eye} label="Profile Views" value="—" change="" color="text-accent" />
        <MetricCard icon={Search} label="Search Appearances" value="—" change="" color="text-success" />
        <MetricCard icon={TrendingUp} label="Post Impressions" value="—" change="" color="text-warning" />
      </section>

      {/* Network Visualization & AI Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ThreeNetwork />
        </div>
        <div className="rounded-2xl bg-white border border-border p-6 shadow-card space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-txt-muted">
                  AI Insights
                </p>
                <h3 className="mt-1 text-lg font-bold text-txt">Growth Signals</h3>
              </div>
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div className="space-y-3 mt-5">
              {[
                "💡 Posts with a strong hook in the first line get 3x more engagement",
                "📊 Profiles with keyword-rich headlines appear 40% more in search",
                "🔥 Posting consistently 3-4 times/week doubles your reach in 60 days",
                "🎯 Thought leadership posts with personal stories outperform generic advice 3:1",
              ].map((tip, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-bg-surface/50 border border-border/50 text-sm text-txt-secondary font-medium"
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Guide */}
      <section className="grid grid-cols-1 gap-4">
        <div className="rounded-2xl bg-white border border-border p-6 shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-txt-muted">
                Getting Started
              </p>
              <h3 className="mt-1 text-lg font-bold text-txt">Your LinkedIn Growth Plan</h3>
            </div>
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { step: "1", text: "Audit your profile and apply AI-optimized headline", done: false },
              { step: "2", text: "Create your first thought leadership post", done: false },
              { step: "3", text: "Set up weekly metric tracking", done: false },
              { step: "4", text: "Ask the Growth Coach for a 30-day plan", done: false },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-center gap-3 p-3 rounded-xl bg-bg-surface/50 border border-border/50"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {item.step}
                </div>
                <p className="text-sm text-txt-secondary font-medium flex-1">{item.text}</p>
                <ArrowRight className="w-4 h-4 text-txt-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ActionTile({
  icon: Icon,
  label,
  desc,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-white/10 bg-white/8 p-4 text-left hover:bg-white/15 transition-all cursor-pointer backdrop-blur-sm group"
    >
      <Icon className="w-5 h-5 text-white/80 mb-2 group-hover:scale-110 transition-transform" />
      <p className="text-sm font-bold text-white">{label}</p>
      <p className="text-[10px] text-white/50 font-medium mt-0.5">{desc}</p>
    </button>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl bg-opacity-10 flex items-center justify-center ${color}`}
          style={{ backgroundColor: "currentColor", opacity: 0.1 }}>
          <Icon className={`w-4 h-4 ${color}`} style={{ opacity: 1 }} />
        </div>
        {change && (
          <span className="text-[10px] font-bold text-success bg-success-light px-2 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-txt">{value}</p>
      <p className="text-[11px] text-txt-muted font-semibold mt-1">{label}</p>
    </div>
  );
}
