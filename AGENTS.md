# AGENTS.md — Skill Edge Learning v2 (Skill Operating System)

> Orchestration context file. Read this FIRST in every agent session, together with `PLAN.md`.
> Keep both updated when architecture changes.

## 1. Project Summary

**Skill Edge Learning (SEL)** is a *skill operating system*, not a course site. Students master
12 real-world skills through 10 practical **missions** per skill. The core loop:

```
Mission Overview → Learning Resources → Practical Assignment → Student Submission
→ Admin Review → Feedback (resubmit if needed) → APPROVED
→ XP + Neurons + Badges → Portfolio item auto-created → Next mission unlocks
```

Every approved mission becomes a **portfolio project**. Certificates auto-issue at mission 5
(Phase Completion) and mission 10 (Skill Completion) with QR verification. MCQ quizzes exist
only as optional "knowledge checks" (+15 XP) and weekly Neuron tournaments — never as
completion criteria.

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS 3 — premium dark-only theme (see palette below) |
| Fonts | Inter (body) · Outfit (display headings, `font-display`) · JetBrains Mono (metrics) |
| Icons | `lucide-react` ONLY — **no emoji anywhere in UI** |
| Motion | `framer-motion`, CSS `animate-fade-up`/`animate-scale-in`, `canvas-confetti` |
| Auth | **Clerk** — the only identity source. `src/middleware.ts` (clerkMiddleware) protects all non-public routes. Admin = email in allowlist (`adminEmails()` in utils; env `NEXT_PUBLIC_ADMIN_EMAILS`). No demo login exists. |
| Data | Client-side store (`src/lib/store.tsx`, React context) persisted to localStorage `skilledge-state-v2`, keyed to the signed-in Clerk user. Schema mirrors the target Supabase/Postgres design; the store is the ONLY mutation point so a real backend swaps in without page changes. v1 state auto-migrates (edgeCoins → neurons). |
| Payments | Razorpay + Stripe API routes under `src/app/api/payments/*` (activate via env keys); manual UPI + admin verification always available. |
| Ads | Google AdSense — `AdSenseLoader` + `<AdSlot/>`, FREE-plan users only; Pro/Founder see zero ads. `/ads.txt` served from env. |

**Env vars**: see `.env.example` (Clerk, admin emails, AdSense client/slot, Razorpay, Stripe).

## 3. Design System (exact — do not improvise)

Backgrounds `#0B0F19` (base) / `#111827` (surface) / `#1A2235` (card) / `#222C44` (hover);
border `#2D3748`; brand `#3B82F6`→`#2563EB`; accent `#06B6D4`; premium `#8B5CF6`;
success `#22C55E`; warning `#FACC15`; danger `#EF4444`; text `#FFF`/`#D1D5DB`/`#9CA3AF`/`#6B7280`.

Tailwind tokens: `bg-base bg-surface bg-card bg-hover border-line text-brand accent premium success warning danger rounded-card font-display`.
Utility classes (globals.css): `.clay-card .glass .glass-strong .card-glow .btn-primary .btn-ghost .btn-danger .btn-premium .input-dark .chip .status-* .skeleton .progress-track/.progress-fill`.
Shared components (`src/components/ui.tsx`): `PageHeader SectionTitle StatCard EmptyState Skeleton(Card) ProgressRing ProgressBar Modal AnimatedNumber NeuronBadge StatusPill`.
Also: `UserAvatar` (photo/initials — never emoji), `SkillIcon` (lucide registry by name), `AdSlot`/`UpgradeBanner`.

## 4. Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | public | Landing |
| `/login` `/register` | public | Clerk auth |
| `/pricing` | public | Plans + checkout (UPI / Razorpay / Stripe) |
| `/p/[userId]` `/certificate/[certId]` `/verify/[code]` | public | Portfolio share & cert verification |
| `/dashboard` | auth | Learning HQ |
| `/skills` → `/learn/[skillId]` → `/mission/[missionId]` | auth | Catalog → mission map → mission experience |
| `/portfolio` `/certificates` `/profile` | auth | Student artifacts |
| `/leaderboard` `/quizzes` `/quiz/[quizId]` | auth | Competition |
| `/wallet` `/billing` | auth | Neurons & subscription |
| `/admin` | admin | Overview analytics · Reviews queue · Skills CRUD · Missions CRUD · Users · Payments · Announcements |
| `/api/payments/razorpay|stripe/*` | server | Gateway scaffolding (env-gated) |

## 5. Core Data Model (v2 — see `src/lib/types.ts`)

`User` (neurons, xp, streak, subscription{plan FREE|PRO_MONTHLY|PRO_YEARLY|FOUNDER_LIFETIME}, badges) ·
`Skill` (catalog editable by admin; missions[]) · `Mission` (objective, expectedOutcome, resources[],
assignment{brief, deliverables, checklist, allowedSubmissionTypes}, reflectionQuestions, quiz,
xpReward, neuronReward, isPremium ≥ order 5, isLocked) · `Submission` (status PENDING|UNDER_REVIEW|
APPROVED|REJECTED|NEEDS_IMPROVEMENT, links/files/reflections, feedback, score) · `PortfolioItem` ·
`Transaction` (neuron ledger) · `PaymentRecord` (INR: plans + topups) · `Coupon` · `Certificate` ·
`Quiz`/`QuizEntry` (neuron tournaments) · `BadgeDef` · `Announcement`.

Unlock rule: mission N ⇔ N=1 or N−1 approved; missions 5–10 need active Pro/Founder plan;
admin `isLocked` overrides all. Plans gate ads too: FREE sees AdSense, paid never does.

## 6. Conventions

- `src/app/*` routes (client components wrapped in `<AppShell>`), `src/components/*` shared UI,
  `src/lib/*` types/data/store/utils. Admin tabs in `src/components/admin/`.
- All state mutations go through `useApp()` store actions. Never touch localStorage directly.
- `layout.tsx` stays a server component; everything under it is client.
- Currency label is **Neurons** (lucide `Hexagon` / `NeuronBadge`). `fmtNeurons`, `fmtInr`, `fmtNum`.
- Commits: conventional (`feat(scope): …`), one per logical feature, logged in `PROGRESS.md`.
- Mission ids keep the v1 scheme `${skillId}-level-${n}` so old progress migrates.

## 7. What the owner must provide to activate integrations

| Feature | Needed | Env |
|---|---|---|
| AdSense | Publisher ID + Display ad-unit slot id | `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT` |
| Razorpay | Key id + secret | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` |
| Stripe | Secret key | `STRIPE_SECRET_KEY` |
| Extra admins | emails | `NEXT_PUBLIC_ADMIN_EMAILS` |

## 8. Next epic (not in this build)

Supabase migration (replace store persistence; enables cross-device sync, true public
portfolio/verify links), AI project review, community, referrals, jobs board, mobile app.
The store API is the seam — reimplement its actions against the backend, pages stay untouched.
