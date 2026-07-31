"use client";

import { ArrowLeft, Award, Download, Linkedin, Share2, Twitter } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { getSkill } from "@/lib/data";
import { useApp } from "@/lib/store";
import { fmtDate } from "@/lib/utils";

const W = 1600;
const H = 1131;

export default function CertificatePage() {
  const params = useParams<{ certId: string }>();
  const { state } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cert = state.certificates.find((c) => c.id === params.certId);
  const user = cert ? state.users.find((u) => u.id === cert.userId) : undefined;
  const skill = cert ? getSkill(cert.skillId) : undefined;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cert || !user || !skill) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // backdrop
    ctx.fillStyle = "#050507";
    ctx.fillRect(0, 0, W, H);
    const glow1 = ctx.createRadialGradient(W * 0.15, H * 0.1, 0, W * 0.15, H * 0.1, 600);
    glow1.addColorStop(0, "rgba(6,182,212,0.22)");
    glow1.addColorStop(1, "transparent");
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, W, H);
    const glow2 = ctx.createRadialGradient(W * 0.9, H * 0.9, 0, W * 0.9, H * 0.9, 700);
    glow2.addColorStop(0, "rgba(139,92,246,0.2)");
    glow2.addColorStop(1, "transparent");
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, W, H);

    // borders
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#06b6d4");
    grad.addColorStop(0.5, "#8b5cf6");
    grad.addColorStop(1, "#eab308");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, W - 60, H - 60);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(52, 52, W - 104, H - 104);

    // header
    ctx.textAlign = "center";
    ctx.fillStyle = "#e4e4e7";
    ctx.font = "700 34px 'JetBrains Mono', monospace";
    ctx.fillText("S K I L L   E D G E   O S", W / 2, 150);
    ctx.fillStyle = "#71717a";
    ctx.font = "500 24px 'JetBrains Mono', monospace";
    ctx.fillText("CERTIFICATE OF MASTERY", W / 2, 200);

    // laurel emblem
    ctx.font = "80px serif";
    ctx.fillText("🏆", W / 2, 310);

    ctx.fillStyle = "#a1a1aa";
    ctx.font = "400 26px Inter, sans-serif";
    ctx.fillText("This certifies that", W / 2, 390);

    // name
    ctx.fillStyle = "#fafafa";
    ctx.font = "800 84px Inter, sans-serif";
    ctx.shadowColor = "rgba(6,182,212,0.55)";
    ctx.shadowBlur = 30;
    ctx.fillText(user.name, W / 2, 490);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#a1a1aa";
    ctx.font = "400 26px Inter, sans-serif";
    ctx.fillText("has demonstrated verified mastery in", W / 2, 560);

    // skill
    ctx.fillStyle = skill.color;
    ctx.font = "700 52px Inter, sans-serif";
    ctx.shadowColor = `${skill.color}90`;
    ctx.shadowBlur = 24;
    ctx.fillText(skill.title, W / 2, 632);
    ctx.shadowBlur = 0;

    // tier band
    const tierNames: Record<number, string> = { 5: "BUILDER TIER V", 8: "STRATEGIST TIER VIII", 10: "SOVEREIGN MASTER TIER X" };
    ctx.fillStyle = "#eab308";
    ctx.font = "700 34px 'JetBrains Mono', monospace";
    ctx.fillText(`⟡  ${tierNames[cert.levelTier] ?? `TIER ${cert.levelTier}`}  ⟡`, W / 2, 710);

    // date + signature line
    ctx.fillStyle = "#71717a";
    ctx.font = "400 24px Inter, sans-serif";
    ctx.fillText(`Issued on ${fmtDate(cert.issuedAt)}`, W / 2, 790);

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 180, 900);
    ctx.lineTo(W / 2 + 180, 900);
    ctx.stroke();
    ctx.fillStyle = "#d4d4d8";
    ctx.font = "italic 600 30px Georgia, serif";
    ctx.fillText("Skill Edge Academy", W / 2, 885);
    ctx.fillStyle = "#52525b";
    ctx.font = "400 20px Inter, sans-serif";
    ctx.fillText("Director of Learning", W / 2, 935);

    // verification hash
    ctx.fillStyle = "#3f3f46";
    ctx.font = "500 22px 'JetBrains Mono', monospace";
    ctx.fillText(`Verification Hash: ${cert.verificationCode}`, W / 2, 1030);
  }, [cert, user, skill]);

  useEffect(() => {
    // draw after fonts settle so the canvas uses the loaded families
    draw();
    if (typeof document !== "undefined" && "fonts" in document) {
      (document as Document & { fonts: FontFaceSet }).fonts.ready.then(draw);
    }
  }, [draw]);

  if (!cert || !user || !skill) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-20 text-center">
          <Award className="mx-auto h-12 w-12 text-zinc-600" />
          <h1 className="mt-4 font-mono text-xl font-bold text-zinc-200">Certificate not found</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Certificates are minted automatically when you clear Tier 5, 8 and 10 of any skill.
          </p>
          <Link href="/dashboard" className="btn-primary mt-6">
            Back to dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `SkillEdge-${skill.id}-tier${cert.levelTier}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const shareText = encodeURIComponent(
    `I just earned the Tier ${cert.levelTier} certificate in ${skill.title} on Skill Edge OS! 🏆 Verification: ${cert.verificationCode}`
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>

        <div className="glass overflow-hidden p-3 sm:p-5">
          <canvas ref={canvasRef} width={W} height={H} className="h-auto w-full rounded-xl" />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button onClick={download} className="btn-primary">
            <Download className="h-4 w-4" /> Download PNG
          </button>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://skill-edge-os.vercel.app")}`}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <Linkedin className="h-4 w-4 text-sky-400" /> Share to LinkedIn
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}`}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <Twitter className="h-4 w-4 text-cyan-400" /> Post on X
          </a>
        </div>

        <div className="mx-auto mt-6 max-w-md text-center">
          <div className="glass p-4">
            <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-500">
              <Share2 className="h-3.5 w-3.5" /> Cryptographic verification
            </div>
            <div className="mt-2 font-mono text-sm font-bold text-cyan-300">{cert.verificationCode}</div>
            <p className="mt-2 text-xs text-zinc-500">
              This hash is deterministically derived from the learner, skill, tier and issue timestamp — anyone can
              verify this credential&apos;s authenticity against the Skill Edge registry.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
