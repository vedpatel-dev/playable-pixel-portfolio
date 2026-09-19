import { beyondTheCode, profile } from "@/data/content";
import { PixelIcon } from "./PixelIcon";
import { SectionHeading } from "./SectionHeading";

const TRAITS = [
  {
    icon: "bot",
    accent: "cyan",
    title: "Agents that ship",
    body: "Copilot Studio, Claude 3.5 Sonnet and custom Python MCP servers running against real university traffic — not demos.",
  },
  {
    icon: "chip",
    accent: "magenta",
    title: "Automation first",
    body: "If a task repeats, it becomes a script. Device config, QA sweeps, document grading — all handed to a pipeline.",
  },
  {
    icon: "stack",
    accent: "amber",
    title: "Data all the way down",
    body: "pandas, NumPy and scikit-learn for the modelling; Power BI and Plotly so the results are readable by everyone else.",
  },
] as const;

export function About() {
  return (
    <section id="about" className="section-pad relative">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          icon="user"
          eyebrow="Stage 01"
          title="Who's behind the controller"
          accent="cyan"
        />

        <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          {/* Summary terminal */}
          <article data-reveal data-accent="cyan" className="pixel-panel">
            <div className="flex items-center gap-2 border-b-[3px] border-line bg-panel-hi px-4 py-2.5">
              <span className="text-cyan">
                <PixelIcon name="terminal" size={12} />
              </span>
              <span className="font-pixel text-[11px] tracking-[0.16em] text-muted">
                README.TXT
              </span>
            </div>
            <div className="p-5 sm:p-7">
              <p className="text-[14px] leading-[1.85] text-fg sm:text-[15px]">
                {profile.summary}
              </p>

              <div className="pixel-rule my-6" />

              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <span className="font-pixel text-[12px] tracking-[0.12em] text-dim">
                  LOCATION{" "}
                  <span className="text-fg">{profile.location}</span>
                </span>
                <span className="font-pixel text-[12px] tracking-[0.12em] text-dim">
                  GRAD <span className="text-fg">MAY 2028</span>
                </span>
                <span className="font-pixel text-[12px] tracking-[0.12em] text-dim">
                  GPA <span className="text-cyan">3.8</span>
                </span>
              </div>
            </div>
          </article>

          {/* Beyond the code */}
          <article
            data-reveal
            style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
            data-accent="magenta"
            className="pixel-panel"
          >
            <div className="flex items-center gap-2 border-b-[3px] border-line bg-panel-hi px-4 py-2.5">
              <span className="text-magenta">
                <PixelIcon name="heart" size={12} />
              </span>
              <span className="font-pixel text-[11px] tracking-[0.16em] text-muted">
                SIDE_QUESTS.LOG
              </span>
            </div>
            <div className="p-5 sm:p-7">
              <h3 className="font-display text-[13px] leading-snug text-magenta">
                BEYOND THE CODE
              </h3>
              <p className="mt-5 text-[14px] leading-[1.85] text-muted">
                {beyondTheCode}
              </p>
            </div>
          </article>
        </div>

        {/* Trait cards */}
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {TRAITS.map((trait, i) => (
            <article
              key={trait.title}
              data-reveal
              style={
                { "--reveal-delay": `${i * 80}ms` } as React.CSSProperties
              }
              data-accent={trait.accent}
              className="pixel-card p-5 sm:p-6"
            >
              <span className="pixel-border mb-5 flex h-10 w-10 items-center justify-center bg-ink text-[var(--accent)]">
                <PixelIcon name={trait.icon} size={18} />
              </span>
              <h3 className="font-display text-[12px] leading-snug text-fg">
                {trait.title.toUpperCase()}
              </h3>
              <p className="mt-4 text-[13px] leading-relaxed text-muted">
                {trait.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
