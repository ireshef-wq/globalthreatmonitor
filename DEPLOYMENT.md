# Deployment (Cloudflare Pages + Workers + D1 + KV)

This project runs as a **Cloudflare Pages** app with **Pages Functions** under `functions/`.

## 1) Create bindings

### D1
1. Create a D1 database (name: `globalthreatmonitor`).
2. Apply the schema from `db/schema.sql`.

### KV
Create a KV namespace (binding: `GTM_KV`).

Update `wrangler.toml` with your actual `database_id` and `kv id`...

## 2) Secrets / environment variables

For v1 (USGS only), no secrets are required.

Later (when you add AI/geocoding):
- `GEMINI_API_KEY` (if you keep Gemini)
- `AI_PROVIDER` (e.g. `workers_ai` or `gemini`)
- `GEOCODER_PROVIDER` (e.g. `mapbox`)
- `GEOCODER_API_KEY` (if using a paid geocoder)

In Cloudflare Pages:
Project → Settings → Environment variables.

## 3) Local dev

```bash
npm install
npm run dev
```

If you want Pages Functions locally, use Wrangler Pages dev:
```bash
npx wrangler pages dev .
```

## 4) Verify

Open:
- `/api/health`
- `/api/events`
