# Yapsolutely

Retell-inspired AI voice agent platform being built in GitHub Codespaces.

## What this repo contains

Yapsolutely is split into two application surfaces:

- `apps/web` — Next.js dashboard for agents, numbers, calls, transcripts, and readiness
- `apps/voice` — Node.js voice runtime for Twilio webhooks, media streams, and live/mock call orchestration

## Source of truth

Use `plan/masterplan.md` as the canonical source of truth for execution status, objectives, and sequencing.

## Quick start

1. Copy `.env.example` to `.env` and fill in real provider credentials.
2. Install dependencies from the repo root.
3. Start the dashboard and voice runtime in separate terminals.

Useful workspace scripts:

- `npm run dev:web` — start the Next.js dashboard
- `npm run dev:voice` — start the voice runtime
- `npm run lint` — lint the web app
- `npm run build` — build the web app
- `npm run check` — lint, then build

Default local URLs:

- Web app: `http://localhost:3000`
- Voice runtime: `http://localhost:3001`
- Twilio media stream websocket: `ws://localhost:3001/twilio/stream`

## Operational docs

Use these docs during the credential and deployment phase:

- `docs/credentials-setup.md` — how to collect required credentials and what they cost
- `docs/deployment-runbook.md` — step-by-step deploy and environment wiring guide
- `docs/live-validation-checklist.md` — post-deploy live call validation checklist
- `docs/demo-handoff.md` — operator-facing real-call, dashboard, and Loom walkthrough

## Production preflight

Before placing a real call, run the production preflight against the live stack:

- `YAPS_RUNTIME_SECRET=... npm run preflight:prod`

For a webhook-and-persistence smoke test against production:

- `npm run smoke:prod`

Optional overrides:

- `YAPS_WEB_URL`
- `YAPS_VOICE_URL`
- `YAPS_PHONE_NUMBER`
- `YAPS_CALLER_NUMBER`
- `YAPS_SSH_SCRIPT`
- `YAPS_REMOTE_REPO_PATH`

By default the script targets the current live MVP hosts and seeded number.

## Current repo shape

- `plan/` — planning documents and canonical master plan
- `apps/web` — Next.js dashboard app
- `apps/voice` — voice runtime workspace
- `docs/` — deployment, credential, and validation references
- `.github/copilot-instructions.md` — workspace development guidance

## Current status

Implementation has moved well past the initial scaffold and now includes:

- architecture baseline frozen
- monorepo workspace initialized
- web app scaffold created
- voice runtime scaffold created
- root environment contract added
- branded dashboard shell routes added in `apps/web`
- cookie-based demo auth protects dashboard routes
- Prisma schema, generated client, and initial SQL migration added in `apps/web/prisma`
- agent CRUD and archival flows
- manual phone number registration and assignment
- secure runtime agent-resolution API
- runtime call lifecycle and transcript event APIs
- persisted call detail and transcript review UI
- Twilio `<Connect><Stream>` TwiML and websocket media handling
- mock and live pipeline modes in the voice runtime
- in-app web and runtime readiness/health reporting

## Suggested developer flow

- Use `plan/masterplan.md` to see the next incomplete critical-path objective.
- Use the settings screen in `apps/web` to confirm readiness before live validation.
- Run `npm run preflight:prod` before the final human phone test and Loom capture.
- Run `npm run smoke:prod` when you want repeatable proof that simulated inbound/status webhooks still persist call rows and transcript events in production.
- Keep secrets in `.env` locally and in host environment-variable dashboards in production.
- Treat `credentials/` as local sensitive scratch space only; it is ignored from git.

## Deployment target

Current live MVP hosting:

- single Ubuntu VPS
- Docker Compose
- Caddy for HTTPS
- internal Postgres for the live demo database

Current public hosts:

- `https://web.84.247.176.111.sslip.io`
- `https://voice.84.247.176.111.sslip.io`

The active production path no longer depends on Vercel/Railway/Supabase for the live demo stack.