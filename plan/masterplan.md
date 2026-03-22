# Yapsolutely Master Plan

## Canonical usage

This document is the **canonical source of truth** for the project during execution.

It exists for both:

- **you** — so you can always see where the project stands
- **the implementation agent** — so development can continue against a stable reference and reduce drift, re-planning, and hallucinated direction changes

### Rules for using this plan

1. If implementation details conflict with this document, this document wins until explicitly updated.
2. New ideas are welcome, but they do **not** replace the plan unless they are written back here.
3. Progress should be tracked against the numbered objectives and milestone groups in this file.
4. If scope changes, the change must be categorized as one of:
  - MVP scope
  - Phase 2 scope
  - nice-to-have / optional
5. During implementation, this document should be treated as the reference point for:
  - what we are building
  - what we are not building yet
  - what “done” means

---

## Project intent

Build `Yapsolutely`, a Retell-inspired AI voice agent platform that proves high-level execution for Karim while also becoming a reusable product foundation for future commercialization.

The goal is **not** to literally rebuild every enterprise Retell feature at once. The goal is to ship a strong, defensible product core that demonstrates:

- real-time inbound AI phone conversations
- configurable agents
- phone number assignment
- transcript and call logging
- a polished dashboard experience
- a clear path toward Yapsolutely-specific improvements

---

## Current stage

**Current phase:** Implementation / Milestone C-D transition

**Readiness for execution:** In execution — initial scaffolding is active and the foundation is being assembled

### What is already done

- product direction is defined: Retell-like AI voice agent platform
- core architecture is understood: dashboard + separate voice runtime
- execution shortcut is chosen: reuse proven infrastructure where smart
- likely foundations identified:
  - `twilio-labs/call-gpt` for voice runtime concepts/base
  - SaaS starter approach for dashboard shell
- MVP scope is broadly known
- differentiator is clear:
  - drag-and-drop flow builder
  - AI-generated system prompt from flow blocks
- root monorepo workspace exists
- `apps/web` has been scaffolded with Next.js App Router + TypeScript + Tailwind CSS
- `apps/voice` now exists as an initial runtime scaffold
- root `.env` and `.env.example` define the first environment contract
- cookie-based demo auth now protects dashboard routes during Milestone A
- Prisma schema, client setup, and initial SQL migration snapshot now exist in `apps/web`
- dashboard shell now includes landing, sign-in, sign-up, dashboard, agents, create-agent, agent detail, calls, call detail, and settings routes
- the create-agent screen now posts through a real server action and the agents area can read agent data through Prisma when the database is configured
- the agent detail screen now supports editing agent configuration and saving the first number-to-agent assignment hook through a server action
- the agent detail screen now clearly shows assigned phone numbers so routing is visible in the dashboard
- a dedicated `/numbers` screen now supports manual phone-number registration and assignment to agents
- a secure runtime-facing resolve-agent API now exists for inbound number lookup
- runtime-facing APIs now exist to persist call start and completion metadata from the voice service
- the voice runtime now attempts secure agent resolution on inbound calls and writes the first call metadata records back to the web app
- runtime-facing APIs now exist to persist transcript/timeline events into `CallEvent`
- the call detail screen now loads real metadata and transcript events from persisted call records
- the voice runtime now exposes a Twilio-compatible WebSocket stream endpoint and generates `<Connect><Stream>` TwiML for inbound calls
- the voice runtime now has a modular session store and mock conversation engine that turns stream events into structured transcript activity
- the voice runtime now carries richer agent and number metadata into each stream session and maps Twilio completion outcomes into more accurate call statuses
- the voice runtime now includes a provider-backed Deepgram STT/TTS + Anthropic response path behind `VOICE_PIPELINE_MODE=live`, with basic queueing and stream-clearing barge-in handling
- the live runtime now has an initial tool interface with structured lead capture, SMS confirmation, graceful call end hooks, and tool-event logging into the call timeline
- the calls experience now includes server-side search/status filtering plus dedicated loading and error states for the calls list and call detail routes
- the call detail experience now surfaces runtime action outcomes, structured lead capture details, and richer event metadata so transcript review is more useful after live calls
- the live runtime now keeps outbound playback active until Twilio acknowledges the response mark, which makes graceful end-call actions line up with actual playback completion and improves interruption handling fidelity
- the dashboard now surfaces user-scoped call and tool-action proof, including recent calls, recent runtime actions, and stronger persisted metrics beyond the original headline cards
- the data-backed agent and number workflows now include stronger CRUD validation, including duplicate/ownership checks, agent archival, and phone-number removal controls
- the settings area now reports environment readiness directly in-app, showing which provider, database, deployment, and security values are configured versus still missing before live validation
- credential collection, deployment, and live-validation runbooks now exist under `docs/`, so the final environment-wiring and go-live steps are documented before secrets arrive
- the settings area now also probes voice runtime reachability, so readiness reporting can distinguish missing credentials from an unreachable deployed runtime
- the web app now exposes a fast `/api/health` endpoint plus a gated `/api/readiness` endpoint, making deploy verification and environment checks scriptable beyond the dashboard UI
- the voice runtime now exposes a gated `/readiness` endpoint that reports runtime config status and probes the web app health/readiness endpoints, making cross-service deploy checks scriptable from both sides
- the settings area now also surfaces the voice runtime readiness verdict, runtime-missing keys, and runtime-to-web probe results, so deployment status can be reviewed from one in-app screen
- production now runs on the VPS with `web`, `voice`, and an internal `postgres` service under Docker Compose + Caddy because the prior Supabase direct Postgres path was unreachable from the host
- the live production database now contains a seeded Karim demo user, active agent, and Twilio number assignment so inbound call resolution works end to end in production
- the first-run auth funnel now uses email-verification UX instead of SMS verification, matching the current website-first build priority while provider-backed auth is still being wired

