"use client";

import { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import { Link2, Link2Off, RefreshCw, CheckCircle2, User } from "lucide-react";
import { saveSettings, useSettings } from "@/lib/storage";

export default function LinkedInConnect() {
  const [session, setSession] = useState<{ user?: { name?: string | null; email?: string | null; image?: string | null } } | null>(null);
  const [loading, setLoading] = useState(true);
  const settings = useSettings();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0 && data.user) {
            setSession(data);
            if (data.user.name && (!settings.fullName || settings.fullName === "")) {
              saveSettings({
                fullName: data.user.name,
                profilePhotoUrl: data.user.image || "",
              });
            }
          } else {
            setSession(null);
          }
        }
      } catch (err) {
        console.error("Error fetching auth session:", err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [settings.fullName, settings.profilePhotoUrl]);

  const handleConnect = async () => {
    setLoading(true);
    // Redirect to LinkedIn OAuth sign in
    signIn("linkedin");
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      // Sign out from next-auth
      await signOut({ redirect: false });
      setSession(null);
      // Clean settings if needed
      saveSettings({
        profilePhotoUrl: "",
      });
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-between p-5 rounded-2xl border border-border bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bg-surface flex items-center justify-center animate-spin">
            <RefreshCw className="w-5 h-5 text-txt-muted" />
          </div>
          <div>
            <p className="text-xs font-bold text-txt">Checking LinkedIn Connection...</p>
            <p className="text-[10px] text-txt-muted">Verifying authentication status</p>
          </div>
        </div>
      </div>
    );
  }

  if (session && session.user) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl border border-success/20 bg-success/5 shadow-sm">
        <div className="flex items-center gap-3.5">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "LinkedIn User"}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-extrabold text-txt leading-none">
                {session.user.name}
              </h4>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-success/20 text-success leading-none">
                <CheckCircle2 className="w-2.5 h-2.5" /> Connected
              </span>
            </div>
            <p className="text-[10px] text-txt-secondary mt-1 font-bold">
              {session.user.email || "No email shared"}
            </p>
          </div>
        </div>

        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-white hover:bg-danger-light border border-border hover:border-danger/20 text-danger hover:text-danger rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
        >
          <Link2Off className="w-4 h-4" />
          <span>Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl border border-border bg-white shadow-sm">
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-txt">Connect LinkedIn Account</h4>
        <p className="text-xs text-txt-secondary font-medium max-w-md">
          Authenticate using LinkedIn to publish generated posts directly from the Content Studio and Content Calendar.
        </p>
      </div>

      <button
        onClick={handleConnect}
        className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/15 transition-all self-start sm:self-center"
      >
        <Link2 className="w-4 h-4" />
        <span>Connect Profile</span>
      </button>
    </div>
  );
}
