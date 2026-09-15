"use client";

import { useEffect } from "react";

const SPARK_COLORS = ["#46e0d0", "#ff5fa2", "#ffc24b", "#9d7bff", "#e8ecff"];

/**
 * Mounts once and owns every global effect:
 *   1. a single IntersectionObserver that reveals all [data-reveal] nodes
 *   2. pixel spark bursts on click
 * Both bail out entirely under prefers-reduced-motion.
 */
export function SiteFx() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (reduced) {
      targets.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }

    // --- 1. scroll reveal -------------------------------------------------
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

    // --- 2. click sparks --------------------------------------------------
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

  return null;
}
