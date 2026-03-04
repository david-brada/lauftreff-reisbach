"use client";

import { useState, useEffect } from "react";
import { Shield, MapPin, Target, Plus, Trash2, Save, LogOut, Edit } from "lucide-react";

interface RouteData {
  id: number;
  name: string;
  distance: number;
  elevation: number;
  difficulty: "Leicht" | "Mittel" | "Schwer";
  description: string;
  coordinates: [number, number][];
}

interface ChallengeData {
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

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"routes" | "challenges">("routes");
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Check if already authed
  useEffect(() => {
    fetch("/api/admin/data?key=routes").then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setRoutes(data);
        }
      }
    });
    fetch("/api/admin/data?key=challenges").then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setChallenges(data);
        }
      }
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setLoginError("Falsches Passwort");
    }
  }

  async function saveData(key: string, value: unknown) {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        setMessage(`${key === "routes" ? "Strecken" : "Challenges"} gespeichert!`);
        setTimeout(() => setMessage(""), 3000);
      } else {
        const data = await res.json();
        setMessage(`Fehler: ${data.error}`);
      }
    } catch {
      setMessage("Netzwerkfehler");
    }
    setSaving(false);
  }

  // --- Route Helpers ---
  function addRoute() {
    setRoutes([...routes, {
      id: Date.now(),
      name: "",
      distance: 0,
      elevation: 0,
      difficulty: "Leicht",
      description: "",
      coordinates: [],
    }]);
  }

  function updateRoute(index: number, field: string, value: unknown) {
    const updated = [...routes];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[index] as any)[field] = value;
    setRoutes(updated);
  }

  function removeRoute(index: number) {
    setRoutes(routes.filter((_, i) => i !== index));
  }

  // --- Challenge Helpers ---
  function addChallenge() {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setChallenges([...challenges, {
      id: Date.now(),
      title: "",
      description: "",
      target: 100,
      unit: "km",
      icon: "🎯",
      endDate: endOfMonth.toISOString().split("T")[0],
      type: "km",
    }]);
  }

  function updateChallenge(index: number, field: string, value: unknown) {
    const updated = [...challenges];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[index] as any)[field] = value;
    setChallenges(updated);
  }

  function removeChallenge(index: number) {
    setChallenges(challenges.filter((_, i) => i !== index));
  }

  // --- Login Screen ---
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm border border-stone-200">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-xl font-bold">Admin-Bereich</h1>
            <p className="text-sm text-stone-500">Lauftreff Reisbach</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {loginError && <p className="text-red-500 text-sm mb-3">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Anmelden
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Admin Dashboard ---
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Admin-Dashboard
            </h1>
            <p className="text-sm text-stone-500">Strecken & Challenges verwalten</p>
          </div>
          <button
            onClick={() => { setAuthed(false); setPassword(""); }}
            className="flex items-center gap-1 text-sm text-stone-500 hover:text-red-500"
          >
            <LogOut className="w-4 h-4" /> Abmelden
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${
            message.startsWith("Fehler") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("routes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
              tab === "routes" ? "bg-primary text-white" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <MapPin className="w-4 h-4" /> Strecken
          </button>
          <button
            onClick={() => setTab("challenges")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
              tab === "challenges" ? "bg-primary text-white" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Target className="w-4 h-4" /> Challenges
          </button>
        </div>

        {/* Routes Tab */}
        {tab === "routes" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Strecken ({routes.length})</h2>
              <div className="flex gap-2">
                <button onClick={addRoute} className="flex items-center gap-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm hover:bg-stone-50">
                  <Plus className="w-4 h-4" /> Neue Strecke
                </button>
                <button
                  onClick={() => saveData("routes", routes)}
                  disabled={saving}
                  className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? "Speichert..." : "Speichern"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {routes.map((route, i) => (
                <div key={route.id} className="bg-white rounded-xl border border-stone-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-stone-400">Strecke #{i + 1}</span>
                    <button onClick={() => removeRoute(i)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-stone-500">Name</label>
                      <input
                        value={route.name}
                        onChange={(e) => updateRoute(i, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="z.B. Waldlauf Reisbach"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-500">Schwierigkeit</label>
                      <select
                        value={route.difficulty}
                        onChange={(e) => updateRoute(i, "difficulty", e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option>Leicht</option>
                        <option>Mittel</option>
                        <option>Schwer</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-500">Distanz (km)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={route.distance}
                        onChange={(e) => updateRoute(i, "distance", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-500">Höhenmeter (m)</label>
                      <input
                        type="number"
                        value={route.elevation}
                        onChange={(e) => updateRoute(i, "elevation", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-stone-500">Beschreibung</label>
                      <textarea
                        value={route.description}
                        onChange={(e) => updateRoute(i, "description", e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Beschreibung der Strecke..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-stone-500">
                        Koordinaten (JSON Array von [lat, lng] Paaren)
                      </label>
                      <textarea
                        value={JSON.stringify(route.coordinates)}
                        onChange={(e) => {
                          try {
                            const coords = JSON.parse(e.target.value);
                            updateRoute(i, "coordinates", coords);
                          } catch { /* ignore parse errors while typing */ }
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="[[49.3601, 6.8721], [49.3615, 6.876], ...]"
                      />
                      <p className="text-xs text-stone-400 mt-1">
                        Tipp: Nutze Google Maps, rechtsklick → Koordinaten kopieren. Format: [[lat,lng], [lat,lng], ...]
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {routes.length === 0 && (
                <div className="bg-white rounded-xl border border-dashed border-stone-300 p-8 text-center">
                  <MapPin className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-stone-500">Noch keine Strecken. Klicke &quot;Neue Strecke&quot; um zu beginnen.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {tab === "challenges" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Challenges ({challenges.length})</h2>
              <div className="flex gap-2">
                <button onClick={addChallenge} className="flex items-center gap-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm hover:bg-stone-50">
                  <Plus className="w-4 h-4" /> Neue Challenge
                </button>
                <button
                  onClick={() => saveData("challenges", challenges)}
                  disabled={saving}
                  className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? "Speichert..." : "Speichern"}
                </button>
              </div>
            </div>

            <p className="text-sm text-stone-500 mb-4 bg-blue-50 p-3 rounded-xl">
              💡 Challenges vom Typ &quot;km&quot;, &quot;Höhenmeter&quot; oder &quot;Läufe&quot; ziehen den Fortschritt automatisch aus Strava.
              Beim Typ &quot;Benutzerdefiniert&quot; trägst du den Fortschritt manuell ein.
            </p>

            <div className="space-y-4">
              {challenges.map((challenge, i) => (
                <div key={challenge.id} className="bg-white rounded-xl border border-stone-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-stone-400">Challenge #{i + 1}</span>
                    <button onClick={() => removeChallenge(i)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-stone-500">Titel</label>
                      <input
                        value={challenge.title}
                        onChange={(e) => updateChallenge(i, "title", e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="z.B. März-Challenge: 100 km"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-500">Icon (Emoji)</label>
                      <input
                        value={challenge.icon}
                        onChange={(e) => updateChallenge(i, "icon", e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="🎯"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-stone-500">Beschreibung</label>
                      <textarea
                        value={challenge.description}
                        onChange={(e) => updateChallenge(i, "description", e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Challenge-Beschreibung..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-500">Typ (Auto-Tracking)</label>
                      <select
                        value={challenge.type}
                        onChange={(e) => updateChallenge(i, "type", e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="km">Kilometer (auto von Strava)</option>
                        <option value="elevation">Höhenmeter (auto von Strava)</option>
                        <option value="runs">Anzahl Läufe (auto von Strava)</option>
                        <option value="custom">Benutzerdefiniert (manuell)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-500">Ziel</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={challenge.target}
                          onChange={(e) => updateChallenge(i, "target", parseInt(e.target.value) || 0)}
                          className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          value={challenge.unit}
                          onChange={(e) => updateChallenge(i, "unit", e.target.value)}
                          className="w-20 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="km"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-500">Enddatum</label>
                      <input
                        type="date"
                        value={challenge.endDate}
                        onChange={(e) => updateChallenge(i, "endDate", e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    {challenge.type === "custom" && (
                      <div>
                        <label className="text-xs font-medium text-stone-500">Aktueller Fortschritt</label>
                        <input
                          type="number"
                          value={challenge.customCurrent || 0}
                          onChange={(e) => updateChallenge(i, "customCurrent", parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {challenges.length === 0 && (
                <div className="bg-white rounded-xl border border-dashed border-stone-300 p-8 text-center">
                  <Target className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-stone-500">Noch keine Challenges. Klicke &quot;Neue Challenge&quot; um zu beginnen.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
