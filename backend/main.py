"""FastAPI application + Mangum Lambda adapter.

Run locally:
    uvicorn main:app --reload --port 8000

Deployed: invoked through an AWS Lambda Function URL (no API Gateway).
Handler: main.handler
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from types import MappingProxyType
from typing import Mapping

import boto3
from botocore.client import Config
from fastapi import FastAPI
from mangum import Mangum
from pydantic import BaseModel


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class Settings:
    s3_bucket: str
    aws_region: str
    presign_expires_seconds: int
    cors_origins: tuple[str, ...]


def _parse_origins(raw: str | None) -> tuple[str, ...]:
    if not raw:
        return ()
    return tuple(origin.strip() for origin in raw.split(",") if origin.strip())


def load_settings() -> Settings:
    frontend_origin = os.getenv("FRONTEND_ORIGIN", "").strip()
    extra_origins = _parse_origins(os.getenv("EXTRA_CORS_ORIGINS"))

    origins: list[str] = ["http://localhost:3000"]
    if frontend_origin:
        origins.append(frontend_origin)
    origins.extend(extra_origins)

    seen: set[str] = set()
    deduped: list[str] = []
    for origin in origins:
        if origin not in seen:
            seen.add(origin)
            deduped.append(origin)

    return Settings(
        s3_bucket=os.getenv("S3_BUCKET", ""),
        aws_region=os.getenv("AWS_REGION", os.getenv("AWS_DEFAULT_REGION", "us-east-1")),
        presign_expires_seconds=int(os.getenv("PRESIGN_EXPIRES", "3600")),
        cors_origins=tuple(deduped),
    )


settings = load_settings()


# ---------------------------------------------------------------------------
# Video metadata (immutable, no database)
# ---------------------------------------------------------------------------

VideoRecord = Mapping[str, str | int]


def _freeze(record: dict[str, str | int]) -> VideoRecord:
    return MappingProxyType(dict(record))


VIDEOS: tuple[VideoRecord, ...] = (
    _freeze(
        {
            "id": 1,
            "title": "Q1 \u2014 Who I am and why BBTT",
            "description": "60s \u00b7 What I'm working on, where I am in my career, and what specifically made me click apply.",
            "key": "q1.mp4",
        }
    ),
    _freeze(
        {
            "id": 2,
            "title": "Q2 \u2014 Something I'm genuinely proud of",
            "description": "90s \u00b7 What I built, what was hard, and what I'd do differently now.",
            "key": "q2.mp4",
        }
    ),
    _freeze(
        {
            "id": 3,
            "title": "Q3 \u2014 How I use AI tools when I code",
            "description": "90s \u00b7 Which tools, how often, what they're great at, and where they fall short.",
            "key": "q3.mp4",
        }
    ),
    _freeze(
        {
            "id": 4,
            "title": "Q4 \u2014 Learning a new codebase with sparse docs",
            "description": "60s \u00b7 My actual approach \u2014 first, second, third \u2014 not theory.",
            "key": "q4.mp4",
        }
    ),
    _freeze(
        {
            "id": 5,
            "title": "Q5 \u2014 Screen-share: a moment of AI-assisted coding",
            "description": "60\u201390s \u00b7 Optional, but strongly encouraged. Recorded live.",
            "key": "q5.mp4",
        }
    ),
)


# ---------------------------------------------------------------------------
# S3 presigned URLs
# ---------------------------------------------------------------------------

_s3_client = boto3.client(
    "s3",
    region_name=settings.aws_region or None,
    config=Config(signature_version="s3v4"),
)


def presign(key: str) -> str:
    """Return a short-lived presigned GET URL for the given object key."""
    if not settings.s3_bucket:
        raise RuntimeError("S3_BUCKET environment variable is not configured.")

    return _s3_client.generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": settings.s3_bucket, "Key": key},
        ExpiresIn=settings.presign_expires_seconds,
    )


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------


class Video(BaseModel):
    id: int
    title: str
    description: str
    key: str
    url: str


app = FastAPI(
    title="Cinematic Video Portfolio API",
    version="1.0.0",
    description="Serves chapter metadata with short-lived S3 presigned URLs.",
)

# CORS is handled by the Lambda Function URL config (not FastAPI).
# Adding CORSMiddleware here duplicates Access-Control-Allow-Origin and breaks browsers.


@app.get("/", include_in_schema=False)
def root() -> dict[str, str]:
    return {"status": "ok", "service": "cinematic-video-portfolio"}


@app.get("/api/videos", response_model=list[Video])
def list_videos() -> list[Video]:
    return [
        Video(
            id=int(record["id"]),
            title=str(record["title"]),
            description=str(record["description"]),
            key=str(record["key"]),
            url=presign(str(record["key"])),
        )
        for record in VIDEOS
    ]


handler = Mangum(app, lifespan="off")
