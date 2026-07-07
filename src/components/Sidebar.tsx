"use client";

import { useState } from "react";
import {
  Home,
  User,
  PenTool,
  CalendarDays,
  MessageCircle,
  BarChart3,
  Settings,
  ChevronLeft,
} from "lucide-react";

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const NAV_GROUPS = [
  {
    title: "PULSE",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "GROWTH",
    items: [
      { id: "profile", label: "Profile Optimizer", icon: User },
      { id: "studio", label: "Content Studio", icon: PenTool },
      { id: "calendar", label: "Post Calendar", icon: CalendarDays },
    ],
  },
  {
    title: "COACH",
    items: [
      { id: "coach", label: "Growth Coach", icon: MessageCircle },
    ],
  },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex ${
          collapsed ? "w-[72px]" : "w-[260px]"
        } bg-white border-r border-border flex-col shrink-0 h-screen sticky top-0 z-50 transition-all duration-300 ease-in-out`}
      >
        {/* Branding */}
        <div className={`p-5 ${collapsed ? "px-3" : "px-6"} pb-6`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl grad-linkedin flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
              <LinkedInIcon className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-[15px] font-extrabold text-txt tracking-tight leading-none">
                  LinkedIn<span className="text-primary">.Growth</span>
                </h1>
                <p className="text-[9px] text-txt-muted uppercase tracking-[0.2em] font-bold mt-1">
                  AI-Powered Tool
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Nav Groups */}
        <div className="flex-1 px-3 space-y-6 overflow-y-auto custom-scroll">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              {!collapsed && (
                <h3 className="px-3 text-[10px] font-extrabold text-txt-muted uppercase tracking-[0.18em] mb-2">
                  {group.title}
                </h3>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] cursor-pointer group relative ${
                      isActive
                        ? "bg-primary/10 text-primary font-bold shadow-sm"
                        : "text-txt-secondary hover:bg-bg-surface hover:text-txt"
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] shrink-0 transition-transform ${
                        isActive ? "scale-110" : "group-hover:scale-105"
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {!collapsed && (
                      <span className="truncate tracking-tight font-semibold">
                        {item.label}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Settings + Collapse */}
        <div className="p-3 border-t border-border space-y-2">
          <button
            onClick={() => onTabChange("settings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] cursor-pointer ${
              activeTab === "settings"
                ? "bg-primary/10 text-primary font-bold"
                : "text-txt-secondary hover:bg-bg-surface hover:text-txt"
            }`}
          >
            <Settings className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
            {!collapsed && <span className="font-semibold">Settings</span>}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] text-txt-muted hover:bg-bg-surface cursor-pointer"
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
            {!collapsed && <span className="font-semibold">Collapse</span>}
          </button>

          {/* Status */}
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-success ring-4 ring-success/10 animate-pulse" />
            {!collapsed && (
              <p className="text-[9px] font-bold text-txt-muted uppercase tracking-wider">
                Gemini Ready
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border px-2 py-1 flex items-center justify-around safe-area-bottom">
        {[
          { id: "dashboard", icon: Home, label: "Home" },
          { id: "profile", icon: User, label: "Profile" },
          { id: "studio", icon: PenTool, label: "Studio" },
          { id: "coach", icon: MessageCircle, label: "Coach" },
          { id: "settings", icon: Settings, label: "Settings" },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg cursor-pointer ${
                isActive ? "text-primary" : "text-txt-muted"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[9px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
