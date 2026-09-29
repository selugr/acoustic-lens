# UI redesign — studio console refresh

## Objective
Implement the approved "studio console" redesign of the web frontend (`frontend/`), keeping the product concept: get a voice (TTS or upload), describe an acoustic space, hear it spatialized.

## Problem / why
The current UI hides the audio parameters behind raw JSON, has no clear primary action, unstyled headings and errors, a stuck "Generating..." state after errors, no disabled/loading states, 10–13px uppercase text with low contrast, typos ("ACUSTIC", "Texto to voice"), and a native audio player that does not match the design.

## Design reference
Canvas: https://claude.ai/artifact/CfA8bfb46xpCzdG1PPe4am (artboards: Workstation desktop, Mobile, Component states).
Local artboard sources for this session: scratchpad `design/project/{Main,Mobile,States}.dc.html`.

## Scope
- Tokens and typography (Geist + Geist Mono, refined dark palette, readable sizes).
- Base components: Button (primary/secondary/ghost, loading, disabled), Field (label + counter + error), Tabs (a11y), Card/Step header, Alert, Chip, StatusPill.
- Layout: header with engine status, 2-column desktop (Source + Space | Listen), stacked mobile with pinned transport.
- Source step: generate/upload tabs, loading/error fixes, drop zone states, loaded summary.
- Space step: counter, example chips, loading, auto-apply on generate, "Reset to dry".
- Listen step: scene diagram (azimuth/distance), space summary and parameter meters from config, collapsible raw JSON with copy, custom transport (play/pause, time, progress/waveform) and A/B dry/space bypass.

## Constraints
- Keep container/presentational split and CSS modules; no new UI framework.
- English copy, sentence case.
- Strict TDD: RED before GREEN. Runner: `pnpm --filter acoustic-lens-frontend test` (vitest). Source: session config "Strict TDD Mode: enabled".
- Backend untouched.

## Delivery
- Branch: `feat/ui-redesign`. Strategy: ask-on-risk → chain strategy `feature-branch-chain` (user choice 2026-09-29).
- Forecast: ~1,500–2,000 authored changed lines. One work-unit commit (slice) per task.
- User pushes; never push from the agent.

## Checks (per task)
- `pnpm --filter acoustic-lens-frontend test`
- `pnpm --filter acoustic-lens-frontend check-types`
- `pnpm exec biome check frontend`
- `pnpm --filter acoustic-lens-frontend build`

## Tasks
- [x] T1 Foundation: tokens, fonts, title/favicon, base components (Button loading/disabled, Field with counter/error, Tabs a11y, StepCard, Alert, Chip, StatusPill), header + layout grid. Route: delegated (writer trigger, 2+ non-trivial files).
- [ ] T2 Source step: generate form (disabled while loading, loading reset on error, counter), upload drop zone (drag-over, non-audio rejection, loaded summary with replace). Route: delegated.
- [ ] T3 Space step: scene field with counter, example chips, loading state, auto-apply on generate, Reset to dry, error alert. Route: delegated.
- [ ] T4 Listen step: scene diagram, summary + meters, raw JSON with copy, custom transport with A/B bypass in audio engine, context-suspended hint. Route: delegated.

## Acceptance criteria
- Visual match with the canvas artboards at desktop (≥1024px) and mobile (390px).
- No stuck loading state; buttons disabled while requests run; errors shown with danger styling and keep user input.
- Parameters visible without opening JSON; A/B toggle audibly bypasses effects.
- All checks pass.

## Progress / evidence
- T1 done (delegated writer): tests 48/48, check-types clean, biome exit 0 (2 pre-existing warnings in untouched files), build ok. RED observed for every new suite before implementation. Removed Badge/Card/Label/TextArea/AudioPlayer; added Field/StepCard/Alert/Chip/StatusPill/HeaderContainer; Tabs API is now items/value/onChange + TabPanel. VoiceGenerator loading reset moved to `finally`. Diff ~1,280 lines, mostly deletions of replaced components. Commit: `feat(frontend): redesign foundation tokens, base components and layout`.

## Next step
T2 Source step.
