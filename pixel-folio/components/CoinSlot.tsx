"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { confession, profile } from "@/data/content";
import { AgentTrigger } from "./AgentTrigger";
import { PixelIcon } from "./PixelIcon";

/**
 * Pixel coin, one character per pixel:
 *   o rim   m face   l highlight   d centre emboss
 */
const COIN_ROWS = [
  "....oooo....",
  "..oommmmoo..",
  ".ommllllmmo.",
  "ommllmmllmmo",
  "omllmmmmllmo",
  "omlmmddmmlmo",
  "omlmmddmmlmo",
  "omllmmmmllmo",
  "ommllmmllmmo",
  ".ommllllmmo.",
  "..oommmmoo..",
  "....oooo....",
] as const;

const COIN_FILL: Record<string, string> = {
  o: "#7a4a0a",
  m: "#ffc24b",
  l: "#ffe9a8",
  d: "#a86a12",
};

const SPARK_GOLD = ["#ffc24b", "#ffe9a8", "#f2a91f", "#fff3c9"];

/** Drop tolerance around the slot, in px — generous so touch aiming is easy. */
const SLOT_PAD = 34;

/** Below this drag distance a pointer gesture counts as a tap, not a drag. */
const TAP_SLOP = 6;

function CoinSprite({ size }: { size: number }) {
  const h = COIN_ROWS.length;
  const w = COIN_ROWS[0].length;
  const rects: ReactElement[] = [];

  for (let y = 0; y < h; y++) {
    const row = COIN_ROWS[y];
    let x = 0;
    while (x < w) {
      const ch = row[x];
      if (ch === ".") {
        x += 1;
        continue;
      }
      let run = 1;
      while (x + run < w && row[x + run] === ch) run += 1;
      rects.push(
        <rect
          key={`${y}-${x}`}
          x={x}
          y={y}
          width={run}
          height={1}
          fill={COIN_FILL[ch]}
        />,
      );
      x += run;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className="relative block"
    >
      {rects}
    </svg>
  );
}

export function CoinSlot() {
  const [unlocked, setUnlocked] = useState(false);
  const [inserting, setInserting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [armed, setArmed] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showStory, setShowStory] = useState(false);

  const coinRef = useRef<HTMLButtonElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const startRef = useRef({ x: 0, y: 0 });
  const movedRef = useRef(0);
  const timersRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
    };
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    const t = window.setTimeout(() => {
      timersRef.current.delete(t);
      fn();
    }, ms);
    timersRef.current.add(t);
  }, []);

  const overSlot = useCallback((x: number, y: number) => {
    const r = slotRef.current?.getBoundingClientRect();
    if (!r) return false;
    return (
      x >= r.left - SLOT_PAD &&
      x <= r.right + SLOT_PAD &&
      y >= r.top - SLOT_PAD &&
      y <= r.bottom + SLOT_PAD
    );
  }, []);

  const burst = useCallback(() => {
    const slot = slotRef.current?.getBoundingClientRect();
    if (!slot) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const cx = slot.left + slot.width / 2;
    const cy = slot.top + slot.height / 2;

    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.45;
      const dist = 30 + Math.random() * 50;
      const dot = document.createElement("i");
      dot.className = "spark";
      dot.style.left = `${cx - 3}px`;
      dot.style.top = `${cy - 3}px`;
      dot.style.background = SPARK_GOLD[i % SPARK_GOLD.length];
      dot.style.setProperty("--sx", `${Math.cos(angle) * dist}px`);
      dot.style.setProperty("--sy", `${Math.sin(angle) * dist}px`);
      layer.appendChild(dot);
    }

    after(700, () => layer.remove());
  }, [after]);

  const insert = useCallback(() => {
    if (inserting || unlocked) return;
    setInserting(true);
    setArmed(false);

    // Fly the coin from wherever it currently sits into the slot mouth.
    const coin = coinRef.current?.getBoundingClientRect();
    const slot = slotRef.current?.getBoundingClientRect();
    if (coin && slot) {
      setOffset((prev) => ({
        x: prev.x + (slot.left + slot.width / 2 - (coin.left + coin.width / 2)),
        y: prev.y + (slot.top + slot.height / 2 - (coin.top + coin.height / 2)),
      }));
    }

    after(300, burst);
    after(520, () => setUnlocked(true));
  }, [after, burst, inserting, unlocked]);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (unlocked || inserting) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current = 0;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    movedRef.current = Math.max(movedRef.current, Math.hypot(dx, dy));
    setOffset({ x: dx, y: dy });
    setArmed(overSlot(e.clientX, e.clientY));
  };

  const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    setDragging(false);
    setArmed(false);

    // A tap counts too: dragging is the fun path, tapping is the accessible one.
    if (overSlot(e.clientX, e.clientY) || movedRef.current < TAP_SLOP) {
      insert();
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const idle = !dragging && !inserting && !unlocked;
  const coinTransition = inserting
    ? "transform 300ms cubic-bezier(.2,.8,.3,1), opacity 200ms linear 200ms"
    : dragging
      ? "none"
      : "transform 260ms cubic-bezier(.16,1,.3,1)";

  return (
    <div
      data-reveal
      data-accent="amber"
      className="pixel-panel mt-4 overflow-hidden"
    >
      <div className="relative px-5 py-9 text-center sm:px-8 sm:py-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #ffc24b 0 8px, transparent 8px 18px)",
          }}
        />

        <div className="relative">
          <p
            role="status"
            className={`font-display text-[13px] text-amber sm:text-[15px] ${
              unlocked ? "" : "animate-blink"
            }`}
          >
            {unlocked
              ? "★ CREDIT 1 — PLAYER READY ★"
              : "★ INSERT COIN TO CONTINUE ★"}
          </p>

          <p className="mx-auto mt-6 max-w-lg text-[14px] leading-relaxed text-muted">
            {unlocked
              ? "Nice shot. Everything below is live — pick a channel, quiz the bot, or dig up something embarrassing."
              : "Recruiting, collaborating, or just curious how the MCP servers work? Drag the coin into the slot to light up the controls."}
          </p>

          {/* --- coin + slot rig ------------------------------------------ */}
          {!unlocked ? (
            <div className="mt-8 flex items-center justify-center gap-4 sm:gap-7">
              <div className="flex flex-col items-center gap-2">
                <button
                  ref={coinRef}
                  type="button"
                  aria-label="Insert the arcade coin to unlock the contact buttons"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  className={`coin-grab relative cursor-grab border-0 bg-transparent p-0 active:cursor-grabbing ${
                    idle ? "coin-idle" : ""
                  }`}
                  style={{
                    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
                    transition: coinTransition,
                    opacity: inserting ? 0 : 1,
                    zIndex: dragging || inserting ? 40 : undefined,
                  }}
                >
                  {idle && (
                    <span
                      aria-hidden="true"
                      className="coin-halo absolute inset-0 -z-10 rounded-full bg-amber blur-md"
                    />
                  )}
                  <span className="block sm:hidden">
                    <CoinSprite size={48} />
                  </span>
                  <span className="hidden sm:block">
                    <CoinSprite size={56} />
                  </span>
                </button>
                <span className="eyebrow animate-blink text-[10px] text-amber">
                  Drag me
                </span>
              </div>

              <span aria-hidden="true" className="text-dim">
                <PixelIcon name="send" size={14} />
              </span>

              {/* Slot mouth */}
              <div className="flex flex-col items-center gap-2">
                <div
                  ref={slotRef}
                  className={`pixel-border flex h-[64px] w-[46px] items-center justify-center bg-ink ${
                    inserting ? "slot-flash" : armed ? "slot-armed" : "slot-wait"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="block h-[34px] w-[8px] bg-line"
                  />
                </div>
                <span className="eyebrow text-[10px]">Slot</span>
              </div>
            </div>
          ) : (
            <p className="credit-pop eyebrow mt-8 text-[11px] text-amber">
              ● credit 1 &nbsp;·&nbsp; controls online
            </p>
          )}

          {/* --- the locked rack ------------------------------------------ */}
          <div
            inert={!unlocked}
            className={`mt-8 flex flex-wrap justify-center gap-3 transition-[opacity,filter] duration-500 ${
              unlocked ? "" : "rack-locked"
            }`}
          >
            <a
              href={`mailto:${profile.email}`}
              className="pixel-btn pixel-btn-primary"
            >
              <PixelIcon name="mail" size={14} />
              Email Ved
            </a>

            <AgentTrigger
              className="pixel-btn"
              seed="Why should we interview him?"
            >
              <span data-accent="magenta" className="flex items-center gap-2">
                <PixelIcon name="bot" size={16} />
                Ask the Bot
              </span>
            </AgentTrigger>

            <button
              type="button"
              onClick={() => setShowStory((v) => !v)}
              aria-expanded={showStory}
              className="pixel-btn"
            >
              <span data-accent="amber" className="flex items-center gap-2">
                <PixelIcon name="sparkle" size={14} />
                {confession.buttonLabel}
              </span>
            </button>
          </div>

          {!unlocked && (
            <p className="eyebrow mt-4 text-[10px] text-dim">
              ▲ locked — one credit required
            </p>
          )}

          {unlocked && showStory && (
            <div
              data-accent="magenta"
              className="pixel-panel credit-pop mx-auto mt-6 max-w-lg p-5 text-left"
            >
              <p className="eyebrow text-[11px] text-[var(--accent)]">
                {confession.heading}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                {confession.story}
              </p>
              <p className="font-pixel mt-4 text-[12px] text-dim">
                {confession.kicker}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
