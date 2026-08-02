"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ArrowLeft,
  Check,
  CloudOff,
  Copy,
  Hexagon,
  Home,
  Printer,
  QrCode,
  ShieldCheck,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui";
import { findSkill } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn, fmtDate } from "@/lib/utils";

/* ------------------------------ public navbar ------------------------------ */

function PublicNav() {
  return (
    <header className="print-hide sticky top-0 z-40 border-b border-line/60 bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep shadow-brand">
            <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-white sm:text-base">Skill Edge Learning</span>
        </Link>
        <Link href="/certificates" className="btn-ghost px-4 py-2 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" /> My Certificates
        </Link>
      </div>
    </header>
  );
}

const PRINT_CSS = `
@media print {
  body { background: #0b0f19 !important; }
  .print-hide { display: none !important; }
  .print-area {
    position: absolute;
    inset: 0;
    margin: 0 !important;
    padding: 24px !important;
    max-width: none !important;
  }
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
`;

/* --------------------------------- page --------------------------------- */

export default function CertificatePage() {
  const params = useParams<{ certId: string }>();
  const certId = decodeURIComponent(params.certId ?? "");
  const { state, hydrated } = useApp();
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState<"share" | "verify" | null>(null);

  const cert = state.certificates.find((c) => c.id === certId);
  const user = cert ? state.users.find((u) => u.id === cert.userId) : undefined;
  const skill = cert ? findSkill(state.catalog, cert.skillId) : undefined;
  const code = cert?.verificationCode;

  /* QR pointing at the public verify route */
  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    QRCode.toDataURL(`${window.location.origin}/verify/${code}`, {
      margin: 1,
      width: 320,
      color: { dark: "#0B0F19", light: "#FFFFFF" },
    })
      .then((url) => {
        if (!cancelled) setQr(url);
      })
      .catch(() => {
        // QR generation failed — certificate still renders without it
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  const copy = async (kind: "share" | "verify") => {
    if (!cert) return;
    const url =
      kind === "verify"
        ? `${window.location.origin}/verify/${cert.verificationCode}`
        : `${window.location.origin}/certificate/${cert.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  /* loading */
  if (!hydrated) {
    return (
      <div className="min-h-dvh">
        <PublicNav />
        <main className="mx-auto max-w-5xl space-y-5 px-4 py-10 sm:px-6">
          <Skeleton className="h-[420px] w-full rounded-[22px]" />
          <div className="flex justify-center gap-3">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-36" />
          </div>
        </main>
      </div>
    );
  }

  /* not found on this device */
  if (!cert) {
    return (
      <div className="flex min-h-dvh flex-col">
        <PublicNav />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="clay-card w-full max-w-lg space-y-5 p-8 text-center animate-scale-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-card text-zinc-400">
              <CloudOff className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-xl font-bold text-white">Certificate not available on this device yet</h1>
              <p className="text-sm leading-relaxed text-zinc-400">
                Skill Edge Learning currently stores certificates on the device where they were earned. This link works
                perfectly in the owner&apos;s browser — globally shareable certificates arrive with cloud sync, which is
                shipping soon.
              </p>
            </div>
            <Link href="/" className="btn-primary">
              <Home className="h-4 w-4" /> Back to Homepage
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const certType = cert.certType ?? (cert.levelTier >= 10 ? "Skill Completion" : "Phase Completion");
  const studentName = user?.name ?? "Skill Edge Learner";
  const skillTitle = skill?.title ?? cert.skillId;
  const skillColor = skill?.color ?? "#3b82f6";

  return (
    <div className="flex min-h-dvh flex-col">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <PublicNav />

      <main className="print-area mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        {/* certificate card — DOM rendered, print-friendly */}
        <div className="rounded-[22px] bg-gradient-to-br from-brand via-premium to-accent p-[2px] shadow-[0_24px_80px_-24px_rgba(59,130,246,0.45)] animate-scale-in">
          <div className="relative overflow-hidden rounded-[20px] bg-base px-6 py-10 sm:px-12 sm:py-14">
            {/* ambient glows */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand opacity-[0.14] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-premium opacity-[0.12] blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-[0.05] blur-3xl" />

            {/* inner hairline frame */}
            <div className="pointer-events-none absolute inset-4 rounded-[14px] border border-white/10 sm:inset-6" />

            <div className="relative text-center">
              {/* wordmark */}
              <div className="flex flex-col items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep shadow-brand">
                  <Hexagon className="h-6 w-6 text-white" strokeWidth={2.5} />
                </span>
                <div className="font-display text-sm font-bold uppercase tracking-[0.35em] text-zinc-300">
                  Skill Edge Learning
                </div>
              </div>

              <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-brand to-transparent" />

              <div className="mt-6 text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">Certificate of</div>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{certType}</h1>

              <div className="mt-8 text-sm text-zinc-400">This certifies that</div>
              <div className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">{studentName}</div>

              <div className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-zinc-400">
                has successfully completed the required real-world project work
                {certType === "Phase Completion" ? " for the foundation phase of" : " for every mission of"}
              </div>
              <div className="mt-2 font-display text-xl font-bold sm:text-2xl" style={{ color: skillColor }}>
                {skillTitle}
              </div>

              {/* meta row */}
              <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:text-left">
                <div className="order-2 sm:order-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Issued</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-300">{fmtDate(cert.issuedAt)}</div>
                  <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Verification Code</div>
                  <div className="mt-1 font-mono text-sm font-bold text-accent">{cert.verificationCode}</div>
                </div>

                <div className="order-1 text-center sm:order-2">
                  <div className="mx-auto h-px w-40 bg-white/20" />
                  <div className="mt-2 font-display text-sm font-semibold italic text-zinc-300">Skill Edge Learning</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500">Director of Learning</div>
                </div>

                <div className="order-3 flex flex-col items-center sm:items-end">
                  {qr ? (
                    <img src={qr} alt="Scan to verify this certificate" className="h-24 w-24 rounded-lg border border-white/15" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-white/15 bg-white/5">
                      <QrCode className="h-8 w-8 text-zinc-600" />
                    </div>
                  )}
                  <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Scan to verify</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="print-hide mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => window.print()} className="btn-primary">
            <Printer className="h-4 w-4" /> Download / Print
          </button>
          <button onClick={() => copy("verify")} className={cn("btn-ghost", copied === "verify" && "border-success/50 text-success")}>
            {copied === "verify" ? <Check className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            {copied === "verify" ? "Copied" : "Copy Verify Link"}
          </button>
          <button onClick={() => copy("share")} className={cn("btn-ghost", copied === "share" && "border-success/50 text-success")}>
            {copied === "share" ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {copied === "share" ? "Copied" : "Copy Share Link"}
          </button>
        </div>

        <p className="print-hide mx-auto mt-4 max-w-md text-center text-xs leading-relaxed text-zinc-500">
          Use Download / Print and choose &ldquo;Save as PDF&rdquo; for a share-ready copy. Anyone can confirm this
          credential by scanning the QR code or visiting the verification link.
        </p>

        {copied === "verify" && (
          <p className="print-hide mt-2 text-center font-mono text-[11px] text-success">
            {typeof window !== "undefined" ? `${window.location.origin}/verify/${cert.verificationCode}` : ""}
          </p>
        )}
      </main>
    </div>
  );
}
