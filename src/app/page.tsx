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
import { mockActivities, mockRunners, mockGroupStats, mockChallenges } from "@/lib/mock-data";

export default function Home() {
  const recentActivities = mockActivities.slice(0, 3);
  const topRunners = [...mockRunners].sort((a, b) => b.totalKm - a.totalKm).slice(0, 3);
  const activeChallenge = mockChallenges[0];

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
            { label: "Läufer", value: String(mockGroupStats.members), icon: Users, color: "text-primary" },
            { label: "Gesamt km", value: mockGroupStats.totalKm.toLocaleString("de-DE"), icon: TrendingUp, color: "text-accent" },
            { label: "Läufe", value: String(mockGroupStats.totalRuns), icon: Activity, color: "text-blue-600" },
            { label: "Höhenmeter", value: mockGroupStats.totalElevation.toLocaleString("de-DE") + " m", icon: BarChart3, color: "text-purple-600" },
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
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-bg-card rounded-xl p-4 border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{activity.athleteAvatar}</span>
                      <div>
                        <div className="font-semibold">{activity.athleteName}</div>
                        <div className="text-sm text-text-muted">{activity.name}</div>
                      </div>
                    </div>
                    <span className="text-xs text-text-muted">
                      {new Date(activity.date).toLocaleDateString("de-DE", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="font-medium">{activity.distance} km</span>
                    <span className="text-text-muted">{activity.duration}</span>
                    <span className="text-text-muted">{activity.pace} /km</span>
                    <span className="text-text-muted">{activity.elevation} m</span>
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
                {topRunners.map((runner, i) => (
                  <div
                    key={runner.id}
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
                    <span className="text-lg">{runner.avatar}</span>
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
                  <span>{activeChallenge.target} {activeChallenge.unit}</span>
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
