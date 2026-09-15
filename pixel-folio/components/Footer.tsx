import { profile } from "@/data/content";

export function Footer() {
  return (
    <footer className="relative border-t-[3px] border-line bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-10 text-center lg:flex-row lg:justify-between lg:px-8 lg:text-left">
        <div className="flex items-center gap-3">
          <span className="pixel-border flex h-8 w-8 items-center justify-center bg-panel text-cyan">
            <span className="font-display text-[10px] leading-none">VP</span>
          </span>
          <span className="font-pixel text-[12px] tracking-[0.14em] text-muted">
            {profile.fullName.toUpperCase()}
          </span>
        </div>

        <p className="font-pixel text-[11px] leading-relaxed tracking-[0.12em] text-dim">
          GAME OVER? NEVER — PRESS START AGAIN
        </p>

        <p className="text-[12px] text-dim">
          © {new Date().getFullYear()} · Built with Next.js, Tailwind &amp;
          far too many box-shadows
        </p>
      </div>
    </footer>
  );
}
