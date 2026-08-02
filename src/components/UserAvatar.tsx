"use client";

/* eslint-disable @next/next/no-img-element */
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Photo avatar with initials fallback — no emoji. */
export function UserAvatar({
  user,
  size = 36,
  className,
}: {
  user: Pick<User, "name" | "avatarUrl"> | null | undefined;
  size?: number;
  className?: string;
}) {
  const initials = (user?.name ?? "?")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full border border-line object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-line bg-gradient-to-br from-brand to-premium font-semibold text-white",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
