"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type ReactPlayerType from "react-player";

import { ChapterList } from "./ChapterList";
import { fetchVideos } from "@/lib/api";
import type { Video } from "@/lib/types";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

const DEFAULT_ASPECT = 16 / 9;

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; videos: Video[] };

export function VideoTheater() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [activeId, setActiveId] = useState<number | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const playerRef = useRef<ReactPlayerType | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchVideos(controller.signal)
      .then((videos) => {
        setState({ kind: "ready", videos });
        if (videos.length > 0) setActiveId(videos[0].id);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({
          kind: "error",
          message:
            err instanceof Error ? err.message : "Unknown error loading videos.",
        });
      });
    return () => controller.abort();
  }, []);

  const videos = state.kind === "ready" ? state.videos : [];

  const activeIndex = useMemo(() => {
    if (activeId == null) return -1;
    return videos.findIndex((v) => v.id === activeId);
  }, [videos, activeId]);

  const activeVideo = activeIndex >= 0 ? videos[activeIndex] : null;

  const goToIndex = useCallback(
    (index: number) => {
      const video = videos[index];
      if (video) setActiveId(video.id);
    },
    [videos],
  );

  const goPrev = useCallback(() => {
    if (activeIndex > 0) goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  const goNext = useCallback(() => {
    if (activeIndex >= 0 && activeIndex < videos.length - 1) {
      goToIndex(activeIndex + 1);
    }
  }, [activeIndex, videos.length, goToIndex]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex >= 0 && activeIndex < videos.length - 1;

  useEffect(() => {
    setAspectRatio(null);
  }, [activeId]);

  const readAspectFromPlayer = useCallback(() => {
    const internal = playerRef.current?.getInternalPlayer?.();
    if (!(internal instanceof HTMLVideoElement)) return;

    const apply = () => {
      const { videoWidth, videoHeight } = internal;
      if (videoWidth > 0 && videoHeight > 0) {
        setAspectRatio(videoWidth / videoHeight);
      }
    };

    if (internal.readyState >= 1) {
      apply();
    } else {
      internal.addEventListener("loadedmetadata", apply, { once: true });
    }
  }, []);

  const effectiveAspect = aspectRatio ?? DEFAULT_ASPECT;
  const isPortrait = effectiveAspect < 1;
  const stageStyle: React.CSSProperties = isPortrait
    ? {
        aspectRatio: `${effectiveAspect}`,
        height: "min(80vh, 720px)",
        width: "auto",
        maxWidth: "100%",
      }
    : {
        aspectRatio: `${effectiveAspect}`,
        width: "100%",
        maxHeight: "80vh",
      };

  return (
    <section className="mx-auto w-full px-6 pb-24 pt-4 md:px-10">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-10 max-w-4xl text-center"
      >
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-accent">
          The answers
        </p>
        <h2 className="mt-1 font-display text-3xl font-medium text-ink md:text-4xl">
          Five questions, on the record.
        </h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 h-px w-12 origin-center bg-slate-300"
          aria-hidden
        />
      </motion.header>

      {state.kind === "loading" && <TheaterSkeleton />}
      {state.kind === "error" && <TheaterError message={state.message} />}

      {state.kind === "ready" && (
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8">
          <div className="flex w-full items-center gap-3 md:gap-5">
            <NavButton
              direction="prev"
              onClick={goPrev}
              disabled={!canGoPrev}
              label="Previous question"
            />

            <div className="flex min-w-0 flex-1 items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={stageStyle}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-cinematic transition-[width,height,aspect-ratio,box-shadow] duration-500 ease-out hover:shadow-lifted"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeVideo?.id ?? "none"}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    {activeVideo ? (
                      <ReactPlayer
                        ref={playerRef}
                        url={activeVideo.url}
                        controls
                        width="100%"
                        height="100%"
                        playing={false}
                        onReady={readAspectFromPlayer}
                        config={{
                          file: {
                            attributes: {
                              controlsList: "nodownload",
                              playsInline: true,
                            },
                          },
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-ink-muted">
                        Select a question to begin.
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            <NavButton
              direction="next"
              onClick={goNext}
              disabled={!canGoNext}
              label="Next question"
            />
          </div>

          {activeVideo && (
            <motion.div
              key={`meta-${activeVideo.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl text-center"
            >
              <p className="text-[0.7rem] uppercase tracking-[0.3em] text-accent">
                Question {String(activeIndex + 1).padStart(2, "0")} of{" "}
                {String(videos.length).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-2xl font-medium text-ink md:text-3xl">
                {activeVideo.title}
              </h3>
              <p className="mt-2 text-ink-muted md:text-lg">
                {activeVideo.description}
              </p>
            </motion.div>
          )}

          <ChapterList
            videos={videos}
            activeId={activeId}
            onSelect={setActiveId}
          />
        </div>
      )}
    </section>
  );
}

function NavButton({
  direction,
  onClick,
  disabled,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      whileHover={disabled ? undefined : { scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      className={[
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 md:h-12 md:w-12",
        disabled
          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
          : "border-slate-200 bg-white text-ink shadow-card hover:border-slate-300 hover:bg-slate-50 hover:shadow-card-hover",
      ].join(" ")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        {direction === "prev" ? (
          <path d="M15 18l-6-6 6-6" />
        ) : (
          <path d="M9 18l6-6-6-6" />
        )}
      </svg>
    </motion.button>
  );
}

function TheaterSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8">
      <div className="flex w-full items-center gap-3 md:gap-5">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-100 md:h-12 md:w-12" />
        <div className="aspect-video min-w-0 flex-1 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-100 md:h-12 md:w-12" />
      </div>
      <div className="h-20 w-full max-w-md animate-pulse rounded-lg bg-slate-50" />
      <div className="flex w-full max-w-2xl flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl border border-slate-200 bg-slate-50"
          />
        ))}
      </div>
    </div>
  );
}

function TheaterError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
      <p className="font-medium">We couldn&apos;t load the chapters.</p>
      <p className="mt-1 text-red-600/80">{message}</p>
    </div>
  );
}
