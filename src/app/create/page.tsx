"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CreateThreadPage() {
  // States to track input and creation feedback
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState<{
    tempEmail: string;
    expiresAt: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSending(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/create-thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create temporary inbox.");
      }

      setSuccessData({
        tempEmail: data.tempEmail,
        expiresAt: new Date(data.expiresAt).toLocaleTimeString([], {
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
                  Create Temporary Inbox
                </h2>
                <p className="text-xs text-[#A2A8B3]">
                  Enter your real email address. We will send you an access link to view your temporary inbox dashboard.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="flex flex-col sm:flex-row sm:items-center border-b border-[rgba(255,255,255,0.06)] pb-4 gap-2">
                  <label className="text-sm font-medium text-[#A2A8B3] w-20">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@yourdomain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow bg-transparent text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none w-full"
                  />
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="bg-[#F8F8F8] text-[#0B0D10] font-medium px-6 py-3 rounded-lg hover:bg-neutral-200 transition-colors text-sm disabled:opacity-50"
                  >
                    {isSending ? "Creating Inbox..." : "Create Temporary Inbox"}
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
                Inbox Provisioned
              </span>
              <h2 className="text-2xl font-semibold text-[#F8F8F8] mb-6">
                Check Your Email
              </h2>

              <p className="text-sm text-[#A2A8B3] mb-8 leading-relaxed max-w-sm mx-auto">
                We have generated your temporary email address and sent your private dashboard access link to <strong className="text-[#F8F8F8]">{email}</strong>.
              </p>

              {/* Temporary Address Box */}
              <div className="bg-[#161A20] border border-[rgba(255,255,255,0.08)] rounded-lg py-4 px-2 mb-6 select-all">
                <span className="font-mono text-base text-[#F8F8F8] tracking-wider">
                  {successData.tempEmail}
                </span>
              </div>

              <div className="text-xs text-[#A2A8B3] border-t border-[rgba(255,255,255,0.06)] pt-6">
                This temporary address will auto-destruct at <span className="text-[#F8F8F8]">{successData.expiresAt}</span>.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
