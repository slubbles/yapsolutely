# Yapsolutely UI Master Plan

## Canonical usage

This document is the **canonical source of truth for UI and design execution**.

It exists to keep the product interface aligned while implementation continues, so visual work does not drift into random page-by-page styling or generic starter-template output.

### Rules for using this plan

1. If a UI or design decision conflicts with casual discussion, this document wins until intentionally updated.
2. This plan governs:
   - app information architecture
   - onboarding flow UI
   - dashboard shell layout
   - page-level visual priorities
   - component-system direction
   - design-system sequencing
3. New UI ideas are welcome, but they do **not** become canonical until they are written back into this file.
4. During implementation, UI work should be described against the objectives and milestones in this plan.
5. This file should stay aligned with `plan/masterplan.md`, but it is the more specific source of truth for design and interface execution.

### Updated workflow decision

The UI workflow is now:

1. use **Lovable** to rapidly scaffold exploratory marketing/app UI directions
2. pull the strongest Lovable output back into this repository
3. use this plan to evaluate what is worth keeping
4. customize, refine, and productize the result here until it feels like **Yapsolutely**, not like a generic generator output

Important:

- Lovable is the **scaffolding accelerator**, not the final design authority
- this file remains the canonical taste contract
- any Lovable-generated pattern that conflicts with this plan should be revised after import

---

## UI intent

Design `Yapsolutely` to feel like a serious AI voice operations platform:

- Retell-inspired in structure and operator workflow
- more polished and cohesive than the current scaffold
- custom in identity, not a skin-deep copy
- elegant enough to impress Karim before funded live-call validation
- extensible enough to support later browser testing, flow builder, analytics, and knowledge workflows

The UI must communicate:

- trust
- operational clarity
- modern product quality
- fast navigation
- product seriousness
- room for advanced voice-agent workflows

The attached image adds an additional requirement:

- the product should feel premium, editorial, soft, and highly designed — not just enterprise-functional

The working implementation preference is now also:

- use Lovable to get to a promising first pass quickly
- then aggressively refine structure, spacing, copy, hierarchy, and component behavior here with deliberate product taste

---

## Creative north star

The creative north star for the UI is:

> **Digital Artisan Operations**

This means Yapsolutely should feel like a high-end editorial product wrapped around serious operational software.

It should combine:

- the warmth, tactility, and compositional confidence of crafted luxury brands
- the precision, trust, and clarity of a modern AI operations console
- the structural rigor of Retell-like product workflows
- the visual restraint of a curated design studio rather than a generic SaaS template

### Core tension we are intentionally designing around

Yapsolutely must live in both of these worlds at once:

1. **Editorial / premium / asymmetric / emotional**
2. **Operational / readable / efficient / trustworthy**

The UI should not collapse entirely into either extreme.

- If it becomes too editorial, it stops feeling like software.
- If it becomes too operational, it loses the premium first-impression Karim needs to see.

### Final synthesis rule

The correct answer is:

- **marketing, onboarding, hero moments, and featured surfaces** use the strongest editorial expression
- **dashboard, tables, filters, and workflows** use the calmer operator expression
- both layers must clearly belong to the same brand system

---

## Vision

### Vision statement

Build a UI that makes Yapsolutely feel like:

- a premium AI company
- a serious voice-operations platform
- a polished demo-ready product
- a reusable long-term product foundation

### Vision outcomes

When the UI phase succeeds, a new viewer should immediately understand that Yapsolutely is:

- more intentional than a starter kit
- more premium than a typical internal dashboard
- organized like a real voice platform
- visually coherent enough that future implementation can continue without constant redesign debates

---

## Primary design references

This UI plan is based on three reference directions:

### 1. Retell dashboard structure

Retell’s dashboard establishes the target product **information architecture** and operator feel:

- grouped primary navigation
- secondary context sidebar
- table-first main content areas
- quiet enterprise layout
- dense but readable workspace structure
- build / deploy / monitor / system mental model

### 2. Attached visual inspiration

The attached image establishes the target **visual language** direction for Yapsolutely:

- soft premium surfaces
- airy spacing
- large rounded panels
- minimal but editorial composition
- high-contrast hero media blocks
- elegant card rhythm
- refined product-marketing sensibility
- asymmetry without chaos
- light canvas with dark contrast moments
- premium material contrast rather than startup gradients

Important:

> We should borrow **the polish, spacing discipline, card treatment, and premium feel** from the attached visual reference, while borrowing **the information architecture and operator flow** from Retell.

That means:

- Retell-like product structure
- Yapsolutely-specific visual identity

### 3. Lovable-generated exploratory scaffolds

Lovable is now an approved source for:

- quick section scaffolds
- fast page composition experiments
- hero and marketing layout exploration
- rough first-pass app-shell ideas

But Lovable output must be treated as:

- a starting point
- a draft composition source
- something to be curated and rewritten

Not as:

- the final authority on brand taste
- the final source of copy
- the final source of spacing/hierarchy/component polish

### Reference priority order

When evaluating imported Lovable work, follow this order:

1. preserve the product structure and workflow clarity this platform needs
2. preserve the premium softness and restraint defined by the attached visual inspiration
3. preserve the page/system behavior defined in this plan
4. keep only the Lovable-generated pieces that actually improve speed or composition quality

### Fidelity priority order

When future implementation choices conflict, follow this order:

1. preserve the **operator architecture** required for a voice-agent platform
2. preserve the **overall feel** of the attached image
3. preserve the **premium editorial composition rules** defined in this document
4. only then make local component-level compromises

This rule exists so implementation does not accidentally keep the structure but lose the visual soul.

For Lovable imports specifically:

> keep the strong composition, discard the generic SaaS habits.

---

## Visual reference breakdown

The attached design image suggests several concrete visual decisions.

### Layout feel

- light overall canvas
- oversized white and off-white panels
- soft grey background
- generous whitespace
- card stacking with visual calm
- multiple content rhythms on one page without feeling chaotic
- selective asymmetry rather than rigid even grids
- contrast modules that act like editorial anchors

### Surface treatment

- very large panel radii
- subtle shadows
- minimal borders
- premium layered cards
- high contrast between content blocks and background
- floating overlays and inset labels on media blocks
- contrast between soft white panels and charcoal media zones

