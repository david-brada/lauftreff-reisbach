import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { routes as staticRoutes } from "@/lib/routes";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lauftreff2026";

function isAuthed(request: NextRequest): boolean {
  return request.cookies.get("admin-auth")?.value === ADMIN_PASSWORD;
}

// Static fallback data when Supabase table is not yet created
const FALLBACKS: Record<string, unknown> = {
  routes: staticRoutes,
  challenges: [],
};

// GET /api/admin/data?key=routes
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  try {
    const { data, error } = await supabase
      .from("lauftreff_config")
      .select("value")
      .eq("key", key)
      .single();

    if (error) throw error;

    // If Supabase returns empty array, fall back to static data
    const value = data?.value;
    if (Array.isArray(value) && value.length === 0 && FALLBACKS[key]) {
      return NextResponse.json(FALLBACKS[key]);
    }
    return NextResponse.json(value ?? FALLBACKS[key] ?? []);
  } catch {
    // Table doesn't exist or Supabase not configured — return static fallback
    return NextResponse.json(FALLBACKS[key] ?? []);
  }
}

// POST /api/admin/data  { key, value }
export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const { key, value } = await request.json();
  if (!key || value === undefined) {
    return NextResponse.json({ error: "key and value required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("lauftreff_config")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
