# Yapsolutely deployment runbook

This is the **current production runbook** for the live MVP stack.

---

## Goal

Run the full product on a single Ubuntu VPS using Docker Compose:

- `web` — Next.js dashboard
- `voice` — Twilio/media runtime
- `postgres` — production Postgres for the demo stack
- `caddy` — public HTTPS and reverse proxy

Public hosts currently used:

- `https://web.84.247.176.111.sslip.io`
- `https://voice.84.247.176.111.sslip.io`

---

## 1) Production architecture

The live stack no longer depends on Vercel, Railway, or Supabase for the active demo path.

It now runs as:

- VPS host
   - Docker Compose
   - Caddy for TLS + routing
   - internal Postgres container
   - `web` container
   - `voice` container

Reason for the DB change:

- the prior Supabase direct-connect Postgres host was unreachable from the VPS because the host resolved IPv6-only there
- the current production demo therefore uses VPS-local Postgres for reliable runtime/data connectivity

---

## 2) Required files in `deploy/`

Production uses:

- `deploy/docker-compose.yml`
- `deploy/Caddyfile`
- `deploy/web.Dockerfile`
- `deploy/voice.Dockerfile`
- `deploy/.env`
- `deploy/.env.web`
- `deploy/.env.voice`

Example starter files now live in the repo as:

- `deploy/.env.example`
- `deploy/.env.web.example`
- `deploy/.env.voice.example`

Recommended first step on the VPS:

- copy each `*.example` file to its real `deploy/.env*` counterpart and fill in real values

`deploy/.env` holds host-level Compose values such as:

- `WEB_HOST`
- `VOICE_HOST`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

For a clean custom-domain setup, use something like:

- `WEB_HOST=app.yourdomain.com`
- `VOICE_HOST=voice.yourdomain.com`

Then point both DNS records at the VPS IP and let Caddy provision HTTPS automatically.

---

## 3) Required runtime env values

### `deploy/.env.web`

Must contain real values for the web app, including:

- `NEXT_PUBLIC_APP_URL`
- `AUTH_SECRET`
- `RUNTIME_SHARED_SECRET`
- `ANTHROPIC_API_KEY`
- `DEEPGRAM_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `VOICE_PIPELINE_MODE=live`
- `VOICE_STREAM_BASE_URL`
- `VOICE_STREAM_WSS_URL`

Notes:

- `DATABASE_URL` and `DIRECT_URL` are overridden by Compose to point at the internal `postgres` service
- Supabase keys are no longer required for the current production demo path

### `deploy/.env.voice`

Must contain real values for the voice runtime, including:

- `NEXT_PUBLIC_APP_URL`
- `RUNTIME_SHARED_SECRET`
- `VOICE_PIPELINE_MODE=live`
- `DEEPGRAM_API_KEY`
- `ANTHROPIC_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `VOICE_STREAM_BASE_URL`
- `VOICE_STREAM_WSS_URL`
- `VOICE_MODEL`

---

## 4) Deploy or redeploy

From the VPS repo checkout:

1. update the repo
2. confirm `deploy/.env`, `.env.web`, and `.env.voice`
3. run Docker Compose rebuild

Operationally, the stack is brought up with:

- `docker compose up -d --build`

The `web` service automatically runs:

- `npm run db:push -w apps/web`

before starting Next.js, so the schema is applied to the internal Postgres service during boot.

### Repo-local deploy helper

Once SSH access is restored from the development workspace, the repo now also supports a one-command deploy flow:

- `npm run deploy:prod`

Default assumptions:

- VPS host: `84.247.176.111`
- SSH user: `root`
- remote repo path: `/opt/yapsolutely`
- branch: `main`

Supported overrides:

- `YAPS_SSH_SCRIPT` — preferred helper path (for example `/tmp/ssh-vps.sh`)
- `YAPS_SSH_USER`
- `YAPS_SSH_HOST`
- `YAPS_REMOTE_REPO_PATH`
- `YAPS_DEPLOY_BRANCH`
- `YAPS_SKIP_PREFLIGHT=1` to skip the final local preflight step

What the helper does:

1. verifies SSH access
2. fetches and fast-forwards the remote repo to the chosen branch
3. runs `docker compose up -d --build` in `deploy/`
4. prints `docker compose ps`
5. runs `npm run preflight:prod` locally unless explicitly skipped

If SSH credentials are missing, the helper exits early with a clear error instead of half-deploying.

---

## 5) Seed the live demo data

The production seed script is:

- `apps/web/scripts/seed-production.mjs`

The scripted production prompt is:

- `apps/web/prompts/yapsolutely-front-desk.md`

The seed creates or updates:

