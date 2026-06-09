"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  receivedAt: string;
}

interface MessageViewerProps {
  selectedMessage: Message | null;
}

export default function MessageViewer({ selectedMessage }: MessageViewerProps) {
  const [sanitizedHtml, setSanitizedHtml] = React.useState("");

  React.useEffect(() => {
    if (!selectedMessage?.bodyHtml) {
      setSanitizedHtml("");
      return;
    }

    let isMounted = true;
    import("dompurify").then((module) => {
      if (!isMounted) return;
      const DOMPurify = module.default;
      const clean = DOMPurify.sanitize(selectedMessage.bodyHtml, {
        ALLOWED_TAGS: [
          "p", "br", "b", "i", "em", "strong", "u", "s", "strike",
          "h1", "h2", "h3", "h4", "h5", "h6",
          "ul", "ol", "li", "blockquote", "pre", "code",
          "a", "img",
          "table", "thead", "tbody", "tr", "th", "td",
          "div", "span", "hr",
        ],
        ALLOWED_ATTR: [
          "href", "src", "alt", "title", "width", "height",
          "style", "class", "target", "rel",
          "colspan", "rowspan",
        ],
        ALLOWED_URI_REGEXP: /^(?:https?|mailto|ftp):/i,
        ADD_ATTR: ["rel"],
        SANITIZE_DOM: true,
        WHOLE_DOCUMENT: false,
      });
      setSanitizedHtml(clean);
    });

    return () => {
      isMounted = false;
    };
  }, [selectedMessage?.bodyHtml]);

  return (
    <div className="flex-grow flex flex-col bg-[#0B0D10] h-full overflow-hidden relative">
      <AnimatePresence mode="wait">
        {selectedMessage ? (
          <motion.div
            key={selectedMessage.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-grow flex flex-col h-full overflow-hidden"
          >
            {/* Message Meta Header */}
            <div className="p-4 md:p-8 border-b border-[rgba(255,255,255,0.08)] flex flex-col gap-3 bg-[#111418]/10 select-text">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-xl font-medium tracking-tight text-[#F8F8F8]">
                  {selectedMessage.subject}
                </h1>
                <span className="text-[11px] font-mono text-[#A2A8B3] whitespace-nowrap mt-1">
                  {new Date(selectedMessage.receivedAt).toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col gap-1 text-xs text-[#A2A8B3]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                  <span>From: </span>
                  <strong className="text-neutral-300 font-normal">
                    {selectedMessage.from}
                  </strong>
                </div>
              </div>
            </div>

            {/* Sanitized Message Body Panel */}
            <div className="flex-grow p-4 md:p-8 overflow-y-auto select-text">
              {selectedMessage.bodyHtml ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizedHtml,
                  }}
                  className="prose prose-invert max-w-none text-sm leading-relaxed text-neutral-300"
                />
              ) : (
                <pre className="font-mono text-xs leading-relaxed text-neutral-300 whitespace-pre-wrap font-light">
                  {selectedMessage.bodyText}
                </pre>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-center p-12 text-[#A2A8B3] text-sm select-none">
            <div className="flex flex-col items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
              <span>Select an email from the list to view its contents.</span>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
