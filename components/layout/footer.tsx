import Link from "next/link";
import {
  IconBrandLinkedin,
  IconBrandGithub,
  IconMail,
} from "@tabler/icons-react";

const socialLinks = [
  {
    href: "https://linkedin.com/in/jstalin",
    label: "LinkedIn",
    icon: IconBrandLinkedin,
  },
  {
    href: "https://github.com/jstalin",
    label: "GitHub",
    icon: IconBrandGithub,
  },
  {
    href: "mailto:jsandrade1998@gmail.com",
    label: "Email",
    icon: IconMail,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[rgba(139,146,165,0.2)] py-8">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: wordmark + copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span className="text-[14px] font-medium tracking-[-0.5px] text-bone">
            JStalin<span className="text-plasma">.</span>
          </span>
          <span className="text-[13px] text-ash">
            © <span className="font-mono">2026</span> Jose Stalin Andrade Cartuche
          </span>
        </div>

        {/* Right: social icons */}
        <ul className="flex items-center gap-4 list-none">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <Link
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                aria-label={label}
                className="text-ash hover:text-bone transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-plasma focus-visible:outline-offset-2 rounded-sm"
              >
                <Icon size={18} stroke={1.5} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
