import { NextRequest, NextResponse } from "next/server";

/**
 * Creates a Stripe Checkout session. Activates when STRIPE_SECRET_KEY is set.
 * Body: { planId, planName, amountInr, successUrl, cancelUrl }
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const amountInr = Number(body?.amountInr);
  if (!Number.isFinite(amountInr) || amountInr <= 0 || !body?.successUrl || !body?.cancelUrl) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${body.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: body.cancelUrl,
    "line_items[0][price_data][currency]": "inr",
    "line_items[0][price_data][unit_amount]": String(Math.round(amountInr * 100)),
    "line_items[0][price_data][product_data][name]": String(body?.planName ?? "SEL Plan"),
    "line_items[0][quantity]": "1",
    "metadata[planId]": String(body?.planId ?? ""),
  });

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "gateway_error" }, { status: 502 });
  }
  const session = await res.json();
  return NextResponse.json({ url: session.url, sessionId: session.id });
}
