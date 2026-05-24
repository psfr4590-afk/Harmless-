/**
 * ollama.ts — Ollama / ANARCHY streaming client
 * Replaces Google Gemini. Talks to your local Ollama server (no API key, no cloud).
 *
 * Default endpoint: http://127.0.0.1:11434
 * Override via VITE_OLLAMA_URL environment variable.
 */

export const OLLAMA_BASE =
  (import.meta.env.VITE_OLLAMA_URL as string | undefined) ?? 'http://127.0.0.1:11434';

export const HARM_REDUCTION_MODEL =
  (import.meta.env.VITE_OLLAMA_MODEL as string | undefined) ?? 'llama3.2:3b';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT = `You are a non-judgmental harm reduction assistant built into the Harm.Less app.
Your role is to provide accurate, compassionate, evidence-based harm reduction information to people
who use drugs or are in crisis. You do NOT moralize, shame, or lecture about drug use.
You DO provide practical safety information: drug interactions, safer use practices, overdose prevention,
naloxone access, local resources, and crisis support.
Always recommend calling 911 or 988 for life-threatening emergencies.
Keep answers concise and practical. Use plain language.`;

/**
 * Stream a chat completion from Ollama.
 * Yields text tokens as they arrive.
 *
 * @param messages  conversation history
 * @param onToken   callback called for each streamed token
 * @returns         full response text
 */
export async function streamChat(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const body = {
    model: HARM_REDUCTION_MODEL,
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    stream: true,
    options: {
      temperature: 0.3,
      num_predict: 1024,
    },
  };

  const resp = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!resp.ok) {
    throw new Error(`Ollama error ${resp.status}: ${await resp.text()}`);
  }

  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  let full = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value, { stream: true }).split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const data = JSON.parse(line);
        const token: string = data?.message?.content ?? '';
        if (token) {
          full += token;
          onToken(token);
        }
        if (data?.done) return full;
      } catch {
        // partial JSON chunk — skip
      }
    }
  }
  return full;
}

/** Quick ping to check if Ollama is reachable. */
export async function pingOllama(): Promise<boolean> {
  try {
    const r = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(3000) });
    return r.ok;
  } catch {
    return false;
  }
}
