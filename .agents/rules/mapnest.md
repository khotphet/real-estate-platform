# MapNest — Project Rules (auto-loaded for every agent session)

## Communication
- Reply to the user in **polite, concise Thai** (ครับ). Code, identifiers, and commit messages in English.

## Product
- MapNest = map-first real-estate marketplace for Thailand. Pilot: **Udon Thani**; must scale to all **77 provinces** (never hardcode Udon).
- Search has **3 views (Agoda style): รายการ (List) · รูปภาพ (Photo) · แผนที่ (Map)**. Filters are shared across views; remember last view.
  - S06 = Map View, S08 = List View (Photo View is a **mode of S08**, not a new screen).
  - S07 filter "แสดงผล" returns to current view; S09 back returns to previous view; S13 "ไม่เจอที่ถูกใจ" banner appears in List **and** Photo.
- Sold listings are hidden from search (Blueprint rule O5).

## Source of truth (Google Drive — keep all 3 in sync)
`/Users/x10/Library/CloudStorage/GoogleDrive-profess538@gmail.com/My Drive/MapNest_Project/`
- `MapNest_Blueprint.md` (spec), `MapNest_Project.xlsx` (13 sheets; sheet 09 = tech stack), `MapNest_Workflow.drawio` (7 tabs)
- Any spec change MUST be applied to all 3 files + `docs/DESIGN.md` (back up first, verify with a script).
- Screen codes are **S01–S52, no gaps**. Prefer modifying screens in place; new screens only from **S53+**.

## Tech stack
- Next.js (App Router) + TypeScript, Tailwind + shadcn/ui, next-intl (TH default / EN)
- MapLibre GL + MapTiler satellite hybrid, Supercluster, Turf, SunCalc
- Drizzle ORM + PostgreSQL 16 + PostGIS (local docker container `mapnest-pg`, port **54329**)
- Redis 7 + BullMQ, Auth.js v5 (LINE / Google + own OTP), sharp, Cloudflare R2, Omise or GB Prime Pay (PromptPay), SSE + Web Push
- Architecture: **modular monolith** (5 modules). Hosting later: Hetzner + Coolify.

## Design tokens (see docs/DESIGN.md)
- Primary Forest Teal `#0F766E`; active `#10B981`; reserved `#F59E0B`; sold `#EF4444`; danger `#DC2626`
- Charts: views `#3B82F6`, speed `#F97316`
- Background `#F8FAFC`, surface `#FFFFFF`, text `#0F172A` / muted `#64748B`, border `#E2E8F0`
- Fonts: Plus Jakarta Sans + Sarabun. Radius 8 / 12 / 16 / pill.
- **NO PURPLE anywhere.**
- Breakpoints: mobile 390, tablet 834, desktop 1440 (also check 360 and 1366).
- Map pins: Agoda-style white pill with thumbnail + price.

## Mock data
12 Udon Thani listings (see docs/DESIGN.md). Search shows 11 (1 sold hidden).

## Environment notes
- Project path contains Thai characters and spaces — always quote paths.
- Docker daemon may be off: use timeouts on docker commands; ask user to open Docker Desktop.
