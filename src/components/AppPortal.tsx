"use client";

import React, { useState, useEffect } from "react";
import Onboarding from "@/components/Onboarding";
import Dashboard from "@/components/Dashboard";
import ProfileOptimizer from "@/components/ProfileOptimizer";
import ContentStudio from "@/components/ContentStudio";
import GrowthCoach from "@/components/GrowthCoach";
import Analytics from "@/components/Analytics";
import Settings from "@/components/Settings";
import ContentCalendar from "@/components/ContentCalendar";
import AdminPanel from "@/components/AdminPanel";
import Login from "@/components/Login";
import AccessDenied from "@/components/AccessDenied";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { useIsOnboarded } from "@/lib/storage";
import {
  Home,
  User,
  Video,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings as SettingsIcon,
  Mail,
  Bell,
  LogOut
} from "lucide-react";

interface SidebarBtnProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function SidebarBtn({ icon: Icon, label, active = false, onClick }: SidebarBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300 ${
        active
          ? "bg-[#0077b5] text-white shadow-lg shadow-blue-100 scale-105"
          : "text-slate-400 hover:bg-white/80 hover:text-[#0077b5]"
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-[9px] font-black uppercase tracking-wide scale-90">{label}</span>
    </button>
  );
}

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const MusicIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.54a29 29 0 0 0 .46 5.12 2.78 2.78 0 0 0 1.95 1.96C5.12 19.08 12 19.08 12 19.08s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 11.54a29 29 0 0 0-.46-5.12z"></path>
    <polygon points="9.75 15.02 15.5 11.54 9.75 8.06 9.75 15.02"></polygon>
  </svg>
);

const MicIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

interface SocialIconProps {
  color: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
}

