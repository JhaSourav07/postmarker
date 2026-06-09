"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BackgroundAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate random data particles
  const particles = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 10,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050608] pointer-events-none flex items-center justify-center">
      {/* 1. Animated Grid Background */}
      <motion.div 
        className="absolute inset-0 w-[200vw] h-[200vh] -left-[50vw] -top-[50vh] opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 60%)",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "60px 60px"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* 2. Floating Data Particles */}
      {mounted && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-emerald-400/40"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: ["0%", "-1500%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* 3. Dynamic Aurora / Morphing Blobs */}
      <div className="absolute inset-0 mix-blend-screen opacity-80 filter blur-[100px] md:blur-[140px]">
        {/* Deep Emerald Core */}
        <motion.div
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[10%] left-[20%] w-[50vw] h-[50vh] bg-emerald-600/30 rounded-[100%_50%_70%_30%] origin-center"
        />

        {/* Violet/Indigo Swirl */}
        <motion.div
          animate={{
            rotate: [360, 180, 0],
            scale: [0.9, 1.4, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[20%] right-[10%] w-[60vw] h-[50vh] bg-indigo-600/30 rounded-[40%_60%_30%_70%] origin-center"
        />

        {/* Cyan Highlight */}
        <motion.div
          animate={{
            x: ["-20%", "20%", "-20%"],
            y: ["10%", "-10%", "10%"],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[10%] left-[30%] w-[40vw] h-[40vh] bg-cyan-600/20 rounded-full"
        />
      </div>

      {/* 4. Heavy Vignette to keep edges pitch black and center focused */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B0D10_100%)] opacity-90" />
    </div>
  );
}
