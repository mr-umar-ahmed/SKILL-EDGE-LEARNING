import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { AdSenseLoader } from "@/components/ads/AdSenseLoader";
import { AppProvider } from "@/lib/store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_aHVtYW5lLXB5dGhvbi05NS5jbGVyay5hY2NvdW50cy5kZXYk";

export const metadata: Metadata = {
  title: {
    default: "Skill Edge Learning — The Skill Operating System",
    template: "%s · Skill Edge Learning",
  },
  description:
    "Don't just watch — build. Master real-world skills through practical missions, project reviews, portfolios and verifiable certificates.",
  keywords: ["skill learning", "project based learning", "portfolio", "missions", "skill os"],
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#3B82F6",
    colorBackground: "#111827",
    colorInputBackground: "#0B0F19",
    colorInputText: "#FFFFFF",
    colorText: "#FFFFFF",
    colorTextSecondary: "#9CA3AF",
    borderRadius: "0.75rem",
  },
  elements: {
    card: { backgroundColor: "#1A2235", border: "1px solid #2D3748" },
    socialButtonsBlockButton: { border: "1px solid #2D3748", color: "#FFFFFF" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrains.variable} ${outfit.variable}`} id="theme-root">
      <body className="dark font-sans antialiased selection:bg-brand/30 selection:text-white">
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} signInUrl="/login" signUpUrl="/register" appearance={clerkAppearance}>
          <AppProvider>
            {children}
            <AdSenseLoader />
          </AppProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
