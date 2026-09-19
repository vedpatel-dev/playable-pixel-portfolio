"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { confession } from "@/data/content";
import { PixelIcon } from "./PixelIcon";

/**
 * The lock on cringe.log: a scanner head ping-pongs across a pixel track and
 * you have to stop it inside the target band. One button, one input, no
 * instructions needed — and the band widens on every miss so the joke is
 * always reachable.
 */

/** Target band width, as a percentage of the track. */
const BAND_START = 16;
const BAND_GROWTH = 5;
const BAND_MAX = 38;

/** Milliseconds for one left-to-right pass of the scanner. */
const SWEEP_MS = 1450;
const SWEEP_MS_CALM = 2900;

/** Sparks thrown on a successful lock — cool colours, unlike the coin's gold. */
const SPARK_DECRYPT = ["#46e0d0", "#9d7bff", "#7ee787", "#e8ecff"];

type Phase = "idle" | "running" | "hit" | "miss";

/** A band centre that keeps the whole band on-track, with a little margin. */
function rollCentre(width: number): number {
  const half = width / 2;
  return half + 4 + Math.random() * (100 - width - 8);
}

export function CringeGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [band, setBand] = useState({ centre: 62, width: BAND_START });
  const [tries, setTries] = useState(0);
  const [open, setOpen] = useState(false);

  const markerRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<Set<number>>(new Set());

  /** Scanner position, 0..1. Lives in a ref so 60fps never re-renders React. */
  const posRef = useRef(0);
  const startedRef = useRef(0);
  const sweepRef = useRef(SWEEP_MS);
  const calmRef = useRef(false);

  useEffect(() => {
    calmRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    sweepRef.current = calmRef.current ? SWEEP_MS_CALM : SWEEP_MS;
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    const t = window.setTimeout(() => {
      timersRef.current.delete(t);
      fn();
    }, ms);
    timersRef.current.add(t);
  }, []);

  const halt = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    halt();
    setBand((prev) => ({ ...prev, centre: rollCentre(prev.width) }));
    setPhase("running");
    startedRef.current = performance.now();

    const sweep = sweepRef.current;
    const loop = (now: number) => {
      // Ping-pong: the first half of the cycle runs out, the second runs back.
      const cycle = ((now - startedRef.current) % (sweep * 2)) / sweep;
      const p = cycle <= 1 ? cycle : 2 - cycle;
      posRef.current = p;
      // Written straight to the DOM — `left` is deliberately absent from the
      // JSX style prop so React re-renders never snap the head back.
      if (markerRef.current) markerRef.current.style.left = `${p * 100}%`;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [halt]);

  const burst = useCallback(() => {
    if (calmRef.current) return;
    const rect = markerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 22; i++) {
      const angle = (Math.PI * 2 * i) / 22 + Math.random() * 0.4;
      const dist = 26 + Math.random() * 58;
      const dot = document.createElement("i");
      dot.className = "spark";
      dot.style.left = `${cx - 3}px`;
      dot.style.top = `${cy - 3}px`;
      dot.style.background = SPARK_DECRYPT[i % SPARK_DECRYPT.length];
      dot.style.setProperty("--sx", `${Math.cos(angle) * dist}px`);
      dot.style.setProperty("--sy", `${Math.sin(angle) * dist}px`);
      layer.appendChild(dot);
    }

    after(700, () => layer.remove());
  }, [after]);

  const fire = useCallback(() => {
    halt();
    const p = posRef.current * 100;
    const locked = Math.abs(p - band.centre) <= band.width / 2;
    setTries((n) => n + 1);

    if (locked) {
      setPhase("hit");
      burst();
      after(620, () => setOpen(true));
      return;
    }

    setPhase("miss");
    // Every miss makes the next attempt easier, up to a generous ceiling.
    setBand((prev) => ({
      centre: prev.centre,
      width: Math.min(BAND_MAX, prev.width + BAND_GROWTH),
    }));
    after(720, () => setPhase("idle"));
  }, [after, band.centre, band.width, burst, halt]);

  /* ---------------------------- render ---------------------------- */

  const status =
    phase === "running"
      ? "Scanning…"
      : phase === "hit"
        ? "Lock on — decrypting"
        : phase === "miss"
          ? "Missed — band widened"
          : tries > 0
            ? "Recalibrated. Go again."
            : "Awaiting scan";

  const buttonLabel =
    phase === "running"
      ? "Stop"
      : phase === "hit"
        ? "Locked on"
        : phase === "miss"
          ? "Miss"
          : tries > 0
            ? "Try again"
            : "Start scan";

  const slug = open
    ? "Decrypted"
    : tries > 0
      ? `Try ${String(tries + 1).padStart(2, "0")}`
      : "Locked";

  return (
    <div
      data-accent={open ? "magenta" : "violet"}
      className="pixel-panel credit-pop mx-auto mt-6 max-w-xl text-left"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b-[3px] border-line bg-panel-hi px-4 py-2.5">
        <span className="text-[var(--accent)]">
          <PixelIcon name={open ? "sparkle" : "lock"} size={12} />
        </span>
        <span className="font-pixel text-[11px] tracking-[0.16em] text-muted">
          {open ? confession.heading : confession.lockedHeading}
        </span>
        <span className="font-pixel ml-auto text-[10px] tracking-[0.14em] text-dim">
          {slug.toUpperCase()}
        </span>
      </div>

      {open ? (
        <div className="cringe-reveal p-5 sm:p-6">
          <p className="text-[14px] leading-relaxed text-fg">
            {confession.story}
          </p>
          <p className="font-pixel mt-4 text-[12px] text-dim">
            {confession.kicker}
          </p>
          <p className="eyebrow mt-5 text-[10px] text-[var(--accent)]">
            ★ cracked in {tries} {tries === 1 ? "try" : "tries"} ★
          </p>
        </div>
      ) : (
        <div className={`p-5 sm:p-6 ${phase === "miss" ? "cringe-shake" : ""}`}>
          <p className="text-[13px] leading-relaxed text-muted">
            {confession.lockedBlurb}
          </p>

          <div className="pixel-border relative mt-5 h-[46px] w-full overflow-hidden bg-ink">
            <span aria-hidden="true" className="cringe-ticks absolute inset-0" />
            <span
              aria-hidden="true"
              className={`cringe-band absolute inset-y-0 ${
                phase === "hit" ? "is-hit" : ""
              }`}
              style={{
                left: `${band.centre - band.width / 2}%`,
                width: `${band.width}%`,
              }}
            />
            <span
              ref={markerRef}
              aria-hidden="true"
              className="cringe-marker absolute inset-y-0 left-0"
            />
            {phase === "hit" ? (
              <span aria-hidden="true" className="cringe-flash absolute inset-0" />
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button
              type="button"
              onClick={phase === "running" ? fire : start}
              disabled={phase === "hit" || phase === "miss"}
              className="pixel-btn disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PixelIcon name="target" size={14} />
              {buttonLabel}
            </button>
            <p
              role="status"
              className="font-pixel text-[11px] tracking-[0.12em] text-dim"
            >
              {status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
