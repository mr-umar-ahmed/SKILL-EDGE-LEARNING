# PLAN.md — Skill Edge Learning v2 ("Skill Operating System")

> The single source of truth for the v2 rebuild. Read together with `AGENTS.md`.
> Vision: students don't consume content — they **execute**. Every mission produces real work,
> every skill produces a portfolio, every certificate represents real projects.

---

## 0. Honest scope notes (read first)

Everything below is built in this codebase now, with one architectural reality:
the data layer is still **client-side (localStorage), keyed per signed-in Clerk user**, structured
exactly like the target database schema. This is deliberate:

- The store (`src/lib/store.tsx`) is the **only** mutation point — swapping localStorage for
  Supabase/Postgres later means re-implementing store actions, not rebuilding pages.
- Things that fundamentally need a server DB are built UI-complete and API-scaffolded, and
  activate fully once real infra keys are provided:
  - **Razorpay / Stripe**: API routes exist (`/api/payments/*`), env-gated. Until keys are set,
    the manual UPI + admin-approval flow (already live) is the payment path.
  - **AdSense**: fully wired, activates when `NEXT_PUBLIC_ADSENSE_CLIENT` is set.
  - **Cross-device sync, true public portfolio/verify links**: work in-browser now; global once
    the DB lands (Supabase migration is the next epic after this one).

**What the owner must provide** (nothing blocks the build; these activate features):

| Feature | Needed from owner | Env var |
|---|---|---|
| AdSense | Publisher ID `ca-pub-XXXXXXXXXXXXXXXX` | `NEXT_PUBLIC_ADSENSE_CLIENT` |
| Razorpay | Key ID + Secret from dashboard | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` |
| Stripe (optional for INR) | Secret key | `STRIPE_SECRET_KEY` |
| Admin access | Admin email list | `NEXT_PUBLIC_ADMIN_EMAILS` (defaults include skilledgelearning@gmail.com) |
| Clerk (already set) | — | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` |

---

## 1. Design system v2 — "funded startup" look

Inspiration: Linear / Stripe / Vercel / Notion / Duolingo. **Dark-only premium theme.**

### Palette (exact, from owner)

| Token | Hex | Tailwind name |
|---|---|---|
| bg primary | `#0B0F19` | `bg-base` |
| bg secondary | `#111827` | `bg-surface` |
| card | `#1A2235` | `bg-card` |
| hover | `#222C44` | `bg-hover` |
| brand | `#3B82F6` | `brand` |
| brand deep | `#2563EB` | `brand-deep` |
| accent | `#06B6D4` | `accent` |
| premium purple | `#8B5CF6` | `premium` |
| success | `#22C55E` | `success` |
| warning | `#FACC15` | `warning` |
| error | `#EF4444` | `danger` |
| text primary | `#FFFFFF` | `text-primary` |
| text secondary | `#D1D5DB` | — |
| text muted | `#9CA3AF` | — |
| text disabled | `#6B7280` | — |
| border | `#2D3748` | `line` |

### Rules

- Typography: **Inter** (body), **Outfit** (display/headings), JetBrains Mono (metrics only).
- Cards: 16–20px radius, `#1A2235`, 1px `#2D3748` border, soft shadow, subtle glass blur,
  gradient border glow on hover.
- Buttons: primary = blue gradient (`#3B82F6→#2563EB`) rounded-xl shadow; secondary =
  transparent + border; danger = red. All with hover/active transitions.
- Icons: **Lucide only. No emoji icons anywhere in UI chrome.**
- Motion: framer-motion page/card transitions, XP counter animation, progress bar sweeps,
  confetti on mission approval/certificates, skeleton loaders everywhere data loads.
- Existing utility classes (`.glass`, `.clay-card`, `.btn-primary`, `.btn-ghost`, `.input-dark`,
  `.chip`, `.neo-*`) are **redefined** to the new language in `globals.css` so every page
  inherits the new look; pages are then upgraded structurally on top.

---

## 2. Data model v2 (mirrors target SQL for future Supabase)

