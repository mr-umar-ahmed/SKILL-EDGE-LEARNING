import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#000000",
        surface: "#111114",
        card: "#18181C",
        hover: "#222228",
        line: "#333333",
        brand: {
          DEFAULT: "#E85002",
          deep: "#C10801",
          bright: "#F16001",
          sand: "#D9C3AB",
        },
        accent: "#F16001",
        premium: "#8B5CF6",
        success: "#22C55E",
        warning: "#FACC15",
        danger: "#EF4444",
        // legacy aliases still referenced by v1 pages — mapped onto the v2 palette
        edge: {
          cyan: "#F16001",
          violet: "#8B5CF6",
          gold: "#FACC15",
          orange: "#E85002",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "1.125rem", // 18px — the standard card radius
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -8px rgba(0,0,0,0.5)",
        "card-hover": "0 2px 4px rgba(0,0,0,0.4), 0 16px 40px -12px rgba(59,130,246,0.25)",
        brand: "0 8px 24px -6px rgba(59,130,246,0.45)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 12px 0 rgba(59,130,246,0.35)" },
          "50%": { boxShadow: "0 0 28px 6px rgba(59,130,246,0.55)" },
        },
        "coin-pop": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.35) rotate(-8deg)" },
          "100%": { transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "coin-pop": "coin-pop 0.5s ease-out",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "fade-up": "fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
