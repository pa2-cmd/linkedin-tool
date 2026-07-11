"use client";

import { useState, useEffect } from "react";
import {
  Home,
  User,
  Video,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  Mail,
  Bell,
  MoreHorizontal,
  Clock,
  RefreshCw,
  Lock
} from "lucide-react";
import { useSettings } from "@/lib/storage";

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const settings = useSettings();
  const [session, setSession] = useState<{ user?: { name?: string | null; image?: string | null } } | null>(null);

  // Profile headline text states
  const [headline, setHeadline] = useState(
    settings.headline || "Marketing Director | Digital Growth Strategist | LinkedIn Expert | B2B Content Champion"
  );
  
  const suggestions = [
    {
      text: "Driving B2B Revenue through Data-Driven LinkedIn Strategies & Content",
      score: 92
    },
    {
      text: "Leveraging 15+ Yrs to Build Brand Authority & Accelerate Business Growth",
      score: 88
    }
  ];

  const timelineItems = [
    {
      date: "Nov 20",
      views: "12K Views",
      topic: "Analyzing AI Trends",
      postTitle: "Post 1 (AI Recommended Hook)",
      body: "The AI revolution isn't coming... it's here. Is your business adapting or falling behind? Here are 3 ways we...",
      score: 94
    },
    {
      date: "Nov 18",
      views: "9K Views",
      topic: "Case Study: SaaS Startup",
      postTitle: "Post 2 (AI Recommended Hook)",
      body: "Building a startup is 10% idea and 90% distribution. Last month, we helped a SaaS brand hit 100k users. Here is how...",
      score: 89
    },
    {
      date: "Nov 15",
      views: "15K Views",
      topic: "Top 5 Leadership Tips",
      postTitle: "Post 3 (AI Recommended Hook)",
      body: "Great leaders don't manage results; they manage people. Here are the 5 lessons I learned from scaling teams...",
      score: 91
    }
  ];

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
    <div className="min-h-screen bg-[#F0F4F8] relative overflow-hidden p-4 md:p-8 xl:p-12 font-sans flex items-center justify-center">
      {/* Decorative Floating 3D/Glass Objects in Background */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-300/30 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-purple-300/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-12 w-16 h-16 rounded-full bg-indigo-300/10 blur-xl pointer-events-none animate-pulse" />

      {/* Main Glassmorphic Panel Wrapper */}
      <div className="relative w-full max-w-[1440px] bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_50px_100px_-20px_rgba(50,50,93,0.12),0_30px_60px_-30px_rgba(0,0,0,0.15)] rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Integrated Sidebar */}
        <aside className="w-full lg:w-[100px] bg-white/20 border-b lg:border-b-0 lg:border-r border-white/40 flex flex-row lg:flex-col items-center justify-between lg:justify-start p-4 lg:py-10 shrink-0 gap-8">
          {/* Logo Brand Icon */}
          <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 p-[2px] shadow-lg flex items-center justify-center transition-transform hover:scale-105 shrink-0">
            <div className="w-full h-full bg-white rounded-[1.15rem] flex items-center justify-center">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#0a66c2] to-blue-500 flex items-center justify-center text-white text-xs font-black shadow-inner">
                in
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-row lg:flex-col items-center gap-1 sm:gap-3 lg:gap-6">
            <SidebarBtn icon={Home} label="Home" active onClick={() => onNavigate("dashboard")} />
            <SidebarBtn icon={User} label="Profile" onClick={() => onNavigate("profile")} />
            <SidebarBtn icon={Video} label="Studio" onClick={() => onNavigate("studio")} />
            <SidebarBtn icon={MessageSquare} label="Coach" onClick={() => onNavigate("coach")} />
            <SidebarBtn icon={Calendar} label="Schedule" onClick={() => onNavigate("calendar")} />
            <SidebarBtn icon={BarChart3} label="Stats" onClick={() => onNavigate("analytics")} />
            <SidebarBtn icon={Settings} label="Settings" onClick={() => onNavigate("settings")} />
          </nav>

          <div className="hidden lg:block h-6" />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8 xl:p-10 flex flex-col gap-8 min-w-0">
          
          {/* Integrated Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#0B192C]">
                LinkedIn Growth Assistant
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">
                Hello, {session?.user?.name || settings.fullName || "Member"}! Overview
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <button className="w-10 h-10 rounded-full bg-white/80 border border-white flex items-center justify-center text-slate-600 hover:bg-white hover:text-blue-600 hover:scale-105 transition-all shadow-sm cursor-pointer">
                <Mail className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/80 border border-white flex items-center justify-center text-slate-600 hover:bg-white hover:text-blue-600 hover:scale-105 transition-all shadow-sm relative cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
              </button>
              
              <div className="flex items-center gap-3 bg-white/80 border border-white py-1.5 pl-2.5 pr-4 rounded-full shadow-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0a66c2] to-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
                  {(session?.user?.name || settings.fullName || "ME").slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-black text-[#0B192C] leading-none">{session?.user?.name || settings.fullName || "Member"}</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    LinkedIn Pro
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Cards Split Layout (Left: Auditor & Headline / Right: Hook Timeline) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* LEFT SECTION (Profile Auditor & Headline Tuning) */}
            <div className="xl:col-span-5 flex flex-col gap-6">
              
              {/* CARD 1: Profile Auditor Score */}
              <div className="bg-white/60 border border-white/80 p-5 rounded-[2rem] shadow-premium flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Profile Auditor Score
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <MoreHorizontal className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Big Circular Progress */}
                  <div className="relative w-36 h-36 flex items-center justify-center shrink-0 bg-white/30 rounded-full shadow-inner">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="54" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                      <circle
                        cx="72"
                        cy="72"
                        r="54"
                        fill="none"
                        stroke="#0077b5"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 54}
                        strokeDashoffset={(2 * Math.PI * 54) * (1 - 0.88)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <p className="text-4xl font-black text-[#0B192C]">88</p>
                      <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">
                        Growth Score
                      </p>
                    </div>
                  </div>

                  {/* Metrics Slider List */}
                  <div className="flex-1 w-full space-y-3.5">
                    <ProgressRow label="Completeness" val={92} color="bg-[#0077b5]" />
                    <ProgressRow label="Engagement" val={85} color="bg-emerald-500" />
                    <ProgressRow label="Reach" val={87} color="bg-purple-500" />
                  </div>
                </div>

                {/* View Insights footer */}
                <div className="flex items-center justify-between gap-4 border-t border-slate-100/50 pt-4 mt-2">
                  <div className="flex gap-2">
                    <MiniToolBtn icon="📊" />
                    <MiniToolBtn icon="⚙️" />
                    <MiniToolBtn icon="📈" />
                    <MiniToolBtn icon="🕒" />
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => onNavigate("profile")}
                      className="rounded-xl bg-[#0077b5] text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-[#005a87] transition-colors cursor-pointer"
                    >
                      View Insights
                    </button>
                    <p className="text-[8px] font-bold text-slate-400 mt-2">Audited: Nov 22, 2023</p>
                  </div>
                </div>
              </div>

              {/* CARD 2: Headline Tuning Panel */}
              <div className="bg-white/60 border border-white/80 p-5 rounded-[2rem] shadow-premium flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Headline Tuning Panel
                  </p>
                  <MoreHorizontal className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#0B192C]">
                    Optimize Your Professional Headline
                  </h3>
                </div>

                {/* Headline input box */}
                <div className="relative rounded-2xl border border-white/80 bg-white/40 p-4 shadow-inner">
                  <textarea
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full bg-transparent border-0 outline-none resize-none text-xs text-slate-600 font-semibold focus:ring-0 leading-relaxed"
                    rows={2}
                  />
                  <div className="absolute bottom-2 right-3">
                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      Score: 78
                    </span>
                  </div>
                </div>

                {/* Suggestions header */}
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-1">
                  Suggestions (A/B testing)
                </p>

                {/* Suggestions Cards */}
                <div className="space-y-2.5">
                  {suggestions.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => setHeadline(s.text)}
                      className="rounded-xl border border-white/60 bg-white/20 p-3.5 flex items-center justify-between gap-4 hover:border-blue-400/50 hover:bg-white/40 cursor-pointer transition-all shadow-sm"
                    >
                      <p className="text-[10px] font-bold text-slate-700 leading-normal flex-1">
                        {s.text}
                      </p>
                      <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shrink-0">
                        Score: {s.score}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between gap-4 border-t border-slate-100/50 pt-4 mt-2">
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-500 cursor-pointer">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-500 cursor-pointer">
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setHeadline(suggestions[0].text)}
                      className="rounded-xl border border-slate-200 text-slate-600 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
                    >
                      Refine
                    </button>
                    <button
                      onClick={() => setHeadline(suggestions[0].text)}
                      className="rounded-xl bg-[#0077b5] text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-[#005a87] transition-colors cursor-pointer"
                    >
                      Use Best
                    </button>
                  </div>
                </div>

                {/* Keyword tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[8px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
                    [Growth Strategy]
                  </span>
                  <span className="text-[8px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
                    [B2B Marketing]
                  </span>
                  <span className="text-[8px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
                    [Personal Branding]
                  </span>
                </div>
              </div>

            </div>

            {/* RIGHT SECTION (Content Hook Timeline) */}
            <div className="xl:col-span-7 bg-white/60 border border-white/80 p-5 rounded-[2rem] shadow-premium flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Content Hook Timeline
                </p>
                <MoreHorizontal className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#0B192C]">
                  AI-Powered Hook Suggestions
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Last 30 Days
                </p>
              </div>

              {/* Timeline list */}
              <div className="relative mt-4 flex-1 space-y-8 pl-4 sm:pl-8">
                {/* Visual vertical connector line */}
                <div className="absolute left-[20px] sm:left-[36px] top-4 bottom-4 w-0.5 bg-slate-200" />

                {timelineItems.map((item, idx) => (
                  <div key={idx} className="relative flex flex-col md:flex-row gap-4 md:items-start">
                    
                    {/* Timeline Node marker & metadata */}
                    <div className="relative flex items-center md:flex-col md:items-start shrink-0 min-w-[120px] gap-3">
                      {/* Node Bullet */}
                      <span className="absolute left-[4px] sm:left-[20px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-blue-500 shadow-md z-10 shrink-0" />
                      
                      {/* Node info */}
                      <div className="pl-8 sm:pl-12 md:pl-0 space-y-0.5 text-left">
                        <p className="text-xs font-black text-slate-800">{item.date}</p>
                        <p className="text-[9px] font-bold text-slate-400">{item.views}</p>
                        <p className="text-[8px] font-black text-blue-500 uppercase tracking-wider">
                          [{item.topic}]
                        </p>
                      </div>
                    </div>

                    {/* Timeline Post Details Card */}
                    <div className="flex-1 rounded-2xl border border-white/80 bg-white/40 p-4 shadow-sm relative space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs shrink-0">
                          👤
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-700 leading-tight">
                            {item.postTitle}
                          </p>
                          <span className="text-[8px] font-black text-blue-500 uppercase tracking-wider">
                            (AI Recommended Hook)
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        {item.body}
                      </p>

                      <div className="flex items-center justify-between gap-4 border-t border-slate-100/50 pt-3">
                        <div className="flex gap-3">
                          <button className="text-[9px] font-black text-[#0077b5] uppercase hover:underline cursor-pointer">
                            [Refine Hook]
                          </button>
                          <button className="text-[9px] font-black text-[#0077b5] uppercase hover:underline cursor-pointer">
                            [Preview]
                          </button>
                        </div>
                        <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shrink-0">
                          Score: {item.score}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

interface SidebarBtnProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick: () => void;
}

/* Sidebar button helper */
function SidebarBtn({ icon: Icon, label, active = false, onClick }: SidebarBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300 ${
        active
          ? "bg-[#0077b5] text-white shadow-lg shadow-blue-100 scale-105"
          : "text-slate-400 hover:bg-white/60 hover:text-[#0077b5]"
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-[9px] font-black uppercase tracking-wide scale-90">{label}</span>
    </button>
  );
}

/* Mini indicator tool button */
function MiniToolBtn({ icon }: { icon: string }) {
  return (
    <button className="w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-xs hover:bg-slate-50 cursor-pointer shadow-sm">
      {icon}
    </button>
  );
}

/* Progress Slider row */
function ProgressRow({ label, val, color }: { label: string; val: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[10px] font-black">
        <span className="text-slate-500 uppercase tracking-wider">{label}</span>
        <span className="text-[#0B192C]">{val}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${val}%` }} />
      </div>
    </div>
  );
}
