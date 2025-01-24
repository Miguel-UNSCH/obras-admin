/* eslint-disable @typescript-eslint/prefer-as-const */
import { Feature, Polygon, LineString } from "geojson";
import { useState } from "react";
import { FaRoad, FaBuilding } from "react-icons/fa";
import { Marker, Source, Layer } from "react-map-gl";
import calculateHalfwayPoint from "@/utils/midPoint";
import { ObraDetails } from "../details/obraDetails";

interface obra {
  id: string;
  state: string;
  propietario_id: string;
  resident: string;
  projectType: string;
  cui: string;
  name: string;
  areaOrLength: string;
  points: [number, number][];
}

function LocationObras({ obra }: { obra: obra }) {
  
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const typeObra = obra.projectType === "Superficie" ? "Polygon" : "LineString";

  const centroid = calculateHalfwayPoint(obra.points, obra.projectType);

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

  const handleMarkerClick = () => {
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  return (
    <>
      <Marker
        key={`centroid-marker-${obra.cui}`}
        longitude={centroid.longitude}
        latitude={centroid.latitude}
        onClick={handleMarkerClick}
      >
        <div className="relative">
          {obra.projectType === "Superficie" ? (
            <FaBuilding className="text-[#DC2626] text-2xl z-0" />
          ) : obra.projectType === "Carretera" ? (
            <FaRoad className="text-[#f75617] text-2xl z-0" />
          ) : null}
          {showDetails && (
            <ObraDetails obra={obra} onClose={handleCloseDetails} />
          )}
        </div>
      </Marker>

      
      <Source id={`source-${obra.id}`} type="geojson" data={geoJsonData}>
        <Layer {...layerConfig} />
      </Source>
    </>
  );
}

export default LocationObras;
