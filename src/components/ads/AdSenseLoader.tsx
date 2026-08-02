"use client";

import Script from "next/script";
import { useApp } from "@/lib/store";

/**
 * Injects the Google AdSense script for FREE-plan users only.
 * Pro / Founder users never load the ad script at all.
 * Activates once NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-XXXXXXXXXXXXXXXX) is set.
 */
export function AdSenseLoader() {
  const { hydrated, isPro } = useApp();
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!client || !hydrated || isPro) return null;

  return (
    <Script
      id="adsense-loader"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
