"use client";

import type { ReactNode } from "react";

export const OPEN_AGENT_EVENT = "pixelbot:open";

/**
 * Anywhere on the page can open the assistant without the whole section
 * becoming a client component — this button just fires a window event that
 * AgentDock listens for.
 */
export function AgentTrigger({
  children,
  className,
  seed,
}: {
  children: ReactNode;
  className?: string;
  seed?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent(OPEN_AGENT_EVENT, { detail: { seed } }),
        )
      }
    >
      {children}
    </button>
  );
}
