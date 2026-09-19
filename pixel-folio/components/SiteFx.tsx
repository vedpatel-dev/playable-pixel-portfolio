"use client";

import { useEffect, useRef, useState } from "react";
import { navSections } from "@/data/content";

const SPARK_COLORS = ["#46e0d0", "#ff5fa2", "#ffc24b", "#9d7bff", "#e8ecff"];

/** How long the unlocked banner stays up, and how long the section sweep runs. */
const TOAST_MS = 1800;
const SWEEP_MS = 900;
/** Lets the smooth scroll get most of the way there before the sweep fires. */
const SWEEP_DELAY_MS = 280;

type Stage = { stage: string; label: string };

const STAGES = new Map<string, Stage>(
  navSections
    .filter((s): s is typeof s & { stage: string } => s.stage !== null)
    .map((s) => [s.id, { stage: s.stage, label: s.label }]),
);

/**
 * Mounts once and owns every global effect:
 *   1. a single IntersectionObserver that reveals all [data-reveal] nodes
 *   2. pixel spark bursts on click
 *   3. the "stage unlocked" flourish — deliberately click-only, so it never
 *      fires while someone is just scrolling down the page
 * 1 and 2 bail out entirely under prefers-reduced-motion.
 */
export function SiteFx() {
  const [unlocked, setUnlocked] = useState<(Stage & { key: number }) | null>(
    null,
  );
  const keyRef = useRef(0);

  /* ---------- 1 + 2: reveals and click sparks ---------- */
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (reduced) {
      targets.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    targets.forEach((el) => observer.observe(el));

    // Anything already above the fold on load shows immediately.
    requestAnimationFrame(() => {
      targets.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
          el.setAttribute("data-shown", "");
          observer.unobserve(el);
        }
      });
    });

    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    let lastBurst = 0;
    const timers = new Set<number>();

    const burst = (event: PointerEvent) => {
      const now = performance.now();
      if (now - lastBurst < 140) return;
      lastBurst = now;

      const frag = document.createDocumentFragment();
      const count = 7;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const dist = 22 + Math.random() * 26;
        const dot = document.createElement("i");
        dot.className = "spark";
        dot.style.left = `${event.clientX - 3}px`;
        dot.style.top = `${event.clientY - 3}px`;
        dot.style.background =
          SPARK_COLORS[(i + (now | 0)) % SPARK_COLORS.length];
        dot.style.setProperty("--sx", `${Math.cos(angle) * dist}px`);
        dot.style.setProperty("--sy", `${Math.sin(angle) * dist}px`);
        frag.appendChild(dot);
      }

      layer.appendChild(frag);
      const t = window.setTimeout(() => {
        layer.replaceChildren();
        timers.delete(t);
      }, 460);
      timers.add(t);
    };

    window.addEventListener("pointerdown", burst);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointerdown", burst);
      timers.forEach((t) => window.clearTimeout(t));
      layer.remove();
    };
  }, []);

  /* ---------- 3: stage unlocked ---------- */
  useEffect(() => {
    const timers = new Set<number>();
    const after = (ms: number, fn: () => void) => {
      const t = window.setTimeout(() => {
        timers.delete(t);
        fn();
      }, ms);
      timers.add(t);
    };

    const onClick = (event: MouseEvent) => {
      // Let modified clicks (new tab, etc.) behave normally, with no flourish.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const anchor = (event.target as Element | null)?.closest?.(
        'a[href^="#"]',
      );
      if (!anchor) return;

      const id = anchor.getAttribute("href")?.slice(1);
      const found = id ? STAGES.get(id) : undefined;
      if (!found) return;

      keyRef.current += 1;
      setUnlocked({ ...found, key: keyRef.current });
      after(TOAST_MS, () => setUnlocked(null));

      const section = document.getElementById(id!);
      if (!section) return;

      // Re-adding the attribute restarts the sweep when the same link is
      // clicked twice; the reflow read is what makes the restart stick.
      after(SWEEP_DELAY_MS, () => {
        section.removeAttribute("data-unlocked");
        void section.offsetWidth;
        section.setAttribute("data-unlocked", "");
        after(SWEEP_MS, () => section.removeAttribute("data-unlocked"));
      });
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      timers.forEach((t) => window.clearTimeout(t));
      document
        .querySelectorAll("[data-unlocked]")
        .forEach((el) => el.removeAttribute("data-unlocked"));
    };
  }, []);

  if (!unlocked) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-[84px] z-[62] flex justify-center px-4"
    >
      <div
        key={unlocked.key}
        data-accent="amber"
        className="stage-toast pixel-panel flex items-center gap-3 px-4 py-3"
      >
        <span className="led-slow inline-block h-[8px] w-[8px] shrink-0" />
        <span className="font-display text-[11px] leading-none text-[var(--accent)]">
          STAGE {unlocked.stage}
        </span>
        <span className="font-pixel text-[11px] leading-none tracking-[0.18em] text-muted">
          {unlocked.label} · UNLOCKED
        </span>
      </div>
    </div>
  );
}
