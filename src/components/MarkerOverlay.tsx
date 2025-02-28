import React, { useEffect, useState } from "react";
import { useMapContext } from "@/context/MapContext"; // Usa el hook en vez de useContext
import { MarkerData } from "./MapProvider";

interface MarkerOverlayProps {
  markers: MarkerData[];
}

export default function MarkerOverlay({ markers }: MarkerOverlayProps) {
  const { map, viewState } = useMapContext(); // 🔹 Garantiza que map y viewState existan
  const [markerPositions, setMarkerPositions] = useState<
    { id: string; x: number; y: number; obraType: string }[]
  >([]);

  // Recalcula la posición en píxeles para cada marker usando map.project
  useEffect(() => {
    if (map && markers.length > 0) {
      const positions = markers.map((marker) => {
        const pos = map.project([marker.longitude, marker.latitude]);
        return { id: marker.id, x: pos.x, y: pos.y, obraType: marker.obraType };
      });
      setMarkerPositions(positions);
    }
  }, [map, viewState, markers]);

  return (
    <>
      {markerPositions.map((pos) => (
        <div
          key={pos.id}
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            transform: "translate(-50%, -50%)",
            zIndex: 100000,
            pointerEvents: "none",
          }}
        ></div>
      ))}
    </>
  );
}
