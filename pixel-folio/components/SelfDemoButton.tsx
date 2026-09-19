"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PixelIcon } from "./PixelIcon";

/**
 * "Live Demo" for the project that *is* this page. Linking out would just
 * reload the same site, so instead the button owns up to the recursion.
 */

const GAGS = [
  {
    title: "Recursion detected",
    body: "You're standing in the live demo. This page is the project. Achievement unlocked: LOOK DOWN.",
  },
  {
    title: "Portal leads here",
    body: "Warped you to the demo — it was the room you were already in. Refund issued in imaginary coins.",
  },
  {
    title: "404: elsewhere not found",
    body: "Tried to load the deployment. Turns out it loaded you first. Scroll around, it's all live.",
  },
] as const;

export function SelfDemoButton() {
  const [gag, setGag] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const poke = useCallback(() => {
    // Cycle the gag so a second click isn't the same joke twice.
    setGag((prev) => (prev === null ? 0 : (prev + 1) % GAGS.length));
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setGag(null), 6000);
  }, []);

  const shown = gag === null ? null : GAGS[gag];

  return (
    <>
      <button
        type="button"
        onClick={poke}
        aria-expanded={shown !== null}
        className="pixel-btn pixel-btn-primary !px-4 !py-2.5 !text-[12px]"
      >
        <PixelIcon name="external" size={13} />
        Live Demo
      </button>

      {shown ? (
        <div
          role="status"
          data-accent="green"
          className="pixel-panel credit-pop mt-1 w-full p-4"
        >
          <p className="font-pixel flex items-center gap-2 text-[11px] tracking-[0.14em] text-[var(--accent)]">
            <span className="led-slow inline-block h-[8px] w-[8px] shrink-0" />
            {shown.title.toUpperCase()}
          </p>
          <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
            {shown.body}
          </p>
        </div>
      ) : null}
    </>
  );
}