### Typography feel

- large editorial headings
- clean sans-serif UI copy
- strong hierarchy without relying on too many colors
- enough space for content to breathe
- occasional art-direction moments where a more expressive headline is allowed to carry the section

### Motion / interaction implication

Even though static, the design implies:

- subtle transitions
- premium hover states
- layered reveal animations
- polished onboarding and route changes

### What to take from it

We should use this reference most strongly for:

- landing page
- onboarding screens
- panel shapes
- card hierarchy
- whitespace rhythm
- premium design-system direction

We should also specifically take:

- the feeling of layered premium materials
- the confidence to use one strong hero block instead of many equal cards
- the rule that whitespace is an active design tool, not leftover space

We should **not** force the exact same content density onto every dashboard page, because operational tables still need a more compact mode.

### What must be visually recognizable from the reference

Even after adapting the layout for software, the following must still be recognizable in the finished UI:

- a pale, soft outer canvas
- large, quiet, rounded primary panels
- one or two strong dark contrast modules per key page where appropriate
- strong vertical breathing room
- visibly asymmetric hero/feature composition on marketing and onboarding pages
- quiet microcopy that never dominates headings
- premium restraint instead of startup-style visual noise

---

## Current UI stage

**Current phase:** scaffolded shell, not final product UI

**Execution mode:** Lovable-assisted exploration plus repo-local refinement

### What already exists

- landing page
- sign-in page
- sign-up page
- dashboard page
- agents list page
- create-agent page
- agent detail page
- numbers page
- calls list page
- call detail page
- settings page
- shared shell component and global app layout

### What is true about the current UI

- it is usable as a scaffold
- it proves route coverage
- it is too dark, too early-stage, and too card-oriented to feel like the desired final product
- it does not yet express a clear premium Yapsolutely visual identity
- it does not yet include the two-level or three-panel dashboard workspace model
- it does not yet include the full onboarding funnel discovered in Retell
- it does not yet reflect the soft premium feel of the attached design reference

### Core UI gap

The current app is functionally scaffolded, but visually it still reads like:

- early internal product shell
- temporary admin dashboard
- not yet a serious AI voice platform

This plan exists to fix that deliberately.

### What changes about execution from now on

Instead of hand-authoring every first draft in-repo, we can now:

- scaffold fast in Lovable
- compare multiple UI directions quickly
- choose the most promising draft
- then import and refine it here with tighter taste control

This should increase speed, but it must not lower standards.

---

## Frozen UI decisions

These are now the default UI execution decisions unless explicitly revised.

### 1. Product structure decision

The app should follow a **Retell-like operator architecture**:

- primary grouped navigation
- secondary contextual navigation pane
- focused main workspace
- dense, clean, operational content

### 2. Branding decision

The app should **not** look like Retell’s exact brand.

We will own:

- color system
- typography choices
- spacing rhythm
- card and panel treatment
- icon usage
- motion style
- empty states
- visual storytelling

### 3. Layout decision

The default in-app shell should evolve toward a:

- left primary nav rail
- secondary section pane
- main content workspace

rather than a simple one-column dashboard shell.

### 4. Dual density decision

The product should support **two visual densities**:

- premium, spacious, editorial layout for landing and onboarding
- quieter, denser, more operational layout for in-app dashboard workspaces

### 5. Onboarding decision

The first-run experience should include a pre-dashboard flow modeled after Retell:

- landing page
- auth
- secure account
- email verification
- onboarding survey
- dashboard

### 6. Visual direction decision

The attached visual reference should influence:

- panel radius
- spacing
- section composition
- premium softness
- card hierarchy
- overall polish
- hero contrast strategy
- asymmetrical composition rules
- material-inspired surface hierarchy

but not replace the dashboard IA needed for a voice-agent platform.

### 7. Design system strategy decision

The UI will use a **dual-expression system**:

- **editorial expression** for landing, auth, onboarding, empty states, and feature highlights
- **operator expression** for dense in-app workflows, tables, transcript review, filters, and settings

Both expressions must share the same:

- typography system
- surface logic
- color family
- radius language
- motion discipline

### 8. Visual fidelity decision

If implementation drifts toward a generic dashboard appearance, the correct response is to revise the implementation until it realigns with the attached image and this plan.

We are not aiming for “good enough premium.”

We are aiming for:

- clearly soft and art-directed
- clearly calmer than starter SaaS
- clearly closer to the attached image than to a default admin template

### 9. Scaffolding decision

Lovable may be used to generate first-pass UI scaffolds for landing sections, onboarding flows, and selected product surfaces.

However, every imported scaffold must be reviewed against this plan for:

- composition quality
- taste fidelity
- product specificity
- component consistency
- copy accuracy

“Good generator output” is not the finish line.

The finish line is:

- unmistakably Yapsolutely
- premium and restrained
- structurally coherent with the rest of the product

---

## Desired product feel

The final UI should feel like:

- modern SaaS
- premium product
- slightly editorial on the marketing and onboarding side
- highly trustworthy in the app
- calm, not noisy
- polished enough for demos
- dense enough for serious operation

### Translation into actual page behavior

- landing page should feel curated and memorable
- auth and onboarding should feel luxurious but efficient
- the app shell should feel calm, structured, and expensive
- tables should feel software-grade, not marketing-grade
- media and featured panels should introduce dark contrast strategically

### It should not feel like:

- a generic Tailwind template
- a raw Lovable export with stock marketing copy
- a crypto dashboard
- a dribbble-only mockup
- a noisy marketing site pretending to be software
- a copy of Retell’s branding

### Translation of taste into execution

When reviewing Lovable output, prefer drafts that already show:

- quieter luxury rather than loud startup energy
- strong whitespace and large calm panels
- real hierarchy instead of equal-weight section stacking
- product seriousness over “AI vibes” decoration
- a restrained premium feel rather than hyper-animated novelty

---

## Goal hierarchy

This plan is intentionally structured as:

> **Vision → Goals → Objectives → Tasks**

The vision defines the overall target.

The goals define what kind of UI product we are building.

The objectives define the main execution streams.

The tasks define the concrete build work.

### Goal G1 — Establish unmistakable Yapsolutely identity

The interface must stop looking like a scaffold and start feeling like a premium product.

Supported by:

