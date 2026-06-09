"use client";

import React from "react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

interface TokenAccessFormProps {
  tokenInput: string;
  setTokenInput: (val: string) => void;
  isAccessing: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TokenAccessForm({
  tokenInput,
  setTokenInput,
  isAccessing,
  onSubmit,
}: TokenAccessFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      className="w-full max-w-md bg-[#111418] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 shadow-2xl relative z-10"
    >
      {/* Decorative top border line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.15)] to-transparent" />

      <div className="text-center mb-8">
        <span className="text-neutral-500 font-mono text-[10px] font-semibold tracking-widest uppercase block mb-3">
          Verification Portal
        </span>
        <h2 className="text-2xl font-medium text-[#F8F8F8] tracking-tight">
          Access your Inbox
        </h2>
        <p className="text-xs text-[#A2A8B3] mt-2 leading-relaxed font-light">
          Enter your unique cryptographic token below to pull and view active conversations.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold font-mono text-neutral-500 uppercase tracking-widest">
            Access Key
          </label>
          <input
            type="text"
            required
            placeholder="TMP-XXXX-XXXX-XXXX"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="w-full bg-[#0B0D10] border border-[rgba(255,255,255,0.06)] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-[#F8F8F8] px-4 py-3 rounded-lg placeholder-neutral-800 outline-none transition-colors text-sm font-mono text-center tracking-widest uppercase"
          />
        </div>

        <button
          type="submit"
          disabled={isAccessing}
          className="w-full bg-[#F8F8F8] text-[#0B0D10] font-semibold text-xs uppercase tracking-wider py-3.5 rounded-lg hover:bg-neutral-200 transition-all text-sm active:scale-[0.98] transition-transform cursor-pointer"
        >
          {isAccessing ? "Authenticating..." : "Decrypt Inbox"}
        </button>
      </form>
    </motion.div>
  );
}
