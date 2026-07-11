"use client";

import React from "react";
import { ArrowRight, Zap, BarChart3, PenTool, UserCheck, KeyRound } from "lucide-react";
import ThreeNetwork from "./ThreeNetwork";

interface LandingPageProps {
  onSignInClick: () => void;
}

export default function LandingPage({ onSignInClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#090D16] text-[#EDF2F7] font-sans overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#090D16]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl grad-linkedin flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
            <span className="text-[16px] font-black tracking-tight text-white">
              LinkedIn<span className="text-[#0077b5]">.Growth</span>
            </span>
          </div>

          <button
            onClick={onSignInClick}
            className="px-5 py-2 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border border-white/10 hover:border-white"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:py-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] rounded-full bg-[#0077b5]/10 blur-[150px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-extrabold uppercase tracking-widest text-[#0077b5]">
              <Zap className="w-3 h-3 animate-pulse" />
              AI-Powered Growth Suite
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Scale Your Professional Influence on <span className="text-[#0077b5] bg-gradient-to-r from-blue-400 to-[#0077b5] bg-clip-text text-transparent">LinkedIn</span>
            </h1>
            
            <p className="text-base text-slate-400 max-w-xl mx-auto lg:mx-0 font-medium">
              Perfect your profile headline, generate high-converting viral hooks, auto-schedule posts, and monitor analytics—all driven by Gemini AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onSignInClick}
                className="px-8 py-4 bg-[#0077b5] hover:bg-[#006297] text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#features"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-black text-slate-300 transition-all w-full sm:w-auto justify-center text-center"
              >
                Explore Features
              </a>
            </div>

            {/* Quick stats list */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/5 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-black text-white">10x</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Faster Writing</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">4.8★</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Growth Rating</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Safe & Compliant</p>
              </div>
            </div>
          </div>

          {/* Interactive Network preview */}
          <div className="lg:col-span-5 h-[350px] lg:h-[450px]">
            <ThreeNetwork />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-[#06090F] border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Optimize Every Aspect of Your Brand
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto font-medium">
              Eliminate guesswork. Our smart AI tool provides immediate analysis, structured scripting templates, and visual schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#090D16] border border-white/5 p-8 rounded-3xl space-y-4 hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Profile Optimizer</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Audit headlines, summaries, and experience. Receive Gemini AI improvements with a historical snapshot log to track version updates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#090D16] border border-white/5 p-8 rounded-3xl space-y-4 hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Content Studio</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Generate LinkedIn posts tailored with viral hook patterns, tone controls, formatting tags, and interactive layout previews.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#090D16] border border-white/5 p-8 rounded-3xl space-y-4 hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Analytics & Calendar</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Queue and schedule posts inside a drag-and-drop calendar. Track and chart weekly growth performance metrics in one hub.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#0077b5]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Ready to Accelerate Your Professional Growth?
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto font-semibold">
            Unlock AI-powered writing, profile auditing, and audience expansion features with secure, role-based login credentials.
          </p>

          <button
            onClick={onSignInClick}
            className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-sm font-black tracking-wide shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Launch Growth Tool</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-[#06090F] text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-bold">© 2026 Skilizee.io. All rights reserved.</p>
          <div className="flex gap-6 font-semibold">
            <a href="#" className="hover:text-slate-350">Privacy Policy</a>
            <a href="#" className="hover:text-slate-350">Terms of Service</a>
            <a href="mailto:pa2@skillizee.io" className="hover:text-[#0077b5]">Contact Admin</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
