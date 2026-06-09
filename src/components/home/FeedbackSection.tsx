"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Bug, Send, CheckCircle2, Loader2 } from "lucide-react";
import { parseApiResponse } from "../../lib/utils";

export default function FeedbackSection() {
  const [type, setType] = useState<"feedback" | "bug">("feedback");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, name, email, message }),
      });

      const data = await parseApiResponse(response);

      setIsSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-24 border-t border-[rgba(255,255,255,0.06)] bg-transparent flex flex-col items-center">
      <div className="w-full max-w-3xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-[#F8F8F8] mb-4">
            Help Us Improve
          </h2>
          <p className="text-[#A2A8B3] max-w-xl mx-auto">
            Found a bug? Have a feature request? Let us know. Your feedback goes directly to the developers.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#111418]/80 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 md:p-8"
        >
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-medium text-[#F8F8F8] mb-2">Thank you!</h3>
              <p className="text-[#A2A8B3]">Your {type} has been successfully submitted.</p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="mt-6 text-sm text-[#F8F8F8] underline underline-offset-4 hover:text-neutral-300"
              >
                Submit another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Toggle */}
              <div className="flex p-1 bg-[#0B0D10] rounded-xl border border-[rgba(255,255,255,0.06)] w-fit mx-auto">
                <button
                  type="button"
                  onClick={() => setType("feedback")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    type === "feedback" 
                      ? "bg-[#1A1D24] text-[#F8F8F8] shadow-sm" 
                      : "text-[#A2A8B3] hover:text-[#F8F8F8]"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setType("bug")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    type === "bug" 
                      ? "bg-[#1A1D24] text-[#F8F8F8] shadow-sm" 
                      : "text-[#A2A8B3] hover:text-[#F8F8F8]"
                  }`}
                >
                  <Bug className="w-4 h-4" />
                  Bug Report
                </button>
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#A2A8B3] ml-1">Name (Optional)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0B0D10] border border-[rgba(255,255,255,0.06)] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none rounded-xl px-4 py-3 transition-all"
                    placeholder="Anonymous"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#A2A8B3] ml-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B0D10] border border-[rgba(255,255,255,0.06)] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none rounded-xl px-4 py-3 transition-all"
                    placeholder="For follow-ups"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#A2A8B3] ml-1">
                  {type === "bug" ? "What went wrong?" : "Your Feedback"} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  className="w-full bg-[#0B0D10] border border-[rgba(255,255,255,0.06)] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none rounded-xl px-4 py-3 transition-all resize-none"
                  placeholder={type === "bug" ? "Describe the issue and how to reproduce it..." : "Tell us what you love or what could be better..."}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full bg-[#F8F8F8] text-[#0B0D10] font-semibold py-3 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit {type === "bug" ? "Report" : "Feedback"}
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
