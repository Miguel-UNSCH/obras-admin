/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import MapContext from "@/context/MapContext";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import Map, {
  NavigationControl,
  MapRef,
  ViewState,
  MapMouseEvent,
} from "react-map-gl";

import {
  FaRoad,
  FaBuilding,
  FaUniversity,
  FaHospital,
  FaWarehouse,
  FaTree,
  FaIndustry,
  FaWater,
  FaTrain,
  FaShip,
  FaPlane,
  FaLandmark,
  FaGavel,
  FaCloudRain,
  FaStore,
  FaTruckMoving,
  FaTint,
} from "react-icons/fa";
import { FaBridge } from "react-icons/fa6";
import { JSX } from "react/jsx-runtime";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface MarkerData {
  id: string;
  obraType: string;
  latitude: number;
  longitude: number;
}

interface MapProviderProps {
  children?: React.ReactNode;
  defaultLocation: UserLocation;
  markers?: MarkerData[];
  setIdobra?: (id: string) => void;
  enableTerrain?: boolean;
  onClick?: (event: MapMouseEvent) => void;
  mapStyle?: string;
  width?: string;
  height?: string;
  interactive?: boolean;
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
  borderRadius: "15px",
  overflow: "hidden",
};

const navControlStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: "10px",
  gap: "10px",
  borderRadius: "15px",
};

