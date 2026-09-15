import { skillGroups } from "@/data/content";
import { pixelSafe } from "@/lib/text";
import { PixelIcon, type PixelIconName } from "./PixelIcon";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="section-pad relative bg-ink/40">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          icon="chip"
          eyebrow="Chapter 02"
          title="Inventory & loadout"
          accent="magenta"
          blurb="Everything below is something I've actually shipped or tested with — languages on the left, the libraries I reach for in the middle, and the cloud tooling that puts it in front of users on the right."
        />

        {/* items-start so each panel hugs its own list instead of stretching to
            match the tallest — the groups have very different item counts. */}
        <div className="grid items-start gap-4 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <article
              key={group.category}
              data-reveal
              style={
                { "--reveal-delay": `${i * 90}ms` } as React.CSSProperties
              }
              data-accent={group.accent}
              className="pixel-card flex flex-col"
            >
              <header className="flex items-center gap-3 border-b-[3px] border-line bg-panel-hi px-4 py-3">
                <span className="text-[var(--accent)]">
                  <PixelIcon name={group.icon as PixelIconName} size={14} />
                </span>
                <h3 className="font-pixel flex-1 text-[12px] tracking-[0.12em] text-fg">
                  {pixelSafe(group.category.toUpperCase())}
                </h3>
                <span className="font-display text-[10px] text-[var(--accent)]">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </header>

              <div className="flex flex-wrap gap-2 p-4 sm:p-5">
                {group.items.map((item) => (
                  <span key={item} className="pixel-tag">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