### What is not done yet

- voice engine integration
- full authentication implementation
- full data-backed dashboard workflows
- testing setup
- deployment setup

---

## Execution philosophy

**Reuse infrastructure. Own the product.**

We will not waste time rebuilding commodity plumbing from zero.
We will own the parts that create real product value:

- product architecture
- dashboard UX
- agent workflow
- data model
- number-to-agent mapping
- call logging and transcript experience
- prompt generation workflow
- visual identity and design system

---

## Plan confidence assessment

### Is this plan enough to finish the project end to end?

**Yes — for MVP and the Karim proof-of-execution goal, this plan is sufficient as an execution reference.**

It is sufficient because it covers:

- project intent
- architecture direction
- delivery boundaries
- numbered objectives
- per-objective task lists
- finish conditions
- milestone sequencing
- current status tracking

### What this plan is and is not

This plan **is**:

- enough to guide end-to-end MVP delivery
- enough to keep implementation aligned across sessions
- enough to reduce drift during build
- enough to tell us exactly where we are in the process

This plan is **not**:

- a guarantee that no implementation decisions will change
- a substitute for real testing and validation
- a fully locked enterprise roadmap for all Retell parity features

So the right statement is:

> This plan is sufficient for building the MVP end to end, as long as we keep it updated whenever we make meaningful scope or architecture decisions.

---

## Frozen decisions for MVP

These decisions are now the default execution baseline unless explicitly revised.

### Product scope

- Build a **Retell-inspired** product, not literal full enterprise feature parity in MVP
- Prioritize **inbound calling** first
- Prioritize **real working demo quality** over broad feature count
- Keep advanced enterprise features in Phase 2 unless Karim explicitly reprioritizes them

### Architecture

- Use a **web dashboard** and a **separate voice runtime**
- Keep the voice runtime separate from the Next.js app due to long-lived realtime connections
- Treat the voice runtime as reusable infrastructure and the dashboard/product layer as custom product work

### Product priorities

- First ship the real phone-call core
- Then ship logs/transcripts and proof of execution
- Then ship differentiation layers like browser testing and flow builder

### UI strategy

- Use `shadcn/ui` initially for speed
- Do **not** treat starter visuals as final
- Evolve into a custom Yapsolutely design system after functionality stabilizes
- Treat `plan/ui-masterplan.md` as the canonical source of truth for UI vision, design-system rules, page inventory, and UI execution sequencing

### Multi-tenancy strategy

- MVP may use the simpler credential model if needed for speed
- architecture must remain compatible with future BYO-Twilio / multi-tenant growth

### Exact implementation baseline

The current execution baseline for Milestone A is:

