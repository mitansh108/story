# Story-Mitansh — Cinematic Video Portfolio

A single-page, video-centric portfolio for BBTT Round 1: five async video answers
presented as chapters in a cinematic player, backed by a fully serverless stack.

## What it does

- **Landing experience** — hero, intro accordion, and a “video theater” for all five questions.
- **Chapter navigation** — prev/next controls, keyboard arrows, and a chapter list to jump between answers.
- **Secure playback** — the browser never sees long-lived S3 credentials; each visit gets fresh presigned URLs from the API.
- **Static frontend** — the UI is a pre-rendered Next.js export hosted on Vercel; no Node server at runtime.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Vercel (static Next.js export)                                 │
│  NEXT_PUBLIC_API_URL → Lambda Function URL                      │
└────────────────────────────┬────────────────────────────────────┘
                             │ GET /api/videos
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  AWS Lambda (Python 3.11)                                     │
│  FastAPI + Mangum · handler: main.handler                       │
│  Reads chapter metadata · mints S3 presigned GET URLs (1h TTL)  │
└────────────────────────────┬────────────────────────────────────┘
                             │ presign only (no proxy)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Amazon S3 (private bucket)                                     │
│  Objects: q1.mp4 … q5.mp4                                       │
└─────────────────────────────────────────────────────────────────┘

Browser ──GET /api/videos──► Lambda ──► JSON [{ id, title, description, url }]
Browser ──range GET url────► S3 directly (streaming, not through Lambda)
```

| Tier     | Role |
| -------- | ---- |
| **Frontend** | Next.js 14 static export, Tailwind CSS, Framer Motion, react-player |
| **Compute**  | FastAPI on Lambda via Mangum; public **Function URL** (no API Gateway) |
| **Storage**  | Private S3 bucket; videos served only through presigned GET URLs |

### Request flow

1. The page loads from Vercel and calls `GET /api/videos` on the Lambda Function URL.
2. Lambda returns five chapter records: metadata plus a short-lived presigned URL per `.mp4`.
3. react-player streams each video **directly from S3** using HTTP range requests; Lambda is not in the video path.

### Content model

Chapter titles, descriptions, and S3 keys are defined in code as an immutable tuple in
[`backend/main.py`](backend/main.py) (`VIDEOS`). There is no database, admin UI, or migration layer—only
S3 objects keyed to match (e.g. `q1.mp4` … `q5.mp4`).

## Repository layout

```
Story-Mitansh/
  backend/    # FastAPI app + Mangum handler (single main.py)
  frontend/   # Next.js static-export SPA (Vercel root: frontend/)
```

See [`backend/README.md`](backend/README.md) for the API contract, Lambda configuration, and IAM expectations.

## Cost profile

Designed for near-zero cost at portfolio traffic levels:

- **Vercel** — static hosting on the Hobby tier.
- **Lambda** — one lightweight GET per page load; Function URL has no separate charge vs API Gateway.
- **S3** — storage for compressed MP4s; egress billed on direct viewer downloads (presigned URLs), not through Lambda.
- **No** VPC, NAT gateway, RDS, or always-on servers.
