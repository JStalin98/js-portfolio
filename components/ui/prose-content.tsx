import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  // Handle **bold** markers
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-bone font-medium">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

interface ProseContentProps {
  content: string | null;
  className?: string;
}

export function ProseContent({ content, className = "" }: ProseContentProps) {
  if (!content) return null;

  const chunks = content
    .split(/\n\n+/)
    .filter((c) => c.trim().length > 0);

  return (
    <div className={`space-y-4 ${className}`}>
      {chunks.map((chunk, i) => {
        const t = chunk.trim();

        // H2 heading
        if (t.startsWith("## ")) {
          return (
            <h3
              key={i}
              className="text-[16px] font-medium text-bone tracking-normal pt-4 first:pt-0"
            >
              {t.slice(3)}
            </h3>
          );
        }

        // H3 heading
        if (t.startsWith("### ")) {
          return (
            <h4 key={i} className="text-[14px] font-medium text-bone pt-2 first:pt-0">
              {t.slice(4)}
            </h4>
          );
        }

        // List block — every line starts with "- "
        const lines = t.split("\n");
        const isList = lines.every((l) => l.trim().startsWith("- "));
        if (isList) {
          return (
            <ul key={i} className="space-y-1.5 list-none">
              {lines.map((line, j) => (
                <li key={j} className="flex gap-2 text-[14px] text-bone leading-[1.7]">
                  <span className="text-ash shrink-0 select-none">—</span>
                  <span>{renderInline(line.trim().slice(2))}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="text-[14px] text-bone leading-[1.7]">
            {renderInline(t)}
          </p>
        );
      })}
    </div>
  );
}
