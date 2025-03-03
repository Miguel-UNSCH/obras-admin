/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import MapProvider, {
  UserLocation,
  MarkerData,
} from "@/components/MapProvider";
import LocationObras from "@/components/views/location-works";
import calculateHalfwayPoint from "@/utils/midPoint";
import MarkerOverlay from "../MarkerOverlay";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../buttons/button";
import { ObraDetails } from "../details/obraDetails";
import MapStylePreview from "../maps/map-style";

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

interface obrasProps {
  obrasT: obra[];
  defaultLocation: UserLocation;
}

function CustomMap({ obrasT, defaultLocation }: obrasProps) {
  const [idobra, setIdobra] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedStyle, setSelectedStyle] = useState(
    "mapbox://styles/mapbox/standard"
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [obraseleccionada, setObraSeleccionada] = useState<obra>();
  const [enableTerrain, setEnableTerrain] = useState(false);
  const router = useRouter();

  // Estilos de mapa disponibles
  const styles = [
    {
      label: "Animado",
      url: "mapbox://styles/mapbox/standard",
      terrain: false,
    },
    {
      label: "Satelital",
      url: "mapbox://styles/mapbox/satellite-streets-v12",
      terrain: true,
    },
    {
      label: "Relieve",
      url: "mapbox://styles/mapbox/outdoors-v11",
      terrain: true,
    },
  ];

  // Efecto para manejar el cambio de estilo y activar/desactivar el terreno
  useEffect(() => {
    const currentStyleObj = styles.find((s) => s.url === selectedStyle);
    if (currentStyleObj) {
      setEnableTerrain(currentStyleObj.terrain);
    }
  }, [selectedStyle]);

  useEffect(() => {
    if (idobra) {
      const obra = obrasT.find((centinela) => centinela.id === idobra);
      setObraSeleccionada(obra);
      setIsDrawerOpen(true);
    }
  }, [idobra]);

  const markers: MarkerData[] = obrasT.map((result) => {
    const { latitude, longitude } = calculateHalfwayPoint(
      result.points,
      result.projectType
    );
    return {
      id: result.id,
      obraType: result.obraType,
      latitude,
      longitude,
    };
  });

  const handleDetallesClick = () => {
    if (idobra) {
      router.push(`/dashboard/detalles/${idobra}`);
    }
  };

  // Obtenemos el objeto del estilo seleccionado para mostrar su etiqueta
  const selectedStyleObj =
    styles.find((s) => s.url === selectedStyle) || styles[0];

  return (
    <div className="relative h-full w-full">
      {/* Contenedor para la selección de estilo (dropdown) */}
      <div
        className="absolute z-10"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: 8,
        }}
      >
        {!dropdownOpen ? (
          <div onClick={() => setDropdownOpen(true)}>
            <MapStylePreview
              key="selected"
              styleUrl={selectedStyleObj.url}
              name={selectedStyleObj.label}
              isActive={true}
              onSelect={() => {}}
              defaultLocation={defaultLocation}
            />
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            {styles.map((style, index) => (
              <MapStylePreview
                key={index}
                styleUrl={style.url}
                name={style.label}
                isActive={selectedStyle === style.url}
                onSelect={() => {
                  setSelectedStyle(style.url);
                  setDropdownOpen(false);
                }}
                defaultLocation={defaultLocation}
              />
            ))}
          </div>
        )}
      </div>
      <MapProvider
        defaultLocation={defaultLocation}
        markers={markers}
        setIdobra={setIdobra}
        mapStyle={selectedStyle}
        enableTerrain={enableTerrain}
      >
        <MarkerOverlay markers={markers} />
        {obrasT.map((obra, index) => (
          <LocationObras key={index} obra={obra} />
        ))}
      </MapProvider>

      <Drawer
        open={isDrawerOpen}
        onOpenChange={(isOpen) => {
          setIsDrawerOpen(isOpen);
          if (!isOpen) {
            setIdobra("");
            setObraSeleccionada(undefined);
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>
            <ObraDetails obra={obraseleccionada} />
          </DrawerHeader>

          <DrawerFooter className="flex justify-end space-x-2">
            <Button
              className="bg-green-700 hover:bg-green-600 z-50"
              onClick={handleDetallesClick}
            >
              Detalles
            </Button>
            <DrawerClose asChild>
              <Button
                className="border-border"
                variant="outline"
                onClick={() => {
                  setIsDrawerOpen(false);
                  setIdobra("");
                  setObraSeleccionada(undefined);
                }}
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default CustomMap;