function SocialIcon({ color, icon: Icon, label, onClick }: SocialIconProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-9 h-9 rounded-xl ${color} text-white flex items-center justify-center shadow-md hover:scale-115 hover:rotate-3 transition-all cursor-pointer border-0`}
    >
      <Icon className="w-4.5 h-4.5 shrink-0" />
    </button>
  );
}

function AppContent({ defaultTab = "dashboard" }: { defaultTab?: string }) {
  const { user, loading, hasAccess, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const isOnboarded = useIsOnboarded();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isOnboarded && hasAccess) {
      setShowOnboarding(true);
    }
  }, [mounted, isOnboarded, hasAccess]);

  if (!mounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl grad-linkedin flex items-center justify-center animate-pulse-glow">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <p className="text-sm text-txt-muted font-semibold animate-pulse">Loading LinkedIn Growth...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    const commonHomeUrl = process.env.NEXT_PUBLIC_SOCIAL_MEDIA_URL || "https://social-media-tool-three.vercel.app";
    return (
      <div className="relative">
        <button
          onClick={() => window.location.href = commonHomeUrl}
          className="absolute top-6 left-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all z-50 cursor-pointer"
        >
          ← Back to Home
        </button>
        <Login />
      </div>
    );
  }

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return (
    <>
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      <div className="min-h-screen bg-[#F0F4F8] relative overflow-hidden flex flex-col lg:flex-row font-sans">
        {/* Decorative Floating 3D/Glass Objects in Background */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-300/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-purple-300/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-12 w-16 h-16 rounded-full bg-indigo-300/10 blur-xl pointer-events-none animate-pulse" />

        {/* Global Sidebar (Left) */}
        <aside className="w-full lg:w-[100px] bg-white border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-row lg:flex-col items-center justify-between lg:justify-start p-4 lg:py-10 shrink-0 gap-8 z-30">
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
            <SidebarBtn icon={Home} label="Home" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
            <SidebarBtn icon={User} label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
            <SidebarBtn icon={Video} label="Studio" active={activeTab === "studio"} onClick={() => setActiveTab("studio")} />
            <SidebarBtn icon={MessageSquare} label="Coach" active={activeTab === "coach"} onClick={() => setActiveTab("coach")} />
            <SidebarBtn icon={Calendar} label="Schedule" active={activeTab === "calendar"} onClick={() => setActiveTab("calendar")} />
            <SidebarBtn icon={BarChart3} label="Stats" active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
            <SidebarBtn icon={SettingsIcon} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
            {user.isAdmin && (
              <SidebarBtn icon={SettingsIcon} label="Admin" active={activeTab === "admin"} onClick={() => setActiveTab("admin")} />
            )}
          </nav>

          {/* Sleek Log Out Action */}
          <button
            onClick={logout}
            title="Log Out"
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer mt-auto hidden lg:flex"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </aside>

        {/* Right Floating Social Pill */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-3.5 bg-white/80 backdrop-blur-md border border-slate-200/55 p-3 rounded-l-2xl shadow-xl">
          <SocialIcon color="bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600" icon={InstagramIcon} label="Instagram" onClick={() => {
            const url = process.env.NEXT_PUBLIC_SOCIAL_MEDIA_URL || "https://social-media-tool-three.vercel.app";
            const sso = typeof window !== "undefined" ? localStorage.getItem("skilizee_sso") : null;
            window.location.href = sso ? `${url}?sso=${sso}&tab=analytics` : `${url}?tab=analytics`;
          }} />
          <SocialIcon color="bg-black" icon={MusicIcon} label="TikTok" onClick={() => {
            const url = process.env.NEXT_PUBLIC_SOCIAL_MEDIA_URL || "https://social-media-tool-three.vercel.app";
            const sso = typeof window !== "undefined" ? localStorage.getItem("skilizee_sso") : null;
            window.location.href = sso ? `${url}?sso=${sso}&tab=analytics` : `${url}?tab=analytics`;
          }} />
          <SocialIcon color="bg-[#0077b5]" icon={LinkedinIcon} label="LinkedIn" onClick={() => setActiveTab("dashboard")} />
          <SocialIcon color="bg-[#ff0000]" icon={YoutubeIcon} label="YouTube" onClick={() => {
            const url = process.env.NEXT_PUBLIC_SOCIAL_MEDIA_URL || "https://social-media-tool-three.vercel.app";
            const sso = typeof window !== "undefined" ? localStorage.getItem("skilizee_sso") : null;
            window.location.href = sso ? `${url}?sso=${sso}&tab=analytics` : `${url}?tab=analytics`;
          }} />
          <SocialIcon color="bg-indigo-600" icon={MicIcon} label="Podcast Studio" onClick={() => {
            const url = "https://podcast-tool-ccis.vercel.app/";
            const sso = typeof window !== "undefined" ? localStorage.getItem("skilizee_sso") : null;
            window.location.href = sso ? `${url}?sso=${sso}` : url;
          }} />
        </div>

        {/* Content wrapper with integrated header */}
        <div className="flex-1 p-6 md:p-8 xl:p-10 flex flex-col gap-8 min-w-0 z-10 overflow-y-auto h-screen custom-scroll pb-20">
          
          {/* Global Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#0B192C]">
                {activeTab === "dashboard" && "LinkedIn Growth Assistant"}
                {activeTab === "profile" && "Headline & Profile Optimizer"}
                {activeTab === "studio" && "Production Content Studio"}
                {activeTab === "coach" && "AI Growth Coach"}
                {activeTab === "calendar" && "LinkedIn Post Scheduler"}
                {activeTab === "analytics" && "Metrics & Analytics"}
                {activeTab === "settings" && "LinkedIn Configurations"}
                {activeTab === "admin" && "Administrative Portal"}
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">
                Hello, {user?.name || "Member"}! Overview
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:scale-105 transition-all shadow-sm cursor-pointer">
                <Mail className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:scale-105 transition-all shadow-sm relative cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
              </button>
              
              <div className="flex items-center gap-3 bg-white border border-slate-200 py-1.5 pl-2.5 pr-4 rounded-full shadow-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0a66c2] to-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
                  {user?.name?.slice(0, 2).toUpperCase() || "ME"}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-black text-[#0B192C] leading-none">{user?.name || "Member"}</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    LinkedIn Pro
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic page content */}
          <div className="w-full flex-1">
            {activeTab === "dashboard" && (
              <Dashboard onNavigate={setActiveTab} />
            )}
            {activeTab === "profile" && <ProfileOptimizer />}
            {activeTab === "studio" && <ContentStudio />}
            {activeTab === "coach" && <GrowthCoach />}
            {activeTab === "calendar" && <ContentCalendar />}
            {activeTab === "analytics" && <Analytics />}
            {activeTab === "settings" && <Settings />}
            {activeTab === "admin" && user.isAdmin && <AdminPanel />}
          </div>
        </div>
      </div>
    </>
  );
}

export default function AppPortal({ defaultTab = "dashboard" }: { defaultTab?: string }) {
  return (
    <AuthProvider>
      <AppContent defaultTab={defaultTab} />
    </AuthProvider>
  );
}
