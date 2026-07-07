"use client";

import { useState, useEffect } from "react";
import { BarChart3, LineChart, TrendingUp, Users, Eye, Search, PlusCircle, AlertCircle } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

interface WeeklyLog {
  week: string;
  connections: number;
  profileViews: number;
  searchAppearances: number;
  postImpressions: number;
}

// Starter logs
const INITIAL_LOGS: WeeklyLog[] = [
  { week: "Week 1", connections: 450, profileViews: 120, searchAppearances: 45, postImpressions: 1200 },
  { week: "Week 2", connections: 480, profileViews: 155, searchAppearances: 52, postImpressions: 1800 },
  { week: "Week 3", connections: 510, profileViews: 140, searchAppearances: 48, postImpressions: 2100 },
  { week: "Week 4", connections: 545, profileViews: 185, searchAppearances: 60, postImpressions: 3200 },
];

export default function Analytics() {
  const [logs, setLogs] = useState<WeeklyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  
  // Form state
  const [connections, setConnections] = useState("");
  const [profileViews, setProfileViews] = useState("");
  const [searchAppearances, setSearchAppearances] = useState("");
  const [postImpressions, setPostImpressions] = useState("");
  const [formError, setFormError] = useState("");

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/metrics");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setLogs(data);
        } else {
          setLogs(INITIAL_LOGS);
        }
      } else {
        setLogs(INITIAL_LOGS);
      }
    } catch {
      setLogs(INITIAL_LOGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const conn = parseInt(connections);
    const views = parseInt(profileViews);
    const search = parseInt(searchAppearances);
    const imp = parseInt(postImpressions);

    if (isNaN(conn) || isNaN(views) || isNaN(search) || isNaN(imp)) {
      setFormError("All fields are required and must be valid numbers.");
      return;
    }

    try {
      const res = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connections: conn,
          profileViews: views,
          searchAppearances: search,
          postImpressions: imp,
          engagementRate: 0,
        }),
      });
      if (res.ok) {
        fetchLogs();
      } else {
        throw new Error();
      }
    } catch {
      const nextWeekNum = logs.length + 1;
      const newLog: WeeklyLog = {
        week: `Week ${nextWeekNum}`,
        connections: conn,
        profileViews: views,
        searchAppearances: search,
        postImpressions: imp,
      };
      setLogs((prev) => [...prev, newLog]);
    }

    setConnections("");
    setProfileViews("");
    setSearchAppearances("");
    setPostImpressions("");
    setShowLogForm(false);
  };

  const getLatestStats = () => {
    if (logs.length === 0) return { conn: 0, views: 0, search: 0, imp: 0 };
    const latest = logs[logs.length - 1];
    return {
      conn: latest.connections,
      views: latest.profileViews,
      search: latest.searchAppearances,
      imp: latest.postImpressions,
    };
  };

  const stats = getLatestStats();

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-txt-secondary font-bold">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-[1400px] mx-auto space-y-8 animate-fade-in">
      <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-txt tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" strokeWidth={2.5} /> Analytics Tracker
          </h3>
          <p className="text-sm text-txt-secondary font-medium">
            Log weekly metrics and visualize your connection, search appearance, and impression growth.
          </p>
        </div>
        <button
          onClick={() => setShowLogForm(!showLogForm)}
          className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-primary/10"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Weekly Stats</span>
        </button>
      </div>

      {/* Entry Modal Overlay */}
      {showLogForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddLog}
            className="w-full max-w-md bg-white rounded-2xl border border-border shadow-elevated p-6 space-y-4 animate-scale-in"
          >
            <h4 className="text-sm font-extrabold text-txt uppercase tracking-wider">Log Weekly LinkedIn Stats</h4>
            <p className="text-xs text-txt-secondary font-medium">
              Check your LinkedIn dashboard metrics and log them here.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-txt-secondary uppercase tracking-wider">Connections</label>
                <input
                  type="number"
                  value={connections}
                  onChange={(e) => setConnections(e.target.value)}
                  placeholder="Total count"
                  className="w-full px-3 py-2.5 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-txt-secondary uppercase tracking-wider">Profile Views</label>
                <input
                  type="number"
                  value={profileViews}
                  onChange={(e) => setProfileViews(e.target.value)}
                  placeholder="Last 90 days"
                  className="w-full px-3 py-2.5 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-txt-secondary uppercase tracking-wider">Search Appearances</label>
                <input
                  type="number"
                  value={searchAppearances}
                  onChange={(e) => setSearchAppearances(e.target.value)}
                  placeholder="Weekly count"
                  className="w-full px-3 py-2.5 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-txt-secondary uppercase tracking-wider">Post Impressions</label>
                <input
                  type="number"
                  value={postImpressions}
                  onChange={(e) => setPostImpressions(e.target.value)}
                  placeholder="Last 7 days"
                  className="w-full px-3 py-2.5 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-danger-light border border-danger/10 text-danger rounded-xl text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowLogForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-txt-secondary hover:bg-bg-surface cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Save Metrics
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Latest Metrics Ribbon */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticMetric icon={Users} label="Total Connections" value={stats.conn} color="text-primary" />
        <AnalyticMetric icon={Eye} label="90d Profile Views" value={stats.views} color="text-accent" />
        <AnalyticMetric icon={Search} label="Search Appearances" value={stats.search} color="text-success" />
        <AnalyticMetric icon={TrendingUp} label="Weekly Impressions" value={stats.imp} color="text-warning" />
      </section>

      {/* Charts section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impressions Growth Line */}
        <div className="rounded-2xl bg-white border border-border p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-txt flex items-center gap-2">
              <LineChart className="w-4.5 h-4.5 text-primary" /> Weekly Impressions Growth
            </h4>
            <span className="text-[10px] font-bold text-txt-muted uppercase tracking-wider">Visibility</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-clr)" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--txt-secondary)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--txt-secondary)" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "white", borderColor: "var(--border-clr)", borderRadius: "12px" }}
                />
                <Line type="monotone" dataKey="postImpressions" stroke="var(--primary)" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 4 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profile Views & Search appearances Bar */}
        <div className="rounded-2xl bg-white border border-border p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-txt flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-accent" /> Profile Search & Engagement
            </h4>
            <span className="text-[10px] font-bold text-txt-muted uppercase tracking-wider">SSI Indicators</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-clr)" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--txt-secondary)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--txt-secondary)" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "white", borderColor: "var(--border-clr)", borderRadius: "12px" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                <Bar dataKey="profileViews" fill="var(--accent)" name="Profile Views" radius={[4, 4, 0, 0]} />
                <Bar dataKey="searchAppearances" fill="var(--success)" name="Search Appearances" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

function AnalyticMetric({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl bg-opacity-10 flex items-center justify-center ${color}`}
        style={{ backgroundColor: "currentColor", opacity: 0.1 }}>
        <Icon className={`w-5 h-5 ${color}`} style={{ opacity: 1 }} />
      </div>
      <div>
        <p className="text-xl font-black text-txt">{value.toLocaleString()}</p>
        <p className="text-[10px] text-txt-secondary font-bold uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </div>
  );
}
