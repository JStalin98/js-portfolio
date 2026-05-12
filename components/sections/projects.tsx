import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { MotionSection, MotionItem } from "@/components/ui/motion-section";
import { TechChips } from "@/components/ui/tech-chips";
import { IconBrandGithub } from "@tabler/icons-react";
import type { Database } from "@/types/database";

type Project = Database["public"]["Tables"]["projects"]["Row"];

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="relative rounded-[12px] bg-carbon border border-[rgba(139,146,165,0.2)] hover:border-[rgba(139,146,165,0.4)] transition-colors duration-150 group/card">
      {/* Full-card link — sits behind content */}
      <Link
        href={`/projects/${project.slug}`}
        className="block p-6"
        aria-label={project.title}
      >
        {/* Spacer for GitHub icon when present */}
        <div className={project.github_url ? "pr-7" : ""}>
          <h3 className="text-[16px] font-medium text-bone tracking-normal leading-snug mb-2 group-hover/card:text-plasma transition-colors duration-150">
            {project.title}
          </h3>
        </div>

        {project.summary && (
          <p className="text-[14px] text-ash leading-[1.7] line-clamp-3 mb-4">
            {project.summary}
          </p>
        )}

        <TechChips stack={project.tech_stack} max={5} />
      </Link>

      {/* GitHub icon — positioned above the card link */}
      {project.github_url && (
        <a
          href={project.github_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title} on GitHub`}
          className="absolute top-5 right-5 z-10 text-ash hover:text-bone transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-plasma focus-visible:outline-offset-2 rounded-sm"
        >
          <IconBrandGithub size={16} stroke={1.5} />
        </a>
      )}
    </article>
  );
}

export async function Projects() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("order", { ascending: true });

  const list = projects ?? [];

  return (
    <Section id="projects" className="bg-carbon border-t border-[rgba(139,146,165,0.1)]">
      {/* Heading */}
      <MotionSection>
        <MotionItem>
          <SectionHeading>Projects</SectionHeading>
        </MotionItem>
      </MotionSection>

      {/* Grid — each card staggers in */}
      <MotionSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((project) => (
          <MotionItem key={project.id}>
            <ProjectCard project={project} />
          </MotionItem>
        ))}
      </MotionSection>
    </Section>
  );
}
