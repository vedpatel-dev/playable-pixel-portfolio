import { PixelIcon, type PixelIconName } from "./PixelIcon";

type Props = {
  icon: PixelIconName;
  eyebrow: string;
  title: string;
  accent?: string;
  blurb?: string;
};

export function SectionHeading({
  icon,
  eyebrow,
  title,
  accent = "cyan",
  blurb,
}: Props) {
  return (
    <header data-accent={accent} data-reveal className="mb-10 sm:mb-14">
      <div className="flex items-center gap-3">
        <span className="pixel-border stage-tile flex h-9 w-9 shrink-0 items-center justify-center bg-panel-hi text-[var(--accent)]">
          <PixelIcon name={icon} size={16} />
        </span>
        <span className="eyebrow flex items-center gap-2.5 text-[var(--accent)]">
          <span
            aria-hidden="true"
            className="led-slow inline-block h-[7px] w-[7px] shrink-0"
          />
          {eyebrow}
        </span>
        <span className="pixel-rule hidden flex-1 sm:block" />
      </div>

      <h2 className="font-display text-emboss mt-5 text-[20px] leading-tight sm:text-[27px]">
        {title}
      </h2>

      {blurb ? (
        <p className="mt-4 max-w-2xl text-[14px] text-muted sm:text-[15px]">
          {blurb}
        </p>
      ) : null}
    </header>
  );
}