- **Repository layout:** npm workspaces monorepo
- **Web app location:** `apps/web`
- **Voice runtime location:** `apps/voice`
- **Web framework:** Next.js App Router + TypeScript + Tailwind CSS
- **UI scaffold:** `shadcn/ui`-style component approach, treated as temporary scaffold
- **Voice runtime direction:** Node.js runtime prepared for adaptation from `call-gpt` concepts/base
- **Database direction:** Prisma on Postgres, with the current production deployment using an internal VPS Postgres service after the prior Supabase direct-connect path proved unreachable from the host
- **Deployment target:** single Ubuntu VPS running Docker Compose + Caddy, serving both web and voice services with public HTTPS hosts
- **Source of truth for sequencing:** this master plan

This baseline is now the active default unless explicitly revised.

---

## Assumptions

This plan assumes the following unless updated:

- Karim primarily cares about **results and demonstrable functionality**
- a working demo is more important than building every feature from scratch
- reuse of proven infrastructure is acceptable if the product layer is clearly owned and understood
- Twilio, STT, TTS, and LLM services will be available during execution and testing
- the first meaningful finish line is **MVP demo success**, not enterprise completeness

---

## Non-goals for MVP

To avoid hidden scope creep, the following are explicitly **not required** for MVP unless re-approved:

- full Retell enterprise parity
- comprehensive outbound campaigns
- advanced QA scoring
- complete CRM matrix support
- compliance certification work
- deep analytics suite
- white-labeling
- advanced orchestration for many tenants

---

## Non-negotiable MVP finish line

The MVP is only considered truly successful if a user can:

1. sign up or log in
2. create an agent
3. configure its prompt / voice / first message
4. assign a phone number to that agent
5. call the number and have a real AI conversation
6. hang up and see the call reflected in logs/transcripts

If those six things work reliably, the project has reached the core Karim-proof objective.

---

## Critical path

The real critical path is narrower than the full objective list.

### Critical path objectives

- Objective 1 — Lock implementation architecture
- Objective 2 — Establish repository structure
- Objective 3 — Scaffold dashboard shell
- Objective 4 — Implement data model
- Objective 5 — Build agent management workflow
- Objective 6 — Implement phone number provisioning and mapping
- Objective 7 — Adapt voice runtime
- Objective 8 — Connect runtime to product data
- Objective 9 — Build calls and transcript experience
- Objective 14 — Deployment and demo readiness

If these are complete, the MVP can be demonstrated.

Objectives 10, 11, 12, and 13 improve the product significantly, but are not allowed to block the core demo.

---

## Risk register

## High-risk areas

### 1. Voice runtime latency

Risk:
- AI feels slow or unnatural

Mitigation:
- preserve streaming behavior
- keep replies concise
- prefer faster TTS/STT settings where needed
- validate early with real calls

### 2. Interruption handling

Risk:
- callers talk over the agent and the experience breaks

Mitigation:
- keep interruption handling as a top runtime requirement
- test barge-in early, not at the end

### 3. Twilio/runtime/data integration

Risk:
- live call works, but agent lookup/logging breaks

Mitigation:
- implement number-to-agent mapping before deeper polish
- validate the full call lifecycle in one environment

### 4. Scope creep

Risk:
- drag-and-drop builder, browser testing, and custom UI delay the core demo

Mitigation:
- protect the critical path
- keep differentiation features after the core live-call proof

### 5. Template lock-in / generic UI feel

Risk:
- product looks like a starter kit

Mitigation:
- treat starter components as temporary scaffolding only
- schedule a deliberate design-system pass after core functionality

---

## Change-control rules

To keep execution stable, use these rules when new ideas come up:

### A change can be accepted immediately if:

- it reduces complexity
- it reduces risk on the critical path
- it does not expand MVP scope
- it improves demo reliability

### A change must be written back into this plan before adoption if:

- it changes architecture
- it adds a new objective
- it changes milestone order
- it changes what “done” means
- it promotes a Phase 2 feature into MVP

### A change should be deferred if:

- it mostly affects polish while core runtime is unfinished
- it introduces new vendors without strong reason
- it delays the call → response → transcript demo path

---

## Progress update protocol

During implementation, updates should always answer these four things:

1. **What objective is being worked on now?**
2. **What changed since the last checkpoint?**
3. **What is blocked, if anything?**
4. **What is the next immediate task?**

This makes the plan usable as an actual operating system for the build.

---

## Reference mode for future sessions

