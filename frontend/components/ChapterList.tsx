"use client";

import { motion } from "framer-motion";
import type { Video } from "@/lib/types";

interface ChapterListProps {
  videos: Video[];
  activeId: number | null;
  onSelect: (id: number) => void;
}

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ChapterList({ videos, activeId, onSelect }: ChapterListProps) {
  return (
    <div
      aria-label="All questions"
      className="w-full max-w-2xl pt-4"
    >
      <div className="mb-4 text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-accent">
          All questions
        </p>
        <p className="mt-1 text-xs text-ink-faint">
          {videos.length} total &middot; ~7 min
        </p>
      </div>

      <motion.ol
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2"
      >
        {videos.map((video, index) => {
          const isActive = video.id === activeId;
          return (
            <motion.li key={video.id} variants={itemVariants}>
              <motion.button
                type="button"
                onClick={() => onSelect(video.id)}
                aria-current={isActive ? "true" : undefined}
                whileHover={{ scale: isActive ? 1 : 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={[
                  "group relative flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-colors duration-300",
                  isActive
                    ? "border-slate-300 bg-slate-50 shadow-card"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60",
                ].join(" ")}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-chapter-indicator"
                    className="absolute inset-x-4 top-0 h-[2px] rounded-full bg-ink"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                <span
                  className={[
                    "font-display text-lg tabular-nums transition-colors duration-300",
                    isActive ? "text-ink" : "text-ink-faint group-hover:text-ink-soft",
                  ].join(" ")}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={[
                      "block truncate font-medium transition-colors duration-300",
                      isActive ? "text-ink" : "text-ink-soft group-hover:text-ink",
                    ].join(" ")}
                  >
                    {video.title}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-ink-muted">
                    {video.description}
                  </span>
                </span>

                <span
                  aria-hidden
                  className={[
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                    isActive
                      ? "bg-ink text-white"
                      : "bg-slate-100 text-ink-faint group-hover:bg-ink group-hover:text-white",
                  ].join(" ")}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-3 w-3"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </motion.button>
            </motion.li>
          );
        })}
      </motion.ol>
    </div>
  );
}
