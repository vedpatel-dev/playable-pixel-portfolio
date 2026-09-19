"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { SUGGESTED_PROMPTS } from "@/lib/systemPrompt";
import { OPEN_AGENT_EVENT } from "./AgentTrigger";
import { PixelIcon } from "./PixelIcon";

type Role = "user" | "model" | "error";
type Message = { id: number; role: Role; content: string };

const GREETING =
  "GAME MASTER online. I've got Ved's full resume loaded — experience, projects, and the metrics behind them. Ask me anything you'd ask in a screening call.";

let nextId = 1;
const newId = () => nextId++;

const URL_RE = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?])/g;

/** Turns bare URLs in the model's reply into real links. */
function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  URL_RE.lastIndex = 0;

  while ((match = URL_RE.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    out.push(
      <a
        key={`${match.index}-${match[0]}`}
        href={match[0]}
        target="_blank"
        rel="noreferrer noopener"
        className="break-all text-cyan underline decoration-cyan/50 underline-offset-2 hover:decoration-cyan"
      >
        {match[0]}
      </a>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Builds the Gemini `contents` array from the transcript: errors are dropped,
 * and the leading greeting is trimmed so the conversation starts on a user
 * turn the way the API expects.
 */
function toPayload(messages: Message[], next: string) {
  const turns = messages
    .filter((m) => m.role !== "error" && m.content.trim() !== "")
    .map((m) => ({ role: m.role as "user" | "model", content: m.content }));

  while (turns.length > 0 && turns[0].role === "model") turns.shift();
  return [...turns, { role: "user" as const, content: next }];
}

/* -------------------------------------------------------------------------- */

export function AgentDock() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [engaged, setEngaged] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Refs mirror state so `send` can stay referentially stable across the
  // hundreds of re-renders a streaming reply causes.
  const messagesRef = useRef<Message[]>([]);
  const busyRef = useRef(false);
  const openRef = useRef(false);

  messagesRef.current = messages;
  busyRef.current = busy;
  openRef.current = open;

  /* ---------------------------- send ---------------------------- */

  const send = useCallback(async (raw: string) => {
    const text = raw.trim();
    if (!text || busyRef.current) return;

    const payload = toPayload(messagesRef.current, text);

    setInput("");
    setBusy(true);
    busyRef.current = true;

    const replyId = newId();
    setMessages((prev) => [
      ...prev,
      { id: newId(), role: "user", content: text },
      { id: replyId, role: "model", content: "" },
    ]);

    const fail = (content: string) =>
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== replyId)
          .concat({ id: newId(), role: "error", content }),
      );

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: payload }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        fail(data?.error ?? "Something went wrong reaching the model.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === replyId ? { ...m, content: acc } : m)),
        );
      }

      if (!acc.trim()) fail("The model returned an empty reply. Try again?");
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        setMessages((prev) => prev.filter((m) => m.id !== replyId));
      } else {
        fail("Connection dropped mid-answer. Check the network and retry.");
      }
    } finally {
      abortRef.current = null;
      busyRef.current = false;
      setBusy(false);
    }
  }, []);

  /* ---------------------------- effects ---------------------------- */

  // External "Ask My AI" buttons, optionally seeding a first question.
  useEffect(() => {
    let seedTimer: ReturnType<typeof setTimeout> | undefined;

    const onOpen = (event: Event) => {
      setOpen(true);
      setEngaged(true);
      const seed = (event as CustomEvent<{ seed?: string }>).detail?.seed;
      if (!seed) return;
      // Let the panel mount (and the greeting land) before the first token.
      clearTimeout(seedTimer);
      seedTimer = setTimeout(() => {
        if (openRef.current) void send(seed);
      }, 280);
    };

    window.addEventListener(OPEN_AGENT_EVENT, onOpen);
    return () => {
      clearTimeout(seedTimer);
      window.removeEventListener(OPEN_AGENT_EVENT, onOpen);
    };
  }, [send]);

  // Deep link: /#ask opens the assistant straight away, so the site can be
  // shared with the chat already in view.
  useEffect(() => {
    if (window.location.hash === "#ask") {
      setOpen(true);
      setEngaged(true);
    }
  }, []);

  // Esc closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Seed the greeting on first open and focus the composer.
  useEffect(() => {
    if (!open) return;
    setMessages((prev) =>
      prev.length === 0
        ? [{ id: newId(), role: "model", content: GREETING }]
        : prev,
    );
    const t = setTimeout(() => inputRef.current?.focus(), 240);
    return () => clearTimeout(t);
  }, [open]);

  // Stick to the bottom as tokens stream in.
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, busy]);

  // Abort any in-flight request on unmount.
  useEffect(() => () => abortRef.current?.abort(), []);

  const awaitingFirstToken =
    busy &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "model" &&
    messages[messages.length - 1].content === "";

  /* ---------------------------- render ---------------------------- */

  return (
    <>
      {/* ------------------------- Launcher ------------------------- */}
      {!open ? (
        <div className="fixed right-4 bottom-4 z-[64] flex items-center gap-3 sm:right-6 sm:bottom-6">
          {!engaged ? (
            <span
              className="pixel-border hidden bg-panel px-3 py-2 sm:block"
              style={{ animation: "slide-in-right 400ms ease-out 2.4s both" }}
            >
              <span className="font-pixel text-[11px] tracking-[0.12em] text-muted">
                ASK ME ABOUT VED
              </span>
            </span>
          ) : null}

          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setEngaged(true);
            }}
            aria-label="Open Game Master, the AI assistant"
            data-accent="magenta"
            className="pixel-btn animate-bob relative !h-[58px] !w-[58px] !justify-center !p-0 sm:!h-[64px] sm:!w-[64px]"
          >
            <span className="text-magenta">
              <PixelIcon name="bot" size={34} />
            </span>
            <span
              aria-hidden="true"
              className="absolute -top-1.5 -right-1.5 h-[10px] w-[10px] bg-green"
            />
          </button>
        </div>
      ) : null}

      {/* ------------------------- Backdrop (mobile) ------------------------- */}
      {open ? (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[63] bg-ink/70 sm:hidden"
        />
      ) : null}

      {/* ------------------------- Panel ------------------------- */}
      {open ? (
        <aside
          role="dialog"
          aria-label="Game Master AI assistant"
          data-accent="magenta"
          className="fixed inset-0 z-[65] flex flex-col bg-panel sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[420px] sm:border-l-[3px] sm:border-line"
          style={{ animation: "slide-in-right 220ms ease-out both" }}
        >
          {/* Title bar */}
          <header className="flex shrink-0 items-center gap-3 border-b-[3px] border-line bg-panel-hi px-4 py-3">
            <span className="pixel-border flex h-9 w-9 shrink-0 items-center justify-center bg-ink text-magenta">
              <PixelIcon name="bot" size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[11px] leading-none text-fg">
                GAME MASTER
              </p>
              <p className="font-pixel mt-1.5 flex items-center gap-2 text-[10px] tracking-[0.14em] text-dim">
                <span
                  className={`inline-block h-[6px] w-[6px] ${
                    busy ? "animate-blink bg-amber" : "bg-green"
                  }`}
                />
                {busy ? "THINKING…" : "READY"}
              </p>
            </div>

            {messages.length > 1 ? (
              <button
                type="button"
                onClick={() => {
                  abortRef.current?.abort();
                  setMessages([
                    { id: newId(), role: "model", content: GREETING },
                  ]);
                }}
                className="font-pixel px-2 py-1 text-[10px] tracking-[0.12em] text-dim transition-colors hover:text-fg"
              >
                RESET
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="pixel-border flex h-8 w-8 shrink-0 items-center justify-center bg-panel text-muted transition-colors hover:bg-magenta hover:text-ink"
            >
              <PixelIcon name="close" size={11} />
            </button>
          </header>

          {/* Transcript */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5"
          >
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="animate-msg-in flex justify-end">
                  <p
                    className="pixel-border max-w-[85%] bg-panel-hi px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap text-fg"
                    style={{ ["--pb" as string]: "#46e0d0" }}
                  >
                    {msg.content}
                  </p>
                </div>
              ) : msg.role === "error" ? (
                <div key={msg.id} className="animate-msg-in flex gap-2.5">
                  <span className="pixel-border mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center bg-ink text-amber">
                    <PixelIcon name="sparkle" size={12} />
                  </span>
                  <p
                    className="pixel-border max-w-[85%] bg-panel-hi px-3.5 py-2.5 text-[13px] leading-relaxed text-amber"
                    style={{ ["--pb" as string]: "#ffc24b" }}
                  >
                    {msg.content}
                  </p>
                </div>
              ) : (
                <div key={msg.id} className="animate-msg-in flex gap-2.5">
                  <span className="pixel-border mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center bg-ink text-magenta">
                    <PixelIcon name="bot" size={15} />
                  </span>
                  <div className="max-w-[85%] text-[13px] leading-[1.75] whitespace-pre-wrap text-fg">
                    {msg.content ? (
                      linkify(msg.content)
                    ) : awaitingFirstToken ? (
                      <span className="inline-flex items-center gap-1.5 py-1.5">
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="inline-block h-[7px] w-[7px] bg-magenta"
                            style={{
                              animation: `dot-bounce 1s steps(3, end) ${d * 0.15}s infinite`,
                            }}
                          />
                        ))}
                      </span>
                    ) : null}
                  </div>
                </div>
              ),
            )}

            {/* Suggested prompts, only before the first question */}
            {messages.length <= 1 && !busy ? (
              <div className="pt-2">
                <p className="eyebrow mb-3 text-[10px]">Try asking</p>
                <div className="flex flex-col gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void send(prompt)}
                      className="pixel-border bg-panel-hi px-3 py-2.5 text-left text-[12px] leading-snug text-muted transition-colors hover:bg-cyan hover:text-ink"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="shrink-0 border-t-[3px] border-line bg-panel-hi px-4 py-4"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                rows={1}
                maxLength={600}
                placeholder="Ask about Ved's work…"
                aria-label="Message Game Master"
                className="pixel-border max-h-28 min-h-[44px] flex-1 resize-none bg-ink px-3 py-3 text-[13px] leading-snug text-fg placeholder:text-dim focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                data-accent="magenta"
                className="pixel-btn !h-[44px] !w-[44px] !justify-center !p-0 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <PixelIcon name="send" size={13} />
              </button>
            </div>
            <p className="font-pixel mt-3 text-[10px] leading-relaxed tracking-[0.1em] text-dim">
              GEMINI-POWERED · ANSWERS COME FROM VED&apos;S RESUME ONLY
            </p>
          </form>
        </aside>
      ) : null}
    </>
  );
}
