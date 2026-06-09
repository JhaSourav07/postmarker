"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const; // Premium cubic-bezier transition

export default function Home() {
  // Composer Form State
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Success Modal State
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Handle Live Send
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !message) return;

    setIsSending(true);
    try {
      const response = await fetch("/api/create-thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to dispatch email.");
      }

      setGeneratedToken(data.token);
      setShowSuccess(true);
      setTo("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsSending(false);
    }
  };

  // Handle Copy Token
  const handleCopyToken = () => {
    navigator.clipboard.writeText(generatedToken);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#0B0D10] text-[#F8F8F8] overflow-x-hidden flex flex-col items-center">
      {/* Subtle background atmospheric blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/5 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[800px] left-[10%] w-[500px] h-[250px] bg-purple-500/3 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Main Container */}
      <div className="w-full max-w-6xl px-6 relative z-10 flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full pt-20 pb-12 md:pt-32 md:pb-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            className="flex flex-col items-center"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[1.05] mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-[#F8F8F8] to-[#A2A8B3]">
              Email without identity.
            </h1>
            <p className="text-lg sm:text-2xl text-[#A2A8B3] max-w-2xl font-light leading-relaxed mb-12">
              Send anonymous emails and access replies using a secret token.
            </p>
          </motion.div>

          {/* PRODUCT-FIRST DESIGN: Luxury Email Composer Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease }}
            className="w-full max-w-2xl bg-[#111418]/60 border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md relative"
          >
            {/* Soft decorative light border element */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />

            <form onSubmit={handleSend} className="space-y-6 text-left">
              {/* To Row */}
              <div className="flex flex-col sm:flex-row sm:items-center border-b border-[rgba(255,255,255,0.06)] pb-4 gap-2">
                <label className="text-sm font-medium text-[#A2A8B3] w-16">
                  To
                </label>
                <input
                  type="email"
                  required
                  placeholder="recipient@example.com"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="flex-grow bg-transparent text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none focus:placeholder-neutral-500 transition-colors w-full"
                />
              </div>

              {/* Subject Row */}
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
                  className="flex-grow bg-transparent text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none focus:placeholder-neutral-500 transition-colors w-full"
                />
              </div>

              {/* Message Row */}
              <div className="flex flex-col gap-2">
                <textarea
                  required
                  rows={6}
                  placeholder="Write your email anonymously..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#F8F8F8] placeholder-neutral-700 outline-none focus:placeholder-neutral-500 transition-colors resize-none pt-2"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="relative group overflow-hidden bg-[#F8F8F8] text-[#0B0D10] font-medium px-6 py-3 rounded-lg hover:bg-neutral-200 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSending ? "Sending Securely..." : "Send Anonymous Email"}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </section>

        {/* OVERSIZED EDITORIAL FEATURE STATEMENTS */}
        <section className="w-full py-24 sm:py-32 space-y-32 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="w-full max-w-4xl text-left border-t border-[rgba(255,255,255,0.05)] pt-12"
          >
            <p className="text-[#A2A8B3] text-xs font-semibold tracking-widest uppercase mb-4">
              01 / Identity
            </p>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6">
              No signup.
            </h2>
            <p className="text-lg sm:text-xl text-[#A2A8B3] font-light max-w-xl leading-relaxed">
              No personal information. Just a secret token. Privacy shouldn&apos;t require credentials.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="w-full max-w-4xl text-left border-t border-[rgba(255,255,255,0.05)] pt-12"
          >
            <p className="text-[#A2A8B3] text-xs font-semibold tracking-widest uppercase mb-4">
              02 / Retention
            </p>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6">
              No archives.
            </h2>
            <p className="text-lg sm:text-xl text-[#A2A8B3] font-light max-w-xl leading-relaxed">
              Every message and thread vanishes automatically after 24 hours. Safe, transient data routing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="w-full max-w-4xl text-left border-t border-[rgba(255,255,255,0.05)] pt-12"
          >
            <p className="text-[#A2A8B3] text-xs font-semibold tracking-widest uppercase mb-4">
              03 / Isolation
            </p>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6">
              No trackers.
            </h2>
            <p className="text-lg sm:text-xl text-[#A2A8B3] font-light max-w-xl leading-relaxed">
              All incoming content is sanitized instantly, stripping hidden trackers and remote image exploits.
            </p>
          </motion.div>
        </section>

        {/* HOW IT WORKS SECTION (Vertical Timeline) */}
        <section className="w-full py-24 border-t border-[rgba(255,255,255,0.05)] flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-16">
            The Flow
          </h2>

          <div className="relative w-full max-w-2xl">
            {/* Timeline center line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-[rgba(255,255,255,0.08)] -translate-x-1/2 z-0" />

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative flex flex-col sm:flex-row items-start sm:justify-between z-10">
                <div className="absolute left-4 sm:left-1/2 h-4 w-4 rounded-full bg-[#F8F8F8] border-4 border-[#0B0D10] -translate-x-1/2 top-1.5" />
                <div className="w-full sm:w-[45%] pl-10 sm:pl-0 sm:text-right">
                  <h3 className="text-lg font-medium text-[#F8F8F8] mb-1">
                    Send Email
                  </h3>
                  <p className="text-sm text-[#A2A8B3] leading-relaxed">
                    Write a message anonymously using our luxury visual composer.
                  </p>
                </div>
                <div className="hidden sm:block w-[45%]" />
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col sm:flex-row items-start sm:justify-between z-10">
                <div className="absolute left-4 sm:left-1/2 h-4 w-4 rounded-full bg-[#F8F8F8] border-4 border-[#0B0D10] -translate-x-1/2 top-1.5" />
                <div className="hidden sm:block w-[45%]" />
                <div className="w-full sm:w-[45%] pl-10 sm:pl-8">
                  <h3 className="text-lg font-medium text-[#F8F8F8] mb-1">
                    Receive Secret Token
                  </h3>
                  <p className="text-sm text-[#A2A8B3] leading-relaxed">
                    We generate a private cryptographic token. Store it securely.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col sm:flex-row items-start sm:justify-between z-10">
                <div className="absolute left-4 sm:left-1/2 h-4 w-4 rounded-full bg-[#F8F8F8] border-4 border-[#0B0D10] -translate-x-1/2 top-1.5" />
                <div className="w-full sm:w-[45%] pl-10 sm:pl-0 sm:text-right">
                  <h3 className="text-lg font-medium text-[#F8F8F8] mb-1">
                    Get Replies
                  </h3>
                  <p className="text-sm text-[#A2A8B3] leading-relaxed">
                    Recipients reply to your temporary address, routed to your secret queue.
                  </p>
                </div>
                <div className="hidden sm:block w-[45%]" />
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col sm:flex-row items-start sm:justify-between z-10">
                <div className="absolute left-4 sm:left-1/2 h-4 w-4 rounded-full bg-[#F8F8F8] border-4 border-[#0B0D10] -translate-x-1/2 top-1.5" />
                <div className="hidden sm:block w-[45%]" />
                <div className="w-full sm:w-[45%] pl-10 sm:pl-8">
                  <h3 className="text-lg font-medium text-[#F8F8F8] mb-1">
                    Access Conversation
                  </h3>
                  <p className="text-sm text-[#A2A8B3] leading-relaxed">
                    Authenticate instantly with your secret token to read incoming replies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


      </div>

      {/* SUCCESS TOKEN MODAL OVERLAY */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease }}
              className="w-full max-w-md bg-[#111418] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-2xl relative"
            >
              <div className="text-center">
                <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase block mb-2">
                  Email Sent Successfully
                </span>
                <h3 className="text-2xl font-semibold text-[#F8F8F8] mb-6">
                  Access Key Generated
                </h3>

                <p className="text-xs text-[#A2A8B3] mb-8 leading-relaxed">
                  Keep this token safe. It is your only key to retrieve replies.
                  If lost, this conversation cannot be recovered.
                </p>

                {/* Token Display Box */}
                <div className="bg-[#161A20] border border-[rgba(255,255,255,0.08)] rounded-lg py-4 px-2 mb-8 select-all">
                  <span className="font-mono text-lg text-[#F8F8F8] tracking-wider">
                    {generatedToken}
                  </span>
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopyToken}
                  className="w-full bg-[#F8F8F8] text-[#0B0D10] font-medium py-3 rounded-lg hover:bg-neutral-200 transition-all text-sm mb-3 flex items-center justify-center gap-2"
                >
                  {isCopied ? "Copied to Clipboard" : "Copy Token"}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-transparent text-[#A2A8B3] hover:text-[#F8F8F8] py-2 text-xs transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
