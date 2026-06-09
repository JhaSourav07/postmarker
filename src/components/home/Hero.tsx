"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;
const GITHUB_URL = "https://github.com/JhaSourav07/postmarker";

export default function Hero() {
  const [starHovered, setStarHovered] = useState(false);

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
        {/* Live status badge */}
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
          className="text-base sm:text-xl text-[#A2A8B3] max-w-xl font-normal leading-relaxed mb-10"
        >
          Send secure, anonymous messages. Retrieve incoming replies with a
          single-use cryptographic token. No sign-up, no tracking, no data
          retention.
        </motion.p>

        {/* GitHub Star button */}
        <motion.div variants={itemVariants}>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setStarHovered(true)}
            onMouseLeave={() => setStarHovered(false)}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[rgba(255,255,255,0.10)] bg-[#111418] hover:bg-[#1a1f27] hover:border-[rgba(255,215,0,0.25)] text-sm text-[#A2A8B3] hover:text-[#F8F8F8] transition-all duration-300 select-none group"
          >
            {/* Animated star icon */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={starHovered ? "#F59E0B" : "none"}
              stroke={starHovered ? "#F59E0B" : "currentColor"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={starHovered ? { scale: [1, 1.3, 1], rotate: [0, 15, -10, 0] } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </motion.svg>
            <span>Star us on GitHub</span>
            {/* Arrow */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={starHovered ? { x: 2, y: -2 } : { x: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="opacity-50 group-hover:opacity-100"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </motion.svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
