import { NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validations";
import { saveRegistration, getRegistrationStats } from "@/lib/db";
import { getServerConfig } from "@/lib/config";
import path from "node:path";
import fs from "node:fs/promises";

export async function GET() {
  try {
    const stats = getRegistrationStats();
    const config = getServerConfig();
    return NextResponse.json({
      success: true,
      stats,
      feeNgn: config.feeNgn,
      currency: config.currency,
      isPaystackConfigured: config.isPaystackConfigured,
      isPaystackTestMode: config.isPaystackTestMode,
      allowDevMockPayment: config.allowDevMockPayment,
    });
  } catch (error: any) {
    console.error("Error retrieving stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve registration statistics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data: any = {};
    let uploadedFileName: string | undefined = undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      data = {
        parentName: formData.get("parentName"),
        parentPhone: formData.get("parentPhone"),
        parentEmail: formData.get("parentEmail"),
        childName: formData.get("childName"),
        dateOfBirth: formData.get("dateOfBirth"),
        age: formData.get("age"),
        schoolName: formData.get("schoolName"),
        ageCategory: formData.get("ageCategory"),
        projectDescription: formData.get("projectDescription"),
        consentGiven: formData.get("consentGiven") === "true" || formData.get("consentGiven") === "on",
        privacyAgreed: formData.get("privacyAgreed") === "true" || formData.get("privacyAgreed") === "on",
      };

      const file = formData.get("projectFile") as File | null;
      if (file && file.size > 0 && file.name) {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadsDir, { recursive: true });

        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = path.join(uploadsDir, safeName);
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, buffer);
        uploadedFileName = `/uploads/${safeName}`;
      }
    } else {
      data = await request.json();
    }

    // Validate with Zod
    const validationResult = registrationSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please verify your inputs.",
          fieldErrors: errors,
        },
        { status: 400 }
      );
    }

    const validated = validationResult.data;
    const config = getServerConfig();

    // Save pending registration in SQLite
    const saved = saveRegistration({
      parentName: validated.parentName,
      parentPhone: validated.parentPhone,
      parentEmail: validated.parentEmail,
      childName: validated.childName,
      dateOfBirth: validated.dateOfBirth,
      age: validated.age,
      schoolName: validated.schoolName,
      ageCategory: validated.ageCategory,
      projectDescription: validated.projectDescription,
      projectFileName: uploadedFileName,
      consentGiven: validated.consentGiven,
      privacyAgreed: validated.privacyAgreed,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration recorded successfully. Ready for checkout.",
        registrationCode: saved.registrationCode,
        paymentStatus: "pending",
        amountNgn: config.feeNgn,
        feeKobo: config.feeKobo,
        currency: config.currency,
        isPaystackConfigured: config.isPaystackConfigured,
        isPaystackTestMode: config.isPaystackTestMode,
        allowDevMockPayment: config.allowDevMockPayment,
        data: {
          childName: validated.childName,
          ageCategory: validated.ageCategory,
          parentEmail: validated.parentEmail,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during registration. Please try again.",
      },
      { status: 500 }
    );
  }
}
