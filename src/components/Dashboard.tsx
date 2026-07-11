"use client";

import React, { useState } from "react";
import {
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full animate-fade-in">
      
      {/* LEFT SECTION (Profile Auditor & Headline Tuning) */}
      <div className="xl:col-span-5 flex flex-col gap-6">
        
        {/* CARD 1: Profile Auditor Score */}
        <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-premium flex flex-col gap-5">
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
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0 bg-slate-50 rounded-full shadow-inner">
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
        <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-premium flex flex-col gap-4">
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
          <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-inner">
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
                className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 flex items-center justify-between gap-4 hover:border-blue-400/50 hover:bg-white cursor-pointer transition-all shadow-sm"
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
      <div className="xl:col-span-7 bg-white border border-slate-100 p-5 rounded-[2rem] shadow-premium flex flex-col gap-4">
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
              <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm relative space-y-3">
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
                    <button className="text-[9px] font-black text-[#0077b5] uppercase hover:underline cursor-pointer bg-transparent border-0 p-0">
                      [Refine Hook]
                    </button>
                    <button className="text-[9px] font-black text-[#0077b5] uppercase hover:underline cursor-pointer bg-transparent border-0 p-0">
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
