import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
      {/* Wordmark */}
      <h1 className="text-[48px] font-medium tracking-[-1.5px] leading-none font-sans">
        JStalin<span className="text-plasma">.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-ash text-sm">
        Data Architect &amp; AI Architect — portfolio coming soon
      </p>

      {/* Design system link */}
      <Link
        href="/design-system"
        className="border border-[rgba(139,146,165,0.2)] rounded-[8px] px-5 py-2.5 text-sm text-bone hover:border-ash transition-colors duration-150"
      >
        View design system →
      </Link>
    </main>
  );
}
