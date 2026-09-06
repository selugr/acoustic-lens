# Acoustic Lens

An experimental workstation for generating AI voices and placing them inside an acoustic space described in natural language. You write (or upload) an audio, describe the environment it should sound in ("a medium-sized church, a few meters to my left") and the app builds a real-time 3D space in the browser using the Web Audio API — HRTF panning, reverb, filters, compression — that matches that description.

## Stack

- **Frontend**: React 19 + Vite + TypeScript, Web Audio API for the spatial effects processing.
- **Backend**: Express 5 + TypeScript, two external integrations:
  - [Groq](https://console.groq.com) (structured outputs) translates the environment description into an acoustic profile (`SpatialAudioConfig`).
  - [ElevenLabs](https://elevenlabs.io) generates the voice from text.
- **Monorepo**: pnpm workspaces + Turborepo (`frontend`, `backend`, `common` with shared types and helpers).
- **Tooling**: Biome (lint/format), Vitest + Supertest (backend tests).

## Requirements

- Node `>=24` (see `.nvmrc`)
- pnpm `10.22.0`
- A [Groq](https://console.groq.com/keys) API key and an [ElevenLabs](https://elevenlabs.io/app/settings/api-keys) API key

## Getting started

```bash
pnpm install

cp backend/default.env backend/.env
# fill in ELEVENLABS_API_KEY and GROQ_API_KEY in backend/.env

pnpm dev
```

This starts the backend on `http://localhost:3020` and the frontend on `http://localhost:5173` (Vite proxies `/api` to the backend, see `frontend/vite.config.ts`).

## How to try it

1. **Get an audio.** On the **Generate** tab, write a short text (5-50 characters) and click **Generate Voice**: the backend calls ElevenLabs (`POST /api/voices/textToSpeech`) and returns the audio as a blob. Alternatively, use the **Upload** tab to drag or select your own audio file.
2. **Describe the environment.** Once an audio is loaded, the **Audio Profile** card appears. There you describe the acoustic scene in free text (5-100 characters) — source position, type of space, distance, texture ("in a medium-sized church, a few meters to my left") — and click **Generate Profile**. This calls Groq (`POST /api/audio-config/textToAudioProfile`), which returns a structured `SpatialAudioConfig` (3D position, room type, RT60, filters, compression...). You can inspect the resulting JSON by expanding **JSON Config**.
3. **Apply the effect.** **Apply** button: builds the Web Audio API graph live (HRTF panning, reverb, cutoff filters, compression) and connects it to the audio source. **Reset** disconnects the effects and returns to the dry audio.
4. **Play it.** Use the native controls on the player that appears below. The `AudioContext` state (`running` / `suspended`) is shown next to it.

## Scripts

From the root (via Turborepo):

```bash
pnpm dev            # frontend + backend in watch mode
pnpm build           # build both packages
pnpm check-types     # type checking
pnpm format-and-lint # Biome (lint + format, --fix with format-and-lint:fix)
```

Backend (`cd backend`):

```bash
pnpm test            # vitest
pnpm test:coverage    # with coverage
```

## Structure

```
backend/   Express API (routes -> controllers -> services -> clients)
frontend/  React UI (containers/components + Web Audio API)
common/    Shared types and validation helpers (@common/*)
```

## License

ISC — see [LICENSE](./LICENSE).
