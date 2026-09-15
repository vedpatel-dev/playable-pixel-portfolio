import { profile } from "@/data/content";
import { CoinSlot } from "./CoinSlot";
import { PixelIcon, type PixelIconName } from "./PixelIcon";
import { SectionHeading } from "./SectionHeading";

const CHANNELS: {
  icon: PixelIconName;
  accent: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}[] = [
  {
    icon: "mail",
    accent: "cyan",
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: "phone",
    accent: "green",
    label: "Phone",
    value: profile.phone,
    href: `tel:${profile.phone.replace(/[^0-9+]/g, "")}`,
  },
  {
    icon: "user",
    accent: "violet",
    label: "LinkedIn",
    value: profile.linkedinLabel,
    href: profile.linkedin,
    external: true,
  },
  {
    icon: "code",
    accent: "magenta",
    label: "GitHub",
    value: profile.githubLabel,
    href: profile.github,
    external: true,
  },
];

export function Contact() {
  return (
    <section id="contact" className="section-pad relative">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          icon="mail"
          eyebrow="Chapter 07"
          title="Continue?"
          accent="cyan"
          blurb="I'm actively looking for software engineering internships and new-grad roles. Fastest way to reach me is email — or ask the assistant in the corner anything you'd normally ask in a screening call."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {CHANNELS.map((channel, i) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noreferrer noopener" : undefined}
              data-reveal
              style={
                { "--reveal-delay": `${i * 70}ms` } as React.CSSProperties
              }
              data-accent={channel.accent}
              className="pixel-card flex items-center gap-4 p-5"
            >
              <span className="pixel-border flex h-11 w-11 shrink-0 items-center justify-center bg-ink text-[var(--accent)]">
                <PixelIcon name={channel.icon} size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="eyebrow block text-[10px]">
                  {channel.label}
                </span>
                <span className="mt-1.5 block truncate text-[14px] text-fg">
                  {channel.value}
                </span>
              </span>
              <span className="shrink-0 text-dim">
                <PixelIcon name="external" size={12} />
              </span>
            </a>
          ))}
        </div>

        {/* Insert-coin CTA — the buttons stay locked until a coin goes in. */}
        <CoinSlot />
      </div>
    </section>
  );
}
