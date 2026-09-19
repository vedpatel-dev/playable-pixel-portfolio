import { CoinSlot } from "./CoinSlot";
import { SectionHeading } from "./SectionHeading";

/**
 * Stage 07 — the arcade cabinet. Everything you can actually *play* on this
 * site lives here: the coin slot that unlocks the resume/contact controls, and
 * the scanner mini-game hiding cringe.log behind it.
 */
export function Arcade() {
  return (
    <section id="arcade" className="section-pad relative">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          icon="joystick"
          eyebrow="Stage 07"
          title="Insert coin to play"
          accent="amber"
          blurb="An actual playable cabinet, not a metaphor. Drop the coin in the slot to unlock the controls — then beat the scanner if you want the file I never put on the resume."
        />

        <CoinSlot />
      </div>
    </section>
  );
}