- Objective 3 — Rebuild landing and auth flow
- Objective 7 — Establish the first real design system

### Goal G2 — Establish a credible operator console

The app must feel like a real AI voice operations platform with strong navigation, density control, and information hierarchy.

Supported by:

- Objective 1 — Define the UI architecture
- Objective 2 — Build the new app shell
- Objective 5 — Rebuild monitor surfaces
- Objective 6 — Rebuild deploy/system surfaces

### Goal G3 — Make the agents area feel like the product core

The agent workflow should become the flagship builder experience that makes the platform feel valuable.

Supported by:

- Objective 4 — Rebuild agent surfaces

### Goal G4 — Make execution autonomous

The UI plan must be specific enough that implementation can continue from `continue` without requiring page-by-page micromanagement.

Supported by:

- all objectives in sequence
- the autonomous continuation rules near the end of this document

### Goal G5 — Preserve reference-image fidelity through implementation

The final product should still clearly read as having been shaped by the attached image, not merely “inspired by premium design in general.”

Supported by:

- visual fidelity rules
- page archetype rules
- acceptance criteria and review gates

---

## Information architecture

## Top-level product areas

The product should be organized into these core groups.

### Build

- Agents
- Knowledge Base
- Flow Builder

### Deploy

- Phone Numbers
- Batch Calls
- Routing / Channels later if needed

### Monitor

- Call History
- Chat History later
- Analytics
- AI Quality / QA
- Alerting

### System

- Billing
- Settings

---

## Core page inventory

This is the target UI page set for the next major phase.

## Public / pre-dashboard flow

1. `/`
   - premium landing page
2. `/sign-in`
   - polished sign-in with Google-first emphasis
3. `/sign-up`
   - minimal sign-up flow
4. `/secure-account`
   - confirm work email
5. `/verify-identity`
   - 6-digit email verification page
6. `/onboarding`
   - survey / setup intent flow

## In-app product flow

7. `/dashboard`
   - product summary and recent operations
8. `/agents`
   - all agents table view
9. `/agents/new`
   - create-agent flow
10. `/agents/[agentId]`
   - agent overview
11. `/agents/[agentId]/build`
   - prompt / flow / configuration workspace
12. `/agents/[agentId]/test`
   - simulation / testing surface
13. `/agents/[agentId]/deploy`
   - number assignment and deploy controls
14. `/agents/[agentId]/monitor`
   - agent-specific performance and recent call review
15. `/knowledge-base`
   - source and upload management
16. `/numbers`
   - number inventory and assignment
17. `/batch-calls`
   - future outbound/batch setup page
18. `/calls`
   - call history table
19. `/calls/[callId]`
   - transcript review and call detail
20. `/analytics`
   - usage and performance overview
21. `/qa`
   - AI quality review
22. `/alerts`
   - alert center / issues / warnings
23. `/billing`
   - plan, usage, limits
24. `/settings`
   - workspace and runtime settings

### Immediate UI target

Not all of these need to be fully wired now.

The important rule is:

> the page structure should exist before every backend behavior is complete.

That allows the product to feel complete earlier while functionality is wired in progressively.

---

## Onboarding UX plan

## Objective

Make the first-run experience feel premium and productized before the user reaches the dashboard.

## Steps

### Step 1 — Landing page

Goal:

- communicate product confidence
- establish premium visual identity
- showcase the attached visual inspiration through composition and pacing
- make the first CTA feel serious

### Step 2 — Sign in / sign up

Goal:

- reduce friction
- emphasize Google sign-in or modern auth UI
- avoid clunky enterprise-feeling forms

### Step 3 — Secure account

Goal:

- confirm the work email target
- frame security and trust
- make the product feel real and high-trust

### Step 4 — Verify identity

Goal:

- 6-digit email verification page
- clean, high-confidence verification UI

### Step 5 — Onboarding survey

Goal:

- qualify the user
- personalize future UI
- make the product feel intelligent and guided

### Suggested onboarding questions

- What do you want the agent to do?
- How many agents or callers do you support today?
- How do you want to implement the solution?
- Which integrations matter first?
- Which industry best describes your business?

### Step 6 — Enter dashboard

Goal:

- land the user in a polished operator workspace
- not in a raw scaffold

---

## Dashboard shell model

The app shell should move to a **three-zone** structure.

### Zone 1 — Primary nav rail

Contains:

- brand
- workspace selector
- grouped section navigation
- profile / help / updates / plan status

### Zone 2 — Secondary context pane

Contains:

- current section title
- filters / folders / templates / categories
- section-specific navigation
- lightweight actions

Examples:

- agents: all agents, templates, folders, transfers
- calls: all calls, failed, completed, flagged, recent
- knowledge base: sources, webpages, docs, uploads

### Zone 3 — Main content workspace

Contains:

- page heading and actions
- search/filter row
- primary table / content module
- secondary detail panel or stats when needed

---

## Page-by-page visual goals

## Page archetype system

To keep implementation coherent, every page should be assigned one of these archetypes.

### Archetype A — Editorial spotlight page

Used for:

- landing page
- selected onboarding steps
- empty states or feature highlight surfaces later

Required characteristics:

- strong asymmetry
- one dominant hero block
- premium contrast media use
- very generous spacing
- strongest use of `General Sans`

### Archetype B — Premium form page

Used for:

- sign-in
- sign-up
- secure account
- verify identity
- onboarding survey
- create-agent flow where appropriate

Required characteristics:

- centered or gently offset composition
- one dominant panel plus secondary support content
- soft surfaces and minimal chrome
- clear step progression
- restrained, elegant control density

### Archetype C — Operator workspace page

Used for:

- dashboard
- agents list
- calls list
- numbers
- settings
- analytics / QA / alerts / billing

Required characteristics:

- three-zone shell
- compact control rows
- table-first or detail-first workspace structure
- premium surfaces without airy wastefulness
- editorial influence through typography, spacing, and contrast moments only

### Archetype D — Builder detail page

Used for:

- agent overview
- build / test / deploy / monitor pages
- call detail
- knowledge base detail later

Required characteristics:

- strong content hierarchy
- primary work area with supporting sidecar or metrics rail when useful
- clear section chunking through panel rhythm, not divider abuse
- excellent readability for dense information

## Landing page

### Goal

