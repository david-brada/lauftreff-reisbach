import { BarChart3, TrendingUp, Users, Calendar, Flame, MapPin, Clock, Activity } from "lucide-react";
import { mockGroupStats, mockRunners } from "@/lib/mock-data";

export const metadata = {
  title: "Statistiken – Lauftreff Reisbach",
  description: "Gruppen-Statistiken und Auswertungen des Lauftreff Reisbach",
};

function SimpleBarChart({ data, maxValue, color }: { data: { label: string; value: number }[]; maxValue: number; color: string }) {
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((item) => (
        <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-text-muted">{item.value}</span>
          <div className="w-full bg-stone-100 rounded-t-md relative" style={{ height: "100%" }}>
            <div
              className={`absolute bottom-0 w-full rounded-t-md transition-all ${color}`}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-xs text-text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function StatistikenPage() {
  const { monthlyKm, weeklyDistribution } = mockGroupStats;
  const maxMonthlyKm = Math.max(...monthlyKm.map(m => m.km));
  const maxWeeklyRuns = Math.max(...weeklyDistribution.map(d => d.runs));

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
          { label: "Gesamt Kilometer", value: mockGroupStats.totalKm.toLocaleString("de-DE") + " km", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          { label: "Gesamt Läufe", value: mockGroupStats.totalRuns.toString(), icon: Activity, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Höhenmeter", value: mockGroupStats.totalElevation.toLocaleString("de-DE") + " m", icon: MapPin, color: "text-accent", bg: "bg-orange-100" },
          { label: "Laufzeit", value: mockGroupStats.totalDuration, icon: Clock, color: "text-purple-600", bg: "bg-purple-100" },
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

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Monthly Distance Chart */}
        <div className="bg-bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Kilometer pro Monat
          </h3>
          <SimpleBarChart
            data={monthlyKm.map(m => ({ label: m.month.split(" ")[0], value: m.km }))}
            maxValue={maxMonthlyKm}
            color="bg-gradient-to-t from-primary to-emerald-400"
          />
        </div>

        {/* Weekly Distribution Chart */}
        <div className="bg-bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Läufe pro Wochentag
          </h3>
          <SimpleBarChart
            data={weeklyDistribution.map(d => ({ label: d.day, value: d.runs }))}
            maxValue={maxWeeklyRuns}
            color="bg-gradient-to-t from-blue-500 to-cyan-400"
          />
        </div>
      </div>

      {/* Quick Facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Ø Distanz", value: mockGroupStats.avgDistance + " km", icon: "📊" },
          { label: "Ø Pace", value: mockGroupStats.avgPace + " /km", icon: "⏱️" },
          { label: "Längster Lauf", value: mockGroupStats.longestRun + " km", icon: "🏆" },
          { label: "Schnellste Pace", value: mockGroupStats.fastestPace + " /km", icon: "⚡" },
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
            Mitglieder-Übersicht
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
                <th className="text-right p-3 font-medium">
                  <Flame className="w-3 h-3 inline" /> Streak
                </th>
                <th className="text-right p-3 font-medium">Ø/Lauf</th>
              </tr>
            </thead>
            <tbody>
              {[...mockRunners].sort((a, b) => b.totalKm - a.totalKm).map((runner) => (
                <tr key={runner.id} className="border-t border-border hover:bg-stone-50/50">
                  <td className="p-3 flex items-center gap-2">
                    <span className="text-lg">{runner.avatar}</span>
                    <span className="font-medium">{runner.name}</span>
                  </td>
                  <td className="p-3 text-right font-bold">{runner.totalKm} km</td>
                  <td className="p-3 text-right text-text-muted">{runner.totalRuns}</td>
                  <td className="p-3 text-right text-text-muted">{runner.avgPace} /km</td>
                  <td className="p-3 text-right">
                    <span className={`${runner.streak >= 10 ? "text-accent font-bold" : "text-text-muted"}`}>
                      {runner.streak} Tage
                    </span>
                  </td>
                  <td className="p-3 text-right text-text-muted">
                    {(runner.totalKm / runner.totalRuns).toFixed(1)} km
                  </td>
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
            <span>Mit {mockGroupStats.totalKm.toLocaleString("de-DE")} km haben wir schon {(mockGroupStats.totalKm / 40075 * 100).toFixed(1)}% der Erdumrundung geschafft!</span>
          </div>
          <div className="flex items-start gap-2">
            <span>🗼</span>
            <span>Unsere {mockGroupStats.totalElevation.toLocaleString("de-DE")} Höhenmeter entsprechen {(mockGroupStats.totalElevation / 8849).toFixed(1)}x dem Mount Everest!</span>
          </div>
          <div className="flex items-start gap-2">
            <span>📅</span>
            <span>Am liebsten laufen wir Sonntags – mit {weeklyDistribution[6].runs} Läufen der beliebteste Tag.</span>
          </div>
          <div className="flex items-start gap-2">
            <span>⚡</span>
            <span>Unser schnellster Pace war {mockGroupStats.fastestPace} /km – das sind {(60 / parseFloat(mockGroupStats.fastestPace.replace(":", ".")) * 1).toFixed(1)} km/h!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
