"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useCallback, useEffect } from "react";
import { Feature, Polygon, LineString } from "geojson";
import Map, {
  NavigationControl,
  Source,
  Layer,
  Marker,
  MapMouseEvent,
} from "react-map-gl";
import ButtonBack from "../buttons/dynamic/icons-back";
import ButtonSave from "../buttons/dynamic/icons-save";
import ButtonClose from "../buttons/dynamic/button-backII";
import Radio from "./option-figura";
import { ActualizarObra } from "@/actions/details-action";
import toasterCustom from "../toaster-custom";
import { TbPointFilled } from "react-icons/tb";
import { ConfirmDialog } from "../dialog/dialog-confirm";
import medidaTotal from "@/utils/measureWork";

interface Obra {
  id: string;
  points: [number, number][];
  projectType: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface obraUpdateProps {
  obra: Obra;
  coordinates: Location;
  setNodal: (value: boolean) => void;
}

function MapsUpdate({ obra, coordinates, setNodal }: obraUpdateProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const [points, setPoints] = useState<[number, number][]>(obra.points);
  const [projectType, setProjectType] = useState<string>(obra.projectType);

  const [polygonData, setPolygonData] = useState<Feature<Polygon> | null>(null);
  const [lineData, setLineData] = useState<Feature<LineString> | null>(null);
  const [showConfirmationModal, SetShowConfirmationModal] = useState(false);

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
  }, [points, projectType, updateGeometryData]);

  const handleMapClick = useCallback((event: MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setPoints((prevPoints) => {
      const newPoints: [number, number][] = [...prevPoints, [lng, lat]];

      if (JSON.stringify(prevPoints) !== JSON.stringify(newPoints)) {
        return newPoints;
      }

      return prevPoints;
    });
  }, []);

  const handleRemoveLastPoint = () => {
    if (points.length > 3) {
      const updatedPoints = points.slice(0, -1);
      setPoints(updatedPoints);
    } else {
      toasterCustom(400, "Debe haber al menos 3 punto.");
    }
  };

  const handleProjectTypeChange = (newType: string) => {
    setProjectType(newType);
  };

  const handleSetShowConfirmationModal = () => {
    SetShowConfirmationModal(true);
  };
  const handleSetShowClosedModal = () => {
    SetShowConfirmationModal(false);
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

  return (
    <div className="relative w-screen h-full p-10 md:p-20">
      <div className="absolute space-y-4 p-10 md:p-20 top-4 left-4 z-10">
        <ButtonBack onClick={handleRemoveLastPoint} />
        <Radio
          projectType={projectType}
          setProjectType={handleProjectTypeChange}
        />
      </div>
      <div className="absolute flex flex-row space-x-2 p-10 md:p-20 top-4 right-4 z-10">
        <ButtonSave onClick={handleSetShowConfirmationModal} />
        <ButtonClose onClick={() => setNodal(false)} />
      </div>
      <Map
        style={{ width: "100%", height: "100%", borderRadius: "20px" }}
        mapboxAccessToken={token}
        initialViewState={{
          longitude: coordinates.longitude,
          latitude: coordinates.latitude,
          zoom: 15,
        }}
        mapStyle={"mapbox://styles/mapbox/satellite-streets-v12"}
        onClick={handleMapClick}
      >
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
              onDrag={(event) => {
                const { lng: newLng, lat: newLat } = event.lngLat;
                setPoints((prevPoints) => {
                  const updatedPoints = [...prevPoints];
                  updatedPoints[index] = [newLng, newLat];
                  return updatedPoints;
                });
              }}
            >
              <TbPointFilled size={20} color={markerColor} />
            </Marker>
          );
        })}

        {projectType === "Superficie" && polygonData && (
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
        {projectType === "Carretera" && lineData && (
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
      </Map>
      <ConfirmDialog
        isOpen={showConfirmationModal}
        onClose={handleSetShowClosedModal}
        onConfirm={handleSaveClick}
        title="¿Estas seguro de desea guardar esta nueva coordenada?"
        description="Los cambios se veran reflejados inmediatamente"
        styleButton="bg-green-600 hover:bg-green-500"
      />
    </div>
  );
}

export default MapsUpdate;