Create a premium, memorable first impression.

### Visual direction

- large editorial hero
- oversized rounded media panels
- airy, luxurious spacing
- refined typography
- crisp CTA hierarchy
- strong use of asymmetrical composition inspired by the attached reference
- one unmistakable dark contrast hero module above the fold
- large content sections that feel art-directed rather than stacked from a template

### Include

- hero statement
- product trust cues
- feature sections
- dashboard preview imagery
- call-flow / build-test-deploy-monitor explanation
- CTA to sign in / get started

### Non-negotiable landing cues from the image

- a soft pale background, not a dark page background
- at least one oversized media/contrast block with floating micro-content
- one feature/stat/story section that uses asymmetry rather than a uniform three-card grid
- rounded section panels that feel materially layered

---

## Dashboard

### Goal

Show trust, progress, and operations clearly.

### Include

- recent calls
- agent count
- assigned number count
- runtime health / readiness
- recent actions
- top-level usage summaries

### Visual direction

- not oversized hero cards
- denser software layout
- table + stats hybrid
- lighter and calmer than the current shell
- no “all cards same size” starter-dashboard rhythm
- at least one main workspace module that clearly dominates the hierarchy

---

## Agents list

### Goal

This should feel like the heart of the product.

### Include

- search
- filter tabs / folders / templates
- create agent CTA
- import action placeholder
- compact agent table
- status pills
- voice / type / edited metadata

### Desired feel

- quiet
- crisp
- operational
- Retell-like in structure
- premium enough that the table area still feels designed, not merely functional

---

## Agent workspace

### Goal

Turn agent detail into a serious builder workspace.

### Sections

- Overview
- Build
- Test
- Deploy
- Monitor

### Include

- name / description / status
- prompt / flow controls
- first message / voice
- number assignment
- tool actions / integrations
- recent performance summary

---

## Calls list

### Goal

Provide proof and reviewability.

### Include

- searchable table
- status filters
- transcript preview
- duration
- agent name
- timestamps
- flagged/problem states later

---

## Call detail

### Goal

This page should feel strong enough for demo review.

### Include

- transcript timeline
- event roles
- tool actions
- metadata
- summary and extracted outcomes
- call status and timestamps

### Desired feel

- like a premium review workspace, not a debug screen
- timeline clarity first, with chrome kept quiet

---

## Knowledge base

### Goal

Present this as a first-class build surface.

### Include

- add webpage source
- add document source
- source list
- sync status placeholders
- attached agent references later

---

## Analytics / QA / Alerts

### Goal

Even if initially scaffolded, these pages should make the product feel platform-grade.

### Include

- analytics cards and tables
- QA review queue or scorecards
- alert center with warning states

These can begin as UI-first scaffolds before deep functionality exists.

---

## Visual system plan

## Design principles

1. Clarity over decoration
2. Premium over generic
3. Operational over flashy
4. Spacious but dense
5. Soft surfaces, sharp structure
6. Fewer colors, stronger hierarchy

## Editorial sophistication strategy

The design system strategy should be understood as:

> **editorial sophistication layered onto product rigor**

This is the closest interpretation of both:

- the attached visual reference
- the desired premium feel described in this planning thread

### The main rule

Do not build a generic SaaS dashboard and then decorate it.

Instead:

- design the composition first
- define material hierarchy second
- define component behavior third
- only then scale the system across pages

## Exact visual target interpretation

The attached image should be treated as the closest visual benchmark for Yapsolutely’s premium direction.

### What “look like this” means in practice

- soft light-grey canvas instead of a dark dashboard shell
- oversized white content panels with generous radius
- elegant spacing and quiet composition
- minimal visible borders
- subtle depth instead of loud gradients
- refined typography with strong heading scale
- editorial marketing sections combined with clean product surfaces
- selective dark media blocks for contrast
- restrained glassmorphism overlays on selected media and nav surfaces
- premium organic warmth introduced through accent tones rather than loud brand color

### What “look like this” does **not** mean

- literally copying the exact layout block-for-block
- using the same imagery style everywhere
- making the dashboard impractically spacious for operational tables
- abandoning Retell-like app structure for a marketing-only composition

The implementation rule is:

> match the softness, balance, spacing, and premium restraint of the reference image while keeping the product architecture optimized for a voice-agent platform.

## Visual fidelity guardrails

These rules exist to protect the final result from drifting away from the attached image.

### Guardrail 1 — Never default back to a dark full-app shell

The image is not a dark dashboard.

Therefore:

- the default app environment stays light
- dark surfaces are used as contrast moments, not universal backgrounds

### Guardrail 2 — Never make every module equal weight

The image works because some blocks lead and others support.

Therefore:

- each important page must have a clear primary module
- supporting cards must visually recede

### Guardrail 3 — Never over-grid the editorial pages

Marketing and onboarding pages must retain asymmetry and art direction.

Perfectly even card grids should be the exception, not the rule.

### Guardrail 4 — Never solve hierarchy with border spam

Use spacing, panel nesting, tonal shifts, and contrast first.

### Guardrail 5 — Never let operational density erase premium feel

Compact pages are allowed.

Ugly pages are not.

### Guardrail 6 — Never use “premium” as an excuse for reduced usability

The app must still scan fast, filter fast, and review calls clearly.

### Important synthesis with the darker editorial references

The image itself is not a full dark interface, but it **does** rely on dark contrast modules.

So the correct Yapsolutely interpretation is:

- **light neutral canvas as the default workspace environment**
- **charcoal contrast surfaces for hero modules, preview media, feature callouts, and selected overlays**
- **warm natural accent tones used sparingly to create craft and tactility**

## Color direction

Use a restrained palette:

- soft light neutrals for the main app surfaces
- strong dark text
- one primary accent color
- one secondary accent for status / emphasis
- muted support colors for UI states

The attached image suggests a softer premium palette than the current dark shell.

### Recommended direction

- main app shell: light neutral workspace
- cards: warm white / off-white / subtle grey
- primary accent: custom Yapsolutely tone
- status colors: restrained, not saturated neon

### Approved starting color palette

These are the starting design tokens to guide implementation.

