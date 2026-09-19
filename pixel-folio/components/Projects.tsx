import { LIVE_IS_HERE, projects } from "@/data/content";
import { PixelIcon } from "./PixelIcon";
import { SectionHeading } from "./SectionHeading";
import { SelfDemoButton } from "./SelfDemoButton";

export function Projects() {
  return (
    <section id="projects" className="section-pad relative bg-ink/40">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          icon="rocket"
          eyebrow="Stage 04"
          title="Cartridges"
          accent="cyan"
          blurb="Things I built end-to-end because I wanted them to exist. All three are public — source code and, where it applies, a live deployment."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project, i) => (
            <article
              key={project.name}
              data-reveal
              style={
                { "--reveal-delay": `${i * 110}ms` } as React.CSSProperties
              }
              data-accent={project.accent}
              className="pixel-card flex flex-col"
            >
              {/* Cartridge label */}
              <div className="relative overflow-hidden border-b-[3px] border-line bg-panel-hi px-5 py-6">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.16]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, var(--accent) 0 6px, transparent 6px 14px)",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-pixel text-[11px] tracking-[0.18em] text-dim">
                      {project.period.toUpperCase()}
                    </span>
                    <span className="font-display text-[10px] text-[var(--accent)]">
                      NO.{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="font-display text-emboss mt-4 text-[15px] leading-[1.45] text-fg sm:text-[17px]">
                    {project.name.toUpperCase()}
                  </h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-[13px] leading-relaxed text-muted">
                  {project.blurb}
                </p>

                <ul className="mt-5 flex-1 space-y-3">
                  {project.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[9px] h-[7px] w-[7px] shrink-0 bg-[var(--accent)]"
                      />
                      <span className="text-[13px] leading-relaxed text-fg">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pixel-rule my-6" />

                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span key={s} className="pixel-tag">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="pixel-btn !px-4 !py-2.5 !text-[12px]"
                  >
                    <PixelIcon name="code" size={13} />
                    Source
                  </a>
                  {project.live === LIVE_IS_HERE ? (
                    <SelfDemoButton />
                  ) : project.live ? (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="pixel-btn pixel-btn-primary !px-4 !py-2.5 !text-[12px]"
                    >
                      <PixelIcon name="external" size={13} />
                      Live Demo
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
