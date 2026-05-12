import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildMetadata } from "@/lib/seo";
import { ProseContent } from "@/components/ui/prose-content";
import { TechChips } from "@/components/ui/tech-chips";
import { PrevNextNav } from "@/components/ui/prev-next-nav";
import { ArchitectureGallery } from "@/components/detail/architecture-gallery";
import { IconArrowLeft, IconBrandGithub, IconExternalLink } from "@tabler/icons-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("projects").select("slug");
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("projects")
    .select("title, summary")
    .eq("slug", slug)
    .single();

  if (!data) return {};

  return buildMetadata({
    title: `${data.title} · Jose Stalin Andrade Cartuche`,
    description: data.summary ?? data.title,
    path: `/projects/${slug}`,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) notFound();

  // Fetch all projects for prev/next navigation
  const { data: allProjects } = await supabase
    .from("projects")
    .select("slug, title, order")
    .order("order", { ascending: true });

  const sorted = allProjects ?? [];
  const idx = sorted.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  const hasExternalLinks = project.github_url || project.demo_url;

  return (
    <div className="min-h-screen bg-midnight pt-24 pb-20">
      <div className="mx-auto max-w-[880px] px-6 md:px-8">
        {/* Back link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-[13px] text-ash hover:text-bone transition-colors duration-150 mb-10 group"
        >
          <IconArrowLeft
            size={14}
            stroke={1.5}
            className="group-hover:-translate-x-0.5 transition-transform duration-150"
          />
          Back to portfolio
        </Link>

        {/* Title — H1 */}
        <h1 className="text-[30px] md:text-[36px] font-medium tracking-[-1.2px] text-bone leading-tight mb-3">
          {project.title}
        </h1>

        {/* Summary — subtitle */}
        {project.summary && (
          <p className="text-[16px] text-ash leading-[1.7] mb-6 max-w-[640px]">
            {project.summary}
          </p>
        )}

        {/* Tech stack */}
        {project.tech_stack.length > 0 && (
          <div className="mb-8">
            <p className="text-[11px] font-mono text-ash uppercase tracking-[0.1em] mb-3">
              Tech stack
            </p>
            <TechChips stack={project.tech_stack} />
          </div>
        )}

        {/* External links row */}
        {hasExternalLinks && (
          <div className="flex flex-wrap gap-3 mb-8">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-[13px] rounded-[8px] border border-[rgba(139,146,165,0.4)] text-bone hover:border-ash transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-plasma focus-visible:outline-offset-2"
              >
                <IconBrandGithub size={15} stroke={1.5} />
                View on GitHub
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-[13px] rounded-[8px] border border-[rgba(139,146,165,0.4)] text-bone hover:border-ash transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-plasma focus-visible:outline-offset-2"
              >
                <IconExternalLink size={15} stroke={1.5} />
                Live demo
              </a>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-[rgba(139,146,165,0.2)] mb-8" />

        {/* Full content */}
        <ProseContent content={project.full_content} />

        {/* Architecture diagrams — only rendered when images are present */}
        <ArchitectureGallery images={project.images ?? []} context={project.title} />

        {/* Prev / Next */}
        <PrevNextNav
          prev={
            prev
              ? { slug: prev.slug, title: prev.title, basePath: "/projects" }
              : null
          }
          next={
            next
              ? { slug: next.slug, title: next.title, basePath: "/projects" }
              : null
          }
        />
      </div>
    </div>
  );
}
