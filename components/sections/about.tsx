import { createClient } from "@/lib/supabase/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { MotionSection, MotionItem } from "@/components/ui/motion-section";
import Image from "next/image";
import type { QuickFact } from "@/types/database";
import { EditAboutLayer } from "@/components/admin/edit-about-panel";

function ProfilePhoto({ url, name }: { url: string | null; name: string | null }) {
  const initials = (name ?? "JS")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const shared =
    "relative w-full aspect-square rounded-[12px] border border-[rgba(139,146,165,0.2)] overflow-hidden bg-carbon";

  if (url) {
    return (
      <div className={shared}>
        <Image
          src={url}
          alt={name ?? "Profile photo"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 340px"
          priority
        />
      </div>
    );
  }

  return (
    <div className={`${shared} flex items-center justify-center`}>
      <span className="text-[40px] font-medium text-bone select-none" aria-hidden="true">
        {initials}
      </span>
    </div>
  );
}

export async function About() {
  const supabase = await createClient();
  const { data: about } = await supabase
    .from("about")
    .select("*")
    .single();

  const { data: info } = await supabase
    .from("personal_info")
    .select("full_name, profile_image_url")
    .single();

  const quickFacts = (about?.quick_facts as QuickFact[] | null) ?? [];

  // Bio: if content looks like HTML (from Tiptap), render as HTML.
  // Otherwise fall back to plain-text paragraph splitting for legacy seed data.
  const rawContent = about?.content ?? "";
  const isHtml = rawContent.trimStart().startsWith("<");
  const paragraphs = isHtml
    ? []
    : rawContent.split(/\n\n+/).filter((p) => p.trim().length > 0);

  return (
    <Section id="about">
      <MotionSection>
        <MotionItem>
          <div className="flex items-center gap-3 mb-10 md:mb-14">
            <SectionHeading className="mb-0">About</SectionHeading>
            <EditAboutLayer initialData={about ?? null} />
          </div>
        </MotionItem>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-10 lg:gap-16">

          {/* Left: bio + quick facts */}
          <div>
            <MotionItem>
              <div className="space-y-4">
                {isHtml ? (
                  rawContent.trim().length > 0 ? (
                    <div
                      className="about-prose"
                      dangerouslySetInnerHTML={{ __html: rawContent }}
                    />
                  ) : (
                    <p className="text-ash text-sm">Bio coming soon.</p>
                  )
                ) : paragraphs.length > 0 ? (
                  paragraphs.map((p, i) => (
                    <p key={i} className="text-[14px] text-bone leading-[1.7]">
                      {p.trim()}
                    </p>
                  ))
                ) : (
                  <p className="text-ash text-sm">Bio coming soon.</p>
                )}
              </div>
            </MotionItem>

            {quickFacts.length > 0 && (
              <MotionItem className="mt-8">
                <p className="text-[11px] font-mono text-ash uppercase tracking-[0.1em] mb-4">
                  Quick facts
                </p>
                <ul className="space-y-[12px] list-none">
                  {quickFacts.map((fact) => (
                    <li
                      key={fact.label}
                      className="flex items-start gap-3 font-mono text-[13px]"
                    >
                      <span className="text-ash shrink-0 min-w-[120px]">
                        {fact.label}
                      </span>
                      <span className="text-bone">{fact.value}</span>
                    </li>
                  ))}
                </ul>
              </MotionItem>
            )}
          </div>

          {/* Right: profile photo (hidden on mobile, shows above bio on md+) */}
          <MotionItem className="hidden md:block">
            <ProfilePhoto
              url={info?.profile_image_url ?? null}
              name={info?.full_name ?? null}
            />
          </MotionItem>
        </div>
      </MotionSection>
    </Section>
  );
}
