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
- [x] T2 Source step: generate form (disabled while loading, loading reset on error, counter), upload drop zone (drag-over, non-audio rejection, loaded summary with replace). Route: delegated.
- [x] T2F Source follow-ups from T2 review: stale revoke/overwrite race when a source changes during pending generation (WARNING); SourceSummaryContainer tests (Replace routing, hidden state, label fallback, duration formatting) (WARNING); AudioDropZoneContainer revoke + label test; DropZone drag-depth counter (no flicker), drag-over overrides rejected, accept audio by extension when MIME is empty. Route: delegated.
- [x] T3 Space step: scene field with counter, example chips, loading state, auto-apply on generate, Reset to dry, error alert. Route: delegated.
- [x] T4 Listen step: scene diagram, summary + meters, raw JSON with copy, custom transport with A/B bypass in audio engine, context-suspended hint. Route: delegated.
- [x] T4F Listen follow-ups from T4 review: transport shows stale "Pause" after source swap (WARNING); Listen crashes on partial/malformed profile (WARNING); Retry-without-source test; RawProfile copy timer after unmount. Route: delegated.

## Acceptance criteria
- Visual match with the canvas artboards at desktop (≥1024px) and mobile (390px).
- No stuck loading state; buttons disabled while requests run; errors shown with danger styling and keep user input.
- Parameters visible without opening JSON; A/B toggle audibly bypasses effects.
- All checks pass.

## Progress / evidence
- T1 done (delegated writer): tests 48/48, check-types clean, biome exit 0 (2 pre-existing warnings in untouched files), build ok. RED observed for every new suite before implementation. Removed Badge/Card/Label/TextArea/AudioPlayer; added Field/StepCard/Alert/Chip/StatusPill/HeaderContainer; Tabs API is now items/value/onChange + TabPanel. VoiceGenerator loading reset moved to `finally`. Diff ~1,280 lines, mostly deletions of replaced components. Commit: `6fe7eb1 feat(frontend): redesign foundation tokens, base components and layout`.
- T1 review: assessed medium (slice_budget_reached), consent granted, single reliability lens → approved and acknowledged (lineage review-e61f920013993aac). Reviewed boundary now 6fe7eb1. Advisory follow-ups folded into later tasks: VoiceGenerator loading-reset/error test (WARNING) → T2; Tabs per-instance ids via useId → T2; Build space busy guard + try/catch (pre-existing) → T3; layout step done/active test, hasSpace should mean "applied" → T3.

- T2 done (delegated writer): tests 63/63 (parent re-ran), check-types clean, biome exit 0, build ok. RED observed (DropZone/SourceSummary missing, Tabs duplicate ids, VoiceGenerator 5/5 incl. unhandled rejection on throw). New DropZone, SourceSummary, SourceSummaryContainer, sourceIds; Tabs ids via useId (`idPrefix`); context `setAudioBlobUrl(url, label?)` stores `audioLabel`; failed generate keeps previous audio. Gaps: no test for duration probing or layout done state (layout test moves to T3). ~620 authored lines. Commit: `feat(frontend): redesign source step`.

- T2 review: medium (slice_budget_reached), consent granted, reliability lens → approved and acknowledged (lineage review-d2e0ae0264d65bca). Reviewed boundary now 5691bbd. Advisory findings → new task T2F.

- T2F done: tests 90/90 (parent re-ran), types, biome, build ok. RED: race test (blob:generated overwrote blob:upload), DropZone flicker/dragover/empty-MIME, formatDuration missing. Context `setAudioBlobUrl` now revokes the previous URL via ref and bumps a source version (`getSourceVersion`); superseded generations are dropped. Commit: `fix(frontend): harden source step after review`.

- T3 done: tests 101/101, types, biome, build ok. RED observed (11 new tests). Context adds `isEffectApplied` + `applyEffectsConfig`; `onApplyConfig` removed; request-token guard for stale/overlapping responses; Space step done only when applied. Raw JSON details still in Space container (T4 moves it). Dead `DeleteEffectsEditorContainer` left for T4 cleanup. Commit: `feat(frontend): redesign space step with auto-apply`.

- T2F+T3 slice review: medium (slice_budget_reached, 726 lines), consent granted, reliability lens → approved and acknowledged (lineage review-ff049fca87a1c400). Reviewed boundary now 6c76958. Advisory: Retry silently no-ops when description invalid / source cleared → folded into T4.

- T4 done: tests 146/146, types, biome exit 0, build ok. RED observed (15 tests + 10 missing-module suites, engine bypass, context, player, Retry). New helpers sceneGeometry/formatters; components SceneDiagram, SpaceSummary, ParameterMeters, RawProfile, Transport, AbCompare; ListenContainer; engine `setGraphBypass` + context `isBypassed/setBypassed/resumeAudio`; deleted DeleteEffectsEditorContainer and Pre. Retry follow-up fixed. Gaps: no visual comparison against artboards, no static waveform, mobile sticky untested (CSS only). ~1.5k lines (mostly new tests/components). Commit: `feat(frontend): redesign listen step with scene view and A/B transport`.

- T4 review: medium (1,649 lines), consent granted, reliability lens → approved and acknowledged (lineage review-1dae11e7cca40c59). Reviewed boundary now 0c44aca. Findings → T4F.

- T4F done: tests 161/161, types, biome exit 0, build ok. RED: stale-Pause source swap + emptied, partial-profile crash, RawProfile unmount timer. New `helpers/listenView` normalizer (`toListenView`); player derives from `el.paused` and listens to `emptied`. Retry-no-source test passed first run (T3 already handled it). Commit: `fix(frontend): harden listen step after review`.

- T4F review: medium (481 lines), consent granted, reliability lens → approved and acknowledged (lineage review-db45ee4df90aa233). Reviewed boundary now c196466. Suggestions left as optional follow-ups (not scheduled): RawProfile unmount test relies on timer count (console assert is weak); listenView cut ≤0 branch untested; scene distance ≤0 not rejected.

## Next step
Manual visual check in the browser against the canvas; then the user pushes and opens the PR.
