import { NextRequest, NextResponse } from "next/server";
import {
  getRegistrationByPaymentReference,
  markRegistrationPaid,
  logPaymentEvent,
} from "@/lib/db";
import { verifyPaystackWebhookSignature } from "@/lib/paystack";
import { sendConfirmationEmail } from "@/lib/email";
import { getServerConfig } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // 1. Authenticate webhook signature using HMAC SHA512
    const isValidSignature = verifyPaystackWebhookSignature(rawBody, signature);

    if (!isValidSignature) {
      console.warn("Paystack webhook rejected: Invalid signature header.");
      return NextResponse.json(
        { status: "error", message: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch (parseErr) {
      return NextResponse.json(
        { status: "error", message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const eventType = event.event;
    const data = event.data;

    if (!data || !data.reference) {
      return NextResponse.json(
        { status: "ignored", message: "No reference provided in event data" },
        { status: 200 }
      );
    }

    const reference = data.reference;
    const registration = getRegistrationByPaymentReference(reference);

    if (!registration) {
      logPaymentEvent(null, reference, `webhook_${eventType}_orphan`, data);
      return NextResponse.json(
        { status: "ignored", message: "Reference not mapped to any registration" },
        { status: 200 }
      );
    }

    logPaymentEvent(registration.id, reference, `webhook_${eventType}`, data);

    // 2. Handle successful charge
    if (eventType === "charge.success") {
      const config = getServerConfig();

      // Check amount and currency match server configuration
      if (Number(data.amount) !== config.feeKobo || data.currency !== config.currency) {
        console.error(
          `Webhook charge.success amount/currency mismatch for ${reference}. Expected ${config.feeKobo} ${config.currency}, got ${data.amount} ${data.currency}`
        );
        return NextResponse.json(
          { status: "rejected", message: "Amount or currency mismatch" },
          { status: 400 }
        );
      }

      // Idempotency check: if already marked paid, return 200 immediately
      if (registration.paymentStatus === "paid") {
        return NextResponse.json(
          { status: "success", message: "Already processed" },
          { status: 200 }
        );
      }

      const updated = markRegistrationPaid({
        paymentReference: reference,
        channel: data.channel,
        transactionId: String(data.id),
      });

      if (updated && updated.emailStatus !== "sent") {
        try {
          await sendConfirmationEmail(updated);
        } catch (emailErr) {
          console.error("Webhook post-payment email delivery failed:", emailErr);
        }
      }

      return NextResponse.json({ status: "success" }, { status: 200 });
    }

    return NextResponse.json({ status: "acknowledged" }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

