"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import HeroScene from "./HeroScene";

const ease = [0.16, 1, 0.3, 1] as const;
const GITHUB_URL = "https://github.com/JhaSourav07/postmarker";

export default function Hero() {
  const [starHovered, setStarHovered] = useState(false);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
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
    <section className="w-full pt-16 pb-12 md:pt-24 md:pb-20 flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-8 items-center text-center lg:text-left">
      {/* Left Column: Vercel-Style Typography & Controls */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="lg:col-span-7 flex flex-col items-center lg:items-start w-full"
      >
        {/* Live status badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,255,255,0.06)] bg-[#111418]/60 text-xs text-[#A2A8B3] mb-6 select-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Fully Transient SMTP/IMAP Relay
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-medium tracking-tight leading-[1.08] mb-6 text-[#F8F8F8]"
        >
          Private conversations.<br />
          <span className="text-[#A2A8B3]">Automatically forgotten.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-[#A2A8B3] max-w-lg font-light leading-relaxed mb-8"
        >
          Create temporary communication channels without revealing personal email addresses.
        </motion.p>

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
          <Link
            href="/create"
            className="bg-[#F8F8F8] text-[#0B0D10] font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2"
          >
            Start Conversation
          </Link>
          
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setStarHovered(true)}
            onMouseLeave={() => setStarHovered(false)}
            className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#111418] hover:bg-[#1a1f27] hover:border-[rgba(255,215,0,0.25)] text-xs font-semibold uppercase tracking-wider text-[#A2A8B3] hover:text-[#F8F8F8] transition-all duration-300 select-none group"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill={starHovered ? "#F59E0B" : "none"}
              stroke={starHovered ? "#F59E0B" : "currentColor"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={starHovered ? { scale: [1, 1.2, 1], rotate: [0, 15, -10, 0] } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.4 }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </motion.svg>
            <span>GitHub</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Right Column: Premium 3D Interactive Hero Scene */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease }}
        className="lg:col-span-5 w-full flex justify-center lg:justify-end select-none"
      >
        <HeroScene />
      </motion.div>
    </section>
  );
}
