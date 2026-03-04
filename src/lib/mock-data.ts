/**
 * Mock-Daten für die Entwicklung (wenn kein Strava-API-Zugang vorhanden)
 * Diese Daten simulieren die Strava-API-Antworten
 */

export interface MockRunner {
  id: number;
  name: string;
  avatar: string;
  totalKm: number;
  totalRuns: number;
  avgPace: string;
  streak: number;
}

export interface MockActivity {
  id: number;
  athleteName: string;
  athleteAvatar: string;
  name: string;
  distance: number; // km
  duration: string;
  pace: string;
  elevation: number;
  date: string;
  type: "Run" | "Trail Run" | "Walk";
  polyline?: string;
  kudos: number;
  heartrate?: number;
}

export interface MockChallenge {
  id: number;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  startDate: string;
  endDate: string;
  participants: number;
  icon: string;
}

export interface MockRoute {
  id: number;
  name: string;
  distance: number;
  elevation: number;
  difficulty: "Leicht" | "Mittel" | "Schwer";
  description: string;
  coordinates: [number, number][];
}

// --- Mock Runners ---
export const mockRunners: MockRunner[] = [
  { id: 1, name: "David B.", avatar: "🏃‍♂️", totalKm: 247.3, totalRuns: 28, avgPace: "5:12", streak: 12 },
  { id: 2, name: "Sarah M.", avatar: "🏃‍♀️", totalKm: 198.5, totalRuns: 24, avgPace: "5:45", streak: 8 },
  { id: 3, name: "Thomas K.", avatar: "🏃‍♂️", totalKm: 312.1, totalRuns: 35, avgPace: "4:58", streak: 15 },
  { id: 4, name: "Lisa W.", avatar: "🏃‍♀️", totalKm: 156.8, totalRuns: 19, avgPace: "6:10", streak: 5 },
  { id: 5, name: "Markus H.", avatar: "🏃‍♂️", totalKm: 289.4, totalRuns: 31, avgPace: "5:05", streak: 10 },
  { id: 6, name: "Anna S.", avatar: "🏃‍♀️", totalKm: 134.2, totalRuns: 16, avgPace: "6:30", streak: 3 },
  { id: 7, name: "Johannes R.", avatar: "🏃‍♂️", totalKm: 275.9, totalRuns: 30, avgPace: "5:20", streak: 9 },
  { id: 8, name: "Maria P.", avatar: "🏃‍♀️", totalKm: 167.3, totalRuns: 21, avgPace: "5:55", streak: 7 },
];

// --- Mock Activities ---
export const mockActivities: MockActivity[] = [
  {
    id: 1, athleteName: "Thomas K.", athleteAvatar: "🏃‍♂️",
    name: "Morgenrunde durch die Felder", distance: 12.4, duration: "1:01:32",
    pace: "4:58", elevation: 85, date: "2026-03-04T07:15:00",
    type: "Run", kudos: 5, heartrate: 152,
  },
  {
    id: 2, athleteName: "David B.", athleteAvatar: "🏃‍♂️",
    name: "Feierabend-Lauf Vilstal", distance: 8.2, duration: "42:38",
    pace: "5:12", elevation: 45, date: "2026-03-03T17:30:00",
    type: "Run", kudos: 3, heartrate: 148,
  },
  {
    id: 3, athleteName: "Sarah M.", athleteAvatar: "🏃‍♀️",
    name: "Sonntagslauf Richtung Obere Holz", distance: 15.1, duration: "1:26:50",
    pace: "5:45", elevation: 120, date: "2026-03-02T09:00:00",
    type: "Trail Run", kudos: 8, heartrate: 145,
  },
  {
    id: 4, athleteName: "Markus H.", athleteAvatar: "🏃‍♂️",
    name: "Intervall-Training Sportplatz", distance: 6.0, duration: "30:30",
    pace: "5:05", elevation: 10, date: "2026-03-02T18:00:00",
    type: "Run", kudos: 4, heartrate: 168,
  },
  {
    id: 5, athleteName: "Lisa W.", athleteAvatar: "🏃‍♀️",
    name: "Lockerer Erholungslauf", distance: 5.5, duration: "33:55",
    pace: "6:10", elevation: 25, date: "2026-03-01T10:00:00",
    type: "Run", kudos: 2,
  },
  {
    id: 6, athleteName: "Johannes R.", athleteAvatar: "🏃‍♂️",
    name: "Long Run Sonntag – Vilsbiburg und zurück", distance: 21.1, duration: "1:52:12",
    pace: "5:20", elevation: 150, date: "2026-03-01T08:00:00",
    type: "Run", kudos: 12, heartrate: 155,
  },
  {
    id: 7, athleteName: "Maria P.", athleteAvatar: "🏃‍♀️",
    name: "Abendlauf mit Hund 🐕", distance: 4.8, duration: "28:24",
    pace: "5:55", elevation: 20, date: "2026-02-28T17:00:00",
    type: "Run", kudos: 6,
  },
  {
    id: 8, athleteName: "Anna S.", athleteAvatar: "🏃‍♀️",
    name: "Nordic Walking Waldweg", distance: 7.2, duration: "46:48",
    pace: "6:30", elevation: 55, date: "2026-02-28T09:30:00",
    type: "Walk", kudos: 3,
  },
];

