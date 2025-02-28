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
  const [obraseleccionada, setObraSeleccionada] = useState<obra>();
  const router = useRouter();

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

  return (
    <div className="relative h-full w-full">
      <MapProvider
        defaultLocation={defaultLocation}
        markers={markers}
        setIdobra={setIdobra}
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
            <DrawerTitle>
            </DrawerTitle>
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
              <Button className="border-border"
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
