import { leadership } from "@/data/content";
import { PixelIcon } from "./PixelIcon";
import { SectionHeading } from "./SectionHeading";

export function Leadership() {
  return (
    <section id="leadership" className="section-pad relative bg-ink/40">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          icon="trophy"
          eyebrow="Chapter 06"
          title="Party & side quests"
          accent="green"
          blurb="Leadership, teaching and volunteering — the parts of the job that never fit in a commit log."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {leadership.map((entry, i) => (
            <article
              key={`${entry.org}-${entry.role}`}
              data-reveal
              style={
                { "--reveal-delay": `${(i % 2) * 90}ms` } as React.CSSProperties
              }
              data-accent={entry.accent}
              className="pixel-card flex flex-col"
            >
              <header className="border-b-[3px] border-line bg-panel-hi px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="pixel-border mt-[2px] flex h-8 w-8 shrink-0 items-center justify-center bg-ink text-[var(--accent)]">
                    <PixelIcon name="trophy" size={13} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-pixel text-[13px] leading-snug tracking-[0.08em] text-[var(--accent)]">
                      {entry.role.toUpperCase()}
                    </h3>
                    <p className="mt-2 text-[13px] leading-snug text-fg">
                      {entry.org}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex items-center gap-2 text-[12px] text-dim">
                    <PixelIcon name="pin" size={10} />
                    {entry.location}
                  </span>
                  <span className="font-pixel text-[11px] tracking-[0.1em] text-muted">
                    {entry.period}
                  </span>
                </div>
              </header>

              <ul className="flex-1 space-y-3 p-5">
                {entry.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] h-[7px] w-[7px] shrink-0 bg-[var(--accent)]"
                    />
                    <span className="text-[13px] leading-relaxed text-muted">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
