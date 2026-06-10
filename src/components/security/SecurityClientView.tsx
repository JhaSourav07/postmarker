"use client";

import React from "react";
import { Key, EyeOff, Trash2, Cpu, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function SecurityClientView() {
  return (
    <div className="min-h-[calc(100vh-112px)] bg-[#0B0D10] text-[#F8F8F8] flex flex-col items-center px-6 py-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* Main Title Section */}
        <div className="text-center mb-16 border-b border-[rgba(255,255,255,0.06)] pb-12">
          <span className="text-emerald-400 text-xs font-semibold tracking-wider uppercase block mb-3">
            Zero-Knowledge Architecture
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#F8F8F8] sm:text-5xl mb-4">
            Security & Anonymity Center
          </h1>
          <p className="text-sm text-[#A2A8B3] max-w-2xl mx-auto leading-relaxed">
            Postmarker is engineered specifically to protect privacy. We store zero tracking logs, 
            require no user registration, and use cryptographic tokens to guarantee private thread isolation.
          </p>
        </div>

        {/* 3 Columns Grid: Pillars of Anonymity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Pillar 1 */}
          <div className="bg-[#111418]/60 border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 backdrop-blur-md relative flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />
            <div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 w-fit mb-6">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F8F8F8] mb-3">Cryptographic Tokens</h3>
              <p className="text-xs text-[#A2A8B3] leading-relaxed">
                Your private inbox key is a high-entropy, client-side token. We never store this key in plaintext. 
                The database only stores a one-way **SHA-256 hash** of your token. Even if our database is compromised, 
                it is mathematically impossible to reconstruct the token or decrypt access.
              </p>
            </div>
            <div className="mt-6 text-[10px] font-mono text-[#A2A8B3] bg-[#161A20] p-2.5 rounded border border-[rgba(255,255,255,0.04)]">
              SHA-256 (Token) = Storage Node
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#111418]/60 border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 backdrop-blur-md relative flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />
            <div>
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 w-fit mb-6">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F8F8F8] mb-3">IP Masking & Headers</h3>
              <p className="text-xs text-[#A2A8B3] leading-relaxed">
                When you dispatch an email, our server handles outbound routing via SMTP. We strip all originating IP addresses 
                and replace them with a unique sub-address wrapper (e.g. `you+threadId@gmail.com`). 
                The recipient sees only the anonymous wrap address.
              </p>
            </div>
            <div className="mt-6 text-[10px] font-mono text-[#A2A8B3] bg-[#161A20] p-2.5 rounded border border-[rgba(255,255,255,0.04)]">
              SMTP origin masked via relay envelope
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#111418]/60 border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 backdrop-blur-md relative flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F8F8F8]/10 to-transparent" />
            <div>
              <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 w-fit mb-6">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F8F8F8] mb-3">Ephemeral Data Cycle</h3>
              <p className="text-xs text-[#A2A8B3] leading-relaxed">
                All data is transient. We run a MongoDB TTL (Time-To-Live) index that automatically deletes threads, 
                tokens, and messages exactly 7 days after the thread is created (unless manually extended). 
                Once deleted, the data is completely expunged from memory and disks.
              </p>
            </div>
            <div className="mt-6 text-[10px] font-mono text-[#A2A8B3] bg-[#161A20] p-2.5 rounded border border-[rgba(255,255,255,0.04)]">
              TTL sweep: deleteObj after 168h
            </div>
          </div>
        </div>

        {/* Visual Workflow: How packet moves */}
        <div className="bg-[#111418]/40 border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 mb-16 backdrop-blur-md relative">
          <h3 className="text-lg font-bold text-[#F8F8F8] mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Under The Hood: Routing Anatomy</span>
          </h3>

          <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-2">
            {/* Step 1 */}
            <div className="flex-1 bg-[#111418] border border-[rgba(255,255,255,0.04)] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 block mb-1">01 / CLIENT</span>
                <span className="text-xs font-bold block mb-1 text-[#F8F8F8]">Compose & Hash</span>
                <p className="text-[11px] text-[#A2A8B3] leading-relaxed">
                  Message compiled. High-entropy token generated in-browser. Token is SHA-256 hashed before hitting API.
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center text-neutral-600 px-1">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Step 2 */}
            <div className="flex-1 bg-[#111418] border border-[rgba(255,255,255,0.04)] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 block mb-1">02 / SMTP GATEWAY</span>
                <span className="text-xs font-bold block mb-1 text-[#F8F8F8]">Envelope & Dispatch</span>
                <p className="text-[11px] text-[#A2A8B3] leading-relaxed">
                  Alias constructed (threadId). Custom headers (`X-PostMarker-Thread-ID`) embedded. Dispatch via SMTP relay.
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center text-neutral-600 px-1">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Step 3 */}
            <div className="flex-1 bg-[#111418] border border-[rgba(255,255,255,0.04)] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-teal-400 block mb-1">03 / IMAP LISTENER</span>
                <span className="text-xs font-bold block mb-1 text-[#F8F8F8]">Ingest Inbound replies</span>
                <p className="text-[11px] text-[#A2A8B3] leading-relaxed">
                  Incoming replies verified by sender address match and header References loop. Saved to DB, marked read on SMTP.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Statement */}
        <div className="border border-indigo-500/20 bg-indigo-500/5 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#F8F8F8] mb-1">Privacy Guarantee</h3>
            <p className="text-xs text-[#A2A8B3] leading-relaxed">
              Postmarker stores no tracker analytics, cookies, browser fingerprints, or IP logging nodes. 
              The system operates fully on-demand. When a thread's time is up, the clean sweep is complete.
              All code is open-source and reviewable for complete architectural audit.
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
