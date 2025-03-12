"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useCallback, useEffect } from "react";
import { Marker, MapMouseEvent } from "react-map-gl";
import { Feature, Polygon, LineString } from "geojson";
import { Source, Layer } from "react-map-gl";
import ButtonBack from "@/components/buttons/dynamic/icons-back";
import Radio from "../views/option-figura";
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
  points: [number, number][];
}

function MapContent({
  polygonData,
  lineData,
}: {
  polygonData: Feature<Polygon> | null;
  lineData: Feature<LineString> | null;
}) {
  const { isMapFullyLoaded } = useMapContext();

  return (
    <>
      {isMapFullyLoaded && polygonData?.geometry?.coordinates && (
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
      {isMapFullyLoaded && lineData?.geometry?.coordinates && (
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

export default function MapNewCoordinates({
  setPoints,
  setProjectTypestyle,
  defaultLocation,
  points,
}: NewCoordinatesProps) {
  const [newPoints, setNewPoints] = useState<[number, number][]>([]);
  const [projectType, setProjectType] = useState<string>("Superficie");
  const [polygonData, setPolygonData] = useState<Feature<Polygon> | null>(null);
  const [lineData, setLineData] = useState<Feature<LineString> | null>(null);

  const createPolygon = useCallback((points: [number, number][]): Feature<Polygon> => ({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [points.concat([points[0]])],
    },
    properties: {},
  }), []);

  const createLine = useCallback((points: [number, number][]): Feature<LineString> => ({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: points,
    },
    properties: {},
  }), []);

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
    [projectType, createPolygon, createLine]
  );

  const handleMapClick = useCallback((event: MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setNewPoints((prevPoints: [number, number][]) => {
      const newPoint: [number, number] = [lng, lat];
      return [...prevPoints, newPoint];
    });
  }, []);

  const handleRemoveLastPoint = useCallback(() => {
    setNewPoints((prevPoints: [number, number][]) => {
      return prevPoints.slice(0, -1);
    });
  }, []);

  const handleProjectTypeChange = useCallback((newType: string) => {
    setProjectType(newType);
    setProjectTypestyle(newType);
  }, [setProjectTypestyle]);

  const handleDrag = useCallback(
    (event: { lngLat: { lng: number; lat: number } }, index: number) => {
      const { lng: newLng, lat: newLat } = event.lngLat;
      setNewPoints((prevPoints: [number, number][]) => {
        const updatedPoints = [...prevPoints];
        updatedPoints[index] = [newLng, newLat] as [number, number];
        return updatedPoints;
      });
    },
    []
  );

  useEffect(() => {
    updateGeometryData(newPoints);
    setPoints(newPoints);
  }, [newPoints, updateGeometryData, setPoints]);

  useEffect(() => {
    if (points.length === 0 && newPoints.length > 0) {
      setNewPoints([]);
      setPolygonData(null);
      setLineData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);
  

  return (
    <div className="relative w-full h-full">
      <MapProvider
        defaultLocation={defaultLocation}
        enableTerrain={false}
        mapStyle="mapbox://styles/mapbox/standard"
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

        <MapContent polygonData={polygonData} lineData={lineData} />
      </MapProvider>
    </div>
  );
}
