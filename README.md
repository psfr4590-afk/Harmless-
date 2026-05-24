<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Harmless-

A privacy-first harm reduction app — no cloud, no accounts, no data leaving your device.

- **AI Chat** powered by local [Ollama](https://ollama.com) models (no API key, fully offline)
- **Community Resources** — public health data via OpenStreetMap + crowdsourced local submissions
- **Local Storage** — all user data stays in the browser, nothing sent to any server

## Run Locally

**Prerequisites:** Node.js, [Ollama](https://ollama.com) running locally

1. Install dependencies:
   `npm install`
2. Pull a model for Ollama (default: `llama3.2:3b`):
   `ollama pull llama3.2:3b`
3. (Optional) Copy `.env.local.example` to `.env.local` and configure:
   ```
   VITE_OLLAMA_URL=http://127.0.0.1:11434
   VITE_OLLAMA_MODEL=llama3.2:3b
   ```
4. Run the app:
   `npm run dev`