When resuming work later, use this document in the following order:

1. read `Current stage`
2. read `Frozen decisions for MVP`
3. read `Critical path`
4. read `Development process status board`
5. continue from the earliest incomplete critical-path objective

This is the intended anti-drift workflow.

---

## Master objectives

## Objective 1 — Lock implementation architecture

**Goal:** Finalize the exact execution model before scaffolding.

### Tasks

- [x] Confirm monorepo structure
- [x] Decide exact dashboard starter approach
- [x] Decide exact voice runtime base approach
- [x] Decide database strategy for MVP
- [x] Decide hosting model for web and voice runtime
- [x] Define integration boundary between web app and voice engine
- [x] Define environment variable inventory

### Definition of done

We have one written architecture choice with no ambiguity about:
- folders
- services
- runtime boundaries
- deployment targets

---

## Objective 2 — Establish repository structure

**Goal:** Turn the empty planning repo into an execution-ready workspace.

### Tasks

- [x] Create top-level app structure
- [x] Create `apps/web`
- [x] Create `apps/voice` or equivalent runtime folder
- [x] Create shared docs/config directories if needed
- [x] Add root README execution notes
- [x] Add root workspace scripts if using a monorepo tool

### Definition of done

The repo clearly reflects the architecture and is ready for implementation.

---

## Objective 3 — Scaffold the dashboard product shell

**Goal:** Get a working authenticated web app with a usable dashboard shell.

### Tasks

- [x] Initialize Next.js app
- [x] Set up TypeScript and Tailwind
- [x] Set up auth
- [x] Set up base layout and navigation
- [x] Add dashboard shell pages
- [x] Add reusable UI/component primitives
- [x] Keep styling fast with shadcn/ui initially

### Initial pages

- [x] Landing page
- [x] Sign up / sign in
- [x] Dashboard home
- [x] Agents list
- [x] Create agent
- [x] Agent detail
- [x] Calls list
- [x] Call detail
- [x] Settings

### Definition of done

A user can sign in and navigate a believable product shell.

---

## Objective 4 — Define and implement data model

**Goal:** Create the persistence layer that powers agents, numbers, and calls.

### Tasks

- [x] Define users schema
- [x] Define agents schema
- [x] Define phone numbers schema
- [x] Define calls schema
- [x] Define transcript storage format
- [x] Define future-proof settings fields
- [x] Create migrations/schema files
- [ ] Validate CRUD assumptions with pages and APIs

### Core MVP entities

- `users`
- `agents`
- `phone_numbers`
- `calls`
- `call_events` or transcript JSON

### Definition of done

The DB can store the complete end-to-end agent and call lifecycle for MVP.

---

## Objective 5 — Build agent management workflow

**Goal:** Let a user create and manage voice agents from the dashboard.

### Tasks

- [x] Create agent list page
- [x] Create create-agent flow
- [x] Add edit agent flow
- [x] Add agent activation toggle
- [x] Add system prompt field
- [x] Add first message field
- [x] Add voice selection field
- [x] Save and load agent configuration

### Definition of done

A user can create an agent and view/edit its configuration successfully.

---

## Objective 6 — Implement phone number provisioning and mapping

**Goal:** Connect Twilio numbers to agents.

### Tasks

- [ ] Wire Twilio credentials for MVP
- [x] Add number purchase / assignment flow
- [x] Save purchased number in DB
- [x] Map number to agent
- [x] Display assigned number in agent detail
- [ ] Design for future BYO-Twilio support

### Definition of done

Each agent can own a phone number, and incoming calls can resolve to the correct agent.

---

## Objective 7 — Adapt the voice runtime

**Goal:** Stand up the real-time AI calling engine.

### Tasks

- [ ] Bring in the chosen voice runtime base
- [ ] Replace demo prompt/persona logic
- [ ] Replace demo tool calls with Yapsolutely tools
- [ ] Replace or adapt OpenAI usage to Claude if needed
- [ ] Preserve interruption handling
- [ ] Preserve low-latency streaming behavior
- [x] Add agent lookup by called number
- [x] Add first-message support per agent

### Required runtime behavior

- [x] Twilio inbound webhook works
- [x] WebSocket stream receives audio
- [ ] STT returns caller text
- [x] LLM generates reply
- [ ] TTS returns playable audio
- [x] caller hears response
- [ ] interruptions are handled

