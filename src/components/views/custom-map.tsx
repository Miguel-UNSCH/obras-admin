"use client";

import { useEffect, useState, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { NavigationControl, ViewState } from "react-map-gl";
import LocationObras from "./location-works";

interface Obras {
  id: string;
  state: string;
  cui: string;
  name: string;
  points: [number, number][];
  areaOrLength: string | null;
  resident: string;
  projectType: string;
  propietario_id: string;
}

type ObrasProps = {
  obrasT: Obras[];
  defaultLocation: UserLocation;
};

interface UserLocation {
  latitude: number;
  longitude: number;
}

function CustomMap({ obrasT, defaultLocation }: ObrasProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const [styleLoaded, setStyleLoaded] = useState(false);

  const [viewState, setViewState] = useState<ViewState>({
    latitude: defaultLocation.latitude,
    longitude: defaultLocation.longitude,
    zoom: 14,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setViewState((prevState) => ({
      ...prevState,
      latitude: defaultLocation.latitude,
      longitude: defaultLocation.longitude,
      transitionDuration: 1000,
      transitionEasing: (t: number) => t,
    }));
  }, [defaultLocation]);

  useEffect(() => {
    if (mapContainerRef.current) {
      const { width, height } = mapContainerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });
    }
  }, []);

  const handleStyleLoad = () => {
    setStyleLoaded(true);
  };

  return (
    <div ref={mapContainerRef} className="w-full h-full">
      <Map
        mapboxAccessToken={token}
        viewState={{
          ...viewState,
          width: containerSize.width,
          height: containerSize.height,
        }}
        onMove={(evt) => setViewState(evt.viewState)}
        attributionControl={false}
        mapStyle={"mapbox://styles/mapbox/standard"}
        onLoad={handleStyleLoad}
        logoPosition="top-right"
      >
        {styleLoaded && (
          <>
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
            {obrasT.map((obra, index) => (
              <LocationObras key={index} obra={obra} />
            ))}
          </>
        )}
      </Map>
    </div>
  );
}

export default CustomMap;
