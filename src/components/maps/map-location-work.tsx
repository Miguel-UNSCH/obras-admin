/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-as-const */
"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { Feature, Polygon, LineString } from "geojson";
import { useState } from "react";
import { Button } from "../buttons/button";
import { FaPencilRuler } from "react-icons/fa";
import MapsUpdate from "./maps-update";
import calculateHalfwayPoint from "@/utils/midPoint";
import MapProvider from "../MapProvider";
import { Source, Layer } from "react-map-gl";
import { useMapContext } from "@/context/MapContext";

interface Obra {
  id: string;
  state: string;
  projectType: string;
  points: [number, number][];
}

// Componente hijo para manejar el renderizado condicional
function MapContent({
  geoJsonData,
  layerConfig,
}: {
  geoJsonData: Feature<Polygon | LineString>;
  layerConfig: any;
}) {
  const { isMapFullyLoaded } = useMapContext();

  return (
    <>
      {isMapFullyLoaded && (
        <Source id="obra-source" type="geojson" data={geoJsonData}>
          <Layer {...layerConfig} />
        </Source>
      )}
    </>
  );
}

export default function MapLocationWork({ obra }: { obra: Obra }) {
  const typeObra = obra.projectType === "Superficie" ? "Polygon" : "LineString";
  const [nodal, setNodal] = useState(false);
  const centroid = calculateHalfwayPoint(obra.points, obra.projectType);

  const layerConfig =
    typeObra === "Polygon"
      ? {
          id: `polygon-layer-${obra.id}`,
          type: "fill" as "fill",
          paint: {
            "fill-color": "#E27373",
            "fill-opacity": 0.5,
            "fill-outline-color": "#FF0000",
          },
        }
      : {
          id: `line-layer-${obra.id}`,
          type: "line" as "line",
          paint: {
            "line-color": "#FF0000",
            "line-width": 5,
          },
        };

  const geoJsonData: Feature<Polygon | LineString> =
    typeObra === "Polygon"
      ? {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [obra.points],
          },
        }
      : {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: obra.points,
          },
        };

  const handNodal = () => {
    setNodal(true);
  };

  return (
    <div className="relative w-full h-full">
      <MapProvider defaultLocation={centroid} enableTerrain={false} mapStyle="mapbox://styles/mapbox/standard">
        {obra.state === "Ejecucion" && (
          <Button
            className="absolute bg-green-600 hover:bg-green-500 top-4 right-4 z-10"
            onClick={handNodal}
          >
            <FaPencilRuler />
            Modificar
          </Button>
        )}

        <MapContent geoJsonData={geoJsonData} layerConfig={layerConfig} />
      </MapProvider>
      {nodal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <MapsUpdate obra={obra} coordinates={centroid} setNodal={setNodal} />
        </div>
      )}
    </div>
  );
}
