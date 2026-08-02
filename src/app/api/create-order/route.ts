import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay environment variables RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are missing." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    let amountInPaise = Number(body?.amount);

    // If amount is provided in INR (e.g., 499), convert to paise (49900).
    // If amount is already in paise (> 100), keep as is.
    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      return NextResponse.json({ error: "Invalid amount provided. Minimum amount is 100 paise (₹1)." }, { status: 400 });
    }

    if (amountInPaise < 100) {
      amountInPaise = Math.round(amountInPaise * 100);
    }

    if (amountInPaise < 100) {
      return NextResponse.json({ error: "Minimum payment amount is 100 paise (₹1)." }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const receipt = body?.receipt || `receipt_${Date.now()}`;
    const currency = body?.currency || "INR";

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt,
      notes: body?.notes || {},
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    });
  } catch (err: any) {
    console.error("Razorpay order creation error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
