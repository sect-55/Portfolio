import { NextRequest, NextResponse } from "next/server";

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

    // Max 10MB
    if (audio.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Audio file too large (max 10MB)" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;

    // Dev mode — no API key
    if (!apiKey || apiKey === "re_xxxxxxxxxxxx") {
      console.log("Voice note received (dev mode):", { name, email, audioSize: audio.size });
      return NextResponse.json({ success: true });
    }

    // Convert audio to base64
    const arrayBuffer = await audio.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = audio.type || "audio/webm";
    const ext = mimeType.includes("mp4") ? "mp4" : mimeType.includes("ogg") ? "ogg" : "webm";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Voice Note <onboarding@resend.dev>",
        to: [toEmail || "hello@example.com"],
        reply_to: email,
        subject: `🎙️ Voice note from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #fff; border-radius: 12px;">
            <h2 style="margin: 0 0 8px; font-size: 22px;">🎙️ New Voice Note</h2>
            <p style="color: #888; margin: 0 0 24px; font-size: 14px;">Someone recorded you a message</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #666; width: 80px; font-size: 13px;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #222; font-size: 13px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-size: 13px;">Email</td>
                <td style="padding: 10px 0; font-size: 13px;"><a href="mailto:${email}" style="color: #fff;">${email}</a></td>
              </tr>
            </table>
            <p style="color: #888; font-size: 13px;">🔊 Audio file attached (voice-note.${ext})</p>
          </div>
        `,
        attachments: [
          {
            filename: `voice-note.${ext}`,
            content: base64Audio,
            content_type: mimeType,
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Voice note API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
