import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lauftreff2026";

export function isAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get("admin-auth");
  return cookie?.value === ADMIN_PASSWORD;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
}
