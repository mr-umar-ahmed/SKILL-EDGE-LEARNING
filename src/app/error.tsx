"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[70dvh] items-center justify-center p-6">
      <div className="clay-card w-full max-w-md space-y-5 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/15 text-danger">
          <TriangleAlert className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-display text-xl font-bold text-white">Something went wrong</h2>
          <p className="text-xs text-zinc-400">
            An unexpected error occurred. Your progress is saved — try again or head back to the dashboard.
          </p>
          {error.digest && <p className="text-[10px] text-zinc-600">Ref: {error.digest}</p>}
        </div>
        <div className="flex justify-center gap-3">
          <button onClick={reset} className="btn-primary px-5 py-2.5 text-sm">
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
          <Link href="/dashboard" className="btn-ghost px-5 py-2.5 text-sm">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
