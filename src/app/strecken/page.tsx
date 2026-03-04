"use client";

import dynamic from "next/dynamic";
import { Map as MapIcon, Mountain, Ruler, ArrowUpDown } from "lucide-react";
import { mockRoutes } from "@/lib/mock-data";
import { useState } from "react";

// Leaflet muss client-side geladne werden
const RouteMap = dynamic(() => import("@/components/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-stone-100 rounded-2xl flex items-center justify-center text-text-muted">
      <MapIcon className="w-8 h-8 animate-pulse" />
    </div>
  ),
});

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    Leicht: "bg-green-100 text-green-700",
    Mittel: "bg-yellow-100 text-yellow-700",
    Schwer: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[difficulty as keyof typeof colors]}`}>
      {difficulty}
    </span>
  );
}

export default function StreckenPage() {
  const [selectedRoute, setSelectedRoute] = useState(mockRoutes[0]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MapIcon className="w-8 h-8 text-emerald-600" />
          Strecken & Routen
        </h1>
        <p className="text-text-muted mt-1">
          Unsere beliebtesten Laufstrecken rund um Reisbach
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Sidebar: Route List */}
        <div className="lg:col-span-2 space-y-3">
          {mockRoutes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedRoute.id === route.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-bg-card hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold">{route.name}</h3>
                <DifficultyBadge difficulty={route.difficulty} />
              </div>
              <p className="text-sm text-text-muted mb-3 line-clamp-2">{route.description}</p>
              <div className="flex gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1">
                  <Ruler className="w-3 h-3" /> {route.distance} km
                </span>
                <span className="flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3" /> ↑ {route.elevation} m
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Map & Details */}
        <div className="lg:col-span-3 space-y-4">
          {/* Map */}
          <div className="h-[400px] rounded-2xl overflow-hidden border border-border shadow-md">
            <RouteMap route={selectedRoute} />
          </div>

          {/* Route Detail Card */}
          <div className="bg-bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">{selectedRoute.name}</h2>
              <DifficultyBadge difficulty={selectedRoute.difficulty} />
            </div>
            <p className="text-text-muted mb-4">{selectedRoute.description}</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-stone-50 rounded-xl p-3 text-center">
                <Ruler className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="font-bold text-lg">{selectedRoute.distance} km</div>
                <div className="text-xs text-text-muted">Distanz</div>
              </div>
              <div className="bg-stone-50 rounded-xl p-3 text-center">
                <Mountain className="w-5 h-5 mx-auto mb-1 text-accent" />
                <div className="font-bold text-lg">{selectedRoute.elevation} m</div>
                <div className="text-xs text-text-muted">Höhenmeter</div>
              </div>
              <div className="bg-stone-50 rounded-xl p-3 text-center">
                <ArrowUpDown className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <div className="font-bold text-lg">{selectedRoute.difficulty}</div>
                <div className="text-xs text-text-muted">Schwierigkeit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
