"use client";

import React from "react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

interface ComposerCardProps {
  to: string;
  setTo: (val: string) => void;
  subject: string;
  setSubject: (val: string) => void;
  message: string;
  setMessage: (val: string) => void;
  isSending: boolean;
  onSend: (e: React.FormEvent) => void;
}

export default function ComposerCard({
  to,
  setTo,
  subject,
  setSubject,
  message,
  setMessage,
  isSending,
  onSend,
}: ComposerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.1, ease }}
      className="w-full max-w-2xl bg-[#111418] border border-[rgba(255,255,255,0.08)] rounded-xl shadow-2xl overflow-hidden relative"
    >
      {/* Decorative clean line on top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.15)] to-transparent" />

      {/* Card Header */}
      <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between bg-[#161A20]/40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neutral-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A2A8B3]">
            Compose Message
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#A2A8B3]/60 bg-[#161A20] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.04)]">
          SECURE_RELAY_V1
        </span>
      </div>

      {/* Composer Form */}
      <form onSubmit={onSend} className="p-6 space-y-5">
        <div className="grid grid-cols-1 gap-5">
          {/* Recipient Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A2A8B3] uppercase tracking-wider">
              Recipient Email Address
            </label>
            <input
              type="email"
              required
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-[#0B0D10] border border-[rgba(255,255,255,0.06)] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none rounded-lg px-4 py-3 transition-all font-mono"
            />
          </div>

          {/* Subject Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A2A8B3] uppercase tracking-wider">
              Subject
            </label>
            <input
              type="text"
              required
              placeholder="Keep it brief and clean"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#0B0D10] border border-[rgba(255,255,255,0.06)] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none rounded-lg px-4 py-3 transition-all"
            />
          </div>

          {/* Message Body Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A2A8B3] uppercase tracking-wider">
              Message Content
            </label>
            <textarea
              required
              rows={6}
              placeholder="Write your message anonymously... HTML tags are automatically sanitized."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#0B0D10] border border-[rgba(255,255,255,0.06)] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none rounded-lg px-4 py-3 transition-all resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#A2A8B3]/60 font-mono">
            <span>Vanishes after 7 days</span>
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="bg-[#F8F8F8] text-[#0B0D10] font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-lg hover:bg-neutral-200 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSending ? "Relaying..." : "Send Message"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
