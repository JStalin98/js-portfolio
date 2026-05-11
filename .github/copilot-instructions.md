# JStalin Portfolio — Copilot Instructions

These instructions apply to every code suggestion, edit, and chat response in this repository. Read and follow strictly.

## Project goal

Personal portfolio website for **Jose Stalin Andrade Cartuche**, positioning him as a **Data Architect / AI Architect / Data Solution Architect**. Primary audience: technical senior recruiters. Site entirely in **English**.

Logo / wordmark: `JStalin.` (the dot is part of the logo, in Plasma accent color).

## Tech stack (do not deviate)

- Framework: Next.js 14+ App Router, TypeScript (strict), Tailwind CSS
- Database: Supabase (PostgreSQL + Auth + Storage)
- Auth: Supabase Auth, email/password
- PDF: `@react-pdf/renderer` for on-the-fly ATS-friendly CV
- Email: Resend
- Animations: Framer Motion — subtle only
- Icons: Tabler Icons (outline)
- Rich text: Tiptap
- Drag-and-drop: `@dnd-kit/sortable`
- Forms: react-hook-form + Zod
- Deployment: Vercel
- Package manager: pnpm

## Editing model — Inline edit-in-place (NO separate admin panel)

There is **no `/admin` route**. The site has a single experience:
- Public visitors see a polished, read-only portfolio
- Admin (when logged in) sees the same site with inline edit controls layered on top

### How it works

- Login route: `/login` — discreet, not linked from public nav. Supabase email/password.
- After login, `isAdmin` flag is available via Supabase session + middleware
- When `isAdmin === true`:
  - Floating admin toolbar (fixed bottom-right): editing mode toggle, logout, preview as visitor, unread messages badge
  - Hover controls on every editable item: pencil (edit), trash (delete), drag handle (reorder)
  - "+ Add new" button at the end of lists
  - Edits open a slide-over panel (Sheet) from the right, NOT a modal. The page stays visible behind it.
  - Save → optimistic UI update + Supabase write + `revalidatePath`. No page reload.
- When `isAdmin === false`: zero admin UI rendered. Identical to a public visitor's view. No flash, no leaks.

### Editable areas

Every public section is editable inline:
- Hero, About, Skills, Experience (list + `/experience/[slug]` detail pages), Projects (list + `/projects/[slug]` detail pages), Contact channels, personal info, hero metrics, availability status
- Contact messages inbox is a slide-over opened from the admin toolbar, not a route

### Reorder UX

Drag-and-drop with `@dnd-kit/sortable` for lists with an `order` field. Drag handle only visible to admin on hover.

### Admin control visuals

- Subtle, monochrome (Ash on hover). Never Plasma — Plasma is reserved for content/brand
- Fade in on hover (150ms), never always-visible
- Slide-over panels: bg Carbon, border 0.5px Ash, 480px desktop, full-width mobile
- Form inputs inside slide-overs use the same brand system, no custom admin styling

### Safety

- Inline confirm for destructive actions (trash → second click within 3s commits). No modals.
- Optimistic updates with rollback on error + toast notification
- Server actions validate admin on every mutation (defense in depth alongside RLS)

## Brand system — Plasma Grid (strict, dark-first)

### Palette

| Token | Hex | Usage |
|---|---|---|
| `midnight` | `#0B1220` | Main background |
| `carbon` | `#1A1F2E` | Cards, elevated sections, edit panels |
| `ash` | `#8B92A5` | Secondary text, metadata, admin controls |
| `bone` | `#F4F2EC` | Primary text on dark |
| `plasma` | `#00E5A0` | AI accent, CTAs, active states — 5% only |

Distribution: 55% Midnight · 30% Bone · 10% Ash · 5% Plasma.
Plasma ONLY in: CTAs, "live" indicators, key metrics, AI indicators. Never decorative. Never in admin chrome.

### Typography

Load via Google Fonts:
```
https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap
```

- Geist (sans) — display + UI — weights 300, 400, 500 only
- JetBrains Mono — code, numbers, metrics, technical badges — weights 400, 500

### Type scale

| Level | Size | Weight | Tracking | Font |
|---|---|---|---|---|
| Hero | 48px | 500 | -1.5px | Geist |
| H1 | 36px | 500 | -1.2px | Geist |
| H2 | 22px | 500 | -0.5px | Geist |
| H3 | 16px | 500 | normal | Geist |
| Body | 14px | 400 | lh 1.7 | Geist |
| Code | 13px | 400 | normal | JetBrains Mono |
| Stats | 24px+ | 500 | -0.5px | JetBrains Mono |

### Visual rules (non-negotiable)

