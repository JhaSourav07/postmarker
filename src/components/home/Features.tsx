"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Features() {
  const featuresList = [
    {
      num: "01",
      title: "No Accounts",
      desc: "Identity isolation is complete. We do not support registration, oauth, or databases linking your personal identity to active email conversations.",
    },
    {
      num: "02",
      title: "Auto Purge",
      desc: "All conversation records, transient email aliases, metadata, and messages are permanently deleted 7 days after creation via automatic TTL purge.",
    },
    {
      num: "03",
      title: "Sanitized",
      desc: "Payloads are checked instantly. Remote web-bugs, images, styles, and tracking pixels are completely stripped to preserve your local inbox integrity.",
    },
  ];

  return (
    <section className="w-full py-24 md:py-32 border-t border-[rgba(255,255,255,0.06)] bg-[#0B0D10]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-5xl mx-auto">
        {featuresList.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            className="flex flex-col text-left space-y-4 p-4 rounded-xl border border-transparent hover:border-[rgba(255,255,255,0.04)] hover:bg-[#111418]/25 transition-all"
          >
            <span className="font-mono text-xs font-semibold text-neutral-500 uppercase tracking-widest">
              {f.num} &mdash; Principle
            </span>
            <h3 className="text-xl sm:text-2xl font-medium text-[#F8F8F8] tracking-tight">
              {f.title}
            </h3>
            <p className="text-sm text-[#A2A8B3] leading-relaxed font-light">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
