import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lauftreff2026";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin-auth", ADMIN_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ success: false, error: "Falsches Passwort" }, { status: 401 });
}
