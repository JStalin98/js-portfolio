interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      className={`pt-8 pb-16 md:pt-10 md:pb-24 lg:pt-12 lg:pb-28 ${className}`}
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16">
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2 className={`text-[22px] font-medium tracking-[-0.5px] text-bone mb-10 md:mb-14 ${className}`}>
      {children}
    </h2>
  );
}
