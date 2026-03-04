-- ============================================================
-- Lauftreff Reisbach: Config-Tabelle für Admin-Daten
-- (Routen, Challenges, Einstellungen)
-- ============================================================

CREATE TABLE IF NOT EXISTS lauftreff_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Lesen und Schreiben für alle (Auth läuft über API-Passwort)
ALTER TABLE lauftreff_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON lauftreff_config
  FOR ALL USING (true) WITH CHECK (true);

-- Default-Daten einfügen
INSERT INTO lauftreff_config (key, value) VALUES
  ('routes', '[]'::jsonb),
  ('challenges', '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;
