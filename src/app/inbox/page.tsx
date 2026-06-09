"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function InboxLandingPage() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");
  const [isAccessing, setIsAccessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setIsAccessing(true);
    router.push(`/inbox/${tokenInput.trim()}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-112px)] bg-[#0B0D10] text-[#F8F8F8] flex items-center justify-center px-6 py-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="w-full max-w-md bg-[#111418] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />

        <h2 className="text-2xl font-semibold text-[#F8F8F8] mb-2 text-center">
          Access your Inbox
        </h2>
        <p className="text-xs text-[#A2A8B3] mb-8 leading-relaxed text-center">
          Enter your secret token to retrieve active anonymous email threads.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="TMP-XXXX-XXXX-XXXX"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="w-full bg-[#161A20] border border-[rgba(255,255,255,0.08)] text-[#F8F8F8] px-4 py-3 rounded-lg placeholder-neutral-700 outline-none focus:border-neutral-500 focus:placeholder-neutral-500 transition-colors text-sm font-mono text-center tracking-wider"
          />

          <button
            type="submit"
            disabled={isAccessing}
            className="w-full bg-[#F8F8F8] text-[#0B0D10] font-medium py-3 rounded-lg hover:bg-neutral-200 transition-all text-sm active:scale-[0.98] transition-transform cursor-pointer"
          >
            {isAccessing ? "Accessing Inbox..." : "Open Inbox"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
