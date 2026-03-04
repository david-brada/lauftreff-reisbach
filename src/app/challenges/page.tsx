export const dynamic = "force-dynamic";

import { Target, Users, Calendar, Trophy } from "lucide-react";
import { getClubActivities, getClubMembers, type ClubActivity } from "@/lib/strava";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Challenges – Lauftreff Reisbach",
  description: "Gemeinsame Lauf-Challenges und Ziele des Lauftreff Reisbach",
};

interface Challenge {
  id: number;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  icon: string;
  endDate: string;
}

interface AdminChallenge {
  id: number;
  title: string;
  description: string;
  target: number;
  unit: string;
  icon: string;
  endDate: string;
  type: "km" | "elevation" | "runs" | "custom";
  customCurrent?: number;
}

function getProgressColor(progress: number) {
  if (progress >= 80) return "from-primary to-emerald-400";
  if (progress >= 50) return "from-blue-500 to-cyan-400";
  if (progress >= 25) return "from-accent to-yellow-400";
  return "from-stone-400 to-stone-300";
}

function getDaysLeft(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function buildChallenges(activities: ClubActivity[], memberCount: number): Challenge[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const monthName = monthNames[currentMonth];

  const totalKm = parseFloat((activities.reduce((s, a) => s + a.distance, 0) / 1000).toFixed(1));
  const totalElevation = Math.round(activities.reduce((s, a) => s + a.total_elevation_gain, 0));
  const totalRuns = activities.length;

  const kmTarget = Math.max(50, Math.ceil(memberCount * 50 / 10) * 10);
  const elevTarget = Math.max(500, Math.ceil(memberCount * 500 / 100) * 100);
  const runsTarget = Math.max(10, memberCount * 5);

  const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split("T")[0];

  return [
    {
      id: 1,
      title: `${monthName}-Challenge: ${kmTarget} km`,
      description: `Gemeinsam schaffen wir ${kmTarget} km im ${monthName}! Jeder Kilometer zählt.`,
      target: kmTarget,
      current: totalKm,
      unit: "km",
      icon: "🎯",
      endDate: endOfMonth,
    },
    {
      id: 2,
      title: `Höhenmeter-Challenge: ${elevTarget} m`,
      description: `Sammelt gemeinsam ${elevTarget} Höhenmeter in diesem Monat!`,
      target: elevTarget,
      current: totalElevation,
      unit: "m",
      icon: "⛰️",
      endDate: endOfMonth,
    },
    {
      id: 3,
      title: `${runsTarget} Läufe im ${monthName}`,
      description: `Ziel: ${runsTarget} Läufe als Gruppe in diesem Monat schaffen.`,
      target: runsTarget,
      current: totalRuns,
      unit: "Läufe",
      icon: "🏃",
      endDate: endOfMonth,
    },
  ];
}

function mergeAdminChallenges(
  adminChallenges: AdminChallenge[],
  activities: ClubActivity[]
): Challenge[] {
  const now = new Date();
  const totalKm = parseFloat((activities.reduce((s, a) => s + a.distance, 0) / 1000).toFixed(1));
  const totalElevation = Math.round(activities.reduce((s, a) => s + a.total_elevation_gain, 0));
  const totalRuns = activities.length;

  return adminChallenges
    .filter((c) => new Date(c.endDate) >= now) // only active
    .map((c) => {
      let current = 0;
      if (c.type === "km") current = totalKm;
      else if (c.type === "elevation") current = totalElevation;
      else if (c.type === "runs") current = totalRuns;
      else current = c.customCurrent || 0;

      return {
        id: c.id,
        title: c.title,
        description: c.description,
        target: c.target,
        current,
        unit: c.unit,
        icon: c.icon,
        endDate: c.endDate,
      };
    });
}

async function getAdminChallenges(): Promise<AdminChallenge[]> {
  try {
    const { data, error } = await supabase
      .from("lauftreff_config")
      .select("value")
      .eq("key", "challenges")
      .single();
    if (error) throw error;
    const value = data?.value;
    if (Array.isArray(value) && value.length > 0) return value;
  } catch {
    // Supabase not configured or table missing
  }
  return [];
}

export default async function ChallengesPage() {
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

  const effectiveMembers = memberCount || 1;

  // Get admin-created challenges from Supabase
  const adminChallenges = await getAdminChallenges();

  // Use admin challenges if any exist, otherwise auto-generate from Strava
  const challenges = adminChallenges.length > 0
    ? mergeAdminChallenges(adminChallenges, activities)
    : buildChallenges(activities, effectiveMembers);
  const mainChallenge = challenges[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Target className="w-8 h-8 text-red-500" />
          Challenges
        </h1>
        <p className="text-text-muted mt-1">
          Gemeinsame Ziele basierend auf echten Strava-Daten!
        </p>
      </div>

      {/* Featured Challenge */}
      <div className="bg-gradient-to-br from-primary to-emerald-700 text-white rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-[120px] opacity-10 leading-none">
          {mainChallenge.icon}
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">{mainChallenge.icon}</span>
            <span className="bg-white/20 px-3 py-0.5 rounded-full text-sm font-medium backdrop-blur-sm">
              Aktive Challenge
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{mainChallenge.title}</h2>
          <p className="text-emerald-100 mb-6">{mainChallenge.description}</p>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-lg">
                {mainChallenge.current} / {mainChallenge.target} {mainChallenge.unit}
              </span>
              <span>{Math.min(100, Math.round((mainChallenge.current / mainChallenge.target) * 100))}%</span>
            </div>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((mainChallenge.current / mainChallenge.target) * 100, 100)}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-emerald-100">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {effectiveMembers} Teilnehmer
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Noch {getDaysLeft(mainChallenge.endDate)} Tage
            </span>
          </div>
        </div>
      </div>

      {/* All Challenges */}
      <h2 className="text-xl font-bold mb-4">Alle Challenges</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {challenges.map((challenge) => {
          const progress = (challenge.current / challenge.target) * 100;
          const daysLeft = getDaysLeft(challenge.endDate);

          return (
            <div
              key={challenge.id}
              className="bg-bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{challenge.icon}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
                    Aktiv
                  </span>
                </div>
                {progress >= 100 && (
                  <Trophy className="w-5 h-5 text-yellow-500" />
                )}
              </div>

              <h3 className="font-bold text-lg mb-1">{challenge.title}</h3>
              <p className="text-sm text-text-muted mb-4">{challenge.description}</p>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">
                    {challenge.current} / {challenge.target} {challenge.unit}
                  </span>
                  <span className="text-text-muted">{Math.min(100, Math.round(progress))}%</span>
                </div>
                <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full transition-all`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {effectiveMembers} Teilnehmer
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
        <h3 className="text-xl font-bold mb-2">Mach mit beim Lauftreff! 🏃</h3>
        <p className="text-text-muted mb-4">
          Tritt unserem Strava-Club bei und deine Läufe zählen automatisch für alle Challenges.
        </p>
        <a
          href="https://www.strava.com/clubs/1997757"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Strava-Club beitreten
        </a>
      </div>

      <div className="text-center mt-6 text-sm text-text-muted">
        Daten powered by Strava 🔗
      </div>
    </div>
  );
}
