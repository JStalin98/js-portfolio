import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";
import { Section } from "@/components/ui/section";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />

      {/* Experience — Phase 3 */}
      <Section id="experience" className="border-t border-[rgba(139,146,165,0.1)]">
        <p className="text-ash text-sm font-mono">Experience — coming in phase 3</p>
      </Section>

      {/* Projects — Phase 3 */}
      <Section id="projects" className="bg-carbon border-t border-[rgba(139,146,165,0.1)]">
        <p className="text-ash text-sm font-mono">Projects — coming in phase 3</p>
      </Section>

      <Contact />
    </>
  );
}
