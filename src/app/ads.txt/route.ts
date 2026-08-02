import { NextResponse } from "next/server";

/**
 * Serves /ads.txt for Google AdSense site verification.
 * Requires NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-XXXXXXXXXXXXXXXX).
 */
export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) {
    return new NextResponse("Not configured", { status: 404 });
  }
  const pub = client.replace(/^ca-/, ""); // ads.txt uses pub-XXXX form
  return new NextResponse(`google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain" },
  });
}
