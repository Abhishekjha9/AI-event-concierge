"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, X } from "lucide-react";
import ShipIcon from "@/components/ShipIcon";

interface ChatInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  /** When this changes (keyed by .t), populate the textarea without submitting */
  fill?: { text: string; t: number };
}

export default function ChatInput({ onSubmit, isLoading, fill }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* Populate textarea when a quick-card is clicked (keyed by fill.t) */
  useEffect(() => {
    if (fill?.text) {
      setValue(fill.text);
      setTimeout(() => textareaRef.current?.focus(), 30);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fill?.t]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = value.trim().length > 0 && !isLoading;

  return (
    <div
      className="flex items-end gap-3 rounded-2xl px-4 py-3"
      style={{
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        backgroundColor: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex-shrink-0 mb-0.5">
        <ShipIcon size={32} />
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your corporate event..."
        disabled={isLoading}
        rows={1}
        aria-label="Event description"
        className="flex-1 resize-none outline-none bg-transparent text-sm leading-relaxed disabled:opacity-50"
        style={{
          color: "var(--foreground)",
          minHeight: "32px",
          maxHeight: "140px",
          overflowY: "auto",
          paddingTop: "6px",
        }}
      />

      {/* Right side — clear + send */}
      <div className="flex items-center gap-1.5 mb-0.5 flex-shrink-0">
        <AnimatePresence>
          {value.length > 0 && !isLoading && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={() => { setValue(""); textareaRef.current?.focus(); }}
              aria-label="Clear"
              style={{ outline: "none", color: "#9CA3AF" }}
              className="p-1.5 rounded-lg transition-all"
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "var(--surface)";
                el.style.color = "var(--foreground)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "transparent";
                el.style.color = "#9CA3AF";
              }}
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleSubmit}
          disabled={!canSubmit}
          whileHover={canSubmit ? { scale: 1.07 } : {}}
          whileTap={canSubmit ? { scale: 0.93 } : {}}
          aria-label="Submit"
          style={{
            outline: "none",
            backgroundColor: canSubmit ? "#F79C6A" : "var(--surface)",
            cursor: canSubmit ? "pointer" : "not-allowed",
            color: canSubmit ? "white" : "#9CA3AF",
            boxShadow: canSubmit ? "0 4px 14px rgba(247,156,106,0.38)" : "none",
            transition: "background-color 0.2s, box-shadow 0.2s",
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
        >
          {isLoading ? (
            <div
              className="w-3.5 h-3.5 border-2 rounded-full animate-spin"
              style={{ borderColor: "#9CA3AF", borderTopColor: "transparent" }}
            />
          ) : (
            <ArrowUp className="w-4 h-4" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
