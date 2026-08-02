"use client";

/* eslint-disable @next/next/no-img-element */

import {
  Award,
  Calendar,
  Check,
  Eye,
  EyeOff,
  Figma,
  FileText,
  FolderKanban,
  Github,
  HardDrive,
  Layers,
  Link2,
  NotebookText,
  Palette,
  Paperclip,
  Rocket,
  Share2,
  Sparkles,
  Star,
  Target,
  Youtube,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SkillIcon } from "@/components/SkillIcon";
import { EmptyState, PageHeader, SkeletonCard, StatCard } from "@/components/ui";
import { findSkill } from "@/lib/data";
import { useApp } from "@/lib/store";
import type { PortfolioItem, SubmissionKind } from "@/lib/types";
import { cn, fmtDate, fmtNum } from "@/lib/utils";

/* ------------------------- link kind → lucide icon ------------------------- */

const LINK_META: Record<SubmissionKind, { Icon: typeof Link2; label: string }> = {
  TEXT: { Icon: FileText, label: "Write-up" },
  FILE: { Icon: Paperclip, label: "File" },
  URL: { Icon: Link2, label: "Link" },
  GOOGLE_DRIVE: { Icon: HardDrive, label: "Drive" },
  GITHUB: { Icon: Github, label: "GitHub" },
  FIGMA: { Icon: Figma, label: "Figma" },
  CANVA: { Icon: Palette, label: "Canva" },
  NOTION: { Icon: NotebookText, label: "Notion" },
  YOUTUBE: { Icon: Youtube, label: "YouTube" },
};

/* ------------------------------ project card ------------------------------ */

function ProjectCard({
  item,
  skillTitle,
  skillIcon,
  skillColor,
  onFeature,
  onHide,
}: {
  item: PortfolioItem;
  skillTitle: string;
  skillIcon: string;
  skillColor: string;
  onFeature: () => void;
  onHide: () => void;
}) {
  return (
    <div
      className={cn(
        "card-glow group flex flex-col overflow-hidden animate-fade-up",
        item.featured && "ring-2 ring-premium/60",
        item.hidden && "opacity-60"
      )}
    >
      {/* cover */}
      <div className="relative h-36 w-full overflow-hidden">
        {item.coverImage ? (
          <img
            src={item.coverImage}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${skillColor}26, rgba(11,15,25,0.9))`,
            }}
          >
            <SkillIcon name={skillIcon} className="h-10 w-10 opacity-70" style={{ color: skillColor }} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* state chips */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          {item.featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-premium/40 bg-premium/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-premium backdrop-blur">
              <Sparkles className="h-3 w-3" /> Featured
            </span>
          )}
          {item.hidden && (
            <span className="inline-flex items-center gap-1 rounded-full border border-line bg-base/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 backdrop-blur">
              <EyeOff className="h-3 w-3" /> Hidden
            </span>
          )}
        </div>

        {/* toggles */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <button
            onClick={onFeature}
            title={item.featured ? "Unfeature project" : "Feature project"}
            aria-label={item.featured ? "Unfeature project" : "Feature project"}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border backdrop-blur transition",
              item.featured
                ? "border-premium/50 bg-premium/25 text-premium"
                : "border-line bg-base/70 text-zinc-400 hover:border-premium/50 hover:text-premium"
            )}
          >
            <Star className={cn("h-4 w-4", item.featured && "fill-premium")} />
          </button>
          <button
            onClick={onHide}
            title={item.hidden ? "Show on public portfolio" : "Hide from public portfolio"}
            aria-label={item.hidden ? "Show on public portfolio" : "Hide from public portfolio"}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-base/70 text-zinc-400 backdrop-blur transition hover:border-brand/50 hover:text-white"
          >
            {item.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-base font-bold text-white">{item.title}</h3>
          {item.description && <p className="mt-1 text-xs leading-relaxed text-zinc-400 line-clamp-2">{item.description}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">
            <SkillIcon name={skillIcon} className="h-3.5 w-3.5" style={{ color: skillColor }} />
            {skillTitle}
          </span>
          {typeof item.score === "number" && (
            <span className="chip border-success/40 bg-success/10 text-success">
              <Target className="h-3.5 w-3.5" />
              {item.score}/100
            </span>
          )}
        </div>

        {item.links.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {item.links.map((l, i) => {
              const meta = LINK_META[l.kind] ?? LINK_META.URL;
              const Icon = meta.Icon;
              return (
                <a
                  key={`${l.url}-${i}`}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  title={l.label || meta.label}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-base/60 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-300 transition hover:border-brand/50 hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5 text-brand" />
                  {l.label || meta.label}
                </a>
              );
            })}
          </div>
        )}

        <div className="mt-auto flex items-center gap-1.5 border-t border-line/60 pt-3 text-[11px] text-zinc-500">
          <Calendar className="h-3.5 w-3.5" />
          Shipped {fmtDate(item.completedAt)}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- page --------------------------------- */

export default function PortfolioPage() {
  const { hydrated, currentUser, state, myPortfolio, setPortfolioFeatured, setPortfolioHidden } = useApp();
  const [copied, setCopied] = useState(false);

  const sorted = useMemo(
    () =>
      [...myPortfolio].sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      }),
    [myPortfolio]
  );

  const skillsCovered = useMemo(() => new Set(myPortfolio.map((p) => p.skillId)).size, [myPortfolio]);
  const certCount = useMemo(
    () => (currentUser ? state.certificates.filter((c) => c.userId === currentUser.id).length : 0),
    [state.certificates, currentUser]
  );

  const copyShareLink = async () => {
    if (!currentUser) return;
    const url = `${window.location.origin}/p/${currentUser.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  if (!hydrated || !currentUser) {
    return (
      <AppShell>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        icon={<FolderKanban className="h-5 w-5" />}
        title="My Portfolio"
        subtitle="Every approved mission becomes a real project here. Feature your best work, hide the rest, and share one link."
        action={
          <button onClick={copyShareLink} className={cn(copied ? "btn-ghost border-success/50 text-success" : "btn-primary")}>
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Link Copied
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" /> Share Portfolio
              </>
            )}
          </button>
        }
      />

      {/* stats strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Projects" value={fmtNum(myPortfolio.length)} icon={<Rocket className="h-4 w-4" />} accent="#3b82f6" />
        <StatCard label="Skills Covered" value={fmtNum(skillsCovered)} icon={<Layers className="h-4 w-4" />} accent="#06b6d4" />
        <StatCard label="Certificates" value={fmtNum(certCount)} icon={<Award className="h-4 w-4" />} accent="#8b5cf6" />
        <StatCard label="Total XP" value={fmtNum(currentUser.xp)} icon={<Zap className="h-4 w-4" />} accent="#facc15" />
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-10 w-10" />}
          title="No projects shipped yet"
          text="Complete a mission and get your submission approved — it lands here automatically as a portfolio project."
          action={
            <Link href="/skills" className="btn-primary">
              <Rocket className="h-4 w-4" /> Start a Mission
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((item) => {
            const skill = findSkill(state.catalog, item.skillId);
            return (
              <ProjectCard
                key={item.id}
                item={item}
                skillTitle={skill?.title ?? item.skillId}
                skillIcon={skill?.iconName ?? "Sparkles"}
                skillColor={skill?.color ?? "#3b82f6"}
                onFeature={() => setPortfolioFeatured(item.id, !item.featured)}
                onHide={() => setPortfolioHidden(item.id, !item.hidden)}
              />
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
