import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";

export async function GET(request) {
  const dir = path.join(process.cwd(), "public", "PDFs");
  try {
    const files = await fs.readdir(dir);
    const pdfFiles = files.filter((file) => file.endsWith(".pdf"));
    // console.log(pdfFiles);
    return NextResponse.json({ data: pdfFiles }, { status: 200 });
  } catch (error) {
    // console.error("Error reading directory:", error);
    return NextResponse.json(
      { message: `Error reading files` },
      { status: 500 }
    );
  }
}
