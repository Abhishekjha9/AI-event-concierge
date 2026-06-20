"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { PanelLeft, ArrowUpRight } from "lucide-react";
import ShipIcon from "@/components/ShipIcon";
import Sidebar from "@/components/Sidebar";
import ChatInput from "@/components/ChatInput";
import ProposalCard from "@/components/ProposalCard";
import LoadingState from "@/components/LoadingState";
import ErrorToast from "@/components/ErrorToast";
import ThemeToggle from "@/components/ThemeToggle";
import { EventProposal } from "@/types/event";

interface ChatMessage {
  id: string;
  query: string;
  proposal: EventProposal;
}

const QUICK_CARDS = [
  {
    title: "Leadership Retreat",
    description: "Align your leadership team and set strategy in a focused, inspiring setting.",
    prompt: "A 2-day leadership retreat for 20 senior executives focused on strategy and alignment",
  },
  {
    title: "Team Building Offsite",
    description: "Create lasting bonds and boost morale through shared outdoor or creative experiences.",
    prompt: "A team building offsite for 60 employees with outdoor activities and group workshops",
  },
  {
    title: "Executive Summit",
    description: "Host high-stakes meetings and keynotes with premium facilities and services.",
    prompt: "An executive summit for 30 C-suite leaders requiring premium conference and networking space",
  },
  {
    title: "Product Launch",
    description: "Generate buzz and make an impact with an unforgettable launch experience.",
    prompt: "A product launch event for 200 guests including press, partners, and key stakeholders",
  },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<EventProposal[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);
  /* Fill the ChatInput without submitting (used by quick-prompt cards) */
  const [inputFill, setInputFill] = useState<{ text: string; t: number } | undefined>();
  const fillInput = (text: string) => setInputFill({ text, t: Date.now() });

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.success) setHistory(data.data);
    } catch {
      // non-critical
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleSubmit = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      const newMsg: ChatMessage = {
        id: data.data._id,
        query,
        proposal: data.data,
      };

      setMessages((prev) => [...prev, newMsg]);
      setSelectedId(data.data._id);
      setHistory((prev) => [data.data, ...prev]);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setHistory((prev) => prev.filter((p) => p._id !== id));
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedId === id) setSelectedId(undefined);
      } else {
        setError(data.error ?? "Failed to delete proposal.");
      }
    } catch {
      setError("Failed to delete. Please try again.");
    }
  };

  const handleSelectHistory = (proposal: EventProposal) => {
    setMessages([
      { id: proposal._id, query: proposal.query, proposal },
    ]);
    setSelectedId(proposal._id);
    // Close sidebar on mobile
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedId(undefined);
  };

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        history={history}
        historyLoading={historyLoading}
        onDelete={handleDelete}
        onSelect={handleSelectHistory}
        onNewChat={handleNewChat}
        selectedId={selectedId}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header — sidebar open-button only. Controls are fixed top-right. */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center px-4 h-14 flex-shrink-0"
          style={{
            borderBottom: "1px solid var(--border)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            backgroundColor: "var(--glass-bg)",
          }}
        >
          <AnimatePresence>
            {!sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3"
              >
                <button
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar"
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
                  <PanelLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNewChat}
                  aria-label="Go to home"
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                  style={{ outline: "none", background: "none", border: "none", cursor: "pointer" }}
                >
                  <ShipIcon size={24} />
                  <span
                    className="text-sm font-semibold hidden sm:block"
                    style={{ color: "var(--foreground)" }}
                  >
                    AI Event Concierge
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/*
         * Model badge + ThemeToggle pinned fixed top-right so they never
         * shift when the sidebar opens/closes (sidebar changes flex widths).
         */}
        <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: "rgba(247,156,106,0.12)",
              color: "#F79C6A",
            }}
          >
            Llama 3.3 · 70B
          </span>
          <ThemeToggle />
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
          <AnimatePresence mode="wait">
            {messages.length === 0 && !isLoading ? (
              <Greeting key="greeting" onFill={fillInput} />
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-3xl mx-auto px-4 py-8 space-y-10"
              >
                {messages.map((msg) => (
                  <ChatTurn key={msg.id} message={msg} />
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <LoadingState />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 px-4 pt-3 pb-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSubmit={handleSubmit} isLoading={isLoading} fill={inputFill} />
          </div>
        </div>
      </div>

      <ErrorToast message={error} onDismiss={() => setError(null)} />
    </div>
  );
}

/* ── Animated ship ───────────────────────────────────────────────────── */

function ShipAnimation() {
  return (
    /* Fixed-width container so waves stay compact and centered */
    <div className="flex flex-col items-center select-none" style={{ width: 200 }}>
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-2.5, 2.5, -2.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ marginBottom: "-4px" }}
      >
        <ShipIcon size={84} />
      </motion.div>

      <svg width="200" height="22" viewBox="0 0 200 22" style={{ display: "block" }}>
        <motion.path
          d="M0,11 C25,3 50,19 75,11 C100,3 125,19 150,11 C175,3 200,19 200,11"
          stroke="#F79C6A" strokeWidth="2.5" strokeLinecap="round" fill="none"
          animate={{
            d: [
              "M0,11 C25,3 50,19 75,11 C100,3 125,19 150,11 C175,3 200,19 200,11",
              "M0,11 C25,19 50,3 75,11 C100,19 125,3 150,11 C175,19 200,3 200,11",
              "M0,11 C25,3 50,19 75,11 C100,3 125,19 150,11 C175,3 200,19 200,11",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,17 C33,11 67,21 100,17 C133,11 167,21 200,17"
          stroke="#F79C6A" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.35"
          animate={{
            d: [
              "M0,17 C33,11 67,21 100,17 C133,11 167,21 200,17",
              "M0,17 C33,21 67,11 100,17 C133,21 167,11 200,17",
              "M0,17 C33,11 67,21 100,17 C133,11 167,21 200,17",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </svg>
    </div>
  );
}

/* ── Cursor-reactive glow blobs ──────────────────────────────────────── */

/* Blob definitions: position, size, opacity, parallax factor (px of travel) */
const BLOB_DEFS = [
  { s: { top: "-25%",    left: "-20%",  width: "55%", height: "60%" }, op: 0.13, f: 18  },
  { s: { top: "-20%",    right: "-25%", width: "50%", height: "55%" }, op: 0.08, f: -14 },
  { s: { bottom: "-10%", left: "-10%",  width: "48%", height: "52%" }, op: 0.10, f: 12  },
  { s: { bottom: "-15%", right: "-15%", width: "50%", height: "55%" }, op: 0.09, f: -10 },
  { s: { top: "30%",     left: "25%",   width: "50%", height: "40%" }, op: 0.07, f: 8   },
] as const;

function GlowBlob({
  blobStyle,
  opacity,
  factor,
  cursorX,
  cursorY,
}: {
  blobStyle: React.CSSProperties;
  opacity: number;
  factor: number;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
}) {
  const spring = { stiffness: 40, damping: 25, mass: 0.6 };
  const x = useSpring(useTransform(cursorX, (v) => v * factor), spring);
  const y = useSpring(useTransform(cursorY, (v) => v * factor), spring);
  return (
    <motion.div
      style={{
        ...blobStyle,
        position: "absolute",
        borderRadius: "50%",
        background: `rgba(var(--blob-rgb),${opacity})`,
        filter: "blur(55px)",
        x,
        y,
      }}
    />
  );
}

function GlowBlobs() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      /* Normalise to –1 … +1 so factor determines pixel travel */
      cursorX.set((e.clientX / window.innerWidth - 0.5) * 2);
      cursorY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [cursorX, cursorY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {BLOB_DEFS.map((b, i) => (
        <GlowBlob
          key={i}
          blobStyle={b.s}
          opacity={b.op}
          factor={b.f}
          cursorX={cursorX}
          cursorY={cursorY}
        />
      ))}
    </div>
  );
}

/* ── Greeting (empty state) ─────────────────────────────────────────── */

function Greeting({ onFill }: { onFill: (text: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="relative h-full flex flex-col items-center justify-center px-6 gap-10"
    >
      <GlowBlobs />

      {/* Ship icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <ShipAnimation />
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-center space-y-3 relative z-10"
      >
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          Let&apos;s find the{" "}
          <span style={{ color: "#F79C6A" }}>perfect venue</span>
          <br />
          for your next event
        </h1>
        <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: "#9CA3AF" }}>
          Describe your corporate event and get an AI-powered venue proposal
          with cost estimates and recommendations in seconds.
        </p>
      </motion.div>

      {/* Quick cards — 4 columns like the reference */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.45 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-4xl relative z-10"
      >
        {QUICK_CARDS.map((card, i) => (
          <motion.button
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 + i * 0.06, duration: 0.35 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onFill(card.prompt)}
            className="group relative flex flex-col gap-3 p-5 rounded-2xl text-left"
            style={{
              outline: "none",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              backgroundColor: "var(--glass-bg)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "rgba(247,156,106,0.45)";
              el.style.boxShadow = "0 8px 28px rgba(247,156,106,0.12)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "var(--border)";
              el.style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)";
            }}
          >
            {/* Arrow — top-right, shows on hover */}
            <div
              className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
              style={{ backgroundColor: "rgba(247,156,106,0.15)" }}
            >
              <ArrowUpRight className="w-3.5 h-3.5" style={{ color: "#F79C6A" }} />
            </div>

            <h3
              className="text-sm font-bold pr-6 leading-snug"
              style={{ color: "var(--foreground)" }}
            >
              {card.title}
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
              {card.description}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ── Single chat turn ────────────────────────────────────────────────── */

function ChatTurn({ message }: { message: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* User bubble */}
      <div className="flex justify-end">
        <div
          className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
          style={{
            backgroundColor: "rgba(247,156,106,0.12)",
            color: "var(--foreground)",
            border: "1px solid rgba(247,156,106,0.2)",
          }}
        >
          {message.query}
        </div>
      </div>

      {/* AI response */}
      <ProposalCard proposal={message.proposal} />
    </motion.div>
  );
}
