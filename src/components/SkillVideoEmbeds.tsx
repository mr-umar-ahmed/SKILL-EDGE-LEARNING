"use client";

import { useState } from "react";
import { Film, Play, Sparkles, X, Zap } from "lucide-react";
import Image from "next/image";

interface SkillVideoEmbedsProps {
  skillTitle: string;
  skillColor: string;
  videoIds: string[];
  thumbnailUrl: string;
}

export function SkillVideoEmbeds({
  skillTitle,
  skillColor,
  videoIds,
  thumbnailUrl,
}: SkillVideoEmbedsProps) {
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  const docVideoId = videoIds[0] || "UF8uR6Z6KLc";
  const rapidVideoId = videoIds[1] || "u4ZoJKF_VuA";

  return (
    <div className="mb-8 animate-fade-up">
      <div className="flex items-center gap-2 mb-3">
        <Film className="h-4 w-4 text-brand" />
        <h3 className="font-display text-base font-bold text-white">Video Lessons & Media Breakdown</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Card 1: Netflix-style Documentary Intro - 2 Mins */}
        <div
          onClick={() =>
            setActiveVideo({
              id: docVideoId,
              title: `${skillTitle} — Netflix-Style Documentary Intro (2 Mins)`,
            })
          }
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-line bg-card transition-all hover:border-brand/60 hover:shadow-[0_0_20px_rgba(232,80,2,0.25)]"
        >
          <div className="relative h-36 w-full overflow-hidden">
            <Image
              src={thumbnailUrl}
              alt="Documentary Intro"
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-black/30" />

            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-brand">
              <Sparkles className="h-3 w-3" /> Documentary Intro
            </div>

            <div className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
              2:00
            </div>

            {/* Play Icon Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-brand/90 text-white shadow-[0_0_20px_rgba(232,80,2,0.6)] transition-transform duration-300 group-hover:scale-110">
                <Play className="h-5 w-5 ml-0.5 fill-white" />
              </div>
            </div>
          </div>

          <div className="p-3.5">
            <div className="font-display text-sm font-bold text-white group-hover:text-brand transition">
              Netflix-style Documentary Intro
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              High-production cinematic breakdown of why {skillTitle} is the ultimate superpower.
            </p>
          </div>
        </div>

        {/* Card 2: 60-Second Rapid Skill Breakdown */}
        <div
          onClick={() =>
            setActiveVideo({
              id: rapidVideoId,
              title: `${skillTitle} — 60-Second Rapid Skill Breakdown`,
            })
          }
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-line bg-card transition-all hover:border-accent/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
        >
          <div className="relative h-36 w-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
              alt="Rapid Breakdown"
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-black/30" />

            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              <Zap className="h-3 w-3" /> Rapid Breakdown
            </div>

            <div className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
              0:60
            </div>

            {/* Play Icon Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-accent/90 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-transform duration-300 group-hover:scale-110">
                <Play className="h-5 w-5 ml-0.5 fill-white" />
              </div>
            </div>
          </div>

          <div className="p-3.5">
            <div className="font-display text-sm font-bold text-white group-hover:text-accent transition">
              60-Second Rapid Skill Breakdown
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              Fireship-style rapid overview covering core concepts, tools, and real-world ROI.
            </p>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-up">
          <div className="relative w-full max-w-3xl rounded-2xl border border-line bg-card p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <Play className="h-4 w-4 text-brand" /> {activeVideo.title}
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
