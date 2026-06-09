"use client";

import React from "react";

interface InboxHeaderProps {
  tempEmail: string;
  expiresAt: string;
  isCopied: boolean;
  isRefreshing: boolean;
  onCopyEmail: () => void;
  onRefresh: () => void;
}

export default function InboxHeader({
  tempEmail,
  expiresAt,
  isCopied,
  isRefreshing,
  onCopyEmail,
  onRefresh,
}: InboxHeaderProps) {
  // Format expiration date string
  const formatExpiry = (isoString: string) => {
    const expiry = new Date(isoString);
    const diffMs = expiry.getTime() - Date.now();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours <= 0) return "Expired";
    if (diffHours < 24) return `Expires in ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Expires in ${diffDays}d ${diffHours % 24}h`;
  };

  return (
    <div className="w-full h-16 border-b border-[rgba(255,255,255,0.08)] bg-[#111418]/60 flex items-center justify-between px-6 select-none relative z-20">
      {/* Dynamic Temporary Address Display */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        <span className="text-xs font-mono font-medium text-[#A2A8B3] uppercase tracking-wider hidden sm:inline">
          Alias:
        </span>
        <span className="font-mono text-sm font-semibold text-[#F8F8F8] truncate select-all">
          {tempEmail}
        </span>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-3">
        {/* Expiry Badge */}
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400 bg-[#161A20] px-2.5 py-1 rounded border border-[rgba(255,255,255,0.04)] hidden md:inline">
          {formatExpiry(expiresAt)}
        </span>

        {/* Copy Button */}
        <button
          onClick={onCopyEmail}
          className="text-xs bg-[#111418] hover:bg-[#161A20] border border-[rgba(255,255,255,0.08)] px-3 py-1.5 rounded-lg transition-colors font-medium text-neutral-200 cursor-pointer"
        >
          {isCopied ? "Copied" : "Copy Alias"}
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="text-xs bg-[#F8F8F8] text-[#0B0D10] px-3 py-1.5 rounded-lg hover:bg-neutral-200 transition-colors font-semibold uppercase tracking-wider disabled:opacity-55 cursor-pointer"
        >
          {isRefreshing ? "Syncing..." : "Sync"}
        </button>
      </div>
    </div>
  );
}