// --- Mock Challenges ---
export const mockChallenges: MockChallenge[] = [
  {
    id: 1, title: "März-Challenge: 1.000 km",
    description: "Gemeinsam schaffen wir 1.000 km im März! Jeder Kilometer zählt.",
    target: 1000, current: 487, unit: "km",
    startDate: "2026-03-01", endDate: "2026-03-31",
    participants: 8, icon: "🎯",
  },
  {
    id: 2, title: "Streak-Challenge",
    description: "Wer schafft die längste Lauf-Serie? Mindestens 2 km pro Tag.",
    target: 30, current: 15, unit: "Tage",
    startDate: "2026-03-01", endDate: "2026-03-31",
    participants: 6, icon: "🔥",
  },
  {
    id: 3, title: "Höhenmeter-König",
    description: "Sammle so viele Höhenmeter wie möglich in diesem Monat.",
    target: 5000, current: 2340, unit: "m",
    startDate: "2026-03-01", endDate: "2026-03-31",
    participants: 5, icon: "⛰️",
  },
  {
    id: 4, title: "Frühlings-Halbmarathon",
    description: "Laufe deinen ersten Halbmarathon (21,1 km) am Stück!",
    target: 1, current: 0, unit: "Finish",
    startDate: "2026-03-15", endDate: "2026-04-15",
    participants: 4, icon: "🏅",
  },
];

// --- Mock Routes (Reisbach area) ---
export const mockRoutes: MockRoute[] = [
  {
    id: 1, name: "Vilstal-Runde",
    distance: 8.5, elevation: 45, difficulty: "Leicht",
    description: "Gemütliche Runde entlang der Vils. Flach und gut für Einsteiger.",
    coordinates: [
      [48.5680, 12.6280], [48.5700, 12.6350], [48.5750, 12.6400],
      [48.5780, 12.6350], [48.5750, 12.6250], [48.5700, 12.6200],
      [48.5680, 12.6280],
    ],
  },
  {
    id: 2, name: "Hügelrunde Obere Holz",
    distance: 12.3, elevation: 120, difficulty: "Mittel",
    description: "Hügelige Strecke durch Felder und Wald. Schöne Aussichtspunkte.",
    coordinates: [
      [48.5680, 12.6280], [48.5720, 12.6150], [48.5800, 12.6100],
      [48.5850, 12.6200], [48.5800, 12.6350], [48.5730, 12.6380],
      [48.5680, 12.6280],
    ],
  },
  {
    id: 3, name: "Trail durch den Stadtwald",
    distance: 6.2, elevation: 85, difficulty: "Mittel",
    description: "Technischer Waldtrail mit ein paar knackigen Anstiegen.",
    coordinates: [
      [48.5680, 12.6280], [48.5650, 12.6200], [48.5620, 12.6150],
      [48.5600, 12.6200], [48.5630, 12.6300], [48.5660, 12.6310],
      [48.5680, 12.6280],
    ],
  },
  {
    id: 4, name: "Langstrecke nach Vilsbiburg",
    distance: 21.1, elevation: 150, difficulty: "Schwer",
    description: "Die Halbmarathon-Distanz! Hin und zurück nach Vilsbiburg entlang der Vils.",
    coordinates: [
      [48.5680, 12.6280], [48.5600, 12.6100], [48.5500, 12.5900],
      [48.5400, 12.5700], [48.4500, 12.3500], [48.5400, 12.5700],
      [48.5600, 12.6100], [48.5680, 12.6280],
    ],
  },
];

// --- Stats ---
export const mockGroupStats = {
  totalKm: 1781.5,
  totalRuns: 204,
  totalElevation: 12450,
  totalDuration: "156h 32min",
  avgDistance: 8.7,
  avgPace: "5:28",
  members: 8,
  activeDays: 45,
  longestRun: 21.1,
  fastestPace: "4:12",
  monthlyKm: [
    { month: "Okt 25", km: 342 },
    { month: "Nov 25", km: 298 },
    { month: "Dez 25", km: 215 },
    { month: "Jan 26", km: 278 },
    { month: "Feb 26", km: 361 },
    { month: "Mär 26", km: 487 },
  ],
  weeklyDistribution: [
    { day: "Mo", runs: 18 },
    { day: "Di", runs: 24 },
    { day: "Mi", runs: 15 },
    { day: "Do", runs: 22 },
    { day: "Fr", runs: 12 },
    { day: "Sa", runs: 35 },
    { day: "So", runs: 42 },
  ],
};
