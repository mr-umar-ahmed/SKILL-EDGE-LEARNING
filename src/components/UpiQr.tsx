"use client";

/**
 * Deterministic QR-style visual for the demo UPI gateway.
 * Not a scannable payment code — the admin swaps in their real UPI QR image in production.
 */
export function UpiQr({ seed = "skilledge@upi", size = 180 }: { seed?: string; size?: number }) {
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
      <rect x={x * cell} y={y * cell} width={cell * 7} height={cell * 7} fill="#0a0a0c" />
      <rect x={(x + 1) * cell} y={(y + 1) * cell} width={cell * 5} height={cell * 5} fill="#fff" />
      <rect x={(x + 2) * cell} y={(y + 2) * cell} width={cell * 3} height={cell * 3} fill="#0a0a0c" />
    </g>
  );
  const inFinder = (col: number, row: number) =>
    (col < 8 && row < 8) || (col > N - 9 && row < 8) || (col < 8 && row > N - 9);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl bg-white p-0">
      <rect width={size} height={size} fill="#fff" rx={10} />
      {cells.map((on, i) => {
        const col = i % N;
        const row = Math.floor(i / N);
        if (!on || inFinder(col, row)) return null;
        return <rect key={i} x={col * cell} y={row * cell} width={cell * 0.92} height={cell * 0.92} fill="#0a0a0c" />;
      })}
      {finder(0, 0)}
      {finder(N - 7, 0)}
      {finder(0, N - 7)}
    </svg>
  );
}
