import { certifications, education } from "@/data/content";
import { pixelSafe } from "@/lib/text";
import { PixelIcon } from "./PixelIcon";
import { SectionHeading } from "./SectionHeading";

export function Education() {
  return (
    <section id="education" className="section-pad relative">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          icon="cap"
          eyebrow="Chapter 05"
          title="Skill tree"
          accent="violet"
        />

        {/* School card */}
        <article
          data-reveal
          data-accent="violet"
          className="pixel-panel mb-4 p-5 sm:p-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <span className="pixel-border flex h-12 w-12 shrink-0 items-center justify-center bg-ink text-violet">
                <PixelIcon name="cap" size={22} />
              </span>
              <div>
                <h3 className="font-display text-[14px] leading-snug text-fg sm:text-[16px]">
                  {education.school.toUpperCase()}
                </h3>
                <p className="mt-3 text-[14px] text-muted">
                  {education.degree}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="pixel-border bg-panel-hi px-4 py-3 text-center">
                <p className="font-display text-[15px] leading-none text-violet">
                  3.8
                </p>
                <p className="eyebrow mt-2 text-[10px]">GPA</p>
              </div>
              <div className="pixel-border bg-panel-hi px-4 py-3 text-center">
                <p className="font-display text-[15px] leading-none text-cyan">
                  2028
                </p>
                <p className="eyebrow mt-2 text-[10px]">Grad</p>
              </div>
            </div>
          </div>
        </article>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* Coursework */}
          <div>
            <h3 className="eyebrow mb-4">Relevant coursework</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {education.coursework.map((course, i) => (
                <article
                  key={course.title}
                  data-reveal
                  style={
                    { "--reveal-delay": `${i * 60}ms` } as React.CSSProperties
                  }
                  data-accent="cyan"
                  className="pixel-card p-4 sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-[2px] text-cyan">
                      <PixelIcon name="code" size={13} />
                    </span>
                    <h4 className="font-pixel text-[12px] leading-snug tracking-[0.06em] text-fg">
                      {pixelSafe(course.title.toUpperCase())}
                    </h4>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">
                    {course.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="eyebrow mb-4">Certifications</h3>
            <article
              data-reveal
              data-accent="amber"
              className="pixel-panel overflow-hidden"
            >
              <div className="flex items-center gap-2 border-b-[3px] border-line bg-panel-hi px-4 py-3">
                <span className="text-amber">
                  <PixelIcon name="medal" size={13} />
                </span>
                <span className="font-pixel text-[11px] tracking-[0.16em] text-muted">
                  ACHIEVEMENTS ({certifications.length})
                </span>
              </div>
              <ul>
                {certifications.map((cert, i) => (
                  <li
                    key={cert}
                    className="flex items-start gap-3 border-b-[3px] border-line/50 px-4 py-4 last:border-b-0"
                  >
                    <span className="font-display mt-[2px] text-[9px] text-amber">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[13px] leading-snug text-fg">
                      {cert}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
