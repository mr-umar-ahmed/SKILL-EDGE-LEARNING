"use client";

const COLORS = ["#06b6d4", "#8b5cf6", "#eab308", "#22d3ee", "#facc15"];

export async function fireConfetti() {
  const confetti = (await import("canvas-confetti")).default;
  confetti({
    particleCount: 110,
    spread: 75,
    startVelocity: 38,
    origin: { y: 0.7 },
    colors: COLORS,
    zIndex: 200,
  });
}

export async function fireBigConfetti() {
  const confetti = (await import("canvas-confetti")).default;
  const opts = { colors: COLORS, zIndex: 200 };
  confetti({ ...opts, particleCount: 90, angle: 60, spread: 60, origin: { x: 0, y: 0.8 } });
  confetti({ ...opts, particleCount: 90, angle: 120, spread: 60, origin: { x: 1, y: 0.8 } });
  setTimeout(() => confetti({ ...opts, particleCount: 140, spread: 110, origin: { y: 0.6 } }), 350);
}
