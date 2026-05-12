interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-[8px] border border-[rgba(139,146,165,0.2)] text-[13px] font-mono text-bone bg-carbon ${className}`}
    >
      {children}
    </span>
  );
}
