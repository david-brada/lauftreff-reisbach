"use client";

import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

interface RouteMapProps {
  route: {
    id: number;
    name: string;
    coordinates: [number, number][];
  };
}

function FitBounds({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = coordinates.map(([lat, lng]) => [lat, lng] as [number, number]);
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [coordinates, map]);

  return null;
}

export default function RouteMap({ route }: RouteMapProps) {
  const center = route.coordinates[0] || [48.568, 12.628];

  return (
    <MapContainer
      center={center}
      zoom={14}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline
        positions={route.coordinates}
        pathOptions={{
          color: "#16a34a",
          weight: 4,
          opacity: 0.8,
        }}
      />
      <FitBounds coordinates={route.coordinates} />
    </MapContainer>
  );
}
