"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Onboarding from "@/components/Onboarding";
import Dashboard from "@/components/Dashboard";
import ProfileOptimizer from "@/components/ProfileOptimizer";
import ContentStudio from "@/components/ContentStudio";
import GrowthCoach from "@/components/GrowthCoach";
import Analytics from "@/components/Analytics";
import Settings from "@/components/Settings";
import ContentCalendar from "@/components/ContentCalendar";
import { useIsOnboarded } from "@/lib/storage";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const isOnboarded = useIsOnboarded();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isOnboarded) {
      setShowOnboarding(true);
    }
  }, [mounted, isOnboarded]);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl grad-linkedin flex items-center justify-center animate-pulse-glow">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <p className="text-sm text-txt-muted font-semibold animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      <div className="flex h-screen overflow-hidden bg-bg">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Header activeTab={activeTab} />

          <main className="flex-1 overflow-y-auto relative custom-scroll pb-20 md:pb-10">
            {activeTab === "dashboard" && (
              <Dashboard onNavigate={setActiveTab} />
            )}
            {activeTab === "profile" && <ProfileOptimizer />}
            {activeTab === "studio" && <ContentStudio />}
            {activeTab === "coach" && <GrowthCoach />}
            {activeTab === "calendar" && <ContentCalendar />}
            {activeTab === "analytics" && <Analytics />}
            {activeTab === "settings" && <Settings />}
          </main>
        </div>
      </div>
    </>
  );
}
