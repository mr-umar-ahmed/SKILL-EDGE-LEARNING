import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { AppProvider } from "@/lib/store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_aHVtYW5lLXB5dGhvbi05NS5jbGVyay5hY2NvdW50cy5kZXYk";

export const metadata: Metadata = {
  title: "Skill Edge OS — Master Future Skills",
  description:
    "A gamified learning operating system: 12 trending skills, 10-tier progression, EdgeCoin economy, weekly tournaments and verifiable certificates.",
};

export const viewport: Viewport = {
  themeColor: "#1c1c1c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrains.variable} ${outfit.variable}`} id="theme-root">
      <body className="dark font-sans antialiased selection:bg-yellow-400 selection:text-black">
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <AppProvider>{children}</AppProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
