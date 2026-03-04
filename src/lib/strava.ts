/**
 * Strava API Integration für Lauftreff Reisbach
 * 
 * Setup-Anleitung:
 * 1. Erstelle eine Strava API App: https://www.strava.com/settings/api
 * 2. Trage die Credentials als Umgebungsvariablen ein
 * 3. Erstelle einen Strava Club für den Lauftreff
 * 
 * Umgebungsvariablen:
 * - STRAVA_CLIENT_ID
 * - STRAVA_CLIENT_SECRET
 * - STRAVA_REFRESH_TOKEN (vom Club-Admin)
 * - STRAVA_CLUB_ID
 */

const STRAVA_API_BASE = "https://www.strava.com/api/v3";

// --- Token Management ---

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && cachedToken.expiresAt > Date.now() / 1000 + 60) {
    return cachedToken.token;
  }

  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`Strava token refresh failed: ${response.status}`);
  }

  const data: TokenResponse = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: data.expires_at,
  };

  return data.access_token;
}

// --- Types ---

export interface StravaAthlete {
  id: number;
  firstname: string;
  lastname: string;
  profile: string;
  profile_medium: string;
  city: string;
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // in meters
  moving_time: number; // in seconds
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  map: {
    id: string;
    summary_polyline: string;
    polyline?: string;
  };
  athlete: {
    id: number;
    firstname?: string;
    lastname?: string;
  };
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  kudos_count: number;
  achievement_count: number;
}

// Club Activities API gibt weniger Felder zurück
export interface ClubActivity {
  resource_state: number;
  athlete: {
    resource_state: number;
    firstname: string;
    lastname: string;
  };
  name: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  workout_type: number | null;
  device_name?: string;
}

export interface ClubMember {
  firstname: string;
  lastname: string;
  profile: string;
  profile_medium: string;
  membership: string;
  admin: boolean;
  owner: boolean;
}

// --- API Calls ---

export async function getClubActivities(
  page = 1,
  perPage = 30
): Promise<ClubActivity[]> {
  const token = await getAccessToken();
  const clubId = process.env.STRAVA_CLUB_ID;

  const response = await fetch(
    `${STRAVA_API_BASE}/clubs/${clubId}/activities?page=${page}&per_page=${perPage}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 }, // Cache 5 min
    }
  );

  if (!response.ok) {
    console.error(`Strava API error: ${response.status}`);
    return [];
  }

  return response.json();
}

export async function getClubMembers(): Promise<ClubMember[]> {
  const token = await getAccessToken();
  const clubId = process.env.STRAVA_CLUB_ID;

  const response = await fetch(
    `${STRAVA_API_BASE}/clubs/${clubId}/members?per_page=100`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 }, // Cache 1 hour
    }
  );

  if (!response.ok) {
    console.error(`Strava API error: ${response.status}`);
    return [];
  }

  return response.json();
}

export async function getClubInfo(): Promise<Record<string, unknown> | null> {
  const token = await getAccessToken();
  const clubId = process.env.STRAVA_CLUB_ID;

  const response = await fetch(`${STRAVA_API_BASE}/clubs/${clubId}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;
  return response.json();
}

// --- Helpers ---

export function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(1) + " km";
}

export function formatPace(speedMs: number): string {
  if (!speedMs || speedMs === 0) return "-";
  const paceSeconds = 1000 / speedMs;
  const minutes = Math.floor(paceSeconds / 60);
  const seconds = Math.floor(paceSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")} /km`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}min`;
  return `${m}:${s.toString().padStart(2, "0")} min`;
}

export function formatElevation(meters: number): string {
  return `${Math.round(meters)} m`;
}
