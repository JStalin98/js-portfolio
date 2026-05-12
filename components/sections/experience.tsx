import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { MotionSection, MotionItem } from "@/components/ui/motion-section";
import { TechChips } from "@/components/ui/tech-chips";
import { formatDateRange } from "@/lib/format-date";
import { IconArrowRight } from "@tabler/icons-react";

export async function Experience() {
  const supabase = await createClient();
  const { data: experiences } = await supabase
    .from("experiences")
    .select("id, slug, company, role, location, start_date, end_date, summary, tech_stack, order")
    .order("order", { ascending: true });

  const list = experiences ?? [];

  return (
    <Section id="experience" className="border-t border-[rgba(139,146,165,0.1)]">
      {/* Heading in its own stagger container */}
      <MotionSection>
        <MotionItem>
          <SectionHeading>Experience</SectionHeading>
        </MotionItem>
      </MotionSection>

      {/* Timeline — separate stagger container so each entry staggers independently */}
      <MotionSection>
        {list.map((exp, i) => (
          <MotionItem key={exp.id}>
            <div className="flex gap-5 group/entry">
              {/* Left: dot + connecting line */}
              <div className="flex flex-col items-center shrink-0 w-2">
                <div className="w-2 h-2 rounded-full border border-ash group-hover/entry:border-plasma group-hover/entry:bg-plasma/20 transition-colors duration-150 mt-[6px] relative z-10 bg-midnight" />
                {i < list.length - 1 && (
                  <div className="w-px flex-1 bg-[rgba(139,146,165,0.2)] mt-1.5" />
                )}
              </div>

              {/* Right: content */}
              <div className="pb-10 min-w-0 flex-1">
                {/* Company + dates row */}
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                  <h3 className="text-[16px] font-medium text-bone tracking-normal leading-snug">
                    {exp.company}
                  </h3>
                  <span className="text-[12px] font-mono text-ash">
                    {formatDateRange(exp.start_date, exp.end_date)}
                  </span>
                </div>

                {/* Role */}
                <p className="text-[14px] text-ash mb-3">{exp.role}</p>

                {/* Summary */}
                {exp.summary && (
                  <p className="text-[14px] text-bone leading-[1.7] mb-4 max-w-[640px]">
                    {exp.summary}
                  </p>
                )}

                {/* Tech stack */}
                {exp.tech_stack.length > 0 && (
                  <TechChips stack={exp.tech_stack} max={6} className="mb-4" />
                )}

                {/* View details link */}
                <Link
                  href={`/experience/${exp.slug}`}
                  className="inline-flex items-center gap-1.5 text-[13px] text-ash hover:text-plasma transition-colors duration-150 group/link focus-visible:outline-2 focus-visible:outline-plasma focus-visible:outline-offset-2 rounded-sm"
                >
                  View details
                  <IconArrowRight
                    size={13}
                    stroke={1.5}
                    className="group-hover/link:translate-x-0.5 transition-transform duration-150"
                  />
                </Link>
              </div>
            </div>
          </MotionItem>
        ))}
      </MotionSection>
    </Section>
  );
}
