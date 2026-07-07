"use client";

import { useState } from "react";
import { Globe, Heart, MessageCircle, Share2, Send, CheckCircle2, MoreHorizontal } from "lucide-react";
import { useSettings } from "@/lib/storage";

interface LinkedInPostPreviewProps {
  post: string;
}

export default function LinkedInPostPreview({ post }: LinkedInPostPreviewProps) {
  const settings = useSettings();
  const [isExpanded, setIsExpanded] = useState(false);

  const fullName = settings.fullName || "Your Name";
  const headline = settings.headline || "Headline | Job Title | Keywords";

  const renderContent = () => {
    if (!post) {
      return (
        <p className="text-sm text-txt-secondary italic">
          Your generated post content will appear here...
        </p>
      );
    }

    const lines = post.split("\n");
    const previewThreshold = 4;

    if (lines.length <= previewThreshold || isExpanded) {
      return (
        <div className="linkedin-post-text whitespace-pre-wrap">
          {post}
        </div>
      );
    }

    const visibleText = lines.slice(0, previewThreshold).join("\n");

    return (
      <div className="linkedin-post-text">
        <div className="whitespace-pre-wrap">{visibleText}</div>
        <button
          onClick={() => setIsExpanded(true)}
          className="text-primary hover:text-primary-hover font-bold text-xs mt-1 hover:underline focus:outline-none"
        >
          ...see more
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white border border-border rounded-xl shadow-card w-full max-w-[550px] mx-auto text-txt overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex gap-2.5 items-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {settings.fullName
              ? settings.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "U"}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-txt hover:underline cursor-pointer truncate">
                {fullName}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary text-[10px] shrink-0" />
              <span className="text-[11px] text-txt-secondary font-medium shrink-0">• 2nd</span>
            </div>
            <p className="text-[11px] text-txt-secondary truncate max-w-[340px] font-medium leading-normal">
              {headline}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-txt-secondary mt-0.5 font-bold">
              <span>1h</span>
              <span>•</span>
              <Globe className="w-3 h-3 text-txt-secondary/80" />
            </div>
          </div>
        </div>
        <button className="text-txt-secondary hover:bg-bg-surface p-1.5 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4">
        {renderContent()}
      </div>

      {/* Post Social Stats */}
      {post && (
        <div className="px-4 py-2 border-b border-border flex items-center justify-between text-[11px] text-txt-secondary font-semibold bg-bg-surface/10">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-[#378FE9] text-white">
              <Heart className="w-2.5 h-2.5 fill-white text-[#378FE9]" />
            </span>
            <span>42 likes</span>
          </div>
          <div className="flex items-center gap-3">
            <span>12 comments</span>
            <span>•</span>
            <span>4 reposts</span>
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="px-2 py-1 flex items-center justify-between text-txt-secondary font-semibold bg-bg-surface/5">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs md:text-sm hover:bg-bg-surface rounded-lg transition-colors cursor-pointer">
          <Heart className="w-4.5 h-4.5" />
          <span>Like</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs md:text-sm hover:bg-bg-surface rounded-lg transition-colors cursor-pointer">
          <MessageCircle className="w-4.5 h-4.5" />
          <span>Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs md:text-sm hover:bg-bg-surface rounded-lg transition-colors cursor-pointer">
          <Share2 className="w-4.5 h-4.5" />
          <span>Repost</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs md:text-sm hover:bg-bg-surface rounded-lg transition-colors cursor-pointer">
          <Send className="w-4.5 h-4.5" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
