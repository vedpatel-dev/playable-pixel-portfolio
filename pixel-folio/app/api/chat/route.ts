import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash";
const BASE_URL =
  process.env.GEMINI_BASE_URL ?? "https://generativelanguage.googleapis.com";
const ENDPOINT =
  `${BASE_URL}/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`;

const MAX_TURNS = 20;
const MAX_CHARS = 1200;

/** Best-effort in-memory rate limit. Resets on cold start; that's fine here. */
const RATE_LIMIT = { windowMs: 10 * 60_000, max: 25 };
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT.windowMs,
  );
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound.
  if (hits.size > 5000) {
    for (const [key, stamps] of hits) {
      if (stamps.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT.max;
}

type IncomingMessage = { role: "user" | "model"; content: string };

function parseBody(body: unknown): IncomingMessage[] | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages: IncomingMessage[] = [];
  for (const item of raw.slice(-MAX_TURNS)) {
    if (typeof item !== "object" || item === null) return null;
    const { role, content } = item as Record<string, unknown>;
    if (role !== "user" && role !== "model") return null;
    if (typeof content !== "string") return null;
    const trimmed = content.trim();
    if (!trimmed) continue;
    messages.push({ role, content: trimmed.slice(0, MAX_CHARS) });
  }

  if (messages.length === 0) return null;
  if (messages[messages.length - 1].role !== "user") return null;
  return messages;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "The assistant isn't configured yet — GEMINI_API_KEY is missing on the server.",
      },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Whoa there — too many questions at once. Try again shortly." },
      { status: 429 },
    );
  }

  let messages: IncomingMessage[] | null;
  try {
    messages = parseBody(await request.json());
  } catch {
    messages = null;
  }
  if (!messages) {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          temperature: 0.6,
          topP: 0.95,
          maxOutputTokens: 700,
          // 2.5 Flash reasons by default; off keeps replies snappy and cheap.
          thinkingConfig: { thinkingBudget: 0 },
        },
        safetySettings: [
          "HARM_CATEGORY_HARASSMENT",
          "HARM_CATEGORY_HATE_SPEECH",
          "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          "HARM_CATEGORY_DANGEROUS_CONTENT",
        ].map((category) => ({ category, threshold: "BLOCK_ONLY_HIGH" })),
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the model. Check your connection." },
      { status: 502 },
    );
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("Gemini error", upstream.status, detail.slice(0, 500));
    const message =
      upstream.status === 429
        ? "The model is rate-limited right now. Give it a minute."
        : upstream.status === 400 || upstream.status === 403
          ? "The server rejected the API key or request. Check GEMINI_API_KEY."
          : "The model had a problem answering that. Try rephrasing?";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // Re-emit the SSE payload as a plain UTF-8 text stream of deltas.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const json = JSON.parse(payload);
          const parts = json?.candidates?.[0]?.content?.parts;
          if (!Array.isArray(parts)) continue;
          for (const part of parts) {
            if (typeof part?.text === "string" && part.text) {
              controller.enqueue(encoder.encode(part.text));
            }
          }
        } catch {
          // A partial JSON frame — the next chunk completes it.
        }
      }
    },
  });

  return new Response(upstream.body.pipeThrough(stream), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-accel-buffering": "no",
    },
  });
}
