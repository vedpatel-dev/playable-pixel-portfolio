"use client";

import { useEffect, useState } from "react";

type Props = {
  phrases: readonly string[];
  className?: string;
};

const TYPE_MS = 55;
const ERASE_MS = 28;
const HOLD_MS = 1900;

/**
 * Cycles through phrases with a type-in / erase loop. One timeout at a time,
 * so it costs nothing while idle. Under reduced motion it renders the first
 * phrase statically.
 */
export function Typewriter({ phrases, className }: Props) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [erasing, setErasing] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const full = phrases[index % phrases.length];

    if (!erasing && text === full) {
      const t = setTimeout(() => setErasing(true), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (erasing && text === "") {
      setErasing(false);
      setIndex((i) => (i + 1) % phrases.length);
      return;
    }

    const t = setTimeout(
      () =>
        setText((prev) =>
          erasing ? prev.slice(0, -1) : full.slice(0, prev.length + 1),
        ),
      erasing ? ERASE_MS : TYPE_MS,
    );
    return () => clearTimeout(t);
  }, [text, erasing, index, phrases, reduced]);

  if (reduced) {
    return <span className={className}>{phrases[0]}</span>;
  }

  return (
    <span className={className}>
      <span>{text}</span>
      <span aria-hidden="true" className="animate-blink text-cyan">
        _
      </span>
    </span>
  );
}
