import { Trophy, Flame, TrendingUp, Medal } from "lucide-react";
import { mockRunners } from "@/lib/mock-data";

export const metadata = {
  title: "Leaderboard – Lauftreff Reisbach",
  description: "Rangliste der aktivsten Läufer im Lauftreff Reisbach",
};

const sortedRunners = [...mockRunners].sort((a, b) => b.totalKm - a.totalKm);

function getMedalColor(position: number) {
  switch (position) {
    case 0: return { bg: "bg-yellow-50 border-yellow-300", badge: "bg-yellow-400 text-yellow-900", icon: "🥇" };
    case 1: return { bg: "bg-stone-50 border-stone-300", badge: "bg-stone-300 text-stone-700", icon: "🥈" };
    case 2: return { bg: "bg-orange-50 border-orange-300", badge: "bg-orange-400 text-orange-900", icon: "🥉" };
    default: return { bg: "bg-bg-card border-border", badge: "bg-stone-100 text-text-muted", icon: "" };
  }
}

export default function LeaderboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="w-8 h-8 text-accent" />
          Leaderboard
        </h1>
        <p className="text-text-muted mt-1">
          Wer hat diesen Monat die meisten Kilometer gesammelt?
        </p>
      </div>

      {/* Podium (Top 3) */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* 2nd place */}
        <div className="flex flex-col items-center pt-8">
          <span className="text-4xl mb-2">{sortedRunners[1]?.avatar}</span>
          <div className="bg-stone-200 rounded-t-2xl w-full py-6 text-center relative">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">🥈</span>
            <div className="font-bold mt-2">{sortedRunners[1]?.name}</div>
            <div className="text-lg font-bold text-primary">{sortedRunners[1]?.totalKm} km</div>
            <div className="text-xs text-text-muted">{sortedRunners[1]?.totalRuns} Läufe</div>
          </div>
        </div>

        {/* 1st place */}
        <div className="flex flex-col items-center">
          <span className="text-5xl mb-2">{sortedRunners[0]?.avatar}</span>
          <div className="bg-yellow-100 rounded-t-2xl w-full py-8 text-center relative border-2 border-yellow-300">
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-4xl">🥇</span>
            <div className="font-bold text-lg mt-2">{sortedRunners[0]?.name}</div>
            <div className="text-2xl font-bold text-primary">{sortedRunners[0]?.totalKm} km</div>
            <div className="text-sm text-text-muted">{sortedRunners[0]?.totalRuns} Läufe</div>
            <div className="text-xs text-accent font-medium mt-1">
              <Flame className="w-3 h-3 inline" /> {sortedRunners[0]?.streak} Tage Streak
            </div>
          </div>
        </div>

        {/* 3rd place */}
        <div className="flex flex-col items-center pt-12">
          <span className="text-4xl mb-2">{sortedRunners[2]?.avatar}</span>
          <div className="bg-orange-100 rounded-t-2xl w-full py-4 text-center relative">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">🥉</span>
            <div className="font-bold mt-2">{sortedRunners[2]?.name}</div>
            <div className="text-lg font-bold text-primary">{sortedRunners[2]?.totalKm} km</div>
            <div className="text-xs text-text-muted">{sortedRunners[2]?.totalRuns} Läufe</div>
          </div>
        </div>
      </div>

      {/* Full Ranking */}
      <div className="bg-bg-card rounded-2xl border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-3 bg-stone-50 text-xs font-medium text-text-muted border-b border-border">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-4">Läufer</div>
          <div className="col-span-2 text-right">Kilometer</div>
          <div className="col-span-2 text-right">Läufe</div>
          <div className="col-span-1 text-right">Pace</div>
          <div className="col-span-2 text-right flex items-center justify-end gap-1">
            <Flame className="w-3 h-3" /> Streak
          </div>
        </div>

        {sortedRunners.map((runner, index) => {
          const medal = getMedalColor(index);
          return (
            <div
              key={runner.id}
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
                <span className="text-xl">{runner.avatar}</span>
                <span className="font-medium">{runner.name}</span>
              </div>
              <div className="col-span-2 text-right font-bold">{runner.totalKm} km</div>
              <div className="col-span-2 text-right text-text-muted">{runner.totalRuns}</div>
              <div className="col-span-1 text-right text-sm text-text-muted">{runner.avgPace}</div>
              <div className="col-span-2 text-right">
                <span className="inline-flex items-center gap-1 text-sm">
                  <Flame className={`w-3 h-3 ${runner.streak >= 10 ? "text-accent" : "text-text-muted"}`} />
                  <span className={runner.streak >= 10 ? "font-bold text-accent" : "text-text-muted"}>
                    {runner.streak}d
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          { label: "Längster Streak", value: `${Math.max(...mockRunners.map(r => r.streak))} Tage`, icon: Flame, color: "text-accent" },
          { label: "Schnellste Pace", value: "4:58 /km", icon: TrendingUp, color: "text-primary" },
          { label: "Meiste Läufe", value: `${Math.max(...mockRunners.map(r => r.totalRuns))}`, icon: Medal, color: "text-purple-600" },
          { label: "Gesamt km", value: `${mockRunners.reduce((s, r) => s + r.totalKm, 0).toFixed(0)} km`, icon: Trophy, color: "text-yellow-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-bg-card rounded-xl border border-border p-4 text-center">
            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <div className="font-bold text-lg">{stat.value}</div>
            <div className="text-xs text-text-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
