interface AvailabilityPillProps {
  status: string | null;
}

export function AvailabilityPill({ status }: AvailabilityPillProps) {
  if (!status) return null;

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] border border-[rgba(139,146,165,0.2)] bg-carbon">
      {/* Plasma live dot */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-plasma opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-plasma" />
      </span>
      <span className="text-[10px] font-mono text-plasma uppercase tracking-[0.1em]">
        {status}
      </span>
    </span>
  );
}
