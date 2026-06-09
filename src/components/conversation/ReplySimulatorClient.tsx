"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function ReplySimulatorClient() {
  const [toAddress, setToAddress] = useState("");
  const [fromAddress, setFromAddress] = useState("john@example.com");
  const [subject, setSubject] = useState("Re: Secret message");
  const [message, setMessage] = useState("Hello back from the simulator.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedback, setFeedback] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toAddress || !fromAddress || !subject || !message) return;

    setIsSubmitting(true);
    setFeedback(null);

    // Generate a unique messageId to prevent duplicate key errors in database
    const randomId = Math.random().toString(36).substring(2, 15);
    const messageId = `<simulated-${randomId}@postmarker-simulator>`;

    try {
      const response = await fetch("/api/inbox", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: toAddress,
          subject,
          html: `<div style="font-family: sans-serif; padding: 10px;">${message}</div>`,
          text: message,
          messageId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ingestion simulation failed.");
      }

      setFeedback({
        status: "success",
        message: "Inbound email successfully ingested by Postmarker!",
      });
    } catch (err: any) {
      setFeedback({
        status: "error",
        message:
          err.message || "An unexpected error occurred during simulation.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="bg-[#111418]/60 border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl p-8 backdrop-blur-md relative"
      >
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-[#F8F8F8] mb-2">
            Inbound Simulator
          </h2>
          <p className="text-xs text-[#A2A8B3]">
            Simulate an incoming email reply to verify routing and ingestion.
          </p>
        </div>

        {feedback && (
          <div
            className={`mb-6 p-4 rounded-lg border text-xs ${
              feedback.status === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Address */}
          <div className="flex flex-col sm:flex-row sm:items-center border-b border-[rgba(255,255,255,0.06)] pb-4 gap-2">
            <label className="text-sm font-medium text-[#A2A8B3] w-24">
              Recipient
            </label>
            <input
              type="text"
              required
              placeholder="threadId@yourdomain.com"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="flex-grow bg-transparent text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none w-full font-mono"
            />
          </div>

          {/* Sender Address */}
          <div className="flex flex-col sm:flex-row sm:items-center border-b border-[rgba(255,255,255,0.06)] pb-4 gap-2">
            <label className="text-sm font-medium text-[#A2A8B3] w-24">
              Sender
            </label>
            <input
              type="email"
              required
              placeholder="sender@example.com"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              className="flex-grow bg-transparent text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none w-full"
            />
          </div>

          {/* Subject */}
          <div className="flex flex-col sm:flex-row sm:items-center border-b border-[rgba(255,255,255,0.06)] pb-4 gap-2">
            <label className="text-sm font-medium text-[#A2A8B3] w-24">
              Subject
            </label>
            <input
              type="text"
              required
              placeholder="Re: Anonymous message"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-grow bg-transparent text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none w-full"
            />
          </div>

          {/* Reply Content */}
          <div className="flex flex-col gap-2">
            <textarea
              required
              rows={5}
              placeholder="Enter mock reply content..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-transparent text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none resize-none pt-2"
            />
          </div>

          {/* Action button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#F8F8F8] text-[#0B0D10] font-medium px-6 py-3 rounded-lg hover:bg-neutral-200 transition-colors text-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Simulating Ingestion..." : "Simulate Inbound Email"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
