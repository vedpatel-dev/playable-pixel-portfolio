import { experience } from "@/data/content";
import { PixelIcon } from "./PixelIcon";
import { SectionHeading } from "./SectionHeading";

const DASHED_V =
  "repeating-linear-gradient(to bottom, #343963 0 9px, transparent 9px 18px)";

export function Experience() {
  return (
    <section id="experience" className="section-pad relative">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          icon="briefcase"
          eyebrow="Stage 03"
          title="Run history"
          accent="amber"
          blurb="Three stages, newest first — from automating university IT support with AI agents to compliance-testing radios that end up in millions of phones."
        />

        <ol className="relative">
          {experience.map((job, i) => (
            <li
              key={`${job.org}-${job.period}`}
              className="relative pb-5 pl-11 sm:pl-14"
            >
              {/* Timeline rail */}
              {i !== experience.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-12 bottom-0 left-[13px] w-[3px] sm:left-[15px]"
                  style={{ backgroundImage: DASHED_V }}
                />
              ) : null}

              {/* Node */}
              <span
                aria-hidden="true"
                data-accent={job.accent}
                className="pixel-border absolute top-4 left-0 flex h-[29px] w-[29px] items-center justify-center bg-ink text-[var(--accent)] sm:h-[33px] sm:w-[33px]"
              >
                <PixelIcon name="briefcase" size={13} />
              </span>

              <article
                data-reveal
                data-accent={job.accent}
                className="pixel-card"
              >
                <header className="border-b-[3px] border-line bg-panel-hi px-4 py-4 sm:px-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-[13px] leading-snug text-fg sm:text-[15px]">
                      {job.title.toUpperCase()}
                    </h3>
                    {job.current ? (
                      <span className="font-pixel flex items-center gap-2 bg-green px-2 py-1 text-[10px] tracking-[0.14em] text-ink">
                        <span className="animate-blink inline-block h-[6px] w-[6px] bg-ink" />
                        ACTIVE
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="font-pixel text-[13px] tracking-[0.08em] text-[var(--accent)]">
                      {job.org}
                    </span>
                    <span className="flex items-center gap-2 text-[12px] text-dim">
                      <PixelIcon name="pin" size={10} />
                      {job.location}
                    </span>
                    <span className="font-pixel text-[12px] tracking-[0.08em] text-muted">
                      {job.period}
                    </span>
                  </div>
                </header>

                <div className="px-4 py-5 sm:px-6 sm:py-6">
                  <p className="text-[13px] leading-relaxed text-muted">
                    {job.blurb}
                  </p>

                  <ul className="mt-5 space-y-3">
                    {job.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[9px] h-[7px] w-[7px] shrink-0 bg-[var(--accent)]"
                        />
                        <span className="text-[13px] leading-relaxed text-fg sm:text-[14px]">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {job.tech.map((t) => (
                      <span key={t} className="pixel-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
