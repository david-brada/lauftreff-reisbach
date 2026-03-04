/**
 * Lokale Strecken-Daten für den Lauftreff Reisbach.
 * Reisbach, 66793 Saarwellingen, Landkreis Saarlouis, Saarland.
 * Zentrum: ca. 49.3601°N, 6.8721°E
 * 
 * Diese Routen werden manuell gepflegt.
 * Für Änderungen: /admin → Strecken verwalten
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
    name: "Dorfrunde Reisbach",
    distance: 5.0,
    elevation: 40,
    difficulty: "Leicht",
    description: "Gemütliche Runde durch und um Reisbach. Flach und ideal für Einsteiger oder lockere Regenerationsläufe.",
    coordinates: [
      [49.3601, 6.8721], [49.3615, 6.8760], [49.3635, 6.8790],
      [49.3650, 6.8770], [49.3660, 6.8730], [49.3650, 6.8690],
      [49.3630, 6.8660], [49.3610, 6.8680], [49.3601, 6.8721],
    ],
  },
  {
    id: 2,
    name: "Reisbach – Saarwellingen Runde",
    distance: 8.5,
    elevation: 75,
    difficulty: "Mittel",
    description: "Rundkurs von Reisbach nach Saarwellingen und zurück. Schöne Strecke durch Felder und entlang des Ellbachs.",
    coordinates: [
      [49.3601, 6.8721], [49.3580, 6.8650], [49.3560, 6.8550],
      [49.3540, 6.8400], [49.3530, 6.8200], [49.3527, 6.8063],
      [49.3550, 6.8100], [49.3575, 6.8250], [49.3590, 6.8450],
      [49.3595, 6.8600], [49.3601, 6.8721],
    ],
  },
  {
    id: 3,
    name: "Waldlauf Richtung Schwarzenholz",
    distance: 10.2,
    elevation: 110,
    difficulty: "Mittel",
    description: "Abwechslungsreiche Strecke durch den Wald Richtung Schwarzenholz. Hügelig mit schönen Waldwegen.",
    coordinates: [
      [49.3601, 6.8721], [49.3620, 6.8800], [49.3650, 6.8870],
      [49.3680, 6.8920], [49.3710, 6.8950], [49.3740, 6.8900],
      [49.3720, 6.8830], [49.3690, 6.8780], [49.3660, 6.8750],
      [49.3630, 6.8730], [49.3601, 6.8721],
    ],
  },
];
