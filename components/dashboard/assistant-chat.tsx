"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import ReactMarkdown from "react-markdown";
import { Bot, Send, User, AlertTriangle } from "lucide-react";
import { SEND_ASSISTANT_MESSAGE } from "@/lib/graphql/queries";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

const SUGGESTIONS = [
  "What shipped this week?",
  "Who's blocked right now?",
  "Is anyone overloaded?",
  "Summarize this week's incidents",
];

export function AssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask me about your team's activity — deploys, review load, incidents or who might be overloaded.",
    },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sendMessage, { loading }] = useMutation<
    { sendAssistantMessage: { id: string; role: string; content: string } },
    { content: string }
  >(SEND_ASSISTANT_MESSAGE);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content || loading) return;
    setError(null);
    setInput("");
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", content }]);

    try {
      const { data } = await sendMessage({ variables: { content } });
      const full = data?.sendAssistantMessage.content ?? "";
      const id = `a-${Date.now()}`;
      setMessages((m) => [...m, { id, role: "assistant", content: "", streaming: true }]);
      streamIn(full, id, setMessages);
    } catch {
      setError("The assistant couldn't respond. Try again.");
    }
  }

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col overflow-hidden rounded-2xl border border-canvas-line bg-canvas-raised">
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-5">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                m.role === "user" ? "bg-canvas-line" : "bg-accent/15"
              }`}
            >
              {m.role === "user" ? (
                <User className="h-4 w-4 text-text-muted" />
              ) : (
                <Bot className="h-4 w-4 text-accent" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 font-body text-sm ${
                m.role === "user"
                  ? "bg-accent text-canvas"
                  : "bg-canvas text-text-primary border border-canvas-line"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none [&_strong]:text-text-primary [&_em]:text-text-muted [&_ul]:my-1 [&_li]:my-0.5">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                  {m.streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-accent align-middle" />}
                </div>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15">
              <Bot className="h-4 w-4 text-accent" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl border border-canvas-line bg-canvas px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-4 py-2.5 font-body text-sm text-danger">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 border-t border-canvas-line px-5 py-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="rounded-full border border-canvas-line px-3 py-1.5 font-body text-xs text-text-muted transition-colors hover:border-accent hover:text-text-primary"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-canvas-line p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your team's pulse…"
          className="flex-1 rounded-full border border-canvas-line bg-canvas px-4 py-2.5 font-body text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

// Simulates a streaming token-by-token response client-side. The mock
// mutation resolves with the full answer immediately; this reveals it
// progressively so the UI exercises real streaming states (partial content,
// a blinking cursor) the same way it would against a real SSE/stream API.
function streamIn(
  full: string,
  id: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) {
  const words = full.split(" ");
  let i = 0;
  const interval = setInterval(() => {
    i += 1;
    const partial = words.slice(0, i).join(" ");
    setMessages((m) =>
      m.map((msg) => (msg.id === id ? { ...msg, content: partial, streaming: i < words.length } : msg))
    );
    if (i >= words.length) clearInterval(interval);
  }, 35);
}
