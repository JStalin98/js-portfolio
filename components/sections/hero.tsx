import { createClient } from "@/lib/supabase/server";
import { AvailabilityPill } from "@/components/ui/availability-pill";
import { ButtonLink } from "@/components/ui/button";
import { DotGrid } from "@/components/ui/dot-grid";
import { MotionOnMount } from "@/components/ui/motion-section";
import type { HeroMetric } from "@/types/database";
import { IconDownload, IconArrowDown } from "@tabler/icons-react";
import { EditPersonalInfoLayer } from "@/components/admin/edit-personal-info-panel";

export async function Hero() {
  const supabase = await createClient();
  const { data: info } = await supabase
    .from("personal_info")
    .select("*")
    .single();

  const metrics = (info?.hero_metrics as HeroMetric[] | null) ?? [];

  return (
    <section className="relative group min-h-[100svh] flex items-center pt-16">
      <DotGrid />
      <EditPersonalInfoLayer initialData={info ?? null} />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-20 md:py-28 lg:py-32 w-full">
        {/* Availability pill — fastest, delay 0 */}
        <MotionOnMount delay={0} className="mb-8">
          <AvailabilityPill status={info?.availability_status ?? null} />
        </MotionOnMount>

        {/* Name */}
        <MotionOnMount delay={0.08}>
          <h1 className="text-[42px] md:text-[48px] font-medium tracking-[-1.5px] leading-none text-bone mb-4">
            {info?.full_name ?? "Jose Stalin Andrade Cartuche"}
          </h1>
        </MotionOnMount>

        {/* Roles headline */}
        <MotionOnMount delay={0.16}>
          <p className="text-[16px] md:text-[18px] text-ash font-medium tracking-[-0.3px] mb-5 max-w-[640px]">
            {info?.headline ?? "Data Architect · AI Architect · Data Solution Architect"}
          </p>
        </MotionOnMount>

        {/* Tagline */}
        <MotionOnMount delay={0.24}>
          <p className="text-[14px] text-ash leading-[1.7] max-w-[560px] mb-10">
            {info?.tagline ??
              "Building scalable data platforms and AI-powered solutions that turn complex data into business value."}
          </p>
        </MotionOnMount>

        {/* CTAs */}
        <MotionOnMount delay={0.32} className="mb-16 md:mb-20">
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/api/cv" variant="primary" size="md">
              <IconDownload size={16} stroke={1.5} />
              Download CV
            </ButtonLink>
            <ButtonLink href="#contact" variant="secondary" size="md">
              <IconArrowDown size={16} stroke={1.5} />
              Get in touch
            </ButtonLink>
          </div>
        </MotionOnMount>

        {/* Metrics */}
        {metrics.length > 0 && (
          <MotionOnMount delay={0.4}>
            <div className="flex flex-wrap gap-6 md:gap-10 pt-8 border-t border-[rgba(139,146,165,0.2)]">
              {metrics.map((m) => (
                <div key={m.label} className="flex flex-col gap-1">
                  <span className="font-mono text-[28px] md:text-[32px] font-medium tracking-[-0.5px] text-bone leading-none">
                    {m.value}
                  </span>
                  <span className="text-[12px] text-ash leading-none mt-1">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </MotionOnMount>
        )}
      </div>
    </section>
  );
}
