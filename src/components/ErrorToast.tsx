"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ErrorToastProps {
  message: string | null;
  onDismiss: () => void;
}

export default function ErrorToast({ message, onDismiss }: ErrorToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
          role="alert"
          aria-live="assertive"
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
            style={{
              backgroundColor: "var(--surface-raised)",
              border: "1px solid rgba(239,68,68,0.25)",
              boxShadow: "0 8px 32px rgba(239,68,68,0.12)",
            }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#ef4444" }} />
            <p className="text-sm flex-1" style={{ color: "var(--foreground)" }}>
              {message}
            </p>
            <button
              onClick={onDismiss}
              aria-label="Dismiss error"
              className="p-1 rounded-lg transition-all flex-shrink-0"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(239,68,68,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