const MapProvider: React.FC<MapProviderProps> = ({
  children,
  defaultLocation,
  markers,
  setIdobra,
  enableTerrain = false,
  onClick,
  mapStyle,
  width = "100%",
  height = "100%",
}) => {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const [viewState, setViewState] = useState<
    Omit<ViewState, "width" | "height">
  >({
    latitude: defaultLocation.latitude,
    longitude: defaultLocation.longitude,
    zoom: 14,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  const [map, setMap] = useState<MapRef | null>(null);
  const [isMapFullyLoaded, setIsMapFullyLoaded] = useState(false);
  const [terrainLoaded, setTerrainLoaded] = useState(false);
  const [markerPositions, setMarkerPositions] = useState<
    { id: string; x: number; y: number; obraType: string }[]
  >([]);

  //Manejador de Carga del Mapa
  const handleMapLoad = useCallback(
    (evt: any) => {
      const mapInstance = evt.target;
      setMap(mapInstance);

      const onStyleLoad = () => {
        setIsMapFullyLoaded(true);
        if (enableTerrain) {
          try {
            if (!mapInstance.getSource("mapbox-dem")) {
              mapInstance.addSource("mapbox-dem", {
                type: "raster-dem",
                url: "mapbox://mapbox.mapbox-terrain-dem-v1",
                tileSize: 512,
                maxzoom: 14,
              });
            }
            if (!mapInstance.getTerrain()) {
              mapInstance.setTerrain({
                source: "mapbox-dem",
                exaggeration: 1.5,
              });
            }
            setTerrainLoaded(true);

            console.log("Terreno configurado exitosamente");
          } catch (error) {
            console.error("Error al configurar el terreno:", error);
          }
        }
      };

      if (mapInstance.isStyleLoaded()) {
        onStyleLoad();
      } else {
        mapInstance.once("style.load", onStyleLoad);
      }
    },
    [enableTerrain]
  );

  //Efecto para Actualizar la Posición
  useEffect(() => {
    if (map) {
      const { latitude, longitude } = defaultLocation;
      if (
        latitude !== viewState.latitude ||
        longitude !== viewState.longitude
      ) {
        map.flyTo({
          center: [longitude, latitude],
          zoom: 17,
          essential: true,
        });
        setViewState((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
      }
    }
  }, [defaultLocation, map]);

  //Manejador de Movimiento
  const handleMove = useCallback((evt: { viewState: ViewState }) => {
    setViewState((prev) => {
      const { latitude, longitude, zoom, bearing, pitch } = evt.viewState;
      if (
        prev.latitude !== latitude ||
        prev.longitude !== longitude ||
        prev.zoom !== zoom ||
        prev.bearing !== bearing ||
        prev.pitch !== pitch
      ) {
        return { ...prev, latitude, longitude, zoom, bearing, pitch };
      }
      return prev;
    });
  }, []);

  //Efecto para Actualizar Marcadores
  useEffect(() => {
    if (map && markers && markers.length > 0) {
      const positions = markers.map((marker) => {
        const pos = map.project([marker.longitude, marker.latitude]);
        return { id: marker.id, x: pos.x, y: pos.y, obraType: marker.obraType };
      });
      setMarkerPositions(positions);
    }
  }, [map, viewState, markers]);

  //Valor del Contexto
  const contextValue = useMemo(
    () => ({ map, viewState, setViewState, isMapFullyLoaded, terrainLoaded }),
    [map, viewState, isMapFullyLoaded, terrainLoaded]
  );

  const getIconByObraType = (obraType: string): JSX.Element => {
    const iconMap: { [key: string]: JSX.Element } = {
      Acueducto: <FaTint className="text-[#9333EA] text-2xl" />,
      Aeropuerto: <FaPlane className="text-[#4C51BF] text-2xl" />,
      Almacen: <FaWarehouse className="text-[#A16207] text-2xl" />,
      Canal: <FaTint className="text-[#F43F5E] text-2xl" />,
      Carretera: <FaRoad className="text-[#f75617] text-2xl" />,
      Clinica: <FaHospital className="text-[#16A34A] text-2xl" />,
      Cultural: <FaLandmark className="text-[#EAB308] text-2xl" />,
      Deposito: <FaBuilding className="text-[#6B7280] text-2xl" />,
      Edificio: <FaBuilding className="text-[#DC2626] text-2xl" />,
      Embalse: <FaWater className="text-[#F97316] text-2xl" />,
      Escuela: <FaUniversity className="text-[#1D4ED8] text-2xl" />,
      Estadio: <FaGavel className="text-[#D97706] text-2xl" />,
      Fabrica: <FaIndustry className="text-[#6B7280] text-2xl" />,
      Ferrocarril: <FaTrain className="text-[#8B5CF6] text-2xl" />,
      Hospital: <FaHospital className="text-[#16A34A] text-2xl" />,
      "Infraestructura sanitaria": (
        <FaTint className="text-[#A21CAF] text-2xl" />
      ),
      Mercado: <FaStore className="text-[#D97706] text-2xl" />,
      Parque: <FaTree className="text-[#15803D] text-2xl" />,
      Planta: <FaIndustry className="text-[#6B7280] text-2xl" />,
      Puente: <FaBridge className="text-[#065F46] text-2xl" />,
      Puerto: <FaShip className="text-[#EC4899] text-2xl" />,
      Represa: <FaCloudRain className="text-[#9333EA] text-2xl" />,
      "Terminal de transporte": (
        <FaTruckMoving className="text-[#F59E0B] text-2xl" />
      ),
      Tunel: <FaRoad className="text-[#4B5563] text-2xl" />,
      Universidad: <FaLandmark className="text-[#EAB308] text-2xl" />,
    };
    return (
      iconMap[obraType] || <FaBuilding className="text-gray-400 text-2xl" />
    );
  };

  return (
    <MapContext.Provider value={contextValue}>
      <div style={{ ...containerStyle, width, height }}>
        <Map
          mapboxAccessToken={token}
          {...viewState}
          onMove={handleMove}
          style={{ width: "100%", height: "100%" }}
          mapStyle={mapStyle}
          onLoad={handleMapLoad}
          onClick={onClick}
          onZoom={handleMapLoad}
          dragPan={true}
          dragRotate={true}
          scrollZoom={true}
          doubleClickZoom={false}
          touchZoomRotate={true}
          logoPosition="top-right"
        >
          <NavigationControl position="bottom-right" style={navControlStyle} />
          {children}
        </Map>

        {markers &&
          markerPositions.map((pos) => (
            <div
              key={pos.id}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
              }}
            >
              <div onClick={() => setIdobra?.(pos.id)}>
                {getIconByObraType(pos.obraType)}
              </div>
            </div>
          ))}
      </div>
    </MapContext.Provider>
  );
};

export default MapProvider;
