/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-as-const */
import { Feature, Polygon, LineString } from "geojson";
import MapProvider, { MarkerData } from "../MapProvider";
import MarkerOverlay from "../MarkerOverlay";
import { Layer, Source } from "react-map-gl";
import { useMapContext } from "@/context/MapContext";

interface LocationObra {
  projectType: string;
  points: [number, number][];
}

interface MapLocationDetailsProps {
  longitude: number;
  latitude: number;
  coordinates: LocationObra;
}

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

export default function MapLocationPhoto({
  longitude,
  latitude,
  coordinates,
}: MapLocationDetailsProps) {
  const typeObra =
    coordinates?.projectType === "Superficie" ? "Polygon" : "LineString";

  const layerConfig =
    typeObra === "Polygon"
      ? {
          id: `polygon-layer`,
          type: "fill" as "fill",
          paint: {
            "fill-color": "#088ff5",
            "fill-opacity": 0.5,
            "fill-outline-color": "#000000",
          },
        }
      : {
          id: `line-layer`,
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
            coordinates: [coordinates.points],
          },
        }
      : {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates.points,
          },
        };

  const markers: MarkerData[] = [
    {
      id: "Photo-obra-marker",
      obraType: "Point",
      latitude,
      longitude,
    },
  ];

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapProvider
        defaultLocation={{
          latitude: latitude,
          longitude: longitude,
        }}
        markers={markers}
        mapStyle={"mapbox://styles/mapbox/standard"}
        enableTerrain={false}
      >
        <MarkerOverlay markers={markers} />
        <MapContent geoJsonData={geoJsonData} layerConfig={layerConfig} />
      </MapProvider>
    </div>
  );
}
