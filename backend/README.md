# Backend — Video API (Lambda)

Single-file FastAPI application ([`main.py`](main.py)) wrapped with **Mangum** for AWS Lambda.
Exposed through a **Lambda Function URL** (auth: none; CORS configured for the frontend origin).

## API

| Method | Path | Response |
| ------ | ---- | -------- |
| `GET` | `/` | Health JSON (`status`, `service`) |
| `GET` | `/api/videos` | Array of chapter objects with presigned playback URLs |

Each video object:

```json
{
  "id": 1,
  "title": "Q1 — …",
  "description": "60s · …",
  "key": "q1.mp4",
  "url": "https://<bucket>.s3.amazonaws.com/q1.mp4?X-Amz-…"
}
```

Presigned URLs use `PRESIGN_EXPIRES` (default **3600** seconds). The handler does not proxy video bytes—clients stream from S3.

## Runtime

| Setting | Value |
| ------- | ----- |
| Runtime | Python 3.11 |
| Handler | `main.handler` |
| Adapter | Mangum (`lifespan="off"`) |
| Typical sizing | 512 MB memory, 10 s timeout |

## Configuration (environment variables)

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `S3_BUCKET` | yes | Bucket containing chapter `.mp4` objects |
| `FRONTEND_ORIGIN` | yes | Primary frontend origin for CORS |
| `EXTRA_CORS_ORIGINS` | no | Comma-separated additional allowed origins |
| `PRESIGN_EXPIRES` | no | Presigned URL TTL in seconds (default `3600`) |

`AWS_REGION` is set automatically on Lambda; do not override it as a custom env var.

## IAM (execution role)

The Lambda execution role needs:

- **`AWSLambdaBasicExecutionRole`** — CloudWatch Logs
- **`s3:GetObject`** on `arn:aws:s3:::${S3_BUCKET}/*` — presign and validate object access

## Public Function URL

The Function URL must allow unauthenticated `GET` from the browser. The resource policy requires **both**:

- `lambda:InvokeFunctionUrl` (with `lambda:FunctionUrlAuthType: NONE`)
- `lambda:InvokeFunction` (with `lambda:InvokedViaFunctionUrl: true`)

CORS on the Function URL should include the Vercel production origin and any preview origins you use.
