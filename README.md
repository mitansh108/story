# Story-Mitansh — Cinematic Video Portfolio

A single-page, video-centric personal portfolio built on a fully serverless,
zero-cost stack.

| Tier     | Tech                                                                 |
| -------- | -------------------------------------------------------------------- |
| Frontend | Next.js 14 (static export) + Tailwind CSS + Framer Motion + react-player |
| Compute  | FastAPI + Mangum on an AWS Lambda Function URL (no API Gateway)      |
| Storage  | AWS S3, private bucket, accessed via 1-hour presigned GET URLs       |

```
Browser  ──GET /api/videos──►  Lambda (FastAPI)  ──presign──►  S3
   ▲                                  │
   └──────── JSON {id,title,desc,url} ┘
   │
   └──────── direct HTTP range GET ──────────────────────►  S3 (private)
```

## Repository

```
Story-Mitansh/
  backend/    # FastAPI + Mangum (main.py)
  frontend/   # Next.js static-export SPA
```

Each subdirectory has its own README with deeper details.

---

## 1. Local development

### 1a. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export S3_BUCKET=your-bucket-name
export AWS_REGION=us-east-1
export AWS_PROFILE=your-aws-profile
export FRONTEND_ORIGIN=http://localhost:3000
uvicorn main:app --reload --port 8000
```

Sanity check:

```bash
curl -s http://localhost:8000/api/videos | jq '.[0]'
```

### 1b. Frontend

```bash
cd frontend
cp .env.local.example .env.local            # NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev                                 # http://localhost:3000
```

---

## 2. AWS setup

Configure S3, IAM, Lambda, and the Function URL from the AWS Console. See
[`backend/README.md`](backend/README.md) for handler name, env vars, and IAM
permissions.

---

## 3. Deploy the frontend (Vercel)

1. Push this repo to GitHub.
2. In Vercel: **Add New… → Project → Import** the repo.
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Next.js (auto-detected)
   - **Environment Variable:** `NEXT_PUBLIC_API_URL` → your Lambda Function URL
4. Deploy.

---

## 4. Iterating on the chapters

The 5 chapter records live in [`backend/main.py`](backend/main.py) under
`VIDEOS`. To add or rename a chapter:

1. Edit `VIDEOS` (titles, descriptions, S3 keys).
2. Upload the matching `.mp4` to the S3 bucket.
3. Redeploy the Lambda function.

No database, no admin panel, no migrations.

---

## 5. Cost notes

- **Vercel Hobby:** static hosting + bandwidth, free tier.
- **AWS Lambda:** 1M free requests/month; this endpoint is a single GET.
- **AWS Lambda Function URL:** no separate charge (no API Gateway).
- **S3:** storage costs ≈ $0.023/GB-month; egress is the main variable
  (presigned GETs stream directly from S3 to the viewer).
- **No NAT, no VPC, no database.**
