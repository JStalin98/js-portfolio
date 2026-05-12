interface DotGridProps {
  className?: string;
}

export function DotGrid({ className = "" }: DotGridProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none dot-grid ${className}`}
    />
  );
}
