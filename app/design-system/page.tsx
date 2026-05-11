import Link from "next/link";

// ── Brand palette data ──────────────────────────────────────────────────────
const palette = [
  { token: "midnight", hex: "#0B1220", desc: "Main background · 55%" },
  { token: "carbon",   hex: "#1A1F2E", desc: "Cards, elevated sections" },
  { token: "ash",      hex: "#8B92A5", desc: "Secondary text, metadata" },
  { token: "bone",     hex: "#F4F2EC", desc: "Primary text on dark" },
  { token: "plasma",   hex: "#00E5A0", desc: "AI accent, CTAs · 5%" },
] as const;

// ── Type scale data ─────────────────────────────────────────────────────────
const typeScale = [
  {
    level: "Hero",
    specs: "48px · 500 · −1.5px",
    fontLabel: "Geist",
    sample: "Data Architect",
    className: "text-[48px] font-medium tracking-[-1.5px] leading-none font-sans",
  },
  {
    level: "H1",
    specs: "36px · 500 · −1.2px",
    fontLabel: "Geist",
    sample: "Experience",
    className: "text-[36px] font-medium tracking-[-1.2px] leading-tight font-sans",
  },
  {
    level: "H2",
    specs: "22px · 500 · −0.5px",
    fontLabel: "Geist",
    sample: "Fintech lakehouse architecture",
    className: "text-[22px] font-medium tracking-[-0.5px] font-sans",
  },
  {
    level: "H3",
    specs: "16px · 500 · normal",
    fontLabel: "Geist",
    sample: "Cloud platforms",
    className: "text-[16px] font-medium font-sans",
  },
  {
    level: "Body",
    specs: "14px · 400 · lh 1.7",
    fontLabel: "Geist",
    sample:
      "Building scalable data pipelines that process terabytes daily across distributed systems with sub-second query latency.",
    className: "text-[14px] font-normal leading-[1.7] font-sans",
  },
  {
    level: "Code",
    specs: "13px · 400 · JetBrains Mono",
    fontLabel: "JetBrains Mono",
    sample: "SELECT * FROM lakehouse.events LIMIT 1000;",
    className: "text-[13px] font-normal font-mono",
  },
  {
    level: "Stats",
    specs: "24px · 500 · −0.5px · JetBrains Mono",
    fontLabel: "JetBrains Mono",
    sample: "99.9%",
    className: "text-[24px] font-medium tracking-[-0.5px] font-mono",
  },
] as const;

// ── Tech badges ─────────────────────────────────────────────────────────────
const badges = [
  "Next.js",
  "TypeScript",
  "Supabase",
  "PostgreSQL",
  "Tailwind CSS",
  "Python",
  "Apache Spark",
  "Delta Lake",
] as const;

