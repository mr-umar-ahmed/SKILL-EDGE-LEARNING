import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

/**
 * Verifies a Razorpay checkout signature.
 * Body: { orderId, paymentId, signature }
 */
export async function POST(req: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const { orderId, paymentId, signature } = body ?? {};
  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  const valid =
    expected.length === String(signature).length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(signature)));

  return NextResponse.json({ valid });
}
