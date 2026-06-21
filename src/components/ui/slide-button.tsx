"use client";

import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  type JSX,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { Check, Loader2, SendHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

const DRAG_CONSTRAINTS = { left: 0, right: 155 };
const DRAG_THRESHOLD = 0.9;

const BUTTON_STATES = {
  initial: { width: "12rem" },
  completed: { width: "8rem" },
};

const ANIMATION_CONFIG = {
  spring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
    mass: 0.8,
  },
};

type StatusIconProps = {
  status: string;
};

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const iconMap: Record<StatusIconProps["status"], JSX.Element> = useMemo(
    () => ({
      loading: <Loader2 className="animate-spin" size={16} />,
      success: <Check className="text-green-500" size={16} />,
      error: <X className="text-red-500" size={16} />,
    }),
    []
  );

  if (!iconMap[status]) return null;

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center"
    >
      {iconMap[status]}
    </motion.div>
  );
};

const useButtonStatus = (resolveTo: "success" | "error") => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = useCallback(() => {
    setStatus("loading");
    setTimeout(() => {
      setStatus(resolveTo);
    }, 2000);
  }, [resolveTo]);

  return { status, handleSubmit };
};

export interface SlideButtonProps extends ButtonProps {
  status?: "idle" | "loading" | "success" | "error";
  onSlideComplete?: () => void;
}

const SlideButton = forwardRef<HTMLButtonElement, SlideButtonProps>(
  ({ className, status: externalStatus, onSlideComplete, ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [completed, setCompleted] = useState(false);
    const dragHandleRef = useRef<HTMLDivElement | null>(null);
    const { status: internalStatus, handleSubmit: internalHandleSubmit } = useButtonStatus("success");
    
    // Fallback to internal status if not wired up externally
    const status = externalStatus !== undefined ? externalStatus : internalStatus;

    const dragX = useMotionValue(0);
    const springX = useSpring(dragX, ANIMATION_CONFIG.spring);
    const dragProgress = useTransform(
      springX,
      [0, DRAG_CONSTRAINTS.right],
      [0, 1]
    );

    // Sync external "idle" resets
    useEffect(() => {
      if (status === "idle") {
        setCompleted(false);
        dragX.set(0);
      }
    }, [status, dragX]);

    const handleDragStart = useCallback(() => {
      if (completed || props.disabled) return;
      setIsDragging(true);
    }, [completed, props.disabled]);

    const handleDragEnd = () => {
      if (completed || props.disabled) return;
      setIsDragging(false);

      const progress = dragProgress.get();
      if (progress >= DRAG_THRESHOLD) {
        setCompleted(true);
        if (onSlideComplete) {
          onSlideComplete();
        } else {
          internalHandleSubmit();
        }
      } else {
        dragX.set(0);
      }
    };

    const handleDrag = (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => {
      if (completed || props.disabled) return;
      const newX = Math.max(0, Math.min(info.offset.x, DRAG_CONSTRAINTS.right));
      dragX.set(newX);
    };

    const adjustedWidth = useTransform(springX, (x) => x + 18);
    const labelOpacity = useTransform(dragProgress, [0, 0.4], [1, 0]);

    return (
      <motion.div
        animate={completed ? BUTTON_STATES.completed : BUTTON_STATES.initial}
        transition={ANIMATION_CONFIG.spring}
        className={cn(
          "relative flex h-10 items-center justify-center rounded-full bg-[#0A0A0A] border border-[#262626] shadow-inner overflow-hidden select-none",
          props.disabled && "opacity-40 cursor-not-allowed"
        )}
      >
        {/* Fill Track Background */}
        {!completed && (
          <motion.div
            style={{
              width: adjustedWidth,
            }}
            className="absolute inset-y-0 left-0 z-0 rounded-full bg-white/5 pointer-events-none"
          />
        )}

        {/* Floating Text Guideline */}
        {!completed && (
          <motion.span
            style={{ opacity: labelOpacity }}
            className="absolute font-mono text-[9px] uppercase tracking-[0.2em] text-[#A1A1AA] pointer-events-none z-5 pl-8"
          >
            Slide to Send
          </motion.span>
        )}

        <AnimatePresence mode="wait">
          {!completed && (
            <motion.div
              key="drag-handle"
              ref={dragHandleRef}
              drag="x"
              dragConstraints={DRAG_CONSTRAINTS}
              dragElastic={props.disabled ? 0 : 0.05}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrag={handleDrag}
              style={{ x: springX }}
              className={cn(
                "absolute -left-2 z-10 flex items-center justify-start",
                props.disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"
              )}
            >
              <Button
                ref={ref}
                disabled={status === "loading" || props.disabled}
                {...props}
                size="icon"
                type="button"
                className={cn(
                  "shadow-button rounded-full drop-shadow-xl bg-[#FAFAFA] text-[#0A0A0A] hover:bg-neutral-200 w-10 h-10 flex items-center justify-center border border-white/10",
                  isDragging && "scale-105 transition-transform",
                  className
                )}
              >
                <SendHorizontal className="size-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {completed && (
            <motion.div
              key="completed-status"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                ref={ref}
                disabled={status === "loading"}
                {...props}
                type="button"
                className={cn(
                  "size-full rounded-full transition-all duration-300 bg-[#111111] hover:bg-[#1A1A1A] text-[#FAFAFA] border border-[#262626]",
                  className
                )}
              >
                <AnimatePresence mode="wait">
                  <StatusIcon status={status} />
                </AnimatePresence>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

SlideButton.displayName = "SlideButton";

export default SlideButton;
