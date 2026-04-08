import { NextRequest, NextResponse } from "next/server";
import type { ContactFormData, ApiResponse } from "@/types";

// Simple validation
function validate(data: ContactFormData): string | null {
  if (!data.name?.trim()) return "Name is required.";
  if (!data.email?.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return "Please enter a valid email address.";
  if (!data.subject?.trim()) return "Subject is required.";
  if (!data.message?.trim()) return "Message is required.";
  if (data.message.length < 10)
    return "Message must be at least 10 characters.";
  return null;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const body: ContactFormData = await request.json();

    const validationError = validate(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();
    const smtpLooksConfigured =
      Boolean(smtpHost && smtpUser && smtpPass) &&
      !smtpUser?.includes("your-email") &&
      !smtpPass?.includes("your-app-password") &&
      !smtpPass?.includes("your-zoho-app-password");

    if (!smtpLooksConfigured) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email delivery is not configured. Set valid SMTP credentials in .env.local (SMTP_HOST, SMTP_USER, SMTP_PASS).",
        },
        { status: 500 }
      );
    }

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"${body.name}" <${smtpUser}>`,
      replyTo: body.email,
      to: "sudharsan24@zohomail.in",
      subject: `[Portfolio Contact] ${body.subject}`,
      text: `Name: ${body.name}\nEmail: ${body.email}\n\n${body.message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #c9a96e;">New Contact from Portfolio</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Name</td><td style="padding: 8px 0;">${body.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${body.email}">${body.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Subject</td><td style="padding: 8px 0;">${body.subject}</td></tr>
          </table>
          <hr style="border: 1px solid #1e1e1e; margin: 16px 0;" />
          <p style="white-space: pre-wrap; color: #c8c4bc;">${body.message}</p>
        </div>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received. I'll get back to you soon!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Return method not allowed for other verbs
export async function GET(): Promise<NextResponse<ApiResponse>> {
  return NextResponse.json(
    { success: false, message: "Method not allowed." },
    { status: 405 }
  );
}
