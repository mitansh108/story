# Backend — Cinematic Video Portfolio API

Single-file FastAPI service (`main.py`) wrapped with Mangum for AWS Lambda.

```
GET /api/videos
```

Returns the 5 chapter records with freshly-minted S3 presigned URLs (1-hour TTL).

## Local development

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

export S3_BUCKET=your-bucket
export AWS_REGION=us-east-1
export AWS_PROFILE=your-profile
export FRONTEND_ORIGIN=http://localhost:3000

uvicorn main:app --reload --port 8000
```

```bash
curl http://localhost:8000/api/videos | jq
```

## Lambda deployment

Upload `main.py` + dependencies as a zip to Lambda via the AWS Console.

- **Runtime:** Python 3.11
- **Handler:** `main.handler`
- **Memory:** 512 MB
- **Timeout:** 10 s

Enable a **Function URL** (Auth type: NONE) and set CORS to allow your frontend origin.

## Environment variables

| Variable             | Required | Description                                      |
| -------------------- | -------- | ------------------------------------------------ |
| `S3_BUCKET`          | yes      | Bucket holding the chapter videos                |
| `AWS_REGION`         | no       | Defaults to `us-east-1` (auto-set on Lambda)     |
| `FRONTEND_ORIGIN`    | yes      | Production frontend origin for CORS              |
| `EXTRA_CORS_ORIGINS` | no       | Comma-separated additional origins (preview URLs)|
| `PRESIGN_EXPIRES`    | no       | Override presign TTL in seconds (default 3600)   |

## IAM

The Lambda execution role needs `s3:GetObject` on your bucket plus the managed policy `AWSLambdaBasicExecutionRole`.
