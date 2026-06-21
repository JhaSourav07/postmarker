"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue, useMotionValueEvent } from "framer-motion";
import FeatureCard from "./FeatureCard";

interface CardData {
  title: string;
  description: React.ReactNode;
  visual: React.ReactNode;
}

interface FeatureStackProps {
  cards: CardData[];
  onActiveIndexChange?: (index: number) => void;
}

export default function FeatureStack({ cards, onActiveIndexChange }: FeatureStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const lastActiveIndex = useRef(0);

  // Setup media query listener for responsive design
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    setIsDesktop(media.matches);
    const listener = () => setIsDesktop(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // Set up scroll hooks bound to the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track scroll position to update the active card index
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isDesktop) return;
    
    let active = 0;
    if (latest < 0.165) {
      active = 0;
    } else if (latest < 0.5) {
      active = 1;
    } else if (latest < 0.83) {
      active = 2;
    } else {
      active = 3;
    }

    if (active !== lastActiveIndex.current) {
      lastActiveIndex.current = active;
      if (onActiveIndexChange) {
        onActiveIndexChange(active);
      }
    }
  });

  return (
    <div ref={containerRef} className="w-full relative">
      {!isDesktop ? (
        // Mobile Layout: Sequential natural stack with simple viewport reveal
        <div className="flex flex-col space-y-8 w-full mt-12 md:mt-0">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <FeatureCard
                title={card.title}
                description={card.description}
                visual={card.visual}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        // Desktop Layout: Stacking deck bound to container's scroll progress
        <div className="relative w-full h-[240vh]">
          <div className="sticky top-[120px] h-[550px] w-full flex items-center justify-center">
            {cards.map((card, i) => (
              <DesktopStackCard
                key={i}
                index={i}
                card={card}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface DesktopStackCardProps {
  index: number;
  card: CardData;
  progress: MotionValue<number>;
}

function DesktopStackCard({ index, card, progress }: DesktopStackCardProps) {
  // Interpolations tailored per card rank to stack elegantly
  let scale: MotionValue<number> | number = 1;
  let opacity: MotionValue<number> | number = 1;
  let y: MotionValue<number> | number = 0;

  if (index === 0) {
    scale = useTransform(progress, [0, 0.33, 0.66, 1.0], [1, 0.96, 0.92, 0.88]);
    opacity = useTransform(progress, [0, 0.33, 0.66, 1.0], [1, 0.55, 0.25, 0.1]);
    y = useTransform(progress, [0, 0.33, 0.66, 1.0], [0, -16, -32, -48]);
  } else if (index === 1) {
    scale = useTransform(progress, [0, 0.33, 0.66, 1.0], [1, 1, 0.96, 0.92]);
    opacity = useTransform(progress, [0, 0.33, 0.66, 1.0], [0, 1, 0.55, 0.25]);
    y = useTransform(progress, [0, 0.33, 0.66, 1.0], [450, 0, -16, -32]);
  } else if (index === 2) {
    scale = useTransform(progress, [0, 0.33, 0.66, 1.0], [1, 1, 1, 0.96]);
    opacity = useTransform(progress, [0, 0.33, 0.66, 1.0], [0, 0, 1, 0.55]);
    y = useTransform(progress, [0, 0.33, 0.66, 1.0], [450, 450, 0, -16]);
  } else if (index === 3) {
    scale = 1;
    opacity = useTransform(progress, [0, 0.66, 1.0], [0, 0, 1]);
    y = useTransform(progress, [0, 0.66, 1.0], [450, 450, 0]);
  }

  return (
    <motion.div
      style={{
        scale,
        opacity,
        y,
        zIndex: index + 10,
      }}
      className="absolute inset-0 w-full h-full"
    >
      <FeatureCard
        title={card.title}
        description={card.description}
        visual={card.visual}
      />
    </motion.div>
  );
}
