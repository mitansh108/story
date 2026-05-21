"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-slate-100">
      <div
        className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-slate-100/60 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-slate-50 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col items-start justify-center gap-10 px-6 py-24 md:flex-row md:items-center md:gap-16 md:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.03 }}
          className="relative h-44 w-44 shrink-0 animate-float md:h-56 md:w-56"
        >
          <div
            className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(15,23,42,0.12),transparent)] animate-border-spin opacity-70"
            aria-hidden
          />
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white shadow-lifted ring-1 ring-slate-200">
            <Image
              src="/avatar.jpeg"
              alt="Mitansh Patel"
              fill
              sizes="(min-width: 768px) 14rem, 11rem"
              className="object-cover object-center"
              priority
            />
          </div>
        </motion.div>

        <div className="flex max-w-2xl flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-wrap items-center gap-3"
          >
            <motion.span
              whileHover={{ y: -2, boxShadow: "0 8px 24px -8px rgba(15,23,42,0.12)" }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-accent shadow-card transition-shadow"
            >
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ink" />
              BBTT &middot; Round 1 &middot; Async Video
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink md:text-7xl"
          >
            Mitansh Patel
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-16 origin-left bg-slate-300"
            aria-hidden
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg leading-relaxed text-ink-muted md:text-xl"
          >
            Expected a Loom link? I put in a little extra effort to stand
            out. Keep scrolling.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="flex items-center gap-3 pt-2 text-sm text-ink-faint"
          >
            <span className="h-px w-10 bg-slate-200" />
            <span className="uppercase tracking-[0.3em]">Scroll to the answers</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 animate-scroll-hint"
              aria-hidden
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