### Definition of done

A real inbound phone call can converse with the configured agent.

---

## Objective 8 — Connect runtime to product data

**Goal:** Make the voice engine use dashboard-created agents and persist results back to the app.

### Tasks

- [x] Load agent config by called number
- [x] Pass system prompt to runtime
- [x] Pass voice choice to runtime
- [x] Pass first message to runtime
- [x] Persist call start/end metadata
- [x] Persist transcript
- [x] Persist call status and duration
- [x] Handle failed calls gracefully

### Definition of done

Dashboard-created data actively powers the live call experience and receives call results back.

---

## Objective 9 — Build calls and transcript experience

**Goal:** Surface proof of execution in the dashboard.

### Tasks

- [x] Build calls list page
- [x] Show status, time, duration, caller number
- [x] Build transcript detail page
- [x] Render transcript clearly by speaker
- [x] Add empty, loading, and error states
- [x] Add optional filters/search if time permits

### Definition of done

After a call, the transcript and call log are visible and useful in the UI.

---

## Objective 10 — Add business actions/tools

**Goal:** Make the agent do more than just talk.

### MVP tool candidates

- [ ] send SMS confirmation
- [ ] create calendar event
- [ ] basic lead capture into DB
- [ ] transfer to human
- [ ] graceful call end

### Tasks

- [x] Define tool interface for runtime
- [x] Implement one or two real tools first
- [x] Log tool usage in calls/transcript flow
- [x] Add safe fallbacks for failure cases

### Definition of done

At least one real behind-the-scenes business action works during or after a call.

---

## Objective 11 — Add browser-based test experience

**Goal:** Reduce cost and friction for testing.

### Tasks

- [x] Decide whether browser test uses same runtime or a parallel path
- [x] Build test UI page
- [ ] Add mic permissions flow
- [ ] Send user audio to runtime
- [ ] Play AI audio back in browser
- [ ] Reuse transcript and turn handling where possible

### Definition of done

A user can test an agent from the dashboard without making a phone call.

---

## Objective 12 — Build Yapsolutely differentiator: flow builder

**Goal:** Make agent creation easier and more original than a plain prompt box.

### Tasks

- [ ] Define initial block types
- [ ] Build drag-and-drop canvas/list experience
- [ ] Add editable fields per block
- [ ] Serialize flow into structured JSON
- [ ] Create “Generate System Prompt” action
- [ ] Feed flow JSON into Claude prompt-generation endpoint
- [ ] Write generated prompt back into agent config

### Suggested initial blocks

- [ ] Greet
- [ ] Qualify
- [ ] FAQ
- [ ] Book appointment
- [ ] Transfer to human
- [ ] Close call
- [ ] Custom instruction

### Definition of done

A user can visually define a flow and generate a usable system prompt from it.

---

## Objective 13 — Visual design evolution

**Goal:** Avoid permanent “starter template” look.

### Phase 1 — Fast UI

- [ ] use shadcn/ui to move quickly
- [ ] avoid design overwork before functionality exists

### Phase 2 — Yapsolutely design system

- [ ] choose brand direction
- [ ] choose fonts
- [ ] define color tokens
- [ ] define radii, shadows, spacing
- [ ] restyle core components
- [ ] redesign landing page and dashboard chrome
- [ ] ensure everything remains editable and maintainable

### Planning note

The design-planning source of truth for this objective now lives in `plan/ui-masterplan.md`, including:

- creative north star
- image fidelity guardrails
- page archetypes
- design-system rules
- UI execution order
- locked font direction (`General Sans` + `Satoshi`)
- locked editorial card language for image-overlay CTA panels and premium rounded surfaces

### Definition of done

The app no longer looks like a generic starter and has a distinctive Yapsolutely identity.

---

## Objective 14 — Deployment and demo readiness

**Goal:** Produce a stable demo environment for Karim.

### Tasks

- [x] Deploy web app
- [x] Deploy voice runtime
- [x] Set production environment variables
- [x] Configure Twilio webhook to production URL
- [ ] Verify one live agent end-to-end
- [x] Verify transcript persistence in production
- [ ] Record Loom/demo walkthrough
- [x] Write setup / handoff notes

### Definition of done

Karim can see and experience the full workflow end-to-end.

---

## Objective 15 — Post-MVP / Phase 2 roadmap

