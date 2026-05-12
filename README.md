# JStalin. — personal portfolio

Personal portfolio for Jose Stalin Andrade Cartuche, Data Architect / AI Architect.

Built with Next.js 16, TypeScript, Tailwind CSS v4, and Supabase.

---

## Setup

### 1. Environment variables

Copy the example file and fill in your Supabase project values:

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → Project Settings → API → `anon` / `public` key |
| `SUPABASE_SECRET_KEY` | Supabase Dashboard → Project Settings → API → `service_role` / `secret` key |

> The service-role key bypasses Row Level Security. Never commit it or expose it to the browser.

### 2. Run database migrations

Migrations live in `db/migrations/`. Run them **in order** via the Supabase SQL editor:

1. Open your project in [app.supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** → **New query**
3. Paste the contents of `db/migrations/0001_init.sql` and click **Run**
4. Paste the contents of `db/migrations/0002_rls.sql` and click **Run**

Both files are idempotent — safe to re-run without side effects.

### 3. Seed the database

After running migrations, populate all tables with realistic placeholder content:

```bash
pnpm seed
```

The seed script is idempotent: running it again updates existing records without creating duplicates.

### 4. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm seed` | Populate Supabase with placeholder content |
