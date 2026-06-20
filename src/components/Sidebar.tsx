"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, PanelLeftClose, Trash2, History } from "lucide-react";
import { EventProposal } from "@/types/event";
import { truncate } from "@/lib/utils";
import ShipIcon from "@/components/ShipIcon";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  history: EventProposal[];
  historyLoading: boolean;
  onDelete: (id: string) => void;
  onSelect: (proposal: EventProposal) => void;
  onNewChat: () => void;
  selectedId?: string;
}

function groupByDate(proposals: EventProposal[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const todayItems = proposals.filter((p) => sameDay(new Date(p.createdAt), today));
  const yesterdayItems = proposals.filter((p) => sameDay(new Date(p.createdAt), yesterday));
  const weekItems = proposals.filter((p) => {
    const d = new Date(p.createdAt);
    return d >= sevenDaysAgo && !sameDay(d, today) && !sameDay(d, yesterday);
  });
  const olderItems = proposals.filter((p) => new Date(p.createdAt) < sevenDaysAgo);

  const groups: { label: string; items: EventProposal[] }[] = [];
  if (todayItems.length) groups.push({ label: "Today", items: todayItems });
  if (yesterdayItems.length) groups.push({ label: "Yesterday", items: yesterdayItems });
  if (weekItems.length) groups.push({ label: "7 days ago", items: weekItems });
  if (olderItems.length) groups.push({ label: "Older", items: olderItems });
  return groups;
}

export default function Sidebar({
  isOpen,
  onToggle,
  history,
  historyLoading,
  onDelete,
  onSelect,
  onNewChat,
  selectedId,
}: SidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = history.filter(
    (p) =>
      p.query.toLowerCase().includes(search.toLowerCase()) ||
      p.venueName.toLowerCase().includes(search.toLowerCase())
  );

  const groups = groupByDate(filtered);

  return (
    <>
      {/*
       * Width-based animation: the sidebar stays in the DOM at all times.
       * As `width` goes 260 → 0 the flex container shifts the main content
       * simultaneously — no lag, no reflow pop.
       *
       * The inner div is pinned at w-[260px] so content never squishes;
       * overflow:hidden on the outer clips it as it collapses.
       */}
      <motion.aside
        animate={{ width: isOpen ? 260 : 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="h-full flex-shrink-0 overflow-hidden"
        style={{ position: "relative" }}
      >
        <div
          className="w-[260px] h-full flex flex-col"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            backgroundColor: "var(--glass-bg)",
            borderRight: "1px solid var(--border)",
          }}
        >
          {/* Header — close button lives here (the ONLY toggle when sidebar is open) */}
          <div
            className="flex items-center justify-between px-4 h-14 flex-shrink-0"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <button
              onClick={onNewChat}
              aria-label="Go to home"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
              style={{ outline: "none", background: "none", border: "none", cursor: "pointer" }}
            >
              <ShipIcon size={28} />
              <span
                className="text-sm font-semibold whitespace-nowrap"
                style={{ color: "var(--foreground)" }}
              >
                AI Event Concierge
              </span>
            </button>

            <button
              onClick={onToggle}
              aria-label="Close sidebar"
              className="p-1.5 rounded-lg transition-all"
              style={{ color: "var(--foreground)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(247,156,106,0.12)";
                (e.currentTarget as HTMLButtonElement).style.color = "#F79C6A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)";
              }}
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* New Proposal */}
          <div className="px-3 pt-3 pb-2 flex-shrink-0">
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-white"
              style={{ backgroundColor: "#F79C6A" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E8893A")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F79C6A")
              }
            >
              <Plus className="w-4 h-4" />
              New Proposal
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pb-3 flex-shrink-0">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                style={{ color: "#9CA3AF" }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search history..."
                aria-label="Search history"
                className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none transition-all"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLInputElement).style.borderColor =
                    "rgba(247,156,106,0.6)")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLInputElement).style.borderColor = "var(--border)")
                }
              />
            </div>
          </div>

          {/* History list */}
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            {historyLoading ? (
              <div className="space-y-1 pt-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-9 rounded-lg animate-pulse"
                    style={{ backgroundColor: "var(--surface)" }}
                  />
                ))}
              </div>
            ) : groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <History className="w-8 h-8" style={{ color: "#9CA3AF" }} />
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  {search ? "No matches found" : "No proposals yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {groups.map((group) => (
                  <div key={group.label}>
                    <p
                      className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-1.5"
                      style={{ color: "#9CA3AF" }}
                    >
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      <AnimatePresence>
                        {group.items.map((proposal) => (
                          <SidebarItem
                            key={proposal._id}
                            proposal={proposal}
                            isSelected={selectedId === proposal._id}
                            onSelect={() => onSelect(proposal)}
                            onDelete={() => onDelete(proposal._id)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function SidebarItem({
  proposal,
  isSelected,
  onSelect,
  onDelete,
}: {
  proposal: EventProposal;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      className="group relative flex items-center gap-1.5 rounded-lg px-2.5 py-2 cursor-pointer transition-all"
      style={{
        backgroundColor: isSelected ? "rgba(247,156,106,0.12)" : "transparent",
        color: isSelected ? "#F79C6A" : "var(--foreground)",
      }}
      onMouseEnter={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--surface)";
      }}
      onMouseLeave={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
      }}
    >
      <span className="text-xs flex-1 truncate leading-snug opacity-80">
        {truncate(proposal.query, 38)}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Delete proposal"
        className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all flex-shrink-0"
        style={{ color: "#9CA3AF" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(239,68,68,0.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF";
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        }}
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
