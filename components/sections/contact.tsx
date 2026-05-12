import { createClient } from "@/lib/supabase/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { MotionSection, MotionItem } from "@/components/ui/motion-section";
import { CopyButton } from "@/components/sections/copy-button";
import { ContactForm } from "@/components/sections/contact-form";
import {
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
  IconMapPin,
} from "@tabler/icons-react";

export async function Contact() {
  const supabase = await createClient();
  const { data: info } = await supabase
    .from("personal_info")
    .select("email, linkedin_url, github_url, location")
    .single();

  type Channel = {
    icon: React.ElementType;
    label: string;
    value: string;
    href: string;
    copyable?: boolean;
  };

  const channels: Channel[] = [
    ...(info?.email
      ? [
          {
            icon: IconMail,
            label: "Email",
            value: info.email,
            href: `mailto:${info.email}`,
            copyable: true,
          },
        ]
      : []),
    ...(info?.linkedin_url
      ? [
          {
            icon: IconBrandLinkedin,
            label: "LinkedIn",
            value: info.linkedin_url.replace(/^https?:\/\/(www\.)?/, ""),
            href: info.linkedin_url,
          },
        ]
      : []),
    ...(info?.github_url
      ? [
          {
            icon: IconBrandGithub,
            label: "GitHub",
            value: info.github_url.replace(/^https?:\/\/(www\.)?/, ""),
            href: info.github_url,
          },
        ]
      : []),
    ...(info?.location
      ? [
          {
            icon: IconMapPin,
            label: "Location",
            value: info.location,
            href: "#",
          },
        ]
      : []),
  ];

  return (
    <Section id="contact">
      <MotionSection>
        <MotionItem>
          <SectionHeading>Contact</SectionHeading>
        </MotionItem>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
          {/* Channels */}
          <MotionItem>
            <p className="text-[14px] text-ash leading-[1.7] mb-8 max-w-[400px]">
              Interested in discussing a role, a project, or just want to connect? Reach out through any of these channels.
            </p>

            <ul className="space-y-5 list-none">
              {channels.map(({ icon: Icon, label, value, href, copyable }) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-[8px] border border-[rgba(139,146,165,0.2)] bg-carbon text-ash shrink-0">
                    <Icon size={17} stroke={1.5} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono text-ash uppercase tracking-[0.08em]">
                      {label}
                    </span>
                    <div className="flex items-center">
                      {href !== "#" ? (
                        <a
                          href={href}
                          target={href.startsWith("mailto") ? undefined : "_blank"}
                          rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                          className="text-[14px] text-bone hover:text-plasma transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-plasma focus-visible:outline-offset-2 rounded-sm"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-[14px] text-bone">{value}</span>
                      )}
                      {copyable && <CopyButton value={value} />}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </MotionItem>

          {/* Contact form */}
          <MotionItem>
            <ContactForm />
          </MotionItem>
        </div>
      </MotionSection>
    </Section>
  );
}
