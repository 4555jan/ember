# Ember web

Next.js 14 (App Router) + TypeScript + Tailwind. Runs on mock data and demo auth.

## Run it
```bash
npm install
npm run dev        # http://localhost:3000
```
Open `/login` and use **Enter as brand** or **Enter as creator** (demo mode). Creator demo opens the Studio at `/dashboard`.

## Adding a backend later
Auth is demo-only (`hooks/useAuth.ts`, stored in `localStorage`). Data comes from `lib/data/*.ts` and `data/seed.ts`; every function there is async, so you can swap the bodies for real API calls without touching the pages.

## Where things live
- `app/` routes. `/creators` wraps `CreatorExplorer` in `<Suspense>` because it reads filters from the URL.
- `components/ui` small shadcn-style primitives (hand-written, no CLI needed).
- `lib/data` the mock data layer. `data/seed.ts` is the seed. `public/seed/` holds the placeholder artwork.
- `components/home` also holds Nyx (the seated mascot), the prompt window and the live leaderboard.

## Notes
- Demo accounts are stored in `localStorage` in plain text. Never use demo mode for real users.
