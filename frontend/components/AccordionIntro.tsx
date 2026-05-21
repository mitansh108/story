"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function AccordionIntro() {
  const [open, setOpen] = useState(false);

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-12 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -3 }}
        className="group relative"
      >
        <div
          className={[
            "pointer-events-none absolute -inset-px overflow-hidden rounded-2xl transition-opacity duration-500",
            open ? "opacity-0" : "opacity-100",
          ].join(" ")}
          aria-hidden
        >
          <div className="absolute inset-[-100%] animate-border-spin bg-[conic-gradient(from_0deg,transparent,rgba(15,23,42,0.14),rgba(148,163,184,0.2),transparent)]" />
        </div>

        <div
          className={[
            "relative overflow-hidden rounded-2xl border bg-white transition-all duration-500",
            open
              ? "border-slate-200 shadow-card"
              : "border-transparent shadow-card-hover group-hover:shadow-lifted",
          ].join(" ")}
        >
          {!open && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 animate-shimmer"
              style={{
                background:
                  "linear-gradient(120deg, transparent 25%, rgba(15,23,42,0.04) 50%, transparent 75%)",
                backgroundSize: "300% 100%",
              }}
            />
          )}

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="why-a-website-content"
            className="relative flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50/80 md:px-8 md:py-6"
          >
            <div>
              <p className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-accent">
                <span
                  className={[
                    "inline-block h-2 w-2 rounded-full bg-red-500",
                    open ? "" : "animate-pulse-dot",
                  ].join(" ")}
                />
                Before you press play
              </p>
              <h2 className="mt-2 font-display text-2xl font-medium leading-snug text-ink transition-transform duration-300 group-hover:translate-x-0.5 md:text-3xl">
                Why this is a website, not a Loom link.
              </h2>
            </div>

            <motion.span
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                open
                  ? "border-slate-200 bg-surface-muted text-accent"
                  : "border-slate-300 bg-ink text-white shadow-card animate-pulse-ring group-hover:shadow-card-hover",
              ].join(" ")}
              aria-hidden
            >
              <motion.svg
                initial={false}
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </motion.svg>
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id="why-a-website-content"
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-10 border-t border-slate-100 px-6 pb-10 pt-2 text-ink-soft md:px-8 md:text-lg md:leading-relaxed">
                  <Section eyebrow="01 · The thought process" delay={0.05}>
                    <p>
                      When the email landed, I read it twice. Five questions,
                      camera on, send a link back. Straightforward. I could have
                      recorded on my phone, uploaded to Loom, and called it a day.
                    </p>
                    <p className="mt-3 text-ink-muted">
                      But I kept thinking about what happens on your side. You
                      open a link, you watch, you close the tab. Done. I wanted
                      something that felt a little more like me showing up. I
                      also wanted to stand out, in a way that was actually useful
                      to you, not just louder.
                    </p>
                    <p className="mt-3 text-ink-muted">
                      So I spent a couple of hours before I ever hit record
                      asking a simple question: what could I build with the skills
                      I already have that would feel directly relevant to the
                      kind of work I want to be doing? Building Products. Shipping
                      things people can use. Moving fast without waiting for
                      perfect instructions. That is how I ended up building this site
                      instead of recording the  videos first.
                    </p>
                    <p className="mt-3 text-ink-muted">
                      I believe this is a fair preview of how I operate when
                      nobody explicitly asked me to go further. I saw a simple
                      brief and chose to put in extra effort on my own. That is
                      the habit I am trying to bring into a the role: notice
                      what is needed, start, and keep going until it is in
                      someone&apos;s hands.
                    </p>
                  </Section>

                  <Section eyebrow="02 · How I actually work" delay={0.1}>
                    <p>
                      I bring a strong background in software engineering and
                      computer science. I care about both sides of the job: systems
                      that can scale when traffic shows up, and products that
                      solve real problems and feel good enough that people
                      actually want to use them.
                    </p>
                    <p className="mt-3 text-ink-muted">
                      I can build full stack apps with JavaScript, Python, AWS,
                      and the usual pieces around them. Honestly, putting this
                      site together in 2020 would have taken me two or three
                      whole days. This afternoon, with Cursor and a bit of
                      intelligent execution on my side (system design, prompting,
                      reviewing the output), it took a couple of hours. I still
                      own every decision. Cursor just helped me move faster
                      through the parts that used to eat the clock.
                    </p>
                    <p className="mt-3 text-ink-muted">
                      I am early in my career and I know I have a lot to learn
                      from people who have shipped at scale. What I hope you see
                      here is someone who is eager to contribute, comfortable
                      taking a small feature end to end, and always looking for a
                      way to help the team move a little faster.
                    </p>
                  </Section>

                  <Section eyebrow="03 · Why this stack" delay={0.15}>
                    <p>
                      Once I decided to build instead of only record, I picked
                      tools the same way I would on a real product: what ships
                      fast, what stays cheap, what I can explain clearly, and what
                      still feels solid when a real person opens the link.
                    </p>
                    <ul className="mt-4 space-y-3 text-ink-muted">
                      <li>
                        <span className="font-medium text-ink">
                          Next.js and React, exported as static files.
                        </span>{" "}
                        This is the web stack I am most at home in. The page goes
                        to Vercel as plain HTML and JavaScript, loads quickly on
                        phone or laptop, and does not need a server running 24/7
                        just to show five videos and a bio.
                      </li>
                      <li>
                        <span className="font-medium text-ink">
                          FastAPI on AWS Lambda, with a Function URL.
                        </span>{" "}
                        Python for a small API that hands back video metadata and
                        signed URLs. Lambda because I wanted something that scales
                        with traffic but costs nothing when you are not on the
                        site. No API Gateway in the middle, just the function URL
                        talking straight to the browser.
                      </li>
                      <li>
                        <span className="font-medium text-ink">
                          Private S3 and short-lived signed links.
                        </span>{" "}
                        The raw files stay locked down. Each visit gets a fresh
                        link. Your browser streams from S3 directly so the API
                        never has to carry video bytes. It is the kind of pattern
                        I would reach for again on anything customer-facing that
                        needs secure file access.
                      </li>
                    </ul>
                    <p className="mt-4 text-ink-muted">
                      Three pieces, one afternoon of focused building, zero
                      ongoing bill. That is the loop I want to keep running on a
                      team: ship something real, put it in front of people, learn
                      from how they use it, and make the next version better.
                    </p>
                  </Section>

                  <div className="border-t border-slate-200 pt-6 text-sm uppercase tracking-[0.3em] text-ink-faint">
                    Now scroll down and pick a question.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}

function Section({
  eyebrow,
  children,
  delay = 0,
}: {
  eyebrow: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="mb-3 text-[0.65rem] uppercase tracking-[0.3em] text-accent">
        {eyebrow}
      </p>
      {children}
    </motion.div>
  );
}
