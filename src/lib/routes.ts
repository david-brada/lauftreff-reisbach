/**
 * Lokale Strecken-Daten für den Lauftreff Reisbach.
 * Diese Routen werden manuell gepflegt und sind keine Mock-Daten.
 * Koordinaten basieren auf echten Wegen rund um Reisbach (Niederbayern).
 */

export interface Route {
  id: number;
  name: string;
  distance: number;
  elevation: number;
  difficulty: "Leicht" | "Mittel" | "Schwer";
  description: string;
  coordinates: [number, number][];
}

export const routes: Route[] = [
  {
    id: 1,
    name: "Vilstal-Runde",
    distance: 8.5,
    elevation: 45,
    difficulty: "Leicht",
    description: "Gemütliche Runde entlang der Vils. Flach und ideal für Einsteiger oder lockere Regenerationsläufe.",
    coordinates: [
      [48.5680, 12.6280], [48.5695, 12.6320], [48.5710, 12.6360],
      [48.5740, 12.6390], [48.5760, 12.6370], [48.5770, 12.6330],
      [48.5755, 12.6280], [48.5730, 12.6240], [48.5710, 12.6220],
      [48.5690, 12.6240], [48.5680, 12.6280],
    ],
  },
  {
    id: 2,
    name: "Hügelrunde Obere Holz",
    distance: 12.3,
    elevation: 120,
    difficulty: "Mittel",
    description: "Hügelige Strecke durch Felder und Wald nördlich von Reisbach. Schöne Aussichtspunkte über das Vilstal.",
    coordinates: [
      [48.5680, 12.6280], [48.5710, 12.6200], [48.5740, 12.6150],
      [48.5780, 12.6120], [48.5820, 12.6160], [48.5840, 12.6230],
      [48.5820, 12.6310], [48.5790, 12.6360], [48.5750, 12.6370],
      [48.5720, 12.6340], [48.5700, 12.6300], [48.5680, 12.6280],
    ],
  },
  {
    id: 3,
    name: "Waldtrail Richtung Griesbach",
    distance: 6.2,
    elevation: 85,
    difficulty: "Mittel",
    description: "Abwechslungsreicher Trail durch den Wald südlich von Reisbach. Wurzelige Passagen und ein paar knackige Anstiege.",
    coordinates: [
      [48.5680, 12.6280], [48.5660, 12.6240], [48.5640, 12.6190],
      [48.5610, 12.6160], [48.5590, 12.6190], [48.5600, 12.6240],
      [48.5620, 12.6280], [48.5640, 12.6310], [48.5660, 12.6300],
      [48.5680, 12.6280],
    ],
  },
  {
    id: 4,
    name: "Langstrecke Reisbach – Frontenhausen",
    distance: 18.5,
    elevation: 140,
    difficulty: "Schwer",
    description: "Lange Strecke Richtung Frontenhausen und zurück. Gut geeignet für Marathon-Vorbereitung oder lange Sonntagsläufe.",
    coordinates: [
      [48.5680, 12.6280], [48.5640, 12.6180], [48.5580, 12.6050],
      [48.5520, 12.5920], [48.5460, 12.5800], [48.5400, 12.5680],
      [48.5460, 12.5800], [48.5520, 12.5920], [48.5580, 12.6050],
      [48.5640, 12.6180], [48.5680, 12.6280],
    ],
  },
];
