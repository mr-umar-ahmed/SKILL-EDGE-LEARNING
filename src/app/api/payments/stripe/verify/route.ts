import { NextRequest, NextResponse } from "next/server";

/**
 * Verifies a Stripe Checkout session was paid.
 * Query: ?session_id=cs_...
 */
export async function GET(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "missing_session" }, { status: 400 });
  }

  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  if (!res.ok) {
    return NextResponse.json({ error: "gateway_error" }, { status: 502 });
  }
  const session = await res.json();
  return NextResponse.json({
    paid: session.payment_status === "paid",
    planId: session.metadata?.planId ?? null,
    amountInr: typeof session.amount_total === "number" ? session.amount_total / 100 : null,
  });
}
