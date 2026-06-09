"use client";

import React from "react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

interface SuccessModalProps {
  isOpen: boolean;
  token: string;
  isCopied: boolean;
  onCopy: () => void;
  onClose: () => void;
}

export default function SuccessModal({
  isOpen,
  token,
  isCopied,
  onCopy,
  onClose,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.4, ease }}
        className="w-full max-w-md bg-[#111418] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Top border ambient gradient line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.15)] to-transparent" />

        <div className="text-center">
          <span className="text-neutral-500 font-mono text-[10px] font-semibold tracking-widest uppercase block mb-3">
            Status // Active
          </span>
          <h3 className="text-xl font-semibold text-[#F8F8F8] tracking-tight mb-4">
            Conversation Initialized
          </h3>

          <p className="text-xs text-[#A2A8B3] mb-8 leading-relaxed max-w-sm mx-auto font-light">
            Keep this access token safe. It is your only cryptographic key to check and retrieve incoming replies. If lost, this conversation cannot be recovered.
          </p>

          {/* Token Box */}
          <div 
            onClick={onCopy}
            className="bg-[#0B0D10] border border-[rgba(255,255,255,0.06)] hover:border-neutral-700 rounded-lg py-4 px-4 mb-8 select-all font-mono text-sm tracking-wider text-neutral-100 flex items-center justify-between cursor-pointer group transition-colors"
          >
            <span>{token}</span>
            <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400 uppercase tracking-widest transition-colors font-sans">
              {isCopied ? "Copied" : "Copy"}
            </span>
          </div>

          <div className="space-y-3">
            {/* Primary Action */}
            <button
              onClick={onCopy}
              className="w-full bg-[#F8F8F8] text-[#0B0D10] font-semibold text-xs uppercase tracking-wider py-3.5 rounded-lg hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer"
            >
              {isCopied ? "Token Copied" : "Copy Token"}
            </button>

            {/* Secondary Action */}
            <button
              onClick={onClose}
              className="w-full bg-transparent text-[#A2A8B3] hover:text-[#F8F8F8] font-medium py-2 text-xs transition-colors cursor-pointer"
            >
              Dismiss and Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
