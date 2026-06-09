"use client";

import React from "react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease },
    },
  };

  return (
    <section className="w-full pt-20 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center max-w-3xl"
      >
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,255,255,0.06)] bg-[#111418]/60 text-xs text-[#A2A8B3] mb-8 select-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Fully Transient SMTP/IMAP Relay
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight leading-[1.05] mb-8 text-[#F8F8F8]"
        >
          Email without identity.
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-base sm:text-xl text-[#A2A8B3] max-w-xl font-normal leading-relaxed"
        >
          Send secure, anonymous messages. Retrieve incoming replies with a single-use cryptographic token. No sign-up, no tracking, no data retention.
        </motion.p>
      </motion.div>
    </section>
  );
}
