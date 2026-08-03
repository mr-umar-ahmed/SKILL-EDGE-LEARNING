"use client";

import { useState } from "react";
import {
  Calculator,
  Check,
  Code,
  Copy,
  DollarSign,
  Flame,
  Layers,
  PiggyBank,
  Play,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn, fmtInr } from "@/lib/utils";

interface InteractiveWidgetProps {
  skillId: string;
}

export function InteractiveWidget({ skillId }: InteractiveWidgetProps) {
  /* State for .cursorrules / Prompt Sandbox */
  const [selectedFramework, setSelectedFramework] = useState("Next.js 14 (App Router)");
  const [selectedDb, setSelectedDb] = useState("Supabase (PostgreSQL)");
  const [selectedAuth, setSelectedAuth] = useState("Clerk Auth");
  const [selectedStyling, setSelectedStyling] = useState("Tailwind CSS v3");
  const [copiedRules, setCopiedRules] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [simulatedResponse, setSimulatedResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  /* State for Financial Calculator */
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [investmentYears, setInvestmentYears] = useState(20);

  /* Compute 50/30/20 Budget */
  const needs = Math.round(monthlyIncome * 0.5);
  const wants = Math.round(monthlyIncome * 0.3);
  const savings = Math.round(monthlyIncome * 0.2);

  /* Compute Compound Interest */
  const calculateCompoundInterest = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = investmentYears * 12;
    let totalValue = 0;
    for (let i = 0; i < months; i++) {
      totalValue = (totalValue + monthlyInvestment) * (1 + monthlyRate);
    }
    const totalInvested = monthlyInvestment * months;
    const compoundEarnings = totalValue - totalInvested;
    return {
      totalValue: Math.round(totalValue),
      totalInvested: Math.round(totalInvested),
      compoundEarnings: Math.round(compoundEarnings),
    };
  };

  const compoundResult = calculateCompoundInterest();

  const generatedCursorRules = `// .cursorrules - Production AI Vibe Coding Guidelines
// Stack: ${selectedFramework} | ${selectedDb} | ${selectedAuth} | ${selectedStyling}

You are an expert AI Software Engineer. Adhere to these strict rules:
1. Always write clean TypeScript code with zero implicit 'any'.
2. Use modern Next.js 14 App Router patterns (Server Actions, Server Components).
3. Use ${selectedStyling} utility tokens with dark theme background #0B0F19.
4. Database operations must use ${selectedDb} with strict Row Level Security (RLS).
5. Authentication MUST be handled via ${selectedAuth} with protected route middleware.
6. When errors occur, inspect F12 console telemetry and return exact root cause fixes.`;

  const handleCopyRules = () => {
    navigator.clipboard.writeText(generatedCursorRules);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2000);
  };

  const handleSimulatePrompt = () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setSimulatedResponse(null);

    setTimeout(() => {
      setIsGenerating(false);
      setSimulatedResponse(
        `🚀 [AI ARCHITECT SUCCESS - 200 OK]\n\n` +
          `Scaffolded component architecture for: "${promptInput}"\n\n` +
          `✨ Generated Stack Files:\n` +
          `  ├── src/app/api/route.ts (Zod validated API endpoint)\n` +
          `  ├── src/components/FeatureCard.tsx (${selectedStyling} + Lucide Icons)\n` +
          `  └── src/lib/db.ts (${selectedDb} client with RLS policy)\n\n` +
          `💡 Builder Tip: Zero syntax errors detected! Ready to deploy to Vercel 🔥`
      );
    }, 1200);
  };

  /* Render Widget Based on Skill ID */
  if (skillId === "vibe-coding" || skillId === "prompt-engineering") {
    return (
      <div className="card-glow relative mb-8 overflow-hidden rounded-2xl border border-brand/40 bg-gradient-to-b from-card via-surface to-[#0B0F19] p-5 sm:p-6 animate-fade-up">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/15 text-brand border border-brand/30 shadow-[0_0_12px_rgba(232,80,2,0.3)]">
            <Code className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              Live Prompt Sandbox & `.cursorrules` Generator
              <span className="chip border-brand/40 bg-brand/10 text-[10px] text-brand uppercase font-bold">Interactive Tool</span>
            </h3>
            <p className="text-xs text-zinc-400">Configure your project stack to generate production context rules for Cursor & Claude Code.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mb-5">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 block">Framework</label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
            >
              <option>Next.js 14 (App Router)</option>
              <option>Vite + React TS</option>
              <option>SvelteKit 2</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 block">Database & Backend</label>
            <select
              value={selectedDb}
              onChange={(e) => setSelectedDb(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
            >
              <option>Supabase (PostgreSQL)</option>
              <option>PlanetScale (MySQL)</option>
              <option>Firebase Firestore</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 block">Authentication</label>
            <select
              value={selectedAuth}
              onChange={(e) => setSelectedAuth(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
            >
              <option>Clerk Auth</option>
              <option>Supabase Auth</option>
              <option>NextAuth.js</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 block">Styling System</label>
            <select
              value={selectedStyling}
              onChange={(e) => setSelectedStyling(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
            >
              <option>Tailwind CSS v3</option>
              <option>Shadcn UI + Radix</option>
              <option>CSS Modules</option>
            </select>
          </div>
        </div>

        {/* Output Code Box */}
        <div className="relative mb-5 rounded-xl border border-line bg-[#060911] p-4 font-mono text-xs text-zinc-300">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-line">
            <span className="text-[11px] font-bold text-brand flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> .cursorrules / CLAUDE.md
            </span>
            <button
              onClick={handleCopyRules}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition"
            >
              {copiedRules ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedRules ? "Copied!" : "Copy Rules"}
            </button>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap text-[11px] text-zinc-400 leading-relaxed">{generatedCursorRules}</pre>
        </div>

        {/* Live Prompt Testing Sandbox */}
        <div className="rounded-xl border border-line bg-surface p-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-white mb-2 block flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-warning" /> Test Prompt Sandbox
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="e.g., Build a dark-mode SaaS pricing table with Stripe checkout button..."
              className="flex-1 rounded-xl border border-line bg-card px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-brand focus:outline-none"
            />
            <button
              onClick={handleSimulatePrompt}
              disabled={isGenerating || !promptInput.trim()}
              className="btn-primary px-4 py-2 text-xs shrink-0"
            >
              {isGenerating ? "Architecting..." : "Run Prompt"}
            </button>
          </div>

          {simulatedResponse && (
            <div className="mt-3 rounded-lg border border-success/30 bg-success/10 p-3 font-mono text-[11px] text-success leading-relaxed animate-scale-in whitespace-pre-wrap">
              {simulatedResponse}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (skillId === "financial-literacy") {
    return (
      <div className="card-glow relative mb-8 overflow-hidden rounded-2xl border border-success/40 bg-gradient-to-b from-card via-surface to-[#0B0F19] p-5 sm:p-6 animate-fade-up">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/15 text-success border border-success/30 shadow-[0_0_12px_rgba(34,197,94,0.3)]">
            <Calculator className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              50/30/20 Budget Slider & Compound Interest Calculator
              <span className="chip border-success/40 bg-success/10 text-[10px] text-success uppercase font-bold">Money Tools</span>
            </h3>
            <p className="text-xs text-zinc-400">Calculate your monthly wealth allocations and model 30-year index fund compounding returns.</p>
          </div>
        </div>

        {/* 50/30/20 Rule Calculator */}
        <div className="mb-6 rounded-xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <PiggyBank className="h-4 w-4 text-success" /> Monthly Net Income
            </span>
            <span className="font-display text-base font-bold text-success">{fmtInr(monthlyIncome)}</span>
          </div>

          <input
            type="range"
            min={10000}
            max={500000}
            step={5000}
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-full accent-success"
          />

          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="rounded-lg border border-line bg-card p-2.5">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Needs (50%)</div>
              <div className="font-display text-sm font-bold text-white mt-1">{fmtInr(needs)}</div>
              <div className="text-[9px] text-zinc-500">Rent, food, bills</div>
            </div>
            <div className="rounded-lg border border-line bg-card p-2.5">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Wants (30%)</div>
              <div className="font-display text-sm font-bold text-white mt-1">{fmtInr(wants)}</div>
              <div className="text-[9px] text-zinc-500">Fun, tech, dining</div>
            </div>
            <div className="rounded-lg border border-success/40 bg-success/10 p-2.5">
              <div className="text-[10px] uppercase font-bold text-success">Wealth Investment (20%)</div>
              <div className="font-display text-sm font-bold text-success mt-1">{fmtInr(savings)}</div>
              <div className="text-[9px] text-success/80">S&P 500 / Index funds</div>
            </div>
          </div>
        </div>

        {/* Compound Interest Calculator */}
        <div className="rounded-xl border border-line bg-surface p-4">
          <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-brand" /> 30-Year Wealth Compounding Engine
          </h4>

          <div className="grid gap-4 sm:grid-cols-3 mb-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Monthly SIP ({fmtInr(monthlyInvestment)})</label>
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Expected Return ({annualReturn}%)</label>
              <input
                type="range"
                min={6}
                max={20}
                step={1}
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Duration ({investmentYears} Years)</label>
              <input
                type="range"
                min={5}
                max={35}
                step={1}
                value={investmentYears}
                onChange={(e) => setInvestmentYears(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center rounded-xl border border-brand/30 bg-brand/10 p-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Total Invested</div>
              <div className="font-display text-xs font-bold text-white mt-0.5">{fmtInr(compoundResult.totalInvested)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-warning">Compound Interest</div>
              <div className="font-display text-xs font-bold text-warning mt-0.5">+{fmtInr(compoundResult.compoundEarnings)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-success">Future Wealth Value</div>
              <div className="font-display text-sm font-bold text-success mt-0.5">{fmtInr(compoundResult.totalValue)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
