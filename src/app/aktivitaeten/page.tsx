import { Activity, Heart, Mountain, Clock, Filter } from "lucide-react";
import { mockActivities } from "@/lib/mock-data";

export const metadata = {
  title: "Aktivitäten – Lauftreff Reisbach",
  description: "Aktuelle Lauf-Aktivitäten unserer Mitglieder",
};

function ActivityTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "Trail Run":
      return <Mountain className="w-4 h-4 text-emerald-600" />;
    case "Walk":
      return <Activity className="w-4 h-4 text-blue-500" />;
    default:
      return <Activity className="w-4 h-4 text-primary" />;
  }
}

function ActivityTypeBadge({ type }: { type: string }) {
  const colors = {
    Run: "bg-primary/10 text-primary",
    "Trail Run": "bg-emerald-100 text-emerald-700",
    Walk: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[type as keyof typeof colors] || colors.Run}`}>
      {type === "Run" ? "Lauf" : type === "Trail Run" ? "Trail" : "Walking"}
    </span>
  );
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date("2026-03-04T12:00:00");
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return "gerade eben";
  if (diffHours < 24) return `vor ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "gestern";
  if (diffDays < 7) return `vor ${diffDays} Tagen`;
  return date.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}

export default function AktivitaetenPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary" />
          Aktivitäten
        </h1>
        <p className="text-text-muted mt-1">
          Die neuesten Läufe unserer Mitglieder – frisch von Strava
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
        <div className="flex items-center gap-1 text-sm text-text-muted">
          <Filter className="w-4 h-4" />
          Filter:
        </div>
        {["Alle", "Läufe", "Trail", "Walking"].map((filter) => (
          <button
            key={filter}
            className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors whitespace-nowrap ${
              filter === "Alle"
                ? "bg-primary text-white"
                : "bg-stone-100 text-text-muted hover:bg-stone-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Activities Feed */}
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <article
            key={activity.id}
            className="bg-bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activity.athleteAvatar}</span>
                <div>
                  <div className="font-bold">{activity.athleteName}</div>
                  <div className="text-xs text-text-muted flex items-center gap-2">
                    <span>{timeAgo(activity.date)}</span>
                    <ActivityTypeBadge type={activity.type} />
                  </div>
                </div>
              </div>
              <ActivityTypeIcon type={activity.type} />
            </div>

            {/* Activity Name */}
            <h3 className="font-semibold text-lg mb-3">{activity.name}</h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-stone-50 rounded-xl p-3">
                <div className="text-xs text-text-muted mb-0.5">Distanz</div>
                <div className="font-bold text-lg">{activity.distance} km</div>
              </div>
              <div className="bg-stone-50 rounded-xl p-3">
                <div className="text-xs text-text-muted mb-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Dauer
                </div>
                <div className="font-bold text-lg">{activity.duration}</div>
              </div>
              <div className="bg-stone-50 rounded-xl p-3">
                <div className="text-xs text-text-muted mb-0.5">Pace</div>
                <div className="font-bold text-lg">{activity.pace} <span className="text-sm font-normal">/km</span></div>
              </div>
              <div className="bg-stone-50 rounded-xl p-3">
                <div className="text-xs text-text-muted mb-0.5 flex items-center gap-1">
                  <Mountain className="w-3 h-3" /> Höhe
                </div>
                <div className="font-bold text-lg">↑ {activity.elevation} m</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-400" /> {activity.kudos} Kudos
                </span>
                {activity.heartrate && (
                  <span className="flex items-center gap-1">
                    ❤️ {activity.heartrate} bpm
                  </span>
                )}
              </div>
              <span className="text-xs text-text-muted">
                {new Date(activity.date).toLocaleDateString("de-DE", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Strava Attribution */}
      <div className="text-center mt-8 text-sm text-text-muted">
        <p>Daten powered by Strava 🔗</p>
      </div>
    </div>
  );
}
