import { Activity, Mountain, Clock, Filter } from "lucide-react";
import { getClubActivities, formatDistance, formatDuration, formatPace, type ClubActivity } from "@/lib/strava";

export const metadata = {
  title: "Aktivitäten – Lauftreff Reisbach",
  description: "Aktuelle Lauf-Aktivitäten unserer Mitglieder",
};

function ActivityTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "Trail Run":
    case "TrailRun":
      return <Mountain className="w-4 h-4 text-emerald-600" />;
    case "Walk":
      return <Activity className="w-4 h-4 text-blue-500" />;
    default:
      return <Activity className="w-4 h-4 text-primary" />;
  }
}

function ActivityTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    Run: "bg-primary/10 text-primary",
    "Trail Run": "bg-emerald-100 text-emerald-700",
    TrailRun: "bg-emerald-100 text-emerald-700",
    Walk: "bg-blue-100 text-blue-700",
  };
  const labels: Record<string, string> = {
    Run: "Lauf",
    "Trail Run": "Trail",
    TrailRun: "Trail",
    Walk: "Walking",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[type] || colors.Run}`}>
      {labels[type] || type}
    </span>
  );
}

interface DisplayActivity {
  name: string;
  athleteName: string;
  distance: string;
  duration: string;
  pace: string;
  elevation: number;
  type: string;
  device?: string;
}

function stravaToDisplay(a: ClubActivity): DisplayActivity {
  return {
    name: a.name,
    athleteName: `${a.athlete.firstname} ${a.athlete.lastname}`,
    distance: (a.distance / 1000).toFixed(1),
    duration: formatDuration(a.moving_time),
    pace: a.distance > 0 ? formatPace(a.distance / a.moving_time) : "-",
    elevation: Math.round(a.total_elevation_gain),
    type: a.sport_type || a.type,
    device: a.device_name,
  };
}

export default async function AktivitaetenPage() {
  let activities: DisplayActivity[] = [];
  try {
    const stravaData = await getClubActivities(1, 30);
    activities = stravaData.map(stravaToDisplay);
  } catch (e) {
    console.error("Strava fetch failed", e);
  }

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

      {/* Activities Feed */}
      <div className="space-y-4">
        {activities.length === 0 && (
          <div className="bg-bg-card rounded-2xl border border-border p-8 text-center">
            <span className="text-4xl mb-3 block">🏃</span>
            <h2 className="font-bold text-lg mb-1">Noch keine Aktivitäten</h2>
            <p className="text-text-muted text-sm">Sobald Mitglieder dem Strava-Club beitreten und laufen, erscheinen hier die Aktivitäten.</p>
          </div>
        )}
        {activities.map((activity, idx) => (
          <article
            key={idx}
            className="bg-bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏃</span>
                <div>
                  <div className="font-bold">{activity.athleteName}</div>
                  <div className="text-xs text-text-muted flex items-center gap-2">
                    <ActivityTypeBadge type={activity.type} />
                    {activity.device && <span>{activity.device}</span>}
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
                <div className="font-bold text-lg">{activity.pace}</div>
              </div>
              <div className="bg-stone-50 rounded-xl p-3">
                <div className="text-xs text-text-muted mb-0.5 flex items-center gap-1">
                  <Mountain className="w-3 h-3" /> Höhe
                </div>
                <div className="font-bold text-lg">↑ {activity.elevation} m</div>
              </div>
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
