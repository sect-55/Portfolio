import { NextResponse } from "next/server";

const PDF_URL =
  "https://raw.githubusercontent.com/sect-55/sect-55/main/sudharsanBackend.pdf";

export async function GET() {
  const res = await fetch(PDF_URL);
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="sudharsanBackend.pdf"',
    },
  });
}
