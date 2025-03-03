"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useCallback, useEffect } from "react";
import { Feature, Polygon, LineString } from "geojson";
import { Source, Layer, Marker, MapMouseEvent } from "react-map-gl";
import ButtonBack from "../buttons/dynamic/icons-back";
import ButtonSave from "../buttons/dynamic/icons-save";
import ButtonClose from "../buttons/dynamic/button-backII";
import Radio from "./option-figura";
import { ActualizarObra } from "@/actions/details-action";
import toasterCustom from "../toaster-custom";
import { TbPointFilled } from "react-icons/tb";
import { ConfirmDialog } from "../dialog/dialog-confirm";
import medidaTotal from "@/utils/measureWork";
import { useMapContext } from "@/context/MapContext";
import MapProvider from "../MapProvider";

interface Obra {
  id: string;
  points: [number, number][];
  projectType: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface ObraUpdateProps {
  obra: Obra;
  coordinates: Location;
  setNodal: (value: boolean) => void;
}

// Componente hijo para manejar el renderizado condicional de las capas
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
      {isMapFullyLoaded && projectType === "Superficie" && polygonData && (
        <Source id="polygon-source-update" type="geojson" data={polygonData}>
          <Layer
            id="polygon-layer-update"
            type="fill"
            paint={{
              "fill-color": "#CA3938",
              "fill-opacity": 0.5,
            }}
          />
        </Source>
      )}
      {isMapFullyLoaded && projectType === "Carretera" && lineData && (
        <Source id="line-source-update" type="geojson" data={lineData}>
          <Layer
            id="line-layer-update"
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

function MapsUpdate({ obra, coordinates, setNodal }: ObraUpdateProps) {
  const [points, setPoints] = useState<[number, number][]>(obra.points);
  const [projectType, setProjectType] = useState<string>(obra.projectType);
  const [polygonData, setPolygonData] = useState<Feature<Polygon> | null>(null);
  const [lineData, setLineData] = useState<Feature<LineString> | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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
      if (points.length < (projectType === "Superficie" ? 3 : 2)) {
        toasterCustom(
          400,
          `Se requieren al menos ${
            projectType === "Superficie" ? 3 : 2
          } puntos.`
        );
        return;
      }

      if (projectType === "Superficie") {
        setPolygonData(createPolygon(points));
        setLineData(null);
      } else if (projectType === "Carretera") {
        setLineData(createLine(points));
        setPolygonData(null);
      }
    },
    [projectType]
  );

  useEffect(() => {
    updateGeometryData(points);
  }, [updateGeometryData, points, projectType]);

  const handleMapClick = useCallback((event: MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setPoints((prevPoints) => {
      const newPoints: [number, number][] = [...prevPoints, [lng, lat]];
      return newPoints;
    });
  }, []);

  const handleRemoveLastPoint = () => {
    if (points.length > 3) {
      const updatedPoints = points.slice(0, -1);
      setPoints(updatedPoints);
    } else {
      toasterCustom(400, "Debe haber al menos 3 puntos.");
    }
  };

  const handleProjectTypeChange = (newType: string) => {
    setProjectType(newType);
  };

  const handleSetShowConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleSetShowClosedModal = () => {
    setShowConfirmationModal(false);
  };

  const handleSaveClick = async () => {
    try {
      const areaOrLength = medidaTotal(points, projectType);
      const data = await ActualizarObra(
        obra.id,
        points,
        projectType,
        areaOrLength
      );
      toasterCustom(data.status, data.message);

      if (data.status === 200) {
        setNodal(false);
        window.location.reload();
      }
    } catch {
      toasterCustom(500, "Error al guardar los datos.");
    }
  };

  const handleDrag = useCallback(
    (event: { lngLat: { lng: number; lat: number } }, index: number) => {
      const { lng, lat } = event.lngLat;
      setPoints((prevPoints: [number, number][]) => {
        const updatedPoints = [...prevPoints];
        updatedPoints[index] = [lng, lat];
        return updatedPoints;
      });
    },
    [setPoints]
  );

  return (
    <div className="relative w-full h-full p-10 md:p-20">
      <MapProvider
        defaultLocation={coordinates}
        enableTerrain={false}
        mapStyle="mapbox://styles/mapbox/standard"
        onClick={handleMapClick}
      >
        <div className="absolute space-y-4 p-4 top-0 left-0 z-10">
          <ButtonBack onClick={handleRemoveLastPoint} />
          <Radio
            projectType={projectType}
            setProjectType={handleProjectTypeChange}
          />
        </div>
        <div className="absolute flex flex-row space-x-2 p-4 top-0 right-0 z-10">
          <ButtonSave onClick={handleSetShowConfirmationModal} />
          <ButtonClose onClick={() => setNodal(false)} />
        </div>

        {points.map(([lng, lat], index) => {
          let markerColor = "#FF0000";
          if (index === 0) {
            markerColor = "#111114";
          } else if (index === points.length - 1) {
            markerColor = "#FEE227";
          }

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

      <ConfirmDialog
        isOpen={showConfirmationModal}
        onClose={handleSetShowClosedModal}
        onConfirm={handleSaveClick}
        title="¿Estás seguro de guardar esta nueva coordenada?"
        description="Los cambios se verán reflejados inmediatamente"
        styleButton="bg-green-600 hover:bg-green-500"
      />
    </div>
  );
}

export default MapsUpdate;
