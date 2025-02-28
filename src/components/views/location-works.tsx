/* eslint-disable @typescript-eslint/prefer-as-const */
import { Feature, Polygon, LineString } from "geojson";

import { Source, Layer } from "react-map-gl";

interface obra {
  id: string;
  state: string;
  propietario_id: string;
  resident: string;
  projectType: string;
  obraType: string;
  cui: string;
  name: string;
  areaOrLength: string;
  points: [number, number][];
}

function LocationObras({ obra }: { obra: obra }) {
  const typeObra = obra.projectType === "Superficie" ? "Polygon" : "LineString";

  const layerConfig =
    typeObra === "Polygon"
      ? {
          id: `polygon-layer-${obra.id}`,
          type: "fill" as "fill",
          paint: {
            "fill-color": "#088ff5",
            "fill-opacity": 0.5,
            "fill-outline-color": "#000000",
          },
        }
      : {
          id: `line-layer-${obra.id}`,
          type: "line" as "line",
          paint: {
            "line-color": "#14437F",
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

  return (
    <>
      <Source id={`source-${obra.id}`} type="geojson" data={geoJsonData}>
        <Layer {...layerConfig} />
      </Source>
    </>
  );
}

export default LocationObras;
