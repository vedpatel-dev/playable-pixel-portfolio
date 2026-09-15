"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  accent: string;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function StatCounter({
  value,
  decimals = 0,
  suffix = "",
  label,
  accent,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        const duration = 1200;
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setShown(value * easeOutCubic(t));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  const text =
    decimals > 0
      ? shown.toFixed(decimals)
      : Math.round(shown).toLocaleString("en-US");

  return (
    <div
      ref={ref}
      data-accent={accent}
      className="pixel-panel px-4 py-4 text-center sm:px-5"
    >
      <div className="font-display text-[var(--accent)] text-emboss text-[18px] leading-none sm:text-[22px]">
        {text}
        {suffix}
      </div>
      <div className="eyebrow mt-3 text-[10px] leading-tight sm:text-[11px]">
        {label}
      </div>
    </div>
  );
}
