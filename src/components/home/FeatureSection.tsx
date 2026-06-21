"use client";

import React, { useState } from "react";
import FeatureStack from "./FeatureStack";
import {
  RelayVisual,
  SecureTokenVisual,
  ReplyTrackingVisual,
  ExpirationVisual,
} from "./FeatureCard";

export default function FeatureSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const cardsData = [
    {
      title: "Anonymous Relay",
      description: (
        <>
          Recipients never see your personal email address. Messages are routed
          through PostMarker's relay infrastructure.
        </>
      ),
      visual: <RelayVisual />,
    },
    {
      title: "Secure Tokens",
      description: (
        <>
          Every conversation generates a private token. Only the token holder can
          access replies.
        </>
      ),
      visual: <SecureTokenVisual />,
    },
    {
      title: "Reply Tracking",
      description: (
        <>
          View replies through a temporary inbox without creating an account.
        </>
      ),
      visual: <ReplyTrackingVisual />,
    },
    {
      title: "Automatic Expiration",
      description: (
        <>
          All conversations are permanently deleted after 7 days. Privacy by
          default.
        </>
      ),
      visual: <ExpirationVisual />,
    },
  ];

  return (
    <section className="w-full bg-[#0A0A0A] text-[#FAFAFA] py-24 md:py-32 relative border-t border-[#262626]">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start relative">
        {/* Left Side: Sticky Content */}
        <div className="md:sticky md:top-[120px] flex flex-col space-y-6 select-none md:pr-8">
          <span className="font-mono text-xs font-semibold text-[#A1A1AA] uppercase tracking-widest">
            FEATURES
          </span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAFA] leading-[1.1]">
            Built for private communication.
          </h2>
          <div className="flex flex-col space-y-4 text-[#A1A1AA] text-sm md:text-base font-normal leading-relaxed max-w-md">
            <p>
              PostMarker enables temporary private conversations without revealing
              your personal email address.
            </p>
            <p>
              Every conversation is protected by a secure token and automatically
              deleted after 7 days.
            </p>
            <p>
              The system is designed around privacy, simplicity, and trust.
            </p>
          </div>

          {/* Left Side Active Feature Index Indicator (Desktop Only) */}
          <div className="hidden md:flex flex-col space-y-3 pt-8 border-t border-[#262626] max-w-xs">
            {cardsData.map((card, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 transition-opacity duration-300"
                style={{ opacity: activeIndex === i ? 1 : 0.35 }}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === i ? "bg-[#FAFAFA] scale-125" : "bg-[#A1A1AA]/50"
                  }`}
                />
                <span
                  className={`font-mono text-xs uppercase tracking-wider transition-colors duration-300 ${
                    activeIndex === i ? "text-[#FAFAFA] font-medium" : "text-[#A1A1AA]"
                  }`}
                >
                  {card.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Animated Card Stack */}
        <div className="w-full relative">
          <FeatureStack cards={cardsData} onActiveIndexChange={setActiveIndex} />
        </div>
      </div>
    </section>
  );
}
