"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Shield, Mail } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: React.ReactNode;
  visual: React.ReactNode;
}

export default function FeatureCard({ title, description, visual }: FeatureCardProps) {
  return (
    <div className="w-full h-[520px] rounded-[24px] border border-[#262626] bg-[#111111] text-[#FAFAFA] p-8 md:p-10 flex flex-col justify-between overflow-hidden shadow-2xl relative select-none">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50 z-0" />
      
      {/* Card Content (Top) */}
      <div className="relative z-10 flex flex-col space-y-4 max-w-lg">
        <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#FAFAFA]">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-[#A1A1AA] font-normal leading-relaxed">
          {description}
        </p>
      </div>

      {/* Card Visual (Bottom) */}
      <div className="relative z-10 w-full h-[240px] flex items-center justify-center mt-6">
        {visual}
      </div>
    </div>
  );
}

/* Custom Visuals for the 4 Cards */

export function RelayVisual() {
  return (
    <div className="w-full max-w-[340px] flex flex-col items-center">
      <div className="w-full flex items-center justify-between relative px-2">
        {/* Connection SVG Line */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <svg className="w-full h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Line */}
            <path
              d="M 32 24 H 308"
              stroke="#262626"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Pulsing flowing line */}
            <motion.path
              d="M 32 24 H 308"
              stroke="#FAFAFA"
              strokeWidth="1.5"
              strokeDasharray="30 150"
              animate={{
                strokeDashoffset: [0, -180],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>
        </div>

        {/* You Node */}
        <div className="flex flex-col items-center space-y-2.5 z-10">
          <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] border border-[#262626] flex items-center justify-center shadow-lg hover:border-[#FAFAFA]/40 transition-colors duration-300">
            <span className="font-mono text-xs font-semibold text-[#FAFAFA]">You</span>
          </div>
        </div>

        {/* PostMarker Relay Center Node */}
        <div className="flex flex-col items-center space-y-2.5 z-10">
          <motion.div
            animate={{
              borderColor: ["#262626", "#FAFAFA", "#262626"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-14 h-14 rounded-full bg-[#0A0A0A] border border-[#262626] flex items-center justify-center shadow-2xl relative"
          >
            <div className="absolute inset-0.5 rounded-full border border-dashed border-[#262626] animate-[spin_40s_linear_infinite]" />
            <Shield className="w-5 h-5 text-[#FAFAFA]" />
          </motion.div>
        </div>

        {/* Recipient Node */}
        <div className="flex flex-col items-center space-y-2.5 z-10">
          <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] border border-[#262626] flex items-center justify-center shadow-lg hover:border-[#FAFAFA]/40 transition-colors duration-300">
            <Mail className="w-4.5 h-4.5 text-[#A1A1AA]" />
          </div>
        </div>
      </div>

      {/* Label Subtitles */}
      <div className="w-full flex justify-between mt-4 text-[10px] font-mono text-[#A1A1AA] px-1 select-all">
        <span className="text-left w-20 truncate">you@gmail.com</span>
        <span className="text-center text-[#FAFAFA] font-medium">Relay Agent</span>
        <span className="text-right w-20 truncate">recipient@domain.com</span>
      </div>
    </div>
  );
}

export function SecureTokenVisual() {
  const [copied, setCopied] = useState(false);
  const token = "PKM-8XF2-91KS";

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[320px] bg-[#0A0A0A] border border-[#262626] rounded-xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group select-none">
      {/* Grid watermark */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40 z-0" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4 z-10 relative">
        <div className="flex items-center space-x-2">
          <Shield className="w-3.5 h-3.5 text-green-500" />
          <span className="font-mono text-[9px] tracking-wider uppercase text-[#A1A1AA]">
            ECDSA-256 SIGNATURE
          </span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* Token text box */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111111] border border-[#262626] rounded-lg shadow-inner z-10 relative">
        <span className="font-mono text-base font-semibold tracking-wider text-[#FAFAFA] select-all">
          {token}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-[#262626] text-[#A1A1AA] hover:text-[#FAFAFA] transition-all relative flex items-center justify-center cursor-pointer"
          aria-label="Copy secure token"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Check className="w-3.5 h-3.5 text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Copy className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Clipboard Tooltip Alert */}
      <div className="h-6 flex items-center justify-center mt-3 z-10 relative">
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="px-2 py-0.5 rounded border border-green-500/20 bg-green-500/10 text-[9px] font-mono text-green-400 uppercase tracking-widest"
            >
              Token Copied to Clipboard
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ReplyTrackingVisual() {
  return (
    <div className="w-full max-w-[340px] bg-[#0A0A0A] border border-[#262626] rounded-xl overflow-hidden shadow-xl flex flex-col select-none">
      {/* Mock Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111111] border-b border-[#262626]">
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
        <span className="font-mono text-[9px] text-[#A1A1AA] tracking-wider truncate max-w-[160px]">
          inbox/thread_PKM-8XF2
        </span>
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 rounded-full bg-green-500" />
          <span className="font-mono text-[8px] text-green-500 uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="p-4 flex flex-col space-y-3.5">
        {/* Sender bubble */}
        <div className="flex flex-col items-end space-y-1 w-full">
          <div className="px-3.5 py-2 rounded-[16px] rounded-tr-[4px] bg-[#262626] text-xs text-[#FAFAFA] max-w-[85%] leading-relaxed">
            Is the item still available for pick up?
          </div>
          <span className="text-[8px] font-mono text-[#A1A1AA] uppercase tracking-wider mr-1">
            You (via Relay)
          </span>
        </div>

        {/* Recipient bubble */}
        <div className="flex flex-col items-start space-y-1 w-full">
          <div className="px-3.5 py-2 rounded-[16px] rounded-tl-[4px] bg-[#111111] border border-[#262626] text-xs text-[#FAFAFA] max-w-[85%] leading-relaxed">
            Yes, still available. I can meet you tomorrow morning.
          </div>
          <span className="text-[8px] font-mono text-[#A1A1AA] uppercase tracking-wider ml-1">
            Recipient (Masked)
          </span>
        </div>
      </div>
    </div>
  );
}

export function ExpirationVisual() {
  const [countdown, setCountdown] = useState({
    days: 6,
    hours: 23,
    minutes: 59,
    seconds: 58,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="flex flex-col items-center space-y-5 w-full max-w-[320px] select-none">
      {/* Expiry timeline */}
      <div className="w-full flex items-center justify-between px-3 relative">
        {/* Timeline track */}
        <div className="absolute left-[24px] right-[24px] top-[14px] h-[2px] bg-[#262626] z-0">
          {/* Active progress track */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "42%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-[#FAFAFA]"
          />
        </div>
        
        {/* Day 0: Created */}
        <div className="flex flex-col items-center space-y-1.5 z-10">
          <div className="w-7 h-7 rounded-full bg-[#111111] border border-[#FAFAFA]/20 flex items-center justify-center shadow-md">
            <span className="text-[8px] text-[#FAFAFA] font-mono">D0</span>
          </div>
          <span className="text-[9px] font-mono text-[#A1A1AA] uppercase tracking-wider">Created</span>
        </div>

        {/* Day 3: Active */}
        <div className="flex flex-col items-center space-y-1.5 z-10">
          <div className="w-7 h-7 rounded-full bg-[#0A0A0A] border border-[#FAFAFA] flex items-center justify-center shadow-lg relative">
            <span className="absolute inset-0 rounded-full border border-[#FAFAFA] animate-ping opacity-25" />
            <span className="text-[8px] text-[#FAFAFA] font-mono">D3</span>
          </div>
          <span className="text-[9px] font-mono text-[#FAFAFA] uppercase tracking-wider font-medium">Active</span>
        </div>

        {/* Day 7: Purged */}
        <div className="flex flex-col items-center space-y-1.5 z-10">
          <motion.div 
            animate={{ borderColor: ["#262626", "#EF4444", "#262626"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-7 h-7 rounded-full bg-[#111111] border border-[#262626] flex items-center justify-center shadow-md"
          >
            <span className="text-[8px] text-[#EF4444] font-mono">D7</span>
          </motion.div>
          <span className="text-[9px] font-mono text-[#EF4444] uppercase tracking-wider">Purged</span>
        </div>
      </div>

      {/* Countdown timer */}
      <div className="flex flex-col items-center space-y-2 w-full px-4 py-3.5 bg-[#0A0A0A] border border-[#262626] rounded-xl shadow-inner relative overflow-hidden">
        <span className="font-mono text-[9px] tracking-wider uppercase text-[#A1A1AA]">
          TIME REMAINING UNTIL PURGE
        </span>
        <div className="flex items-center space-x-1.5 font-mono text-sm sm:text-base font-bold text-[#FAFAFA]">
          <div className="px-2 py-0.5 bg-[#111111] border border-[#262626] rounded text-[#FAFAFA]">
            {formatNum(countdown.days)}d
          </div>
          <span className="text-[#262626] font-light">:</span>
          <div className="px-2 py-0.5 bg-[#111111] border border-[#262626] rounded text-[#FAFAFA]">
            {formatNum(countdown.hours)}h
          </div>
          <span className="text-[#262626] font-light">:</span>
          <div className="px-2 py-0.5 bg-[#111111] border border-[#262626] rounded text-[#FAFAFA]">
            {formatNum(countdown.minutes)}m
          </div>
          <span className="text-[#262626] font-light">:</span>
          <div className="px-2 py-0.5 bg-[#111111] border border-[#262626] rounded text-red-500">
            {formatNum(countdown.seconds)}s
          </div>
        </div>
      </div>
    </div>
  );
}
