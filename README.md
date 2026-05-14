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

### 4. Contact form (Resend)

The contact form stores submissions in Supabase and sends an email notification via [Resend](https://resend.com).

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key from Resend dashboard (Settings → API Keys) |
| `ADMIN_EMAIL` | The address that receives new contact notifications |

The default `from` address is `onboarding@resend.dev` (Resend's shared domain). To switch to a custom verified domain later:
1. Add and verify your domain in the Resend dashboard (Domains).
2. Update the `from` field in `app/actions/contact.ts` to e.g. `"JStalin portfolio <hello@yourdomain.com>"`.

### 5. Start the development server

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

---

## Admin access

The site has a single admin user managed entirely through the Supabase Auth dashboard. There is no public sign-up flow.

### Signing in

Navigate to `/login` (not linked from the public site). Enter the admin email and password. On success you are redirected to `/` and the floating admin toolbar appears bottom-right.

### Adding or resetting credentials

1. Open your project in [app.supabase.com](https://app.supabase.com).
2. Go to **Authentication** → **Users**.
3. To add a new admin: click **Add user** → **Create new user**, enter email and password.
4. To reset a password: click the user row → **Send password recovery** email, or set a new password directly from the user detail page.

### No public sign-up

The Supabase project has sign-ups disabled. Only users created manually via the Supabase dashboard can authenticate. Do not enable public sign-up for this project.

### How admin state works

- `proxy.ts` runs on every request and refreshes the Supabase session cookie so Server Components always read up-to-date auth state.
- `lib/auth/get-admin-status.ts` is called in `app/layout.tsx` and passes `isAdmin` + `userEmail` as props to `AdminProvider`.
- Client Components read admin state via the `useAdmin()` hook — no client-side auth calls, no flash.
- The admin toolbar and all edit controls are conditionally rendered only when `isAdmin === true`. Non-admins receive a byte-identical public view.
