"use client";

import React from "react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section className="w-full pt-20 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease }}
        className="flex flex-col items-center max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,255,255,0.06)] bg-[#111418]/60 text-xs text-[#A2A8B3] mb-8 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Fully Transient SMTP/IMAP Relay
        </div>
        
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight leading-[1.05] mb-8 text-[#F8F8F8]">
          Email without identity.
        </h1>
        
        <p className="text-base sm:text-xl text-[#A2A8B3] max-w-xl font-normal leading-relaxed">
          Send secure, anonymous messages. Retrieve incoming replies with a single-use cryptographic token. No sign-up, no tracking, no data retention.
        </p>
      </motion.div>
    </section>
  );
}
