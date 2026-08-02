"use client";

import { Check, Copy, IndianRupee, ScanLine } from "lucide-react";
import { useState } from "react";
import { fmtNum } from "@/lib/utils";

interface UpiQrProps {
  seed?: string;
  size?: number;
  upiId?: string;
  amountInr?: number;
}

/**
 * UPI scanner card — shows the owner's QR image from /public (scanner.png etc.),
 * falling back to a deterministic SVG matrix. Includes the amount to pay,
 * a copyable UPI ID and the accepted-app badges.
 */
export function UpiQr({
  seed = "skilledge@upi",
  size = 210,
  upiId = "skilledge@upi",
  amountInr,
}: UpiQrProps) {
  const [imgSrcIndex, setImgSrcIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Candidate image paths in the public folder
  const candidateImages = [
    "/scanner.png",
    "/scanner.jpg",
    "/scanner.jpeg",
    "/scanner.webp",
    "/upi-qr.png",
    "/upi-qr.jpg",
  ];

  const currentImgSrc = candidateImages[imgSrcIndex];
  const isFallbackSvg = imgSrcIndex >= candidateImages.length;

  const handleImageError = () => {
    setImgSrcIndex((prev) => prev + 1);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Deterministic SVG QR matrix fallback
  const N = 21;
  const cells: boolean[] = [];
  let h = 2166136261;
  for (let i = 0; i < N * N; i++) {
    const ch = seed.charCodeAt(i % seed.length);
    h ^= ch + i;
    h = Math.imul(h, 16777619);
    cells.push(((h >>> ((i % 5) + 3)) & 1) === 1);
  }
  const cell = size / N;
  const finder = (x: number, y: number) => (
    <g key={`f${x}${y}`}>
      <rect x={x * cell} y={y * cell} width={cell * 7} height={cell * 7} fill="#000" />
      <rect x={(x + 1) * cell} y={(y + 1) * cell} width={cell * 5} height={cell * 5} fill="#fff" />
      <rect x={(x + 2) * cell} y={(y + 2) * cell} width={cell * 3} height={cell * 3} fill="#000" />
    </g>
  );
  const inFinder = (col: number, row: number) =>
    (col < 8 && row < 8) || (col > N - 9 && row < 8) || (col < 8 && row > N - 9);

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
      {/* Scanner card */}
      <div className="relative flex w-full flex-col items-center overflow-hidden rounded-card border border-line bg-gradient-to-b from-card via-surface to-base p-4 shadow-card">
        {/* Animated laser scanline */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 animate-pulse bg-gradient-to-r from-transparent via-accent to-transparent opacity-80 shadow-[0_0_15px_#06b6d4]" />

        {/* Corner frame brackets */}
        <div className="absolute left-2 top-2 h-3 w-3 rounded-tl-lg border-l-2 border-t-2 border-brand" />
        <div className="absolute right-2 top-2 h-3 w-3 rounded-tr-lg border-r-2 border-t-2 border-brand" />
        <div className="absolute bottom-2 left-2 h-3 w-3 rounded-bl-lg border-b-2 border-l-2 border-brand" />
        <div className="absolute bottom-2 right-2 h-3 w-3 rounded-br-lg border-b-2 border-r-2 border-brand" />

        <div className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          <ScanLine className="h-3.5 w-3.5 text-accent" />
          Scan to pay via UPI
        </div>

        {/* QR image / fallback */}
        <div className="relative flex min-h-[190px] w-[190px] items-center justify-center rounded-2xl border border-white/20 bg-white p-3 shadow-inner">
          {!isFallbackSvg ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={currentImgSrc}
              alt="Official UPI QR code"
              onError={handleImageError}
              className="h-full max-h-[170px] w-full rounded-xl object-contain"
            />
          ) : (
            <svg width={size - 24} height={size - 24} viewBox={`0 0 ${size} ${size}`} className="rounded-lg bg-white">
              <rect width={size} height={size} fill="#fff" rx={8} />
              {cells.map((on, i) => {
                const col = i % N;
                const row = Math.floor(i / N);
                if (!on || inFinder(col, row)) return null;
                return <rect key={i} x={col * cell} y={row * cell} width={cell * 0.92} height={cell * 0.92} fill="#000" />;
              })}
              {finder(0, 0)}
              {finder(N - 7, 0)}
              {finder(0, N - 7)}
            </svg>
          )}
        </div>

        {/* Amount to pay */}
        {typeof amountInr === "number" && amountInr > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5">
            <IndianRupee className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
            <span className="font-mono text-sm font-bold text-white">{fmtNum(amountInr)}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">to pay</span>
          </div>
        )}

        {/* Accepted payment app badges */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px]">
          <span className="chip border-success/30 bg-success/10 px-2 py-0.5 text-success">GPay</span>
          <span className="chip border-premium/30 bg-premium/10 px-2 py-0.5 text-premium">PhonePe</span>
          <span className="chip border-accent/30 bg-accent/10 px-2 py-0.5 text-accent">Paytm</span>
          <span className="chip border-brand/30 bg-brand/10 px-2 py-0.5 text-brand">BHIM</span>
        </div>
      </div>

      {/* Copyable UPI ID */}
      <div className="flex w-full items-center justify-between rounded-xl border border-line bg-base p-2.5">
        <div className="min-w-0 flex-1 pl-1">
          <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">UPI ID</div>
          <div className="truncate font-mono text-xs font-bold text-accent">{upiId}</div>
        </div>
        <button
          onClick={handleCopyUpi}
          className="btn-ghost ml-2 shrink-0 !p-2 font-mono text-xs text-zinc-300 hover:text-white"
          title="Copy UPI ID"
          type="button"
        >
          {copied ? (
            <span className="flex items-center gap-1 font-bold text-success">
              <Check className="h-3.5 w-3.5" /> Copied
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Copy className="h-3.5 w-3.5 text-brand" /> Copy
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
