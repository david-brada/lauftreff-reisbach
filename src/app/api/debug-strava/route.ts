import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasClientId = !!process.env.STRAVA_CLIENT_ID;
  const hasClientSecret = !!process.env.STRAVA_CLIENT_SECRET;
  const hasRefreshToken = !!process.env.STRAVA_REFRESH_TOKEN;
  const hasClubId = !!process.env.STRAVA_CLUB_ID;
  const clubId = process.env.STRAVA_CLUB_ID || "NOT SET";

  let tokenStatus = "not attempted";
  let tokenError = "";
  let activitiesStatus = "not attempted";
  let activitiesCount = 0;
  let activitiesError = "";
  let membersStatus = "not attempted";
  let membersCount = 0;

  if (hasClientId && hasClientSecret && hasRefreshToken) {
    try {
      const tokenRes = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: process.env.STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          refresh_token: process.env.STRAVA_REFRESH_TOKEN,
          grant_type: "refresh_token",
        }),
      });
      tokenStatus = `${tokenRes.status}`;
      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        const token = tokenData.access_token;

        // Test activities
        const actRes = await fetch(
          `https://www.strava.com/api/v3/clubs/${clubId}/activities?page=1&per_page=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        activitiesStatus = `${actRes.status}`;
        if (actRes.ok) {
          const acts = await actRes.json();
          activitiesCount = Array.isArray(acts) ? acts.length : -1;
        } else {
          activitiesError = await actRes.text();
        }

        // Test members
        const memRes = await fetch(
          `https://www.strava.com/api/v3/clubs/${clubId}/members?per_page=100`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        membersStatus = `${memRes.status}`;
        if (memRes.ok) {
          const mems = await memRes.json();
          membersCount = Array.isArray(mems) ? mems.length : -1;
        }
      } else {
        tokenError = await tokenRes.text();
      }
    } catch (e: unknown) {
      tokenError = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json({
    env: { hasClientId, hasClientSecret, hasRefreshToken, hasClubId, clubId },
    token: { status: tokenStatus, error: tokenError },
    activities: { status: activitiesStatus, count: activitiesCount, error: activitiesError },
    members: { status: membersStatus, count: membersCount },
  });
}
