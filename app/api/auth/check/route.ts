import { NextResponse } from "next/server";
import { UserService } from "@/services/user.service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await UserService.getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    return NextResponse.json({ exists: true, isVerified: !!user.isVerified }, { status: 200 });
  } catch (error) {
    console.error("POST /api/auth/check error:", error);
    return NextResponse.json({ error: "Failed to check user" }, { status: 500 });
  }
}
