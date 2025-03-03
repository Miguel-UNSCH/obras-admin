/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useCallback, useEffect } from "react";
import { Marker } from "react-map-gl";
import { Feature, Polygon, LineString } from "geojson";
import { Source, Layer, MapMouseEvent } from "react-map-gl";
import ButtonBack from "@/components/buttons/dynamic/icons-back";
import Radio from "./option-figura";
import { TbPointFilled } from "react-icons/tb";
import MapProvider from "../MapProvider";
import { useMapContext } from "@/context/MapContext";

interface LocationProps {
  latitude: number;
  longitude: number;
}

interface NewCoordinatesProps {
  setPoints: (localPoints: [number, number][]) => void;
  setProjectTypestyle: (projectType: string) => void;
  defaultLocation: LocationProps;
}

// Componente hijo para manejar el renderizado condicional
function MapContent({
  polygonData,
  lineData,
  projectType,
}: {
  polygonData: Feature<Polygon> | null;
  lineData: Feature<LineString> | null;
  projectType: string;
}) {
  const { isMapFullyLoaded } = useMapContext();

  return (
    <>
      {isMapFullyLoaded &&
        projectType === "Superficie" &&
        polygonData?.geometry?.coordinates && (
          <Source id="polygon-source" type="geojson" data={polygonData}>
            <Layer
              id="polygon-layer"
              type="fill"
              paint={{
                "fill-color": "#CA3938",
                "fill-opacity": 0.5,
              }}
            />
          </Source>
        )}

      {isMapFullyLoaded &&
        projectType === "Carretera" &&
        lineData?.geometry?.coordinates && (
          <Source id="line-source" type="geojson" data={lineData}>
            <Layer
              id="line-layer"
              type="line"
              paint={{
                "line-color": "#F7700A",
                "line-width": 5,
              }}
            />
          </Source>
        )}
    </>
  );
}

function NewCoordinates({
  setPoints,
  setProjectTypestyle,
  defaultLocation,
}: NewCoordinatesProps) {
  const [newPoints, setNewPoints] = useState<[number, number][]>([]);
  const [projectType, setProjectType] = useState<string>("Superficie");
  const [polygonData, setPolygonData] = useState<Feature<Polygon> | null>(null);
  const [lineData, setLineData] = useState<Feature<LineString> | null>(null);

  const createPolygon = (points: [number, number][]): Feature<Polygon> => ({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [points.concat([points[0]])],
    },
    properties: {},
  });

  const createLine = (points: [number, number][]): Feature<LineString> => ({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: points,
    },
    properties: {},
  });

  const updateGeometryData = useCallback(
    (points: [number, number][]) => {
      if (projectType === "Superficie" && points.length >= 3) {
        setPolygonData(createPolygon(points));
        setLineData(null);
      } else if (projectType === "Carretera" && points.length >= 2) {
        setLineData(createLine(points));
        setPolygonData(null);
      } else {
        setPolygonData(null);
        setLineData(null);
      }
    },
    [projectType]
  );

  const handleMapClick = useCallback((event: MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setNewPoints((prevPoints: [number, number][]) => {
      // Tipamos prevPoints explícitamente
      const newPoints: [number, number][] = [...prevPoints, [lng, lat]];
      return newPoints;
    });
  }, []);

  useEffect(() => {
    updateGeometryData(newPoints);
    setPoints(newPoints);
    setProjectTypestyle(projectType);
  }, [newPoints, projectType]);

  const handleRemoveLastPoint = () => {
    setNewPoints((prevPoints: [number, number][]) => prevPoints.slice(0, -1)); // Tipamos prevPoints
  };

  const handleProjectTypeChange = (newType: string) => {
    setProjectType(newType);
  };

  const handleDrag = useCallback(
    (event: { lngLat: { lng: number; lat: number } }, index: number) => {
      const { lng: newLng, lat: newLat } = event.lngLat;
      setNewPoints((prevPoints: [number, number][]) => {
        // Tipamos prevPoints explícitamente
        const updatedPoints = [...prevPoints];
        updatedPoints[index] = [newLng, newLat];
        return updatedPoints;
      });
    },
    []
  );

  return (
    <div className="relative w-full h-full">
      <MapProvider
        defaultLocation={defaultLocation}
        mapStyle="mapbox://styles/mapbox/standard"
        enableTerrain={false}
        onClick={handleMapClick}
      >
        <div className="absolute top-4 left-4 z-10">
          <ButtonBack onClick={handleRemoveLastPoint} />
        </div>

        <div className="absolute top-4 right-4 z-10">
          <Radio
            projectType={projectType}
            setProjectType={handleProjectTypeChange}
          />
        </div>

        {newPoints.map(([lng, lat], index) => {
          let markerColor = "#FF0000";
          if (index === 0) markerColor = "#111114";
          else if (index === newPoints.length - 1) markerColor = "#FEE227";

          return (
            <Marker
              key={index}
              longitude={lng}
              latitude={lat}
              draggable
              onDrag={(event) => handleDrag(event, index)}
            >
              <TbPointFilled size={20} color={markerColor} />
            </Marker>
          );
        })}

        <MapContent
          polygonData={polygonData}
          lineData={lineData}
          projectType={projectType}
        />
      </MapProvider>
    </div>
  );
}

export default NewCoordinates;
