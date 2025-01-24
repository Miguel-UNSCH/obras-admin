/* eslint-disable @typescript-eslint/prefer-as-const */
"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { NavigationControl, Source, Layer } from "react-map-gl";
import { Feature, Polygon, LineString } from "geojson";
import { useState } from "react";
import { Button } from "../buttons/button";
import { FaPencilRuler } from "react-icons/fa";
import MapsUpdate from "./maps-update";
import calculateHalfwayPoint from "@/utils/midPoint";

interface obra {
  id: string;
  state: string;
  projectType: string;
  points: [number, number][];
}

function CustomMap({ obra }: { obra: obra }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const typeObra = obra.projectType === "Superficie" ? "Polygon" : "LineString";

  const [styleLoaded, setStyleLoaded] = useState(false);

  const [Nodal, setNodal] = useState(false);

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

  const handleStyleLoad = () => {
    setStyleLoaded(true);
  };

  const handNodal = () => {
    setNodal(true);
  };

  return (
    <div className="relative w-full h-full">
      {obra.state === "Ejecucion" && (
        <Button
          className="absolute bg-green-600 hover:bg-green-500 top-4 right-4 z-10"
          onClick={handNodal}
        >
          <FaPencilRuler />
          Modificar
        </Button>
      )}

      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude: centroid.longitude,
          latitude: centroid.latitude,
          zoom: 15,
        }}
        attributionControl={false}
        onLoad={handleStyleLoad}
        mapStyle={"mapbox://styles/mapbox/standard"}
      >
        {styleLoaded && (
          <>
            <NavigationControl
              position="bottom-right"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "10px",
                gap: "10px",
                borderRadius: "15px",
              }}
            />
            <Source id="polygon-source" type="geojson" data={geoJsonData}>
              <Layer {...layerConfig} />
            </Source>
          </>
        )}
      </Map>
      {Nodal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <MapsUpdate obra={obra} coordinates={centroid} setNodal={setNodal} />
        </div>
      )}
    </div>
  );
}

export default CustomMap;
