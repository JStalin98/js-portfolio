interface TechChipsProps {
  stack: string[];
  max?: number;
  className?: string;
}

export function TechChips({ stack, max, className = "" }: TechChipsProps) {
  const visible = max ? stack.slice(0, max) : stack;
  const overflow = max && stack.length > max ? stack.length - max : 0;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {visible.map((tech) => (
        <span
          key={tech}
          className="inline-flex items-center px-2.5 py-1 rounded-[8px] border border-[rgba(139,146,165,0.2)] text-[12px] font-mono text-ash"
        >
          {tech}
        </span>
      ))}
      {overflow > 0 && (
        <span className="inline-flex items-center px-2.5 py-1 rounded-[8px] border border-[rgba(139,146,165,0.2)] text-[12px] font-mono text-ash">
          +{overflow} more
        </span>
      )}
    </div>
  );
}
