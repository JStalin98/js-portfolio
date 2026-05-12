import { createClient } from "@/lib/supabase/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { MotionSection, MotionItem } from "@/components/ui/motion-section";
import type { Database } from "@/types/database";

type Skill = Database["public"]["Tables"]["skills"]["Row"];

function ProficiencyDots({ level }: { level: number | null }) {
  if (!level) return null;
  return (
    <span className="flex items-center gap-0.5 ml-2" aria-label={`Proficiency ${level} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`inline-block w-[5px] h-[5px] rounded-full ${
            i < level ? "bg-plasma" : "bg-[rgba(139,146,165,0.25)]"
          }`}
        />
      ))}
    </span>
  );
}

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
}

export async function Skills() {
  const supabase = await createClient();
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("category")
    .order("order");

  const allSkills = skills ?? [];
  const hardSkills = allSkills.filter((s) => s.type === "hard");
  const softSkills = allSkills.filter((s) => s.type === "soft");
  const grouped = groupByCategory(hardSkills);

  return (
    <Section id="skills" className="bg-carbon">
      <MotionSection>
        <MotionItem>
          <SectionHeading>Skills</SectionHeading>
        </MotionItem>

        {/* Technical skills */}
        <MotionItem className="mb-12 md:mb-16">
          <p className="text-[11px] font-mono text-ash uppercase tracking-[0.1em] mb-6">
            Technical skills
          </p>

          <div className="space-y-8">
            {Object.entries(grouped).map(([category, categorySkills]) => (
              <div key={category}>
                <p className="text-[11px] font-mono text-ash uppercase tracking-[0.08em] mb-3">
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center px-3 py-1.5 rounded-[8px] border border-[rgba(139,146,165,0.2)] bg-midnight text-[13px] font-mono text-bone"
                    >
                      {skill.name}
                      <ProficiencyDots level={skill.level} />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </MotionItem>

        {/* Soft skills — only if any exist */}
        {softSkills.length > 0 && (
          <MotionItem>
            <p className="text-[11px] font-mono text-ash uppercase tracking-[0.1em] mb-4">
              Soft skills
            </p>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center px-3 py-1.5 rounded-[8px] border border-[rgba(139,146,165,0.2)] bg-midnight text-[13px] font-mono text-bone"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </MotionItem>
        )}
      </MotionSection>
    </Section>
  );
}