// ── Section label helper ─────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-[22px] font-medium tracking-[-0.5px] whitespace-nowrap">
        {children}
      </h2>
      <div className="flex-1 border-t border-[rgba(139,146,165,0.2)]" />
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function DesignSystem() {
  return (
    <div className="dot-grid min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

        {/* Back link */}
        <div>
          <Link
            href="/"
            className="text-ash text-sm hover:text-bone transition-colors duration-150"
          >
            ← Back to home
          </Link>
        </div>

        {/* Header */}
        <header>
          <p className="text-plasma text-[10px] tracking-[0.15em] uppercase font-mono mb-3">
            Plasma Grid
          </p>
          <h1 className="text-[36px] font-medium tracking-[-1.2px]">
            Design system
          </h1>
          <p className="text-ash mt-2 max-w-md">
            All visual tokens for the JStalin. portfolio. Dark-first, no light mode.
          </p>
        </header>

        {/* ── Color palette ───────────────────────────────────────────── */}
        <section>
          <SectionLabel>Color palette</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-6">
            {palette.map(({ token, hex, desc }) => (
              <div
                key={token}
                className="rounded-[12px] overflow-hidden border border-[rgba(139,146,165,0.2)]"
              >
                <div className="h-20" style={{ backgroundColor: hex }} />
                <div className="bg-carbon px-3 py-3 space-y-0.5">
                  <p className="text-bone text-sm font-medium">{token}</p>
                  <p className="font-mono text-[13px] text-ash">{hex}</p>
                  <p className="text-ash text-[11px]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Typography scale ────────────────────────────────────────── */}
        <section>
          <SectionLabel>Type scale</SectionLabel>
          <div className="mt-6 space-y-0 divide-y divide-[rgba(139,146,165,0.1)]">
            {typeScale.map(({ level, specs, fontLabel, sample, className }) => (
              <div
                key={level}
                className="py-6 grid grid-cols-1 sm:grid-cols-[100px_180px_1fr] gap-x-6 gap-y-2 items-baseline"
              >
                <span className="text-ash text-[10px] tracking-[0.12em] uppercase font-mono">
                  {level}
                </span>
                <span className="text-ash font-mono text-[11px] hidden sm:block">
                  {specs}
                </span>
                <span className={className}>{sample}</span>
              </div>
            ))}
          </div>
          <p className="text-ash text-[11px] font-mono mt-2">
            stats &amp; code levels use JetBrains Mono — all other levels use Geist
          </p>
        </section>

        {/* ── Buttons ─────────────────────────────────────────────────── */}
        <section>
          <SectionLabel>Buttons</SectionLabel>
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <button className="bg-plasma text-midnight text-sm font-medium px-5 py-2.5 rounded-[8px] hover:opacity-90 transition-opacity duration-150">
              Download CV
            </button>
            <button className="border border-[rgba(139,146,165,0.2)] text-bone text-sm px-5 py-2.5 rounded-[8px] hover:border-ash transition-colors duration-150">
              Get in touch
            </button>
          </div>
          <p className="text-ash text-[11px] font-mono mt-3">
            primary — bg plasma · text midnight &nbsp;·&nbsp; secondary — transparent bg · border ash
          </p>
        </section>

        {/* ── Availability pill ───────────────────────────────────────── */}
        <section>
          <SectionLabel>Availability pill</SectionLabel>
          <div className="mt-6 flex items-center gap-6">
            <div className="inline-flex items-center gap-2 bg-carbon border border-[rgba(139,146,165,0.2)] rounded-[8px] px-3 py-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-plasma animate-pulse"
                style={{ boxShadow: "0 0 6px rgba(0,229,160,0.5)" }}
              />
              <span className="text-[10px] tracking-[0.15em] uppercase font-mono text-bone">
                Available Q2 2026
              </span>
            </div>
          </div>
          <p className="text-ash text-[11px] font-mono mt-3">
            plasma dot · carbon bg · 10px mono label · letter-spacing 0.15em
          </p>
        </section>

        {/* ── Tech badges ─────────────────────────────────────────────── */}
        <section>
          <SectionLabel>Tech badges</SectionLabel>
          <div className="mt-6 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="font-mono text-[12px] text-ash bg-carbon border border-[rgba(139,146,165,0.2)] rounded-[8px] px-2.5 py-1"
              >
                {badge}
              </span>
            ))}
          </div>
        </section>

        {/* ── Borders & radius ────────────────────────────────────────── */}
        <section>
          <SectionLabel>Borders &amp; radius</SectionLabel>
          <div className="mt-6 flex flex-wrap gap-8 items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-[8px] border border-[rgba(139,146,165,0.2)] bg-carbon" />
              <span className="text-ash text-[11px] font-mono">8px — small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-14 rounded-[12px] border border-[rgba(139,146,165,0.2)] bg-carbon" />
              <span className="text-ash text-[11px] font-mono">12px — cards</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 border-t border-[rgba(139,146,165,0.2)]" style={{ borderTopWidth: "0.5px" }} />
              <span className="text-ash text-[11px] font-mono">0.5px border</span>
            </div>
          </div>
        </section>

        {/* ── Dot-grid pattern ────────────────────────────────────────── */}
        <section>
          <SectionLabel>Dot-grid background pattern</SectionLabel>
          <div className="mt-6 dot-grid rounded-[12px] border border-[rgba(139,146,165,0.2)] h-36 flex items-center justify-center bg-midnight">
            <span className="text-ash text-[11px] font-mono">
              radial-gradient · <span className="text-bone">24×24</span>px · rgba(<span className="text-bone">139</span>,<span className="text-bone">146</span>,<span className="text-bone">165</span>,<span className="text-bone">0.08</span>)
            </span>
          </div>
        </section>

        {/* ── Sample card ─────────────────────────────────────────────── */}
        <section>
          <SectionLabel>Sample card</SectionLabel>
          <div className="mt-6 bg-carbon border border-[rgba(139,146,165,0.2)] rounded-[12px] p-6 max-w-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-ash text-[10px] tracking-[0.12em] uppercase font-mono mb-1">
                  Fintech
                </p>
                <h3 className="text-[16px] font-medium">
                  Real-time fraud detection
                </h3>
              </div>
              <span className="font-mono text-[12px] text-ash bg-midnight border border-[rgba(139,146,165,0.2)] rounded-[8px] px-2 py-0.5">
                2024
              </span>
            </div>
            <p className="text-ash text-[14px] leading-[1.7] mb-4">
              Streaming lakehouse ingesting{" "}
              <span className="font-mono text-bone">2M</span> events/day with{" "}
              <span className="font-mono text-bone">42ms</span> P99 latency.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {["Spark", "Kafka", "Delta Lake"].map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[11px] text-ash bg-midnight border border-[rgba(139,146,165,0.2)] rounded-[8px] px-2 py-0.5"
                >
                  {tech}
                </span>
              ))}
            </div>
            <p className="text-plasma text-[13px] font-medium">
              View case study →
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[rgba(139,146,165,0.2)] pt-8">
          <p className="text-ash text-[11px] font-mono">
            JStalin<span className="text-plasma">.</span> — Plasma Grid design
            system · Phase <span className="font-mono text-bone">0</span>
          </p>
        </footer>

      </div>
    </div>
  );
}
