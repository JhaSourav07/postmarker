"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CreateThreadPage() {
  // Reactive UI visual states
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !message) return;

    setIsSending(true);
    setErrorMessage("");

    // Form submission connection to API will be implemented in the next step
    setTimeout(() => {
      setIsSending(false);
      alert("Submission handler visual state passed. API connection pending.");
    }, 1000);
  };

  return (
    <div className="relative min-h-[calc(100vh-112px)] bg-[#0B0D10] text-[#F8F8F8] flex items-center justify-center px-6 py-12">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="w-full max-w-xl bg-[#111418]/60 border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl p-8 backdrop-blur-md relative"
      >
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-[#F8F8F8] mb-2">
            Compose Anonymous Email
          </h2>
          <p className="text-xs text-[#A2A8B3]">
            Start a new secure conversation thread.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* To Field */}
          <div className="flex flex-col sm:flex-row sm:items-center border-b border-[rgba(255,255,255,0.06)] pb-4 gap-2">
            <label className="text-sm font-medium text-[#A2A8B3] w-16">To</label>
            <input
              type="email"
              required
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-grow bg-transparent text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none w-full"
            />
          </div>

          {/* Subject Field */}
          <div className="flex flex-col sm:flex-row sm:items-center border-b border-[rgba(255,255,255,0.06)] pb-4 gap-2">
            <label className="text-sm font-medium text-[#A2A8B3] w-16">
              Subject
            </label>
            <input
              type="text"
              required
              placeholder="Secret message"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-grow bg-transparent text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none w-full"
            />
          </div>

          {/* Message Field */}
          <div className="flex flex-col gap-2">
            <textarea
              required
              rows={6}
              placeholder="Write your email anonymously..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-transparent text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none resize-none pt-2"
            />
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSending}
              className="bg-[#F8F8F8] text-[#0B0D10] font-medium px-6 py-3 rounded-lg hover:bg-neutral-200 transition-colors text-sm disabled:opacity-50"
            >
              {isSending ? "Processing..." : "Send Anonymous Email"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
