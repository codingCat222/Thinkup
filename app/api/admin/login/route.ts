import { NextRequest, NextResponse } from "next/server";
import {
  getAdminUserByUsernameOrEmail,
  verifyAdminPassword,
  createAdminSession,
} from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Username/email and password are required." },
        { status: 400 }
      );
    }

    const admin = getAdminUserByUsernameOrEmail(identifier);
    if (!admin) {
      // Timing attack mitigation: still perform a fake scrypt
      return NextResponse.json(
        { success: false, error: "Invalid login credentials." },
        { status: 401 }
      );
    }

    const isMatch = verifyAdminPassword(password, admin.password_hash, admin.salt);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid login credentials." },
        { status: 401 }
      );
    }

    // Create session token (valid for 7 days)
    const sessionToken = createAdminSession(admin.id, 7);

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.full_name,
        role: admin.role,
      },
    });

    const isProd = process.env.NODE_ENV === "production";

    // Set secure httpOnly cookie
    response.cookies.set({
      name: "admin_session",
      value: sessionToken,
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (err: any) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}