**Goal:** Keep the bigger vision visible without bloating MVP.

### Phase 2 candidates

- [ ] outbound calling
- [ ] knowledge base / RAG
- [ ] CRM integrations
- [ ] multi-tenant BYO-Twilio
- [ ] analytics and QA scoring
- [ ] multilingual support
- [ ] advanced routing
- [ ] payment link / transaction workflows
- [ ] white-label support

---

## Suggested execution order

1. Objective 1 — Lock implementation architecture
2. Objective 2 — Establish repository structure
3. Objective 3 — Scaffold dashboard shell
4. Objective 4 — Implement data model
5. Objective 5 — Build agent management workflow
6. Objective 7 — Adapt voice runtime
7. Objective 6 — Implement phone number provisioning and mapping
8. Objective 8 — Connect runtime to product data
9. Objective 9 — Build calls and transcript experience
10. Objective 10 — Add business actions/tools
11. Objective 14 — Deployment and demo readiness
12. Objective 11 — Browser-based test experience
13. Objective 12 — Flow builder
14. Objective 13 — Visual design evolution
15. Objective 15 — Phase 2 roadmap

---

## Recommended milestone grouping

## Milestone A — Execution-ready foundation

Includes:
- Objective 1
- Objective 2
- Objective 3
- Objective 4

**Outcome:** repo, app shell, auth, DB, and architecture are in place.

## Milestone B — Live agent creation

Includes:
- Objective 5
- Objective 6

**Outcome:** users can create agents and assign numbers.

## Milestone C — Real phone conversation

Includes:
- Objective 7
- Objective 8

**Outcome:** live inbound calls work using dashboard-created agents.

## Milestone D — Proof and polish

Includes:
- Objective 9
- Objective 10
- Objective 14

**Outcome:** call logs, transcripts, at least one business action, deployed demo.

## Milestone E — Product differentiation

Includes:
- Objective 11
- Objective 12
- Objective 13

**Outcome:** easier testing, better UX, Yapsolutely identity.

---

## Development process status board

## Status legend

- `not started`
- `planning complete`
- `in progress`
- `blocked`
- `done`

| Objective | Status | Notes |
|---|---|---|
| 1. Lock implementation architecture | done | baseline choices frozen in master plan and repo instructions |
| 2. Establish repository structure | done | workspace, web app, voice runtime scaffold, env files, and root scripts now exist |
| 3. Scaffold dashboard shell | done | branded shell, cookie-based demo auth, stronger Prisma-backed proof surfaces, in-app credential readiness reporting, 7-day call volume bar chart, metric cards, recent calls list, call summary, and quick actions now exist; settings page save now persists display name to session and database |
| 4. Implement data model | in progress | Prisma schema, client, migration, and stronger CRUD validation now exist; final end-to-end verification still pending |
| 5. Build agent management workflow | done | create/list/edit/detail/archive flows work through Prisma-backed server components and actions with pause/resume toggle and duplicate action; full Lovable UI replacement complete; agent list has real-time search and status filter (All/Active/Paused/Draft); new agent creation includes template picker with 6 pre-built templates; PromptComposer uses real LLM for AI-powered prompt generation with local fallback |
| 6. Phone provisioning and mapping | in progress | manual registration with agent-assignment dialog, persistence, runtime lookup, assigned-number visibility, removal controls, inline agent reassignment (click-to-change), and per-row delete now exist; Twilio credential wiring still pending |
| 7. Adapt voice runtime | in progress | inbound webhook, stream TwiML, websocket media path, mock fallback, provider-backed live STT/TTS/LLM path, and mark-aware playback completion now exist; end-to-end Twilio validation under real audio is still pending |
| 8. Connect runtime to product data | in progress | secure agent lookup, richer stream-session config, and start/end/event persistence are wired; live provider path now consumes passed voice config but still needs full call validation |
| 9. Calls and transcript experience | done | calls list/detail are live with filter/search, status filter buttons (All/Completed/In progress/Failed), CSV export, loading/error UX, richer transcript review, surfaced tool outcomes, and full Lovable UI wiring |
| 10. Business actions/tools | in progress | runtime tool interface now exists with lead capture, SMS confirmation, graceful end-call hooks, and logged tool events |
| 11. Browser-based test experience | in progress | text-based chat test UI is live at `/agents/[agentId]/test`, proxied through `/api/runtime/chat` to the voice runtime's new `/chat` endpoint; voice-mode mic/speaker capture is the remaining enhancement |
| 12. Flow builder | in progress | MVP flow builder live at `/agents/[agentId]/flow` with 7 block types (Greet, Qualify, FAQ, Book Appointment, Transfer, Close Call, Custom), reorderable block list, field editing, flow persistence to agent config JSON, prompt generation from flow (LLM-backed with local fallback), and apply-to-agent action; drag-and-drop reordering and additional block types are future enhancements |
| 13. Visual design evolution | done | Lovable-designed Yapsolutely Voice Studio UI fully integrated — 49 shadcn components, custom dashboard layout, branded landing page, General Sans + Satoshi fonts, all pages wired to backend data with loading/error states |
| 14. Deployment and demo readiness | in progress | web + voice are deployed to the VPS behind Caddy, production Postgres is live in the stack, the Twilio voice webhook is configured, seeded agent/number resolution works publicly, automated preflight + smoke scripts now verify readiness and simulated transcript persistence, and operator-facing handoff docs now exist; remaining work is final real-call validation plus Loom proof, with that live-call pass currently waiting on Karim’s upgraded Twilio account |
| 15. Phase 2 roadmap | planning complete | known at high level |