- demo user
- active agent
- assigned Twilio phone number
- production system prompt

The current seeded defaults are:

- user email: `karim@yapsolutely.ai`
- agent name: `Yapsolutely Front Desk`
- phone number: `+13186108198`

Useful seed envs:

- `SEED_USER_EMAIL`
- `SEED_USER_NAME`
- `SEED_PHONE_NUMBER`
- `SEED_TWILIO_SID`
- `SEED_AGENT_NAME`

---

## 6) Twilio configuration

The current live number should point at:

### Voice webhook

- `https://voice.84.247.176.111.sslip.io/twilio/inbound`

### Status callback

- `https://voice.84.247.176.111.sslip.io/twilio/status`

---

## 7) Health and readiness checks

### Public health endpoints

- `GET /api/health` on web
- `GET /health` on voice

### Secret-gated readiness endpoints

- `GET /api/readiness` with `x-yapsolutely-runtime-secret`
- `GET /readiness` with `x-yapsolutely-runtime-secret`

Success means:

- public web health returns `ok`
- public voice health returns `ok`
- runtime readiness can reach the web app
- web readiness reports no critical missing runtime/deployment values

For a repeatable operator-side check from the repo root, run:

- `YAPS_RUNTIME_SECRET=... npm run preflight:prod`
- `npm run smoke:prod`

Optional overrides:

- `YAPS_WEB_URL`
- `YAPS_VOICE_URL`
- `YAPS_PHONE_NUMBER`
- `YAPS_CALLER_NUMBER`
- `YAPS_SSH_SCRIPT`
- `YAPS_REMOTE_REPO_PATH`

The smoke check additionally verifies that simulated Twilio inbound/status webhooks still create a `Call` row plus `CallEvent` transcript proof in production Postgres.

---

## Optional: Vercel split-hosting mode

The current recommended production path is still **VPS-only** because it keeps the dashboard, voice runtime, and database deployment simpler during final live-call validation.

However, if you want Karim to have a Vercel-hosted dashboard URL, the web app can be deployed separately to Vercel while keeping `voice` and `postgres` on the VPS.

### Suggested split-hosting shape

- `apps/web` → Vercel
- `apps/voice` → VPS
- `postgres` → VPS

### Vercel project settings

- Root directory: `apps/web`
- Framework preset: Next.js
- Install command: default is fine
- Build command: default is fine

### Web env values that must use the split-hosting URLs

- `NEXT_PUBLIC_APP_URL=https://app.yourdomain.com` (or the Vercel URL)
- `VOICE_STREAM_BASE_URL=https://voice.yourdomain.com`
- `VOICE_STREAM_WSS_URL=wss://voice.yourdomain.com/twilio/stream`
- plus all the normal web-side secrets

### What must also change on the VPS voice/runtime side

- `NEXT_PUBLIC_APP_URL` in `deploy/.env.voice` must point at the Vercel-hosted web app URL
- Twilio webhooks should still point to the VPS voice host, not to Vercel

### Recommendation

If the main goal is a cleaner public link, prefer:

1. buy a cheap domain
2. point `app.` and `voice.` subdomains at the VPS
3. keep the current VPS-only production path

That gets you a polished URL without introducing extra deployment moving parts during the final demo hardening phase.

---

## 8) Expected live behavior

For the seeded production path:

1. Twilio hits `/twilio/inbound`
2. runtime resolves `+13186108198` to the seeded agent
3. the TwiML uses `Yapsolutely Front Desk`
4. Twilio stream connects to `/twilio/stream`
5. call start / completion / event records persist into production Postgres

The runtime now keeps the **full agent context server-side** between inbound webhook and media stream start, so Twilio stream parameters stay small while the live session still receives the full prompt/config.

---

## 9) Failure order

If something breaks, check in this order:

1. `docker compose ps`
2. `postgres` healthy state
3. `web` boot logs
4. `voice` boot logs
   - look specifically for `[yapsolutely-runtime]` warnings, which now flag agent-resolution and persistence failures that used to be silent
5. `RUNTIME_SHARED_SECRET` match between web and voice envs
6. Twilio webhook URLs
7. seeded phone number / agent mapping
8. Anthropic / Deepgram / Twilio credential validity

---

## 10) Current definition of deployment success

Production deployment is considered successful when:

1. web health passes publicly
2. voice health passes publicly
3. readiness endpoints work with the runtime secret
4. `+13186108198` resolves to the seeded active agent
5. inbound and status webhooks persist call records/events in production Postgres
6. a real live phone call can be placed and reviewed in the dashboard

Use `docs/demo-handoff.md` as the final operator checklist for the real-call and Loom steps that cannot be automated from the repo alone.
