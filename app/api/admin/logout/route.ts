import { NextRequest, NextResponse } from "next/server";
import { revokeAdminSession } from "@/lib/db";

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get("admin_session")?.value;
  if (sessionToken) {
    revokeAdminSession(sessionToken);
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete("admin_session");
  return response;
}

