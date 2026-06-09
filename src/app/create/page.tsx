"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseApiResponse } from "../../lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CreateThreadPage() {
  // States to track input and creation feedback
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState<{
    token: string;
    tempEmail: string;
    expiresAt: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !message) return;

    setIsSending(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/create-thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, message }),
      });

      const data = await parseApiResponse(response);

      // Format token for standard display TMP-ABCD-EFGH-IJKL
      const token = data.token;
      
      setSuccessData({
        token,
        tempEmail: data.tempEmail,
        expiresAt: new Date(data.expiresAt).toLocaleDateString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyToken = () => {
    if (!successData) return;
    navigator.clipboard.writeText(successData.token);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-112px)] bg-[#0B0D10] text-[#F8F8F8] flex items-center justify-center px-6 py-12">
      {/* Atmospheric Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="w-full max-w-xl bg-[#111418]/60 border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl p-8 backdrop-blur-md relative"
      >
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />

        <AnimatePresence mode="wait">
          {!successData ? (
            <motion.div
              key="create-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold text-[#F8F8F8] mb-2">
                  Send Anonymous Email
                </h2>
                <p className="text-xs text-[#A2A8B3]">
                  Start an untraceable, secure conversation thread.
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
                  <label className="text-sm font-medium text-[#A2A8B3] w-20">
                    To
                  </label>
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
                  <label className="text-sm font-medium text-[#A2A8B3] w-20">
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

                {/* Submit button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="bg-[#F8F8F8] text-[#0B0D10] font-medium px-6 py-3 rounded-lg hover:bg-neutral-200 transition-colors text-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isSending ? "Sending Securely..." : "Send Anonymous Email"}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success-display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-4"
            >
              <span className="text-indigo-400 text-xs font-semibold tracking-wider uppercase block mb-2">
                Email Sent Successfully
              </span>
              <h2 className="text-2xl font-semibold text-[#F8F8F8] mb-6">
                Access Key Generated
              </h2>

              <p className="text-sm text-[#A2A8B3] mb-8 leading-relaxed max-w-sm mx-auto">
                Your email has been dispatched from your temporary email address: <strong className="text-[#F8F8F8] block mt-1 font-mono">{successData.tempEmail}</strong>
              </p>

              {/* Token Display Box */}
              <div className="bg-[#161A20] border border-[rgba(255,255,255,0.08)] rounded-lg py-4 px-2 mb-8 select-all">
                <span className="font-mono text-lg text-[#F8F8F8] tracking-wider">
                  {successData.token}
                </span>
              </div>

              {/* Copy Button */}
              <button
                onClick={handleCopyToken}
                className="w-full bg-[#F8F8F8] text-[#0B0D10] font-medium py-3 rounded-lg hover:bg-neutral-200 transition-all text-sm mb-3 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isCopied ? "Copied to Clipboard" : "Copy Token"}
              </button>

              <div className="text-xs text-[#A2A8B3] border-t border-[rgba(255,255,255,0.06)] pt-6 mt-6">
                This thread and all replies will auto-destruct on <span className="text-[#F8F8F8]">{successData.expiresAt}</span>.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
