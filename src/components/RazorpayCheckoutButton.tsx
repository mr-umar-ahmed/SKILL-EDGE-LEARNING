"use client";

import React, { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { fireBigConfetti } from "@/components/confetti";
import type { PlanId } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface Props {
  amountInr: number;
  planId?: PlanId;
  buttonText?: string;
  className?: string;
  onSuccess?: (paymentInfo: RazorpayResponse) => void;
  onFailure?: (error: string) => void;
}

export function RazorpayCheckoutButton({
  amountInr,
  planId = "PRO_MONTHLY",
  buttonText = "Pay with Razorpay",
  className,
  onSuccess,
  onFailure,
}: Props) {
  const { currentUser, activatePlan } = useApp();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCheckout = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Create order on backend
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInr,
          currency: "INR",
          receipt: `rcpt_${planId}_${Date.now()}`,
          notes: { planId, userId: currentUser?.id || "" },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg = errData?.error || "Failed to create payment order. Please try again.";
        setErrorMsg(msg);
        onFailure?.(msg);
        setLoading(false);
        return;
      }

      const orderData = (await res.json()) as {
        order_id: string;
        amount: number;
        currency: string;
        key_id: string;
      };

      // 2. Load Razorpay script
      const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!scriptLoaded || !(window as any).Razorpay) {
        const msg = "Razorpay SDK failed to load. Please check your internet connection.";
        setErrorMsg(msg);
        onFailure?.(msg);
        setLoading(false);
        return;
      }

      // 3. Open Razorpay modal
      const options: any = {
        key: orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Skill Edge Learning",
        description: `Subscription Payment (${planId})`,
        order_id: orderData.order_id,
        prefill: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
        },
        theme: {
          color: "#E85002",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response: RazorpayResponse) => {
          try {
            // 4. Verify payment on backend
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json().catch(() => ({}));

            if (verifyRes.ok && verifyData.success) {
              // Activate plan in state
              activatePlan(planId, "RAZORPAY", amountInr, {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
              });
              fireBigConfetti();
              onSuccess?.(response);
            } else {
              const msg = verifyData?.error || "Payment verification failed. Please contact support.";
              setErrorMsg(msg);
              onFailure?.(msg);
            }
          } catch (err: any) {
            const msg = err?.message || "Payment verification error";
            setErrorMsg(msg);
            onFailure?.(msg);
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err: any) {
      console.error("Razorpay checkout error:", err);
      const msg = err?.message || "An unexpected error occurred.";
      setErrorMsg(msg);
      onFailure?.(msg);
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={cn(
          "btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2",
          className
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Processing Order...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" /> {buttonText}
          </>
        )}
      </button>
      {errorMsg && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 p-2.5 text-xs text-danger font-semibold text-center">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