- `bg-canvas`: `#eef1f5`
- `bg-subtle`: `#f6f7f9`
- `bg-panel`: `#ffffff`
- `bg-panel-muted`: `#f8f8f7`
- `bg-contrast`: `#131313`
- `bg-contrast-soft`: `#1c1b1b`
- `bg-contrast-bright`: `#393939`
- `text-strong`: `#16181d`
- `text-body`: `#44484f`
- `text-muted`: `#7c818b`
- `border-soft`: `rgba(16, 24, 40, 0.08)`
- `border-faint`: `rgba(16, 24, 40, 0.05)`
- `ghost-border`: `rgba(68, 71, 72, 0.2)`
- `accent-primary`: `#20242b`
- `accent-secondary`: `#eebd8e`
- `accent-secondary-dim`: `#c89c73`
- `accent-neutral`: `#d7dde7`
- `text-on-contrast`: `#e5e2e1`
- `success-soft`: `#e8f4ec`
- `warning-soft`: `#fff4df`
- `danger-soft`: `#fdeceb`

### Surface hierarchy and nesting

Treat the interface like a stack of premium materials.

1. **Base layer** — `bg-canvas` / `bg-contrast`
2. **Secondary tier** — `bg-panel-muted` / `bg-contrast-soft`
3. **Top tier** — `bg-panel` / `bg-contrast-bright`

### No-line rule

Standard 1px section dividers are not the default solution.

Boundaries should primarily be created through:

1. tonal shifts
2. negative space
3. panel nesting
4. selective contrast blocking

### Ghost border fallback

If accessibility or clarity requires an edge, use a ghost border only:

- `1px solid rgba(68, 71, 72, 0.2)` on dark surfaces
- `1px solid rgba(16, 24, 40, 0.06)` on light surfaces

If the border is visually obvious from far away, it is too strong.

### Glass and gradient rule

Use these sparingly and only where they add premium depth.

- floating overlays may use semi-transparent contrast or panel surfaces with backdrop blur
- hero CTAs or spotlight modules may use subtle gradients between dark neutral and warm accent-tinted surfaces
- glass effects should never become a default styling habit across every component

### Visual restraint rule

If an effect does not clearly improve hierarchy, tactility, or emphasis, remove it.

The image feels premium because it is restrained, not because it is busy.

### Color usage rules

- the overall interface should be at least **80% neutral**
- accent colors should be used sparingly for buttons, selected states, and important emphasis
- large dark blocks should appear as contrast moments, not as the default dashboard background
- avoid saturated violet/blue starter-dashboard color habits unless intentionally redesigned into the new palette
- warm wood-tone accents should appear in micro-interactions, selected states, and high-value callouts rather than broad page flooding

## Typography direction

Need a type system that feels:

- premium
- modern
- slightly editorial
- still readable in dashboards

### Recommended split

- headline font: more distinctive and premium
- body/UI font: practical, crisp, high legibility

### Approved font system

Use the following default type pair unless intentionally revised:

- **Display / primary headings / premium CTAs:** `General Sans`
- **UI / body / tables / labels:** `Satoshi`

### Why this pairing

`General Sans` gives us:

- premium neutrality
- stronger resemblance to the attached image’s sans-first feel
- clean, expensive-looking headlines without becoming overly geometric
- flexible use across hero copy, page titles, and concise CTA moments

`Satoshi` gives us:

- soft modern UI texture
- clean dense readability for product surfaces
- friendlier support text and metadata rhythm
- compatibility with minimalist cards, filters, and form controls

### Font acquisition sources

Both selected fonts are available from Fontshare and can be downloaded as webfont / desktop font packages for implementation.

- `General Sans`: `https://www.fontshare.com/fonts/general-sans`
- `Satoshi`: `https://www.fontshare.com/fonts/satoshi`

### Typography scale guidance

- hero display: `56–72px`, weight `700–800`, tight tracking
- section heading: `36–48px`, weight `700`
- page title: `28–36px`, weight `650–700`
- card title: `18–24px`, weight `600–700`
- body large: `18px`, line-height `1.6`
- body default: `15–16px`, line-height `1.6`
- meta / labels: `11–13px`, uppercase only when truly helpful

### Type role rules

- `General Sans` should appear in heroes, section intros, page titles, feature statements, and high-value CTA moments
- `General Sans` may also be used for selected navigation and card headings where a stronger premium voice is helpful
- `General Sans` should **not** be over-tracked or forced into a hyper-editorial serif role it does not have
- `Satoshi` should own dense UI: navigation support text, forms, controls, tables, metadata, transcripts, and settings
- labels may use all-caps with slight tracking when they help create an architectural/editorial tone

### Typography rules

- use `General Sans` for large hero moments, premium statements, section titles, and primary CTA/button text when emphasis matters
- use `Satoshi` for navigation, data tables, forms, body copy, and dense UI
- avoid overusing uppercase labels; the attached reference feels editorial because it lets the big type breathe
- avoid tiny compressed type except for metadata and table support text
- avoid decorative italics as a primary brand move; the selected type system should stay clean and modern

## Shape system

- large radii for major panels
- medium radii for cards and forms
- pill shapes for filters and status
- minimal hard corners

### Approved radius scale

- hero / major section panels: `28–36px`
- standard content panels: `24px`
- cards: `20–24px`
- inputs / selects / buttons: `14–18px`
- pills / chips: `999px`

### Organic shape rule

Buttons and chips should feel sanded and smooth.

Cards should feel refined and softened, not bubbly or playful.

## Spacing system

- broad page margins
- strong vertical rhythm
- comfortable breathing room between major sections
- tighter spacing inside data tables and controls

### Approved spacing rhythm

- outer page padding: `24px mobile`, `32px tablet`, `40–48px desktop`
- section gaps: `32–56px`
- panel padding: `20–32px`
- card padding: `18–24px`
- compact table cell padding: `12–16px`

### Whitespace rule

Marketing and onboarding pages should feel generous and breathable.

Dashboard and operations pages should still keep the same design language, but compress responsibly for scan efficiency.

This means:

- same radius, shadows, typography family, and color system
- tighter spacing only where operational density requires it

If a section feels cramped, the default answer is to move up one spacing tier before adding more separators.

## Elevation and shadow system

The attached reference relies on soft depth rather than heavy outline styling.

### Approved shadow guidance

