import { NextRequest, NextResponse } from "next/server";

/**
 * Creates a Razorpay order. Activates when RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET are set.
 * Body: { amountInr: number, planId?: string }
 */
export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const amountInr = Number(body?.amountInr);
  if (!Number.isFinite(amountInr) || amountInr <= 0 || amountInr > 100000) {
    return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
  }

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
    },
    body: JSON.stringify({
      amount: Math.round(amountInr * 100), // paise
      currency: "INR",
      notes: { planId: String(body?.planId ?? "") },
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "gateway_error" }, { status: 502 });
  }
  const order = await res.json();
  return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId });
}
