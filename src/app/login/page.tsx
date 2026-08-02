"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-[85vh] w-full flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-6">
        <Link href="/" className="inline-flex h-14 w-14 items-center justify-center rounded-3xl btn-primary font-mono text-2xl font-black shadow-xl shadow-amber-500/20">
          S
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          Skill Edge <span className="text-amber-400">OS</span>
        </h1>
        <p className="text-xs text-zinc-400">Sign in to your account powered by Clerk</p>
      </div>

      {/* Official Clerk SignIn Component */}
      <div className="flex justify-center w-full">
        <SignIn
          routing="hash"
          signUpUrl="/register"
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              card: "neo-box bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6",
              headerTitle: "text-white font-bold text-xl",
              headerSubtitle: "text-zinc-400 text-xs",
              socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl",
              formButtonPrimary: "btn-primary font-bold text-sm py-2.5 rounded-xl shadow-lg",
              formFieldLabel: "text-zinc-300 text-xs font-semibold",
              formFieldInput: "input-dark bg-white/5 border-white/10 text-white rounded-xl",
              footerActionLink: "text-amber-400 font-bold hover:underline",
            },
          }}
        />
      </div>
    </div>
  );
}
