"use client";

import { useEffect, useState } from "react";
import { navSections, profile } from "@/data/content";
import { PixelIcon } from "./PixelIcon";

export function PixelNav() {
  const [active, setActive] = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Active-section highlight. One observer over the section elements.
  useEffect(() => {
    const sections = navSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.6] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Shrink / solidify the bar after the first scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "border-b-[3px] border-line bg-ink/95 backdrop-blur-sm"
          : "border-b-[3px] border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        {/* Wordmark */}
        <a
          href="#home"
          data-accent="cyan"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="pixel-border flex h-9 w-9 items-center justify-center bg-panel text-cyan transition-colors group-hover:bg-cyan group-hover:text-ink">
            <span className="font-display text-[11px] leading-none">VP</span>
          </span>
          <span className="hidden sm:block">
            <span className="font-display block text-[12px] leading-none">
              {profile.name.toUpperCase()}
            </span>
            <span className="font-pixel mt-1 block text-[10px] tracking-[0.18em] text-dim">
              {profile.role.toUpperCase()}
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navSections.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`font-pixel relative block px-3 py-2 text-[12px] tracking-[0.12em] transition-colors ${
                    isActive
                      ? "text-cyan"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {section.label}
                  <span
                    className={`absolute inset-x-2 bottom-0 h-[3px] bg-cyan transition-transform duration-200 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            data-accent="violet"
            aria-label="GitHub profile"
            className="pixel-border hidden h-9 w-9 items-center justify-center bg-panel font-display text-[9px] text-muted transition-colors hover:bg-violet hover:text-ink sm:flex"
          >
            GH
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            data-accent="cyan"
            aria-label="LinkedIn profile"
            className="pixel-border hidden h-9 w-9 items-center justify-center bg-panel font-display text-[9px] text-muted transition-colors hover:bg-cyan hover:text-ink sm:flex"
          >
            IN
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="pixel-border flex h-9 w-9 items-center justify-center bg-panel text-fg lg:hidden"
          >
            <PixelIcon name={open ? "close" : "menu"} size={14} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open ? (
        <div className="border-t-[3px] border-line bg-ink lg:hidden">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-5 py-5">
            {navSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={() => setOpen(false)}
                  className={`pixel-border font-pixel block bg-panel px-3 py-3 text-[12px] tracking-[0.12em] ${
                    active === section.id ? "text-cyan" : "text-muted"
                  }`}
                >
                  {section.label}
                </a>
              </li>
            ))}
            <li className="col-span-2 grid grid-cols-2 gap-2">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="pixel-border font-pixel block bg-panel px-3 py-3 text-center text-[12px] tracking-[0.12em] text-violet"
              >
                GITHUB
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="pixel-border font-pixel block bg-panel px-3 py-3 text-center text-[12px] tracking-[0.12em] text-cyan"
              >
                LINKEDIN
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