---

## Where we are right now

If we speak plainly:

- **Planning maturity:** high
- **Architecture understanding:** high
- **Execution readiness:** high for continued product/runtime iteration
- **Implementation progress:** Milestone C is substantially assembled in code and Milestone D proof surfaces are now active

So the honest answer is:

> We are past the initial scaffold stage: the dashboard, persistence layer, runtime contracts, live provider path, tool hooks, and transcript review surfaces now exist, but the remaining high-risk work is real end-to-end live-call validation and deployment/demo hardening.

Right now the practical blocker is external, not architectural:

> the final real-call proof should wait for Karim’s upgraded Twilio account, so the highest-value work until then is continuing to finish and polish the website, onboarding, and operator-facing product surfaces.

---

## Recommended immediate next step

Start with **Milestone A** and do these exact next actions:

1. complete the repo structure
2. begin schema files and data layer foundation
3. continue dashboard foundation work
4. begin voice core foundation work
5. add authentication baseline

That work is now underway:

- repo structure is complete
- dashboard auth baseline exists
- Prisma data model foundation exists

So the next immediate execution move is:

> wire the first real CRUD flows for agents on top of the new Prisma foundation, then start connecting the voice runtime to product data contracts.

That agent CRUD work has now started, so the next immediate task is:

> add edit/update behavior for agents and begin number-mapping data hooks so the voice runtime can resolve an inbound number to an agent.

That work is now in place, so the next immediate task is:

> start the phone-number provisioning/mapping workflow proper and add runtime-facing lookup helpers that resolve an inbound number to the assigned agent configuration.

That work is now underway, so the next immediate task is:

> connect the voice runtime to the secure resolve-agent contract during inbound call handling, then begin persisting call metadata against the assigned agent.

That work is now underway, so the next immediate task is:

> expand the runtime from greeting-only behavior into a real streaming conversation path and begin writing transcript events back into `CallEvent` / `Call.transcriptText`.

That event persistence work is now in place, so the next immediate task is:

> replace the placeholder TwiML-only runtime behavior with the real streaming voice path while reusing the new lookup, call persistence, and transcript event contracts.

That streaming scaffold work is now in place, so the next immediate task is:

> attach real STT, LLM, and TTS processing to the live media stream path and start handling interruption/barge-in behavior.

The mock session engine is now in place, so the next immediate task is:

> replace the mock transcript/reply generation with real STT + TTS providers and begin handling barge-in / interruption flow on the stream path.

The runtime/data contract is now richer, the live provider path exists in code, tool hooks are wired, the transcript review surface exposes tool outcomes more clearly, and playback completion now waits for Twilio mark acknowledgements, so the next immediate task is:

> continue finishing high-leverage website and onboarding surfaces while Karim reviews the product, then validate the Deepgram + Anthropic stream path plus runtime tools end to end on a real Twilio media stream once the upgraded Twilio account is available.

---

## Suggested next command from a planning perspective

The next practical move is:

> create the actual project structure and begin Milestone A

That is the transition from planning to execution.
