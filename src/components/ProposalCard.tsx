"use client";

import { motion } from "framer-motion";
import { MapPin, DollarSign, Building2, Lightbulb, Copy, Check } from "lucide-react";
import { useState } from "react";
import { EventProposal } from "@/types/event";

interface ProposalCardProps {
  proposal: EventProposal;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Copy proposal"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
      style={{
        backgroundColor: copied ? "rgba(247,156,106,0.15)" : "var(--surface)",
        color: copied ? "#F79C6A" : "#9CA3AF",
        border: `1px solid ${copied ? "rgba(247,156,106,0.3)" : "var(--border)"}`,
      }}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </motion.button>
  );
}

const FIELDS = [
  {
    key: "venueName" as const,
    icon: Building2,
    label: "Venue",
    iconBg: "rgba(247,156,106,0.12)",
    iconColor: "#F79C6A",
  },
  {
    key: "location" as const,
    icon: MapPin,
    label: "Location",
    iconBg: "rgba(247,156,106,0.08)",
    iconColor: "#E8893A",
  },
  {
    key: "estimatedCost" as const,
    icon: DollarSign,
    label: "Estimated Cost",
    iconBg: "rgba(34,197,94,0.1)",
    iconColor: "#22c55e",
  },
];

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const copyText = `Event Proposal\n\nVenue: ${proposal.venueName}\nLocation: ${proposal.location}\nEstimated Cost: ${proposal.estimatedCost}\n\nWhy It Fits:\n${proposal.justification}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/*
       * Shine-border technique: a 1px-padding wrapper whose background IS the
       * gradient border (white → orange → white). The inner div sits on top
       * with the same border-radius minus the 1px padding.
       */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.80), #F79C6A, rgba(255,255,255,0.42))",
          padding: "1px",
          borderRadius: "1.2rem",
          boxShadow: "0px 1rem 1.5rem -0.9rem rgba(0,0,0,0.72)",
        }}
      >
      <div
        className="overflow-hidden"
        style={{
          backgroundColor: "var(--surface-raised)",
          borderRadius: "calc(1.2rem - 1px)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#F79C6A" }}
            >
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "#9CA3AF" }}
              >
                AI Recommendation
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Event Proposal
              </p>
            </div>
          </div>
          <CopyButton text={copyText} />
        </div>

        {/* Fields */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FIELDS.map((field, i) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className="flex flex-col gap-2 p-4 rounded-xl"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: field.iconBg }}
              >
                <field.icon className="w-3.5 h-3.5" style={{ color: field.iconColor }} />
              </div>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "#9CA3AF" }}
              >
                {field.label}
              </p>
              <p
                className="text-sm font-semibold leading-snug"
                style={{ color: "var(--foreground)" }}
              >
                {proposal[field.key]}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Justification */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.22 }}
          className="px-5 pb-5"
        >
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(247,156,106,0.12)" }}
              >
                <Lightbulb className="w-3.5 h-3.5" style={{ color: "#F79C6A" }} />
              </div>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "#9CA3AF" }}
              >
                Why It Fits
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.85 }}>
              {proposal.justification}
            </p>
          </div>
        </motion.div>
      </div>
      </div>
    </motion.div>
  );
}
