"use client";

import { Check, Copy, QrCode, Sparkles } from "lucide-react";
import { useState } from "react";

interface UpiQrProps {
  seed?: string;
  size?: number;
  upiId?: string;
  amountInr?: number;
}

export function UpiQr({
  seed = "skilledge@upi",
  size = 210,
  upiId = "skilledge@upi",
  amountInr,
}: UpiQrProps) {
  const [imgSrcIndex, setImgSrcIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Candidate image paths in public folder
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

  // Deterministic SVG QR Matrix Generator Fallback
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
    <div className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
      {/* High-Tech Cyber Glass Container */}
      <div className="relative group p-4 rounded-3xl neo-box border border-amber-400/40 bg-gradient-to-b from-black/80 via-black to-zinc-950 shadow-2xl overflow-hidden w-full flex flex-col items-center">
        {/* Animated Laser Scanner Line Beam */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] opacity-80 animate-pulse pointer-events-none" />

        {/* Outer Corner Frame Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400 rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400 rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400 rounded-br-lg" />

        {/* QR Code / Scanner Image Box */}
        <div className="relative rounded-2xl bg-white p-3 shadow-inner border border-white/20 flex items-center justify-center min-h-[190px] w-[190px]">
          {!isFallbackSvg ? (
            /* User Scanner Image from /public/scanner.png */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={currentImgSrc}
              alt="Official UPI QR Scanner"
              onError={handleImageError}
              className="w-full h-full object-contain rounded-xl max-h-[170px]"
            />
          ) : (
            /* High-Tech SVG Fallback Matrix */
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

        {/* Accepted Payment App Badges */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-mono text-zinc-400">
          <span className="chip border-emerald-500/30 bg-emerald-500/10 text-emerald-400 py-0.5 px-2">GPay</span>
          <span className="chip border-purple-500/30 bg-purple-500/10 text-purple-400 py-0.5 px-2">PhonePe</span>
          <span className="chip border-cyan-500/30 bg-cyan-500/10 text-cyan-400 py-0.5 px-2">Paytm</span>
          <span className="chip border-orange-500/30 bg-orange-500/10 text-orange-400 py-0.5 px-2">BHIM</span>
        </div>
      </div>

      {/* Copyable UPI ID Box */}
      <div className="w-full flex items-center justify-between rounded-xl neo-box p-2.5 border border-white/10 bg-black/40">
        <div className="min-w-0 flex-1 pl-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">UPI ID</div>
          <div className="text-xs font-mono font-bold text-amber-300 truncate">{upiId}</div>
        </div>
        <button
          onClick={handleCopyUpi}
          className="btn-ghost !p-2 text-xs font-mono text-zinc-300 hover:text-white shrink-0 ml-2"
          title="Copy UPI ID"
        >
          {copied ? (
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Check className="h-3.5 w-3.5" /> Copied!
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Copy className="h-3.5 w-3.5 text-amber-400" /> Copy
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
