/* eslint-disable @typescript-eslint/prefer-as-const */
import { Feature, Polygon, LineString } from "geojson";
import Map, { NavigationControl, Marker, Source, Layer } from "react-map-gl";
import { TbPointFilled } from "react-icons/tb";

interface LocationObra {
  projectType: string;
  points: [number, number][];
}

interface MapLocationDetailsProps {
  longitude: number;
  latitude: number;
  coordinates: LocationObra | null;
}

function MapLocationDeatils({
  longitude,
  latitude,
  coordinates,
}: MapLocationDetailsProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const hasCoordinates = coordinates && coordinates.points.length > 0;

  const typeObra = hasCoordinates
    ? coordinates.projectType === "Superficie"
      ? "Polygon"
      : "LineString"
    : null;

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

  const geoJsonData: Feature<Polygon | LineString> | null = hasCoordinates
    ? typeObra === "Polygon"
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
        }
    : null;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude,
          latitude,
          zoom: 15,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={"mapbox://styles/mapbox/satellite-streets-v12"}
      >
        <NavigationControl
          position="bottom-right"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "5px",
            gap: "5px",
            borderRadius: "10px",
          }}
        />

        <Marker longitude={longitude} latitude={latitude}>
          <TbPointFilled size={24} color="#FF0000" />
        </Marker>

        {geoJsonData && (
          <Source id="source" type="geojson" data={geoJsonData}>
            <Layer {...layerConfig} />
          </Source>
        )}
      </Map>
    </div>
  );
}

export default MapLocationDeatils;
