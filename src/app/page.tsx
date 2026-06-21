"use client";

import React from "react";
import Hero from "../components/home/Hero";
import FeatureSection from "../components/home/FeatureSection";
import Workflow from "../components/home/Workflow";
import FeedbackSection from "../components/home/FeedbackSection";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0B0D10] text-[#F8F8F8] flex flex-col items-center pb-12">
      {/* Main Container */}
      <div className="w-full max-w-6xl px-6 relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <Hero />
      </div>

      {/* Editorial Scroll Stack Feature Section */}
      <FeatureSection />

      <div className="w-full max-w-6xl px-6 relative z-10 flex flex-col items-center">
        {/* Workflow Lifecycle Grid */}
        <Workflow />

        {/* Feedback Section */}
        <FeedbackSection />
      </div>
    </div>
  );
}
