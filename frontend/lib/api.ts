import type { Video } from "./types";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export async function fetchVideos(signal?: AbortSignal): Promise<Video[]> {
  if (!API_BASE) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Copy .env.local.example to .env.local and configure it.",
    );
  }

  const res = await fetch(`${API_BASE}/api/videos`, {
    signal,
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to load videos (${res.status} ${res.statusText})`);
  }

  const data = (await res.json()) as Video[];
  if (!Array.isArray(data)) {
    throw new Error("Malformed response from /api/videos");
  }
  return data;
}
