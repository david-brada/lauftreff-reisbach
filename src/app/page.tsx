export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Activity,
  Trophy,
  Target,
  Map,
  BarChart3,
  Users,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { getClubActivities, getClubMembers, formatDistance, formatDuration, formatPace, type ClubActivity, type ClubMember } from "@/lib/strava";

function activityToDisplay(a: ClubActivity) {
  const distKm = (a.distance / 1000).toFixed(1);
  const pace = a.distance > 0 ? formatPace(a.distance / a.moving_time) : "-";
  const dur = formatDuration(a.moving_time);
  return {
    name: a.name,
    athleteName: `${a.athlete.firstname} ${a.athlete.lastname}`,
    distance: distKm,
    duration: dur,
    pace,
    elevation: Math.round(a.total_elevation_gain),
    type: a.sport_type || a.type,
  };
}

export default async function Home() {
  let stravaActivities: ClubActivity[] = [];
  let stravaMembers: ClubMember[] = [];
  try {
    [stravaActivities, stravaMembers] = await Promise.all([
      getClubActivities(1, 10),
      getClubMembers(),
    ]);
  } catch (e) {
    console.error("Strava fetch failed, using mock data", e);
  }

  const recentActivities = stravaActivities.slice(0, 3).map(activityToDisplay);

  const totalKm = parseFloat((stravaActivities.reduce((s, a) => s + a.distance, 0) / 1000).toFixed(1));
  const totalRuns = stravaActivities.length;
  const totalElevation = Math.round(stravaActivities.reduce((s, a) => s + a.total_elevation_gain, 0));
  const memberCount = stravaMembers.length;

  // Build top runners from real Strava data
  const runnerMap: Record<string, { km: number; runs: number }> = {};
  for (const a of stravaActivities) {
    const name = `${a.athlete.firstname} ${a.athlete.lastname}`;
    if (!runnerMap[name]) runnerMap[name] = { km: 0, runs: 0 };
    runnerMap[name].km += a.distance / 1000;
    runnerMap[name].runs += 1;
  }
  const topRunners = Object.entries(runnerMap)
    .map(([name, data]) => ({ name, totalKm: parseFloat(data.km.toFixed(1)), totalRuns: data.runs }))
    .sort((a, b) => b.totalKm - a.totalKm)
    .slice(0, 3);

  // Build challenge from real data
  const now = new Date();
  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const monthName = monthNames[now.getMonth()];
  const kmTarget = Math.max(50, Math.ceil((memberCount || 1) * 50 / 10) * 10);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysLeft = Math.max(0, Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const activeChallenge = {
    icon: "🎯",
    title: `${monthName}: ${kmTarget} km`,
    description: `Gemeinsam ${kmTarget} km schaffen!`,
    current: totalKm,
    target: kmTarget,
    unit: "km",
    daysLeft,
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-emerald-700 text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Lauftreff Reisbach
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto mb-8">
              Gemeinsam laufen, gemeinsam stärker. Entdecke unsere Aktivitäten,
              nimm an Challenges teil und werde Teil unserer Lauf-Community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/aktivitaeten"
                className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Aktivitäten ansehen
              </Link>
              <Link
                href="/challenges"
                className="px-6 py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                Challenges entdecken
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Läufer", value: String(memberCount), icon: Users, color: "text-primary" },
            { label: "Gesamt km", value: totalKm.toLocaleString("de-DE"), icon: TrendingUp, color: "text-accent" },
            { label: "Läufe", value: String(totalRuns), icon: Activity, color: "text-blue-600" },
            { label: "Höhenmeter", value: totalElevation.toLocaleString("de-DE") + " m", icon: BarChart3, color: "text-purple-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-bg-card rounded-2xl shadow-md p-4 flex items-center gap-3 border border-border"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} shrink-0`} />
              <div>
                <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Letzte Aktivitäten
              </h2>
              <Link href="/aktivitaeten" className="text-sm text-primary hover:underline flex items-center gap-1">
                Alle <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivities.length === 0 && (
                <div className="bg-bg-card rounded-xl p-6 border border-border text-center text-text-muted">
                  Noch keine Aktivitäten vorhanden. Sobald jemand läuft, erscheinen hier die Daten.
                </div>
              )}
              {recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="bg-bg-card rounded-xl p-4 border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏃</span>
                      <div>
                        <div className="font-semibold">{activity.athleteName}</div>
                        <div className="text-sm text-text-muted">{activity.name}</div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {activity.type === "Run" ? "Lauf" : activity.type}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="font-medium">{activity.distance} km</span>
                    <span className="text-text-muted">{activity.duration}</span>
                    <span className="text-text-muted">{activity.pace}</span>
                    <span className="text-text-muted">↑ {activity.elevation} m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top 3 Leaderboard */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Top 3
                </h2>
                <Link href="/leaderboard" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Alle <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
                {topRunners.length === 0 ? (
                  <div className="p-4 text-center text-sm text-text-muted">Noch keine Aktivitäten</div>
                ) : topRunners.map((runner, i) => (
                  <div
                    key={runner.name}
                    className={`flex items-center gap-3 p-3 ${
                      i < topRunners.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? "bg-yellow-100 text-yellow-700" :
                      i === 1 ? "bg-stone-100 text-stone-600" :
                      "bg-orange-100 text-orange-700"
                    }`}>
                      {i + 1}
                    </span>
                    <span className="text-lg">🏃</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{runner.name}</div>
                      <div className="text-xs text-text-muted">{runner.totalRuns} Läufe</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">{runner.totalKm} km</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Challenge */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  Challenge
                </h2>
                <Link href="/challenges" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Alle <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{activeChallenge.icon}</span>
                  <div className="font-semibold text-sm">{activeChallenge.title}</div>
                </div>
                <p className="text-xs text-text-muted mb-3">{activeChallenge.description}</p>
                <div className="relative h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all"
                    style={{ width: `${Math.min((activeChallenge.current / activeChallenge.target) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>{activeChallenge.current} {activeChallenge.unit}</span>
                  <span>Ziel: {activeChallenge.target} {activeChallenge.unit} · noch {activeChallenge.daysLeft} Tage</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              {[
                { href: "/strecken", label: "Strecken und Routen", icon: Map, color: "text-emerald-600" },
                { href: "/statistiken", label: "Gruppen-Statistiken", icon: BarChart3, color: "text-blue-600" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 p-3 bg-bg-card rounded-xl border border-border hover:shadow-md transition-shadow"
                >
                  <link.icon className={`w-5 h-5 ${link.color}`} />
                  <span className="font-medium text-sm">{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-text-muted ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
