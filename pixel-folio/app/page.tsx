import { About } from "@/components/About";
import { AgentDock } from "@/components/AgentDock";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Leadership } from "@/components/Leadership";
import { PixelNav } from "@/components/PixelNav";
import { Projects } from "@/components/Projects";
import { SiteFx } from "@/components/SiteFx";
import { Skills } from "@/components/Skills";
import { StarField } from "@/components/StarField";
import { TechMarquee } from "@/components/TechMarquee";

export default function Home() {
  return (
    <>
      <StarField />
      <div className="grid-backdrop" aria-hidden="true" />

      <PixelNav />

      <main className="relative z-10">
        <Hero />
        <TechMarquee />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Leadership />
        <Contact />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>

      <AgentDock />
      <SiteFx />
      <div className="crt-veil" aria-hidden="true" />
    </>
  );
}
