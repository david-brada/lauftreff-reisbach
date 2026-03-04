export const dynamic = "force-dynamic";

import { Trophy, TrendingUp, Activity, Mountain } from "lucide-react";
import { getClubActivities, getClubMembers, formatDistance, formatDuration, formatPace, type ClubActivity } from "@/lib/strava";

export const metadata = {
  title: "Leaderboard – Lauftreff Reisbach",
  description: "Rangliste der aktivsten Läufer im Lauftreff Reisbach",
};

interface RunnerStats {
  name: string;
  totalKm: number;
  totalRuns: number;
  totalElevation: number;
  totalTime: number;
  avgPace: string;
}

function buildLeaderboard(activities: ClubActivity[]): RunnerStats[] {
  const map = new Map<string, { km: number; runs: number; elevation: number; time: number }>();

  for (const a of activities) {
    const name = `${a.athlete.firstname} ${a.athlete.lastname}`;
    const existing = map.get(name) || { km: 0, runs: 0, elevation: 0, time: 0 };
    existing.km += a.distance / 1000;
    existing.runs += 1;
    existing.elevation += a.total_elevation_gain;
    existing.time += a.moving_time;
    map.set(name, existing);
  }

  return Array.from(map.entries())
    .map(([name, data]) => ({
      name,
      totalKm: parseFloat(data.km.toFixed(1)),
      totalRuns: data.runs,
      totalElevation: Math.round(data.elevation),
      totalTime: data.time,
      avgPace: data.km > 0 ? formatPace((data.km * 1000) / data.time) : "-",
    }))
    .sort((a, b) => b.totalKm - a.totalKm);
}

function getMedalColor(position: number) {
  switch (position) {
    case 0: return { bg: "bg-yellow-50 border-yellow-300", badge: "bg-yellow-400 text-yellow-900", icon: "🥇" };
    case 1: return { bg: "bg-stone-50 border-stone-300", badge: "bg-stone-300 text-stone-700", icon: "🥈" };
    case 2: return { bg: "bg-orange-50 border-orange-300", badge: "bg-orange-400 text-orange-900", icon: "🥉" };
    default: return { bg: "bg-bg-card border-border", badge: "bg-stone-100 text-text-muted", icon: "" };
  }
}

export default async function LeaderboardPage() {
  let activities: ClubActivity[] = [];
  try {
    activities = await getClubActivities(1, 200);
  } catch (e) {
    console.error("Strava fetch failed", e);
  }

  const runners = buildLeaderboard(activities);
  const totalGroupKm = runners.reduce((s, r) => s + r.totalKm, 0).toFixed(0);
  const totalGroupRuns = runners.reduce((s, r) => s + r.totalRuns, 0);

  if (runners.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-accent" />
            Leaderboard
          </h1>
        </div>
        <div className="bg-bg-card rounded-2xl border border-border p-12 text-center">
          <span className="text-5xl mb-4 block">🏃</span>
          <h2 className="text-xl font-bold mb-2">Noch keine Aktivitäten</h2>
          <p className="text-text-muted">Sobald Mitglieder dem Club beitreten und laufen, erscheint hier das Leaderboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="w-8 h-8 text-accent" />
          Leaderboard
        </h1>
        <p className="text-text-muted mt-1">
          Wer hat die meisten Kilometer gesammelt?
        </p>
      </div>

      {/* Leader Card (wenn nur 1 Läufer oder Top-Läufer) */}
      {runners.length >= 1 && (
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-300 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🥇</div>
            <div className="flex-1">
              <div className="text-sm text-yellow-700 font-medium mb-1">
                {runners.length === 1 ? "Aktuell einziger Läufer" : "Platz 1"}
              </div>
              <div className="text-2xl font-bold">{runners[0].name}</div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1 font-bold text-primary">
                  <TrendingUp className="w-4 h-4" /> {runners[0].totalKm} km
                </span>
                <span className="flex items-center gap-1 text-text-muted">
                  <Activity className="w-4 h-4" /> {runners[0].totalRuns} Läufe
                </span>
                <span className="flex items-center gap-1 text-text-muted">
                  <Mountain className="w-4 h-4" /> ↑ {runners[0].totalElevation} m
                </span>
                <span className="text-text-muted">
                  Ø {runners[0].avgPace}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ranking Table */}
      <div className="bg-bg-card rounded-2xl border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-3 bg-stone-50 text-xs font-medium text-text-muted border-b border-border">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-4">Läufer</div>
          <div className="col-span-2 text-right">Kilometer</div>
          <div className="col-span-2 text-right">Läufe</div>
          <div className="col-span-1 text-right">Höhe</div>
          <div className="col-span-2 text-right">Ø Pace</div>
        </div>

        {runners.map((runner, index) => {
          const medal = getMedalColor(index);
          return (
            <div
              key={runner.name}
              className={`grid grid-cols-12 gap-2 p-3 items-center border-b border-border last:border-b-0 ${medal.bg} hover:bg-stone-50/50 transition-colors`}
            >
              <div className="col-span-1 text-center">
                {medal.icon ? (
                  <span className="text-lg">{medal.icon}</span>
                ) : (
                  <span className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold ${medal.badge}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="col-span-4 flex items-center gap-2">
                <span className="text-xl">🏃</span>
                <span className="font-medium">{runner.name}</span>
              </div>
              <div className="col-span-2 text-right font-bold">{runner.totalKm} km</div>
              <div className="col-span-2 text-right text-text-muted">{runner.totalRuns}</div>
              <div className="col-span-1 text-right text-sm text-text-muted">{runner.totalElevation}m</div>
              <div className="col-span-2 text-right text-sm text-text-muted">{runner.avgPace}</div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          { label: "Mitglieder", value: `${runners.length}`, icon: "👥" },
          { label: "Gesamt Kilometer", value: `${totalGroupKm} km`, icon: "📏" },
          { label: "Gesamt Läufe", value: `${totalGroupRuns}`, icon: "🏃" },
          { label: "Gesamt Höhenmeter", value: `${runners.reduce((s, r) => s + r.totalElevation, 0)} m`, icon: "⛰️" },
        ].map((stat) => (
          <div key={stat.label} className="bg-bg-card rounded-xl border border-border p-4 text-center">
            <span className="text-2xl">{stat.icon}</span>
            <div className="font-bold text-lg mt-1">{stat.value}</div>
            <div className="text-xs text-text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {runners.length < 3 && (
        <div className="mt-8 bg-stone-50 rounded-2xl p-6 border border-border text-center">
          <span className="text-3xl mb-2 block">🤝</span>
          <h3 className="font-bold text-lg mb-1">Lade Freunde ein!</h3>
          <p className="text-text-muted text-sm">
            Je mehr mitmachen, desto spannender wird das Leaderboard.
            Teile den Strava-Club mit deinen Lauffreunden!
          </p>
        </div>
      )}

      <div className="text-center mt-6 text-sm text-text-muted">
        Daten powered by Strava 🔗
      </div>
    </div>
  );
}
