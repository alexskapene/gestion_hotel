import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request: Request) {
  try {
    await ensureUploadDir();

    const formData = await request.formData();
    const files: File[] = [];

    // collect all file fields
    for (const entry of formData.entries()) {
      const [key, value] = entry as [string, any];
      if (value && typeof value === "object" && typeof value.arrayBuffer === "function") {
        files.push(value as File);
      }
    }

    const urls: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const extMatch = file.name.match(/\.(\w+)$/);
      const ext = extMatch ? extMatch[1] : "bin";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);
      fs.writeFileSync(filepath, buffer);
      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("POST /api/uploads error:", error);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