- primary large panel shadow: `0 10px 30px rgba(16, 24, 40, 0.06)`
- secondary card shadow: `0 8px 20px rgba(16, 24, 40, 0.05)`
- floating accent card shadow: `0 14px 34px rgba(16, 24, 40, 0.10)`

### Shadow rules

- use depth softly and consistently
- avoid harsh dark shadows
- avoid layering too many shadow styles at once
- when in doubt, use lighter borders and softer elevation instead of visual noise

### Ambient depth rule

Depth should feel sensed rather than announced.

Heavy button shadows and loud card lift are prohibited.

## Surface system

The interface should rely on a small number of repeatable surface types.

### Surface types

1. **Canvas surface**
   - whole app/page background
   - soft cool neutral

2. **Primary panel**
   - main white container
   - largest radius
   - soft shadow

3. **Secondary panel**
   - muted white/grey supporting surface
   - slightly lower emphasis

4. **Contrast media panel**
   - dark content block used for previews, hero media, and featured modules

5. **Utility chip/pill**
   - small rounded labels and metadata treatment

6. **Glass overlay**
   - floating captions, media labels, or nav treatments
   - semi-transparent with blur

7. **Editorial spotlight panel**
   - large statement surface used on landing, onboarding, or feature highlights
   - combines strong typography, asymmetry, and contrast intentionally

This limited surface vocabulary is required to keep the UI coherent.

## Component direction

The following components must be standardized early:

- primary sidebar item
- grouped nav label
- secondary list item
- page header
- data table
- status pill
- card / panel
- input
- select
- tab row
- CTA button
- empty state
- modal
- OTP input
- onboarding step card

### Signature component set

The UI should develop a recognizable “artisan set” of signature components.

These include:

- textured or contrast media containers with floating labels
- oversized editorial stat blocks
- spotlight cards with asymmetrical internal composition
- ghost-style tertiary buttons with arrow motion
- premium OTP input group
- transcript review blocks with quiet metadata and excellent spacing
- image-overlay feature cards with embedded CTA pills and floating support chips

### Core component families

The design system should explicitly define these component families.

#### Navigation components

- workspace switcher
- primary nav rail item
- grouped nav section label
- secondary sidebar list item
- secondary sidebar filter row
- profile/footer utility row

#### Layout components

- page shell
- section panel
- split hero block
- metrics rail
- content grid
- editorial content block

#### Data-display components

- data table
- compact table row
- metadata pill
- avatar + label cell
- stat card
- detail card
- transcript event block
- timeline item

#### Form components

- text input
- search input
- OTP input group
- select
- textarea
- radio card
- checkbox row
- survey option card

#### Action components

- primary button
- secondary button
- tertiary ghost button
- icon button
- dropdown action trigger
- import/upload button

#### Content components

- agent card
- template card
- folder item
- integration card
- onboarding step panel
- empty-state module
- modal / sheet

#### Media-led showcase components

- hero media card
- feature image card with overlay CTA
- floating badge chip
- inset media caption panel
- testimonial/media split card

### Reference-image-inspired card system

The attached image strongly suggests a specific card language that should become part of Yapsolutely’s identity.

#### Card type 1 — Contrast hero media card

Used for:

- landing hero
- key onboarding spotlight sections
- product preview blocks

Characteristics:

- dark contrast surface
- oversized radius
- bold headline placed directly over or beside the media
- one embedded CTA pill inside the card
- optional floating mini-info panel near a lower corner

#### Card type 2 — Overlay feature card

Used for:

- feature showcases
- agent templates later
- dashboard promo / release notes / highlighted modules

Characteristics:

- image or textured visual background
- subtle dark overlay for readability
- concise heading and short support copy
- inline CTA pill or ghost CTA inside the card
- quiet numeric or label metadata in a corner when useful

#### Card type 3 — Editorial content panel

Used for:

- narrative sections on landing/onboarding
- structured text blocks paired with cards or media

Characteristics:

- pale panel background
- large breathing room
- calm typography hierarchy
- minimal chrome

#### Card type 4 — Operator data card

Used for:

- metrics
- dashboard summaries
- agent/call support modules

Characteristics:

- lighter, quieter surface
- less decorative than marketing cards
- still rounded and materially layered
- often paired with a dominant table or detail workspace rather than competing with it

### Component-specific style rules

#### Buttons

- primary buttons should be pill-shaped and confident, never overly bulky
- default primary treatment should favor contrast surfaces with refined text rather than loud gradient fills
- secondary and tertiary actions should avoid visible borders unless necessary
- arrow-led ghost actions may shift the arrow by `4px` on hover

#### Cards and lists

- divider lines are discouraged
- spacing, tonal separation, and hierarchy should separate list rows and cards
- subtle inner highlights are acceptable when they create a polished material edge
- image cards should allow content overlays only when text contrast remains strong and the CTA remains instantly readable
- CTA pills inside image cards should sit as part of the composition, not like random stickers

#### Overlay CTA treatment

- overlay CTAs should be compact pill buttons
- the default treatment should be light-on-dark or dark-on-light depending on local contrast
- the CTA should feel embedded in the card composition, often near a lower or side anchor point
- supporting chips may float nearby, but only one primary action should dominate

#### Inputs

- inputs should feel minimal and premium
- filled soft-surface inputs are preferred to harsh outlined boxes
- focus states may use warm accent shifts instead of neon rings where accessibility remains acceptable

#### Tables

- tables must remain operationally dense, but their surrounding shell should still feel premium
- row separation should rely on soft background rhythm before hard lines
- headers should be quiet and structured, not loudly boxed

### Component style rules

- buttons should be compact, elegant, and quiet by default
- tables should be extremely readable and minimally decorated
- cards should rely on spacing and surface quality more than colored chrome
- search, filters, and actions should live in clean control rows near the top of a workspace
- inputs should feel premium and soft, not boxed and harsh
- icon sets should stay thin and restrained rather than cartoonishly heavy

## Dashboard-vs-marketing component density

The attached image is best reflected in the marketing/onboarding layer.

The dashboard layer should inherit its design language through:

- color palette
- radii
- spacing discipline
- typography
- shadow softness

But dashboard components must be more compact than the reference image.

This is a deliberate design rule, not a compromise.

## Reference-image-specific composition rules

To stay aligned with the attached image, implementation should follow these composition rules.

