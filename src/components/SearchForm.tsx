"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight, Loader2 } from "lucide-react";

interface SearchFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

const MAX_CHARS = 500;

export default function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const remaining = MAX_CHARS - query.length;
  const isOverLimit = remaining < 0;
  const canSubmit = query.trim().length > 0 && !isLoading && !isOverLimit;

  return (
    <div
      className="relative rounded-2xl transition-all duration-200"
      style={{
        backgroundColor: "var(--surface-raised)",
        border: "1px solid var(--border)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <textarea
        ref={textareaRef}
        value={query}
        onChange={(e) => setQuery(e.target.value.slice(0, MAX_CHARS + 20))}
        onKeyDown={handleKeyDown}
        placeholder="Describe your corporate event, retreat, conference, or offsite..."
        disabled={isLoading}
        rows={4}
        aria-label="Event description"
        className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm outline-none disabled:opacity-60 leading-relaxed"
        style={{ color: "var(--foreground)" }}
      />

      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <span
          className="text-xs tabular-nums"
          style={{ color: isOverLimit ? "#ef4444" : "#9CA3AF" }}
        >
          {Math.abs(remaining)} {isOverLimit ? "over limit" : "remaining"}
        </span>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {query.length > 0 && !isLoading && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery("")}
                aria-label="Clear"
                className="p-1.5 rounded-lg transition-all"
                style={{ color: "#9CA3AF" }}
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleSubmit}
            disabled={!canSubmit}
            whileHover={canSubmit ? { scale: 1.02 } : {}}
            whileTap={canSubmit ? { scale: 0.98 } : {}}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              backgroundColor: canSubmit ? "#F79C6A" : "var(--surface)",
              color: canSubmit ? "white" : "#9CA3AF",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
