import { education, profile, stats } from "@/data/content";
import { AgentTrigger } from "./AgentTrigger";
import { PixelIcon } from "./PixelIcon";
import { StatCounter } from "./StatCounter";
import { Typewriter } from "./Typewriter";

// Rendered in Silkscreen, which has no usable "&" or "@" glyph — keep these
// phrases to "+", "·" and plain words.
const ROLES = [
  "Software Developer",
  "AI + Agent Engineer",
  "Full-Stack Developer",
  "Automation + Data Pipelines",
  "CS at USF, Class of 2028",
] as const;

const VITALS = [
  { icon: "pin", label: "Base", value: "Tampa, Florida" },
  { icon: "cap", label: "School", value: education.school },
  {
    icon: "chip",
    label: "Focus",
    value: "Software development, AI & automation",
  },
  { icon: "sparkle", label: "Status", value: "Open to SWE + new-grad roles" },
] as const;

export function Hero() {
  return (
    <section id="home" className="relative">
      <div className="mx-auto max-w-6xl px-5 pt-32 pb-16 lg:px-8 lg:pt-40">
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* ---------------- Left: identity ---------------- */}
          <div data-accent="cyan">
            <div data-reveal className="flex items-center gap-3">
              <span className="pixel-border inline-flex items-center gap-2 bg-panel px-3 py-2">
                <span className="relative flex h-[8px] w-[8px]">
                  <span className="absolute inset-0 bg-green" />
                  <span
                    className="absolute inset-0 bg-green"
                    style={{ animation: "pulse-ring 1.8s ease-out infinite" }}
                  />
                </span>
                <span className="font-pixel text-[11px] tracking-[0.18em] text-green">
                  PLAYER 01 · ONLINE
                </span>
              </span>
            </div>

            <h1
              data-reveal
              style={{ "--reveal-delay": "70ms" } as React.CSSProperties}
              className="font-display text-emboss mt-7 text-[30px] leading-[1.35] sm:text-[44px] lg:text-[52px]"
            >
              <span className="block text-fg">VED</span>
              <span className="block text-cyan">PATEL</span>
            </h1>

            <p
              data-reveal
              style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
              className="font-pixel mt-6 min-h-[28px] text-[15px] tracking-[0.06em] text-fg sm:text-[18px]"
            >
              <span className="text-dim">&gt;&nbsp;</span>
              <Typewriter phrases={ROLES} />
            </p>

            <p
              data-reveal
              style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
              className="mt-7 max-w-xl text-[14px] leading-relaxed text-muted sm:text-[15px]"
            >
              I build software end to end — AI agents that route thousands of
              real support tickets, test pipelines that read 10,000 results so
              nobody has to, and the APIs and dashboards that turn all of it
              into something a human can act on.
            </p>

            <div
              data-reveal
              style={{ "--reveal-delay": "260ms" } as React.CSSProperties}
              className="mt-9 flex flex-wrap gap-3"
            >
              <a
                href="#projects"
                data-accent="cyan"
                className="pixel-btn pixel-btn-primary"
              >
                <PixelIcon name="rocket" size={14} />
                View Projects
              </a>
              <AgentTrigger
                className="pixel-btn"
                seed="What's Ved's experience with AI agents?"
              >
                <span data-accent="magenta" className="flex items-center gap-2">
                  <PixelIcon name="bot" size={16} />
                  Ask My AI
                </span>
              </AgentTrigger>
              <a href="#contact" data-accent="amber" className="pixel-btn">
                <PixelIcon name="mail" size={14} />
                Contact
              </a>
            </div>
          </div>

          {/* ---------------- Right: ID card ---------------- */}
          <div
            data-reveal
            style={{ "--reveal-delay": "320ms" } as React.CSSProperties}
            data-accent="magenta"
            className="pixel-panel p-1"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between border-b-[3px] border-line bg-panel-hi px-3 py-2">
              <span className="font-pixel text-[11px] tracking-[0.16em] text-muted">
                ID_CARD.DAT
              </span>
              <span className="flex gap-1.5">
                <span className="h-[8px] w-[8px] bg-amber" />
                <span className="h-[8px] w-[8px] bg-green" />
                <span className="h-[8px] w-[8px] bg-magenta" />
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-4">
                <span
                  data-accent="cyan"
                  className="pixel-border animate-bob flex h-[68px] w-[68px] shrink-0 items-center justify-center bg-ink text-cyan"
                >
                  <PixelIcon name="bot" size={52} />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-[13px] leading-tight text-fg">
                    {profile.fullName.toUpperCase()}
                  </p>
                  <p className="font-pixel mt-2 text-[11px] tracking-[0.14em] text-magenta">
                    LVL 20 · SOFTWARE ENGINEER
                  </p>
                </div>
              </div>

              <div className="pixel-rule my-5" />

              <dl className="space-y-3">
                {VITALS.map((v) => (
                  <div key={v.label} className="flex items-start gap-3">
                    <span className="mt-[3px] text-dim">
                      <PixelIcon name={v.icon} size={12} />
                    </span>
                    <dt className="font-pixel w-[62px] shrink-0 text-[11px] tracking-[0.12em] text-dim">
                      {v.label.toUpperCase()}
                    </dt>
                    <dd className="min-w-0 flex-1 text-[13px] leading-snug text-fg">
                      {v.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="pixel-rule my-5" />

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`mailto:${profile.email}`}
                  data-accent="cyan"
                  className="pixel-tag text-center !text-[11px]"
                >
                  EMAIL
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-accent="violet"
                  className="pixel-tag text-center !text-[11px]"
                >
                  GITHUB
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Stats HUD ---------------- */}
        <div
          data-reveal
          className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              decimals={stat.decimals}
              suffix={stat.suffix}
              label={stat.label}
              accent={stat.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
