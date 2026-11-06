import { NextRequest, NextResponse } from "next/server";
import {
  getRegistrationByPaymentReference,
  markRegistrationPaid,
  markRegistrationPaymentFailed,
  logPaymentEvent,
} from "@/lib/db";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference || typeof reference !== "string") {
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", message: "reference is required." },
        { status: 400 }
      );
    }

    return await handleVerification(reference.trim());
  } catch (error: any) {
    console.error("Payment verify error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { success: false, error: "VALIDATION_ERROR", message: "reference parameter is required." },
      { status: 400 }
    );
  }

  return await handleVerification(reference.trim());
}

async function handleVerification(reference: string) {
  const registration = getRegistrationByPaymentReference(reference);

  if (!registration) {
    return NextResponse.json(
      {
        success: false,
        error: "NOT_FOUND",
        message: "No registration matching this payment reference was found in the database.",
      },
      { status: 404 }
    );
  }

  // Idempotency check: if already verified as paid
  if (registration.paymentStatus === "paid") {
    return NextResponse.json({
      success: true,
      verified: true,
      alreadyProcessed: true,
      registration: {
        registrationCode: registration.registrationCode,
        childName: registration.childName,
        ageCategory: registration.ageCategory,
        parentEmail: registration.parentEmail,
        paymentStatus: registration.paymentStatus,
        paymentReference: registration.paymentReference,
        paidAt: registration.paidAt,
        amountKobo: registration.amountKobo,
        currency: registration.currency,
        emailStatus: registration.emailStatus,
      },
    });
  }

  // Verify transaction with Paystack server
  const verifyResult = await verifyPaystackTransaction(reference);

  if (!verifyResult.success) {
    markRegistrationPaymentFailed(reference, verifyResult.error);
    logPaymentEvent(
      registration.id,
      reference,
      "verify_failed",
      verifyResult
    );

    return NextResponse.json(
      {
        success: false,
        verified: false,
        error: "PAYMENT_NOT_VERIFIED",
        message:
          verifyResult.error || "Payment verification could not be confirmed with the payment processor.",
      },
      { status: 400 }
    );
  }

  // Update registration record in database to paid
  const updated = markRegistrationPaid({
    paymentReference: reference,
    channel: verifyResult.channel,
    transactionId: verifyResult.transactionId,
  });

  logPaymentEvent(
    registration.id,
    reference,
    "verify_success",
    verifyResult
  );

  // Send confirmation email asynchronously (separately tracked)
  if (updated) {
    try {
      await sendConfirmationEmail(updated);
    } catch (emailErr) {
      console.error("Post-verification email error:", emailErr);
    }
  }

  const freshRecord = getRegistrationByPaymentReference(reference) || updated;

  return NextResponse.json({
    success: true,
    verified: true,
    isMock: verifyResult.isMock || false,
    registration: freshRecord
      ? {
          registrationCode: freshRecord.registrationCode,
          childName: freshRecord.childName,
          ageCategory: freshRecord.ageCategory,
          parentEmail: freshRecord.parentEmail,
          paymentStatus: freshRecord.paymentStatus,
          paymentReference: freshRecord.paymentReference,
          paidAt: freshRecord.paidAt,
          amountKobo: freshRecord.amountKobo,
          currency: freshRecord.currency,
          emailStatus: freshRecord.emailStatus,
        }
      : null,
  });
}

