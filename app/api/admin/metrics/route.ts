import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAdminMetrics } from "@/lib/db";
import { getServerConfig } from "@/lib/config";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest();
  if (!auth.isAuthenticated || !auth.user) {
    return NextResponse.json(
      { success: false, error: "UNAUTHORIZED", message: "Admin authentication required." },
      { status: 401 }
    );
  }

  try {
    const metrics = getAdminMetrics();
    const config = getServerConfig();

    return NextResponse.json({
      success: true,
      metrics,
      config: {
        feeNgn: config.feeNgn,
        currency: config.currency,
        isPaystackConfigured: config.isPaystackConfigured,
        isPaystackTestMode: config.isPaystackTestMode,
        allowDevMockPayment: config.allowDevMockPayment,
        emailConfigured: config.emailConfig.isConfigured,
        emailProvider: config.emailConfig.provider,
      },
      user: auth.user,
    });
  } catch (err: any) {
    console.error("Admin metrics error:", err);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: err.message },
      { status: 500 }
    );
  }
}

