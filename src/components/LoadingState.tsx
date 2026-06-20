"use client";

import { motion } from "framer-motion";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      className={`rounded-lg ${className}`}
      style={{ backgroundColor: "var(--surface)" }}
    />
  );
}

export default function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--surface-raised)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Animated top bar */}
        <div
          className="h-0.5 w-full"
          style={{
            background: "linear-gradient(to right, #F79C6A, #E8893A, #FDCBAA)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />

        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#F79C6A" }}
          >
            <svg
              className="w-4 h-4 text-white animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                AI is planning your event
              </p>
              <div className="flex items-center gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 0.55,
                      repeat: Infinity,
                      delay: i * 0.13,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ backgroundColor: "#F79C6A" }}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
              Analyzing requirements and finding the perfect venue
            </p>
          </div>
        </div>

        {/* Skeleton fields */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl space-y-3"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <SkeletonBlock className="w-7 h-7 rounded-lg" />
              <SkeletonBlock className="w-16 h-2.5" />
              <SkeletonBlock className="w-full h-3.5" />
              <SkeletonBlock className="w-2/3 h-3.5" />
            </div>
          ))}
        </div>

        <div className="px-5 pb-5">
          <div
            className="p-4 rounded-xl space-y-3"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <SkeletonBlock className="w-7 h-7 rounded-lg" />
              <SkeletonBlock className="w-20 h-2.5" />
            </div>
            <SkeletonBlock className="w-full h-3.5" />
            <SkeletonBlock className="w-full h-3.5" />
            <SkeletonBlock className="w-3/4 h-3.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
