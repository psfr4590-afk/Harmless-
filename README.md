# Harmless-

> A privacy-first harm reduction app — no cloud, no accounts, no API keys, no data leaving your device.

Built for people who need real help finding real resources, without surveillance or barriers.

## What it does

- **AI Chat** — local harm reduction assistant powered by [Ollama](https://ollama.com). Non-judgmental, private, works offline. No API key, no cloud.
- **Community Resources** — searches public health databases (OpenStreetMap) for Narcan/naloxone, needle exchanges, shelters, free clinics, food pantries, and more near you.
- **Submit Resources** — crowdsource local services. All submissions stay on your device.

## Stack

React · TypeScript · Vite · Tailwind CSS · Ollama (local LLM) · localStorage

Zero Firebase. Zero Google. Zero telemetry.

## Run Locally

**Prerequisites:** Node.js, [Ollama](https://ollama.com) running locally

1. Install dependencies:
   ```
   npm install
   ```
2. Pull a model for the AI chat (default: `llama3.2:3b`):
   ```
   ollama pull llama3.2:3b
   ```
3. (Optional) Copy `.env.local.example` to `.env.local` to configure a different model or Ollama URL:
   ```
   VITE_OLLAMA_URL=http://127.0.0.1:11434
   VITE_OLLAMA_MODEL=llama3.2:3b
   ```
4. Start the app:
   ```
   npm run dev
   ```

Open `http://localhost:3000`

## Why no cloud?

People seeking harm reduction help shouldn't have to hand their data to Google. No login, no tracking, no third-party calls — just a tool that works.

## Contributing

Issues and PRs welcome. See open issues for the roadmap.