### Rule 1 — Large hero modules first

Major pages should begin with one confident large module instead of many equal-weight cards.

### Rule 2 — Asymmetry is good

Sections should not feel perfectly grid-locked all the time. Slightly asymmetrical panel composition creates the premium editorial feel.

### Rule 3 — Contrast blocks are intentional

Dark image/video/media modules should be placed selectively inside otherwise light layouts to create depth and emphasis.

### Rule 4 — Quiet metadata

Small labels, counters, and support copy should stay subdued and never compete with the main heading.

### Rule 5 — Rounded everything, but with discipline

The design should feel soft, but not toy-like. Large radii are required, but everything still needs structure and spacing discipline.

## Do and don't rules

### Do

- use asymmetry where it improves art direction or emphasis
- use dark contrast modules selectively inside otherwise light compositions
- use warm accent tones for micro-interactions and premium detail moments
- prioritize whitespace and grouping before adding decoration
- let one large hero or spotlight block lead a section when appropriate

### Don’t

- do not default to 100% black
- do not rely on standard starter-dashboard borders everywhere
- do not use loud saturated gradients as a substitute for hierarchy
- do not overfill dashboards with equally weighted cards
- do not allow product pages to become a marketing collage that hurts usability

## Approved font and component implementation baseline

Unless intentionally revised, the implementation baseline is:

- `General Sans` for display / headings / premium CTA emphasis
- `Satoshi` for body / UI / tables / labels
- light neutral dashboard shell
- charcoal contrast moments
- warm artisan accent tone used sparingly
- large rounded white panels
- table-first workspace areas
- softened premium cards
- image-overlay cards with embedded CTA pills as a signature marketing/onboarding pattern
- compact enterprise actions inside premium surfaces

This baseline should be treated as frozen for the first UI redesign pass.

## Acceptance criteria for visual fidelity

Before any implementation milestone is considered visually successful, it should pass these checks.

### Shell acceptance check

- does the app still feel light-first rather than dark-first?
- do the panels feel large, soft, and premium?
- is there a clear hierarchy between dominant and supporting modules?
- does the shell feel closer to the attached image than to a default admin template?

### Marketing/onboarding acceptance check

- is the composition asymmetric enough to feel art-directed?
- is there at least one strong contrast media block?
- are typography and spacing doing most of the visual work?
- could this plausibly be mistaken for a premium creative-tech product rather than a SaaS starter?

### Operator page acceptance check

- are filters, tables, transcripts, and actions still efficient to use?
- does the page retain premium surfaces and visual calm?
- are separators mostly achieved through rhythm and surfaces instead of obvious lines?
- is the chrome quieter than the content?

### Failure condition

If a page is functional but visually reads as a standard dashboard template, it is not done.

---

## Implementation strategy

## Lovable-assisted implementation workflow

This is now the preferred UI execution loop.

### Phase 1 — Scaffold externally

Use Lovable to quickly generate:

- landing sections
- auth/onboarding layouts
- shell/layout starting points
- selected feature/story panels

### Phase 2 — Import selectively

Bring only the strongest output into this repository.

Criteria for importing:

- the composition is promising
- the page has a clear hierarchy
- the section rhythm feels premium enough to be worth refining
- the draft saves time compared with building from scratch

### Phase 3 — Refine in-repo

Once imported, refinement happens here.

Required refinement passes:

1. replace generic copy with product-specific Yapsolutely copy
2. normalize typography, spacing, radius, and surface treatment
3. remove generator-like redundancy or filler sections
4. align the page to the right archetype in this plan
5. connect the UI to actual route and product intent
6. reduce visual noise until the page feels calmer and more expensive

### Phase 4 — Canonicalize

If the imported/refined direction changes taste, page behavior, or component language in a meaningful way, update this file so the new rule becomes canonical.

## Review gate before implementation

The planning phase is not complete unless these are all true:

- the visual target is clear enough to guide implementation without more art-direction debate
- the relationship between the attached image and actual product pages is explicit
- the implementation team knows which pages must be editorial versus operational
- acceptance criteria exist to reject off-target UI work

This document should now satisfy that requirement.

### Final planning freeze

For the next implementation phase, the following should be treated as frozen unless intentionally revised:

- font system: `General Sans` + `Satoshi`
- shell direction: light-first with charcoal contrast moments
- component language: large rounded panels plus image-overlay CTA cards on editorial surfaces
- structure: Retell-like operator shell with page archetypes defined above

## Autonomous execution rule

When the user says `continue`, implementation should proceed like this:

1. consult `plan/masterplan.md`
2. consult this file
3. if a page or section is better scaffolded first, use Lovable as the exploration layer
4. import the strongest candidate into this repo
5. continue the earliest incomplete UI objective on the critical path for product perception
6. within that objective, refine the earliest incomplete task unless a dependency blocks it
7. update this plan if a meaningful UI decision changes

The expected UI-first sequence is:

1. app shell
2. landing/auth/onboarding
3. agents surfaces
4. calls/monitoring
5. numbers/settings/system scaffolds
6. final refinement pass

### Required behavior during future implementation

When implementing a page, the build should follow this order:

1. identify the page archetype
2. apply the correct density mode
3. establish dominant vs supporting modules
4. apply surface hierarchy
5. apply controls/tables/forms within that hierarchy
6. check against the visual fidelity acceptance rules

### What “finalized masterplan” means here

This plan is now finalized enough to guide implementation without needing additional instructions about:

- the primary font system
- the preferred card language
- the relationship between editorial pages and operator pages
- the level of similarity expected relative to the attached image
- how Lovable fits into the workflow without becoming the source of truth

## Objective 1 — Define the UI architecture

### Tasks

- [x] freeze top-level nav groups
- [x] freeze route inventory
- [x] freeze shell layout model
- [x] define which pages are UI-first vs fully data-backed
- [x] define page archetype system
- [x] define visual fidelity guardrails

### Definition of done

The app structure is agreed and no longer shifts randomly.

---

## Objective 2 — Build the new app shell

### Tasks

- [ ] replace current single-shell layout with multi-zone dashboard shell
- [ ] add primary nav rail
- [ ] add secondary section pane
- [ ] add workspace/account footer controls
- [ ] make shell reusable across dashboard pages

