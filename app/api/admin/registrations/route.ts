import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAdminRegistrations } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest();
  if (!auth.isAuthenticated || !auth.user) {
    return NextResponse.json(
      { success: false, error: "UNAUTHORIZED", message: "Admin authentication required." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const paymentStatus = searchParams.get("paymentStatus") || undefined;
    const category = searchParams.get("category") || undefined;
    const emailStatus = searchParams.get("emailStatus") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);

    const result = getAdminRegistrations({
      search,
      paymentStatus,
      category,
      emailStatus,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.registrations,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit,
      },
    });
  } catch (err: any) {
    console.error("Admin registrations error:", err);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: err.message },
      { status: 500 }
    );
  }
}

