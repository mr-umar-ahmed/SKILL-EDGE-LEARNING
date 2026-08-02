import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: "RAZORPAY_KEY_SECRET environment variable missing" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const razorpay_order_id = body?.razorpay_order_id || body?.order_id;
    const razorpay_payment_id = body?.razorpay_payment_id || body?.payment_id;
    const razorpay_signature = body?.razorpay_signature || body?.signature;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required payment verification fields" },
        { status: 400 }
      );
    }

    // Generate signature HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const generated_signature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.warn("Razorpay payment signature mismatch!", { generated_signature, razorpay_signature });
      return NextResponse.json(
        { success: false, error: "Payment verification failed: signature mismatch" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (err: any) {
    console.error("Razorpay verification error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error during verification" },
      { status: 500 }
    );
  }
}