### Definition of done

All in-app pages sit inside a cohesive Retell-like operator shell.

---

## Objective 3 — Rebuild landing and auth flow

### Tasks

- [ ] redesign landing page using premium inspiration
- [ ] redesign sign-in page
- [ ] redesign sign-up page
- [ ] add secure-account page
- [ ] add verify-identity page
- [ ] add onboarding survey page/modal

### Definition of done

The pre-dashboard experience feels like a real product onboarding funnel.

---

## Objective 4 — Rebuild agent surfaces

### Tasks

- [ ] redesign agents list as table-first workspace
- [ ] redesign create-agent flow
- [ ] convert agent detail into agent overview
- [ ] add build/test/deploy/monitor subviews

### Definition of done

The agent area feels like the core of a serious voice-agent platform.

---

## Objective 5 — Rebuild monitor surfaces

### Tasks

- [ ] redesign calls list
- [ ] redesign call detail
- [ ] create analytics page scaffold
- [ ] create QA page scaffold
- [ ] create alerts page scaffold

### Definition of done

The monitor area feels production-grade and demoable.

---

## Objective 6 — Rebuild deploy/system surfaces

### Tasks

- [ ] redesign numbers page
- [ ] add batch call page scaffold
- [ ] add billing page scaffold
- [ ] redesign settings page into cleaner system workspace

### Definition of done

Deploy and system pages feel coherent and intentional.

---

## Objective 7 — Establish the first real design system

### Tasks

- [ ] define color tokens
- [ ] define typography tokens
- [ ] install and wire the approved font pair (`General Sans` + `Satoshi`)
- [ ] define radius / spacing / shadow system
- [ ] define surface vocabulary (canvas, panel, contrast media, utility pill)
- [ ] define component families and variants
- [ ] refactor common components onto the new system
- [ ] remove obvious scaffold-template feel

### Required deliverables

- design-token map in code
- font setup in app layout
- shared shell primitives
- button/input/card/table standards
- navigation component standards
- onboarding component standards

### Definition of done

The product looks like Yapsolutely, not like a starter project.

### Objective dependencies

- Objective 1 enables Objective 2
- Objective 2 enables Objectives 4, 5, and 6 to scale coherently
- Objective 7 must influence every page objective, but should be concretized first through the shell and landing/auth implementation

---

## Milestone grouping

## Milestone U1 — UI foundation

Includes:
- Objective 1
- Objective 2

Outcome:
- final app shell and information architecture

## Milestone U2 — first impression and onboarding

Includes:
- Objective 3

Outcome:
- premium first-run experience before dashboard access

## Milestone U3 — core product pages

Includes:
- Objective 4
- Objective 5
- Objective 6

Outcome:
- the main app looks like a real voice-agent platform

## Milestone U4 — Yapsolutely visual identity

Includes:
- Objective 7

Outcome:
- the product becomes visually distinctive and polished

---

## Current UI status board

| UI objective | Status | Notes |
|---|---|---|
| 1. Define UI architecture | planning complete | strong direction is now clear from Retell research plus the attached dashboard reference |
| 2. Build new app shell | not started | current shell is too early-stage and not Retell-like enough; Lovable can be used for first-pass shell exploration |
| 3. Rebuild landing/auth/onboarding | in progress | Lovable-assisted scaffolding is now approved for generating stronger first-pass marketing and onboarding directions before in-repo refinement |
| 4. Rebuild agent surfaces | not started | current routes exist but need major redesign |
| 5. Rebuild monitor surfaces | not started | calls pages work, but the visual system is still scaffold-grade |
| 6. Rebuild deploy/system surfaces | not started | numbers/settings exist, but batch calls and billing need scaffolds |
| 7. Establish visual system | planning complete | creative north star, type system, surface logic, contrast strategy, and component rules are now defined here; implementation in code has not started yet |

### Why the plan is now implementation-ready

The plan now includes:

- creative direction
- information architecture
- page inventory
- page archetypes
- design-system rules
- fidelity guardrails
- acceptance criteria
- execution order
- final font choice
- final card/overlay component direction

That is enough to continue from `continue` without repeated redefinition of the target look.

It is also enough to let external scaffolding happen without losing the source of truth.

---

## Non-negotiable UI finish line

The UI phase is only considered successful when:

1. the landing page feels premium enough for first impression
2. sign-in and onboarding feel productized
3. the app shell feels like a serious operator console
4. the agents area feels like the core workspace
5. calls and transcripts feel trustworthy and reviewable
6. the overall product no longer looks like a generic scaffold

---

## Immediate next step

The next immediate UI execution move is:

> use Lovable to scaffold the next landing/auth/app-shell direction, then pull the best result back here for detailed Yapsolutely refinement.

Why:

- it increases iteration speed dramatically
- it lets us compare composition options before hand-refining details
- it fits the current workflow preference
- it still preserves this file as the canonical taste contract

After that:

> normalize the imported result into the Yapsolutely design system and then continue into the app shell and flagship agent surfaces

---

## UI execution goals by outcome

To avoid ambiguity during implementation, the UI should be judged against these outcome-level goals.

### Goal 1 outcome — First impression quality

Landing, auth, and onboarding look premium enough that Karim sees product seriousness before live telephony proof.

### Goal 2 outcome — Operator trust

Once inside the app, the shell, tables, and detail views feel calm, readable, and high-value rather than improvised.

### Goal 3 outcome — Product cohesion

Every major route feels like part of one system, not a sequence of unrelated page experiments.

### Goal 4 outcome — Autonomous continuation

Future implementation can proceed from this document without repeated design clarification unless priorities intentionally change.

### Goal 5 outcome — Visual fidelity to the image

The finished product still visibly carries the image’s softness, hierarchy, asymmetry, and premium restraint even after adapting to software needs.

---

## Suggested implementation order

1. global app shell
2. landing + auth + onboarding
3. agents list
4. agent workspace
5. calls list + call detail
6. numbers + settings
7. analytics / QA / alerts / billing scaffolds
8. final design system refinement

---

## Summary

This UI master plan exists to ensure that Yapsolutely becomes:

- structurally Retell-like
- visually premium
- productized before funded Twilio validation
- clearly more intentional than the current scaffold
- ready to support both Karim’s expectations and your longer-term product ambition