```
users:          id(clerk), name, email, role, avatarUrl?, bio, neurons, xp, streak, plan info…
subscription:   plan FREE | PRO_MONTHLY | PRO_YEARLY | FOUNDER_LIFETIME, status, startedAt, expiresAt
catalog:        Skill[] — FULLY editable by admin (stored in state, seeded once)
  skill:        id, title, category, description, difficulty, estimatedHours, thumbnailUrl, color,
                iconName, tiers → missions
  mission:      id, skillId, order(1-10), title, objective, expectedOutcome, description,
                difficulty, estimatedMinutes, prerequisites[], resources[], assignment,
                reflectionQuestions[], quiz (optional knowledge-check), xpReward, neuronReward,
                isPremium (order 5-10 = Pro), badgeId?
  resource:     type VIDEO|PDF|ARTICLE|TEMPLATE|DOCUMENT|LINK|IMAGE, title, url, minutes?
  assignment:   brief, deliverables[], checklist[], allowedSubmissionTypes[]
submissions:    id, userId, missionId, skillId, note, links[{kind,url}], files[{name,size,dataUrl?}],
                reflections[], status PENDING|UNDER_REVIEW|APPROVED|REJECTED|NEEDS_IMPROVEMENT,
                feedback, score(0-100), reviewedBy, reviewedAt, resubmissionOf?, createdAt
portfolio:      id, userId, missionId, skillId, title, description, links, coverImage?, completedAt, featured
transactions:   neuron ledger (EARNED|PURCHASED|SPENT|ADMIN_GRANT|PRIZE|STREAK|CHALLENGE)
payments:       INR records: plan purchases + neuron topups, method UPI|RAZORPAY|STRIPE,
                status PENDING|APPROVED|REJECTED, utr/gateway ids
badges:         earned badge ids per user; badge defs in data (lucide icon, name, criteria)
certificates:   id, userId, skillId, kind, verificationCode, issuedAt  (+ QR on render)
quizzes:        weekly tournament system (kept from v1, restyled)
announcements, notifications, dailyGoals/streak data
```

**Migration**: `skilledge-state-v1` → v2 (`skilledge-state-v2`): edgeCoins → **neurons** (1:1),
completed level ids → completed mission ids (same id scheme), catalog seeded from `data.ts`.

### Neurons (replaces EdgeCoins)

Earned: mission approval, streaks, challenges, quiz prizes, admin grants.
Spent: premium templates (future), tournament entries, cosmetics (future).
Display: Lucide `Hexagon`/brain glyph + formatted number. `10 INR = 20 neurons` for topups.

---

## 3. Learning flow v2 (the core product change)

```
Mission Overview → Learning Resources → Practical Assignment (checklist)
→ Student Submission (text / links / files) → Review (admin, later AI)
→ Feedback → (Resubmission if needed) → APPROVED
→ XP + Neurons + Badge → Portfolio item auto-created → Next mission unlocks
```

- MCQ quiz becomes an optional "Knowledge Check" inside a mission — **never** the completion
  criterion. Completion = approved submission.
- Every skill's 10 missions have hand-written practical assignments with deliverables +
  checklist + reflection questions (e.g. Entrepreneurship: interviews → validation → lean
  canvas → landing page → MVP; Design: posters, carousels, logos; Video: reels, sound design…).
- Submission types: text, URL, Google Drive, GitHub, Figma, Canva, Notion, YouTube, image/PDF/ZIP
  file (small files stored inline as data URLs until real storage; links preferred and unlimited).
- Unlock rule: mission N unlocked ⇔ N==1 or mission N−1 **approved**; missions 5–10 need Pro
  (or Founder) plan. Admin can force-lock/unlock any mission globally per catalog.

---

## 4. Routes v2

| Route | Status | Notes |
|---|---|---|
| `/` | rebuild | Premium landing: hero, outcome-first pitch, skills, how-it-works, pricing, footer |
| `/login` `/register` | restyle | Clerk components, dark theme variables |
| `/dashboard` | rebuild | Today's mission, continue learning, stats, streak, goals, activity, announcements |
| `/skills` | new | Catalog grid with categories, difficulty, progress |
| `/learn/[skillId]` | rebuild | Tier/mission map with statuses (locked/available/pending review/approved) |
| `/mission/[missionId]` | new | The full mission experience + submission + feedback thread |
| `/portfolio` | new | Own projects; feature/hide; share link |
| `/p/[userId]` | new | Public portfolio view |
| `/profile` | rebuild | Photo/bio/stats/badges/certs/streak |
| `/leaderboard` | restyle | XP + neurons + streak boards |
| `/quizzes`, `/quiz/[id]` | restyle | Tournament arena (kept) |
| `/wallet` | rebuild of `/payment` | Neuron balance, ledger, topup |
| `/pricing` | new | 4 plans, feature matrix, checkout (Razorpay/Stripe/UPI) |
| `/billing` | new | Subscription status, history, manage |
| `/certificates` | new | Earned certs list |
| `/certificate/[certId]` | upgrade | QR code + professional design + download |
| `/verify/[code]` | new | Certificate verification |
| `/admin` | rebuild | Overview analytics, Skills CRUD, Missions CRUD, Reviews, Users, Payments, Announcements |
| `/api/payments/razorpay/order` + `verify` | new | env-gated |
| `/api/payments/stripe/checkout` + `verify` | new | env-gated |
| `/ads.txt` | new | served from env |
| error / not-found / loading | new | branded states |

