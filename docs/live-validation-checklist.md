# Yapsolutely live validation checklist

Use this after deployment and seed/setup are complete.

---

## Goal

Prove the MVP finish line end to end:

1. agent exists
2. number is assigned
3. real inbound call reaches runtime
4. AI conversation happens
5. call is persisted
6. transcript/tool actions appear in the dashboard

---

## 1) Pre-call checklist

Before placing a live call, confirm:

- `YAPS_RUNTIME_SECRET=... npm run preflight:prod` passes
- `npm run smoke:prod` passes if VPS SSH access is available
- the production seed exists or equivalent dashboard records exist
- the target agent has:
  - system prompt
  - first message
  - voice model
  - `status=ACTIVE`
  - `isActive=true`
- the Twilio number exists in production Postgres
- that number resolves to the intended agent
- settings page shows no critical missing env values
- voice runtime `/health` is passing publicly
- voice runtime `/readiness` passes with `x-yapsolutely-runtime-secret`
- web `/api/readiness` passes with `x-yapsolutely-runtime-secret`
- `VOICE_PIPELINE_MODE=live`

---

## 2) Inbound call test

Place a real call to the purchased Twilio number.

Current seeded production number:

- `+13186108198`

### Expected behavior

- Twilio hits `/twilio/inbound`
- runtime resolves the number to the assigned agent
- greeting/first message plays
- caller speech is transcribed
- Anthropic generates response
- Deepgram TTS audio is returned
- caller hears the response
- barge-in/interruption does not completely break the flow
- call start + status + event records land in production Postgres

---

## 3) Dashboard verification

Immediately after or during the call, verify:

### Calls list

- a new call record appears
- status looks reasonable
- caller number appears
- time appears
- transcript preview appears

### Call detail

- transcript timeline is populated
- user and agent events are visible
- system events are visible
- tool actions are visible if triggered
- metadata looks reasonable

---

## 4) Tool validation

If testing tool behavior, explicitly try:

### Lead capture

Have the caller provide:

- name
- email
- service/request
- preferred date/time

Expected result:

- tool event is logged
- captured lead details appear in call review UI

### SMS confirmation

Prompt the agent toward a flow where SMS confirmation should trigger.

Expected result:

- Twilio SMS action succeeds
- tool event appears in transcript/call review

### Graceful end call

Drive the conversation into a closing state.

Expected result:

- assistant finishes speaking
- call ends gracefully after playback completes
- final call status persists correctly

---

## 5) Failure checks

If the call fails, inspect:

### No call record created

Check:

- `npm run smoke:prod`
- `voice` logs for `[yapsolutely-runtime]` warnings about agent resolution or call persistence
- runtime can reach web app
- `RUNTIME_SHARED_SECRET` matches
- web envs are correct
- `postgres` container is healthy

### Call record created but no transcript

Check:

- Deepgram key
- runtime logs, especially `[yapsolutely-runtime]` warnings
- media stream connectivity
- live mode really enabled

### Transcript exists but no AI reply

Check:

- Anthropic key
- model config
- runtime logs for response generation errors and `[yapsolutely-runtime]` warnings

### AI reply exists but caller hears nothing

Check:

- Deepgram TTS key/model
- websocket stream path
- Twilio Media Stream behavior
- runtime logs, especially `[yapsolutely-runtime]` warnings around stream event persistence

### Tools don’t fire

Check:

- prompt/tool routing
- Twilio SMS config
- runtime event logs

### Runtime resolves wrong agent or fallback path only

Check:

- `npm run preflight:prod`
- `GET /api/runtime/resolve-agent?phoneNumber=...` with the runtime secret
- `voice` logs for `[yapsolutely-runtime] failed to resolve inbound agent`
- seeded phone number row exists
- agent is both `ACTIVE` and `isActive=true`
- Twilio is sending the expected destination number in the inbound webhook

---

## 6) Pass criteria

A live validation pass is successful when:

- inbound call connects
- AI can answer at least one real exchange
- call record persists
- transcript persists
- at least one runtime/tool event can be seen in the dashboard if intentionally tested

---

## 7) Stretch pass criteria

A stronger pass is successful when:

- interruption/barge-in works acceptably
- call closes gracefully
- transcript quality is usable
- tool event summaries look correct
- the flow is demoable without manual patching during the call
