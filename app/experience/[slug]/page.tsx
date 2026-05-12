import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildMetadata } from "@/lib/seo";
import { formatDateRange } from "@/lib/format-date";
import { ProseContent } from "@/components/ui/prose-content";
import { TechChips } from "@/components/ui/tech-chips";
import { PrevNextNav } from "@/components/ui/prev-next-nav";
import { ArchitectureGallery } from "@/components/detail/architecture-gallery";
import { IconArrowLeft } from "@tabler/icons-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("experiences").select("slug");
  return (data ?? []).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("experiences")
    .select("role, company, summary")
    .eq("slug", slug)
    .single();

  if (!data) return {};

  return buildMetadata({
    title: `${data.role} at ${data.company} · Jose Stalin Andrade Cartuche`,
    description: data.summary ?? `${data.role} at ${data.company}`,
    path: `/experience/${slug}`,
  });
}

export default async function ExperiencePage({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: exp } = await supabase
    .from("experiences")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!exp) notFound();

  // Fetch all experiences for prev/next navigation
  const { data: allExps } = await supabase
    .from("experiences")
    .select("slug, role, company, order")
    .order("order", { ascending: true });

  const sorted = allExps ?? [];
  const idx = sorted.findIndex((e) => e.slug === slug);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  return (
    <div className="min-h-screen bg-midnight pt-24 pb-20">
      <div className="mx-auto max-w-[720px] px-6 md:px-8">
        {/* Back link */}
        <Link
          href="/#experience"
          className="inline-flex items-center gap-1.5 text-[13px] text-ash hover:text-bone transition-colors duration-150 mb-10 group"
        >
          <IconArrowLeft
            size={14}
            stroke={1.5}
            className="group-hover:-translate-x-0.5 transition-transform duration-150"
          />
          Back to portfolio
        </Link>

        {/* Eyebrow: company · dates */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
          <span className="text-[12px] font-mono text-ash">{exp.company}</span>
          <span className="text-[rgba(139,146,165,0.4)] text-[12px]">·</span>
          <span className="text-[12px] font-mono text-ash">
            {formatDateRange(exp.start_date, exp.end_date)}
          </span>
        </div>

        {/* Role — H1 */}
        <h1 className="text-[30px] md:text-[36px] font-medium tracking-[-1.2px] text-bone leading-tight mb-3">
          {exp.role}
        </h1>

        {/* Location */}
        {exp.location && (
          <p className="text-[13px] text-ash mb-6">{exp.location}</p>
        )}

        {/* Tech stack */}
        {exp.tech_stack.length > 0 && (
          <div className="mb-8">
            <p className="text-[11px] font-mono text-ash uppercase tracking-[0.1em] mb-3">
              Tech stack
            </p>
            <TechChips stack={exp.tech_stack} />
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-[rgba(139,146,165,0.2)] mb-8" />

        {/* Full content */}
        <ProseContent content={exp.full_content} />

        {/* Architecture diagrams — only rendered when images are present */}
        <ArchitectureGallery images={exp.images ?? []} context={exp.role} />

        {/* Prev / Next */}
        <PrevNextNav
          prev={
            prev
              ? {
                  slug: prev.slug,
                  title: prev.role,
                  subtitle: prev.company,
                  basePath: "/experience",
                }
              : null
          }
          next={
            next
              ? {
                  slug: next.slug,
                  title: next.role,
                  subtitle: next.company,
                  basePath: "/experience",
                }
              : null
          }
        />
      </div>
    </div>
  );
}
