import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getRegistrationByCode } from "@/lib/db";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest();
  if (!auth.isAuthenticated || !auth.user) {
    return NextResponse.json(
      { success: false, error: "UNAUTHORIZED", message: "Admin authentication required." },
      { status: 401 }
    );
  }

  try {
    const { registrationCode } = await request.json();

    if (!registrationCode) {
      return NextResponse.json(
        { success: false, error: "registrationCode is required" },
        { status: 400 }
      );
    }

    const registration = getRegistrationByCode(registrationCode);
    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    if (registration.paymentStatus !== "paid") {
      return NextResponse.json(
        {
          success: false,
          error: "NOT_PAID",
          message: "Confirmation emails can only be sent for registrations with verified paid status.",
        },
        { status: 400 }
      );
    }

    const sendResult = await sendConfirmationEmail(registration);

    return NextResponse.json({
      success: sendResult.success,
      status: sendResult.status,
      error: sendResult.error,
      message: sendResult.success
        ? "Confirmation email resent successfully."
        : `Email delivery issue: ${sendResult.error}`,
    });
  } catch (err: any) {
    console.error("Resend email error:", err);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: err.message },
      { status: 500 }
    );
  }
}

