"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const springConfig = { damping: 30, stiffness: 90, mass: 0.6 };

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Motion values for tracking cursor offset relative to the scene container center (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Map mouse offsets to smooth, premium tilt values (max 10 degrees)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Return smoothly to normal center values when cursor leaves
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[440px] h-[540px] flex items-center justify-center cursor-default select-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D Transform Wrapper */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Animated Connection Lines (SVG) - Placed in 3D depth layer behind cards */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transform: "translateZ(0px)", transformStyle: "preserve-3d" }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 440 540"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Definitions for gradient stroke and shadow filters */}
            <defs>
              <linearGradient id="line-pulse-grad-1" x1="160" y1="160" x2="230" y2="200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#A2A8B3" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#F8F8F8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#A2A8B3" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="line-pulse-grad-2" x1="230" y1="340" x2="175" y2="390" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#A2A8B3" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#F8F8F8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#A2A8B3" stopOpacity="0.05" />
              </linearGradient>
              <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Path 1: Message (Card 1) bottom center to Token (Card 2) top center */}
            <path
              d="M 160 160 C 160 175, 230 175, 230 200"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Animated Pulse Path 1 */}
            <path
              d="M 160 160 C 160 175, 230 175, 230 200"
              stroke="url(#line-pulse-grad-1)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="20 120"
              className="animate-[pulse-offset-1_3s_linear_infinite]"
            />

            {/* Path 2: Token (Card 2) bottom center to Reply (Card 3) top center */}
            <path
              d="M 230 340 C 230 355, 175 355, 175 390"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Animated Pulse Path 2 */}
            <path
              d="M 230 340 C 230 355, 175 355, 175 390"
              stroke="url(#line-pulse-grad-2)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="20 120"
              className="animate-[pulse-offset-2_3.5s_linear_infinite]"
            />
          </svg>
        </div>

        {/* CSS Pulse Keyframes (injected directly to keep it self-contained) */}
        <style jsx global>{`
          @keyframes pulse-offset-1 {
            0% {
              stroke-dashoffset: 140;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          @keyframes pulse-offset-2 {
            0% {
              stroke-dashoffset: 140;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
        `}</style>

        {/* Card 1: Message Card */}
        <motion.div
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
          animate={{
            y: [0, -6, 0],
            scale: hoveredCard === 1 ? 1.08 : hoveredCard === null ? 1 : 0.94,
            opacity: hoveredCard === 1 ? 1 : hoveredCard === null ? 1 : 0.35,
          }}
          transition={{
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 300, damping: 25 },
            opacity: { duration: 0.25, ease: "easeOut" },
          }}
          className="absolute left-[15px] top-[10px] w-[290px] bg-[#111418]/65 backdrop-blur-md border border-[rgba(255,255,255,0.06)] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-4 text-left cursor-pointer"
          style={{
            transform: "translateZ(30px) rotateX(10deg) rotateY(-18deg) rotateZ(3deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-1.5 mb-3 border-b border-white/5 pb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A2A8B3]">Message</span>
          </div>

          {/* Card fields */}
          <div className="space-y-2.5 text-xs text-[#A2A8B3]">
            <div className="flex items-center gap-2 py-0.5 border-b border-white/5">
              <span className="text-neutral-500 font-mono text-[9px] uppercase w-12">To:</span>
              <span className="text-[#F8F8F8] font-mono text-[11px]">john@example.com</span>
            </div>
            <div className="flex items-center gap-2 py-0.5 border-b border-white/5">
              <span className="text-neutral-500 font-mono text-[9px] uppercase w-12">Subject:</span>
              <span className="text-[#F8F8F8] text-[11px]">Project Feedback</span>
            </div>
            <div className="py-1">
              <p className="text-[10.5px] text-[#A2A8B3] leading-relaxed italic font-sans font-light">
                "Your recent work was excellent. Looking forward to your thoughts."
              </p>
            </div>
            <div className="flex justify-end pt-0.5">
              <span className="px-2.5 py-1 rounded bg-[#F8F8F8]/10 text-white/50 text-[9px] font-semibold uppercase tracking-wider border border-white/5">
                Send
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Token Card (Center Piece - Larger & Styled to look highly valuable) */}
        <motion.div
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
          animate={{
            y: [0, 6, 0],
            scale: hoveredCard === 2 ? 1.08 : hoveredCard === null ? 1 : 0.94,
            opacity: hoveredCard === 2 ? 1 : hoveredCard === null ? 1 : 0.35,
          }}
          transition={{
            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            scale: { type: "spring", stiffness: 300, damping: 25 },
            opacity: { duration: 0.25, ease: "easeOut" },
          }}
          className="absolute left-[75px] top-[190px] w-[310px] bg-[#161A20]/80 backdrop-blur-lg border border-[rgba(255,255,255,0.12)] rounded-xl shadow-[0_25px_50px_rgba(0,0,0,0.5)] p-5 text-left overflow-hidden group cursor-pointer"
          style={{
            transform: "translateZ(55px) rotateX(8deg) rotateY(-15deg) rotateZ(1deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Surface reflection details inside the card */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between mb-3.5 border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A2A8B3]">Conversation Created</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>Active</span>
            </div>
          </div>

          {/* Content: Cryptographic Token */}
          <div className="space-y-3 relative z-10">
            <div className="flex flex-col items-center py-3 rounded-lg bg-[#0B0D10]/95 border border-white/5 relative">
              <span className="text-[15px] font-mono font-bold tracking-[0.2em] text-[#F8F8F8]">
                PKM-8XF2-91KS
              </span>
              
              {/* Decorative small icons */}
              <div className="absolute right-3 flex items-center gap-1.5 text-neutral-500">
                <svg className="w-3.5 h-3.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            {/* Copy Helper */}
            <p className="text-[10px] text-center text-[#A2A8B3] font-light leading-snug">
              Save this token to view replies securely.
            </p>
          </div>
        </motion.div>

        {/* Card 3: Reply Card */}
        <motion.div
          onMouseEnter={() => setHoveredCard(3)}
          onMouseLeave={() => setHoveredCard(null)}
          animate={{
            y: [0, -5, 0],
            scale: hoveredCard === 3 ? 1.08 : hoveredCard === null ? 1 : 0.94,
            opacity: hoveredCard === 3 ? 1 : hoveredCard === null ? 1 : 0.35,
          }}
          transition={{
            y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
            scale: { type: "spring", stiffness: 300, damping: 25 },
            opacity: { duration: 0.25, ease: "easeOut" },
          }}
          className="absolute left-[30px] top-[380px] w-[290px] bg-[#111418]/65 backdrop-blur-md border border-[rgba(255,255,255,0.06)] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-4 text-left cursor-pointer"
          style={{
            transform: "translateZ(30px) rotateX(12deg) rotateY(-20deg) rotateZ(4deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-1.5 mb-2.5 border-b border-white/5 pb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A2A8B3]">Reply Received</span>
          </div>

          {/* Preview content */}
          <div className="flex gap-2.5 items-start">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5 flex-shrink-0">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <p className="text-[11px] text-[#A2A8B3] leading-relaxed font-sans font-light">
              Thank you. I'll review it and get back to you soon.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
