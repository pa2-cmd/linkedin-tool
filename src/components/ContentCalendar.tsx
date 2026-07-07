"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Sparkles,
  Trash2,
  Globe,
  RefreshCw,
  Check,
} from "lucide-react";

interface ScheduledPost {
  id: string;
  topic: string;
  format: string;
  content: string;
  scheduledFor: string;
  status: "scheduled" | "draft" | "published";
}

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPostTopic, setNewPostTopic] = useState("");
  const [newPostFormat, setNewPostFormat] = useState("thought_leadership");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [selectedTimeStr, setSelectedTimeStr] = useState("09:00");
  const fetchScheduledPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/posts?status=scheduled");
      if (res.ok) {
        const data = await res.json();
        setScheduledPosts(data);
      }
    } catch {
      // Fallback
      setScheduledPosts([
        {
          id: "1",
          topic: "AI Agents in SaaS",
          format: "thought_leadership",
          content: "Why building AI agents in SaaS requires a shift from UI-centric to workflow-centric design...",
          scheduledFor: getFutureDateOffset(1, "09:00"),
          status: "scheduled",
        },
        {
          id: "2",
          topic: "3D Graphics for Web Development",
          format: "commentary",
          content: "WebGL is no longer a luxury. Here is why you should add subtle 3D elements to your landing pages...",
          scheduledFor: getFutureDateOffset(3, "14:30"),
          status: "scheduled",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchScheduledPosts();
  }, [fetchScheduledPosts]);

  const getFutureDateOffset = (days: number, timeStr: string) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const dateStr = d.toISOString().split("T")[0];
    return `${dateStr}T${timeStr}:00.000Z`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Pad previous month's days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleOpenAddModal = (date: Date) => {
    const localDateStr = date.toISOString().split("T")[0];
    setSelectedDateStr(localDateStr);
    setShowAddModal(true);
  };

  const handleCreatePost = async () => {
    if (!newPostTopic || !newPostContent) return;

    const scheduledTime = `${selectedDateStr}T${selectedTimeStr}:00`;
    const newPost: Omit<ScheduledPost, "id"> = {
      topic: newPostTopic,
      format: newPostFormat,
      content: newPostContent,
      scheduledFor: new Date(scheduledTime).toISOString(),
      status: "scheduled",
    };

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (res.ok) {
        fetchScheduledPosts();
      } else {
        throw new Error();
      }
    } catch {
      // Offline fallback addition
      setScheduledPosts((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          ...newPost,
        },
      ]);
    }

    // Reset form
    setNewPostTopic("");
    setNewPostContent("");
    setShowAddModal(false);
  };

  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [publishedIds, setPublishedIds] = useState<string[]>([]);
  const [hasConnectedProfile, setHasConnectedProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setHasConnectedProfile(!!(data && data.user));
        }
      } catch {
        setHasConnectedProfile(false);
      }
    };
    checkProfile();
  }, []);

  const handlePublishPost = async (post: ScheduledPost) => {
    setPublishingId(post.id);
    try {
      const res = await fetch("/api/linkedin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: post.content, postId: post.id }),
      });
      if (res.ok) {
        setPublishedIds((prev) => [...prev, post.id]);
        setTimeout(() => {
          setPublishedIds((prev) => prev.filter((id) => id !== post.id));
          fetchScheduledPosts();
        }, 2000);
      } else {
        alert("Failed to publish post to LinkedIn.");
      }
    } catch {
      alert("Error publishing post to LinkedIn.");
    } finally {
      setPublishingId(null);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
      fetchScheduledPosts();
    } catch {
      setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Check if a day has scheduled posts
  const getPostsForDay = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return scheduledPosts.filter((p) => p.scheduledFor.startsWith(dateStr));
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-[1400px] mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-txt-muted">
            Consistency Builder
          </p>
          <h2 className="text-2xl font-extrabold text-txt mt-1">LinkedIn Post Calendar</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2 py-1 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-bg rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-txt-secondary" />
            </button>
            <span className="text-xs font-bold text-txt px-2 min-w-[100px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-bg rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-txt-secondary" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-white border border-border rounded-2xl shadow-card p-6">
          <div className="grid grid-cols-7 gap-2 mb-4 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day} className="text-[10px] font-bold text-txt-muted uppercase tracking-wider">
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, i) => {
              const dayPosts = getPostsForDay(day);
              const isToday = day && day.toDateString() === new Date().toDateString();

              return (
                <div
                  key={i}
                  className={`min-h-[100px] rounded-xl border p-2 flex flex-col justify-between transition-all ${
                    day
                      ? "border-border hover:border-primary/30 bg-bg-surface/10 cursor-pointer"
                      : "border-transparent bg-transparent pointer-events-none"
                  } ${isToday ? "ring-2 ring-primary ring-offset-2 bg-primary/5" : ""}`}
                  onClick={() => day && handleOpenAddModal(day)}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-extrabold ${
                        isToday ? "text-primary" : "text-txt-secondary"
                      }`}
                    >
                      {day ? day.getDate() : ""}
                    </span>

                    {/* Best Time Suggestion Indicator */}
                    {day && (day.getDay() === 2 || day.getDay() === 3 || day.getDay() === 4) && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow"
                        title="Optimal posting day suggested by AI"
                      />
                    )}
                  </div>

                  <div className="mt-2 space-y-1 overflow-hidden flex-1">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-primary/20 bg-primary/5 text-primary truncate max-w-full"
                        title={post.topic}
                      >
                        {post.topic}
                      </div>
                    ))}
                  </div>

                  {day && dayPosts.length === 0 && (
                    <div className="opacity-0 hover:opacity-100 flex justify-center py-1 transition-opacity">
                      <Plus className="w-3.5 h-3.5 text-primary/60" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Info & Upcoming Feed */}
        <div className="space-y-6">
          {/* Scheduling Guidelines */}
          <div className="rounded-2xl bg-white border border-border p-6 shadow-card space-y-4">
            <h3 className="text-sm font-extrabold text-txt flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" /> Optimal Timing Slots
            </h3>
            <p className="text-xs text-txt-secondary leading-relaxed">
              LinkedIn algorithm favors consistent posting during mid-week mornings. Recommending:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-bg-surface border border-border/50 text-[11px] font-bold text-txt">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Tue, Wed, Thu: 8:00 AM – 10:30 AM</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-bg-surface border border-border/50 text-[11px] font-bold text-txt">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Monday, Friday: 12:00 PM – 1:30 PM</span>
              </div>
            </div>
          </div>

          {/* Upcoming Posts Feed */}
          <div className="rounded-2xl bg-white border border-border p-6 shadow-card space-y-4">
            <h3 className="text-sm font-extrabold text-txt">Upcoming Queue</h3>
            <div className="space-y-3">
              {scheduledPosts.length === 0 ? (
                <div className="text-center py-6 text-txt-secondary text-xs italic">
                  No upcoming posts scheduled. Click a date to add one!
                </div>
              ) : (
                scheduledPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl border border-border/50 bg-bg-surface/30 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">
                        {post.format.replace("_", " ")}
                      </span>
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {hasConnectedProfile && (
                          <button
                            disabled={publishingId === post.id}
                            onClick={() => handlePublishPost(post)}
                            className="text-txt-muted hover:text-primary disabled:opacity-50 cursor-pointer"
                            title="Publish immediately to LinkedIn"
                          >
                            {publishingId === post.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : publishedIds.includes(post.id) ? (
                              <Check className="w-3.5 h-3.5 text-success" />
                            ) : (
                              <Globe className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-txt-muted hover:text-danger cursor-pointer"
                          title="Delete post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-txt line-clamp-1">{post.topic}</h4>
                    <p className="text-[11px] text-txt-secondary line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-txt-muted">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(post.scheduledFor).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Scheduled Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-elevated w-full max-w-lg space-y-4 m-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-md font-bold text-txt">Schedule LinkedIn Post</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-bold text-txt-secondary hover:text-txt"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-txt-muted">Topic / Title</label>
                <input
                  type="text"
                  value={newPostTopic}
                  onChange={(e) => setNewPostTopic(e.target.value)}
                  placeholder="e.g. AI Product Launch"
                  className="w-full mt-1 p-2 text-xs rounded-lg border border-border bg-bg-surface focus:outline-none focus:border-primary font-bold text-txt"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-txt-muted">Format</label>
                <select
                  value={newPostFormat}
                  onChange={(e) => setNewPostFormat(e.target.value)}
                  className="w-full mt-1 p-2 text-xs rounded-lg border border-border bg-bg-surface focus:outline-none focus:border-primary font-bold text-txt"
                >
                  <option value="thought_leadership">Thought Leadership</option>
                  <option value="carousel">Carousel Outline</option>
                  <option value="hook_spark">Hook Spark</option>
                  <option value="commentary">Commentary</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-txt-muted">Post Content</label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Draft your post details..."
                  rows={4}
                  className="w-full mt-1 p-2.5 text-xs rounded-lg border border-border bg-bg-surface focus:outline-none focus:border-primary font-medium text-txt custom-scroll"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-txt-muted">Scheduled Date</label>
                  <input
                    type="date"
                    value={selectedDateStr}
                    onChange={(e) => setSelectedDateStr(e.target.value)}
                    className="w-full mt-1 p-2 text-xs rounded-lg border border-border bg-bg-surface focus:outline-none focus:border-primary font-bold text-txt"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-txt-muted">Scheduled Time</label>
                  <input
                    type="time"
                    value={selectedTimeStr}
                    onChange={(e) => setSelectedTimeStr(e.target.value)}
                    className="w-full mt-1 p-2 text-xs rounded-lg border border-border bg-bg-surface focus:outline-none focus:border-primary font-bold text-txt"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-txt-secondary hover:bg-bg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!newPostTopic || !newPostContent}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
