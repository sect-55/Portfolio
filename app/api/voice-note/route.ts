import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File | null;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!audio || !email || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (audio.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Audio file too large (max 10MB)" }, { status: 400 });
    }

    const mimeType = audio.type || "audio/webm";
    const ext = mimeType.includes("mp4") ? "mp4" : mimeType.includes("ogg") ? "ogg" : "webm";
    const arrayBuffer = await audio.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `🎙️ Voice note from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
          <h2 style="margin: 0 0 8px; font-size: 22px;">🎙️ New Voice Note</h2>
          <p style="color: #888; margin: 0 0 24px; font-size: 14px;">Someone recorded you a message</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; width: 80px; font-size: 13px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 13px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Email</td>
              <td style="padding: 10px 0; font-size: 13px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
          </table>
          <p style="color: #888; font-size: 13px;">🔊 Audio file attached (voice-note.${ext})</p>
        </div>
      `,
      attachments: [
        {
          filename: `voice-note.${ext}`,
          content: audioBuffer,
          contentType: mimeType,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Voice note API error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
