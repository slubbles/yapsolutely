# Yapsolutely demo handoff

This is the operator-facing guide for the **last mile** of Objective 14.

Use it after deploy, seed, and readiness checks are green.

---

## What is already automated

The repo can already verify these items without a human call:

- public web health
- public voice health
- secret-gated web readiness
- secret-gated voice readiness
- runtime number-to-agent resolution for the seeded production number

Run this first from the repo root:

- `YAPS_RUNTIME_SECRET=... npm run preflight:prod`

If that passes, the remaining work is **human validation**, not infrastructure guessing.

---

## Human-only steps

These are the remaining actions that cannot be fully executed from this environment:

1. place a **real phone call** to the live Twilio number
2. listen to actual greeting quality, latency, and turn-taking on a handset
3. intentionally interrupt/barge in and judge whether the interaction still feels natural
4. confirm any real SMS arrives on the physical device if that flow is tested
5. record the final Loom or live walkthrough

Current seeded production number:

- `+13186108198`

---

## Recommended call script

Use this script so the validation covers both the happy path and the risky path.

### Call 1 — baseline conversation

Goal: confirm the live pipeline responds end to end.

Suggested prompts:

1. “Hi, I’m Karim. What can you help me with?”
2. “I want to book a demo for next week.”
3. “My email is karim@yapsolutely.ai.”
4. “Can you summarize what you captured?”

Pass signals:

- greeting plays clearly
- first reply feels natural enough for demo use
- the agent stays in role
- transcript appears in the dashboard

### Call 2 — interruption / barge-in

Goal: test the highest-risk runtime behavior.

Suggested prompts:

1. ask a question that will cause a longer reply
2. interrupt the agent mid-sentence with “Sorry to cut in — can you keep it shorter?”
3. ask a follow-up immediately

Pass signals:

- audio does not become hopelessly garbled
- the agent stops or recovers reasonably
- the next turn is still coherent

### Call 3 — tool-ish flow

Goal: exercise lead capture / confirmation style behavior.

Suggested prompts:

1. provide name
2. provide email
3. provide desired date/time
4. ask whether a confirmation will be sent

Pass signals:

- tool events appear in call detail if the prompt routes there
- captured metadata looks reasonable
- call closes gracefully

---

## Dashboard verification immediately after each call

In `Calls`:

- confirm a new call row appears
- confirm status and duration look sane
- confirm caller number is present

In call detail:

- confirm transcript timeline is populated
- confirm agent and user events are interleaved correctly
- confirm system/tool events appear when relevant
- confirm summary/metadata do not look empty or corrupted

---

## Loom walkthrough outline

Keep the Loom to roughly 2–3 minutes.

### Segment 1 — readiness proof

- show the settings/readiness screen or mention that `npm run preflight:prod` passes
- show the seeded number or assigned agent

### Segment 2 — live call proof

- place the call to `+13186108198`
- let the greeting play
- ask at least two real questions
- optionally demonstrate a brief interruption

### Segment 3 — transcript proof

- return to the dashboard
- open the new call record
- show transcript events and any captured details

### Segment 4 — close

- restate that the system supports agent config, number routing, live AI conversation, and persisted call review end to end

---

## If the live call fails

Check these in order:

1. `npm run preflight:prod`
2. `docs/live-validation-checklist.md`
3. `docs/deployment-runbook.md`

Common interpretations:

- preflight fails before the call → environment or routing problem
- preflight passes but no call record appears → Twilio webhook/config problem
- call record appears but no transcript → STT/media-stream/runtime issue
- transcript exists but audio sounds broken → TTS or barge-in quality issue

---

## Current honest blocker line

As of this handoff state, the repo is prepared through automated readiness and seeded production routing.

The remaining blocker is **not code scaffolding**.

It is the final human validation step:

- a real handset phone call
- subjective audio/latency judgment
- final Loom capture