import { NextRequest, NextResponse } from "next/server";
import {
  getRegistrationByCode,
  setRegistrationPaymentReference,
  logPaymentEvent,
} from "@/lib/db";
import { initializePaystackPayment } from "@/lib/paystack";
import { getServerConfig } from "@/lib/config";
import crypto from "node:crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationCode } = body;

    if (!registrationCode || typeof registrationCode !== "string") {
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", message: "registrationCode is required." },
        { status: 400 }
      );
    }

    const registration = getRegistrationByCode(registrationCode.trim().toUpperCase());

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Registration not found for the provided code.",
        },
        { status: 404 }
      );
    }

    // Check if already paid
    if (registration.paymentStatus === "paid") {
      return NextResponse.json(
        {
          success: false,
          error: "ALREADY_PAID",
          message: "This registration has already been verified and paid.",
          registrationCode: registration.registrationCode,
          paymentReference: registration.paymentReference,
        },
        { status: 400 }
      );
    }

    const config = getServerConfig();

    // Check if Paystack is configured or dev mock is active
    if (!config.isPaystackConfigured && !config.allowDevMockPayment) {
      logPaymentEvent(
        registration.id,
        registration.paymentReference || "N/A",
        "initialize_unavailable",
        { reason: "Paystack credentials pending configuration" }
      );

      return NextResponse.json(
        {
          success: false,
          error: "PAYSTACK_NOT_CONFIGURED",
          message:
            "Online payment gateway integration is currently pending credential activation. Your registration draft is safely saved in our database.",
          registrationCode: registration.registrationCode,
          amountNgn: config.feeNgn,
          supportContact: {
            phonePrimary: "0806 755 7709",
            phoneSecondary: "0706 520 2865",
            whatsapp: "https://wa.me/2348067557709",
          },
        },
        { status: 503 }
      );
    }

    // Call payment initialization
    const paymentResult = await initializePaystackPayment({
      email: registration.parentEmail,
      registrationCode: registration.registrationCode,
      childName: registration.childName,
      category: registration.ageCategory,
    });

    if (!paymentResult.success || !paymentResult.reference) {
      logPaymentEvent(
        registration.id,
        "FAILED",
        "initialize_failed",
        paymentResult
      );

      return NextResponse.json(
        {
          success: false,
          error: paymentResult.error || "INITIALIZATION_FAILED",
          message: paymentResult.message || "Failed to initialize payment gateway session.",
        },
        { status: 502 }
      );
    }

    // Associate payment reference with registration in database
    setRegistrationPaymentReference(
      registration.registrationCode,
      paymentResult.reference,
      config.feeKobo
    );

    logPaymentEvent(
      registration.id,
      paymentResult.reference,
      "initialize_success",
      { isMock: paymentResult.isMock, feeKobo: config.feeKobo }
    );

    return NextResponse.json({
      success: true,
      reference: paymentResult.reference,
      authorizationUrl: paymentResult.authorizationUrl,
      accessCode: paymentResult.accessCode,
      isMock: paymentResult.isMock || false,
      amountNgn: config.feeNgn,
      currency: config.currency,
      isTestMode: config.isPaystackTestMode,
    });
  } catch (error: any) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: error.message || "An unexpected error occurred while preparing checkout.",
      },
      { status: 500 }
    );
  }
}