---

## 5. Admin panel v2

- **Overview**: total/active users, revenue (INR), subscriptions by plan, popular skills,
  mission completion + submission funnel, certificates issued, user growth chart.
- **Skills**: add/edit/delete skill (name, description, thumbnail URL, difficulty, category,
  estimated time, color, icon).
- **Missions**: per skill — create/edit/delete/reorder, lock/unlock, edit objective/outcome/
  assignment/checklist/reflections, attach resources (YouTube, PDF, article, template, doc,
  link, image), set XP/neuron rewards, premium flag.
- **Reviews**: queue of submissions → open detail → approve / reject / needs improvement,
  feedback text, score; approval triggers rewards + portfolio + unlock.
- **Users**: list, adjust neurons/XP, grant plan, issue certificate.
- **Payments**: UPI verification queue (approve → credit neurons or activate plan).
- **Announcements**: broadcast to all/one user.

## 6. Gamification

XP, Neurons, streaks (daily activity), badges (lucide-icon defs, earned on milestones),
daily goal, weekly challenge card, leaderboard ranks, confetti + reward modal on approval,
animated counters and progress bars. Student tiers 1–7 (Starter→Master Practitioner) kept.

## 7. Payments & plans

| Plan | Price | Gets |
|---|---|---|
| Free | ₹0 | Missions 1–4 per skill, basic certificate, community, **ads shown** |
| Pro Monthly | ₹499/mo | All skills+missions, projects review, portfolio, certificates, **no ads** |
| Pro Yearly | ₹4,999/yr | Everything in Pro, 2 months free |
| Founder Lifetime | ₹2,999 (launch, list ₹4,999) | Lifetime, founder badge, priority access, **no ads** |

Flows: Razorpay checkout (order→signature verify) when keys present; Stripe checkout scaffold;
manual UPI QR + UTR + admin approval always available. Billing history + status page.
Coupon codes: simple code list in admin (percent off) applied at checkout.

## 8. AdSense (owner's account)

- `AdSenseLoader` (in root layout, client): injects the official script **only when**
  `NEXT_PUBLIC_ADSENSE_CLIENT` is set **and** current user's plan is FREE.
- `<AdSlot slot="…"/>`: responsive `<ins class="adsbygoogle">` with "Sponsored" label and
  "Remove ads with Pro →" link. Renders nothing for paid users; dev placeholder when unconfigured.
- Placements (non-intrusive, policy-safe): bottom of dashboard, bottom of skill map page,
  bottom of leaderboard. Never inside the mission learning flow.
- `/ads.txt` route serves `google.com, pub-XXXX, DIRECT, f08c47fec0942fa0` from env.
- Upgrade banner for free users links to `/pricing`.

## 9. Build order (commits)

1. `docs(plan)`: this file
2. `feat(design-system)`: tokens, globals, ui lib, shell, layout
3. `feat(data-v2)`: types, catalog+assignments, store v2 + migration, neurons
4. `feat(auth)`: middleware, admin allowlist, Clerk-only (no demo login)
5. `feat(missions)`: skills catalog, learn map, mission page, submissions
6. `feat(admin-v2)`: CRUD + review queue + analytics
7. `feat(portfolio-certs)`: portfolio, public view, QR certificates, verify
8. `feat(pages-v2)`: dashboard, profile, leaderboard, landing
9. `feat(payments)`: pricing, billing, Razorpay/Stripe routes, plan gating
10. `feat(adsense)`: conditional ads
11. `chore(polish)`: error/loading/empty states, docs, final build → push

## 10. Future epics (architecture-ready, not in this build)

Supabase/Postgres migration (store swap), AI mentor + AI project review, community/forums,
referrals, jobs board, creator platform, company dashboard, mobile app.
