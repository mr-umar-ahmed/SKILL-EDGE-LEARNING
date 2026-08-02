import { Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70dvh] items-center justify-center p-6">
      <div className="clay-card w-full max-w-md space-y-5 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/15 text-brand">
          <Compass className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <div className="font-display text-4xl font-bold text-white">404</div>
          <h2 className="font-display text-lg font-bold text-white">This mission doesn&apos;t exist</h2>
          <p className="text-xs text-zinc-400">The page you&apos;re looking for was moved, deleted, or never unlocked.</p>
        </div>
        <div className="flex justify-center gap-3">
          <Link href="/dashboard" className="btn-primary px-5 py-2.5 text-sm">
            Go to Dashboard
          </Link>
          <Link href="/skills" className="btn-ghost px-5 py-2.5 text-sm">
            Browse Skills
          </Link>
        </div>
      </div>
    </div>
  );
}