- ALL numbers (metrics, percentages, years, latencies, IDs) use JetBrains Mono. Never Geist.
- Sentence case everywhere. No Title Case. No ALL CAPS — except tiny 10px labels with letter-spacing like `AVAILABLE Q2 2026`.
- Borders: 0.5px Ash, `rgba(139,146,165,0.2)`
- Border-radius: 8px small elements, 12px cards
- No gradients, no shadows, no glow — except the "live" Plasma dot
- Optional bg pattern: radial dot grid 24x24px, `rgba(139,146,165,0.08)`
- Primary button: bg Plasma, text Midnight
- Secondary button: transparent bg, border Ash, text Bone
- Dark-first only. No light/dark toggle.
- Generous whitespace. Information density only in metrics and code blocks.
- No emojis in UI. Icons only when functional, Tabler outline.

## Site sections

1. **Hero** — name, roles, tagline, "live" availability pill (Plasma dot + small label), CTAs (Download CV primary, Get in touch secondary), 3–4 key metrics in JetBrains Mono
2. **About** — two-column on desktop, bio + quick facts in monospace badges
3. **Skills** — Hard skills grouped by category (Cloud, Data Platforms, AI/ML, Languages, Tools) with optional proficiency; Soft skills as simpler list
4. **Experience** — vertical timeline; each entry: company, role, dates (mono), 2-line summary, tech chips, "View details →" link to `/experience/[slug]` with full architect-depth content
5. **Projects** — grid of cards; each → `/projects/[slug]` detail page with problem, architecture, diagrams (uploaded images), explanation, tech stack, results, GitHub URL if set
6. **Contact** — left: channels (email with copy-to-clipboard, LinkedIn, GitHub, location); right: form (Name, Email, Subject, Message) → stores in Supabase + Resend notification

## Global UI

- Top nav: `JStalin.` logo (left), section links + "Download CV" primary CTA (right). Sticky, backdrop-blur on scroll.
- Footer: minimal — social links, copyright, small `JStalin.` mark.
- SEO: meta tags, Open Graph, robots.txt, sitemap.xml, Person + JobTitle schema.org
- Responsive: mobile-first, breakpoints 640 / 768 / 1024 / 1280

## CV PDF generation

- "Download CV" button → `/api/cv` route
- Generated at request time via `@react-pdf/renderer` from current Supabase data
- ATS-optimized: single column, standard section headings (Summary, Experience, Skills, Education, Projects, Contact), selectable text, Helvetica font inside PDF (Geist may not be ATS-safe), no tables, no multi-column, no headers/footers with critical info
- Filename: `Jose_Stalin_Andrade_Cartuche_CV.pdf`

## Database schema (Supabase)

- `personal_info` (singleton): full_name, headline, tagline, email, location, linkedin_url, github_url, availability_status, hero_metrics jsonb
- `about`: content (rich text), quick_facts jsonb
- `skills`: id, category, name, type ('hard'|'soft'), level (1-5 nullable), order
- `experiences`: id, slug, company, role, location, start_date, end_date (nullable = current), summary, full_content, tech_stack text[], order
- `projects`: id, slug, title, summary, full_content, tech_stack text[], github_url, demo_url, images text[], order
- `contact_messages`: id, name, email, subject, message, created_at, is_read

### Row Level Security

- Public `SELECT` on all content tables
- Only authenticated admin can `INSERT/UPDATE/DELETE` on content tables
- `contact_messages`: public `INSERT`, admin-only `SELECT/UPDATE/DELETE`

## Seed data

Realistic placeholder content for a senior Data/AI Architect — fintech lakehouse architecture, GenAI RAG projects, European-style company names, plausible metrics. Reads as technically credible. To be replaced later by inline editing.

## Non-negotiables

- Pixel-perfect adherence to the brand system
- Every number in JetBrains Mono
- No emojis in UI
- No Title Case in body content
- Admin controls never visible to non-admins, never flash on load
- Admin controls never use Plasma color
- Mobile responsive without compromise
- WCAG AA contrast, semantic HTML, keyboard nav, focus states in Plasma
- TypeScript strict, Supabase generated types
- One feature = one branch = one PR

## Code style

- TypeScript strict mode, no `any` unless documented
- Server Components by default, `'use client'` only when needed (state, events, browser APIs)
- Server Actions for mutations
- Co-locate components by feature when sensible
- Tailwind for styling, no inline styles except for dynamic values
- ESLint + Prettier with default Next.js config
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`

## Workflow

- Work on `develop` branch, merge to `main` via PR
- Each phase = one branch = one PR
- Branch naming: `feat/phase-N-description` (e.g. `feat/phase-0-bootstrap`)
- Vercel preview deploys every PR; verify before merging