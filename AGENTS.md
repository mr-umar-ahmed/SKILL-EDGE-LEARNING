# AGENTS.md — Skill Edge Learning (Skill Edge OS)

> Orchestration context file. Read this FIRST in every agent session. Keep it updated when architecture changes.

## 1. Project Summary

**Skill Edge OS** is a gamified, mobile-first learning operating system where youngsters and adults master 12 trending real-world skills through a 10-tier level progression per skill. Core loops: learn (activity or video track) → pass gated assessment (≥80%) → earn XP + EdgeCoins → unlock next level → earn certificates at Tiers 5/8/10. A virtual economy (**EdgeCoin ↁ**, 10 INR = 20 ↁ) powers premium unlocks, weekly paid quiz tournaments, and a manual UPI-QR payment gateway verified by an admin.

Reference design vision: https://skill-edge-os.vercel.app/ — Cyber-Tech Glassmorphism × Duolingo gamification.

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS 3 (dark `#030303` base, cyan `#06b6d4`, violet `#8b5cf6`, gold `#eab308`) |
| Fonts | Inter (sans, via `next/font`) + JetBrains Mono (mono, tech metrics/headers) |
| Icons | `lucide-react` |
| Celebration FX | `canvas-confetti` |
| Data layer | **Mock client-side DB**: seed data in `src/lib/data.ts`, state in React Context (`src/lib/store.tsx`), persisted to `localStorage` (`skilledge-state-v1`). Schema mirrors the target PostgreSQL/Supabase design so a real backend can be swapped in later. |
| Auth | Mock session switcher (Student ⇄ Admin) in the top bar — no real auth yet. |

**Environment variables:** none required for the mock build. When Supabase lands: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## 3. Routes

| Route | Purpose |
|---|---|
| `/` | Landing page (hero, skill showcase, CTA) |
| `/dashboard` | User metrics, motivational quote, skill map hub, recent activity |
| `/learn/[skillId]` | 10-level progression map for one skill (`skillId` = skill slug) |
| `/learn/[skillId]/[levelId]` | Level view — `levelId` = `level-1` … `level-10`. Dual-track (Activity / Video) + gated quiz |
| `/payment` | EdgeCoin wallet, transaction ledger, UPI QR buy-coins modal |
| `/quizzes` | Weekly tournament lobby (countdowns, leaderboards) |
| `/quiz/[quizId]` | Live quiz runner (per-question timer, speed multipliers) |
| `/admin` | Admin panel — users, payment verification, quiz creator, curriculum editor |
| `/certificate/[certId]` | Canvas-rendered certificate, PNG download, share links |

## 4. Core Data Schema (mirrors target SQL)

```ts
users:            id, name, email, role (USER|ADMIN), avatarUrl, edgeCoins, xp, streakCount, createdAt
skills:           id (slug), title, category, iconName, description, color
levels:           id (`${skillSlug}-level-${n}`), skillId, levelNumber (1-10), title, tier,
                  activityContent[], youtubeVideoId, minPassScore (80), coinReward, xpReward,
                  isPremium (levels 7-10), premiumCost
user_progress:    per-user map levelId → { score, completedAt } + premiumUnlocks per skill
transactions:     id, userId, amountCoins, amountInr, type (EARNED|PURCHASED|SPENT_COURSE|SPENT_QUIZ|ADMIN_GRANT|PRIZE),
                  status (PENDING|APPROVED|REJECTED), utrNumber, proofImageName, note, createdAt
quizzes:          id, title, category, entryFeeCoins, prizePoolCoins, startTime, durationMins,
                  questions[], isActive, winnersDeclared
quiz_participants: quizId, userId, score, rank, prizeWonCoins
certificates:     id, userId, skillId, levelTier (5|8|10), verificationCode, issuedAt
```

Unlock rule: level N unlocked ⇔ N = 1, or level N−1 completed with score ≥ 80 — AND, for levels 7-10, the skill's premium tier purchased with EdgeCoins.

## 5. Conventions

- **Folder structure**: `src/app/*` routes, `src/components/*` shared UI, `src/lib/*` types/data/store/utils.
- **State**: single `AppProvider` context (`useApp()` hook). All mutations go through store actions — never mutate localStorage directly from components.
- **Styling**: utility-first Tailwind; glass panels via `.glass` / `.glass-strong` classes in `globals.css`; neon accents per-skill via inline style with the skill's `color`.
- **Client/server**: everything below the root layout is client-rendered (`"use client"`) because state lives in localStorage. Keep `layout.tsx` a server component.
- **Currency symbol**: `ↁ` (EdgeCoin). Format with `fmtCoins()` from `src/lib/utils.ts`.
- **Commits**: conventional commits (`feat(scope): …`, `fix(scope): …`), one commit per logical feature, logged in `PROGRESS.md`.

## 6. Gamification Rules

- XP per level pass: `level.xpReward` (scales with level number). Level badge = 1-10, thresholds in `src/lib/utils.ts` (`levelForXp`).
- Coin reward per level pass: `level.coinReward`. Quiz prizes: 50% / 30% / 20% split of prize pool to top 3.
- Streak: incremented on first completed mission of each calendar day; reset if a day is skipped.
- Certificates auto-issue at Tier 5 (Operator), Tier 8 (Strategist), Tier 10 (Sovereign Master) of any skill.
- Confetti on: level pass, certificate issue, quiz win, payment approval.
