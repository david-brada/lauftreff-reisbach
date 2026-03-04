export const dynamic = "force-dynamic";

import { BarChart3, TrendingUp, Users, MapPin, Clock, Activity } from "lucide-react";
import { getClubActivities, getClubMembers, formatDuration, formatPace, type ClubActivity } from "@/lib/strava";

export const metadata = {
  title: "Statistiken – Lauftreff Reisbach",
  description: "Gruppen-Statistiken und Auswertungen des Lauftreff Reisbach",
};

function SimpleBarChart({ data, maxValue, color }: { data: { label: string; value: number }[]; maxValue: number; color: string }) {
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((item) => (
        <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-text-muted">{item.value > 0 ? item.value : ""}</span>
          <div className="w-full bg-stone-100 rounded-t-md relative" style={{ height: "100%" }}>
            <div
              className={`absolute bottom-0 w-full rounded-t-md transition-all ${color}`}
              style={{ height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

interface MemberStats {
  name: string;
  totalKm: number;
  totalRuns: number;
  totalElevation: number;
  totalTime: number;
  avgPace: string;
  avgDistance: number;
}

function computeStats(activities: ClubActivity[]) {
  const totalKm = activities.reduce((s, a) => s + a.distance, 0) / 1000;
  const totalRuns = activities.length;
  const totalElevation = activities.reduce((s, a) => s + a.total_elevation_gain, 0);
  const totalTime = activities.reduce((s, a) => s + a.moving_time, 0);
  const avgDistance = totalRuns > 0 ? totalKm / totalRuns : 0;
  const avgPace = totalKm > 0 ? formatPace((totalKm * 1000) / totalTime) : "-";
  const longestRun = activities.length > 0 ? Math.max(...activities.map(a => a.distance)) / 1000 : 0;
  const fastestPace = activities.length > 0
    ? formatPace(Math.max(...activities.filter(a => a.moving_time > 0 && a.distance > 500).map(a => a.distance / a.moving_time)))
    : "-";

  // Per-member stats
  const memberMap = new Map<string, { km: number; runs: number; elevation: number; time: number }>();
  for (const a of activities) {
    const name = `${a.athlete.firstname} ${a.athlete.lastname}`;
    const ex = memberMap.get(name) || { km: 0, runs: 0, elevation: 0, time: 0 };
    ex.km += a.distance / 1000;
    ex.runs += 1;
    ex.elevation += a.total_elevation_gain;
    ex.time += a.moving_time;
    memberMap.set(name, ex);
  }

  const members: MemberStats[] = Array.from(memberMap.entries())
    .map(([name, d]) => ({
      name,
      totalKm: parseFloat(d.km.toFixed(1)),
      totalRuns: d.runs,
      totalElevation: Math.round(d.elevation),
      totalTime: d.time,
      avgPace: d.km > 0 ? formatPace((d.km * 1000) / d.time) : "-",
      avgDistance: parseFloat((d.km / d.runs).toFixed(1)),
    }))
    .sort((a, b) => b.totalKm - a.totalKm);

  return {
    totalKm: parseFloat(totalKm.toFixed(1)),
    totalRuns,
    totalElevation: Math.round(totalElevation),
    totalTime,
    totalDuration: formatDuration(totalTime),
    avgDistance: parseFloat(avgDistance.toFixed(1)),
    avgPace,
    longestRun: parseFloat(longestRun.toFixed(1)),
    fastestPace,
    members,
  };
}

export default async function StatistikenPage() {
  let activities: ClubActivity[] = [];
  let memberCount = 0;
  try {
    const [acts, members] = await Promise.all([
      getClubActivities(1, 200),
      getClubMembers(),
    ]);
    activities = acts;
    memberCount = members.length;
  } catch (e) {
    console.error("Strava fetch failed", e);
  }

  const stats = computeStats(activities);
  if (memberCount === 0) memberCount = stats.members.length;

  if (activities.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Gruppen-Statistiken
          </h1>
        </div>
        <div className="bg-bg-card rounded-2xl border border-border p-12 text-center">
          <span className="text-5xl mb-4 block">📊</span>
          <h2 className="text-xl font-bold mb-2">Noch keine Daten</h2>
          <p className="text-text-muted">Sobald Club-Aktivitäten vorhanden sind, erscheinen hier die Statistiken.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          Gruppen-Statistiken
        </h1>
        <p className="text-text-muted mt-1">
          Zahlen, Daten, Fakten – so läuft unser Lauftreff
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Gesamt Kilometer", value: stats.totalKm.toLocaleString("de-DE") + " km", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          { label: "Gesamt Läufe", value: stats.totalRuns.toString(), icon: Activity, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Höhenmeter", value: stats.totalElevation.toLocaleString("de-DE") + " m", icon: MapPin, color: "text-accent", bg: "bg-orange-100" },
          { label: "Laufzeit", value: stats.totalDuration, icon: Clock, color: "text-purple-600", bg: "bg-purple-100" },
        ].map((stat) => (
          <div key={stat.label} className="bg-bg-card rounded-2xl border border-border p-5">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Ø Distanz", value: stats.avgDistance + " km", icon: "📊" },
          { label: "Ø Pace", value: stats.avgPace, icon: "⏱️" },
          { label: "Längster Lauf", value: stats.longestRun + " km", icon: "🏆" },
          { label: "Schnellste Pace", value: stats.fastestPace, icon: "⚡" },
        ].map((fact) => (
          <div key={fact.label} className="bg-bg-card rounded-xl border border-border p-4 text-center">
            <span className="text-2xl">{fact.icon}</span>
            <div className="font-bold text-lg mt-1">{fact.value}</div>
            <div className="text-xs text-text-muted">{fact.label}</div>
          </div>
        ))}
      </div>

      {/* Members Performance Table */}
      <div className="bg-bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Mitglieder-Übersicht ({memberCount} Mitglied{memberCount !== 1 ? "er" : ""})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-text-muted">
              <tr>
                <th className="text-left p-3 font-medium">Läufer</th>
                <th className="text-right p-3 font-medium">Kilometer</th>
                <th className="text-right p-3 font-medium">Läufe</th>
                <th className="text-right p-3 font-medium">Ø Pace</th>
                <th className="text-right p-3 font-medium">Höhenmeter</th>
                <th className="text-right p-3 font-medium">Ø/Lauf</th>
              </tr>
            </thead>
            <tbody>
              {stats.members.map((member) => (
                <tr key={member.name} className="border-t border-border hover:bg-stone-50/50">
                  <td className="p-3 flex items-center gap-2">
                    <span className="text-lg">🏃</span>
                    <span className="font-medium">{member.name}</span>
                  </td>
                  <td className="p-3 text-right font-bold">{member.totalKm} km</td>
                  <td className="p-3 text-right text-text-muted">{member.totalRuns}</td>
                  <td className="p-3 text-right text-text-muted">{member.avgPace}</td>
                  <td className="p-3 text-right text-text-muted">↑ {member.totalElevation} m</td>
                  <td className="p-3 text-right text-text-muted">{member.avgDistance} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="mt-8 bg-gradient-to-r from-primary/5 to-emerald-50 rounded-2xl border border-primary/20 p-6">
        <h3 className="font-bold text-lg mb-3">🏃 Fun Facts</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span>🌍</span>
            <span>Mit {stats.totalKm.toLocaleString("de-DE")} km haben wir {(stats.totalKm / 40075 * 100).toFixed(2)}% der Erdumrundung geschafft!</span>
          </div>
          <div className="flex items-start gap-2">
            <span>⛰️</span>
            <span>Unsere {stats.totalElevation.toLocaleString("de-DE")} Höhenmeter entsprechen {(stats.totalElevation / 8849).toFixed(2)}x dem Mount Everest!</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 text-sm text-text-muted">
        Daten powered by Strava 🔗
      </div>
    </div>
  );
}
