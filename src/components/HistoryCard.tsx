"use client";

import { motion } from "framer-motion";
import { MapPin, DollarSign, Building2, Trash2, Clock } from "lucide-react";
import { EventProposal } from "@/types/event";
import { formatDate, truncate } from "@/lib/utils";

interface HistoryCardProps {
  proposal: EventProposal;
  onDelete: (id: string) => void;
  index: number;
}

export default function HistoryCard({ proposal, onDelete, index }: HistoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      layout
      className="group relative rounded-xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: "var(--surface-raised)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(247,156,106,0.35)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 20px rgba(247,156,106,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div className="p-5">
        {/* Query + delete */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <p
            className="text-sm font-medium leading-snug flex-1"
            style={{ color: "var(--foreground)" }}
          >
            &ldquo;{truncate(proposal.query, 110)}&rdquo;
          </p>
          <button
            onClick={() => onDelete(proposal._id)}
            aria-label="Delete this proposal"
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
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
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { icon: Building2, value: proposal.venueName },
            { icon: MapPin, value: proposal.location },
            { icon: DollarSign, value: proposal.estimatedCost },
          ].map(({ icon: Icon, value }) => (
            <div key={value} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(247,156,106,0.1)" }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: "#F79C6A" }} />
              </div>
              <p
                className="text-xs font-medium truncate"
                style={{ color: "var(--foreground)", opacity: 0.75 }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Timestamp */}
        <div
          className="flex items-center gap-1.5 mt-4 pt-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <Clock className="w-3 h-3" style={{ color: "#9CA3AF" }} />
          <span className="text-xs" style={{ color: "#9CA3AF" }}>
            {formatDate(proposal.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
