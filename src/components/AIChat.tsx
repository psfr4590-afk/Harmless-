import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, User, Loader2, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { streamChat, pingOllama, ChatMessage, HARM_REDUCTION_MODEL } from '../lib/ollama';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

const SUGGESTED = [
  'What are the signs of an opioid overdose?',
  'How do I use naloxone / Narcan?',
  'Is it safe to mix alcohol and benzos?',
  'Where can I get free fentanyl test strips?',
  'What is harm reduction?',
  'How do I talk to a friend who is using?',
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ollamaOnline, setOllamaOnline] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check Ollama on mount
  useEffect(() => {
    (async () => {
      setChecking(true);
      const ok = await pingOllama();
      setOllamaOnline(ok);
      setChecking(false);
    })();
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const recheck = useCallback(async () => {
    setChecking(true);
    const ok = await pingOllama();
    setOllamaOnline(ok);
    setChecking(false);
  }, []);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading || !ollamaOnline) return;

    const userMsg: Message = { id: uid(), role: 'user', content: trimmed };
    const assistantId = uid();
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', streaming: true };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    setLoading(true);

    const history: ChatMessage[] = messages.map(m => ({ role: m.role, content: m.content }));
    history.push({ role: 'user', content: trimmed });

    abortRef.current = new AbortController();

    try {
      await streamChat(
        history,
        (token) => {
          setMessages(prev =>
            prev.map(m => m.id === assistantId
              ? { ...m, content: m.content + token }
              : m
            )
          );
        },
        abortRef.current.signal,
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMessages(prev =>
          prev.map(m => m.id === assistantId
            ? { ...m, content: '⚠️ Connection lost. Make sure Ollama is running: `ollama serve`', streaming: false }
            : m
          )
        );
      }
    } finally {
      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, streaming: false } : m)
      );
      setLoading(false);
      abortRef.current = null;
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [loading, ollamaOnline, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const stopGeneration = () => {
    abortRef.current?.abort();
  };

  // ── Offline state ─────────────────────────────────────────────────────────
  if (checking) {
    return (
      <div className="flex flex-col h-full bg-[#121212] items-center justify-center gap-4 text-white/60">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF1493]" />
        <p className="text-sm font-bold uppercase tracking-widest">Checking Ollama connection…</p>
      </div>
    );
  }

  if (ollamaOnline === false) {
    return (
      <div className="flex flex-col h-full bg-[#121212] items-center justify-center p-6 text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-white mb-2">Ollama Offline</h2>
          <p className="text-white/60 text-sm max-w-xs leading-relaxed">
            The AI assistant requires a local Ollama server. Start it in your terminal:
          </p>
          <code className="block mt-3 px-4 py-2 bg-white/10 rounded-xl text-[#FF69B4] font-mono text-sm">
            ollama serve
          </code>
          <p className="text-white/40 text-xs mt-2">
            Model: <span className="text-[#FF69B4]">{HARM_REDUCTION_MODEL}</span>
          </p>
        </div>
        <button
          onClick={recheck}
          className="flex items-center gap-2 px-6 py-3 bg-[#FF1493] rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  // ── Chat UI ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-[#121212]">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-6 pt-8 pb-4"
          >
            <div className="w-16 h-16 rounded-full bg-[#FF1493]/20 flex items-center justify-center">
              <Bot className="w-8 h-8 text-[#FF69B4]" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-black uppercase tracking-widest text-[#FF69B4]">Harm Reduction AI</h2>
              <p className="text-white/50 text-sm mt-2 max-w-xs leading-relaxed">
                Non-judgmental, evidence-based harm reduction support. Powered by your local ANARCHY / Ollama.
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Zap className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-bold uppercase tracking-widest">Local · No Cloud · Private</span>
              </div>
            </div>

            <div className="w-full max-w-md space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-white/30 text-center mb-3">Suggested Questions</p>
              {SUGGESTED.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FF1493]/40 transition-all text-sm text-white/70"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#FF1493]/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-[#FF69B4]" />
                </div>
              )}

              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#FF1493] text-white rounded-br-sm'
                    : 'bg-white/10 text-white/90 rounded-bl-sm'
                }`}
              >
                {msg.content}
                {msg.streaming && (
                  <span className="inline-block w-1.5 h-4 bg-[#FF69B4] ml-1 animate-pulse align-text-bottom rounded-sm" />
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-white/60" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-white/10 p-4 bg-[#121212]">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end max-w-4xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about harm reduction…"
            rows={1}
            disabled={loading}
            className="flex-1 resize-none bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF1493]/60 text-sm leading-relaxed disabled:opacity-50 max-h-40 overflow-y-auto"
            style={{ minHeight: '48px' }}
          />
          {loading ? (
            <button
              type="button"
              onClick={stopGeneration}
              className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors shrink-0"
              title="Stop generation"
            >
              <span className="w-3 h-3 bg-red-400 rounded-sm" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-12 h-12 rounded-full bg-[#FF1493] flex items-center justify-center text-white hover:scale-105 transition-transform disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </form>
        <p className="text-center text-xs text-white/20 mt-2 font-bold uppercase tracking-widest">
          Not a substitute for emergency services · Call 911 for emergencies
        </p>
      </div>
    </div>
  );
}
