"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Workflow() {
  const steps = [
    {
      step: "01",
      label: "Compose",
      desc: "Write your email securely using our visual editor card and specify a recipient.",
    },
    {
      step: "02",
      label: "Secure Key",
      desc: "We generate a unique cryptographic token. This is your only key to view replies.",
    },
    {
      step: "03",
      label: "Reply Relay",
      desc: "Recipient replies directly to your dynamic alias. Mail is routed to your secure queue.",
    },
    {
      step: "04",
      label: "Decrypt Sync",
      desc: "Use your private key to view your inbox. All sync matches run instantly on fetch.",
    },
  ];

  return (
    <section className="w-full py-24 border-t border-[rgba(255,255,255,0.06)] bg-[#0B0D10] flex flex-col items-center">
      <div className="w-full max-w-5xl px-4">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-semibold font-mono tracking-widest text-neutral-500 uppercase">
            Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mt-3 text-[#F8F8F8]">
            The Data Lifecycle
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-[#111418] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 relative flex flex-col justify-between min-h-[180px] hover:border-[rgba(255,255,255,0.1)] transition-colors"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-neutral-600 font-semibold uppercase tracking-wider">
                  Phase
                </span>
                <span className="font-mono text-sm font-bold text-neutral-500">
                  {s.step}
                </span>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#F8F8F8] uppercase tracking-wider mb-2">
                  {s.label}
                </h3>
                <p className="text-xs text-[#A2A8B3] leading-relaxed font-light">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
