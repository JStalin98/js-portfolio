import Link from "next/link";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

export interface NavEntry {
  slug: string;
  title: string;
  subtitle?: string;
  basePath: string;
}

interface PrevNextNavProps {
  prev: NavEntry | null;
  next: NavEntry | null;
}

export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-16 pt-10 border-t border-[rgba(139,146,165,0.2)]">
      <p className="text-[11px] font-mono text-ash uppercase tracking-[0.1em] mb-5">
        Continue
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prev ? (
          <Link
            href={`${prev.basePath}/${prev.slug}`}
            className="group flex flex-col gap-1.5 p-5 rounded-[12px] border border-[rgba(139,146,165,0.2)] bg-carbon hover:border-[rgba(139,146,165,0.4)] transition-colors duration-150"
          >
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-ash uppercase tracking-[0.08em]">
              <IconArrowLeft size={12} stroke={1.5} />
              Previous
            </span>
            <span className="text-[14px] font-medium text-bone group-hover:text-plasma transition-colors duration-150 leading-snug">
              {prev.title}
            </span>
            {prev.subtitle && (
              <span className="text-[12px] text-ash">{prev.subtitle}</span>
            )}
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`${next.basePath}/${next.slug}`}
            className="group flex flex-col gap-1.5 p-5 rounded-[12px] border border-[rgba(139,146,165,0.2)] bg-carbon hover:border-[rgba(139,146,165,0.4)] transition-colors duration-150 sm:items-end sm:text-right"
          >
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-ash uppercase tracking-[0.08em]">
              Next
              <IconArrowRight size={12} stroke={1.5} />
            </span>
            <span className="text-[14px] font-medium text-bone group-hover:text-plasma transition-colors duration-150 leading-snug">
              {next.title}
            </span>
            {next.subtitle && (
              <span className="text-[12px] text-ash">{next.subtitle}</span>
            )}
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
