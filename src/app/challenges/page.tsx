import { Target, Users, Calendar, Trophy } from "lucide-react";
import { mockChallenges } from "@/lib/mock-data";

export const metadata = {
  title: "Challenges – Lauftreff Reisbach",
  description: "Gemeinsame Lauf-Challenges und Ziele des Lauftreff Reisbach",
};

function getProgressColor(progress: number) {
  if (progress >= 80) return "from-primary to-emerald-400";
  if (progress >= 50) return "from-blue-500 to-cyan-400";
  if (progress >= 25) return "from-accent to-yellow-400";
  return "from-stone-400 to-stone-300";
}

function getDaysLeft(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date("2026-03-04");
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function getStatusBadge(startDate: string, endDate: string) {
  const now = new Date("2026-03-04");
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) return { label: "Bald", color: "bg-blue-100 text-blue-700" };
  if (now > end) return { label: "Beendet", color: "bg-stone-100 text-stone-500" };
  return { label: "Aktiv", color: "bg-primary/10 text-primary" };
}

export default function ChallengesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Target className="w-8 h-8 text-red-500" />
          Challenges
        </h1>
        <p className="text-text-muted mt-1">
          Gemeinsame Ziele motivieren! Hier sind unsere aktuellen Challenges.
        </p>
      </div>

      {/* Featured Challenge */}
      <div className="bg-gradient-to-br from-primary to-emerald-700 text-white rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-[120px] opacity-10 leading-none">
          {mockChallenges[0].icon}
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">{mockChallenges[0].icon}</span>
            <span className="bg-white/20 px-3 py-0.5 rounded-full text-sm font-medium backdrop-blur-sm">
              Aktive Challenge
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{mockChallenges[0].title}</h2>
          <p className="text-emerald-100 mb-6">{mockChallenges[0].description}</p>
          
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-lg">
                {mockChallenges[0].current} / {mockChallenges[0].target} {mockChallenges[0].unit}
              </span>
              <span>{Math.round((mockChallenges[0].current / mockChallenges[0].target) * 100)}%</span>
            </div>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000"
                style={{ width: `${(mockChallenges[0].current / mockChallenges[0].target) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-emerald-100">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {mockChallenges[0].participants} Teilnehmer
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Noch {getDaysLeft(mockChallenges[0].endDate)} Tage
            </span>
          </div>
        </div>
      </div>

      {/* All Challenges */}
      <h2 className="text-xl font-bold mb-4">Alle Challenges</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {mockChallenges.map((challenge) => {
          const progress = (challenge.current / challenge.target) * 100;
          const status = getStatusBadge(challenge.startDate, challenge.endDate);
          const daysLeft = getDaysLeft(challenge.endDate);

          return (
            <div
              key={challenge.id}
              className="bg-bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{challenge.icon}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                {progress >= 100 && (
                  <Trophy className="w-5 h-5 text-yellow-500" />
                )}
              </div>

              {/* Content */}
              <h3 className="font-bold text-lg mb-1">{challenge.title}</h3>
              <p className="text-sm text-text-muted mb-4">{challenge.description}</p>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">
                    {challenge.current} / {challenge.target} {challenge.unit}
                  </span>
                  <span className="text-text-muted">{Math.round(progress)}%</span>
                </div>
                <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full transition-all`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {challenge.participants} Teilnehmer
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {daysLeft > 0 ? `Noch ${daysLeft} Tage` : "Beendet"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center bg-stone-50 rounded-2xl p-8 border border-border">
        <h3 className="text-xl font-bold mb-2">Du hast eine Challenge-Idee? 💡</h3>
        <p className="text-text-muted mb-4">
          Schlag eine neue Challenge vor! Je kreativer, desto besser.
        </p>
        <p className="text-sm text-text-muted">
          Schreib einfach in die WhatsApp-Gruppe oder sprich uns beim nächsten Lauftreff an.
        </p>
      </div>
    </div>
  );
}
